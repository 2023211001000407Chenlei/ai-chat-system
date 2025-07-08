<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo">
        <div class="logo-icon">🤖</div>
        <h1>AI智周万物</h1>
        <p class="slogan">智能对话，高效助手</p>
      </div>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
            type="text"
            id="username"
            v-model="username"
            required
            placeholder="请输入用户名"
          />
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="请输入密码"
          />
        </div>
        <button type="submit" class="login-btn">登录</button>
      </form>
      <div class="error-message" v-if="errorMsg">{{ errorMsg }}</div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'Login',
  setup() {
    const store = useStore();
    const router = useRouter();
    const username = ref('');
    const password = ref('');
    const errorMsg = ref('');

    const handleLogin = async () => {
      if (!username.value || !password.value) {
        errorMsg.value = '请输入用户名和密码';
        return;
      }

      try {
        console.log('登录参数:', { username: username.value, password: password.value });
        const success = await store.dispatch('login', {
          username: username.value,
          password: password.value
        });
        console.log('登录结果:', success);
        if (success) {
          console.log('准备跳转至个人中心');
          router.push('/personal-center');
        }
      } catch (err) {
        errorMsg.value = '登录失败，请检查用户名和密码';
      }
    };

    return {
      username,
      password,
      errorMsg,
      handleLogin
    };
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.login-card {
  width: 420px;
  padding: 40px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
}

.logo {
  text-align: center;
  margin-bottom: 35px;
}

.logo-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.slogan {
  font-size: 14px;
  color: #909399;
  margin: 5px 0 0 0;
}

.logo h1 {
  color: #409eff;
  font-size: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #606266;
  text-align: left;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus {
  outline: none;
  border-color: #409eff;
}

.login-btn {
  width: 100%;
  padding: 14px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.login-btn:hover {
  background-color: #337ecc;
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.3);
}

.login-btn:hover {
  background-color: #337ecc;
}

.error-message {
  color: #f56c6c;
  margin-top: 15px;
  font-size: 14px;
}
</style>