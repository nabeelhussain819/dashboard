
import Vue from 'vue'
import VueRouter from 'vue-router'
import ProductsView from '../views/ProductsView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: () => import("../views/HomeView.vue"),
  },
  { 
    path: '/products', 
    name: 'ProductsView', 
    Component: ProductsView 
},
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router