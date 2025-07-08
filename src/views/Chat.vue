<template>
  <div class="chat-container">
  <!-- 左侧会话列表 -->
  <aside class="chat-sidebar" :class="{ 'collapsed': isSidebarCollapsed }">
    <div class="sidebar-header">
      <h2>对话列表</h2>
      <button class="toggle-sidebar" @click="isSidebarCollapsed = !isSidebarCollapsed">
        {{ isSidebarCollapsed ? '→' : '←' }}
      </button>
    </div>
    <div class="new-chat-btn-container">
      <button class="new-chat-btn" @click="startNewChat">+ 新对话</button>
    </div>
    <div class="history-list">
      <div class="history-item" v-for="session in historySessions" :key="session.id" @click="loadSession(session.id)" :class="{ 'active': session.id === activeSessionId }">
        <div class="session-info">
          <h4>{{ session.title }}</h4>
          <p>{{ session.lastMessage }}</p>
        </div>
        <div class="session-date">{{ session.date }}</div>
      </div>
    </div>
  </aside>

  <!-- 主内容区域 -->
  <main class="chat-main">
    <!-- 聊天头部 -->
    <header class="chat-header">
        <div class="agent-info">
          <img :src="aiAvatar" alt="当前智能体" class="agent-avatar">
          <div class="agent-name">{{ currentAgentName }}</div>
        </div>
      <div class="back-btn" @click="goBack">&lt;</div>
      <div class="header-content">
        <h2>AI聊天助手</h2>
        <div class="agent-selector">
          <select v-model="selectedAgent" @change="changeAgent">
            <option v-for="agent in agents" :key="agent.id" :value="agent.id">{{ agent.name }}</option>
          </select>
        </div>
      </div>
      <div class="header-actions">
        <button class="new-chat-btn" @click="startNewChat">+ 新对话</button>
        <button class="delete-chat-btn" @click="deleteCurrentChat">🗑️</button>
      </div>
    </header>

    <!-- 聊天内容区域 -->
    <div class="chat-toolbar">
          <button class="toolbar-btn" title="上传文件"><i>📎</i></button>
          <button class="toolbar-btn" title="图片生成"><i>🎨</i></button>
          <button class="toolbar-btn" title="语音输入"><i>🎤</i></button>
          <button class="toolbar-btn" title="设置"><i>⚙️</i></button>
        </div>
        <div class="chat-content">
      <!-- 未开始聊天状态 -->
      <div class="chat-not-started" v-if="currentStatus === 'not_started'">
        <div class="welcome-message">
          <img src="https://via.placeholder.com/80" alt="AI头像" class="ai-avatar">
          <h3>欢迎使用AI聊天助手</h3>
          <p>开始与智能AI对话，获取所需帮助</p>
          <button class="start-chat-btn" @click="startNewChat">开始聊天</button>
        </div>
      </div>

      <!-- 聊天历史状态 -->
      <div class="chat-history" v-if="currentStatus === 'history'">
        <h3>历史对话</h3>
        <div class="history-list">
          <div class="history-item" v-for="session in historySessions" :key="session.id" @click="loadSession(session.id)">
            <div class="session-info">
              <h4>{{ session.title }}</h4>
              <p>{{ session.lastMessage }}</p>
            </div>
            <div class="session-date">{{ session.date }}</div>
          </div>
        </div>
      </div>

      <!-- 聊天中状态 -->
      <div class="chat-messages" v-if="currentStatus === 'chatting'">
        <div class="message" v-for="msg in messages" :key="msg.id" :class="{ 'user-message': msg.role === 'user', 'ai-message': msg.role === 'ai' }">
          <div class="message-avatar">
            <img :src="msg.role === 'user' ? userAvatar : aiAvatar" alt="{{ msg.role }} avatar">
          </div>
          <div class="message-content">
            <div class="message-bubble">{{ msg.content }}</div>
            <div class="message-time">{{ msg.timestamp }}</div>
          </div>
        </div>
        <div class="typing-indicator" v-if="isTyping">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
    </div>

    <!-- 聊天输入区域 -->
    <div class="quick-questions" v-if="currentStatus === 'chatting'">
      <div class="quick-question" v-for="question in quickQuestions" :key="question.id" @click="sendQuickQuestion(question.content)">
        {{ question.content }}
      </div>
    </div>
    <div class="chat-input" v-if="currentStatus === 'chatting'">
      <textarea
        v-model="messageInput"
        placeholder="请输入消息..."
        @keydown.enter.exact.prevent="sendMessage"
        @keydown.enter.shift="handleShiftEnter"
      ></textarea>
      <button class="send-btn" @click="sendMessage" :disabled="!messageInput.trim()">发送</button>
    </div>

    <!-- 底部导航 -->
    <nav class="chat-nav">
      <button @click="switchStatus('chatting')" :class="{ 'active': currentStatus === 'chatting' }"><i>💬</i> 聊天</button>
      <button @click="switchStatus('history')" :class="{ 'active': currentStatus === 'history' }"><i>📜</i> 历史</button>
    </nav>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'Chat',
  setup() {
    const store = useStore();
    const router = useRouter();
    const messageInput = ref('');
    const isTyping = ref(false);

    // 从store获取状态
    const currentStatus = computed(() => store.state.chat.currentStatus);
    const messages = computed(() => store.state.chat.messages);
    const historySessions = computed(() => store.state.chat.historySessions);
    const userAvatar = computed(() => store.state.user.userInfo.avatar);
    const selectedAgent = ref('default');
    const isSidebarCollapsed = ref(false);
    const activeSessionId = ref(null);
    const currentAgentName = computed(() => {
      const agent = agents.value.find(a => a.id === selectedAgent.value);
      return agent ? agent.name : 'AI助手';
    });
    const agents = ref([
      { id: 'default', name: '通用AI助手', avatar: 'https://via.placeholder.com/40/409eff/ffffff?text=AI' },
      { id: 'painter', name: '绘画助手', avatar: 'https://via.placeholder.com/40/f56c6c/ffffff?text=🎨' },
      { id: 'teacher', name: '作业批改助手', avatar: 'https://via.placeholder.com/40/67c23a/ffffff?text=📝' }
    ]);
    const aiAvatar = computed(() => {
      const agent = agents.value.find(a => a.id === selectedAgent.value);
      return agent ? agent.avatar : 'https://via.placeholder.com/40/409eff/ffffff?text=AI';
    });
    const quickQuestions = ref([
      { id: 1, content: '如何使用AI绘画功能？' },
      { id: 2, content: '帮我写一篇关于环保的短文' },
      { id: 3, content: '解释一下量子计算的基本原理' },
      { id: 4, content: '推荐几部经典科幻电影' }
    ]);
    const changeAgent = () => {
      // 切换智能体时的逻辑
      startNewChat();
    };
    const sendQuickQuestion = (content) => {
      messageInput.value = content;
      sendMessage();
    };

    // 切换聊天状态
    const switchStatus = (status) => {
      store.commit('setChatStatus', status);
    };

    // 开始新对话
    const startNewChat = () => {
      store.commit('clearCurrentChat');
      store.commit('setChatStatus', 'chatting');
      // 添加欢迎消息
      store.commit('addChatMessage', {
        id: Date.now(),
        role: 'ai',
        content: '您好！我是DeepSeek AI助手，有什么可以帮助您的吗？',
        timestamp: new Date().toLocaleString()
      });
    };

    // 发送消息
    const sendMessage = async () => {
      const content = messageInput.value.trim();
      if (!content) return;

      isTyping.value = true;
      messageInput.value = '';

      try {
        await store.dispatch('sendMessage', content);
      } finally {
        isTyping.value = false;
      }
    };

    // 处理Shift+Enter换行
    const handleShiftEnter = () => {
      messageInput.value += '\n';
    };

    // 加载历史会话
    const loadSession = (sessionId) => {
      // 模拟加载历史会话
      store.commit('clearCurrentChat');
      store.commit('setChatStatus', 'chatting');
      store.commit('addChatMessage', {
        id: Date.now(),
        role: 'ai',
        content: `这是加载的历史会话 ${sessionId} 的内容。`,
        timestamp: new Date().toLocaleString()
      });
    };

    // 返回个人中心
    const goBack = () => {
      router.push('/personal-center');
    };

    return {
      messageInput,
      isTyping,
      currentStatus,
      messages,
      historySessions,
      userAvatar,
      aiAvatar,
      switchStatus,
      startNewChat,
      sendMessage,
      handleShiftEnter,
      loadSession,
      goBack
    };
  }
};
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 100vh;
  background-color: #f5f7fa;
}

