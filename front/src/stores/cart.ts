import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

export interface CartItem {
    id: number
    name: string
    price: number
    image: string
    size: string
    quantity: number
}

export const useCartStore = defineStore('cart', () => {
    const items = ref<CartItem[]>([])
    const authStore = useAuthStore()

    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
        try {
            items.value = JSON.parse(savedCart)
        } catch (error) {
            console.error('Error loading cart:', error)
        }
    }

    function addToCart(item: CartItem): boolean {
        if (!authStore.user) {
            return false
        }

        const existingItem = items.value.find(
            i => i.id === item.id && i.size === item.size
        )

        if (existingItem) {
            existingItem.quantity += item.quantity
            saveCart()
        } else {
            items.value.push(item)
            saveCart()
        }

        return true
    }

    function removeFromCart(itemId: number, size: string) {
        items.value = items.value.filter(i => !(i.id === itemId && i.size === size))
        saveCart()
    }

    function updateQuantity(itemId: number, size: string, quantity: number) {
        const item = items.value.find(i => i.id === itemId && i.size === size)
        if (item) {
            item.quantity = quantity
            saveCart()
        }
    }

    function clearCart() {
        items.value = []
        saveCart()
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(items.value))
    }

    return {
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
    }
}) 