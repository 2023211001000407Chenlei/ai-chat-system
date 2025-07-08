import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import PersonalCenter from '../views/PersonalCenter.vue'
import Chat from '../views/Chat.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/personal-center',
    name: 'PersonalCenter',
    component: PersonalCenter
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router