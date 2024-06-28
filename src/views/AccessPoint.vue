<template>
    <div>
        <ap/>
      <BarNav />
    </div>
  </template>
  
  
  <script>
  import BarNav from '../components/bar_nav.vue';
  import ap from '../components/AccessPoint.vue'
  
  export default {
    components: {
      BarNav,
      ap,
    }
  }
  </script>
  