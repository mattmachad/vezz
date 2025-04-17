<template>
    <section class="celebrity-card">
      <img class="background-image" :src="backgroundImage" alt="Michael B. Jordan" />
      
      <div class="overlay-content">
        <p class="subtitle">Vista-se como</p>
        <h2 class="title">Michael B. Jordan</h2>
      </div>
  
      <img class="signature" :src="signatureImage" alt="Assinatura" />
    </section>
  </template>
  
  <script lang="ts" setup>
  import backgroundImage from '@/assets/mbj/zac-efron-michael-b-jordan-753 1.png'
  import signatureImage from '@/assets/mbj/signature.png' 
  </script>
  
  <style scoped>
  .celebrity-card {
  position: relative;
  width: 100%;
  max-width: 1340px; 
  margin: 0 auto; 
  overflow: hidden;
  border-radius: 4px;
  box-sizing: border-box;
    }

  
    .background-image {
        width: 100%;
        height: auto;
        object-fit: cover;
        display: block;
        border-radius: 4px;
    }

  
  .overlay-content {
    position: absolute;
    top: 20%;
    left: 64px;
    z-index: 2;
    color: white;
  }
  
  .subtitle {
    font-size: 24px;
    letter-spacing: 1.25px;
    line-height: 16px;
    font-weight: 500;
    font-family: Roboto, sans-serif;
    margin: 0;
  }
  
  .title {
    font-size: 64px;
    letter-spacing: 1.25px;
    line-height: 50px;
    font-weight: 500;
    font-family: 'Roboto Serif', serif;
    margin: 8px 0 0;
  }
  
  .signature {
    position: absolute;
    bottom: 24px;
    right: 32px;
    width: 40px;
    height: auto;
    z-index: 3;
  }
  </style>
  