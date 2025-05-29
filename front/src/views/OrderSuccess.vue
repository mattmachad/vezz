<template>
  <div class="success-screen">
    <div class="order-box">
      <div class="icon">🛒</div>
      <h2>Pedido feito com <span class="success">Sucesso!</span></h2>
      <p class="order-id">ID do pedido: <strong>{{ orderId }}</strong></p>
    </div>

    <button class="back-button" @click="voltar">‹ Voltar</button>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const orderId = route.query.id ?? 'xxxxxxx';

function voltar() {
  window.history.back();
}
</script>

<style scoped>
.success-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  border: 2px solid #007bff;
  position: relative;
  background-color: white;
  padding: 20px;
}

.order-box {
  text-align: center;
}

.icon {
  background-color: #00aaff;
  color: white;
  font-size: 40px;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.success {
  color: #00aaff;
}

.order-id {
  font-size: 14px;
  color: #777;
  margin-top: 8px;
}

.back-button {
  margin-top: 40px;
  color: #007bff;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
}
</style>
