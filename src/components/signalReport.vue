<template>
    <div>
        <h2 class="text-center" style="margin-top: 5rem;">List of Assets</h2>
        <v-container>
            <div style="justify-content: center;">
                <v-row>
                    <v-col>
                        <v-data-table :headers="headers" :items="items" item-key="ID" items-per-page="5">
                        </v-data-table>
                    </v-col>
                </v-row>
            </div>
        </v-container>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'list-asset',
    data() {
        return {
            headers: [
                { title: 'Assets', value: 'name' },
                {
                    title: 'Information',
                    align: 'center',
                    class: 'custom-title',
                    children: [
                        { title: 'Mac', value: 'Mac' },
                        { title: 'Time', value: 'timeStamp' },
                        { title: 'Location', value: 'location' },
                    ],
                },
            ],
            items: [],
        };
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            try {
                const response = await axios.get('http://10.1.55.230:7777/history/gets/' + this.$route.query.tagMac);
                const data = response.data;

                this.items = data.map(item => ({
                    ID: item._id,
                    name: item.assetName,
                    Mac: item.tagMac,
                    timeStamp: item.timeStamp,
                    location: item.location,
                }));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
    }
};
</script>

<style scoped>
.custom-title .v-data-table-header {
    padding-left: 20px;
    /* Adjust the padding to move the title to the left */
}

.v-data-table-header {
    background-color: black;
}

.color {
    background-color: rgb(32, 42, 62);
}

.white-text {
    color: white;
}
</style>
