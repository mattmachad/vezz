<template>
  <div class="products-container">
    <NavBar />
    <div class="banner">
      <div class="text">
        <div class="home-catalogo-container">
          <router-link to="/" class="home">Home</router-link>
          <span> </span>
          <span class="separator">|</span>
          <span> </span>
          <router-link to="/products" class="catalogo">Catálogo</router-link>
        </div>
        <div class="explorar-todos-itens">Explorar todos itens</div>
      </div>
    </div>
    <div class="product">
      <div :class="$style.filtros">
        <div :class="$style.contents">
          <section :class="$style.group">
            <div :class="$style.head" @click="toggleSection('categories')">
              <span :class="$style.title">CATEGORIAS</span>
              <img :class="$style.icon" alt="seta" src="@/assets/keyboard_arrow_up.svg"
                :style="{ transform: sectionsOpen.categories ? 'rotate(0deg)' : 'rotate(180deg)' }" />
            </div>
            <div v-show="sectionsOpen.categories" :class="$style.options">
              <div v-for="item in ['Roupas', 'Sapatos', 'Acessórios']" :key="item" :class="$style.option"
                @click="selectFilter('category', item)">
                <img :src="selectedFilters.category.includes(item)
                  ? radioButtonChecked
                  : radioButtonUnchecked" :class="$style.radio" alt="radio" />
                <span :class="$style.label">{{ item }}</span>
              </div>
            </div>
          </section>

          <section :class="$style.group">
            <div :class="$style.head" @click="toggleSection('gender')">
              <span :class="$style.title">GÊNERO</span>
              <img :class="$style.icon" alt="seta" src="@/assets/keyboard_arrow_up.svg"
                :style="{ transform: sectionsOpen.gender ? 'rotate(0deg)' : 'rotate(180deg)' }" />
            </div>
            <div v-show="sectionsOpen.gender" :class="$style.options">
              <div v-for="item in ['Homem', 'Mulher', 'Unissex']" :key="item" :class="$style.option"
                @click="selectFilter('gender', item)">
                <img :src="selectedFilters.gender.includes(item)
                  ? radioButtonChecked
                  : radioButtonUnchecked" :class="$style.radio" alt="radio" />
                <span :class="$style.label">{{ item }}</span>
              </div>
            </div>
          </section>

          <section :class="$style.group">
            <div :class="$style.head" @click="toggleSection('colors')">
              <span :class="$style.title">CORES</span>
              <img :class="$style.icon" alt="seta" src="@/assets/keyboard_arrow_up.svg"
                :style="{ transform: sectionsOpen.colors ? 'rotate(0deg)' : 'rotate(180deg)' }" />
            </div>
            <div v-show="sectionsOpen.colors" :class="$style.colors">
              <div v-for="[colorName, colorHex] in Object.entries(colorMapping)" :key="colorName"
                :class="$style.colorCircle" :style="{ backgroundColor: colorHex }" @click="selectFilter('color', colorName)">
                <div v-if="selectedFilters.color.includes(colorName)" :class="$style.colorSelected" />
              </div>
            </div>
          </section>

          <section :class="$style.group">
            <div :class="$style.head" @click="toggleSection('sizes')">
              <span :class="$style.title">TAMANHOS</span>
              <img :class="$style.icon" alt="seta" src="@/assets/keyboard_arrow_up.svg"
                :style="{ transform: sectionsOpen.sizes ? 'rotate(0deg)' : 'rotate(180deg)' }" />
            </div>
            <div v-show="sectionsOpen.sizes" :class="$style.sizes">
              <div v-for="size in ['P', 'M', 'G', 'GG']" :key="size"
                :class="[$style.sizeBox, { [$style.selected]: selectedFilters.size.includes(size) }]"
                @click="selectFilter('size', size)">
                {{ size }}
              </div>
            </div>
          </section>

          <section :class="$style.group">
            <div :class="$style.head" @click="toggleSection('prices')">
              <span :class="$style.title">PREÇOS</span>
              <img :class="$style.icon" alt="seta" src="@/assets/keyboard_arrow_up.svg"
                :style="{ transform: sectionsOpen.prices ? 'rotate(0deg)' : 'rotate(180deg)' }" />
            </div>
            <div v-show="sectionsOpen.prices" :class="$style.priceSection">
              <div :class="$style.faixaDeValor">
                <div :class="$style.mnimo">
                  <div :class="$style.min">Min</div>
                  <div :class="$style.input">
                    <div :class="$style.label">
                      <div :class="$style.min">
                        R$ {{ priceRange.min.toFixed(2).replace('.', ',') }}
                      </div>
                    </div>
                  </div>
                </div>
                <div :class="$style.divider">
                  <div :class="$style.dividerChild" />
                </div>
                <div :class="$style.mnimo">
                  <div :class="$style.min">Max</div>
                  <div :class="$style.input">
                    <div :class="$style.label">
                      <div :class="$style.min">
                        R$ {{ priceRange.max.toFixed(2).replace('.', ',') }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div :class="$style.rangeWrapper">
                <input type="range" v-model.number="priceRange.min" :min="dynamicPriceRange.min"
                  :max="dynamicPriceRange.max" @input="validatePriceRange('min')" />
                <input type="range" v-model.number="priceRange.max" :min="dynamicPriceRange.min"
                  :max="dynamicPriceRange.max" @input="validatePriceRange('max')" />
              </div>
            </div>
          </section>

          <button :class="$style.clearBtn" @click="clearFilters">
            LIMPAR FILTROS
          </button>
        </div>
      </div>

      <div class="products">
        <div class="products-header">
          <div class="search-container">
            <input v-model="searchQuery" type="text" placeholder="Buscar produtos..." class="search-input" />
            <img src="@/assets/search.svg" alt="Buscar" class="search-icon" />
          </div>

          <div class="header-right">
            <div class="product-count">
              {{ filteredProducts.length }} produtos encontrados
            </div>

            <div class="view-toggle">
              <button :class="['view-btn', { active: viewMode === 'grid' }]" @click="viewMode = 'grid'">
                <img src="@/assets/grid_view.svg" alt="Grid" />
              </button>
              <button :class="['view-btn', { active: viewMode === 'list' }]" @click="viewMode = 'list'">
                <img src="@/assets/list_view.svg" alt="List" />
              </button>
            </div>

            <div class="ordenacao" @click="showSortDropdown = !showSortDropdown">
              <img class="keyboard-arrow-up-icon" alt="" src="@/assets/swap_vert.svg" />
              <div class="ordenar-por">Ordenar por:</div>
              <div class="filtro">
                <div class="roupas">{{sortOptions.find(opt => opt.value === selectedSort)?.label}}</div>
                <img class="keyboard-arrow-up-icon" alt="" src="@/assets/keyboard_arrow_down.svg"
                  :style="{ transform: showSortDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }" />
              </div>

              <div v-if="showSortDropdown" class="sort-dropdown">
                <div v-for="option in sortOptions" :key="option.value" class="sort-option"
                  :class="{ active: selectedSort === option.value }"
                  @click.stop="selectedSort = option.value; showSortDropdown = false">
                  {{ option.label }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div :class="['cards', viewMode]">
          <div v-if="loading" class="loading">
            <div class="loading-spinner"></div>
            <p>Carregando produtos...</p>
          </div>
          <div v-else-if="filteredProducts.length === 0" class="no-products">
            <img src="@/assets/empty_state.svg" alt="Nenhum produto" />
            <p>Nenhum produto encontrado</p>
            <button @click="clearFilters" class="clear-filters-btn">Limpar Filtros</button>
          </div>
          <transition-group name="product-list" tag="div" class="products-grid">
            <div v-for="product in paginatedProducts" :key="product.id" :class="$style.produto01">
              <div :class="$style.imageWrapper">
                <img :class="$style.fotoIcon" :alt="product.name" :src="product.images[0]" />
                <button v-if="isUserLoggedIn" :class="$style.favoriteBtn" @click="toggleFavorite(product.id)">
                  <img :src="isFavorite(product.id) ? favoriteIconFilled : favoriteIcon" alt="Favoritar" />
                </button>
                <button v-if="isUserLoggedIn" :class="$style.addBtn" @click="addToCart(product)">
                  <img :src="addIcon" alt="Adicionar" />
                </button>
              </div>
              <div :class="$style.bottom">
                <div :class="$style.row">
                  <span :class="$style.nomeDoTerno">{{ product.name }}</span>
                  <span :class="$style.preco">R$ {{ product.price.toFixed(2) }}</span>
                </div>
                <div :class="$style.row">
                  <span :class="$style.stock">{{ product.stock }} em estoque</span>
                  <div :class="$style.sizeList">
                    <span v-for="sizeDetail in product.sizeDetails" :key="sizeDetail.size"
                      :class="[!sizeDetail.available ? $style.unavailable : '']">
                      {{ sizeDetail.size }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </transition-group>
        </div>

        <div v-if="currentPage < totalPages" class="button">
          <button class="v-btn1" @click="loadMore">
            <div class="content">
              <div class="text5">CARREGAR MAIS ({{ filteredProducts.length - paginatedProducts.length }} restantes)
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>

    <transition name="toast">
      <div v-if="showToastFlag" class="toast-container">
        <div class="toast">
          {{ toastMessage }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import NavBar from '../components/NavBar.vue'
import { ref, onMounted, computed, watch, useCssModule } from 'vue'
import { storeToRefs } from 'pinia'
import api from '../services/api'
import type { Product, DisplayProduct } from '../types/product'
import { useCartStore } from '@/stores/cart'
import { useFavoritesStore } from '@/stores/favorites'
import type { CartItem } from '@/stores/cart'

import addIcon from '../assets/cards/add.svg'
import favoriteIcon from '../assets/cards/favorite.svg'
import favoriteIconFilled from '../assets/cards/favorite_filled.svg'
import vezzLogo from '../assets/cards/vezz-logo.png'
import radioButtonChecked from '../assets/radio_button_checked.svg'
import radioButtonUnchecked from '../assets/radio_button_unchecked.svg'

const style = useCssModule()

const sectionsOpen = ref({
  categories: true,
  gender: true,
  colors: true,
  sizes: true,
  prices: true
})

const colorMapping = {
  'preto': '#000',
  'branco': '#fff',
  'cinza': '#ccc',
  'azul': '#383873',
  'vermelho': '#ac4f4f',
  'amarelo': '#fffd8b',
  'rosa': '#cd57c1',
  'verde': '#4caf50'
}

const selectedFilters = ref({
  category: [] as string[],
  gender: [] as string[],
  color: [] as string[],
  size: [] as string[]
})

const rawProducts = ref<Product[]>([])
const loading = ref(true)
const cart = ref<ReturnType<typeof useCartStore> | null>(null)
const favoritesStore = useFavoritesStore()

const priceRange = ref({
  min: 0,
  max: 1000
})

const dynamicPriceRange = computed(() => {
  if (rawProducts.value.length === 0) {
    return { min: 0, max: 1000 }
  }

  const prices = rawProducts.value.map(product => product.price)
  const minPrice = Math.floor(Math.min(...prices))
  const maxPrice = Math.ceil(Math.max(...prices))

  return { min: minPrice, max: maxPrice }
})

const products = computed<DisplayProduct[]>(() => {
  return rawProducts.value.map((product: Product) => {
    const totalStock = Object.values(product.quantities).reduce((sum: number, qty: number) => sum + qty, 0)

    const allSizes = ['P', 'M', 'G', 'GG']
    const availableSizes = allSizes.map(size => ({
      size,
      quantity: product.quantities[size] || 0,
      available: (product.quantities[size] || 0) > 0
    }))

    const fallbackImage = 'https://res.cloudinary.com/dtuxy5k7v/image/upload/v1748493239/file_pdysef.png'
    const productImage = product.picture && product.picture.trim() !== '' ? product.picture : fallbackImage

    console.log('productImage', product.picture)

    return {
      id: product.id,
      name: product.title,
      description: `${product.category} - ${product.color}`,
      price: product.price,
      images: [productImage],
      sizes: Object.keys(product.quantities),
      stock: totalStock,
      category: product.category,
      gender: product.gender,
      color: product.color,
      sizeDetails: availableSizes
    }
  })
})

const sortOptions = [
  { value: 'featured', label: 'Mais Procurados' },
  { value: 'price-asc', label: 'Menor Preço' },
  { value: 'price-desc', label: 'Maior Preço' },
  { value: 'name-asc', label: 'Nome A-Z' },
  { value: 'name-desc', label: 'Nome Z-A' },
  { value: 'stock', label: 'Mais em Estoque' }
]

const selectedSort = ref('featured')
const showSortDropdown = ref(false)

const searchQuery = ref('')

const categoryMapping: { [key: string]: string } = {
  'Roupas': 'clothes',
  'Sapatos': 'shoes',
  'Acessórios': 'accessories'
}

const genderMapping: { [key: string]: string } = {
  'Homem': 'male',
  'Mulher': 'female',
  'Unissex': 'unisex'
}

const filteredProducts = computed(() => {
  let filtered = products.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    )
  }

  if (selectedFilters.value.category.length > 0) {
    filtered = filtered.filter(product => {
      const apiCategories = selectedFilters.value.category.map(cat => categoryMapping[cat] || cat)
      return apiCategories.includes(product.category)
    })
  }

  if (selectedFilters.value.gender.length > 0) {
    filtered = filtered.filter(product => {
      const apiGenders = selectedFilters.value.gender.map(gender => genderMapping[gender] || gender)
      return apiGenders.includes(product.gender)
    })
  }

  if (selectedFilters.value.color.length > 0) {
    filtered = filtered.filter(product =>
      selectedFilters.value.color.includes(product.color)
    )
  }

  if (selectedFilters.value.size.length > 0) {
    filtered = filtered.filter(product =>
      selectedFilters.value.size.some(size =>
        product.sizeDetails.find(s => s.size === size && s.available)
      )
    )
  }

  filtered = filtered.filter(product =>
    product.price >= priceRange.value.min && product.price <= priceRange.value.max
  )

  const sorted = [...filtered]
  switch (selectedSort.value) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price)
      break
    case 'name-asc':
      sorted.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name-desc':
      sorted.sort((a, b) => b.name.localeCompare(a.name))
      break
    case 'stock':
      sorted.sort((a, b) => b.stock - a.stock)
      break
  }

  return sorted
})

