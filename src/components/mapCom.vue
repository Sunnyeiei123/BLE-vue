<template>
    <div id="map" style="height: 1000px;"></div>
</template>

<script>
import L from 'leaflet';
import { api } from "../axios";

export default {
    props: {
        maps: {
            type: Array,
            required: true
        },
        currentMapIndex: {
            type: Number,
            required: true
        },
        customIcon: {
            type: Object,
            required: true
        },
        customIcon2: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            map: null
        };
    },
    mounted() {
        this.initMap();
    },
    watch: {
        currentMapIndex() {
            this.changeMap(this.currentMapIndex);
        }
    },
    methods: {
        async initMap() {
            const mapData = this.maps[this.currentMapIndex - 1];
            this.map = L.map('map', {
                crs: L.CRS.Simple,
                minZoom: -2,
                maxZoom: 2,
                zoom: 0,
                zoomControl: true,
                zoomAnimation: false,
                fadeAnimation: true,
                markerZoomAnimation: true,
                center: [850, 1400]
            });

            L.imageOverlay(mapData.imageUrl, mapData.imageBounds).addTo(this.map);
            this.map.fitBounds(mapData.imageBounds);
            await this.addMarkers(mapData.markers);
        },
        async addMarkers(markers) {
            const tagMacs = await this.fetchTagMacs();
            console.log("tagMacs:", tagMacs); // เพิ่ม log เพื่อดู tagMacs

            markers.forEach(marker => {
                const popupText = this.generatePopupText(marker.popupText, tagMacs);
                console.log("Adding marker:", marker.position, popupText); // เพิ่ม log เพื่อดู marker details

                const apNumber = marker.popupText.split(' ')[1].padStart(3, '0'); // ดึงเฉพาะหมายเลข AP และ pad ให้ครบ 3 หลัก
                const hasTagMac = Object.keys(tagMacs).some(key => key.endsWith(`-AP${apNumber}`));

                L.marker(marker.position, {
                    icon: hasTagMac ? this.customIcon : this.customIcon2
                })
                    .addTo(this.map)
                    .bindPopup(popupText);
            });
        },
        async fetchTagMacs() {
            try {
                const response = await api.get('/current/gets/use');
                return response.data.data.reduce((acc, item) => {
                    const locationKey = `${item.location}`;
                    if (!acc[locationKey]) {
                        acc[locationKey] = [];
                    }
                    acc[locationKey].push(item.tagMac);
                    return acc;
                }, {});
            } catch (error) {
                console.error("Error fetching tagMacs:", error);
                return {};
            }
        },
        generatePopupText(popupText, tagMacs) {
            const apNumber = popupText.split(' ')[1].padStart(3, '0'); // ดึงเฉพาะหมายเลข AP และ pad ให้ครบ 3 หลัก
            let tagMacsForAP = [];

            for (const key in tagMacs) {
                if (key.endsWith(`-AP${apNumber}`)) { // ตรวจสอบเฉพาะส่วนที่เป็นหมายเลข AP
                    tagMacsForAP = tagMacs[key];
                    break;
                }
            }

            const tagMacsText = tagMacsForAP.length > 0 ? tagMacsForAP.map(tagMac => `TagMac: ${tagMac}`).join('<br>') : 'No tagMac found';
            console.log("popupText:", popupText); // Log popupText
            console.log("tagMacsForAP:", tagMacsForAP); // Log tagMacsForAP
            return `${popupText}<br>${tagMacsText}`;
        },
        changeMap(mapIndex) {
            this.map.remove();
            this.initMap();
        }
    }
};
</script>