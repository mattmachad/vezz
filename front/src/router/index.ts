import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Products from '@/views/Products.vue'
import ProductDetails from '@/views/ProductDetails.vue'
import Checkout from '@/views/Checkout.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import About from '@/views/About.vue'
import LookBook from '@/views/LookBook.vue'
import OrderSuccess from '@/views/OrderSuccess.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/products',
            name: 'products',
            component: Products
        },
        {
            path: '/products/:id',
            name: 'product-details',
            component: ProductDetails
        },
        {
            path: '/checkout',
            name: 'checkout',
            component: Checkout
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/register',
            name: 'register',
            component: Register
        },
        {
            path: '/about',
            name: 'about',
            component: About
        },
        {
            path: '/lookbook',
            name: 'lookbook',
            component: LookBook
        },
        {
            path: '/ordersuccess',
            name: 'ordersuccess',
            component: OrderSuccess
        }
    ]
})

export default router;
