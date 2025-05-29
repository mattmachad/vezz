import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFavoritesStore = defineStore('favorites', () => {
    const favorites = ref<number[]>([])

    const addToFavorites = (productId: number) => {
        if (!favorites.value.includes(productId)) {
            favorites.value.push(productId)
        }
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