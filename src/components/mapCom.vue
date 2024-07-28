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

            this.markerLayers = markers.map((marker) => {
                const apNumber = marker.popupText.split(' ')[1].padStart(3, '0');
                const hasTagMac = Object.keys(tagMacs).some(key => key.endsWith(`-AP${apNumber}`));

                if (hasTagMac) {
                    const popupText = this.generatePopupText(marker.popupText, tagMacs);

                    let iconKey = 'Other';
                    for (const key in tagMacs) {
                        if (key.endsWith(`-AP${apNumber}`)) {
                            iconKey = tagMacs[key][2] || 'Other'; // Assuming assetType is the third item in the array
                            break;
                        }
                    }
                    const icon = this.getIcon(iconKey);

                    const markerLayer = L.marker(marker.position, { icon }).bindPopup(popupText);
                    markerLayer.addTo(this.map);
                    return {
                        layer: markerLayer,
                        visible: true
                    };
                }
            }).filter(layer => layer !== undefined);
        },
        async fetchTagMacs() {
            try {
                const response = await api.get('/current/gets/use');
                return response.data.data.reduce((acc, item) => {
                    const locationKey = `${item.location}`;
                    if (!acc[locationKey]) {
                        acc[locationKey] = [];
                    }
                    acc[locationKey].push(item.tagMac, item.assetName, item.assetType);
                    return acc;
                }, {});
            } catch (error) {
                console.error("Error fetching tagMacs:", error);
                return {};
            }
        },
        generatePopupText(popupText, tagMacs) {
            const apNumber = popupText.split(' ')[1].padStart(3, '0');
            let tagMacsForAP = [];
            for (const key in tagMacs) {
                if (key.endsWith(`-AP${apNumber}`)) {
                    tagMacsForAP = tagMacs[key];
                    break;
                }
            }

            const assetInfoText = tagMacsForAP.length > 0
                ? `Asset Name: ${tagMacsForAP[1] || 'Unknown'}<br>
                   Asset Type: ${tagMacsForAP[2] || 'Unknown'}<br>
                   Tag MAC: ${tagMacsForAP[0] || 'Unknown'}`
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