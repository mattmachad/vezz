<template>
    <section class="cards-section">
      <h2 class="titulo">Ternos de Grife</h2>
  
      <div class="cards">
        <div 
          v-for="(product, index) in products" 
          :key="index" 
          class="produto"
          @click="goToProducts"
        >
          <div class="contents">
            <img class="foto" :src="product.image" :alt="product.name" />
  
            <div class="brand">
              <img class="vezz-logo" :src="vezzLogo" alt="Vezz logo" />
            </div>
  
            <div class="icons">
              <img class="icon favorite" :src="favoriteIcon" alt="Favoritar" />
              <img class="icon add" :src="addIcon" alt="Adicionar" />
            </div>
          </div>
  
          <div class="bottom">
            <div class="info">
              <div class="name">{{ product.name }}</div>
              <div class="price">R$ {{ product.price }}</div>
            </div>
            <div class="stock">
              <div class="quantity">{{ product.stock }} em estoque</div>
              <div class="sizes">
                <a href=""><span>P</span></a>
                <a href=""><span>M</span></a>
                <a href=""><span>G</span></a>
                <a href=""><span>GG</span></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botão Ver Todos -->
      <div class="view-all-container">
        <button class="view-all-btn" @click="goToProducts">
          VER TODOS OS PRODUTOS
          <span class="arrow">→</span>
        </button>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router'
  import model1 from '@/assets/cards/model1.png'
  import model2 from '@/assets/cards/model2.png'
  import model3 from '@/assets/cards/model3.png'
  import model4 from '@/assets/cards/model4.png'
  
  import addIcon from '@/assets/cards/add.svg'
  import favoriteIcon from '@/assets/cards/favorite.svg'
  import vezzLogo from '@/assets/cards/vezz-logo.png'

  const router = useRouter()

  const goToProducts = () => {
    router.push('/products')
  }
  
  interface LocalProduct {
    name: string;
    price: string;
    stock: number;
    image: string;
  }
  
  const products = ref<LocalProduct[]>([
    { name: 'Terno Milano', price: '349,90', stock: 9, image: model1 },
    { name: 'Terno Preto', price: '389,99', stock: 3, image: model2 },
    { name: 'Terno Cinza Grafite', price: '429,50', stock: 2, image: model3 },
    { name: 'Terno Chumbo', price: '379,00', stock: 1, image: model4 },
  ])
  </script>
  
  <style scoped>
  .cards-section {
    width: 100%;
    padding: 14px 72px;
    box-sizing: border-box;
    background-color: #fff;
    font-family: Roboto, sans-serif;
    margin-bottom: 6vh;
  }
  
  .titulo {
    text-align: center;
    font-size: 24px;
    font-weight: 500;
    letter-spacing: 1.25px;
    line-height: 16px;
    color: #000;
    margin-bottom: 18px;
    text-align: left;
  }
  
  .cards {
    display: flex;
    flex-wrap: nowrap;
    gap: 72px;
    justify-content: center;
  }
  
  .produto {
    width: 280px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .produto:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }
  
  .contents {
    width: 100%;
    height: 320px;
    position: relative;
    overflow: hidden;
    border-radius: 4px;
    transition: transform 0.3s ease;
  }
  
  .produto:hover .contents {
    transform: scale(1.02);
  }
  
  .foto {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
  
  .brand {
    position: absolute;
    top: 10px;
    left: 8px;
    z-index: 2;
  }
  
  .vezz-logo {
    width: 40px;
    height: auto;
  }
  
  .icons {
    position: absolute;
    bottom: 10px;
    left: 8px;
    right: 8px;
    display: flex;
    justify-content: space-between;
    z-index: 2;
  }
  
  .icon {
    width: 24px;
    cursor: pointer;
  }
  
  .icon.add {
    filter: brightness(0) invert(1);
  }
  
  .bottom {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-align: left;
    color: #212121;
    font-size: 14px;
  }
  
  .info, .stock {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .name, .price, .quantity {
    font-weight: 500;
    letter-spacing: 1.25px;
  }
  
  .sizes span {
    margin-left: 12px;
    font-weight: 500;
    letter-spacing: 1.25px;
    color: #212121;
  }
  
  .sizes .unavailable {
    color: #bebebe;
  }

  /* View All Button */
  .view-all-container {
    display: flex;
    justify-content: center;
    margin-top: 48px;
  }

  .view-all-btn {
    background: transparent;
    color: #212121;
    border: 2px solid #212121;
    padding: 16px 32px;
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.3s ease;
    letter-spacing: 1.25px;
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
    overflow: hidden;
  }

  .view-all-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: #212121;
    transition: left 0.3s ease;
    z-index: -1;
  }

  .view-all-btn:hover::before {
    left: 0;
  }

  .view-all-btn:hover {
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(33, 33, 33, 0.2);
  }

  .view-all-btn:active {
    transform: translateY(0);
  }

  .arrow {
    transition: transform 0.3s ease;
    font-size: 16px;
  }

  .view-all-btn:hover .arrow {
    transform: translateX(4px);
  }
  </style>
  