const itemsPerPage = 12
const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))

const paginatedProducts = computed(() => {
  const endIndex = currentPage.value * itemsPerPage
  return filteredProducts.value.slice(0, endIndex)
})

const loadMore = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const viewMode = ref<'grid' | 'list'>('grid')

const toastMessage = ref('')
const showToastFlag = ref(false)
const addCounter = ref(0)
let toastTimeout: ReturnType<typeof setTimeout> | null = null

const showToast = (message: string) => {
  toastMessage.value = message
  showToastFlag.value = true
  
  if (toastTimeout) {
    clearTimeout(toastTimeout)
  }
  
  toastTimeout = setTimeout(() => {
    showToastFlag.value = false
  }, 3000)
}

const toggleFavorite = (productId: number) => {
  if (isFavorite(productId)) {
    favoritesStore.removeFromFavorites(productId)
    showToast('Produto removido dos favoritos!')
  } else {
    favoritesStore.addToFavorites(productId)
    showToast('Produto adicionado aos favoritos!')
  }
}

const isFavorite = (productId: number) => favoritesStore.isFavorite(productId)

const toggleSection = (section: keyof typeof sectionsOpen.value) => {
  sectionsOpen.value[section] = !sectionsOpen.value[section]
}

const selectFilter = (type: keyof typeof selectedFilters.value, value: string) => {
  const index = selectedFilters.value[type].indexOf(value)
  if (index === -1) {
    selectedFilters.value[type].push(value)
  } else {
    selectedFilters.value[type].splice(index, 1)
  }

  currentPage.value = 1
}

