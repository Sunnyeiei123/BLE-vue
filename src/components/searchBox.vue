<template>
    <v-container>
      <v-row>
        <v-col cols="3" style="margin-top: 5rem; margin-left: 14rem;">
          <v-text-field class="custom-text-field" v-model="searchQuery" label="Search asset/build/room" placeholder="Search" outlined></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchQuery: '',
      };
    },
  };
  </script>
  
  <style scoped>
  
  </style>
  