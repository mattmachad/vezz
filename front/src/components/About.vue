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
  
        <button class="saiba-mais" @click="goToAbout">SAIBA MAIS</button>
      </div>
  
      <img class="imagem" src="@/assets/cards/lubiam_2-1.png" alt="Modelo elegante" />
    </section>
  </template>
  
  <script lang="ts" setup>
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const goToAbout = () => {
    router.push('/about')
  }
  </script>
  
  <style scoped>
  .sobre {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 64px;
    padding: 64px 232px;
    background-color: var(--bg-color);
    font-family: Roboto, sans-serif;
    color: var(--text-color);
    transition: background-color 0.3s, color 0.3s;
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
    color: var(--text-color);
    transition: color 0.3s;
  }
  
  .descricao {
    font-size: 12px;
    letter-spacing: 1.25px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    text-align: left;
    color: var(--text-color);
    transition: color 0.3s;
  }
  
  .saiba-mais {
    height: 52px;
    padding: 0 64px;
    background-color: var(--text-color);
    color: var(--bg-color);
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 1.25px;
    text-transform: uppercase;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .saiba-mais:hover {
    opacity: 0.8;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--nav-shadow);
  }
  
  .imagem {
    width: 100%;
    max-width: 500px;
    height: auto;
    object-fit: cover;
    border-radius: 4px;
    box-shadow: 0 4px 12px var(--nav-shadow);
    transition: box-shadow 0.3s;
  }

  @media (max-width: 1440px) {
    .sobre {
      padding: 64px 120px;
      gap: 48px;
    }
  }

  @media (max-width: 1024px) {
    .sobre {
      padding: 48px 64px;
      gap: 32px;
    }

    .left {
      max-width: 600px;
    }

    .titulo {
      font-size: 18px;
      line-height: 40px;
    }

    .imagem {
      max-width: 400px;
    }
  }

  @media (max-width: 768px) {
    .sobre {
      flex-direction: column;
      padding: 40px 32px;
      gap: 32px;
      text-align: center;
    }

    .left {
      max-width: 100%;
      align-items: center;
    }

    .titulo {
      text-align: center;
      line-height: 32px;
    }

    .descricao {
      text-align: center;
      font-size: 14px;
    }

    .saiba-mais {
      width: 100%;
      max-width: 300px;
    }

    .imagem {
      max-width: 100%;
      height: 300px;
      object-position: top;
    }
  }

  @media (max-width: 480px) {
    .sobre {
      padding: 32px 16px;
      gap: 24px;
    }

    .titulo {
      font-size: 16px;
      line-height: 28px;
    }

    .descricao {
      font-size: 13px;
      gap: 16px;
    }

    .saiba-mais {
      height: 48px;
      padding: 0 32px;
      font-size: 13px;
    }

    .imagem {
      height: 250px;
    }
  }

  @media (max-width: 360px) {
    .sobre {
      padding: 24px 16px;
    }

    .titulo {
      font-size: 15px;
      line-height: 24px;
    }

    .descricao {
      font-size: 12px;
    }

    .saiba-mais {
      height: 44px;
      font-size: 12px;
    }

    .imagem {
      height: 200px;
    }
  }
  </style>
  