<template>
    <div class="copy-of-list-asset">
        <v-container v-if="showTable" style="margin-top: 7rem;">
            <v-card class="table-card">
                <v-data-table :headers="currentHeaders" :items="currentItems" item-key="ID" items-per-page="10"
                    class="elevation-2">
                    <!-- Default Header Template -->
                    <template v-slot:header="{ props: { headers } }">
                        <thead>
                            <tr>
                                <th v-for="header in headers" :key="header.value" class="text-center">
                                    {{ header.title }}
                                </th>
                            </tr>
                        </thead>
                    </template>
                </v-data-table>
            </v-card>
        </v-container>
    </div>
</template>
<!-- heeky -->

<script>
import axios from 'axios';

export default {
    name: 'CopyOfListAsset',
    data() {
        return {
            headers: [
                { title: 'Mac', value: 'Mac' },
                {
                    title: 'Information',
                    align: 'center',
                    class: 'custom-title',
                    children: [
                        { title: 'Assets', value: 'name' },
                        { title: 'Description', value: 'Description' },
                        { title: 'Location', value: 'Location' },
                    ],
                },
            ],
            currentItems: [],
            currentHeaders: [],
            showTable: false,
        };
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            try {
                const assetsInUseResponse = await axios.get('http://10.1.55.230:7777/ap/gets'); // Fetch from new endpoint

                this.currentItems = assetsInUseResponse.data.map(item => ({
                    ID: item._id,
                    name: item.apName,
                    Mac: item.tagMac,
                    Description: item.description || '-', // Handle undefined description
                    Location: item.location || '-', // Handle undefined location
                }));

                this.currentHeaders = this.headers;
                this.showTable = true;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
    },
};
</script>

<style scoped>
/* Add any necessary scoped styles here */
</style>
