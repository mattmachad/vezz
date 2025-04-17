<template>
  <header class="header">
    <div class="container">
      <img class="nav-icon" alt="Logo VEZZ" src="@/assets/vezz-logo.png" />

      <nav class="main-menu">
        <a href="#" class="nav-link">CATÁLOGO</a>
        <a href="#" class="nav-link">LOOKBOOK</a>
        <a href="#" class="nav-link">SOBRE</a>
      </nav>

      <div class="icons">
        <img class="icon" alt="Buscar" src="@/assets/search.svg" />
        <img class="icon" alt="Favoritos" src="@/assets/favorite.svg" />
        <img class="icon" alt="Conta" src="@/assets/account_circle.svg" />
        <img class="icon" alt="Carrinho" src="@/assets/shopping_bag.svg" />
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.header {
  width: 100%;
  background-color: #fff;
  box-shadow:
    0px 240px 67px rgba(0, 0, 0, 0),
    0px 154px 61px rgba(0, 0, 0, 0.02),
    0px 86px 52px rgba(0, 0, 0, 0.08),
    0px 38px 38px rgba(0, 0, 0, 0.13),
    0px 10px 21px rgba(0, 0, 0, 0.15);
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
</style>
