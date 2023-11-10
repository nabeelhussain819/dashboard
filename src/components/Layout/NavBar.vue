<template>
  <a-layout-header class="header shadow sticky top-0 z-10">

    <div class="flex items-center w-100 justify-between">
      <a-image
    :width="160"
    :height="60"
    class="pt-2"
    :preview=false
    :src="require(`../../assets/Screenshot.png`)"
  />
      
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-1">
          <a-input placeholder="Search By Name" class="w-[40rem]" />
          <a-button @click="visible = !visible">
            <SearchOutlined />
          </a-button>
        </div>
          <a-divider type="vertical" />
        <SettingOutlined class="text-xl" />
        <div >
          <a-divider type="vertical" />
          <a-avatar size="large" :gap="gap">
            AD
          </a-avatar>
          Admin
        </div>
      </div>
    </div>
  </a-layout-header>
</template>
<script>
import { SearchOutlined, SettingOutlined } from '@ant-design/icons-vue';
export default {
  name: 'NavBar',
  components: {
    SearchOutlined,
    SettingOutlined,
  },
}
</script>