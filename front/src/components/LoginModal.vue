<!-- Modal de Login -->
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <h2>Necessário estar logado na plataforma para fazer a compra.</h2>
          <div class="modal-buttons">
            <button class="login-btn" @click="goToLogin">
              Por favor, faça o login
            </button>
            <div class="register-text">
              Não está cadastrado? 
              <a href="#" @click.prevent="goToRegister">Cadastre-se</a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])
const router = useRouter()

const closeModal = () => {
  emit('close')
}

const goToLogin = () => {
  router.push('/login')
  closeModal()
}

const goToRegister = () => {
  router.push('/register')
  closeModal()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-color);
  padding: 32px;
  border-radius: 8px;
  max-width: 90%;
  width: 400px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

h2 {
  color: var(--text-color);
  font-size: 18px;
  margin-bottom: 24px;
  line-height: 1.4;
}

.modal-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}

.login-btn {
  background: #000;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s;
}

.login-btn:hover {
  background: #333;
}

.register-text {
  color: var(--text-secondary);
  font-size: 14px;
}

.register-text a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.register-text a:hover {
  text-decoration: underline;
}

/* Animações do modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content {
  animation: modal-in 0.3s ease-out;
}

.modal-leave-active .modal-content {
  animation: modal-in 0.3s ease-in reverse;
}

@keyframes modal-in {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 480px) {
  .modal-content {
    padding: 24px;
  }

  h2 {
    font-size: 16px;
  }

  .login-btn {
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style> 