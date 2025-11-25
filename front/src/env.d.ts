/// <reference types="vite/client" />
/// <reference types="vue" />
/// <reference types="vue-router" />

// Suporte a componentes .vue
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

// Suporte a imagens
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

// Suporte ao toastification
declare module 'vue-toastification' {
    import { Plugin } from 'vue'
    const plugin: Plugin
    export default plugin
}