watch(selectedFilters, () => {
  currentPage.value = 1
}, { deep: true })

watch(searchQuery, () => {
  currentPage.value = 1
})

const clearFilters = () => {
  selectedFilters.value = {
    category: [],
    gender: [],
    color: [],
    size: []
  }

  searchQuery.value = ''
  currentPage.value = 1

  const range = dynamicPriceRange.value
  priceRange.value = {
    min: range.min,
    max: range.max
  }
}

const calculatePosition = (value: number) => {
  const range = dynamicPriceRange.value
  const totalRange = range.max - range.min
  return ((value - range.min) / totalRange) * 100
}

const updateSliderStyle = () => {
  const minPos = calculatePosition(priceRange.value.min)
  const maxPos = calculatePosition(priceRange.value.max)

  return {
    left: `${minPos}%`,
    right: `${100 - maxPos}%`
  }
}

const fetchProducts = async () => {
  try {
    loading.value = true
    const response = await api.get('/products')
    rawProducts.value = response.data

    const range = dynamicPriceRange.value
    priceRange.value = {
      min: range.min,
      max: range.max
    }
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  try {
    cart.value = useCartStore()
  } catch (error) {
    console.error('Failed to initialize cart store:', error)
  }
  fetchProducts()
})

const validatePriceRange = (type: 'min' | 'max') => {
  if (type === 'min') {
    if (priceRange.value.min > priceRange.value.max) {
      priceRange.value.min = priceRange.value.max;
    }
    if (priceRange.value.min < dynamicPriceRange.value.min) {
      priceRange.value.min = dynamicPriceRange.value.min;
    }
  } else {
    if (priceRange.value.max < priceRange.value.min) {
      priceRange.value.max = priceRange.value.min;
    }
    if (priceRange.value.max > dynamicPriceRange.value.max) {
      priceRange.value.max = dynamicPriceRange.value.max;
    }
  }
}

