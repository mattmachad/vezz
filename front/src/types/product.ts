export interface Product {
    id: number
    title: string
    price: number
    quantities: {
        [key: string]: number
    }
    color: string
    gender: string
    category: string
    picture?: string
}

// Helper interface for display purposes
export interface DisplayProduct {
    id: number
    name: string
    description: string
    price: number
    images: string[]
    sizes: string[]
    stock: number
    category: string
    gender: string
    color: string
    sizeDetails: {
        size: string
        quantity: number
        available: boolean
    }[]
} 