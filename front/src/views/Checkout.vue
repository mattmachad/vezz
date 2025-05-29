<template>
  <NavBar />
  <!-- Toast notification -->
  <div v-if="showToast" :class="$style.toast">
    {{ toastMessage }}
  </div>
  <div :class="$style.shoppingCart">
    <div :class="$style.main">
      <!-- Esquerda: Carrinho -->
      <div :class="$style.left">
        <div :class="$style.contents">
          <div :class="$style.head">
            <div :class="$style.carrinho">Carrinho</div>
            <div :class="$style.vDivider" />
          </div>

          <div v-if="!cartStore?.items?.length" :class="$style.emptyCart" @click="showEmptyCartMessage">
            <img :class="$style.emptyCartIcon" src="@/assets/shopping-cart.svg" alt="Carrinho Vazio" />
            <h2 :class="$style.emptyCartTitle">Seu carrinho está vazio</h2>
            <p :class="$style.emptyCartText">
              Parece que você ainda não adicionou nenhum item ao seu carrinho.
              Que tal começar a comprar agora?
            </p>
            <button :class="$style.vBtn1" @click.stop="continueShopping">
              <span :class="$style.text">CONTINUAR COMPRANDO</span>
            </button>
          </div>

          <div v-for="item in cartStore?.items || []" :key="`${item.id}-${item.size}`" :class="$style.product">
            <img :class="$style.photoIcon" alt="" :src="item.image" />
            <div :class="$style.contentsRight">
              <div :class="$style.infoProduct">
                <div :class="$style.textLeft">
                  <div :class="$style.nomeDoTerno">{{ item.name }}</div>
                  <div :class="$style.textBottom">
                    <div :class="$style.r19999">R$ {{ item.price.toFixed(2) }}</div>
                    <div :class="$style.div">|</div>
                    <div :class="$style.emEstoque">Em Estoque</div>
                  </div>
                </div>
                <div :class="$style.r199991">R$ {{ (item.price * item.quantity).toFixed(2) }}</div>
              </div>
              <div :class="$style.body">
                <div :class="$style.left1">
                  <div :class="$style.tamanho">
                    <select v-model="item.size" :class="$style.sizeSelect"
                      @focus="checkAndUpdateStock(item.id, item.size)" @change="onSizeChange($event, item)">
                      <option v-for="size in getAvailableSizes(item.id)" :key="size" :value="size"
                        :disabled="getAvailableQuantity(item.id, size) === 0">
                        {{ size }}
                      </option>
                    </select>
                  </div>
                  <div :class="$style.quantidade">
                    <img :class="$style.swapVertIcon" alt="diminuir" src="@/assets/check_indeterminate_small.svg"
                      @click="updateQuantity(item.id, item.size, item.quantity - 1)" />
                    <input v-model.number="item.quantity" type="number" min="1"
                      :max="getAvailableQuantity(item.id, item.size)" :class="$style.quantityInput"
                      @input="validateQuantity(item)" />
                    <img
                      :class="[$style.swapVertIcon, item.quantity >= getAvailableQuantity(item.id, item.size) ? $style.disabled : '']"
                      alt="aumentar" src="@/assets/add.svg"
                      @click="updateQuantity(item.id, item.size, item.quantity + 1)" />
                  </div>
                </div>
                <div :class="$style.delete" @click="removeFromCart(item.id, item.size)">
                  <img :class="$style.swapVertIcon" alt="" src="@/assets/delete.svg" />
                  <div :class="$style.remover">Remover</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Direita: Endereço e Pagamento -->
      <div :class="$style.right">
        <div :class="$style.entrega">
          <div :class="$style.contents">
            <div :class="$style.head">
              <div :class="$style.carrinho">Endereço de Entrega</div>
              <div :class="$style.vDivider" />
            </div>
            <div :class="$style.inputsAdress">
              <div :class="$style.rua">
                <div :class="$style.head2">
                  <div :class="$style.estado">CEP:</div>
                </div>
                <div :class="$style.label">
                  <input v-model="address.zipCode" :class="$style.estado" placeholder="00000-000" @input="formatCEP"
                    @blur="searchCEP" />
                </div>
              </div>
              <div :class="$style.rua">
                <div :class="$style.head2">
                  <div :class="$style.estado">Rua:</div>
                </div>
                <div :class="$style.label">
                  <input v-model="address.street" :class="$style.estado" placeholder="Rua" :disabled="loadingAddress" />
                </div>
              </div>
              <div :class="$style.rua">
                <div :class="$style.head2">
                  <div :class="$style.estado">Número:</div>
                </div>
                <div :class="$style.label">
                  <input v-model="address.number" :class="$style.estado" placeholder="Número" />
                </div>
              </div>
              <div :class="$style.rua">
                <div :class="$style.head2">
                  <div :class="$style.estado">Bairro:</div>
                </div>
                <div :class="$style.label">
                  <input v-model="address.neighborhood" :class="$style.estado" placeholder="Bairro"
                    :disabled="loadingAddress" />
                </div>
              </div>
              <div :class="$style.cidadecep">
                <div :class="$style.cidade">
                  <div :class="$style.head2">
                    <div :class="$style.estado">Cidade:</div>
                  </div>
                  <div :class="$style.label">
                    <input v-model="address.city" :class="$style.estado" placeholder="Cidade"
                      :disabled="loadingAddress" />
                  </div>
                </div>
                <div :class="$style.cidade">
                  <div :class="$style.head2">
                    <div :class="$style.estado">Estado:</div>
                  </div>
                  <div :class="$style.label3">
                    <select v-model="address.state" :class="$style.estado" :disabled="loadingAddress">
                      <option value="" disabled selected>Estado</option>
                      <option v-for="state in states" :key="state" :value="state">{{ state }}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div :class="$style.left2">
          <div :class="$style.contents2">
            <div :class="$style.contents">
              <div :class="$style.head7">
                <div :class="$style.carrinho">Método de Pagamento</div>
                <div :class="$style.vDivider" />
              </div>

              <div :class="$style.paymentMethods">
                <div :class="[$style.paymentMethod, payment.method === 'credit' && $style.selected]"
                  @click="payment.method = 'credit'">
                  <img :class="$style.paymentIcon" src="../assets/credit-card.svg" alt="Cartão de Crédito" />
                  <span>Cartão de Crédito</span>
                </div>
                <div :class="[$style.paymentMethod, payment.method === 'pix' && $style.selected]"
                  @click="payment.method = 'pix'">
                  <img :class="$style.paymentIcon" src="../assets/pix.svg" alt="PIX" />
                  <span>PIX</span>
                </div>
                <div :class="[$style.paymentMethod, payment.method === 'boleto' && $style.selected]"
                  @click="payment.method = 'boleto'">
                  <img :class="$style.paymentIcon" src="../assets/boleto.svg" alt="Boleto Bancário" />
                  <span>Boleto Bancário</span>
                </div>
              </div>

              <!-- Cartão de Crédito -->
              <div v-if="payment.method === 'credit'" :class="$style.inputsAdress1">
                <div :class="$style.rua">
                  <div :class="$style.head2">
                    <div :class="$style.estado">Número do Cartão:</div>
                    <div v-if="cardErrors.number" :class="$style.errorText">{{ cardErrors.number }}</div>
                  </div>
                  <div :class="[$style.label, cardErrors.number && $style.errorInput]">
                    <input v-model="payment.cardNumber" :class="$style.estado" placeholder="0000 0000 0000 0000"
                      @input="formatCardNumber" @blur="validateCardNumber" />
                  </div>
                </div>
                <div :class="$style.rua">
                  <div :class="$style.head2">
                    <div :class="$style.estado">Nome no Cartão:</div>
                    <div v-if="cardErrors.name" :class="$style.errorText">{{ cardErrors.name }}</div>
                  </div>
                  <div :class="[$style.label, cardErrors.name && $style.errorInput]">
                    <input v-model="payment.cardName" :class="$style.estado" placeholder="Nome como está no cartão"
                      @blur="validateCardName" />
                  </div>
                </div>
                <div :class="$style.cidadecep">
                  <div :class="$style.cidade">
                    <div :class="$style.head2">
                      <div :class="$style.estado">Validade:</div>
                      <div v-if="cardErrors.expiry" :class="$style.errorText">{{ cardErrors.expiry }}</div>
                    </div>
                    <div :class="[$style.label, cardErrors.expiry && $style.errorInput]">
                      <input v-model="payment.expiryDate" :class="$style.estado" placeholder="MM/AA"
                        @input="formatExpiryDate" @blur="validateExpiryDate" />
                    </div>
                  </div>
                  <div :class="$style.cidade">
                    <div :class="$style.head2">
                      <div :class="$style.estado">CVV:</div>
                      <div v-if="cardErrors.cvv" :class="$style.errorText">{{ cardErrors.cvv }}</div>
                    </div>
                    <div :class="[$style.label, cardErrors.cvv && $style.errorInput]">
                      <input v-model="payment.cvv" :class="$style.estado" placeholder="000" maxlength="3"
                        @blur="validateCVV" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- PIX -->
              <div v-if="payment.method === 'pix'" :class="$style.pixContainer">
                <div :class="$style.pixInfo">
                  <img :class="$style.qrCode" src="../assets/qr-code.svg" alt="QR Code" />
                  <div :class="$style.pixInstructions">
                    <p>1. Abra o app do seu banco</p>
                    <p>2. Escolha pagar com PIX</p>
                    <p>3. Escaneie o QR Code ao lado</p>
                    <p>4. Confirme o pagamento</p>
                  </div>
                </div>
                <div :class="$style.pixCopy">
                  <div :class="$style.pixCode">
                    <span>Código PIX</span>
                    <div :class="$style.copyButton" @click="copyPixCode">
                      <span>{{ pixCode }}</span>
                      <img :class="$style.copyIcon" src="../assets/copy.svg" alt="Copiar" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Boleto -->
              <div v-if="payment.method === 'boleto'" :class="$style.boletoContainer">
                <div :class="$style.boletoInfo">
                  <p>Ao clicar em "Gerar Boleto" você receberá o boleto por email.</p>
                  <p>O prazo de validade do boleto é de 3 dias úteis.</p>
                  <p>O pedido será confirmado apenas após o pagamento.</p>
                </div>
                <div :class="$style.boletoButton" @click="generateBoleto">
                  <img :class="$style.boletoIcon" src="../assets/download.svg" alt="Download" />
                  <span>Gerar Boleto</span>
                </div>
              </div>

              <div :class="$style.vDivider" />
              <div :class="$style.price">
                <div :class="$style.infoProduct">
                  <div :class="$style.frete">Subtotal</div>
                  <div :class="$style.frete">R$ {{ subtotal.toFixed(2) }}</div>
                </div>
                <div :class="$style.infoProduct" v-if="isAddressComplete">
                  <div :class="$style.frete">Frete</div>
                  <div :class="$style.frete">R$ {{ shipping ? shipping.toFixed(2) : '...' }}</div>
                </div>
                <div :class="$style.infoProduct">
                  <div :class="$style.frete">Total</div>
                  <div :class="$style.frete">R$ {{ total.toFixed(2) }}</div>
                </div>
              </div>
              <div :class="$style.vDivider" />
            </div>
            <div :class="$style.buttons">
              <div :class="$style.vBtn" @click="finishOrder">
                <div :class="$style.content">
                  <div :class="$style.text">FECHAR PEDIDO</div>
                </div>
              </div>
              <div :class="$style.vBtn1" @click="continueShopping">
                <div :class="$style.content">
                  <div :class="$style.text">CONTINUAR COMPRANDO</div>
                </div>
              </div>
            </div>
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
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import type { CartItem } from '@/stores/cart'
import api from '@/services/api'

