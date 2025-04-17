<template>
    <section class="sobre">
      <div class="left">
        <div class="text">
          <h2 class="titulo">O Estilo que Conta Histórias</h2>
          <div class="descricao">
            <p>
              Como pioneira no mercado de aluguel online de roupas de luxo no Brasil, a Vezz Store oferece aos clientes acesso exclusivo a um guarda-roupa sustentável, elegante e memorável.
            </p>
            <p>
              Nosso propósito é redefinir a moda para ocasiões especiais, combinando luxo acessível com sustentabilidade prática. Cada peça que disponibilizamos é escolhida cuidadosamente para contar uma história única e inesquecível — da elegância dos eventos formais à diversão das festas universitárias.
            </p>
          </div>
        </div>
  
        <button class="saiba-mais">SAIBA MAIS</button>
      </div>
  
      <img class="imagem" src="@/assets/cards/lubiam_2-1.png" alt="Modelo elegante" />
    </section>
  </template>
  
  <script lang="ts" setup>
  </script>
  
  <style scoped>
  .sobre {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 64px;
    padding: 64px 232px;
    background-color: #fff;
    font-family: Roboto, sans-serif;
    color: #000;
  }
  
  .left {
    max-width: 734px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .titulo {
    font-size: 20px;
    font-weight: bolder;
    letter-spacing: 1.25px;
    line-height: 50px;
    margin: 0;
  }
  
  .descricao {
    font-size: 12px;
    letter-spacing: 1.25px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    text-align: left;
  }
  
  .saiba-mais {
    height: 52px;
    padding: 0 64px;
    background-color: #000;
    color: rgba(255, 255, 255, 0.87);
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 1.25px;
    text-transform: uppercase;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .saiba-mais:hover {
    background-color: #333;
  }
  
  .imagem {
    width: 100%;
    max-width: 500px;
    height: auto;
    object-fit: cover;
    border-radius: 4px;
  }
  </style>
  