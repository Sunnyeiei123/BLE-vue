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
      <v-card class="custom-card" @click="navigateToLocation('/location', 2)" style="width: 300px; margin-top: 10rem; margin-left: 2rem">
        <v-card-title class="headline grey lighten-2" style="font-weight: bold;">
          Asset In Use
        </v-card-title>
        <v-card-text>
          <div class="green-text" style="font-size: 2.5rem; font-weight: bold;">
            {{ assetInUseCount }} assets
          </div>
        </v-card-text>
      </v-card>
      <v-card class="custom-card" @click="navigateToLocation('/location', 3)" style="width: 300px; margin-top: 10rem; margin-left: 2rem">
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
      <div>
        <button @click="changeMap(1)">Map 1</button>
        <button @click="changeMap(2)">Map 2</button>
      </div>
      <div id="map" style="height: 600px;"></div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import L from 'leaflet';

export default {
  data() {
    return {
      assetCount: 0,
      assetLostCount: 0,
      assetInUseCount: 0,
      map: null,
      currentMapIndex: 1,
      maps: [
        {
          imageUrl: require('@/assets/อาคาร Wellnese 9 ชั้น-1.png'),
          imageBounds: [
            [0, 0],
            [1700, 2800]
          ],
          markers: [
            { position: [817, 1766], popupText: 'สถานที่ 1' },
            { position: [1300,850], popupText: 'สถานที่ 2' }
          ]
        },
        {
          imageUrl: require('@/assets/อาคาร Wellnese 9 ชั้น-1.png'),
          imageBounds: [
            [0, 0],
            [1700, 2800]
          ],
          markers: [
            { position: [600, 800], popupText: 'สถานที่ A' },
            { position: [1100, 1600], popupText: 'สถานที่ B' }
          ]
        },
        // เพิ่มข้อมูลแผนที่ 3 และ 4
      ],
      customIcon: L.icon({
        iconUrl: require('@/assets/custom-marker.png'),
        iconSize: [20, 20], // ขนาดของ icon
        iconAnchor: [10, 10], // จุด anchor ของ icon อยู่ตรงกลางของ icon
        popupAnchor: [0, -10] // จุด anchor ของ popup อยู่ด้านบนของ icon
      })
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      const mapData = this.maps[this.currentMapIndex - 1];
      // สร้างแผนที่
      this.map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -2,
        maxZoom: 2,
        zoom: 0, // กำหนดค่า zoom เริ่มต้น
        zoomControl: true,
        zoom: 1,
        zoomAnimation: false,
        fadeAnimation: true,
        markerZoomAnimation: true,
        center: [850, 1400] // กำหนดตำแหน่งศูนย์กลางของแผนที่
      });

      // เพิ่ม image overlay
      L.imageOverlay(mapData.imageUrl, mapData.imageBounds).addTo(this.map);

      // ตั้งค่า view ของแผนที่ให้แสดงภาพทั้งหมด
      this.map.fitBounds(mapData.imageBounds);

      // เพิ่ม markers
      this.addMarkers(mapData.markers);
    },
    addMarkers(markers) {
      markers.forEach(marker => {
        L.marker(marker.position, { icon: this.customIcon })
          .addTo(this.map)
          .bindPopup(marker.popupText);
      });
    },
    changeMap(mapIndex) {
      this.currentMapIndex = mapIndex;
      this.map.remove(); // ลบแผนที่เก่า
      this.initMap(); // สร้างแผนที่ใหม่
    },
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
    selectImage(image) {
      this.selectedImage = image;
      // Store the selected image in localStorage
      localStorage.setItem('selectedImage', image);
    },
    navigateToLocation(route, selectedCard) {
      this.$router.push(route);
      localStorage.setItem('selectedCard', selectedCard); // Store selected card in localStorage
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
</style>

