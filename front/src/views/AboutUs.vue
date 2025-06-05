<template>
  <div>
    <Navbar />

    <div :class="$style.aboutPage">
      <h1 :class="$style.title">Sobre</h1>
      <p :class="$style.paragraph">
        A Vezz Store é mais do que uma plataforma online: ela é um movimento que transforma a forma como as pessoas se vestem para ocasiões especiais.
        Com um olhar atento para o futuro, a Vezz Store nasce do desejo de aliar moda, sustentabilidade e praticidade, tornando o luxo acessível e descomplicado.
      </p>
      <p :class="$style.paragraph">
        Nossa missão é oferecer aos clientes a experiência única de estar sempre bem vestidos, sem a necessidade de comprar peças que seriam usadas poucas vezes.
      </p>
      <p :class="$style.paragraph">
        Em um mundo onde o consumo consciente é cada vez mais valorizado, a Vezz Store se destaca como pioneira no mercado brasileiro de aluguel de roupas de luxo e fantasias.
        Nosso catálogo é cuidadosamente selecionado para atender a todos os estilos e ocasiões: desde eventos formais como casamentos e festas de gala, até celebrações descontraídas e temáticas.
        Cada peça conta uma história e carrega a essência da elegância e exclusividade, sem abrir mão do conforto e da qualidade.
      </p>
      <p :class="$style.paragraph">
        Acreditamos que a moda deve ser democrática e sustentável. Por isso, nossa plataforma é intuitiva, segura e eficiente,
        permitindo que os usuários escolham e aluguem seus trajes com poucos cliques, recebendo tudo no conforto de casa.
        A Vezz Store não apenas promove a reutilização de roupas de alto padrão, mas também contribui para a redução do desperdício
        e do impacto ambiental causado pelo consumo excessivo.
      </p>
    </div>

    <footer :class="$style.footer">
      <div :class="$style.left">
        <a href="#">Contato</a> ·
        <a href="#">Política de Privacidade</a> ·
        <a href="#">Termo de Uso</a>
      </div>
      <div :class="$style.right">
        @ Vezz Store 2025
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
</script>

<style module>
.aboutPage {
  max-width: 800px;
  margin: 80px auto 40px;
  padding: 0 16px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #222;
}

.title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 24px;
  text-align: center;
}

.paragraph {
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 24px;
  text-align: justify;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #666;
  padding: 16px 32px;
  border-top: 1px solid #ddd;
  width: 100%;
  box-sizing: border-box;
  background-color: #f9f9f9;
}

.left {
  text-align: left;
}

.right {
  text-align: right;
}
</style>
