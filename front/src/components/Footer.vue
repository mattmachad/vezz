<template>
    <footer class="bottom">
      <div class="contents">
        <div class="left">
          <a href="#" class="link">Contato</a>
          <a href="#" class="link">Política de Privacidade</a>
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
    color: #000;
    background-color: #fff;
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
    color: #696969;
  }
  
  .link {
    text-decoration: none;
    color: inherit;
    letter-spacing: 1.25px;
    line-height: 44px;
    transition: opacity 0.2s;
  }
  
  .link:hover {
    opacity: 0.7;
  }
  </style>
  