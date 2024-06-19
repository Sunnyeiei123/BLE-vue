<template>
    <div>
        <div class="d-flex justify-space-around">
            <v-card class="custom-card" style="width: 400px; margin-top: 10rem; margin-left: 20rem">
                <v-card-title class="headline grey lighten-2">
                    Asset Use
                </v-card-title>
                <v-card-text>
                    <div class="" style="font-size: 2.5rem; font-weight: bold;">
                        120 asset
                    </div>
                </v-card-text>
            </v-card>

            <v-card class="custom-card" style="width: 400px; margin-top: 10rem; margin-left: 5rem">
                <v-card-title class="headline grey lighten-2">
                    Asset Un Use
                </v-card-title>
                <v-card-text>
                    <div class="" style="font-size: 2.5rem; font-weight: bold;">
                        12
                    </div>
                </v-card-text>
            </v-card>

            <v-card class="custom-card" style="width: 400px; margin-top: 10rem; margin-left: 5rem">
                <v-card-title class="headline grey lighten-2">
                    Asset Error/Lost Signal
                </v-card-title>
                <v-card-text>
                    <div class="" style="font-size: 2.5rem; font-weight: bold;">
                        1
                    </div>
                </v-card-text>
            </v-card>
        </div>
        <v-img :src="require('../components/img/logo_mfuwebtypo3_09052018-02.png')"
        height="500"
        width="800"
        style="margin-left: 34rem;" />
    </div>
    
</template>


<script>
export default {
    name: 'AssetCard',
}
</script>

<style scoped>
.custom-card {
  box-shadow: 0 4px 8px rgba(0,0,0,0.4);
}

</style>