watch([() => priceRange.value.min, () => priceRange.value.max], () => {
  const rangeWrapper = document.querySelector(`.${style.rangeWrapper}`) as HTMLElement;
  if (rangeWrapper) {
    const totalRange = dynamicPriceRange.value.max - dynamicPriceRange.value.min;
    const leftPercent = ((priceRange.value.min - dynamicPriceRange.value.min) / totalRange) * 100;
    const rightPercent = ((dynamicPriceRange.value.max - priceRange.value.max) / totalRange) * 100;

    rangeWrapper.style.setProperty('--left-percent', `${leftPercent}%`);
    rangeWrapper.style.setProperty('--right-percent', `${rightPercent}%`);
  }
}, { immediate: true })

const addToCart = (product: DisplayProduct) => {
  try {
    if (!cart.value) {
      cart.value = useCartStore()
    }

    const availableSize = product.sizeDetails.find(s => s.available)
    if (!availableSize) {
      showToast('Produto indisponível')
      return
    }

    const success = cart.value.addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: availableSize.size,
      quantity: 1,
      image: product.images[0]
    })
    
    if (success) {
      showToast('Produto adicionado ao carrinho!')
    }
  } catch (error) {
    console.error('Failed to add to cart:', error)
    showToast('Erro ao adicionar ao carrinho')
  }
}

