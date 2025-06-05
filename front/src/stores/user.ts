import { defineStore } from 'pinia'

interface UserProfile {
    id?: number
    name: string
    email: string
    photo?: string
    street?: string
    neighborhood?: string
    city?: string
    state?: string
    cep?: string
}

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as UserProfile | null,
        loading: false,
        error: null as string | null
    }),

    actions: {
        init() {
            const storedProfile = localStorage.getItem('userProfile')
            if (storedProfile) {
                try {
                    this.user = JSON.parse(storedProfile)
                } catch (error) {
                    console.error('Error parsing stored user profile:', error)
                    this.user = null
                }
            }
        },

        setUser(user: UserProfile) {
            this.user = user
            localStorage.setItem('userProfile', JSON.stringify(user))
        },

        updateUser(updates: Partial<UserProfile>) {
            if (this.user) {
                this.user = { ...this.user, ...updates }
                localStorage.setItem('userProfile', JSON.stringify(this.user))
            }
        },

        async fetchUserProfile(userId: number) {
            this.loading = true
            this.error = null

            try {
                const response = await fetch(`/api/users/${userId}`)
                const data = await response.json()

                if (response.ok) {
                    this.setUser(data)
                } else {
                    throw new Error(data.message || 'Failed to fetch user profile')
                }
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'An error occurred'
                console.error('Error fetching user profile:', error)
            } finally {
                this.loading = false
            }
        },

        async saveUserProfile(profile: UserProfile) {
            this.loading = true
            this.error = null

            try {
                const response = await fetch(`/api/users/${profile.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(profile)
                })

                const data = await response.json()

                if (response.ok) {
                    this.setUser(data)
                    return true
                } else {
                    throw new Error(data.message || 'Failed to save user profile')
                }
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'An error occurred'
                console.error('Error saving user profile:', error)
                return false
            } finally {
                this.loading = false
            }
        },

        clearUser() {
            this.user = null
            localStorage.removeItem('userProfile')
        }
    },

    getters: {
        hasProfile: (state) => state.user !== null,
        fullAddress: (state) => {
            if (!state.user) return ''
            const parts = [
                state.user.street,
                state.user.neighborhood,
                state.user.city,
                state.user.state,
                state.user.cep
            ].filter(Boolean)
            return parts.join(', ')
        }
    }
}) 