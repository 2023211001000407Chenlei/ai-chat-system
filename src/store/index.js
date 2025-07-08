import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    user: {
      isLoggedIn: false,
      userInfo: {
        username: 'testUser',
        avatar: 'https://via.placeholder.com/40',
        email: 'test@example.com'
      }
    },
    chat: {
      currentStatus: 'not_started', // not_started, chatting, history
      messages: [
        {
          id: 1,
          role: 'ai',
          content: '您好！我是DeepSeek AI助手，有什么可以帮助您的吗？',
          timestamp: '2023-10-01 09:00:00'
        }
      ],
      historySessions: [
        {
          id: 'session1',
          title: '日常咨询',
          date: '2023-09-28',
          lastMessage: '感谢您的帮助！'
        },
        {
          id: 'session2',
          title: '技术问题',
          date: '2023-09-25',
          lastMessage: '这个问题已经解决了'
        }
      ]
    }
  },
  mutations: {
    setLoginStatus(state, status) {
      state.user.isLoggedIn = status;
    },
    updateUserInfo(state, info) {
      state.user.userInfo = { ...state.user.userInfo, ...info };
    },
    setChatStatus(state, status) {
      state.chat.currentStatus = status;
    },
    addChatMessage(state, message) {
      state.chat.messages.push(message);
    },
    clearCurrentChat(state) {
      state.chat.messages = [];
    }
  },
  actions: {
    login({ commit }, userData) {
      // 模拟登录接口调用
      return new Promise(resolve => {
        setTimeout(() => {
          commit('setLoginStatus', true);
          commit('updateUserInfo', userData);
          resolve(true);
        }, 500);
      }); 
    },
    logout({ commit }) {
      commit('setLoginStatus', false);
    },
    sendMessage({ commit }, content) {
      // 调用DeepSeekR1 API发送消息
      return new Promise(async (resolve, reject) => {
        // 用户消息
        const userMessage = {
          id: Date.now(),
          role: 'user',
          content: content,
          timestamp: new Date().toLocaleString()
        };
        commit('addChatMessage', userMessage);
        commit('setChatStatus', 'chatting');

        try {
          // 实际API调用（请替换为DeepSeekR1的真实接口地址）
          const response = await axios.post('https://api.deepseek.com/r1/chat/completions', {
            model: 'deepseek-r1',
            messages: [{
              role: 'user',
              content: content
            }]
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer YOUR_API_KEY' // 请替换为您的API密钥
            }
          });

          // 处理API响应
          const aiMessage = {
            id: Date.now() + 1,
            role: 'ai',
            content: response.data.choices[0].message.content,
            timestamp: new Date().toLocaleString()
          };
          commit('addChatMessage', aiMessage);
          resolve(aiMessage);
        } catch (error) {
          console.error('DeepSeekR1 API调用失败:', error);
          const errorMessage = {
            id: Date.now() + 1,
            role: 'ai',
            content: '抱歉，无法连接到AI服务，请稍后再试。',
            timestamp: new Date().toLocaleString()
          };
          commit('addChatMessage', errorMessage);
          reject(error);
        }
      });
    }
  },
  getters: {} // 确保getters部分存在，并且没有多余的逗号
}) // 确保只有一个闭合括号