<template>
    <div>
        <div class="d-flex justify-center">
            <v-card class="custom-card" style="width: 300px; margin-top: 10rem; ">
                <v-card-title class="headline grey lighten-2">
                    Asset Use
                </v-card-title>
                <v-card-text>
                    <div class="green-text" style="font-size: 2.5rem; font-weight: bold;">
                        {{ assetCount }} assets
                    </div>
                </v-card-text>
            </v-card>

            <v-card class="custom-card" style="width: 300px; margin-top: 10rem; margin-left: 2rem">
                <v-card-title class="headline grey lighten-2">
                    Asset Loss
                </v-card-title>
                <v-card-text>
                    <div class="red-text" style="font-size: 2.5rem; font-weight: bold;">
                        12
                    </div>
                </v-card-text>
            </v-card>

            <!-- <v-card class="custom-card" style="width: 400px; margin-top: 10rem; margin-left: 2rem">
                <v-card-title class="headline grey lighten-2">
                    Asset Error/Lost Signal
                </v-card-title>
                <v-card-text>
                    <div class="yellow-text" style="font-size: 2.5rem; font-weight: bold;">
                        1
                    </div>
                </v-card-text>
            </v-card> -->
        </div>
        <hr style="margin-top: 2.5rem; border: 1px solid;">
        <div class="d-flex flex-column align-items-center">
            <div class="d-flex justify-space-around mt-5">
                <v-btn
                    v-for="(image, index) in images"
                    :key="index"
                    :class="{'selected-button': selectedImage === image}"
                    @click="selectImage(image)"
                    class="ma-2"
                >
                    Floor {{ index + 1 }}
                </v-btn>
            </div>
            <div v-if="selectedImage" class="mt-3 d-flex justify-center">
                <v-img :src="require(`../assets/${selectedImage}`)" height="800" width="1000" />
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
        selectImage(image) {
            this.selectedImage = image;
            // Store the selected image in localStorage
            localStorage.setItem('selectedImage', image);
        }
    }
};
</script>

<style scoped>
.custom-card {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
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
    background-color: black;
    color: white;
}

.justify-center {
    justify-content: center;
}
</style>
