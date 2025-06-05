import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
    id: number
    name: string
    email: string
    is_admin: boolean
    picture?: string
    address?: string
    phone?: string
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const token = ref<string | null>(null)

    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')

    if (savedUser && savedToken) {
        try {
            const parsedUser = JSON.parse(savedUser)
            if (isValidUser(parsedUser)) {
                user.value = parsedUser
                token.value = savedToken
            }
        } catch (error) {
            console.error('Error parsing saved user:', error)
        }
    }

    function isValidUser(data: any): data is User {
        if (!data || typeof data !== 'object') return false

        if (!data.id || typeof data.id !== 'number') return false
        if (!data.name || typeof data.name !== 'string') return false
        if (!data.email || typeof data.email !== 'string') return false
        if (typeof data.is_admin !== 'boolean') return false

        if (data.picture !== undefined && typeof data.picture !== 'string') return false
        if (data.address !== undefined && typeof data.address !== 'string') return false
        if (data.phone !== undefined && typeof data.phone !== 'string') return false

        if (!isValidEmail(data.email)) return false

        return true
    }

    function isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    function login(userData: { token: string; user: User }) {
        if (!isValidUser(userData.user)) {
            throw new Error('Invalid user data')
        }

        user.value = userData.user
        token.value = userData.token
        localStorage.setItem('user', JSON.stringify(userData.user))
        localStorage.setItem('token', userData.token)
    }

    function logout() {
        user.value = null
        token.value = null
        localStorage.removeItem('user')
        localStorage.removeItem('token')
    }

    function updateUser(userData: User) {
        if (!isValidUser(userData)) {
            throw new Error('Invalid user data')
        }
        user.value = userData
        localStorage.setItem('user', JSON.stringify(userData))
    }

    return {
        user,
        token,
        login,
        logout,
        updateUser,
        isValidUser
    }
}) 