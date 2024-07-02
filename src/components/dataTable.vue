<template>
    <div class="list-asset" style="margin-top: 3rem">
        <!-- Button Cards -->
        <v-container>
            <v-row>
                <v-col cols="4">
                    <v-card @click="showTotalAssets"
                        :class="['button-card', { 'selected-card': selectedCard === 'totalAssets' }]">
                        <v-card-title>Total Assets</v-card-title>
                    </v-card>
                </v-col>
                <v-col cols="4">
                    <v-card @click="showAssetsInUse"
                        :class="['button-card', { 'selected-card': selectedCard === 'assetsInUse' }]">
                        <v-card-title>Assets in Use</v-card-title>
                    </v-card>
                </v-col>
                <v-col cols="4">
                    <v-card @click="showLostAssets"
                        :class="['button-card', { 'selected-card': selectedCard === 'lostAssets' }]">
                        <v-card-title>Lost Assets</v-card-title>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <!-- Data Tables -->
        <v-container v-if="showTable">
            <v-card class="table-card">
                <v-data-table :headers="currentHeaders" :items="currentItems" :row-props="getRowProps" item-key="ID"
                    items-per-page="10" class="elevation-2">
                    <!-- Dynamic Slots for Update and View Buttons -->
                    <template v-slot:[`item.Edit`]="{ item }">
                        <v-btn class="update-btn white-text mr-2" @click="openUpdateForm(item)">Update</v-btn>
                        <v-btn class="delete-btn white-text" @click="deleteItem(item)">Delete</v-btn>
                    </template>
                    <template v-slot:[`item.View`]="{ item }">
                        <v-btn class="view-btn white-text" @click="viewEach(item)">View</v-btn>
                    </template>

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

            <!-- Update Form Dialog -->
            <v-dialog v-model="updateDialog" max-width="600px">
                <v-card class="update-card">
                    <v-card-title class="update-card-title">
                        Update Item
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field v-model="updatedItem.Mac" label="Mac"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field v-model="updatedItem.name" label="Asset Name"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field v-model="updatedItem.Description" label="Description"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions class="update-card-actions">
                        <v-btn class="save-btn white-text" @click="updateItem">Save</v-btn>
                        <v-btn class="cancel-btn" @click="closeUpdateForm">Cancel</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
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
            totalAssets: [],
            assetsInUse: [],
            assetsLost: [],
            lostAssets: [],
            currentItems: [],
            currentHeaders: [],
            showTable: false,
            updateDialog: false,
            updatedItem: {
                ID: '',
                Mac: '',
                name: '',
                Description: '',
            },
            selectedCard: '', // Default selection
        };
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            try {
                const totalAssetsResponse = await axios.get('http://10.1.55.230:7777/current/gets/all');
                const assetsInUseResponse = await axios.get('http://10.1.55.230:7777/current/gets/use');
                const assetsLostResponse = await axios.get('http://10.1.55.230:7777/current/gets/lost');
                // Assuming you will add logic to fetch lost assets as well

                this.totalAssets = totalAssetsResponse.data.data.map(item => ({
                    ID: item._id,
                    name: item.assetName,
                    Mac: item.tagMac,
                    timeStamp: item.timeStamp,
                    location: item.location
                }));

                this.assetsInUse = assetsInUseResponse.data.data.map(item => ({
                    ID: item._id,
                    name: item.assetName,
                    Mac: item.tagMac,
                    timeStamp: item.timeStamp,
                    location: item.location
                }));

                this.assetsLost = assetsLostResponse.data.data.map(item => ({
                    ID: item._id,
                    name: item.assetName,
                    Mac: item.tagMac,
                    timeStamp: item.timeStamp,
                    location: item.location
                }));
                // Set initial data to show total assets
                // this.currentItems = this.totalAssets;
                // this.currentHeaders = this.headers;

                this.chooseTable();
                this.showTable = true;

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        startAutoReload() {
            setInterval(this.fetchData, 30000); // Reload data every 30 seconds
        },
        showTotalAssets() {
            this.currentItems = this.totalAssets;
            this.currentHeaders = this.headers;
            this.selectedCard = 'totalAssets'; // Update selected card
        },
        showAssetsInUse() {
            this.currentItems = this.assetsInUse; // Show total assets data
            this.currentHeaders = this.headers; // Use the same headers as totalAssets
            this.selectedCard = 'assetsInUse'; // Update selected card
        },
        showLostAssets() {
            this.currentItems = this.assetsLost; // Show total assets data
            this.currentHeaders = this.headers; // Use the same headers as totalAssets
            this.selectedCard = 'lostAssets'; // Update selected card
        },
        chooseTable() {
            const number = localStorage.getItem('selectedCard');
            console.log(number)
            switch (number) {
                case '1':
                    this.showTotalAssets();
                    break;
                case '2':
                    this.showAssetsInUse();
                    break;
                case '3':
                    this.showLostAssets();
                    break;
                default:
                    console.log("do here ")
                    this.showTotalAssets();
            }
        },
        openUpdateForm(item) {
            this.updatedItem.ID = item.ID;
            this.updatedItem.Mac = item.Mac;
            this.updatedItem.name = item.name;
            this.updatedItem.Description = item.Description;
            this.updateDialog = true;
        },
        closeUpdateForm() {
            this.updateDialog = false;
        },
        async updateItem() {
            try {
                const response = await axios.patch(`http://10.1.55.230:7777/tags/update/${this.updatedItem.ID}`, {
                    assetName: this.updatedItem.name,
                    description: this.updatedItem.Description
                });
                console.log(response);
                if (response.data && response.data._id) {
                    alert('Item updated successfully!');
                    const updatedIndex = this.assetsInUse.findIndex(item => item.ID === this.updatedItem.ID);
                    if (updatedIndex !== -1) {
                        this.assetsInUse[updatedIndex].name = response.data.assetName;
                        this.assetsInUse[updatedIndex].Description = response.data.description === undefined ? '-' : response.data.description;
                    }
                    this.updateDialog = false;
                } else {
                    alert('Failed to update item. Please try again later.');
                }
            } catch (error) {
                console.error('Error updating item:', error);
                alert(error.response.data.detail.description);
            }
        },
        async deleteItem(item) {
            const confirmed = window.confirm(`Are you sure you want to delete this Tag Mac address: ${item.Mac} ?`);
            if (confirmed) {
                try {
                    const response = await axios.delete(`http://10.1.55.230:7777/tags/delete/${item.ID}`);
                    alert(response.data.detail);
                    this.fetchData();
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            } else {
                console.log('Deletion canceled by user.');
            }
        },
        async viewEach(item) {
            this.$router.push({ name: 'signal', query: { tagMac: item.Mac } });
        },
        getRowProps(item) {
            if (item.item.location !== 'No Signal') {
                return { class: 'row-in-use' };
            } else if (item.item.location === 'No Signal') {
                return { class: 'row-lost' };
            }
        }
    },
};
</script>


