<template>
  <v-app>
    <v-app-bar class="color" app>
      <v-app-bar-nav-icon color="white" @click="drawer = !drawer" style="font-size: 24px;"></v-app-bar-nav-icon>
      <v-toolbar-title class="white-text">BLE test</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-span text class="white-text" style="padding: 1rem;">HI, I'm {{ username }}</v-span>
      <v-avatar style="margin-right: 1rem">
        <v-img alt="John" src="../components/img/3541871.png"></v-img>
      </v-avatar>
    </v-app-bar>
    <v-navigation-drawer class="sidecolor" v-model="drawer" app>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="dashboard-title" @click="toggleSubmenu('Dashboard')">
              Dashboard
              <v-icon>{{ selectedSubmenu === 'Dashboard' ? 'mdi-minus' : 'mdi-plus' }}</v-icon>
            </v-list-item-title>
          </v-list-item-content>
          <template v-if="selectedSubmenu === 'Dashboard'">
            <v-list-item v-for="subItem in dashboardSubitems" :key="subItem" link @click="goToRoute(subItem)">
              <v-list-item-content>
                <v-list-item-title>{{ subItem }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="map-title" @click="toggleSubmenu('Map')">
              Manage
              <v-icon>{{ selectedSubmenu === 'Map' ? 'mdi-minus' : 'mdi-plus' }}</v-icon>
            </v-list-item-title>
          </v-list-item-content>
          <template v-if="selectedSubmenu === 'Map'">
            <v-list-item v-for="subItem in mapSubitems" :key="subItem" link @click="goToRoute(subItem)">
              <v-list-item-content>
                <v-list-item-title>{{ subItem }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import router from '../router';

export default {
  setup() {
    const drawer = ref(false);
    const selectedSubmenu = ref(null);
    const dashboardSubitems = ['Overview', 'Error Log'];
    const mapSubitems = ['List Asset'];
    const username = ref('');

    const toggleSubmenu = (menu) => {
      selectedSubmenu.value = (selectedSubmenu.value === menu) ? null : menu;
    };

    const routeMap = {
      'Overview': '/overview',
      'Error Log': '/error-log',
      'List Asset': '/list-asset'
    };

    const goToRoute = (subItem) => {
      router.push(routeMap[subItem]);
    };

    const fetchUsernameById = async (id) => {
      try {
        const response = await axios.get(`http://10.1.55.230:7777/user/gets/${id}`);
        username.value = response.data.username;
      } catch (error) {
        console.error('Failed to fetch username:', error);

        if (error.response) {
          console.error(`API Response Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
          console.error('No response received from API:', error.request);
        } else {
          console.error('Error setting up API request:', error.message);
        }
      }
    };

    onMounted(() => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        console.log('Fetched User ID from localStorage:', userId);
        fetchUsernameById(userId);
      } else {
        console.error('No user ID found, user may not be logged in');
      }
    });

    return { drawer, selectedSubmenu, dashboardSubitems, mapSubitems, toggleSubmenu, goToRoute, username };
  },
  router
};
</script>

<style scoped>
.white-text {
  color: white;
}

.color {
  background-color: rgb(32, 42, 62);
}

.sidecolor {
  background-color: rgb(155, 164, 181);
}

.dashboard-title,
.map-title {
  cursor: pointer;
}
</style>
