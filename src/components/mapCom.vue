<template>
    <div>
        <div id="map" style="height: 1000px;"></div>
    </div>
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
        }
    },
    data() {
        return {
            map: null,
            markerLayers: [],
        };
    },
    mounted() {
        this.initMap();
    },
    watch: {
        currentMapIndex() {
            this.changeMap();
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
            console.log(tagMacs);

            this.markerLayers = [];

            markers.forEach((marker) => {
                const apNumber = marker.popupText.split(' ')[1];
                const assetsAtMarker = tagMacs[`Wellness-FL03-AP0${apNumber}`] || [];

                if (assetsAtMarker.length > 0) {
                    assetsAtMarker.forEach((asset, index) => {
                        const popupText = this.generatePopupText(marker.popupText, asset);
                        const iconKey = asset[2] || 'Other';
                        const icon = this.getIcon(iconKey);

                        // Calculate offset position for all markers
                        let position = [...marker.position];
                        const offset = 25 * index; // Adjust this value to change the spacing
                        position[0] += offset;
                        position[1] += offset;

                        const markerLayer = L.marker(position, { icon }).bindPopup(popupText);
                        markerLayer.addTo(this.map);
                        this.markerLayers.push({
                            layer: markerLayer,
                            visible: true
                        });
                    });
                }
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
                    acc[locationKey].push([item.tagMac, item.assetName, item.assetType]);
                    return acc;
                }, {});
            } catch (error) {
                console.error("Error fetching tagMacs:", error);
                return {};
            }
        },
        generatePopupText(popupText, asset) {
            const assetInfoText = asset
                ? `Asset Name: ${asset[1] || 'Unknown'}<br>
           Asset Type: ${asset[2] || 'Unknown'}<br>
           Tag MAC: ${asset[0] || 'Unknown'}`
                : 'No assets found';

            return `${popupText}<br>${assetInfoText}`;
        },
        getIcon(iconKey) {
            const iconMapping = {
                'Medical Equipment': 'ME.png',
                'Computer Equipment': 'CE.png',
                'General Equipment': 'Alone.png',
                'Other': 'Other.png',
            };

            const iconFileName = iconMapping[iconKey] || 'Other.png';
            return L.icon({
                iconUrl: require(`@/assets/${iconFileName}`),
                iconSize: [24, 24],
                iconAnchor: [12, 12],
                popupAnchor: [0, -12]
            });
        },
        changeMap() {
            if (this.map) {
                this.map.remove();
            }
            this.initMap();
        },
    }
};
</script>