const isUserLoggedIn = computed(() => {
  return !!localStorage.getItem('user')
})
</script>

<style scoped>
.products-container {
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;
  overflow-x: hidden;
}

.banner {
  width: 100%;
  position: relative;
  height: 300px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 72px;
  box-sizing: border-box;
  background-image: url('@/assets/banner.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top;
  text-align: center;
  font-size: 16px;
  color: #000;
}

.text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 12px;
  width: 100%;
  max-width: 100%;
}

.home-catalogo-container {
  position: relative;
  letter-spacing: 0.94px;
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.home {
  color: #fff;
  text-decoration: none;
}

.separator {
  color: #bcbcbc;
}

.catalogo {
  color: #2baeff;
  text-decoration: none;
}

.explorar-todos-itens {
  position: relative;
  font-size: 64px;
  letter-spacing: 0.94px;
  font-weight: 600;
  color: #fff;
  word-break: break-word;
}

.product {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 48px 24px;
  box-sizing: border-box;
  gap: 32px;
  text-align: left;
  font-size: 14px;
  color: #555;
  background: transparent;
  max-width: 100%;
  overflow-x: hidden;
}

.products {
  flex: 1;
  max-width: 100%;
  width: 100%;
  background: transparent;
  min-width: 0;
  overflow-x: hidden;
}

.products-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  gap: 24px;
  flex-wrap: wrap;
  background: transparent;
  width: 100%;
}

