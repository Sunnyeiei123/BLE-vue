<template>
  <v-container>
    <v-row align="center">
      <!-- Text Field Column -->
      <v-col cols="4" style="margin-top: 5rem; margin-left: 14rem;">
        <v-text-field class="custom-text-field" v-model="searchQuery" label="Search asset/build/room" placeholder="Search" outlined></v-text-field>
      </v-col>
      
      <!-- Buttons Column -->
      <v-col cols="auto" style="margin-top: 5rem;">
        <v-btn @click="add" class="color white-text">Add</v-btn>
      </v-col>
      <v-col cols="auto" style="margin-top: 5rem;">
        <v-btn @click="deleteItem" class="color white-text">Del</v-btn>
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
  methods: {
    add() {
      // Add functionality
    },
    deleteItem() {
      // Delete functionality
    }
  }
};
</script>

<style scoped>
.color {
  background-color: rgb(32, 42, 62);
}
.white-text {
  color: white;
}
/* Add scoped styles if needed */
</style>
