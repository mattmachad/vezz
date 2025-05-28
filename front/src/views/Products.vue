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
              <img
                :class="$style.icon"
                alt="seta"
                src="@/assets/keyboard_arrow_up.svg"
                :style="{ transform: sectionsOpen.categories ? 'rotate(0deg)' : 'rotate(180deg)' }"
              />
            </div>
            <div v-show="sectionsOpen.categories" :class="$style.options">
              <div
                v-for="item in ['Roupas','Sapatos','Acessórios']"
                :key="item"
                :class="$style.option"
                @click="selectFilter('category', item)"
              >
                <img
                  :src="selectedFilters.category.includes(item)
                    ? radioButtonChecked
                    : radioButtonUnchecked"
                  :class="$style.radio"
                  alt="radio"
                />
                <span :class="$style.label">{{ item }}</span>
              </div>
            </div>
          </section>

          <section :class="$style.group">
            <div :class="$style.head" @click="toggleSection('gender')">
              <span :class="$style.title">GÊNERO</span>
              <img
                :class="$style.icon"
                alt="seta"
                src="@/assets/keyboard_arrow_up.svg"
                :style="{ transform: sectionsOpen.gender ? 'rotate(0deg)' : 'rotate(180deg)' }"
              />
            </div>
            <div v-show="sectionsOpen.gender" :class="$style.options">
              <div
                v-for="item in ['Homem','Mulher','Unissex']"
                :key="item"
                :class="$style.option"
                @click="selectFilter('gender', item)"
              >
                <img
                  :src="selectedFilters.gender.includes(item)
                    ? radioButtonChecked
                    : radioButtonUnchecked"
                  :class="$style.radio"
                  alt="radio"
                />
                <span :class="$style.label">{{ item }}</span>
              </div>
            </div>
          </section>

          <section :class="$style.group">
            <div :class="$style.head" @click="toggleSection('colors')">
              <span :class="$style.title">CORES</span>
              <img
                :class="$style.icon"
                alt="seta"
                src="@/assets/keyboard_arrow_up.svg"
                :style="{ transform: sectionsOpen.colors ? 'rotate(0deg)' : 'rotate(180deg)' }"
              />
            </div>
            <div v-show="sectionsOpen.colors" :class="$style.colors">
              <div
                v-for="cor in ['#000','#ccc','#fff','#383873','#ac4f4f','#fffd8b','#cd57c1']"
                :key="cor"
                :class="$style.colorCircle"
                :style="{ backgroundColor: cor }"
                @click="selectFilter('color', cor)"
              >
                <div
                  v-if="selectedFilters.color.includes(cor)"
                  :class="$style.colorSelected"
                />
              </div>
            </div>
          </section>

          <section :class="$style.group">
            <div :class="$style.head" @click="toggleSection('sizes')">
              <span :class="$style.title">TAMANHOS</span>
              <img
                :class="$style.icon"
                alt="seta"
                src="@/assets/keyboard_arrow_up.svg"
                :style="{ transform: sectionsOpen.sizes ? 'rotate(0deg)' : 'rotate(180deg)' }"
              />
            </div>
            <div v-show="sectionsOpen.sizes" :class="$style.sizes">
              <div
                v-for="size in ['P','M','G','GG']"
                :key="size"
                :class="[$style.sizeBox, { [$style.selected]: selectedFilters.size.includes(size) }]"
                @click="selectFilter('size', size)"
              >
                {{ size }}
              </div>
            </div>
          </section>

          <section :class="$style.group">
            <div :class="$style.head" @click="toggleSection('prices')">
              <span :class="$style.title">PREÇOS</span>
              <img
                :class="$style.icon"
                alt="seta"
                src="@/assets/keyboard_arrow_up.svg"
                :style="{ transform: sectionsOpen.prices ? 'rotate(0deg)' : 'rotate(180deg)' }"
              />
            </div>
            <div v-show="sectionsOpen.prices" :class="$style.priceSection">
              <div :class="$style.rangeWrapper">
                <input
                  type="range"
                  v-model.number="priceRange.min"
                  :min="dynamicPriceRange.min"
                  :max="dynamicPriceRange.max"
                />
                <input
                  type="range"
                  v-model.number="priceRange.max"
                  :min="dynamicPriceRange.min"
                  :max="dynamicPriceRange.max"
                />
              </div>
              <div :class="$style.priceInputs">
                <div>
                  <label>Min</label>
                  <input
                    type="text"
                    :value="`R$ ${priceRange.min.toFixed(2)}`"
                    disabled
                  />
                </div>
                <div>
                  <label>Max</label>
                  <input
                    type="text"
                    :value="`R$ ${priceRange.max.toFixed(2)}`"
                    disabled
                  />
                </div>
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
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Buscar produtos..." 
              class="search-input"
            />
            <img src="@/assets/search.svg" alt="Buscar" class="search-icon" />
          </div>

          <div class="header-right">
            <div class="product-count">
              {{ filteredProducts.length }} produtos encontrados
            </div>

            <div class="view-toggle">
              <button 
                :class="['view-btn', { active: viewMode === 'grid' }]"
                @click="viewMode = 'grid'"
              >
                <img src="@/assets/grid_view.svg" alt="Grid" />
              </button>
              <button 
                :class="['view-btn', { active: viewMode === 'list' }]"
                @click="viewMode = 'list'"
              >
                <img src="@/assets/list_view.svg" alt="List" />
              </button>
            </div>

            <div class="ordenacao" @click="showSortDropdown = !showSortDropdown">
              <img class="keyboard-arrow-up-icon" alt="" src="@/assets/swap_vert.svg" />
              <div class="ordenar-por">Ordenar por:</div>
              <div class="filtro">
                <div class="roupas">{{ sortOptions.find(opt => opt.value === selectedSort)?.label }}</div>
                <img 
                  class="keyboard-arrow-up-icon" 
                  alt="" 
                  src="@/assets/keyboard_arrow_down.svg"
                  :style="{ transform: showSortDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }"
                />
              </div>
              
              <div v-if="showSortDropdown" class="sort-dropdown">
                <div 
                  v-for="option in sortOptions" 
                  :key="option.value"
                  class="sort-option"
                  :class="{ active: selectedSort === option.value }"
                  @click.stop="selectedSort = option.value; showSortDropdown = false"
                >
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
          <transition-group
            name="product-list"
            tag="div"
            class="products-grid"
          >
            <div 
              v-for="product in paginatedProducts" 
              :key="product.id"
              :class="$style.produto01"
            >
              <div :class="$style.imageWrapper">
                <img
                  :class="$style.fotoIcon"
                  :alt="product.name"
                  :src="product.images[0]"
                />
                <button 
                  :class="$style.favoriteBtn"
                  @click="toggleFavorite(product.id)"
                >
                  <img 
                    :src="isFavorite(product.id) ? favoriteIconFilled : favoriteIcon" 
                    alt="Favoritar" 
                  />
                </button>
                <button 
                  :class="$style.addBtn"
                  @click="addToCart(product)"
                >
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
                    <span 
                      v-for="sizeDetail in product.sizeDetails" 
                      :key="sizeDetail.size"
                      :class="[!sizeDetail.available ? $style.unavailable : '']"
                    >
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
              <div class="text5">CARREGAR MAIS ({{ filteredProducts.length - paginatedProducts.length }} restantes)</div>
            </div>
          </button>
        </div>
      </div>
    </div>

    <transition name="toast">
      <div v-if="showToastFlag" class="toast">
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import NavBar from '../components/NavBar.vue'
import { ref, onMounted, computed, watch } from 'vue'
import api from '../services/api'
import type { Product, DisplayProduct } from '../types/product'

