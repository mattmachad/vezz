<template>
  <NavBar />
  <div class="product-details">
    <div class="container" v-if="product">
      <div class="product-images">
        <img :src="product.image" :alt="product.name" class="main-image" />
      </div>
      
      <div class="product-info">
        <h1>{{ product.name }}</h1>
        <p class="price">R$ {{ product.price?.toFixed(2) }}</p>
        
        <div class="size-selector">
          <label>Tamanho</label>
          <div class="size-options">
            <button 
              v-for="size in availableSizes" 
              :key="size"
              :class="['size-button', { active: selectedSize === size }]"
              @click="selectedSize = size"
            >
              {{ size }}
            </button>
          </div>
        </div>

        <div class="quantity-selector">
          <label>Quantidade</label>
          <div class="quantity-controls">
            <button @click="decrementQuantity" :disabled="quantity <= 1">-</button>
            <span>{{ quantity }}</span>
            <button @click="incrementQuantity" :disabled="quantity >= maxQuantity">+</button>
          </div>
        </div>

        <button 
          class="add-to-cart"
          @click="addToCart"
          :disabled="!selectedSize"
        >
          ADICIONAR AO CARRINHO
        </button>

        <div class="product-description">
          <h2>Descrição</h2>
          <p>{{ product.description }}</p>
        </div>
      </div>
    </div>

    <div v-else class="loading">
      Carregando...
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import NavBar from '@/components/NavBar.vue'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

interface Product {
  id: number
  name: string
  price: number
  description: string
  image: string
  quantities: {
    [key: string]: number
  }
}

const product = ref<Product | null>(null)
const selectedSize = ref('')
const quantity = ref(1)
const maxQuantity = ref(1)

const availableSizes = ref<string[]>([])

onMounted(async () => {
  try {
    const response = await api.get<Product>(`/products/${route.params.id}`)
    product.value = response.data
    
    // Get available sizes (sizes with quantity > 0)
    availableSizes.value = Object.entries(product.value.quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([size]) => size)
      .sort()

  } catch (error) {
    console.error('Error fetching product:', error)
    router.push('/products')
  }
})

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const incrementQuantity = () => {
  if (product.value && selectedSize.value) {
    const availableQuantity = product.value.quantities[selectedSize.value] || 0
    if (quantity.value < availableQuantity) {
      quantity.value++
    }
  }
}

const addToCart = () => {
  if (!product.value || !selectedSize.value) return

  const item = {
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    image: product.value.image,
    size: selectedSize.value,
    quantity: quantity.value
  }

  cartStore.addToCart(item)
  router.push('/checkout')
}

watch(selectedSize, (newSize: string) => {
  if (product.value && newSize) {
    maxQuantity.value = product.value.quantities[newSize] || 0
    quantity.value = 1 // Reset quantity when size changes
  }
})
</script>

<style scoped>
.product-details {
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
}

.product-images {
  position: sticky;
  top: 32px;
}

.main-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

h1 {
  font-size: 32px;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.price {
  font-size: 24px;
  font-weight: 500;
  color: #000;
  margin: 0;
}

.size-selector, .quantity-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.size-options {
  display: flex;
  gap: 8px;
}

.size-button {
  padding: 12px 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.size-button:hover {
  border-color: #000;
}

.size-button.active {
  background: #000;
  color: white;
  border-color: #000;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  width: fit-content;
}

.quantity-controls button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 0 8px;
  color: #666;
}

.quantity-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-controls span {
  min-width: 40px;
  text-align: center;
  font-size: 16px;
}

.add-to-cart {
  background-color: #000;
  color: white;
  padding: 16px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 16px;
}

.add-to-cart:hover {
  background-color: #333;
}

.add-to-cart:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.product-description {
  margin-top: 32px;
}

.product-description h2 {
  font-size: 20px;
  font-weight: 500;
  color: #333;
  margin-bottom: 16px;
}

.product-description p {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
}

.loading {
  text-align: center;
  padding: 48px;
  font-size: 18px;
  color: #666;
}

@media (max-width: 768px) {
  .product-details {
    padding: 16px;
  }

  .container {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .product-images {
    position: static;
  }

  h1 {
    font-size: 24px;
  }

  .price {
    font-size: 20px;
  }
}
</style> 