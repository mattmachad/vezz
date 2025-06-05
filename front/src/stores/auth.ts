import { defineStore } from 'pinia'

interface User {
    id: number
    name: string
    email: string
    photo?: string
    street?: string
    neighborhood?: string
    city?: string
    state?: string
    cep?: string
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        isAuthenticated: false
    }),

    actions: {
        init() {
            const storedUser = localStorage.getItem('user')
            if (storedUser && storedUser !== 'undefined') {
                try {
                    const userData = JSON.parse(storedUser)
                    if (userData &&
                        userData.id &&
                        typeof userData.id === 'number' &&
                        userData.email &&
                        typeof userData.email === 'string' &&
                        userData.name &&
                        typeof userData.name === 'string') {
                        this.user = userData
                        this.isAuthenticated = true
                    } else {
                        console.error('Invalid user data structure in localStorage')
                        this.clearAuth()
                    }
                } catch (error) {
                    console.error('Error parsing stored user:', error)
                    this.clearAuth()
                }
            } else {
                this.clearAuth()
            }
        },

        clearAuth() {
            this.user = null
            this.isAuthenticated = false
            localStorage.removeItem('user')
        },

        login(user: User) {
            if (!user ||
                !user.id ||
                typeof user.id !== 'number' ||
                !user.email ||
                typeof user.email !== 'string' ||
                !user.name ||
                typeof user.name !== 'string') {
                console.error('Invalid user data provided to login')
                return
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(user.email)) {
                console.error('Invalid email format')
                return
            }

            this.user = user
            this.isAuthenticated = true
            localStorage.setItem('user', JSON.stringify(user))
        },

        logout() {
            this.clearAuth()
            window.location.reload()
        }
    },

    getters: {
        isLoggedIn(): boolean {
            return this.isAuthenticated && !!this.user && !!this.user.id
        },
        currentUser(): User | null {
            return this.user
        }
    }
}) 