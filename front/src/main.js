import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import Toast, { POSITION } from "vue-toastification/dist/index.mjs"
import "vue-toastification/dist/index.css"

const app = createApp(App)

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

app.use(router)
app.use(Toast, toastOptions)
app.mount('#app')
