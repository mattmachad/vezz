<template>
    <footer class="bottom">
      <div class="contents">
        <div class="left">
          <a href="#" class="link">Contato</a>
          <router-link to="/about" class="link">Sobre</router-link>
          <a href="#" class="link">Termo de Uso</a>
        </div>
        <div class="right">
          <span class="copyright">© Vezz Store 2025</span>
        </div>
      </div>
    </footer>
  </template>
  
  <script lang="ts" setup>
  </script>
  
  <style scoped>
  .bottom {
    width: 100%;
    padding: 64px 0;
    font-family: Roboto, sans-serif;
    font-size: 16px;
    color: var(--text-color);
    background-color: var(--nav-bg);
    border-top: 1px solid var(--border-color);
    transition: background-color 0.3s, color 0.3s, border-color 0.3s;
  }
  
  .contents {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 72px;
    height: 44px;
    box-sizing: border-box;
  }
  
  .left {
    display: flex;
    gap: 24px;
  }
  
  .right {
    color: var(--text-color);
    opacity: 0.6;
    transition: color 0.3s;
  }
  
  .link {
    text-decoration: none;
    color: var(--text-color);
    letter-spacing: 1.25px;
    line-height: 44px;
    transition: opacity 0.2s, color 0.3s;
    opacity: 0.8;
  }
  
  .link:hover {
    opacity: 0.6;
  }
  </style>
  