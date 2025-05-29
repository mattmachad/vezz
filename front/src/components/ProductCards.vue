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
              <img class="vezz-logo" :src="darkModeStore.isDark ? vezzLogoWhite : vezzLogo" alt="Vezz logo" />
            </div>
  
            <div v-if="isUserLoggedIn" class="icons">
              <img 
                class="icon favorite" 
                :src="darkModeStore.isDark 
                  ? (isFavorite(product.id) ? favoriteIconFilledWhite : favoriteIconWhite)
                  : (isFavorite(product.id) ? favoriteIconFilled : favoriteIcon)" 
                alt="Favoritar" 
                @click.stop="toggleFavorite(product)" 
              />
              <img 
                class="icon add" 
                :src="darkModeStore.isDark ? addIconWhite : addIcon" 
                alt="Adicionar" 
                @click.stop="addToCart(product)" 
              />
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

      <!-- Toast Notification -->
      <transition name="toast">
        <div v-if="showToastFlag" class="toast-container">
          <transition name="badge">
            <div v-if="addCounter > 1" class="toast-badge">
              {{ addCounter }}x
            </div>
          </transition>
          <div class="toast">
            {{ toastMessage }}
          </div>
        </div>
      </transition>
    </section>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router'
  import { useCartStore } from '@/stores/cart'
  import { useDarkModeStore } from '@/stores/darkMode'
  import { useAuthStore } from '@/stores/auth'
  import { useFavoritesStore } from '@/stores/favorites'
  import model1 from '@/assets/cards/model1.png'
  import model2 from '@/assets/cards/model2.png'
  import model3 from '@/assets/cards/model3.png'
  import model4 from '@/assets/cards/model4.png'
  
  import addIcon from '@/assets/cards/add.svg'
  import addIconWhite from '@/assets/cards/add-white.svg'
  import favoriteIcon from '@/assets/cards/favorite.svg'
  import favoriteIconWhite from '@/assets/cards/favorite-white.svg'
  import favoriteIconFilled from '@/assets/cards/favorite_filled.svg'
  import favoriteIconFilledWhite from '@/assets/cards/favorite_filled-white.svg'
  import vezzLogo from '@/assets/cards/vezz-logo.png'
  import vezzLogoWhite from '@/assets/cards/vezz-logo-white.svg'

  const router = useRouter()
  const darkModeStore = useDarkModeStore()
  const cartStore = useCartStore()
  const authStore = useAuthStore()
  const favoritesStore = useFavoritesStore()

  // Toast state
  const toastMessage = ref('')
  const showToastFlag = ref(false)
  const addCounter = ref(0)
  let toastTimeout: ReturnType<typeof setTimeout> | null = null

  const showToast = (message: string) => {
    // If toast is already showing, just increment counter
    if (showToastFlag.value) {
      addCounter.value++
      
      // Reset the timeout
      if (toastTimeout) {
        clearTimeout(toastTimeout)
      }
      
      toastTimeout = setTimeout(() => {
        showToastFlag.value = false
        addCounter.value = 0
      }, 3000)
    } else {
      // First time showing toast
      toastMessage.value = message
      showToastFlag.value = true
      addCounter.value = 1
      
      toastTimeout = setTimeout(() => {
        showToastFlag.value = false
        addCounter.value = 0
      }, 3000)
    }
  }

  const isUserLoggedIn = computed(() => {
    return !!localStorage.getItem('user')
  })

  interface LocalProduct {
    id: number;
    name: string;
    price: string;
    stock: number;
    image: string;
  }
  
  const products = ref<LocalProduct[]>([
    { id: 1, name: 'Terno Milano', price: '349,90', stock: 9, image: model1 },
    { id: 2, name: 'Terno Preto', price: '389,99', stock: 3, image: model2 },
    { id: 3, name: 'Terno Cinza Grafite', price: '429,50', stock: 2, image: model3 },
    { id: 4, name: 'Terno Chumbo', price: '379,00', stock: 1, image: model4 },
  ])

  const goToProducts = () => {
    router.push('/products')
  }

  const addToCart = (product: LocalProduct) => {
    if (!isUserLoggedIn.value) return
    
    const success = cartStore.addToCart({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price.replace(',', '.')),
      size: 'P',
      quantity: 1,
      image: product.image
    })

    if (success) {
      showToast('Produto adicionado ao carrinho!')
    }
  }

  const toggleFavorite = (product: LocalProduct) => {
    if (!isUserLoggedIn.value) {
      showToast('Você precisa estar logado para favoritar produtos!')
      return
    }

    const isFavorited = favoritesStore.isFavorite(product.id)
    
    if (isFavorited) {
      favoritesStore.removeFromFavorites(product.id)
      showToast('Produto removido dos favoritos!')
    } else {
      favoritesStore.addToFavorites(product.id)
      showToast('Produto adicionado aos favoritos!')
    }
  }

  const isFavorite = (productId: number) => {
    return favoritesStore.isFavorite(productId)
  }
  </script>
  
  <style scoped>
  .cards-section {
    width: 100%;
    padding: 14px 72px;
    box-sizing: border-box;
    background-color: var(--bg-color);
    font-family: Roboto, sans-serif;
    margin-bottom: 6vh;
    transition: background-color 0.3s;
  }
  
  .titulo {
    text-align: center;
    font-size: 24px;
    font-weight: 500;
    letter-spacing: 1.25px;
    line-height: 16px;
    color: var(--text-color);
    margin-bottom: 18px;
    text-align: left;
    transition: color 0.3s;
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
    border-radius: 16px;
    overflow: hidden;
    background: var(--card-bg);
    box-shadow: 0 2px 8px var(--nav-shadow);
  }
  
  .produto:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px var(--nav-shadow);
  }
  
  .contents {
    width: 100%;
    height: 320px;
    position: relative;
    overflow: hidden;
    border-radius: 16px 16px 0 0;
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
    bottom: 8px;
    left: 8px;
    right: 8px;
    display: flex;
    justify-content: space-between;
    z-index: 2;
  }
  
  .icon {
    width: 36px;
    height: 36px;
    background: var(--card-bg);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px var(--nav-shadow);
    cursor: pointer;
    transition: transform 0.2s ease, background-color 0.3s;
    padding: 6px;
  }
  
  .icon:hover {
    transform: scale(1.1);
  }
  
  .icon img {
    width: 24px;
    height: 24px;
  }
  
  .bottom {
    width: 100%;
    display: flex;
    flex-direction: column;
    text-align: left;
    color: var(--text-color);
    font-size: 14px;
    padding: 16px;
    background: var(--card-bg);
    border-radius: 0 0 16px 16px;
    transition: color 0.3s, background-color 0.3s;
  }
  
  .info, .stock {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .name, .price, .quantity {
    font-weight: 500;
    letter-spacing: 1.25px;
    color: var(--text-color);
    transition: color 0.3s;
  }
  
  .sizes span {
    margin-left: 12px;
    font-weight: 500;
    letter-spacing: 1.25px;
    color: var(--text-color);
    transition: color 0.3s;
  }
  
  .sizes .unavailable {
    color: var(--border-color);
    transition: color 0.3s;
  }

  /* View All Button */
  .view-all-container {
    display: flex;
    justify-content: center;
    margin-top: 48px;
  }

  .view-all-btn {
    background: transparent;
    color: var(--text-color);
    border: 2px solid var(--text-color);
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
    background: var(--text-color);
    transition: left 0.3s ease;
    z-index: -1;
  }

  .view-all-btn:hover::before {
    left: 0;
  }

  .view-all-btn:hover {
    color: var(--bg-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--nav-shadow);
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

  /* Toast Styles */
  .toast-container {
    position: fixed;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .toast {
    background: #333;
    color: white;
    padding: 16px 32px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    font-size: 14px;
  }

  .toast-badge {
    background: #439cd3;
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    animation: bounceIn 0.3s ease;
  }

  @keyframes bounceIn {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .toast-enter-active,
  .toast-leave-active {
    transition: all 0.3s ease;
  }

  .toast-enter-from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }

  .toast-leave-to {
    opacity: 0;
    transform: translate(-50%, -20px);
  }

  .badge-enter-active,
  .badge-leave-active {
    transition: all 0.2s ease;
  }

  .badge-enter-from,
  .badge-leave-to {
    opacity: 0;
    transform: scale(0);
  }
  </style>
  