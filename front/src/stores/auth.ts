import { defineStore } from 'pinia'

interface User {
    id: number
    name: string
    email: string
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        isAuthenticated: false
    }),

    actions: {
        init() {
            // Check localStorage for existing user
            const storedUser = localStorage.getItem('user')
            if (storedUser) {
                try {
                    this.user = JSON.parse(storedUser)
                    this.isAuthenticated = true
                } catch (error) {
                    console.error('Error parsing stored user:', error)
                    this.logout()
                }
            }
        },

        login(user: User) {
            this.user = user
            this.isAuthenticated = true
            localStorage.setItem('user', JSON.stringify(user))
        },

        logout() {
            this.user = null
            this.isAuthenticated = false
            localStorage.removeItem('user')
        }
    },

    getters: {
        isLoggedIn: (state) => state.isAuthenticated,
        currentUser: (state) => state.user
    }
}) 