.search-container {
  position: relative;
  flex: 1;
  max-width: 400px;
  background: transparent;
  min-width: 0;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: transparent;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #000;
  box-shadow: none;
  outline: none;
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  opacity: 0.5;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.product-count {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.view-toggle {
  display: flex;
  border-radius: 8px;
  padding: 4px;
  gap: 4px;
  background: transparent;
}

.view-btn {
  padding: 8px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-btn.active {
  background: transparent;
}

.view-btn img {
  width: 20px;
  height: 20px;
  opacity: 0.6;
}

.view-btn.active img {
  opacity: 1;
}

.ordenacao {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  cursor: pointer;
  min-width: 0;
  flex-wrap: wrap;
}

.ordenar-por {
  font-weight: 600;
  letter-spacing: 1.25px;
  line-height: 16px;
  font-size: 14px;
  white-space: nowrap;
}

.filtro {
  padding: 8px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: background 0.2s ease;
  background: transparent;
  min-width: 0;
}

.filtro .roupas {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 150px;
}

.ordenacao:hover .filtro {
  background: transparent;
}

.keyboard-arrow-up-icon {
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.sort-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 200px;
}

.sort-option {
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  font-size: 14px;
}

.sort-option:hover {
  background: transparent;
}

.sort-option.active {
  background: #000;
  color: white;
}

.sort-option:first-child {
  border-radius: 8px 8px 0 0;
}

.sort-option:last-child {
  border-radius: 0 0 8px 8px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 32px;
  margin-bottom: 64px;
  width: 100%;
}

.cards.list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 800px;
  margin: 0 auto 64px;
}

.cards.list :deep(.produto01) {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;
  max-height: 160px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.cards.list :deep(.imageWrapper) {
  flex: 0 0 120px;
  width: 120px;
  height: 120px;
  padding: 0;
  position: relative;
}

.cards.list :deep(.fotoIcon) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cards.list :deep(.bottom) {
  flex: 1;
  margin: 0;
  min-width: 0;
}

.cards.list :deep(.row) {
  margin-bottom: 8px;
}

.products-grid {
  display: contents;
}

.product-list-enter-active,
.product-list-leave-active {
  transition: all 0.3s ease;
}

.product-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.product-list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.product-list-move {
  transition: transform 0.3s ease;
}

.no-products {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.no-products img {
  width: 120px;
  height: 120px;
  margin-bottom: 24px;
  opacity: 0.5;
}

.no-products p {
  font-size: 18px;
  margin-bottom: 24px;
}

.clear-filters-btn {
  background: #000;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  letter-spacing: 1.25px;
  transition: background 0.2s ease;
}

.clear-filters-btn:hover {
  background: #333;
}

.loading {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 2px solid #d9d9d9;
  border-top: 2px solid #000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.button {
  display: flex;
  justify-content: center;
  width: 100%;
}

.v-btn1 {
  background: #000;
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  letter-spacing: 1.25px;
  transition: background 0.2s ease;
}

.v-btn1:hover {
  background: #333;
}

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
</style>

<style module>
:global(:root) {
  --text-color: #212121;
  --text-secondary: #666;
  --text-disabled: #bebebe;
  --border-color: #ddd;
  --card-bg: #fff;
  --icon-filter: none;
  --input-bg: #f1f1f1;
  --primary-color: #439cd3;
  --bg-color: #fff;
  --size-available-bg: rgba(67, 156, 211, 0.1);
  --size-unavailable-bg: rgba(0, 0, 0, 0.05);
  --slider-bg: #ddd;
  --thumb-bg: #fff;
  --thumb-shadow: rgba(0, 0, 0, 0.2);
  --heart-color: #ff4444;
}

:global(:root.dark-mode) {
  --text-color: #fff;
  --text-secondary: #aaa;
  --text-disabled: #666;
  --border-color: #444;
  --card-bg: #2a2a2a;
  --icon-filter: invert(1);
  --input-bg: #333;
  --primary-color: #439cd3;
  --bg-color: #212121;
  --size-available-bg: rgba(67, 156, 211, 0.2);
  --size-unavailable-bg: rgba(255, 255, 255, 0.05);
  --slider-bg: #444;
  --thumb-bg: #2a2a2a;
  --thumb-shadow: rgba(0, 0, 0, 0.4);
  --heart-color: #ff4444;
}

.filtros {
  width: 280px;
  color: #555;
  transition: width 0.3s ease;
}

.contents {
  display: flex;
  flex-direction: column;
  gap: 32px
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
  cursor: pointer;
  position: relative;
  border-bottom: 1px solid var(--border-color);
  transition: border-color 0.3s;
}

.title {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--text-color);
  transition: color 0.3s;
}

.icon {
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
  filter: var(--icon-filter);
}

.head::after {
  display: none;
}

.options {
  margin-top: 8px
}

.option {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.3s;
}

.option:hover {
  color: var(--text-color);
}

.radio {
  width: 16px
}

.label {
  font-size: 14px
}

.colors {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  justify-content: space-between;
}

.colorCircle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  border: 1px solid #ddd;
}

.colorSelected {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 32px;
  height: 32px;
  border: 2px solid #888;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.sizes {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  justify-content: space-between;
}

.sizeBox {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  color: #999;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}

.sizeBox:hover,
.selected {
  border-color: #000;
  color: #000;
  background-color: #f5f5f5;
}

.priceSection {
  margin-top: 32px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 24px;
}

.faixaDeValor {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  text-align: center;
  font-size: 15px;
  color: #8e8e8e;
  font-family: Roboto;
  margin-bottom: 16px;
}

.mnimo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 4px;
}

.min {
  position: relative;
  letter-spacing: 1.25px;
  line-height: 16px;
}

.input {
  width: 130px;
  border-radius: 8px;
  background-color: var(--input-bg);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 8px;
  box-sizing: border-box;
  color: var(--text-color);
  border: 1px solid var(--border-color);
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}

.divider {
  align-self: stretch;
  width: 25px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 21px 0px 0px;
  box-sizing: border-box;
}

.dividerChild {
  align-self: stretch;
  position: relative;
  border-radius: 2222px;
  background-color: var(--border-color);
  height: 4px;
  transition: background-color 0.3s;
}

.rangeWrapper {
  position: relative;
  width: 100%;
  height: 4px;
  background: var(--slider-bg);
  border-radius: 2222px;
  margin: 8px 0 24px;
  transition: background-color 0.3s;
}

.rangeWrapper::before {
  content: '';
  position: absolute;
  height: 4px;
  background: #439cd3;
  border-radius: 2222px;
  left: var(--left-percent);
  right: var(--right-percent);
  z-index: 1;
}

.rangeWrapper input[type="range"] {
  position: absolute;
  top: -6px;
  left: 0;
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  pointer-events: none;
}

.rangeWrapper input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: var(--thumb-bg);
  border: 2px solid var(--primary-color);
  border-radius: 50%;
  cursor: grab;
  pointer-events: all;
  box-shadow: 0 1px 4px var(--thumb-shadow);
  position: relative;
  z-index: 2;
  transition: background-color 0.3s, border-color 0.3s;
}

.rangeWrapper input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px;
  background: transparent;
}

