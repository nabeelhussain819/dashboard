<template>
  <ListView />
</template>

<script>
import { defineComponent } from "vue";
import ListView from "../components/products/List.vue"


export default defineComponent({
  name: "ProductsView",
  components: {
    ListView
  },


});
</script>

