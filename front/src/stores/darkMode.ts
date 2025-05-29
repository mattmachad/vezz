import { defineStore } from 'pinia'

export const useDarkModeStore = defineStore('darkMode', {
    state: () => ({
        isDark: localStorage.getItem('darkMode') === 'true'
    }),
    actions: {
        toggleDarkMode() {
            this.isDark = !this.isDark
            localStorage.setItem('darkMode', this.isDark.toString())
            this.applyTheme()
        },
        applyTheme() {
            document.documentElement.classList.toggle('dark-mode', this.isDark)
        },
        init() {
            this.applyTheme()
        }
    }
}) 