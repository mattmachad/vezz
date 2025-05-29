<template>
    <section class="cards-section">
      <h2 class="titulo">Ternos em Destaque</h2>
  
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>Carregando produtos em destaque...</p>
      </div>

      <div v-else-if="products.length === 0" class="no-products">
        <p>Nenhum produto em destaque no momento.</p>
      </div>

      <div v-else class="cards" ref="carouselRef" @scroll="handleScroll">
        <div 
          v-for="product in displayProducts" 
          :key="product.id" 
          class="produto"
          @click="handleProductClick(product)"
        >
          <div class="contents">
            <img class="foto" :src="product.picture || '/placeholder-image.jpg'" :alt="product.title" />
    
            <div class="brand">
              <img class="vezz-logo" :src="darkModeStore.isDark ? vezzLogoWhite : vezzLogo" alt="Vezz logo" />
            </div>
    
            <div v-if="isUserLoggedIn" class="icons">
              <img 
                class="icon favorite" 
                :src="isFavorite(product.id) ? favoriteIconFilled : (darkModeStore.isDark ? favoriteIconWhite : favoriteIcon)" 
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
              <div class="name">{{ product.title }}</div>
              <div class="price">R$ {{ product.price.toFixed(2).replace('.', ',') }}</div>
            </div>
            <div class="stock">
              <div class="quantity">{{ Object.values(product.quantities).reduce((a, b) => a + b, 0) }} em estoque</div>
              <div class="sizes">
                <span 
                  v-for="(quantity, size) in product.quantities" 
                  :key="size"
                  :class="{ unavailable: quantity === 0 }"
                >
                  {{ size }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botão Ver Todos -->
      <div class="view-all-container">
        <button class="view-all-btn" @click="router.push('/products')">
          VER TODOS OS PRODUTOS
          <span class="arrow">→</span>
        </button>
      </div>

      <!-- Toast Notification -->
      <transition name="toast">
        <div v-if="showToastFlag" class="toast-container">
          <transition name="badge">
            <div v-if="addCounter > 1 && toastMessage.includes('carrinho')" class="toast-badge">
              {{ addCounter }}x
            </div>
          </transition>
          <div class="toast">
            {{ toastMessage }}
          </div>
        </div>
      </transition>

      <LoginModal 
        :show="showLoginModal" 
        @close="showLoginModal = false"
      />
    </section>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router'
  import { useCartStore } from '@/stores/cart'
  import { useDarkModeStore } from '@/stores/darkMode'
  import { useAuthStore } from '@/stores/auth'
  import { useFavoritesStore } from '@/stores/favorites'
  import api from '@/services/api'
  import LoginModal from './LoginModal.vue'
  
  import addIcon from '@/assets/cards/add.svg'
  import addIconWhite from '@/assets/cards/add-white.svg'
  import favoriteIcon from '@/assets/favorite.svg'
  import favoriteIconWhite from '@/assets/favorite-white.svg'
  import favoriteIconFilled from '@/assets/cards/favorite_filled.svg'
  import vezzLogo from '@/assets/vezz-logo.png'
  import vezzLogoWhite from '@/assets/vezz-logo-white.svg'

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

  interface Product {
    id: number;
    title: string;
    price: number;
    picture?: string;
    category: string;
    quantities: Record<string, number>;
    detach: boolean;
  }

  const loading = ref(true)
  const products = ref<Product[]>([])

  const carouselRef = ref<HTMLElement | null>(null)
  const isMobile = ref(false)

  const displayProducts = computed(() => {
    return products.value
  })

  const checkMobile = () => {
    isMobile.value = window.innerWidth <= 1024
  }

  const handleScroll = () => {
    // Removendo a lógica de scroll infinito pois não é mais necessária
    return
  }

  // Buscar produtos em destaque
  const fetchProducts = async () => {
    try {
      loading.value = true
      const response = await api.get('/products')
      // Filtra apenas produtos com detach = true
      products.value = response.data.filter((product: Product) => product.detach)
    } catch (error) {
      console.error('Error fetching products:', error)
      showToast('Erro ao carregar produtos em destaque')
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchProducts()
    checkMobile()
    window.addEventListener('resize', checkMobile)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
  })

  const goToProducts = () => {
    if (!isUserLoggedIn.value) {
      showLoginModal.value = true
      return
    }
    router.push('/products')
  }

  const showLoginModal = ref(false)

  const addToCart = (product: Product) => {
    if (!isUserLoggedIn.value) {
      showLoginModal.value = true
      return
    }
    
    const success = cartStore.addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      size: 'P',
      quantity: 1,
      image: product.picture || ''
    })

    if (success) {
      showToast('Produto adicionado ao carrinho!')
    }
  }

  const toggleFavorite = (product: Product) => {
    if (!isUserLoggedIn.value) {
      showLoginModal.value = true
      return
    }

    const isFavorited = favoritesStore.isFavorite(product.id)
    
    if (isFavorited) {
      favoritesStore.removeFromFavorites(product.id)
      toastMessage.value = 'Produto removido dos favoritos!'
      showToastFlag.value = true
      setTimeout(() => {
        showToastFlag.value = false
      }, 3000)
    } else {
      favoritesStore.addToFavorites(product.id)
      toastMessage.value = 'Produto adicionado aos favoritos!'
      showToastFlag.value = true
      setTimeout(() => {
        showToastFlag.value = false
      }, 3000)
    }
  }

  const isFavorite = (productId: number) => {
    return favoritesStore.isFavorite(productId)
  }

  const handleProductClick = (product: Product) => {
    if (!isUserLoggedIn.value) {
      showLoginModal.value = true
      return
    }
    goToProducts()
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
  
  .loading,
  .no-products {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    color: var(--text-color);
    text-align: center;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--border-color);
    border-top: 3px solid var(--text-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .loading p,
  .no-products p {
    font-size: 16px;
    color: var(--text-color);
    opacity: 0.8;
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
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 72px;
    padding: 16px 0;
  }
  
  .produto {
    width: 100%;
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
    gap: 8px;
  }
  
  .info, .stock {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    width: 100%;
  }
  
  .name {
    font-weight: 500;
    letter-spacing: 1.25px;
    color: var(--text-color);
    transition: color 0.3s;
    flex: 1;
    word-wrap: break-word;
    min-width: 0;
    line-height: 1.4;
  }
  
  .price {
    font-weight: 500;
    letter-spacing: 1.25px;
    color: var(--text-color);
    transition: color 0.3s;
    white-space: nowrap;
  }
  
  .quantity {
    font-weight: 500;
    letter-spacing: 1.25px;
    color: var(--text-color);
    transition: color 0.3s;
    white-space: nowrap;
  }
  
  .sizes {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: flex-end;
  }
  
  .sizes span {
    margin-left: 0;
    font-weight: 500;
    letter-spacing: 1.25px;
    color: var(--text-color);
    transition: color 0.3s;
    white-space: nowrap;
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

  .icon.favorite {
    transition: transform 0.2s ease;
  }

  .icon.favorite:hover {
    transform: scale(1.1);
  }

  /* Responsividade */
  @media (max-width: 1280px) {
    .cards-section {
      padding: 14px 48px;
    }

    .cards {
      gap: 48px;
    }
  }

  @media (max-width: 1024px) {
    .cards-section {
      padding: 14px 32px;
    }

    .cards {
      display: flex;
      flex-wrap: nowrap;
      gap: 32px;
      justify-content: flex-start;
      overflow-x: auto;
      scroll-behavior: smooth;
      -ms-overflow-style: none;
      scrollbar-width: none;
      scroll-snap-type: x mandatory;
      padding: 16px;
      margin: 0 -16px;
    }

    .cards::-webkit-scrollbar {
      display: none;
    }

    .produto {
      flex: 0 0 auto;
      width: 240px;
      scroll-snap-align: start;
    }
  }

  @media (max-width: 768px) {
    .cards-section {
      padding: 14px 24px;
    }

    .cards {
      gap: 24px;
      padding: 16px 24px;
      margin: 0 -24px;
    }

    .produto {
      width: 220px;
    }

    .titulo {
      font-size: 20px;
      text-align: center;
      margin-bottom: 24px;
    }

    .contents {
      height: 280px;
    }

    .bottom {
      padding: 12px;
    }

    .name, .price {
      font-size: 13px;
    }

    .quantity {
      font-size: 12px;
    }

    .sizes span {
      font-size: 12px;
    }

    .view-all-btn {
      padding: 12px 24px;
      font-size: 13px;
    }
  }

  @media (max-width: 480px) {
    .cards-section {
      padding: 14px 16px;
    }

    .cards {
      gap: 16px;
      padding: 16px;
      margin: 0 -16px;
    }

    .produto {
      width: 200px;
    }

    .titulo {
      font-size: 18px;
    }

    .contents {
      height: 260px;
    }

    .icon {
      width: 32px;
      height: 32px;
    }

    .icon img {
      width: 20px;
      height: 20px;
    }

    .vezz-logo {
      width: 32px;
    }

    .bottom {
      padding: 10px;
      gap: 6px;
    }

    .info, .stock {
      gap: 8px;
    }

    .name, .price {
      font-size: 12px;
      letter-spacing: 1px;
    }

    .quantity {
      font-size: 11px;
    }

    .sizes span {
      font-size: 11px;
      padding: 2px 4px;
    }

    .view-all-container {
      margin-top: 32px;
    }

    .view-all-btn {
      padding: 10px 20px;
      font-size: 12px;
    }
  }

  @media (max-width: 360px) {
    .produto {
      width: 180px;
    }

    .contents {
      height: 240px;
    }
  }

  /* Melhorias na rolagem horizontal para dispositivos touch */
  @media (hover: none) and (max-width: 1024px) {
    .cards {
      -webkit-overflow-scrolling: touch;
      scroll-behavior: smooth;
      scroll-padding: 0 16px;
    }

    .produto {
      scroll-snap-align: start;
    }
  }
  </style>
  