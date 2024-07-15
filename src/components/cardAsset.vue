<template>
    <div>
        <div class="d-flex justify-center flex-wrap">
            <v-card class="custom-card" @click="navigateToLocation('/location', 1)">
                <v-card-title class="headline grey lighten-2">
                    Total Asset
                </v-card-title>
                <v-card-text>
                    <div class="bar-text">
                        {{ assetCount }} assets
                    </div>
                </v-card-text>
            </v-card>
            <v-card class="custom-card" @click="navigateToLocation('/location', 2)"
                style="width: 300px; margin-top: 10rem; margin-left: 2rem">
                <v-card-title class="headline grey lighten-2" style="font-weight: bold;">
                    Asset In Use
                </v-card-title>
                <v-card-text>
                    <div class="green-text" style="font-size: 2.5rem; font-weight: bold;">
                        {{ assetInUseCount }} assets
                    </div>
                </v-card-text>
            </v-card>
            <v-card class="custom-card" @click="navigateToLocation('/location', 3)"
                style="width: 300px; margin-top: 10rem; margin-left: 2rem">
                <v-card-title class="headline grey lighten-2" style="font-weight: bold;">
                    Lost Signal
                </v-card-title>
                <v-card-text>
                    <div class="red-text" style="font-size: 2.5rem; font-weight: bold;">
                        {{ assetLostCount }} assets
                    </div>
                </v-card-text>
            </v-card>
        </div>
        <hr style="margin-top: 2.5rem; border: 1px solid;">
        <div>
            <div class="button-container">
                <button class="styled-button" @click="changeMap(1)">Map 1</button>
                <button class="styled-button" @click="changeMap(2)">Map 2</button>
                <button class="styled-button" @click="changeMap(3)">Map 3</button>
                <button class="styled-button" @click="changeMap(4)">Map 4</button>
                <button class="styled-button" @click="changeMap(5)">Map 5</button>
                <button class="styled-button" @click="changeMap(6)">Map 6</button>
                <button class="styled-button" @click="changeMap(7)">Map 7</button>
                <button class="styled-button" @click="changeMap(8)">Map 8</button>
                <button class="styled-button" @click="changeMap(9)">Map 9</button>
            </div>
            <MapComponent :maps="maps" :currentMapIndex="currentMapIndex" :customIcon="customIcon" />
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import MapComponent from './mapCom.vue'; // นำเข้า MapComponent
import mapsData from '../intel/mapsData'; // นำเข้าข้อมูลแผนที่

export default {
    components: {
        MapComponent
    },
    data() {
        return {
            assetCount: 0,
            assetLostCount: 0,
            assetInUseCount: 0,
            currentMapIndex: 1,
            maps: mapsData, // ใช้ข้อมูลแผนที่จาก mapsData.js
            customIcon: L.icon({
                iconUrl: require('@/assets/custom-marker.png'),
                iconSize: [20, 20], // ขนาดของ icon
                iconAnchor: [10, 10], // จุด anchor ของ icon อยู่ตรงกลางของ icon
                popupAnchor: [0, -10] // จุด anchor ของ popup อยู่ด้านบนของ icon
            })
        };
    },
    mounted() {
        this.fetchAssetCount();
        this.fetchAssetsInUseCount();
        this.fetchAssetsLostCount();
    },
    methods: {
        async fetchAssetCount() {
            try {
                const response = await axios.get('http://10.1.55.230:7777/tags/gets');
                if (response.data && response.data.total) {
                    this.assetCount = response.data.total;
                }
            } catch (error) {
                console.error('Error fetching asset count:', error);
            }
        },
        async fetchAssetsInUseCount() {
            try {
                const response = await axios.get('http://10.1.55.230:7777/current/gets/use');
                if (response.data && response.data.total) {
                    this.assetInUseCount = response.data.total;
                }
            } catch (error) {
                console.error('Error fetching assets in use count:', error);
            }
        },
        async fetchAssetsLostCount() {
            try {
                const response = await axios.get('http://10.1.55.230:7777/current/gets/lost');
                if (response.data && response.data.total) {
                    this.assetLostCount = response.data.total;
                }
            } catch (error) {
                console.error('Error fetching lost assets count:', error);
            }
        },
        changeMap(mapIndex) {
            this.currentMapIndex = mapIndex;
        },
        navigateToLocation(route, selectedCard) {
            this.$router.push(route);
            localStorage.setItem('selectedCard', selectedCard);
        }
    }
};
</script>

<style scoped>
.custom-card {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

.bar-text {
    color: rgb(32, 42, 62);
}

.green-text {
    color: green;
}

.red-text {
    color: red;
}

.yellow-text {
    color: orange;
}

.mt-5 {
    margin-top: 5rem;
}

.mt-3 {
    margin-top: 3rem;
}

.ma-2 {
    margin: 0.5rem;
}

.selected-button {
    background-color: rgb(32, 42, 62);
    color: white;
}

.justify-center {
    justify-content: center;
}

@media (max-width: 600px) {
    .custom-card {
        width: 90%;
        margin: 1rem 0;
    }

    .d-flex {
        flex-direction: column;
    }
}

@media (min-width: 601px) and (max-width: 960px) {
    .custom-card {
        width: 45%;
        margin: 1rem 2%;
    }
}

.custom-card {
    width: 300px;
    margin-top: 10rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
    /* Make the cursor a pointer to indicate it's clickable */
}

.custom-card:hover {
    transform: translateY(-10px);
    /* Lift the card up on hover */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    /* Add a shadow effect */
}

.headline {
    font-weight: bold;
}

.bar-text {
    font-size: 2.5rem;
    font-weight: bold;
}

#map {
    width: 100%;
    height: 600px;
}

.button-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around; /* Ensure space between buttons */
  gap: 10px;
}

.styled-button {
  background-color: rgb(32, 42, 62); /* Green background */
  border: none; /* Remove borders */
  color: white; /* White text */
  padding: 15px 32px; /* Some padding */
  text-align: center; /* Centered text */
  text-decoration: none; /* Remove underline */
  display: inline-block; /* Get the element to line up correctly */
  font-size: 16px; /* Increase font size */
  margin: 4px 2px; /* Some margin */
  cursor: pointer; /* Pointer/hand icon */
  border-radius: 12px; /* Rounded corners */
  transition: background-color 0.3s ease; /* Smooth transition for background color */
}

.styled-button:hover {
  background-color: rgb(32, 42, 62); /* Darker green on hover */
}

.styled-button:active {
  background-color: rgb(26, 23, 23);
  color: rgb(244, 242, 242); /* Even darker green when clicked */
}

.styled-button:focus {
  outline: none; /* Remove outline on focus */
  box-shadow: 0 0 10px #719ECE; /* Add a blue shadow for focus indication */
}
</style>
../intel/mapsData