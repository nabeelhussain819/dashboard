import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/home.vue';
import Products from '../pages/products.vue';
import Inventory from '../pages/inventory.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  { 
    path: '/products', 
    name: 'Products', 
    component: Products  
  },
  { 
    path: '/inventory', 
    name: 'Inventory', 
    component: Inventory  
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
