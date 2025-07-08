<template>
  <div class="personal-center">
    <header class="header">
      <div class="user-info">
        <img :src="userInfo.avatar" alt="用户头像" class="avatar">
        <div class="info">
          <h2>{{ userInfo.username }}</h2>
          <p>{{ userInfo.email }}</p>
        </div>
      </div>
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </header>

    <main class="content">
      <div class="section-title">常用功能</div>
      <div class="card-grid">
        <div class="card" @click="goToChat">
          <div class="card-icon">💬</div>
          <div class="card-content">
            <h3>AI聊天助手</h3>
            <p>开始与智能AI进行对话</p>
          </div>
          <div class="card-arrow">→</div>
        </div>

        <div class="card">
          <div class="card-icon">🎨</div>
          <div class="card-content">
            <h3>创意中心</h3>
            <p>AI绘画与创意生成</p>
          </div>
          <div class="card-arrow">→</div>
        </div>
      </div>

      <div class="section-title">学习工具</div>
      <div class="card-grid">
        <div class="card">
          <div class="card-icon">✏️</div>
          <div class="card-content">
            <h3>作业批改</h3>
            <p>AI智能批改作业</p>
          </div>
          <div class="card-arrow">→</div>
        </div>

        <div class="card">
          <div class="card-icon">📚</div>
          <div class="card-content">
            <h3>历史记录</h3>
            <p>查看历史创作内容</p>
          </div>
          <div class="card-arrow">→</div>
        </div>
      </div>

      <div class="section-title">账户管理</div>
      <div class="card-grid">
        <div class="card">
          <div class="card-icon">⚙️</div>
          <div class="card-content">
            <h3>账号设置</h3>
            <p>修改个人信息和密码</p>
          </div>
          <div class="card-arrow">→</div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'PersonalCenter',
  setup() {
    const store = useStore();
    const router = useRouter();

    const userInfo = computed(() => store.state.user.userInfo);

    const handleLogout = () => {
      store.dispatch('logout');
      router.push('/login');
    };

    const goToChat = () => {
      router.push('/chat');
    };

    return {
      userInfo,
      handleLogout,
      goToChat
    };
  }
};
</script>

<style scoped>
.personal-center {
  height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 15px;
  object-fit: cover;
}

.info h2 {
  margin: 0 0 5px 0;
  font-size: 18px;
  color: #303133;
}

.info p {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.logout-btn {
  padding: 8px 16px;
  background-color: #f56c6c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.section-title {
  font-size: 14px;
  color: #909399;
  margin: 25px 0 10px 15px;
  text-align: left;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
}

.content {
  padding: 0 10px;
}

.card {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}

.card-icon {
  font-size: 24px;
  margin-right: 15px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #ecf5ff;
  color: #409eff;
}

.card-content {
  flex: 1;
  text-align: left;
}

.card-content h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #303133;
}

.card-content p {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.card-arrow {
  color: #c0c4cc;
  font-size: 18px;
}
</style>