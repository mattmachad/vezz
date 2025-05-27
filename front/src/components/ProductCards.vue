<template>
    <section class="cards-section">
      <h2 class="titulo">Ternos de Grife</h2>
  
      <div class="cards">
        <div v-for="(product, index) in products" :key="index" class="produto">
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
    </section>
  </template>
  
  <script lang="ts" setup>
  import model1 from '@/assets/cards/model1.png'
  import model2 from '@/assets/cards/model2.png'
  import model3 from '@/assets/cards/model3.png'
  import model4 from '@/assets/cards/model4.png'
  
  import addIcon from '@/assets/cards/add.svg'
  import favoriteIcon from '@/assets/cards/favorite.svg'
  import vezzLogo from '@/assets/cards/vezz-logo.png'
  
  const products = [
    { name: 'Terno Milano', price: '349,90', stock: 9, image: model1 },
    { name: 'Terno Preto', price: '389,99', stock: 3, image: model2 },
    { name: 'Terno Cinza Grafite', price: '429,50', stock: 2, image: model3 },
    { name: 'Terno Chumbo', price: '379,00', stock: 1, image: model4 },
  ]
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
  }
  
  .contents {
    width: 100%;
    height: 320px;
    position: relative;
    overflow: hidden;
    border-radius: 4px;
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
  </style>
  