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
        const savedCart = localStorage.getItem('cart')
        return {
            items: savedCart ? JSON.parse(savedCart) : [] as CartItem[]
        }
    },

    actions: {
        addToCart(item: CartItem) {
            const authStore = useAuthStore()
            const toast = useToast()

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
            this.saveCart()
            return true
        },

        removeFromCart(itemId: number, size: string) {
            const index = this.items.findIndex((i: CartItem) => i.id === itemId && i.size === size)
            if (index > -1) {
                this.items.splice(index, 1)
                this.saveCart()
            }
        },

        updateQuantity(itemId: number, size: string, quantity: number) {
            const item = this.items.find((i: CartItem) => i.id === itemId && i.size === size)
            if (item) {
                item.quantity = quantity
                this.saveCart()
            }
        },

        clearCart() {
            this.items = []
            this.saveCart()
        },

        saveCart() {
            localStorage.setItem('cart', JSON.stringify(this.items))
        }
    }
}) 