.chat-sidebar {
  width: 300px;
  background-color: white;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  overflow: hidden;
}

.chat-sidebar.collapsed {
  width: 60px;
}

.sidebar-header {
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toggle-sidebar {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #606266;
}

.new-chat-btn-container {
  padding: 15px;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.agent-info {
  display: flex;
  align-items: center;
  margin-right: 15px;
}

.agent-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
}

.agent-name {
  font-weight: 500;
  color: #303133;
}

.chat-toolbar {
  display: flex;
  padding: 10px 15px;
  background-color: white;
  border-bottom: 1px solid #f0f0f0;
  gap: 10px;
}

.toolbar-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background-color: #f5f7fa;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.toolbar-btn:hover {
  background-color: #e4e7ed;
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header-content {
  flex: 1;
  margin: 0 15px;
}

.agent-selector select {
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  background-color: white;
  margin-top: 5px;
}

.delete-chat-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #606266;
  margin-left: 10px;
}

.quick-questions {
  padding: 15px;
  background-color: white;
  border-bottom: 1px solid #f0f0f0;
}

.quick-question {
  display: inline-block;
  padding: 6px 12px;
  background-color: #f5f7fa;
  border-radius: 16px;
  margin: 0 8px 8px 0;
  font-size: 14px;
  color: #303133;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-question:hover {
  background-color: #e4e7ed;
}

