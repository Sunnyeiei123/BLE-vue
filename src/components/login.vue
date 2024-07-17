<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="8" sm="3" md="3">
        <v-card class="login-card">
          <v-img :src="require('../components/img/logo_mfuwebtypo3_09052018-02.png')" />
          <v-card class="pa-3" dark>
            <v-form @submit.prevent="login">
              <v-text-field v-model="username" label="Username" outlined required></v-text-field>
              <v-text-field v-model="password" label="Password" outlined required type="password"></v-text-field>
              <v-btn class="color white-text" dark block type="submit">Sign In</v-btn>
            </v-form>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="text-center" color="transparent">
          <v-card-text>
            <span>By clicking continue, you agree to our
              <a href="https://www.termsfeed.com/blog/terms-conditions-url/" target="_blank">Terms of Service and Privacy Policy</a>
            </span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import axios from 'axios';
import { api } from "../axios";

export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async login() {
      try {
        const response = await api.post('/user/login', {
          username: this.username,
          password: this.password
        });

        const user = response.data;
        localStorage.setItem('userId', user._id);
        localStorage.setItem('username', user.username);
        console.log('Stored User ID:', user._id);

        this.$router.push('/overview');
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            alert('Wrong Username');
          } else if (error.response.status === 500) {
            alert('Internal Server Error');
          } else if (error.response.status === 401) {
            alert('Wrong Password');
          } else {
            alert(`Error: ${error.response.status}`);
          }
        } else if (error.request) {
          console.error('No response received:', error.request);
          alert('No response from server. Please try again later.');
        } else {
          console.error('Error during login:', error.message);
          alert('An error occurred. Please try again.');
        }
      }
    }
  }
}
</script>

<style scoped>
.login-card {
  margin-top: 14rem;
  border-radius: 4px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.color {
  background-color: rgb(32, 42, 62);
}

.white-text {
  color: white;
}
</style>
