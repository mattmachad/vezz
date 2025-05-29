import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'
import { useToast } from 'vue-toastification'

export const useFavoritesStore = defineStore('favorites', () => {
    const favorites = ref<number[]>([])

    const addToFavorites = (productId: number) => {
        const authStore = useAuthStore()
        const toast = useToast()

        // Check if user is logged in
        if (!authStore.isLoggedIn) {
            toast.error('Você precisa estar logado para adicionar produtos aos favoritos')
            return false
        }

        if (!favorites.value.includes(productId)) {
            favorites.value.push(productId)
        }
        return true
    }

    const removeFromFavorites = (productId: number) => {
        const index = favorites.value.indexOf(productId)
        if (index !== -1) {
            favorites.value.splice(index, 1)
        }
    }

    const isFavorite = (productId: number) => favorites.value.includes(productId)

    return {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite
    }
}) 