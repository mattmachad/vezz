<template>
    <NavBar />
    <div :class="$style.product">
      <b :class="$style.sobre">Sobre</b>
      <div :class="$style.fotos01">
        <div :class="$style.aVezzStoreContainer">
          <div :class="$style.aVezzStoreContainer1">
            <p :class="$style.aVezzStore">
              A Vezz Store é mais do que uma plataforma online: ela é um movimento que transforma a forma como as pessoas se vestem para ocasiões especiais. Com um olhar atento para o futuro, a Vezz Store nasce do desejo de aliar moda, sustentabilidade e praticidade, tornando o luxo acessível e descomplicado. Nossa missão é oferecer aos clientes a experiência única de estar sempre bem vestidos, sem a necessidade de comprar peças que seriam usadas poucas vezes.
            </p>
            <p :class="$style.aVezzStore">&nbsp;</p>
            <p :class="$style.aVezzStore">
              Em um mundo onde o consumo consciente é cada vez mais valorizado, a Vezz Store se destaca como pioneira no mercado brasileiro de aluguel de roupas de luxo e fantasias. Nosso catálogo é cuidadosamente selecionado para atender a todos os estilos e ocasiões: desde eventos formais como casamentos e festas de gala, até celebrações descontraídas e temáticas. Cada peça conta uma história e carrega a essência da elegância e exclusividade, sem abrir mão do conforto e da qualidade.
            </p>
            <p :class="$style.aVezzStore">&nbsp;</p>
            <p :class="$style.aVezzStore">
              Acreditamos que a moda deve ser democrática e sustentável. Por isso, nossa plataforma é intuitiva, segura e eficiente, permitindo que os usuários escolham e aluguem seus trajes com poucos cliques, recebendo tudo no conforto de casa. A Vezz Store não apenas promove a reutilização de roupas de alto padrão, mas também contribui para a redução do desperdício e do impacto ambiental causado pelo consumo excessivo.
            </p>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </template>
  
  <script setup lang="ts">
  import NavBar from '@/components/NavBar.vue'
  import Footer from '@/components/Footer.vue'
  </script>
  
  <style module>
  .product {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 71px 0;
    box-sizing: border-box;
    gap: 32px;
    text-align: center;
    font-size: 36px;
    color: var(--text-color);
    font-family: Roboto, sans-serif;
    background-color: var(--bg-color);
    transition: background-color 0.3s, color 0.3s;
    margin-bottom: 50px;
  }
  
  @media (max-width: 1200px) {
    .product {
      padding: 32px 24px 0;
      font-size: 28px;
    }
    .aVezzStoreContainer {
      width: 90vw;
      max-width: 800px;
    }
  }
  
  @media (max-width: 800px) {
    .product {
      padding: 24px 8px 0;
      font-size: 22px;
    }
    .aVezzStoreContainer {
      width: 100vw;
      max-width: 100%;
      padding: 0 8px;
    }
    .fotos01 {
      font-size: 14px;
    }
  }
  
  @media (max-width: 500px) {
    .product {
      padding: 12px 2vw 0;
      font-size: 16px;
      gap: 18px;
    }
    .aVezzStoreContainer {
      padding: 0 2vw;
    }
    .sobre {
      font-size: 22px;
      line-height: 32px;
    }
  }
  
  .sobre {
    position: relative;
    letter-spacing: 1.25px;
    line-height: 50px;
    color: var(--text-color);
    transition: color 0.3s;
  }
  
  .fotos01 {
    align-self: stretch;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: var(--text-color);
    transition: color 0.3s;
  }
  
  .aVezzStoreContainer {
    width: 1056px;
    position: relative;
    letter-spacing: 0.5px;
    line-height: 28px;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  
  .aVezzStoreContainer1 {
    width: 100%;
  }
  
  .aVezzStore {
    margin: 0;
    color: var(--text-color);
    transition: color 0.3s;
  }

  :global(:root) {
    --bg-color: #fff;
    --text-color: #212121;
  }

  :global(:root.dark-mode) {
    --bg-color: #212121;
    --text-color: #fff;
  }
  </style>
  