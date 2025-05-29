declare module 'vue-toastification/dist/index.mjs' {
    import { Plugin } from 'vue'

    export const POSITION: {
        TOP_LEFT: string
        TOP_CENTER: string
        TOP_RIGHT: string
        BOTTOM_LEFT: string
        BOTTOM_CENTER: string
        BOTTOM_RIGHT: string
    }

    export interface ToastOptions {
        position?: string
        timeout?: number
        closeOnClick?: boolean
        pauseOnFocusLoss?: boolean
        pauseOnHover?: boolean
        draggable?: boolean
        draggablePercent?: number
        showCloseButtonOnHover?: boolean
        hideProgressBar?: boolean
        closeButton?: string
        icon?: boolean
        rtl?: boolean
    }

    const plugin: Plugin
    export default plugin
} 