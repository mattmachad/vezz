import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { useToast } from 'vue-toastification'

export interface CartItem {
    id: number
    name: string
    price: number
    size: string
    quantity: number
    image: string
}

export const useCartStore = defineStore('cart', {
    state: () => {
        // Try to load saved cart from localStorage
        const savedCart = localStorage.getItem('cart')
        return {
            items: savedCart ? JSON.parse(savedCart) : [] as CartItem[]
        }
    },

    actions: {
        addToCart(item: CartItem) {
            const authStore = useAuthStore()
            const toast = useToast()

            // Check if user is logged in
            if (!authStore.isLoggedIn) {
                toast.error('Você precisa estar logado para adicionar produtos ao carrinho')
                return false
            }

            const existingItem = this.items.find((i: CartItem) => i.id === item.id && i.size === item.size)

            if (existingItem) {
                existingItem.quantity += item.quantity
            } else {
                this.items.push(item)
            }
            // Save to localStorage
            this.saveCart()
            return true
        },

        removeFromCart(itemId: number, size: string) {
            const index = this.items.findIndex((i: CartItem) => i.id === itemId && i.size === size)
            if (index > -1) {
                this.items.splice(index, 1)
                // Save to localStorage
                this.saveCart()
            }
        },

        updateQuantity(itemId: number, size: string, quantity: number) {
            const item = this.items.find((i: CartItem) => i.id === itemId && i.size === size)
            if (item) {
                item.quantity = quantity
                // Save to localStorage
                this.saveCart()
            }
        },

        clearCart() {
            this.items = []
            // Save to localStorage
            this.saveCart()
        },

        // Helper method to save cart to localStorage
        saveCart() {
            localStorage.setItem('cart', JSON.stringify(this.items))
        }
    }
}) 