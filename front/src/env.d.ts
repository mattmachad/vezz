/// <reference types="vite/client" />
/// <reference types="vue" />
/// <reference types="vue-router" />

declare module '*.vue' {
    import { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module '*.png' {
    const value: string
    export default value
}

declare module '*.svg' {
    const value: string
    export default value
}

declare module '*.jpg' {
    const value: string
    export default value
}

declare module '*.jpeg' {
    const value: string
    export default value
}

declare module 'vue-toastification' {
    import { Plugin } from 'vue'
    export const useToast: () => {
        success: (message: string) => void
        error: (message: string) => void
        warning: (message: string) => void
        info: (message: string) => void
    }
    const plugin: Plugin
    export default plugin
}
