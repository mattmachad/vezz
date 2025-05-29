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
            // Check localStorage for existing user
            const storedUser = localStorage.getItem('user')
            if (storedUser && storedUser !== 'undefined') {
                try {
                    const userData = JSON.parse(storedUser)
                    // Enhanced validation of user data
                    if (userData &&
                        userData.id &&
                        typeof userData.id === 'number' &&
                        userData.email &&
                        typeof userData.email === 'string' &&
                        userData.name &&
                        typeof userData.name === 'string') {
                        // Optional fields don't need validation since they're optional
                        this.user = userData
                        this.isAuthenticated = true
                    } else {
                        console.error('Invalid user data structure in localStorage')
                        this.logout()
                    }
                } catch (error) {
                    console.error('Error parsing stored user:', error)
                    this.logout()
                }
            } else {
                this.logout()
            }
        },

        login(user: User) {
            // Validate required user object structure
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

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(user.email)) {
                console.error('Invalid email format')
                return
            }

            // Optional fields are accepted as is
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
        isLoggedIn(): boolean {
            return this.isAuthenticated && !!this.user && !!this.user.id
        },
        currentUser(): User | null {
            return this.user
        }
    }
}) 