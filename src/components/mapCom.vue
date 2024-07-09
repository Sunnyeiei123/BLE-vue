<!-- MapComponent.vue -->
<template>
    <div id="map" style="height: 1000px;"></div>
</template>

<script>
import L from 'leaflet';

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
        initMap() {
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
            this.addMarkers(mapData.markers);
        },
        addMarkers(markers) {
            markers.forEach(marker => {
                L.marker(marker.position, {
                        icon: this.customIcon
                    })
                    .addTo(this.map)
                    .bindPopup(marker.popupText);
            });
        },
        changeMap(mapIndex) {
            this.map.remove();
            this.initMap();
        }
    }
};
</script>
