import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import Toast, { POSITION } from "vue-toastification/dist/index.mjs"
import "vue-toastification/dist/index.css"

// Create app instance
const app = createApp(App)

// Create Pinia instance
const pinia = createPinia()

// Toast configuration
const toastOptions = {
    position: POSITION.BOTTOM_RIGHT,
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false
}

// Install plugins
app.use(pinia)  // Install Pinia first
app.use(router)
app.use(Toast, toastOptions)

// Mount the app
app.mount('#app')