.produto01 {
  width: 100%;
  display: flex;
  flex-direction: column;
  font-family: 'Roboto', sans-serif;
  color: var(--text-color);
  background: var(--card-bg);
  border-radius: 8px;
  padding: 16px;
  transition: background-color 0.3s, color 0.3s;
}

.imageWrapper {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
  border-radius: 8px;
}

:global(.cards.list) .imageWrapper {
  width: 100px;
  height: 100px;
  padding-top: 0;
  min-width: 100px;
}

:global(.cards.list) .produto01 {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
}

:global(.cards.list) .bottom {
  flex: 1;
  margin-top: 0;
}

.fotoIcon {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.favoriteBtn,
.addBtn {
  position: absolute;
  bottom: 8px;
  width: 36px;
  height: 36px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px var(--thumb-shadow);
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.3s, border-color 0.3s;
}

.favoriteBtn {
  left: 8px;
}

.addBtn {
  right: 8px;
}

.favoriteBtn:hover,
.addBtn:hover {
  transform: scale(1.1);
}

.favoriteBtn img,
.addBtn img {
  filter: var(--icon-filter);
  transition: filter 0.3s;
}

.favoriteBtn img {
  filter: none;
}

.bottom {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nomeDoTerno {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
  color: var(--text-color);
  transition: color 0.3s;
}

.preco {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
  color: var(--text-color);
  transition: color 0.3s;
}

.stock {
  font-size: 12px;
  color: var(--text-secondary);
  transition: color 0.3s;
}

.sizeList {
  display: flex;
  gap: 8px;
}

.sizeList span {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-color);
  cursor: default;
  padding: 4px 8px;
  border-radius: 4px;
  background: var(--size-available-bg);
  transition: all 0.3s ease;
}

.sizeList .unavailable {
  color: var(--text-disabled);
  font-weight: 400;
  opacity: 0.7;
  text-decoration: line-through;
  background: var(--size-unavailable-bg);
}

.inputWrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.prefix {
  position: absolute;
  left: 8px;
  color: #666;
  font-size: 14px;
}

.priceInputs input {
  border: 1px solid #ddd;
  background: #fff;
  padding: 8px;
  padding-left: 28px;
  border-radius: 4px;
  width: 100px;
  color: #333;
  text-align: right;
  font-size: 14px;
}

.priceInputs input:focus {
  outline: none;
  border-color: #439cd3;
  box-shadow: 0 0 0 2px rgba(67, 156, 211, 0.2);
}

.priceInputs input[type="number"]::-webkit-inner-spin-button,
.priceInputs input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.priceInputs input[type="number"] {
  -moz-appearance: textfield;
}

.clearBtn {
  width: 100%;
  padding: 12px;
  background: #000;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.clearBtn:hover {
  background: #333;
}
</style>

<style scoped>
@media (max-width: 1280px) {
  .cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1024px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .banner {
    padding: 10px 24px;
  }

  .explorar-todos-itens {
    font-size: 48px;
  }

  .product {
    padding: 32px 24px;
  }
}

@media (max-width: 768px) {
  .product {
    flex-direction: column;
    padding: 24px 16px;
    align-items: center;
  }

  .filtros {
    width: 100% !important;
    max-width: 600px;
    margin: 0 auto 24px;
    padding: 0;
  }

  :deep(.contents) {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 16px;
    background: var(--card-bg);
    border-radius: 8px;
    border: 1px solid var(--border-color);
    margin: 0 auto;
  }

  :deep(.group) {
    margin-bottom: 0;
  }

  :deep(.colors) {
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 12px;
    padding: 8px 0;
  }

  :deep(.sizes) {
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 8px;
    padding: 8px 0;
  }

  :deep(.options) {
    padding: 8px 0;
  }

  :deep(.priceSection) {
    margin-top: 16px;
    border-bottom: none;
    padding-bottom: 0;
  }

  :deep(.clearBtn) {
    margin-top: 8px;
  }

  .products-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .search-container {
    max-width: none;
    width: 100%;
  }

  .header-right {
    flex-direction: column;
    width: 100%;
    gap: 16px;
  }

  .ordenacao {
    width: 100%;
    justify-content: space-between;
  }

  .sort-dropdown {
    width: calc(100% - 32px);
    right: 16px;
    left: 16px;
  }

  .cards {
    padding: 0 8px;
    gap: 24px;
  }

  .banner {
    padding: 10px 16px;
  }
}

@media (max-width: 640px) {
  .cards {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 0;
  }

  .banner {
    height: 200px;
    padding: 10px 16px;
  }

  .explorar-todos-itens {
    font-size: 32px;
    line-height: 1.2;
  }

  .product {
    padding: 16px;
    gap: 24px;
  }

  .products-header {
    margin-bottom: 24px;
  }

  .cards.list :deep(.produto01) {
    flex-direction: column;
    max-height: none;
    gap: 16px;
    padding: 12px;
  }

  .cards.list :deep(.imageWrapper) {
    width: 100%;
    height: auto;
    padding-top: 100%;
  }

  .cards.list :deep(.bottom) {
    width: 100%;
  }

  .ordenacao .filtro {
    padding: 8px 12px;
  }

  .ordenacao .filtro .roupas {
    max-width: 120px;
    font-size: 13px;
  }

  .ordenar-por {
    font-size: 13px;
  }
}

/* Ajustes para o menu de filtros em telas pequenas */
@media (max-width: 768px) {
  .contents {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .clearBtn {
    width: 100%;
  }
}

/* Ajustes para o cabeçalho em telas muito pequenas */
@media (max-width: 480px) {
  .header-right {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }

  .view-toggle {
    justify-content: center;
    width: 100%;
  }

  .product-count {
    text-align: center;
    width: 100%;
  }

  .ordenacao {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }

  .ordenar-por {
    width: 100%;
    text-align: center;
  }

  .filtro {
    width: 100%;
    justify-content: center;
  }

  .explorar-todos-itens {
    font-size: 24px;
  }

  .home-catalogo-container {
    font-size: 14px;
  }

  .product {
    padding: 16px 12px;
  }
}

/* Ajustes para os botões de ação em telas pequenas */
@media (max-width: 640px) {
  .favoriteBtn,
  .addBtn {
    width: 32px;
    height: 32px;
  }

  .favoriteBtn img,
  .addBtn img {
    width: 18px;
    height: 18px;
  }
}

/* Ajustes para o slider de preços em telas pequenas */
@media (max-width: 480px) {
  .faixaDeValor {
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }

  .divider {
    display: none;
  }

  .input {
    width: 100%;
  }

  .mnimo {
    width: 100%;
  }
}

/* Melhorias na visualização da lista em telas médias */
@media (min-width: 641px) and (max-width: 1024px) {
  .cards.list :deep(.produto01) {
    padding: 12px;
  }

  .cards.list :deep(.imageWrapper) {
    width: 80px;
    height: 80px;
  }
}

/* Ajustes para telas muito pequenas */
@media (max-width: 360px) {
  .cards {
    grid-template-columns: 1fr;
  }

  .explorar-todos-itens {
    font-size: 20px;
  }

  .banner {
    height: 150px;
  }

  .product {
    padding: 12px 8px;
  }

  .products-header {
    gap: 12px;
  }

  .search-input {
    padding: 10px 35px 10px 12px;
    font-size: 14px;
  }

  .v-btn1 {
    padding: 12px 20px;
    font-size: 13px;
  }
}

/* Ajustes responsivos para os elementos do módulo */
.filtros {
  width: 280px;
  color: #555;
  transition: width 0.3s ease;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .group {
    margin-bottom: 16px;
  }

  .colors {
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 12px;
  }

  .sizes {
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .sizeBox {
    flex: 0 0 auto;
  }

  .rangeWrapper {
    margin: 24px 0;
  }

  .filtros {
    padding: 16px;
    background: var(--card-bg);
    border-radius: 8px;
    border: 1px solid var(--border-color);
  }
}

@media (max-width: 480px) {
  .sizeList {
    flex-wrap: wrap;
  }

  .sizeList span {
    flex: 0 0 auto;
    font-size: 12px;
    padding: 3px 6px;
  }

  .row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .row:last-child {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .nomeDoTerno {
    font-size: 13px;
  }

  .preco {
    font-size: 13px;
  }

  .stock {
    font-size: 11px;
  }
}

/* Ajustes para o grid de produtos */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 32px;
  margin-bottom: 64px;
}

@media (max-width: 359px) {
  .cards {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