import addIcon from '../assets/cards/add.svg'
import favoriteIcon from '../assets/cards/favorite.svg'
import favoriteIconFilled from '../assets/cards/favorite_filled.svg'
import vezzLogo from '../assets/cards/vezz-logo.png'
import radioButtonChecked from '../assets/radio_button_checked.svg'
import radioButtonUnchecked from '../assets/radio_button_unchecked.svg'

const sectionsOpen = ref({
  categories: true,
  gender: true,
  colors: true,
  sizes: true,
  prices: true
})

const selectedFilters = ref({
  category: [] as string[],
  gender: [] as string[],
  color: [] as string[],
  size: [] as string[]
})

const rawProducts = ref<Product[]>([])
const loading = ref(true)

const dynamicPriceRange = computed(() => {
  if (rawProducts.value.length === 0) {
    return { min: 0, max: 1000 }
  }
  
  const prices = rawProducts.value.map(product => product.price)
  const minPrice = Math.floor(Math.min(...prices))
  const maxPrice = Math.ceil(Math.max(...prices))
  
  return { min: minPrice, max: maxPrice }
})

const priceRange = ref({
  min: 0,
  max: 1000
})

const isDragging = ref<'min' | 'max' | null>(null)
const sliderRef = ref<HTMLDivElement | null>(null)