.back-btn {
  font-size: 20px;
  cursor: pointer;
  margin-right: 15px;
  color: #606266;
}

.chat-header h2 {
  flex: 1;
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.new-chat-btn {
  padding: 6px 12px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.chat-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.chat-not-started {
  text-align: center;
}

.ai-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 20px;
}

.welcome-message h3 {
  margin: 0 0 10px 0;
  font-size: 24px;
  color: #303133;
}

.welcome-message p {
  color: #909399;
  margin-bottom: 30px;
}

.start-chat-btn {
  padding: 10px 20px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.chat-history {
  width: 100%;
}

.chat-history h3 {
  text-align: left;
  margin-bottom: 20px;
  color: #303133;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.history-item.active {
  background-color: #ecf5ff;
  border-left: 4px solid #409eff;
}

.history-item:hover {
  background-color: #f5f7fa;
}

.session-info h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #303133;
}

.session-info p {
  margin: 0;
  font-size: 14px;
  color: #909399;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

.session-date {
  color: #c0c4cc;
  font-size: 14px;
}

.chat-messages {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message {
  display: flex;
  max-width: 80%;
}

.user-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.message-content {
  margin: 0 10px;
  max-width: calc(100% - 60px);
}

.message-bubble {
  padding: 12px 18px;
  border-radius: 18px;
  word-wrap: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.ai-message .message-bubble {
  background-color: white;
  border: 1px solid #f0f0f0;
  border-top-left-radius: 4px;
}

.user-message .message-bubble {
  background-color: #409eff;
  color: white;
  border-top-right-radius: 4px;
}

.ai-message .message-bubble {
  background-color: white;
  border: 1px solid #e5e9f2;
  border-top-left-radius: 4px;
}

.user-message .message-bubble {
  background-color: #409eff;
  color: white;
  border-top-right-radius: 4px;
}

.message-time {
  font-size: 12px;
  color: #c0c4cc;
  margin-top: 5px;
  text-align: right;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px 15px;
  background-color: white;
  border-radius: 18px;
  border-top-left-radius: 4px;
  align-self: flex-start;
}

.dot {
  width: 8px;
  height: 8px;
  background-color: #c0c4cc;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.chat-input {
  display: flex;
  padding: 15px;
  background-color: white;
  border-top: 1px solid #e5e9f2;
}

.chat-input textarea {
  flex: 1;
  border: 1px solid #e5e9f2;
  border-radius: 4px;
  padding: 10px;
  resize: none;
  height: 60px;
  font-size: 14px;
  outline: none;
}

.chat-input textarea:focus {
  border-color: #409eff;
}

.send-btn {
  margin-left: 10px;
  padding: 0 20px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.send-btn:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}

.chat-nav {
  display: flex;
  background-color: white;
  border-top: 1px solid #e5e9f2;
}

.chat-nav button {
  flex: 1;
  padding: 15px 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #909399;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.chat-nav button i {
  font-size: 20px;
}

.chat-nav button.active {
  color: #409eff;
}
</style>