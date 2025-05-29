<template>
    <div class="login-container">
      <div class="login-left">
        <router-link to="/"><img class="icon arrow" alt="Buscar" src="@/assets/chevron_backward.svg" /></router-link>
      </div>
      <div class="login-right">
        <div class="form-box" v-if="!authStore.isLoggedIn">
          <h1 class="logo">VEZZ</h1>
          <h2>Faça login com sua conta</h2>
          <p class="sub">Entre no mundo do luxo acessível.</p>
  
          <form @submit.prevent="handleLogin">
            <input v-model="email" type="email" placeholder="Email" required />
            <input v-model="senha" type="password" placeholder="Senha" required />
            <p v-if="error" class="error">{{ error }}</p>
            <button type="submit">ENTRAR</button>
          </form>
  
          <p class="login-link">
            Não tem uma conta? <router-link to="/register">Crie agora</router-link>
          </p>
        </div>
        
        <div class="profile-box" v-else>
          <h1 class="logo">VEZZ</h1>
          <div class="profile-info">
            <div class="profile-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <h2>Bem-vindo(a), {{ authStore.user?.name }}!</h2>
            <p class="email">{{ authStore.user?.email }}</p>
          </div>
          
          <div class="profile-actions">
            <button class="profile-btn" @click="goToOrders">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              <span>Meus Pedidos</span>
            </button>
            
            <button class="profile-btn" @click="goToWishlist">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>Favoritos</span>
            </button>
            
            <button class="logout-btn" @click="handleLogout">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useToast } from 'vue-toastification'
  import { useAuthStore } from '@/stores/auth'
  
  const toast = useToast()
  const router = useRouter()
  const authStore = useAuthStore()
  const email = ref('')
  const senha = ref('')
  const error = ref('')
  
  interface LoginResponse {
    user: {
      id: number;
      name: string;
      email: string;
    };
    message?: string;
  }
  
  async function handleLogin() {
    error.value = ''
    try {
      const response = await fetch('http://localhost:3003/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email.value,
          password: senha.value
        })
      })
  
      const data: LoginResponse = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login')
      }
  
      // Store user data in auth store
      authStore.login(data.user)
      
      toast.success('Login realizado com sucesso!')
      // Redirect to home page after successful login
      router.push('/')
    } catch (err: any) {
      error.value = err.message
      toast.error('Email ou senha incorretos')
    }
  }
  
  function handleLogout() {
    authStore.logout()
    toast.success('Logout realizado com sucesso!')
    router.push('/')
  }
  
  function goToOrders() {
    router.push('/orders')
  }
  
  function goToWishlist() {
    router.push('/wishlist')
  }
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    min-height: 100vh;
    font-family: Arial, sans-serif;
    background: #fff;
    color: #212121;
  }
  
  .login-left {
    flex: 1;
    background-image: url('@/assets/login_and_register.png');
    background-size: cover;
    background-position: center;
  }
  
  .login-right {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    color: #212121;
  }
  
  .form-box, .profile-box {
    width: 100%;
    max-width: 400px;
  }
  
  .logo {
    font-family: 'Georgia', serif;
    font-size: 36px;
    margin-bottom: 24px;
  }
  
  h2 {
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 8px;
  }
  
  .sub {
    font-size: 14px;
    color: #555;
    margin-bottom: 24px;
  }
  
  form input {
    width: 100%;
    padding: 10px;
    margin-bottom: 16px;
    border: none;
    border-bottom: 1px solid #ccc;
    outline: none;
    font-size: 14px;
  }
  
  button {
    width: 100%;
    background-color: black;
    color: white;
    padding: 10px;
    border: none;
    cursor: pointer;
    font-weight: bold;
  }
  
  button:hover {
    background-color: #333;
  }
  
  .login-link {
    margin-top: 16px;
    font-size: 13px;
    text-align: center;
  }
  
  .login-link a {
    text-decoration: none;
    color: black;
    font-weight: bold;
  }

  .arrow {
    margin-left: 3vh;
    margin-top: 3vh;
    width: 32px;
    height: 32px;

  }

  .error {
    color: red;
    font-size: 14px;
    margin-bottom: 16px;
    text-align: center;
  }
  
  /* Profile Styles */
  .profile-info {
    text-align: center;
    margin-bottom: 32px;
  }
  
  .profile-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 16px;
    background: #f0f0f0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .profile-icon svg {
    width: 48px;
    height: 48px;
    color: #666;
  }
  
  .email {
    color: #666;
    font-size: 14px;
  }
  
  .profile-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .profile-btn, .logout-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 12px 24px;
    border-radius: 8px;
    transition: all 0.2s;
  }
  
  .profile-btn {
    background: #f0f0f0;
    color: #333;
  }
  
  .profile-btn:hover {
    background: #e0e0e0;
  }
  
  .logout-btn {
    background: #dc3545;
    color: white;
    margin-top: 24px;
  }
  
  .logout-btn:hover {
    background: #c82333;
  }
  
  .profile-btn svg, .logout-btn svg {
    width: 20px;
    height: 20px;
  }

  </style>
  