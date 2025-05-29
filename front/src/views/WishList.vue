<template>
  <div>
    <NavBar />
    <div :class="[$style.main, { [$style.darkMode]: darkModeStore.isDark }]">
      <div :class="$style.contents">
        <div :class="$style.header">
          <div :class="$style.listaDeFavoritos">Lista de Favoritos</div>
          <div :class="$style.body">
            <div :class="$style.searchBar">
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Busque pelo nome" 
                :class="$style.searchInput"
              />
              <img :src="searchIcon" alt="Buscar" :class="$style.searchIcon" />
            </div>
            
            <div :class="$style.headerRight">
              
              
              <div :class="$style.ordenao" @click="showSortDropdown = !showSortDropdown">
                <img :class="$style.swapVertIcon" alt="" :src="swapVertIcon" />
                <div :class="$style.ordenarPor">Ordenar por:</div>
                <div :class="$style.filtro">
                  <div :class="$style.maisProcurados">{{ sortOptions.find(opt => opt.value === selectedSort)?.label }}</div>
                  <img 
                    :class="$style.swapVertIcon" 
                    alt="" 
                    :src="keyboardArrowDownIcon"
                    :style="{ transform: showSortDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }"
                  />
                </div>
                
                <div v-if="showSortDropdown" :class="$style.sortDropdown">
                  <div 
                    v-for="option in sortOptions" 
                    :key="option.value"
                    :class="[$style.sortOption, { [$style.active]: selectedSort === option.value }]"
                    @click.stop="selectedSort = option.value; showSortDropdown = false"
                  >
                    {{ option.label }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div :class="[$style.container, viewMode]">
          <div v-if="loading" :class="$style.loading">
            <div :class="$style.loadingSpinner"></div>
            <p>Carregando produtos...</p>
          </div>
          <transition-group
            v-else
            name="wishlist-items"
            tag="div"
            :class="$style.productsGrid"
          >
            <div 
              v-for="(product, index) in filteredAndSortedProducts" 
              :key="product.id"
              :class="$style.produto01"
            >
              <div :class="$style.body1">
                <div :class="$style.product">
                  <div :class="$style.foto">
                    <div :class="$style.wrapper">
                      <div :class="$style.div">{{ index + 1 }}°</div>
                    </div>
                    <img :class="$style.photoIcon" alt="" :src="product.image" />
                  </div>
                  <div :class="$style.contentsRight">
                    <div :class="$style.infoProduct">
                      <div :class="$style.productInfo">
                        <div :class="$style.nomeDoTerno">{{ product.name }}</div>
                        <div :class="$style.textBottom">
                          <div :class="$style.div">R$ {{ product.price.toFixed(2).replace('.', ',') }}</div>
                          <div :class="$style.div1">|</div>
                          <div :class="[$style.emEstoque, !product.inStock && $style.outOfStock]">
                            {{ product.inStock ? 'Em Estoque' : 'Fora de Estoque' }}
                          </div>
                        </div>
                        <div v-if="product.inStock" :class="$style.sizeSelector">
                          <select v-model="product.selectedSize" :class="$style.sizeSelect">
                            <option value="" disabled>Selecione o tamanho</option>
                            <option v-for="size in getAvailableSizes(product)" :key="size" :value="size">
                              {{ size }}
                            </option>
                          </select>
                        </div>
                      </div>
                      <div :class="$style.favoriteParent">
                        <img :class="$style.swapVertIcon" alt="" :src="favoriteIconFilled" />
                        <img 
                          v-if="product.inStock"
                          :class="$style.icon" 
                          alt="Adicionar" 
                          :src="darkModeStore.isDark ? addIconWhite : addIcon"
                          @click.stop="addToCart(product)"
                        />
                        <img 
                          :class="$style.deleteIcon" 
                          alt="" 
                          :src="deleteIcon"
                          @click="removeFromWishlist(product.id)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition-group>
          
          <div v-if="!loading && filteredAndSortedProducts.length === 0" :class="$style.noProducts">
            <img :src="emptyStateIcon" alt="Nenhum produto" />
            <p>Nenhum produto encontrado</p>
            <button v-if="searchQuery" @click="searchQuery = ''" :class="$style.clearSearchBtn">
              Limpar Busca
            </button>
          </div>
          <div :class="$style.vDivider" />
          <div :class="$style.price">
            <div :class="$style.priceRow">
              <div :class="$style.priceLabel">Subtotal</div>
              <div :class="$style.priceValue">R$ {{ subtotal.toFixed(2) }}</div>
            </div>
            <div :class="$style.priceRow">
              <div :class="$style.priceLabel">Total</div>
              <div :class="$style.priceValue">R$ {{ subtotal.toFixed(2) }}</div>
            </div>
          </div>
          <div :class="$style.vDivider" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { useFavoritesStore } from '@/stores/favorites'
import { useCartStore } from '@/stores/cart'
import { useDarkModeStore } from '@/stores/darkMode'
import { useToast } from 'vue-toastification'
import api from '@/services/api'
import swapVertIcon from '../assets/swap_vert.svg'
import keyboardArrowDownIcon from '../assets/keyboard_arrow_down.svg'
import favoriteIconFilled from '../assets/cards/favorite_filled.svg'
import deleteIcon from '../assets/delete.svg'
import searchIcon from '../assets/search.svg'
import gridViewIcon from '../assets/grid_view.svg'
import listViewIcon from '../assets/list_view.svg'
import emptyStateIcon from '../assets/empty_state.svg'
import addIcon from '@/assets/cards/add.svg'
import addIconWhite from '@/assets/cards/add-white.svg'

interface Product {
  id: number;
  title: string;
  price: number;
  picture?: string;
  category: string;
  quantities: Record<string, number>;
}

interface WishlistProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
  category: string;
  dateAdded: Date;
  selectedSize?: string;
  quantities: Record<string, number>;
}

