import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'
import { useToast } from 'vue-toastification'

export const useFavoritesStore = defineStore('favorites', () => {
    // Initialize favorites from localStorage
    const storedFavorites = localStorage.getItem('favorites')
    const favorites = ref<number[]>(storedFavorites ? JSON.parse(storedFavorites) : [])

    // Helper function to save favorites to localStorage
    const saveFavorites = () => {
        localStorage.setItem('favorites', JSON.stringify(favorites.value))
    }

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
            saveFavorites() // Save after adding
        }
        return true
    }

    const removeFromFavorites = (productId: number) => {
        const index = favorites.value.indexOf(productId)
        if (index !== -1) {
            favorites.value.splice(index, 1)
            saveFavorites() // Save after removing
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