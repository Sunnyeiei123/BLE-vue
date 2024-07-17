<template>
  <div>
    <v-app-bar class="color" style="padding: 0.5rem" app>
      <v-app-bar-nav-icon color="white" @click="drawer = !drawer" style="font-size: 24px;"></v-app-bar-nav-icon>
      <v-toolbar-title class="custom-eiei white-text text-h4">Wellness Asset</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-span text class="white-text text-h6" style="padding: 1rem;">Hi, {{ username }}</v-span>
      <v-avatar style="margin-right: 1rem">
        <v-img alt="User" src="../components/img/3541871.png" class="ma-4" max-width="200"></v-img>
      </v-avatar>
    </v-app-bar>
    <v-navigation-drawer class="sidecolor" v-model="drawer" app>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="dashboard-title white-text" @click="toggleSubmenu('Dashboard')">
              Dashboard
              <v-icon size="18">{{ selectedSubmenu === 'Dashboard' ? 'mdi-arrow-up' : 'mdi-arrow-down' }}</v-icon>
            </v-list-item-title>
          </v-list-item-content>
          <transition name="slide-fade">
            <div v-if="selectedSubmenu === 'Dashboard'">
              <v-list-item class="subitem white-text" v-for="subItem in dashboardSubitems" :key="subItem" link @click="goToRoute(subItem)">
                <v-list-item-content>
                  <v-list-item-title>{{ subItem }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </div>
          </transition>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="map-title white-text" @click="toggleSubmenu('Map')">
              Manage
              <v-icon size="18">{{ selectedSubmenu === 'Map' ? 'mdi-arrow-up' : 'mdi-arrow-down' }}</v-icon>
            </v-list-item-title>
          </v-list-item-content>
          <transition name="slide-fade">
            <div v-if="selectedSubmenu === 'Map'">
              <v-list-item class="subitem white-text" v-for="subItem in mapSubitems" :key="subItem" link @click="goToRoute(subItem)">
                <v-list-item-content>
                  <v-list-item-title>{{ subItem }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </div>
          </transition>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import router from '../router';
import { api } from "../axios";

export default {
  setup() {
    const drawer = ref(false);
    const selectedSubmenu = ref(null);
    const dashboardSubitems = ['Overview', 'Location'];
    const mapSubitems = ['Asset', 'Access Point'];
    const username = ref(localStorage.getItem('username') || '');

    const toggleSubmenu = (menu) => {
      selectedSubmenu.value = (selectedSubmenu.value === menu) ? null : menu;
    };

    const routeMap = {
      'Overview': '/overview',
      'Location': '/location',
      'Asset': '/list-asset',
      'Access Point': '/access-point',
    };

    const goToRoute = (subItem) => {
      router.push(routeMap[subItem]);
    };

    const fetchUsernameById = async (id) => {
      try {
        const response = await api.get(`/user/gets`);
        const user = response.data.find(user => user._id === id);
        if (user) {
          username.value = user.username;
          localStorage.setItem('username', user.username);
        }
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
  background-color: #394867;
  padding-top: 1rem;
}

.dashboard-title,
.map-title {
  cursor: pointer;
  font-weight: bold;
  font-size: 1.1rem;
  padding: 0.5rem 1rem;
  transition: background-color 0.3s ease;
}

.dashboard-title:hover,
.map-title:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.subitem {
  padding-left: 2rem;
  transition: all 0.3s ease;
}

.subitem:hover {
  background-color: rgba(255, 255, 255, 0.1);
  padding-left: 2.5rem;
  border-left: 4px solid #fff;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

@media (max-width: 600px) {
  .v-app-bar {
    font-size: 16px;
  }
  .v-app-bar-nav-icon {
    font-size: 18px !important;
  }
  .v-avatar {
    display: none;
  }
  .white-text {
    font-size: 14px;
  }
  .dashboard-title,
  .map-title {
    font-size: 1rem;
    padding: 0.3rem 0.5rem;
  }
  .subitem {
    padding-left: 1rem;
  }
}
.custom-eiei {
  letter-spacing: 2px;
  margin-right: auto;
}
</style>