interface ProductDetails {
  quantities: {
    [key: string]: number;
  };
}

interface ProductState {
  sizes: string[];
  quantities: {
    [key: string]: number;
  };
}

const router = useRouter()
const cartStore = ref()
const authStore = useAuthStore()
const productsDetails = ref<Map<number, ProductState>>(new Map())
const showToast = ref(false)
const toastMessage = ref('')

const showEmptyCartMessage = () => {
  toastMessage.value = 'Adicione um produto no seu carrinho.'
  showToast.value = true

  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

onMounted(async () => {
  try {
    // Check if user is logged in
    if (!authStore.isLoggedIn) {
      toastMessage.value = 'Você precisa estar logado para acessar o carrinho'
      showToast.value = true
      setTimeout(() => {
        router.push('/login')
      }, 1500)
      return
    }
    
    cartStore.value = useCartStore()
    // Only redirect if cart is empty
    if (!cartStore.value?.items?.length) {
      router.push('/products')
      return
    }

    // Fetch product details for all items in cart
    for (const item of cartStore.value.items) {
      try {
        const response = await api.get<ProductDetails>(`/products/${item.id}`)
        const product = response.data
        const availableSizes = Object.entries(product.quantities)
          .reduce<string[]>((acc, [size, quantity]) => {
            if (quantity > 0) acc.push(size)
            return acc
          }, [])

        productsDetails.value.set(item.id, {
          sizes: availableSizes,
          quantities: product.quantities
        })
      } catch (error) {
        console.error(`Failed to fetch product ${item.id} details:`, error)
      }
    }
  } catch (error) {
    console.error('Failed to initialize cart store:', error)
  }
})

const getAvailableSizes = (itemId: number) => {
  return productsDetails.value.get(itemId)?.sizes || []
}

const getAvailableQuantity = (itemId: number, size: string) => {
  const details = productsDetails.value.get(itemId)
  if (!details) return 0
  return details.quantities[size] || 0
}

const updateProductDetails = (itemId: number, product: ProductDetails) => {
  const availableSizes = Object.entries(product.quantities)
    .filter(([_, quantity]: [string, number]) => quantity > 0)
    .map(([size]) => size)

  productsDetails.value.set(itemId, {
    sizes: availableSizes,
    quantities: product.quantities
  })
}

const checkAndUpdateStock = async (itemId: number, currentSize: string) => {
  if (!cartStore.value?.items) return

  try {
    // Get latest product details from API
    const response = await api.get<ProductDetails>(`/products/${itemId}`)
    const product = response.data

    // Update our local state
    updateProductDetails(itemId, product)

    // Get current item
    const currentItem = cartStore.value.items.find((i: CartItem) => i.id === itemId && i.size === currentSize)
    if (!currentItem) return

    // Check if current size is still available and has enough stock
    const currentStockAvailable = product.quantities[currentSize] || 0

    if (currentStockAvailable === 0) {
      // Remove item from cart if size is no longer available
      cartStore.value.removeFromCart(itemId, currentSize)
      return
    }

    if (currentItem.quantity > currentStockAvailable) {
      currentItem.quantity = currentStockAvailable
      cartStore.value.updateQuantity(itemId, currentSize, currentStockAvailable)
    }

    // Return the updated product data
    return product
  } catch (error) {
    console.error('Erro ao verificar estoque:', error)
  }
}

const onSizeChange = (e: Event, item: CartItem) => {
  const target = e.target as HTMLSelectElement
  if (!target) return
  const newSize = target.value
  if (newSize === item.size) return
  updateSize(item.id, item.size, newSize)
}

const updateSize = async (itemId: number, oldSize: string, newSize: string) => {
  if (!cartStore.value?.items) return

  try {
    // Get latest product details from API
    const response = await api.get<ProductDetails>(`/products/${itemId}`)
    const product = response.data

    // Update our local state
    updateProductDetails(itemId, product)

    // Check if new size is available
    const newSizeStock = product.quantities[newSize] || 0
    if (newSizeStock === 0) {
      return
    }

    // Get current item
    const currentItem = cartStore.value.items.find((i: CartItem) => i.id === itemId && i.size === oldSize)
    if (!currentItem) return

    // Remove item with old size
    cartStore.value.removeFromCart(itemId, oldSize)

    // Add item with new size and quantity 1
    const newItem = {
      ...currentItem,
      size: newSize,
      quantity: 1
    }
    cartStore.value.addToCart(newItem)
  } catch (error) {
    console.error('Erro ao atualizar tamanho:', error)
  }
}

const subtotal = computed(() => {
  if (!cartStore.value?.items) return 0
  return cartStore.value.items.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0)
})

