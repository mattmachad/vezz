<template>
  <div>
    <NavBar />
    <div :class="$style.main">
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
              <div :class="$style.viewToggle">
                <button 
                  :class="[$style.viewBtn, { [$style.active]: viewMode === 'grid' }]"
                  @click="viewMode = 'grid'"
                >
                  <img :src="gridViewIcon" alt="Grid" />
                </button>
                <button 
                  :class="[$style.viewBtn, { [$style.active]: viewMode === 'list' }]"
                  @click="viewMode = 'list'"
                >
                  <img :src="listViewIcon" alt="List" />
                </button>
              </div>
              
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
                      <div :class="$style.textLeft">
                        <div :class="$style.nomeDoTerno">{{ product.name }}</div>
                        <div :class="$style.textBottom">
                          <div :class="$style.div">R$ {{ product.price.toFixed(2).replace('.', ',') }}</div>
                          <div :class="$style.div1">|</div>
                          <div :class="$style.emEstoque">{{ product.inStock ? 'Em Estoque' : 'Fora de Estoque' }}</div>
                        </div>
                      </div>
                      <div :class="$style.favoriteParent">
                        <img :class="$style.swapVertIcon" alt="" :src="favoriteIconFilled" />
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
import api from '@/services/api'
import swapVertIcon from '../assets/swap_vert.svg'
import keyboardArrowDownIcon from '../assets/keyboard_arrow_down.svg'
import favoriteIconFilled from '../assets/cards/favorite_filled.svg'
import deleteIcon from '../assets/delete.svg'
import searchIcon from '../assets/search.svg'
import gridViewIcon from '../assets/grid_view.svg'
import listViewIcon from '../assets/list_view.svg'
import emptyStateIcon from '../assets/empty_state.svg'

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
}

const router = useRouter()
const favoritesStore = useFavoritesStore()
const searchQuery = ref('')
const viewMode = ref('grid')
const selectedSort = ref('featured')
const showSortDropdown = ref(false)
const loading = ref(true)
const rawProducts = ref<Product[]>([])

// Opções de ordenação
const sortOptions = [
  { value: 'featured', label: 'Mais Procurados' },
  { value: 'price-asc', label: 'Menor Preço' },
  { value: 'price-desc', label: 'Maior Preço' },
  { value: 'name-asc', label: 'Nome A-Z' },
  { value: 'name-desc', label: 'Nome Z-A' },
  { value: 'date-desc', label: 'Mais Recentes' },
  { value: 'date-asc', label: 'Mais Antigos' }
]

// Buscar todos os produtos
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

// Computed para obter apenas os produtos favoritados
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
        dateAdded: new Date() // Podemos adicionar uma data real depois
      }
    })
})

// Computed para filtrar e ordenar produtos
const filteredAndSortedProducts = computed(() => {
  let filtered = wishlistProducts.value
  
  // Aplicar busca
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    )
  }
  
  // Aplicar ordenação
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

// Função para remover da wishlist
const removeFromWishlist = (productId: number) => {
  favoritesStore.removeFromFavorites(productId)
}

onMounted(() => {
  fetchProducts()
})
</script>

<style module>
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #666;
}

.loadingSpinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #000;
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
  border: 1px solid #d7d7d7;
  box-sizing: border-box;
  height: 40px;
  padding: 12px 40px 12px 16px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: transparent;
  font-family: 'Roboto', sans-serif;
}

.searchInput:focus {
  outline: none;
  border-color: #000;
}

.searchIcon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  opacity: 0.5;
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
}

.maisProcurados {
  position: relative;
  letter-spacing: 1.25px;
  line-height: 16px;
}

.filtro {
  border-radius: 8px;
  background-color: #efefef;
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
  color: #555;
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
  align-self: stretch;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}

.photoIcon {
  width: 207.6px;
  height: 206px;
  object-fit: cover;
}

.foto {
  width: 247.6px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
}

.nomeDoTerno {
  position: relative;
  letter-spacing: 1.25px;
  line-height: 70px;
}

.div1 {
  position: relative;
  font-size: 15px;
  letter-spacing: 1.25px;
  line-height: 16px;
  text-transform: uppercase;
  font-weight: 500;
  color: #c9c9c9;
}

.emEstoque {
  position: relative;
  letter-spacing: 1.25px;
  line-height: 70px;
  font-weight: 600;
  color: #439cd3;
  text-align: left;
}

.textBottom {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
  text-align: center;
  font-size: 16px;
  color: #a2a2a2;
}

.textLeft {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 16px;
}

.swapVertIcon {
  width: 24px;
  height: 24px;
  position: relative;
  cursor: pointer;
}

.deleteIcon {
  width: 24px;
  height: 24px;
  position: relative;
  cursor: pointer;
}

.favoriteParent {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
}

.favoriteParent img {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.favoriteParent img:hover {
  transform: scale(1.1);
}

.infoProduct {
  align-self: stretch;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 0px;
}

.contentsRight {
  align-self: stretch;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 64px 0px 0px;
  text-align: left;
  font-size: 24px;
  color: #414141;
}

.product {
  align-self: stretch;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 24px;
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
  background-color: #fafafa;
  border: 1px solid #d9d9d9;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 16px;
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
  color: #212121;
  font-family: Roboto;
}

.sortDropdown {
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

.sortOption {
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  font-size: 14px;
  color: #555;
}

.sortOption:hover {
  background: #f5f5f5;
}

.sortOption.active {
  background: #000;
  color: white;
}

.sortOption:first-child {
  border-radius: 8px 8px 0 0;
}

.sortOption:last-child {
  border-radius: 0 0 8px 8px;
}

.productsGrid {
  display: contents;
}

.noProducts {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.noProducts img {
  width: 120px;
  height: 120px;
  margin-bottom: 24px;
  opacity: 0.5;
}

.noProducts p {
  font-size: 18px;
  margin-bottom: 24px;
}

.clearSearchBtn {
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

.clearSearchBtn:hover {
  background: #333;
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

@media (max-width: 600px) {
  .headerRight {
    flex-direction: column;
    gap: 16px;
  }
  
  .viewToggle {
    width: 100%;
    justify-content: center;
  }
  
  .ordenao {
    width: 100%;
    justify-content: space-between;
  }
  
  .sortDropdown {
    width: calc(100% + 32px);
    left: -16px;
  }
}
</style>