const products = computed<DisplayProduct[]>(() => {
  return rawProducts.value.map((product: Product) => {
    const totalStock = Object.values(product.quantities).reduce((sum: number, qty: number) => sum + qty, 0)
    
    const allSizes = ['P', 'M', 'G', 'GG']
    const availableSizes = allSizes.map(size => ({
      size,
      quantity: product.quantities[size] || 0,
      available: (product.quantities[size] || 0) > 0
    }))

    return {
      id: product.id,
      name: product.title,
      description: `${product.category} - ${product.color}`,
      price: product.price,
      images: [vezzLogo],
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
  'Masculino': 'male',
  'Feminino': 'female',
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
      selectedFilters.value.color.includes(product.color.toLowerCase())
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

const favorites = ref<number[]>([])

const toggleFavorite = (productId: number) => {
  const index = favorites.value.indexOf(productId)
  if (index === -1) {
    favorites.value.push(productId)
  } else {
    favorites.value.splice(index, 1)
  }
}

const isFavorite = (productId: number) => favorites.value.includes(productId)

const addToCart = (product: DisplayProduct) => {
  console.log('Adding to cart:', product)
  showToast('Produto adicionado ao carrinho!')
}

const toastMessage = ref('')
const showToastFlag = ref(false)

const showToast = (message: string) => {
  toastMessage.value = message
  showToastFlag.value = true
  setTimeout(() => {
    showToastFlag.value = false
  }, 3000)
}

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
    
    console.log('Products fetched:', response.data)
    console.log('Price range:', range)
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.products-container {
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;
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
}

.home-catalogo-container {
  position: relative;
  letter-spacing: 0.94px;
  display: flex;
  gap: 8px;
  align-items: center;
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
}

.product {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 48px 71px;
  box-sizing: border-box;
  gap: 32px;
  text-align: left;
  font-size: 14px;
  color: #555;
  background: transparent;
}

.products {
  flex: 1;
  max-width: none;
  width: 100%;
  background: transparent;
}

.products-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  gap: 24px;
  flex-wrap: wrap;
  background: transparent;
}

.search-container {
  position: relative;
  flex: 1;
  max-width: 400px;
  background: transparent;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: transparent;
}

.search-input:focus {
  border-color: #000;
  box-shadow: none;
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
}

.ordenar-por {
  font-weight: 600;
  letter-spacing: 1.25px;
  line-height: 16px;
  font-size: 14px;
}

.filtro {
  padding: 8px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: background 0.2s ease;
  background: transparent;
}

.ordenacao:hover .filtro {
  background: transparent;
}

.keyboard-arrow-up-icon {
  transition: transform 0.3s ease;
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
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-bottom: 64px;
}

.cards.list {
  grid-template-columns: 1fr;
  gap: 16px;
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.toast {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 16px 32px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
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
.filtros { width: 280px; color: #555 }

.contents { display: flex; flex-direction: column; gap: 32px }

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
  cursor: pointer;
  position: relative;
  border-bottom: 1px solid #ddd;
}

.title {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  color: #666;
}

.icon {
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
}

.head::after {
  display: none;
}

.options { margin-top: 8px }
.option {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #999;
  cursor: pointer;
}
.option:hover { color: #000 }
.radio { width: 16px }

.label { font-size: 14px }

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

.priceSection { margin-top: 8px }
.rangeWrapper {
  position: relative;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
  margin-bottom: 16px;
}
.rangeWrapper input[type="range"] {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  transform: translateY(-50%);
  appearance: none;
  -webkit-appearance: none;
  background: transparent;
  pointer-events: none;
}
.rangeWrapper input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: #fff;
  border: 2px solid #439cd3;
  border-radius: 50%;
  cursor: grab;
  pointer-events: all;
}

.priceInputs {
  display: flex;
  gap: 16px;
}
.priceInputs label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  display: block;
}
.priceInputs input {
  border: none;
  background: #f1f1f1;
  padding: 6px 8px;
  border-radius: 4px;
  width: 80px;
  color: #333;
  text-align: center;
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
.clearBtn:hover { background: #333 }

.produto01 {
  width: 100%;
  display: flex;
  flex-direction: column;
  font-family: 'Roboto', sans-serif;
  color: #212121;
}

/* wrapper quadrado */
.imageWrapper {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
  border-radius: 8px;
}
.fotoIcon {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  object-fit: cover;
}

/* botões sobre a imagem */
.favoriteBtn,
.addBtn {
  position: absolute;
  bottom: 8px;
  width: 36px; height: 36px;
  background: #fff;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s ease;
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

/* área de texto abaixo */
.bottom {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
/* linha com nome/preço ou estoque/tamanhos */
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* tipografia */
.nomeDoTerno {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
}
.preco {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
}
.stock {
  font-size: 12px;
  color: #4b4b4b;
}

/* lista de tamanhos */
.sizeList {
  display: flex;
  gap: 8px;
}
.sizeList span {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  color: #212121;
  cursor: default;
  padding: 2px 4px;
}
.sizeList .unavailable {
  color: #bebebe;
  font-weight: 400;
}
</style>