const updateQuantity = (itemId: number, size: string, quantity: number) => {
  if (!cartStore.value?.items) return

  const availableQuantity = getAvailableQuantity(itemId, size)
  if (quantity >= 1 && quantity <= availableQuantity) {
    cartStore.value.updateQuantity(itemId, size, quantity)
  } else if (quantity > availableQuantity) {
    cartStore.value.updateQuantity(itemId, size, availableQuantity)
  }
}

const removeFromCart = (itemId: number, size: string) => {
  if (!cartStore.value?.items) return
  cartStore.value.removeFromCart(itemId, size)
}

const validateQuantity = async (item: CartItem) => {
  if (!cartStore.value?.items) return

  try {
    // Get latest product details from API
    const response = await api.get<ProductDetails>(`/products/${item.id}`)
    const product = response.data

    // Update our local state
    updateProductDetails(item.id, product)

    const availableQuantity = product.quantities[item.size] || 0

    if (item.quantity < 1) {
      item.quantity = 1
    } else if (item.quantity > availableQuantity) {
      item.quantity = availableQuantity
    }

    item.quantity = Math.floor(item.quantity)
    cartStore.value.updateQuantity(item.id, item.size, item.quantity)
  } catch (error) {
    console.error('Erro ao validar quantidade:', error)
  }
}

