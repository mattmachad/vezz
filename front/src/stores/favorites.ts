import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'
import { useToast } from 'vue-toastification'

export const useFavoritesStore = defineStore('favorites', () => {
    const storedFavorites = localStorage.getItem('favorites')
    const favorites = ref<number[]>(storedFavorites ? JSON.parse(storedFavorites) : [])

    const saveFavorites = () => {
        localStorage.setItem('favorites', JSON.stringify(favorites.value))
    }

    const addToFavorites = (productId: number) => {
        const authStore = useAuthStore()
        const toast = useToast()

        if (!authStore.isLoggedIn) {
            toast.error('Você precisa estar logado para adicionar produtos aos favoritos')
            return false
        }

        if (!favorites.value.includes(productId)) {
            favorites.value.push(productId)
            saveFavorites()
        }
        return true
    }

    const removeFromFavorites = (productId: number) => {
        const index = favorites.value.indexOf(productId)
        if (index !== -1) {
            favorites.value.splice(index, 1)
            saveFavorites()
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