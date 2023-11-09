<template>
   <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo" />
      <a-menu theme="dark" v-model:selectedKeys="selectedKeys" mode="inline">
        <router-link to="/">
        <a-menu-item key="1">
            <router-link to="/">
          <AppstoreOutlined />
          <span>Dashbord</span></router-link>
        </a-menu-item></router-link>
        <a-menu-item key="2">
            <DatabaseOutlined />
          <span>Inventory</span>
        </a-menu-item>
        <a-menu-item key="3">
            <router-link to="/products">
            <ShoppingCartOutlined />
          <span>Products</span></router-link>
        </a-menu-item>
        <a-sub-menu key="sub2">
          <template #title>
            <span>
              <team-outlined />
              <span>Team</span>
            </span>
          </template>
          <a-menu-item key="6">Team 1</a-menu-item>
          <a-menu-item key="8">Team 2</a-menu-item>
        </a-sub-menu>
        <a-menu-item key="9">
          <file-outlined />
          <span>File</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
</template>
<script>
import {
    AppstoreOutlined,
    ShoppingCartOutlined,
    DatabaseOutlined
} from '@ant-design/icons-vue';
export default {
  name: 'SideBar',
  components:{
    AppstoreOutlined,
    ShoppingCartOutlined,
    DatabaseOutlined
  }
}
</script>