const router = useRouter()
const favoritesStore = useFavoritesStore()
const cartStore = useCartStore()
const darkModeStore = useDarkModeStore()
const toast = useToast()
const searchQuery = ref('')
const viewMode = ref('grid')
const selectedSort = ref('featured')
const showSortDropdown = ref(false)
const loading = ref(true)
const rawProducts = ref<Product[]>([])

const subtotal = computed(() => {
  return wishlistProducts.value.reduce((total, product) => total + product.price, 0)
})

const sortOptions = [
  { value: 'featured', label: 'Mais Procurados' },
  { value: 'price-asc', label: 'Menor Preço' },
  { value: 'price-desc', label: 'Maior Preço' },
  { value: 'name-asc', label: 'Nome A-Z' },
  { value: 'name-desc', label: 'Nome Z-A' },
  { value: 'date-desc', label: 'Mais Recentes' },
  { value: 'date-asc', label: 'Mais Antigos' }
]

const fetchProducts = async () => {
  try {
    loading.value = true
    const response = await api.get('/products')
    rawProducts.value = response.data
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

const wishlistProducts = computed<WishlistProduct[]>(() => {
  return rawProducts.value
    .filter(product => favoritesStore.isFavorite(product.id))
    .map(product => {
      const totalStock = Object.values(product.quantities || {}).reduce((sum, qty) => sum + qty, 0)
      const fallbackImage = 'https://res.cloudinary.com/dtuxy5k7v/image/upload/v1748493239/file_pdysef.png'
      const productImage = product.picture && product.picture.trim() !== '' ? product.picture : fallbackImage

      return {
        id: product.id,
        name: product.title,
        price: product.price,
        image: productImage,
        inStock: totalStock > 0,
        category: product.category,
        dateAdded: new Date(),
        selectedSize: undefined,
        quantities: product.quantities || {}
      }
    })
})

const filteredAndSortedProducts = computed(() => {
  let filtered = wishlistProducts.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    )
  }

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
    case 'date-desc':
      sorted.sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime())
      break
    case 'date-asc':
      sorted.sort((a, b) => a.dateAdded.getTime() - b.dateAdded.getTime())
      break
  }

  return sorted
})

const removeFromWishlist = (productId: number) => {
  favoritesStore.removeFromFavorites(productId)
}

const getAvailableSizes = (product: WishlistProduct) => {
  const quantities = product.quantities || {}
  return Object.entries(quantities)
    .filter(([_, quantity]) => quantity > 0)
    .map(([size]) => size)
}

