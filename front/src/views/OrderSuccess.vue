<template>
  <div class="container">
    <div class="success-box">
      <div class="icon-wrapper">
        <img :class="$style.icon" alt="" src="../assets/shopping_cart_checkout.svg" />
      </div>
      <div class="text-content">
        <h2 class="title">
          Pedido feito com <span class="highlight">Sucesso!</span>
        </h2>
        <p class="order-id">
          ID do pedido: <strong>{{ orderId }}</strong>
        </p>
      </div>
    </div>

    <button class="back-button" @click="onVoltarContainerClick">
      <img class="chevron-icon" alt="Voltar" src="../assets/chevron_left.svg" />
      <span>Voltar</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const orderId = route.query.id ?? 'xxxxxxx';

function onVoltarContainerClick() {
  window.history.back();
}
</script>

<style module>
.icon {
  width: 100%;
  position: relative;
  border-radius: 248px;
  max-width: 100%;
  overflow: hidden;
  height: 144px;
  flex-shrink: 0;
}
</style>

<style scoped>
:root {
  --text-primary: #212121;
  --text-secondary: #757575;
  --accent-color: #2baeff;
  --bg-color: #ffffff;
  --icon-color: #000000;
}

:root.dark-mode {
  --text-primary: #ffffff;
  --text-secondary: #aaaaaa;
  --accent-color: #2baeff;
  --bg-color: #121212;
  --icon-color: #ffffff;
}

.container {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  font-family: Roboto, sans-serif;
  gap: 48px;
  background-color: var(--bg-color);
}

.success-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  text-align: center;
}

.icon-wrapper {
  width: 146.8px;
  height: 144px;
}

.icon-wrapper img {
  filter: var(--icon-filter);
}

.text-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 1.25px;
  margin: 0;
  color: var(--text-primary);
}

.highlight {
  color: var(--accent-color);
}

.order-id {
  font-size: 16px;
  color: var(--text-secondary);
  letter-spacing: 1.25px;
  margin: 0;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  background: none;
  color: var(--text-secondary);
  font-size: 16px;
  cursor: pointer;
  letter-spacing: 1.25px;
  transition: opacity 0.2s;
}

.back-button:hover {
  opacity: 0.8;
}

.chevron-icon {
  width: 24px;
  height: 24px;
  filter: var(--icon-filter);
}

@media (prefers-color-scheme: dark) {
  :root {
    --text-primary: #ffffff;
    --text-secondary: #aaaaaa;
    --bg-color: #121212;
    --icon-filter: invert(1);
  }
}

@media (prefers-color-scheme: light) {
  :root {
    --text-primary: #212121;
    --text-secondary: #757575;
    --bg-color: #ffffff;
    --icon-filter: none;
  }
}
</style>
