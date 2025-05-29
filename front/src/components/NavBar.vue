<template>
  <header class="header">
    <div class="container">
      <router-link to="/"><img class="nav-icon" alt="Logo VEZZ" src="@/assets/vezz-logo.png" /></router-link>

      <nav class="main-menu">
        <router-link to="/products" class="nav-link">CATÁLOGO</router-link>
        <a href="#" class="nav-link">LOOKBOOK</a>
        <a href="#" class="nav-link">SOBRE</a>
      </nav>

      <div class="icons">
        <router-link to="/"><img class="icon" alt="Buscar" src="@/assets/search.svg" /></router-link>
        <router-link to="/"><img class="icon" alt="Favoritos" src="@/assets/favorite.svg" /></router-link>
        <router-link to="/login"><img class="icon" alt="Conta" src="@/assets/account_circle.svg" /></router-link>
        <router-link to="/checkout" class="cart-link">
          <img class="icon" alt="Carrinho" src="@/assets/shopping_bag.svg" />
          <span v-if="itemCount > 0" class="cart-badge">{{ itemCount }}</span>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import type { CartItem } from '@/stores/cart'

const cartStore = ref(useCartStore())

const itemCount = computed(() => {
  if (!cartStore.value?.items) return 0
  return cartStore.value.items.reduce((total: number, item: CartItem) => total + item.quantity, 0)
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.header {
  width: 100%;
  background-color: #fff;
  box-shadow: 0px 10px 21px rgba(0, 0, 0, 0.15);
  font-family: 'Roboto', sans-serif;
}

.container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-icon {
  width: 104px;
  height: auto;
}

.main-menu {
  display: flex;
  gap: 24px;
}

.nav-link {
  text-transform: uppercase;
  font-weight: 500;
  font-size: 14px;
  color: #212121;
  text-decoration: none;
  letter-spacing: 1.25px;
  transition: opacity 0.2s;
}

.nav-link:hover {
  opacity: 0.7;
}

.icons {
  display: flex;
  gap: 16px;
  align-items: center;
}

.icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.icon:hover {
  opacity: 0.6;
}

.cart-link {
  position: relative;
  display: inline-block;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #439cd3;
  color: white;
  border-radius: 50%;
  padding: 2px;
  min-width: 18px;
  height: 18px;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
</style>
