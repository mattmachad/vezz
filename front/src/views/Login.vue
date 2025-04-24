<template>
    <div class="login-container">
      <div class="login-left">
        <router-link to="/"><img class="icon arrow" alt="Buscar" src="@/assets/chevron_backward.svg" /></router-link>
      </div>
      <div class="login-right">
        <div class="form-box">
          <h1 class="logo">VEZZ</h1>
          <h2>Faça login com sua conta</h2>
          <p class="sub">Entre no mundo do luxo acessível.</p>
  
          <form @submit.prevent="handleLogin">
            <input v-model="email" type="email" placeholder="Email" required />
            <input v-model="senha" type="password" placeholder="Senha" required />
            <button type="submit">ENTRAR</button>
          </form>
  
          <p class="login-link">
            Não tem uma conta? <a href="/register">Crie agora</a>
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const email = ref('')
  const senha = ref('')
  
  function handleLogin() {
    console.log('Login:', { email: email.value, senha: senha.value })
  }
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    min-height: 100vh;
    font-family: Arial, sans-serif;
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
  }
  
  .form-box {
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


  </style>
  