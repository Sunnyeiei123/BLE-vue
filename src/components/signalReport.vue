<template>
    <div class="list-asset">
        <h1 class="text-center" style="margin-top: 3rem">History</h1>
        <v-btn icon @click="goBack" class="back-button">
            <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-container>
            <v-card class="table-card">
                <v-data-table
                    :headers="headers"
                    :items="items"
                    item-key="ID"
                    :items-per-page="5"
                    class="elevation-1"
                >
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

<script>
import axios from 'axios';

export default {
    name: 'list-asset',
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
        goBack() {
            this.$router.go(-1);
        }
    }
};
</script>

<style scoped>
.list-asset {
    background-color: #F1F6F9; /* Blue Grey 50 */
    min-height: 100vh;
    padding: 2rem;
}

.text-center {
    margin-bottom: 2rem;
    color: #37474f; /* Blue Grey 800 */
}

.back-button {
    margin-bottom: 1rem;
    color: #546e7a; /* Blue Grey 600 */
}

.table-card {
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Blue Grey 400 with opacity */
}

.v-data-table {
    background-color: transparent !important;
}

.v-data-table >>> .v-data-table-header {
    background-color: #455a64; /* Blue Grey 700 */
}

.v-data-table >>> .v-data-table-header th {
    color: white !important;
    font-weight: bold;
    text-transform: uppercase;
}

.v-data-table >>> tbody tr:nth-of-type(even) {
    background-color: #cfd8dc; /* Blue Grey 100 */
}

.v-data-table >>> tbody tr:hover {
    background-color: #DBD8E3; /* Blue Grey 200 */
}

.v-data-table >>> tbody td {
    color: #263238; /* Blue Grey 900 */
}
</style>
