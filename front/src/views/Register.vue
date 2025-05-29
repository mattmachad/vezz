<template>
  <div class="login-container">
    <div class="login-left">
      <router-link to="/"><img class="icon arrow" alt="Buscar" src="@/assets/chevron_backward.svg" /></router-link>
    </div>
    <div class="login-right">
      <div class="form-box">
        <h1 class="logo">VEZZ</h1>
        <h2>Crie a sua conta</h2>
        <p class="sub">Entre no mundo do luxo acessível.</p>

        <form @submit.prevent="handleSubmit">
          <input v-model="form.nome" type="text" placeholder="Nome" required />
          <input v-model="form.email" type="email" placeholder="Email" required />
          <input v-model="form.senha" type="password" placeholder="Senha" required />
          <button type="submit" :disabled="loading">
            {{ loading ? 'CRIANDO...' : 'CRIAR CONTA' }}
          </button>
        </form>

        <p class="login-link">
          Já tem uma conta? <router-link to="/login">Faça login</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()
const form = ref({
  nome: '',
  email: '',
  senha: ''
})
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    // Validar campos obrigatórios
    if (!form.value.nome.trim()) {
      throw new Error('Nome é obrigatório')
    }
    if (!form.value.email.trim()) {
      throw new Error('Email é obrigatório')
    }
    if (!form.value.senha.trim() || form.value.senha.length < 6) {
      throw new Error('Senha é obrigatória e deve ter pelo menos 6 caracteres')
    }

    // Monta o payload com campos obrigatórios
    const payload = {
      name: form.value.nome.trim(),
      email: form.value.email.trim().toLowerCase(),
      password: form.value.senha,
      is_admin: false
    }

    console.log('Enviando dados para registro:', {
      ...payload,
      password: '[REDACTED]'
    })

    const response = await fetch('http://localhost:3003/users', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    })

    const data = await response.json()
    console.log('Resposta do servidor:', data)
    
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao registrar')
    }

    toast.success('Conta criada com sucesso!')
    router.push('/login')
  } catch (err: any) {
    console.error('Erro detalhado:', err)
    error.value = err.message
    toast.error(error.value || 'Erro ao criar conta')
  } finally {
    loading.value = false
  }
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
  font-size: 24px;
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
}

button {
  width: 100%;
  background-color: black;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
}

button:disabled {
  background-color: #666;
  cursor: not-allowed;
}

button:not(:disabled):hover {
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