const states = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

const address = ref({
  zipCode: '',
  street: '',
  number: '',
  neighborhood: '',
  city: '',
  state: '',
  latitude: 0,
  longitude: 0
})

const loadingAddress = ref(false)
const baseShippingCost = ref(19.00)
const shipping = computed(() => {
  if (!isAddressComplete.value || (address.value.latitude === 0 && address.value.longitude === 0)) {
    return 0
  }

  // Calculate distance-based multiplier
  const distance = calculateDistance(
    address.value.latitude,
    address.value.longitude,
    -23.5505, // São Paulo latitude
    -46.6333  // São Paulo longitude
  )

  // Increase shipping cost by 10% for each 100km
  const multiplier = 1 + (Math.floor(distance / 100) * 0.1)
  return baseShippingCost.value * multiplier
})

const total = computed(() => {
  const shippingCost = shipping.value || 0
  return subtotal.value + shippingCost
})

const isAddressComplete = computed(() => {
  return address.value.zipCode &&
    address.value.street &&
    address.value.number &&
    address.value.neighborhood &&
    address.value.city &&
    address.value.state
})

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // Distance in kilometers
}

const searchCEP = async () => {
  const cep = address.value.zipCode.replace(/\D/g, '')

  if (cep.length !== 8) return

  loadingAddress.value = true

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
    const data = await response.json()

    if (!data.erro) {
      address.value.street = data.logradouro
      address.value.neighborhood = data.bairro
      address.value.city = data.localidade
      address.value.state = data.uf

      // Get coordinates for the address
      const geocodeResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?street=${encodeURIComponent(data.logradouro)}&city=${encodeURIComponent(data.localidade)}&state=${data.uf}&country=Brazil&format=json`
      )
      const geocodeData = await geocodeResponse.json()

      if (geocodeData.length > 0) {
        address.value.latitude = parseFloat(geocodeData[0].lat)
        address.value.longitude = parseFloat(geocodeData[0].lon)
      }
    }
  } catch (error) {
    console.error('Erro ao buscar CEP:', error)
  } finally {
    loadingAddress.value = false
  }
}

const payment = ref({
  method: 'credit',
  cardNumber: '',
  cardName: '',
  expiryDate: '',
  cvv: ''
})

const cardErrors = ref({
  number: '',
  name: '',
  expiry: '',
  cvv: ''
})

const pixCode = ref('00020126580014BR.GOV.BCB.PIX0136a629532e-7831-4c3d-94b3-735a5f6e9d9a5204000053039865802BR5925VEZZ STORE LTDA6009SAO PAULO62070503***6304E2CA')

const formatCEP = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  if (value.length > 8) value = value.slice(0, 8)
  if (value.length > 5) {
    value = value.slice(0, 5) + '-' + value.slice(5)
  }
  address.value.zipCode = value
}

const formatCardNumber = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  if (value.length > 16) value = value.slice(0, 16)
  const parts = value.match(/.{1,4}/g) || []
  payment.value.cardNumber = parts.join(' ')
  validateCardNumber()
}

const validateCardNumber = () => {
  const number = payment.value.cardNumber.replace(/\s/g, '')

  // Luhn Algorithm
  const isValid = number.split('')
    .reverse()
    .map(x => parseInt(x, 10))
    .map((x, i) => i % 2 ? x * 2 : x)
    .map(x => x > 9 ? x - 9 : x)
    .reduce((acc, x) => acc + x, 0) % 10 === 0

  if (!number) {
    cardErrors.value.number = 'Número do cartão é obrigatório'
  } else if (number.length < 16) {
    cardErrors.value.number = 'Número do cartão incompleto'
  } else if (!isValid) {
    cardErrors.value.number = 'Número do cartão inválido'
  } else {
    cardErrors.value.number = ''
  }
}

const validateCardName = () => {
  const name = payment.value.cardName.trim()

  if (!name) {
    cardErrors.value.name = 'Nome é obrigatório'
  } else if (name.length < 3) {
    cardErrors.value.name = 'Nome muito curto'
  } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) {
    cardErrors.value.name = 'Nome contém caracteres inválidos'
  } else {
    cardErrors.value.name = ''
  }
}

const validateExpiryDate = () => {
  const [month, year] = payment.value.expiryDate.split('/')
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear() % 100
  const currentMonth = currentDate.getMonth() + 1

  if (!month || !year) {
    cardErrors.value.expiry = 'Data de validade é obrigatória'
    return
  }

  const monthNum = parseInt(month, 10)
  const yearNum = parseInt(year, 10)

  if (monthNum < 1 || monthNum > 12) {
    cardErrors.value.expiry = 'Mês inválido'
  } else if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
    cardErrors.value.expiry = 'Cartão vencido'
  } else {
    cardErrors.value.expiry = ''
  }
}

const validateCVV = () => {
  const cvv = payment.value.cvv

  if (!cvv) {
    cardErrors.value.cvv = 'CVV é obrigatório'
  } else if (cvv.length < 3) {
    cardErrors.value.cvv = 'CVV incompleto'
  } else if (!/^\d{3}$/.test(cvv)) {
    cardErrors.value.cvv = 'CVV inválido'
  } else {
    cardErrors.value.cvv = ''
  }
}

const validateAllCardFields = (): boolean => {
  validateCardNumber()
  validateCardName()
  validateExpiryDate()
  validateCVV()

  return !cardErrors.value.number &&
    !cardErrors.value.name &&
    !cardErrors.value.expiry &&
    !cardErrors.value.cvv
}

const formatExpiryDate = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  if (value.length > 4) value = value.slice(0, 4)
  if (value.length > 2) {
    value = value.slice(0, 2) + '/' + value.slice(2)
  }
  payment.value.expiryDate = value
}

const copyPixCode = () => {
  navigator.clipboard.writeText(pixCode.value)
    .then(() => {
      // Success silently
    })
    .catch(() => {
      console.error('Erro ao copiar código PIX')
    })
}

const generateBoleto = () => {
  // Aqui você implementaria a geração do boleto
}

const validateAllFields = (): boolean => {
  if (payment.value.method === 'credit') {
    return validateAllCardFields()
  }
  return true
}

const finishOrder = async () => {
  if (!validateAllFields()) {
    return
  }

  try {
    const cartItems = cartStore.value?.items || []
    const user = authStore.currentUser

    if (!cartItems.length) {
      toastMessage.value = 'Carrinho vazio!'
      showToast.value = true
      return
    }

    if (!user || !user.id) {
      toastMessage.value = 'Usuário não autenticado!'
      showToast.value = true
      router.push('/login')
      return
    }

    const response = await api.post('/products/buy', {
      user,
      products: cartItems.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        size: item.size,
        quantity: item.quantity,
        image: item.image
      })),
      payment_type: payment.value.method
    })

    console.log('Pedido finalizado com sucesso:', response.data)
    toastMessage.value = 'Pedido finalizado com sucesso!'
    showToast.value = true

    // Limpa o carrinho e redireciona
    cartStore.value.clearCart()
    setTimeout(() => {
      router.push('/ordersuccess')
    }, 2000)

  } catch (error) {
    console.error('Erro ao finalizar pedido:', error)
    toastMessage.value = 'Erro ao finalizar pedido. Tente novamente.'
    showToast.value = true
  }
}

const continueShopping = () => {
  router.push('/products')
}
</script>

<style module>
:global(:root) {
  --bg-color: #fff;
  --text-color: #212121;
  --text-secondary: #666;
  --text-disabled: #999;
  --border-color: #d9d9d9;
  --card-bg: #fff;
  --input-bg: #fff;
  --hover-bg: #f5f5f5;
  --divider-color: rgba(154, 154, 154, 0.42);
  --primary-color: #439cd3;
  --error-color: #dc3545;
  --success-color: #28a745;
  --shadow-color: rgba(0, 0, 0, 0.1);
}

:global(:root.dark-mode) {
  --bg-color: #121212;
  --text-color: #fff;
  --text-secondary: #aaa;
  --text-disabled: #666;
  --border-color: #333;
  --card-bg: #1e1e1e;
  --input-bg: #2a2a2a;
  --hover-bg: #2a2a2a;
  --divider-color: rgba(255, 255, 255, 0.12);
  --primary-color: #439cd3;
  --error-color: #dc3545;
  --success-color: #28a745;
  --shadow-color: rgba(0, 0, 0, 0.3);
}

.shoppingCart {
  min-height: calc(100vh - 90px);
  background: var(--bg-color);
  margin-top: 0;
  transition: background-color 0.3s;
}

.main {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  padding: 32px;
  box-sizing: border-box;
  gap: 32px;
  text-align: center;
  font-size: 24px;
  color: var(--text-secondary);
  font-family: Roboto;
}

@media (max-width: 1200px) {
  .main {
    flex-direction: column;
    padding: 16px;
    gap: 16px;
  }

  .left {
    max-width: 100% !important;
    width: 100% !important;
  }

  .right {
    width: 100% !important;
  }

  .product {
    flex-direction: row !important;
    align-items: flex-start !important;
    flex-wrap: wrap !important;
    gap: 16px !important;
  }

  .photoIcon {
    width: 120px !important;
    height: 120px !important;
    object-fit: cover !important;
  }

  .contentsRight {
    flex: 1 !important;
    min-width: 280px !important;
    padding: 0 !important;
  }

  .infoProduct {
    flex-direction: row !important;
    gap: 16px !important;
    align-items: flex-start !important;
    flex-wrap: wrap !important;
  }

  .textLeft {
    flex: 1 !important;
    min-width: 200px !important;
    align-items: flex-start !important;
  }

  .nomeDoTerno {
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    max-width: 100% !important;
  }

  .body {
    width: 100% !important;
    flex-direction: row !important;
    justify-content: space-between !important;
    align-items: center !important;
    margin-top: 8px !important;
  }

  .left1 {
    gap: 16px !important;
  }

  .delete {
    margin-left: auto !important;
  }

  .inputsAdress,
  .inputsAdress1 {
    padding: 16px !important;
  }

  .cidadecep {
    flex-direction: row !important;
    flex-wrap: wrap !important;
    gap: 16px !important;
  }

  .cidade {
    flex: 1 !important;
    min-width: 200px !important;
  }

  .paymentMethods {
    flex-direction: row !important;
    flex-wrap: wrap !important;
    justify-content: center !important;
    gap: 16px !important;
  }

  .paymentMethod {
    flex: 1 !important;
    min-width: 200px !important;
    max-width: 300px !important;
  }
}

@media (max-width: 640px) {
  .main {
    padding: 8px;
  }

  .product {
    flex-direction: column !important;
    align-items: center !important;
  }

  .photoIcon {
    width: 100% !important;
    max-width: 200px !important;
    height: auto !important;
  }

  .contentsRight {
    width: 100% !important;
  }

  .infoProduct {
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
  }

  .textLeft {
    align-items: center !important;
    width: 100% !important;
  }

  .body {
    flex-direction: column !important;
    gap: 16px !important;
  }

  .left1 {
    width: 100% !important;
    justify-content: center !important;
  }

  .delete {
    width: 100% !important;
    justify-content: center !important;
    margin-left: 0 !important;
  }

  .cidadecep {
    flex-direction: column !important;
  }

  .cidade {
    width: 100% !important;
  }

  .paymentMethods {
    flex-direction: column !important;
  }

  .paymentMethod {
    width: 100% !important;
    max-width: none !important;
  }

  .pixInfo {
    flex-direction: column !important;
    align-items: center !important;
  }

  .qrCode {
    width: 100% !important;
    max-width: 200px !important;
    height: auto !important;
  }

  .buttons {
    flex-direction: column !important;
    gap: 16px !important;
  }

  .vBtn,
  .vBtn1 {
    width: 100% !important;
  }

  .carrinho {
    font-size: 18px !important;
  }

  .nomeDoTerno {
    font-size: 16px !important;
  }

  .r19999,
  .r199991 {
    font-size: 14px !important;
  }

  .tamanho,
  .quantidade {
    min-width: 60px !important;
  }

  .quantityInput {
    width: 30px !important;
  }

  .remover {
    font-size: 12px !important;
  }

  .estado {
    font-size: 12px !important;
  }

  .label,
  .label3 {
    height: 40px !important;
    padding: 8px 12px !important;
  }

  .frete {
    font-size: 14px !important;
    line-height: 40px !important;
  }

  .text {
    font-size: 14px !important;
    line-height: 24px !important;
  }
}

.carrinho {
  position: relative;
  letter-spacing: 1.25px;
  line-height: 32px;
  font-weight: 600;
  font-size: 20px;
  color: var(--text-color);
}

.vDivider {
  align-self: stretch;
  position: relative;
  background-color: var(--divider-color);
  height: 1px;
  overflow: hidden;
  flex-shrink: 0;
}

.head {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 8px;
}

.photoIcon {
  width: 180px;
  height: 180px;
  object-fit: cover;
}

.nomeDoTerno {
  position: relative;
  letter-spacing: 0.5px;
  line-height: 20px;
  font-size: 18px;
  margin-bottom: 4px;
  color: var(--text-color);
  font-weight: 500;
}

.textBottom {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  text-align: center;
  font-size: 13px;
  color: var(--text-secondary);
}

.r19999 {
  position: relative;
  letter-spacing: 0.5px;
  line-height: 16px;
  font-weight: 500;
  color: var(--text-secondary);
}

.div {
  color: var(--text-disabled);
  margin: 0 2px;
}

.emEstoque {
  position: relative;
  letter-spacing: 0.5px;
  line-height: 16px;
  font-weight: 500;
  color: var(--primary-color);
}

.r199991 {
  position: relative;
  font-size: 18px;
  letter-spacing: 0.5px;
  line-height: 20px;
  font-weight: 500;
  color: var(--text-color);
}

.infoProduct {
  align-self: stretch;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 0 4px;
}

.textLeft {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 4px;
}

.swapVertIcon {
  width: 14px;
  height: 14px;
  position: relative;
  max-height: 100%;
  color: var(--primary-color);
}

.tamanho {
  border-radius: 2px;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: row;
  align-items: stretch;
  padding: 0;
  font-size: 14px;
  position: relative;
  min-width: 80px;
  background: var(--input-bg);
}

.tamanho .swapVertIcon {
  position: absolute;
  right: 4px;
  pointer-events: none;
}

.quantidade {
  border-radius: 2px;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 4px;
  gap: 8px;
  font-size: 14px;
  background: var(--input-bg);
}

.left1 {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
}

.remover {
  position: relative;
  letter-spacing: 1.25px;
  line-height: 24px;
  font-weight: 600;
  font-size: 14px;
  color: var(--primary-color);
}

.delete {
  height: 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 3px 4px;
  box-sizing: border-box;
  gap: 8px;
  text-align: left;
  font-size: 16px;
  color: var(--primary-color);
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete:hover {
  opacity: 0.8;
}

.body {
  align-self: stretch;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 0px;
  text-align: center;
  font-size: 15px;
  color: var(--text-secondary);
}

.contentsRight {
  align-self: stretch;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 16px 0px 0px;
  gap: 16px;
}

.product {
  align-self: stretch;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 16px;
  text-align: left;
  font-size: 24px;
  color: var(--text-color);
}

.contents {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 24px;
}

.left {
  flex: 1 1 420px;
  max-width: 520px;
  min-width: 320px;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 24px;
  background: var(--card-bg);
  transition: background-color 0.3s, border-color 0.3s;
}

.head2 {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.label {
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  box-sizing: border-box;
  height: 48px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 12px 16px;
  font-size: 14px;
  color: var(--text-color);
}

.rua {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 8px;
}

.cidade {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 8px;
}

.estado {
  position: relative;
  letter-spacing: 1px;
  line-height: 24px;
  font-size: 14px;
}

.keyboardArrowDownIcon {
  width: 24px;
  position: relative;
  max-height: 100%;
}

.label3 {
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  box-sizing: border-box;
  height: 48px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 12px 16px;
  font-size: 14px;
  color: var(--text-color);
  background: var(--input-bg);
  transition: border-color 0.3s, background-color 0.3s;
}

.label3 select {
  width: 100%;
  border: none;
  background: var(--input-bg);
  color: var(--text-color);
  font-size: 14px;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding: 4px 24px 4px 8px;
  border-radius: 4px;
  transition: background 0.3s, color 0.3s;
}

.label3 select:disabled {
  background: var(--input-bg);
  color: var(--text-disabled);
}

.label3 select option {
  background: var(--input-bg);
  color: var(--text-color);
}

.cidadecep {
  align-self: stretch;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 16px;
}

.inputsAdress {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 24px;
  text-align: left;
  font-size: 16px;
  color: var(--text-color);
  padding: 16px 0;
}

.entrega {
  align-self: stretch;
  border-radius: 16px;
  border: 1px solid #d9d9d9;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 24px;
}

.head7 {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 8px;
  text-align: center;
  font-size: 24px;
}

.inputsAdress1 {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 16px;
  color: var(--text-color);
  padding: 16px 0;
}

.frete {
  position: relative;
  letter-spacing: 1px;
  line-height: 70px;
  font-weight: 500;
}

.price {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 24px;
  color: var(--text-color);
}

.text {
  position: relative;
  letter-spacing: 1.25px;
  line-height: 36px;
  text-transform: uppercase;
  font-weight: 500;
}

.content {
  align-self: stretch;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.vBtn {
  flex: 1;
  border-radius: 4px;
  background-color: #000;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.vBtn:hover {
  background-color: #333;
}

.vBtn1 {
  flex: 1;
  border-radius: 4px;
  background-color: #fff;
  border: 1px solid #000;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #000;
}

.vBtn1:hover {
  background-color: #000;
  color: #fff;
}

.vBtn1 .text {
  position: relative;
  letter-spacing: 1.25px;
  line-height: 36px;
  text-transform: uppercase;
  font-weight: 500;
}

.buttons {
  align-self: stretch;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 8px;
  text-align: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.87);
}

.contents2 {
  align-self: stretch;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 0px;
}

.left2 {
  align-self: stretch;
  flex: 1;
  border-radius: 16px;
  border: 1px solid #d9d9d9;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 24px;
  text-align: left;
  font-size: 16px;
}

.right {
  flex: 2 1 480px;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 16px;
}

.label input,
.label3 input,
.label3 select {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 14px;
  color: var(--text-color);
  outline: none;
  transition: color 0.3s;
}

.label input::placeholder,
.label3 input::placeholder,
.label3 select::placeholder {
  color: var(--text-secondary);
}

.label input:disabled,
.label3 select:disabled {
  background: transparent;
  color: var(--text-disabled);
}

.tamanho,
.quantidade {
  cursor: pointer;
  transition: all 0.2s ease;
}

.tamanho:hover,
.quantidade:hover {
  border-color: #000;
}

.swapVertIcon {
  cursor: pointer;
  transition: all 0.2s ease;
}

.swapVertIcon:hover {
  opacity: 0.7;
}

.delete {
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete:hover {
  opacity: 0.7;
}

.errorText {
  color: #dc3545;
  font-size: 12px;
  margin-left: 8px;
}

.errorInput {
  border-color: #dc3545 !important;
}

.errorInput input {
  color: #dc3545;
}

.paymentMethods {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin: 32px 0;
  width: 100%;
}

.paymentMethod {
  flex: 0 1 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 16px;
  border: 1.5px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  background: var(--card-bg);
  color: var(--text-color);
}

.paymentMethod:hover {
  border-color: var(--primary-color);
  background: var(--hover-bg);
  color: var(--text-color);
}

.selected {
  border-color: var(--primary-color) !important;
  background: var(--hover-bg) !important;
  color: var(--text-color) !important;
}

.paymentIcon {
  width: 32px;
  height: 32px;
  color: var(--text-color);
  filter: none;
  transition: color 0.3s;
}

.selected .paymentIcon,
.paymentMethod:hover .paymentIcon {
  color: var(--primary-color);
}

.paymentMethod span {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-color);
  transition: color 0.3s;
}

.selected span,
.paymentMethod:hover span {
  color: var(--primary-color);
}

.pixContainer,
.boletoContainer {
  padding: 24px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  margin-bottom: 24px;
}

.pixInfo {
  display: flex;
  gap: 32px;
  margin-bottom: 24px;
}

.qrCode {
  width: 200px;
  height: 200px;
}

.pixInstructions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
}

.pixInstructions p {
  margin: 0;
  font-size: 16px;
  color: #555;
}

.pixCopy {
  border-top: 1px solid #d9d9d9;
  padding-top: 24px;
}

.pixCode {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.copyButton {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copyButton:hover {
  background-color: #e0e0e0;
}

.copyIcon {
  width: 20px;
  height: 20px;
}

.boletoContainer {
  padding: 32px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  margin: 24px auto;
  max-width: 500px;
  background-color: #fff;
  text-align: center;
}

.boletoInfo {
  margin-bottom: 32px;
}

.boletoInfo p {
  margin: 12px 0;
  font-size: 16px;
  color: #666;
  line-height: 1.5;
}

.boletoButton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.boletoButton:hover {
  background-color: #e0e0e0;
}

.boletoIcon {
  width: 20px;
  height: 20px;
  color: #555;
}

.boletoButton span {
  font-size: 16px;
  font-weight: 500;
  color: #555;
}

.quantityInput {
  width: 40px;
  border: none;
  text-align: center;
  font-size: 14px;
  color: var(--text-color);
  background: var(--input-bg);
  padding: 0;
  margin: 0;
  transition: background 0.3s, color 0.3s;
}

.quantityInput::-webkit-outer-spin-button,
.quantityInput::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.sizeSelect {
  border: 1px solid var(--border-color);
  background: var(--input-bg);
  font-size: 14px;
  color: var(--text-color);
  cursor: pointer;
  outline: none;
  width: 100%;
  padding: 4px 24px 4px 8px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  text-align: center;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238e8e8e'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 4px center;
  background-size: 16px;
  transition: background 0.3s, color 0.3s, border-color 0.3s;
}

.sizeSelect option {
  background: var(--input-bg);
  color: var(--text-color);
}

.delete .swapVertIcon {
  filter: invert(47%) sepia(95%) saturate(1234%) hue-rotate(176deg) brightness(96%) contrast(98%);
}

.emptyCart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  width: 100%;
  min-height: 400px;
  background: #f9f9f9;
  border-radius: 8px;
}

.emptyCartIcon {
  width: 120px;
  height: 120px;
  margin-bottom: 24px;
  opacity: 0.6;
}

.emptyCartTitle {
  font-size: 24px;
  font-weight: 500;
  color: #333;
  margin-bottom: 16px;
}

.emptyCartText {
  font-size: 16px;
  line-height: 1.5;
  color: #666;
  max-width: 400px;
  margin-bottom: 32px;
}

@media (max-width: 640px) {
  .emptyCart {
    padding: 32px 16px;
    min-height: 300px;
  }

  .emptyCartIcon {
    width: 80px;
    height: 80px;
    margin-bottom: 16px;
  }

  .emptyCartTitle {
    font-size: 20px;
    margin-bottom: 12px;
  }

  .emptyCartText {
    font-size: 14px;
    margin-bottom: 24px;
  }
}

.disabled {
  opacity: 0.5 !important;
  cursor: not-allowed !important;
}

.quantityInput::-webkit-inner-spin-button,
.quantityInput::-webkit-outer-spin-button {
  opacity: 1 !important;
}

.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(51, 51, 51, 0.9);
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  z-index: 9999;
  font-size: 16px;
  animation: slideIn 0.3s ease-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  pointer-events: none;
  min-width: 200px;
  text-align: center;
}

@keyframes slideIn {
  from {
    transform: translate(-50%, -100%);
    opacity: 0;
  }

  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}

.emptyCart {
  cursor: pointer;
  transition: all 0.2s ease;
}

.emptyCart:hover {
  background: #f5f5f5;
}
</style>
