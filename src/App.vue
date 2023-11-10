<template>
  <a-layout>
    <NavBar />
    <a-layout>
      <SideBar />
      <a-layout style="padding: 0 24px 24px">
        <div id="app">
          <!-- <DashboardView msg="Welcome to Your Dashboard"/> -->
          <router-view />
        </div>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script>
// import DashboardView from './components/Dashboard.vue'
import SideBar from './components/Layout/SideBar.vue'
import NavBar from './components/Layout/NavBar.vue'

export default {
  name: 'App',
  components: {
    SideBar,
    // DashboardView,
    NavBar
  }
}
</script>

