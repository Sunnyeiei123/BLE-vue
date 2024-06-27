<template>
    <div class="list-asset" style="margin-top: 3rem">
        <h1 class="text-center" >Asset Location</h1>
        <v-container>
            <v-card class="table-card">
                <v-data-table 
                    :headers="headers" 
                    :items="items" 
                    item-key="ID" 
                    items-per-page="10"
                    class="elevation-2"
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
        this.startAutoReload();
    },
    methods: {
        async fetchData() {
            try {
                const response = await axios.get('http://10.1.55.230:7777/current/gets');
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
        startAutoReload() {
            setInterval(this.fetchData, 30000); // Reload data every 1 minute
        },
    },
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
    color: #263238; /* Blue Grey 900 */
    font-weight: bold;
}

.table-card {
    background-color: #ffffff; /* White */
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(96, 125, 139, 0.3); /* Blue Grey 400 with opacity */
}

.v-data-table {
    background-color: transparent !important;
}

.v-data-table >>> .v-data-table-header {
    background-color: #455a64 !important /* Blue Grey 700 */
}

.v-data-table >>> .v-data-table-header th {
    color: #ffffff !important; /* Changed to white for better contrast */
    font-weight: bold;
    text-transform: uppercase;
}


.v-data-table >>> tbody tr:nth-of-type(odd) {
    background-color: #ffffff; /* White */
}

.v-data-table >>> tbody tr:hover {
    background-color: #DBD8E3; /* Blue Grey 100 */
}

.v-data-table >>> tbody td {
    color: #263238; /* Blue Grey 900 */
}

.custom-title .v-data-table-header {
    padding-left: 20px;
}

.white-text {
  color: white;
}
</style>   