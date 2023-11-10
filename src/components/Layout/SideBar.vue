<template>
  <a-layout-sider 
  v-model:collapsed="visible" collapsible>
    <a-button type="ghost" style="margin: 13px; color: white !important; border: none !important; background-color: transparent !important;" class="text-xl" @click="toggleCollapsed">
      <MenuUnfoldOutlined v-if="visible" />
      <MenuFoldOutlined v-else />
    </a-button>
    <a-menu theme="dark" v-model:selectedKeys="selectedKeys" mode="inline" class="">
      <a-menu-item key="1">
        <router-link to="/">
          <AppstoreOutlined />
          <span>Dashbord</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="2">
        <DatabaseOutlined />
        <span>Inventory</span>
      </a-menu-item>
      <a-menu-item key="3">
        <router-link to="/products">
          <ShoppingCartOutlined />
          <span>Products</span>
        </router-link>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>
<script>
import {
  AppstoreOutlined,
  ShoppingCartOutlined,
  DatabaseOutlined,MenuUnfoldOutlined,MenuFoldOutlined
} from '@ant-design/icons-vue';
import { ref } from 'vue';
const visible = ref(false);
export default {
  name: 'SideBar',
  components: {
    AppstoreOutlined,
    ShoppingCartOutlined,
    DatabaseOutlined,MenuFoldOutlined,MenuUnfoldOutlined
  },
  setup() {
    const toggleCollapsed = () => {
      visible.value = !visible.value
    }
    return {
      toggleCollapsed,visible
    }
  }
}
</script>