
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
            <v-card class="custom-card" @click="navigateToLocation('/location', 2)" style="margin-left: 2rem">
                <v-card-title class="headline grey lighten-2" style="font-weight: bold;">
                    Asset In Use
                </v-card-title>
                <v-card-text>
                    <div class="green-text" style="font-size: 2.5rem; font-weight: bold;">
                        {{ assetInUseCount }} assets
                    </div>
                </v-card-text>
            </v-card>
            <v-card class="custom-card" @click="navigateToLocation('/location', 3)" style="margin-left: 2rem">
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
        <hr style="margin-top: 1rem; border: 1px solid;">
        <div>
            <div class="button-container">
                <button class="styled-button" :class="{ active: selectedMap === 1 }" @click="changeMap(1)">Map 1</button>
                <button class="styled-button" :class="{ active: selectedMap === 2 }" @click="changeMap(2)">Map 2</button>
                <button class="styled-button" :class="{ active: selectedMap === 3 }" @click="changeMap(3)">Map 3</button>
                <button class="styled-button" :class="{ active: selectedMap === 4 }" @click="changeMap(4)">Map 4</button>
                <button class="styled-button" :class="{ active: selectedMap === 5 }" @click="changeMap(5)">Map 5</button>
                <button class="styled-button" :class="{ active: selectedMap === 6 }" @click="changeMap(6)">Map 6</button>
                <button class="styled-button" :class="{ active: selectedMap === 7 }" @click="changeMap(7)">Map 7</button>
                <button class="styled-button" :class="{ active: selectedMap === 8 }" @click="changeMap(8)">Map 8</button>
                <button class="styled-button" :class="{ active: selectedMap === 9 }" @click="changeMap(9)">Map 9</button>
            </div>
            <div v-if="loading" class="loading-container">
                <div class="loading-spinner"></div>
                <p>Loading map...</p>
            </div>
            <MapComponent v-if="!loading" :maps="maps" :currentMapIndex="currentMapIndex" :customIcon="customIcon" :customIcon2="customIcon2" />
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import MapComponent from './mapCom.vue'; // นำเข้า MapComponent
import mapsData from '../intel/mapsData'; // นำเข้าข้อมูลแผนที่
import { api } from "../axios";

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
            selectedMap: 1, // ตัวแปรสำหรับเก็บข้อมูลแผนที่ที่ถูกเลือก
            maps: mapsData, // ใช้ข้อมูลแผนที่จาก mapsData.js
            loading: true // เพิ่มตัวแปรสำหรับสถานะการโหลด
        };
    },
    mounted() {
        this.fetchAssetCount();
        this.fetchAssetsInUseCount();
        this.fetchAssetsLostCount();
        this.loadMarkers();
    },
    methods: {
        async fetchAssetCount() {
            try {
                const response = await api.get('/tags/gets');
                if (response.data && response.data.total) {
                    this.assetCount = response.data.total;
                }
            } catch (error) {
                console.error('Error fetching asset count:', error);
            }
        },
        async fetchAssetsInUseCount() {
            try {
                const response = await api.get('/current/gets/use');
                if (response.data && response.data.total) {
                    this.assetInUseCount = response.data.total;
                }
            } catch (error) {
                console.error('Error fetching assets in use count:', error);
            }
        },
        async fetchAssetsLostCount() {
            try {
                const response = await api.get('/current/gets/lost');
                if (response.data && response.data.total) {
                    this.assetLostCount = response.data.total;
                }
            } catch (error) {
                console.error('Error fetching lost assets count:', error);
            }
        },
        async loadMarkers() {
            // เรียก API หรือโหลดข้อมูล markers ที่นี่
            // จำลองการโหลดข้อมูล markers โดยใช้ setTimeout
            setTimeout(() => {
                // หลังจากที่โหลดข้อมูล markers เสร็จแล้ว
                this.loading = false;
            }, 2000); // สมมติว่าใช้เวลา 2 วินาทีในการโหลด
        },
        changeMap(mapIndex) {
            this.currentMapIndex = mapIndex;
            this.selectedMap = mapIndex; // อัปเดตตัวแปรเมื่อเลือกแผนที่ใหม่
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
    margin-top: 6rem;
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
    justify-content: space-around;
    /* Ensure space between buttons */
    gap: 10px;
}

.styled-button {
    background-color: rgb(255, 255, 255);
    /* Green background */
    border: none;
    /* Remove borders */
    color: rgb(0, 0, 0);
    /* White text */
    padding: 8px 30px;
    /* Some padding */
    text-align: center;
    /* Centered text */
    text-decoration: none;
    /* Remove underline */
    display: inline-block;
    /* Get the element to line up correctly */
    font-size: 16px;
    /* Increase font size */
    margin: 4px 2px;
    /* Some margin */
    cursor: pointer;
    /* Pointer/hand icon */
    border-radius: 12px;
    /* Rounded corners */
    transition: background-color 0.5s ease;
    /* Smooth transition for background color */
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.2);
    border: 2px solid #2e3375;

}

.styled-button:hover {
    background-color: rgb(39, 65, 113);
    color: white;
    /* Darker green on hover */
}

.styled-button:active {
    background-color: rgb(0, 93, 244);
    color: rgb(244, 242, 242);
    /* Even darker green when clicked */
}

.styled-button:focus {
    outline: none;
    /* Remove outline on focus */
    box-shadow: 0 0 10px #007bff;
    /* Add a blue shadow for focus indication */
}

.active {
    background-color: #151e2e !important; /* สีแดงเมื่อปุ่มถูกเลือก */
    color: rgb(255, 248, 248);
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 600px; /* Same height as the map */
}

.loading-spinner {
    border: 16px solid #f3f3f3;
    border-top: 16px solid #3498db;
    border-radius: 50%;
    width: 120px;
    height: 120px;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
