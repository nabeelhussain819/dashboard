<template>
    <ListView />
  </template>
  
  <script>
  import { defineComponent } from "vue";
  import ListView from "../components/inventory/List.vue"
  
  
  export default defineComponent({
    name: "InventoryView",
    components: {
      ListView
    },
  
  
  });
  </script>
  
  