<style>
.row-in-use {
    color: #348734;
    font-weight: bold;
    /* font-size: 0.8rem; */
    background-color: #b0e5b0;
}

.row-lost {
    color: #F03C3C;
    font-weight: bold;
    /* font-size: 0.8rem; */
    background-color:#f3b1b1 ;
}

.list-asset {
    background-color: #f1f6f9;
    /* Blue Grey 50 */
    min-height: 100vh;
    padding: 2rem;
}

.text-center {
    margin-bottom: 2rem;
    color: #263238;
    /* Blue Grey 900 */
    font-weight: bold;
}

.table-card {
    background-color: #ffffff;
    /* White */
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(96, 125, 139, 0.3);
    /* Blue Grey 400 with opacity */
}

.v-data-table {
    background-color: transparent !important;
}

.v-data-table>>>.v-data-table-header {
    background-color: #455a64 !important;
    /* Blue Grey 700 */
}

.v-data-table>>>.v-data-table-header th {
    color: #ffffff !important;
    /* Changed to white for better contrast */
    font-weight: bold;
    text-transform: uppercase;
}

.v-data-table>>>tbody tr:nth-of-type(odd) {
    background-color: #ffffff;
    /* White */
}

.v-data-table>>>tbody tr:hover {
    background-color: #dbd8e3;
    /* Blue Grey 100 */
}

.v-data-table>>>tbody td {
    color: #263238;
    /* Blue Grey 900 */
}

.custom-title .v-data-table-header {
    padding-left: 20px;
}

.white-text {
    color: white;
}

.button-card {
    cursor: pointer;
    background-color: #ffffff;
    /* White */
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(96, 125, 139, 0.3);
    /* Blue Grey 400 with opacity */
    transition: all 0.3s ease;
}

.button-card:hover {
    box-shadow: 0 8px 20px rgba(96, 125, 139, 0.5);
    /* Blue Grey 400 with opacity */
}

.selected-card {
    background-color: rgb(32, 42, 62);
    /* Blue Grey 100 */
    color: white;
}

.update-btn {
    background-color: #348734 !important;
    /* Green 600 */
}

.update-btn:hover {
    opacity: 0.5;
}

.delete-btn {
    background-color: #f03c3c !important;
    /* Red 800 */
}

.delete-btn:hover {
    opacity: 0.5;
}

.view-btn {
    background-color: #107ed9 !important;
    /* Blue 800 */
}

.view-btn:hover {
    opacity: 0.5;
}

.update-card {
    background-color: #eceff1;
    /* Blue Grey 50 */
}

.update-card-title {
    background-color: #3aac13;
    /* Blue Grey 700 */
    color: white;
}

.update-card-actions {
    background-color: #cfd8dc;
    /* Blue Grey 100 */
}

.save-btn {
    background-color: #2e7d32 !important;
    /* Green 800 */
}

.save-btn:hover {
    opacity: 0.5;
}

.cancel-btn {
    color: #37474f !important;
    /* Blue Grey 800 */
}

.selected-card {
    background-color: rgb(32, 42, 62);
    /* Blue Grey 100 */
    color: white;
}
</style>