const addToCart = async (product: WishlistProduct) => {
  if (!product.selectedSize) {
    toast.error('Selecione um tamanho')
    return
  }

  try {
    // Verificar estoque atual
    const response = await api.get(`/products/${product.id}`)
    const currentProduct = response.data
    const availableQuantity = currentProduct.quantities[product.selectedSize] || 0

    if (availableQuantity <= 0) {
      toast.error('Produto indisponível neste tamanho')
      return
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: product.selectedSize,
      quantity: 1
    }

    cartStore.addToCart(cartItem)
    toast.success('Produto adicionado ao carrinho!')
  } catch (error) {
    console.error('Erro ao adicionar ao carrinho:', error)
    toast.error('Erro ao adicionar ao carrinho')
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<style module>
.main {
  width: 100%;
  position: relative;
  min-height: calc(100vh - 88px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 46px 0;
  box-sizing: border-box;
  text-align: center;
  font-size: 24px;
  background-color: var(--page-bg);
  color: var(--text-primary);
  font-family: Roboto;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: var(--text-secondary);
}

.loadingSpinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--accent-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.listaDeFavoritos {
  position: relative;
  letter-spacing: 1.25px;
  line-height: 32px;
  font-weight: 500;
  color: var(--text-primary);
}

.busquePeloNome {
  position: relative;
  letter-spacing: 1px;
  line-height: 70px;
}

.label {
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid #d7d7d7;
  box-sizing: border-box;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 12px 16px;
}

.searchBar {
  position: relative;
  width: 540px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.searchInput {
  width: 100%;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  box-sizing: border-box;
  height: 40px;
  padding: 12px 40px 12px 16px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: var(--input-bg);
  color: var(--text-primary);
}

.searchInput::placeholder {
  color: var(--text-disabled);
}

.searchInput:focus {
  outline: none;
  border-color: var(--accent-color);
}

.searchIcon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  opacity: 0.7;
  filter: var(--icon-filter);
}

.headerRight {
  display: flex;
  align-items: center;
  gap: 24px;
}

.viewToggle {
  display: flex;
  border-radius: 8px;
  padding: 4px;
  gap: 4px;
  background: transparent;
}

.viewBtn {
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

.viewBtn.active {
  background: #efefef;
}

.viewBtn img {
  width: 20px;
  height: 20px;
  opacity: 0.6;
}

.viewBtn.active img {
  opacity: 1;
}

.ordenarPor {
  position: relative;
  letter-spacing: 1.25px;
  line-height: 16px;
  font-weight: 600;
  color: var(--text-secondary);
}

.maisProcurados {
  position: relative;
  letter-spacing: 1.25px;
  line-height: 16px;
  color: var(--text-primary);
}

.filtro {
  border-radius: 8px;
  background-color: var(--input-bg);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  gap: 4px;
  font-size: 16px;
}

.ordenao {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-align: center;
  font-size: 24px;
  color: #fff;
  position: relative;
  cursor: pointer;
}

.body {
  align-self: stretch;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  text-align: left;
  font-size: 12px;
  color: #757575;
}

.header {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0px 72px;
  gap: 8px;
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
}

.div {
  position: relative;
  letter-spacing: 1.25px;
  line-height: 16px;
  text-transform: uppercase;
  font-weight: 500;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
}

.wrapper .div {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .wrapper {
    position: absolute;
    top: 16px;
    left: 16px;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 50%;
    width: 32px;
    height: 32px;
    padding: 0;
    z-index: 2;
  }

  .wrapper .div {
    color: white;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .wrapper {
    width: 28px;
    height: 28px;
    top: 12px;
    left: 12px;
  }

  .wrapper .div {
    font-size: 12px;
  }
}

.photoIcon {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.foto {
  min-width: 200px;
  max-width: 200px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 1;
}

.nomeDoTerno {
  font-size: 24px;
  line-height: 1.2;
  letter-spacing: 1.25px;
  color: var(--text-primary);
  margin: 0;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.div1 {
  position: relative;
  font-size: 15px;
  letter-spacing: 1.25px;
  line-height: 16px;
  text-transform: uppercase;
  font-weight: 500;
  color: var(--text-tertiary);
}

.emEstoque {
  position: relative;
  letter-spacing: 1.25px;
  line-height: 70px;
  font-weight: 600;
  color: var(--stock-color);
  text-align: left;
}

.textBottom {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 16px;
  color: var(--text-secondary);
}

.textLeft {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.swapVertIcon {
  width: 24px;
  height: 24px;
  position: relative;
  cursor: pointer;
  filter: var(--icon-filter);
  opacity: 0.9;
}

.deleteIcon {
  width: 24px;
  height: 24px;
  position: relative;
  cursor: pointer;
  filter: var(--icon-filter);
  opacity: 0.9;
  transition: transform 0.2s ease;
}

.deleteIcon:hover {
  transform: scale(1.2);
}

.favoriteParent {
  display: flex;
  gap: 16px;
  padding: 4px;
  flex-shrink: 0;
}

.favoriteParent .swapVertIcon {
  width: 24px;
  height: 24px;
  color: #ff4444 !important;
  fill: #ff4444 !important;
  filter: none !important;
  transition: transform 0.2s ease;
}

.favoriteParent .swapVertIcon:hover {
  transform: scale(1.2);
  cursor: pointer;
}

.infoProduct {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.productInfo {
  margin-left: 5vh;
  width: 100%;  
  display: flex;
  min-width: 0;
  align-items: flex-start;
  flex-wrap: nowrap;
  flex-direction: column;
}

.contentsRight {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 0;
  min-width: 0;
}

.product {
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 24px;
  position: relative;
}

.body1 {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}

.produto01 {
  width: 100%;
  max-width: 1022px;
  border-radius: 16px;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 16px;
  transition: all 0.3s ease;
  margin-bottom: 16px;
  position: relative;
}

.container {
  align-self: stretch;
  flex: 1;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 72px;
  gap: 32px;
  font-size: 16px;
  color: #a2a2a2;
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
}

.contents {
  align-self: stretch;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 12px;
  width: 100%;
}

.sortDropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: var(--dropdown-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 200px;
}

.sortOption {
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  font-size: 14px;
  color: var(--text-primary);
}

.sortOption:hover {
  background: var(--dropdown-hover);
}

.sortOption.active {
  background: var(--dropdown-active);
  color: var(--dropdown-active-text);
}

.productsGrid {
  display: contents;
}

.noProducts {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}

.noProducts img {
  width: 120px;
  height: 120px;
  margin-bottom: 24px;
  opacity: 0.9;
  filter: var(--icon-filter);
}

.noProducts p {
  font-size: 18px;
  margin-bottom: 24px;
}

.clearSearchBtn {
  background: var(--button-bg);
  color: var(--button-text);
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  letter-spacing: 1.25px;
  transition: background 0.2s ease;
}

.clearSearchBtn:hover {
  background: var(--button-hover);
}

/* Estilos para modo lista */
.container.list {
  padding: 32px 72px;
}

.container.list .produto01 {
  margin-bottom: 16px;
}

.container.list .product {
  display: flex;
  align-items: center;
  gap: 24px;
}

.container.list .foto {
  width: 120px;
  min-width: 120px;
  height: 120px;
}

.container.list .photoIcon {
  width: 100px;
  height: 100px;
}

.container.list .contentsRight {
  padding: 0;
}

/* Animações */
.wishlist-items-enter-active,
.wishlist-items-leave-active {
  transition: all 0.3s ease;
}

.wishlist-items-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.wishlist-items-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.wishlist-items-move {
  transition: transform 0.3s ease;
}


/* Responsividade para os novos elementos */
@media (max-width: 900px) {
  .headerRight {
    width: 100%;
    justify-content: space-between;
  }
  
  .viewToggle {
    order: 2;
  }
  
  .ordenao {
    order: 1;
    font-size: 18px;
  }
  
  .sortDropdown {
    left: 0;
    right: auto;
  }
}

@media (max-width: 640px) {
  .price {
    align-items: stretch !important;
    padding: 16px !important;
    text-align: initial !important;
  }

  .priceRow {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    width: 100% !important;
    padding: 8px 0 !important;
  }

  .priceLabel {
    font-size: 16px;
    font-weight: 500;
    text-align: left;
    color: var(--text-primary);
  }

  .priceValue {
    font-size: 16px;
    font-weight: 500;
    text-align: right;
    color: var(--text-primary);
  }

  .spacer {
    height: 16px;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 0 16px;
  }

  .container {
    padding: 16px;
  }

  .searchBar {
    width: 100%;
    margin-bottom: 16px;
  }

  .body {
    flex-direction: column;
    align-items: stretch;
  }

  .headerRight {
    width: 100%;
  }

  .product {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16px;
  }

  .foto {
    min-width: unset;
    max-width: unset;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .photoIcon {
    width: 200px;
    height: 200px;
    object-fit: cover;
  }

  .wrapper {
    right: unset;
    left: 16px;
  }

  .wrapper .div {
    color: white;
    font-size: 14px;
  }

  .contentsRight {
    width: 100%;
    padding: 0;
  }

  .infoProduct {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .productInfo {
    align-items: center;
    text-align: center;
  }

  .nomeDoTerno {
    text-align: center;
  }

  .textBottom {
    justify-content: center;
  }

  .sizeSelector {
    max-width: 50%;
  }

  .favoriteParent {
    width: 100%;
    justify-content: center;
    margin-top: 16px;
  }
}

@media (max-width: 480px) {
  .price {
    align-items: stretch;
    padding: 16px;
  }

  .priceRow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 8px 0;
  }

  .priceLabel {
    font-size: 16px;
    font-weight: 500;
    text-align: left;
    color: var(--text-primary);
  }

  .priceValue {
    font-size: 16px;
    font-weight: 500;
    text-align: right;
    color: var(--text-primary);
  }

  .spacer {
    height: 16px;
  }
}


/* Add smooth transitions for responsive changes */
.product,
.foto,
.photoIcon,
.contentsRight,
.infoProduct,
.textLeft,
.favoriteParent {
  transition: all 0.3s ease;
}

:root {
  /* Light theme */
  --page-bg: #f5f5f5;
  --card-bg: #ffffff;
  --text-primary: #212121;
  --text-secondary: #414141;
  --text-disabled: #757575;
  --border-color: #d9d9d9;
  --border-color-hover: #414141;
  --input-bg: #ffffff;
  --input-bg-disabled: #f5f5f5;
  --divider-color: rgba(154, 154, 154, 0.42);
  --accent-color: #2baeff;
  --button-bg: #2baeff;
  --button-hover: #1a9eef;
  --button-text: #ffffff;
  --dropdown-bg: #ffffff;
  --dropdown-hover: #f5f5f5;
  --dropdown-active: #e0e0e0;
  --dropdown-text: #212121;
  --dropdown-active-text: #2baeff;
  --icon-filter: none;
  --stock-color: #2baeff;
  --title-text: #212121;
  --order-by-text: #212121;
}

.darkMode {
  --page-bg: #121212;
  --card-bg: #1e1e1e;
  --text-primary: #ffffff;
  --text-secondary: #e0e0e0;
  --text-disabled: #bdbdbd;
  --border-color: #404040;
  --border-color-hover: #666666;
  --input-bg: #2d2d2d;
  --input-bg-disabled: #1a1a1a;
  --divider-color: rgba(255, 255, 255, 0.15);
  --accent-color: #64B5F6;
  --button-bg: #2baeff;
  --button-hover: #1a9eef;
  --button-text: #ffffff;
  --dropdown-bg: #2d2d2d;
  --dropdown-hover: #3d3d3d;
  --dropdown-active: #4d4d4d;
  --dropdown-text: #ffffff;
  --dropdown-active-text: #64B5F6;
  --icon-filter: brightness(0) invert(1);
  --stock-color: #64B5F6;
}

/* Update specific dark mode styles */
[data-theme="dark"] .main {
  background-color: var(--page-bg);
}

[data-theme="dark"] .produto01 {
  background-color: var(--card-bg);
  border-color: var(--border-color);
}

[data-theme="dark"] .nomeDoTerno {
  color: var(--text-primary);
}

[data-theme="dark"] .textBottom {
  color: var(--text-secondary);
}

[data-theme="dark"] .div1 {
  color: var(--text-tertiary);
}

[data-theme="dark"] .searchInput {
  background-color: var(--input-bg);
  color: var(--text-primary);
  border-color: var(--border-color);
}

[data-theme="dark"] .searchInput::placeholder {
  color: var(--text-disabled);
}

[data-theme="dark"] .filtro {
  background-color: var(--input-bg);
  border-color: var(--border-color);
}

[data-theme="dark"] .maisProcurados {
  color: var(--text-primary);
}

[data-theme="dark"] .ordenarPor {
  color: var(--text-secondary);
}

[data-theme="dark"] .sortDropdown {
  background-color: var(--dropdown-bg);
  border-color: var(--border-color);
}

[data-theme="dark"] .sortOption {
  color: var(--text-primary);
}

[data-theme="dark"] .sortOption:hover {
  background-color: var(--dropdown-hover);
}

[data-theme="dark"] .sortOption.active {
  background-color: var(--dropdown-active);
  color: var(--dropdown-active-text);
}

[data-theme="dark"] .noProducts {
  color: var(--text-secondary);
}

[data-theme="dark"] .noProducts img {
  filter: var(--icon-filter);
  opacity: 0.9;
}

[data-theme="dark"] .clearSearchBtn {
  background-color: var(--button-bg);
  color: var(--button-text);
}

[data-theme="dark"] .clearSearchBtn:hover {
  background-color: var(--button-hover);
}

/* Ensure icons are visible in dark mode */
[data-theme="dark"] .swapVertIcon,
[data-theme="dark"] .searchIcon,
[data-theme="dark"] .deleteIcon {
  filter: var(--icon-filter);
  opacity: 0.9;
}

.addToCartSection {
  width: 100%;
  display: flex;
  gap: 16px;
  align-items: center;
  margin-top: 16px;
}

.sizeSelector {
  width: 50%;
  margin-top: 8px;
}

.sizeSelect {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--input-bg);
  color: var(--text-color);
  font-size: 14px;
  cursor: pointer;
  outline: none;
  transition: border-color 0.3s ease;
}

.sizeSelect:hover {
  border-color: var(--primary-color);
}

.sizeSelect:focus {
  border-color: var(--primary-color);
}

.icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: transform 0.2s ease;
  opacity: 0.9;
  filter: var(--icon-filter);
}

.icon:hover {
  transform: scale(1.2);
  opacity: 1;
}

.favoriteParent {
  display: flex;
  gap: 16px;
  padding: 4px;
  align-items: center;
}

.favoriteParent .swapVertIcon {
  width: 24px;
  height: 24px;
  color: #ff4444 !important;
  fill: #ff4444 !important;
  filter: none !important;
  transition: transform 0.2s ease;
}

.favoriteParent .swapVertIcon:hover {
  transform: scale(1.2);
  cursor: pointer;
}

.deleteIcon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: transform 0.2s ease;
  opacity: 0.9;
  filter: var(--icon-filter);
}

.deleteIcon:hover {
  transform: scale(1.2);
  opacity: 1;
}

@media (max-width: 768px) {
  .price {
    align-items: stretch; /* Remove o alinhamento à direita */
    padding: 16px;
  }

  .priceRow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    width: 100%;
  }

  .priceLabel {
    text-align: left;
    font-size: 16px;
    font-weight: 500;
    color: var(--text-primary);
  }

  .priceValue {
    text-align: right;
    font-size: 16px;
    font-weight: 500;
    color: var(--text-primary);
  }

  .spacer {
    height: 16px;
  }
}


.price {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  /* text-align: initial !important; REMOVIDO PARA NÃO CONFLITAR COM RESPONSIVO */
}

.priceRow {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.priceLabel {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-color);
}

.priceValue {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-color);
}

@media (max-width: 640px) {
  .price {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
  }

  .priceRow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 8px 0;
  }

  .priceLabel,
  .priceValue {
    font-size: 16px;
    font-weight: 500;
    color: var(--text-primary);
  }

  .priceLabel {
    text-align: left;
  }

  .priceValue {
    text-align: right;
  }

  .spacer {
    height: 16px;
  }
}




</style>
