
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
        <div class="d-flex flex-column align-items-center">
            <div class="d-flex justify-space-around flex-wrap mt-5">
                <v-btn v-for="(image, index) in images" :key="index"
                    :class="{ 'selected-button': selectedImage === image }" @click="selectImage(image)" class="ma-2">
                    Floor {{ index + 1 }}
                </v-btn>
            </div>
            <div v-if="selectedImage" class="mt-3 d-flex justify-center">
                <v-img :src="require(`../assets/${selectedImage}`)" height="auto" width="100%" />
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            assetCount: 0,
            assetLostCount:0,
            assetInUseCount:0,
            selectedImage: null,
            images: [
                'Screenshot 2024-06-21 135052.png',
                'plan2.png',
                'plan3.png',
                'plan4.png',
                'plan5.png',
                'plan6.png',
                'plan7.png',
                'plan8.png',
                'plan9.png'
            ]
        };
    },
    mounted() {
        this.fetchAssetCount();
        this.fetchAssetsInUseCount();
        this.fetchAssetsLostCount();
        // Check if there is a previously selected image in localStorage
        const storedImage = localStorage.getItem('selectedImage');
        if (storedImage && this.images.includes(storedImage)) {
            this.selectedImage = storedImage;
        }
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
        selectImage(image) {
            this.selectedImage = image;
            // Store the selected image in localStorage
            localStorage.setItem('selectedImage', image);
        },
        // navigateToLocation(nextpage, selectedCard) {
        //     this.$router.push(nextpage); // เปลี่ยนเส้นทาง URL ไปยังหน้าใหม่
        //     this.selectedCard = selectedCard; // ตั้งค่า selectedCard เพื่อเปลี่ยนการเลือก Card ในหน้าที่ 2
        // }
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
</style>