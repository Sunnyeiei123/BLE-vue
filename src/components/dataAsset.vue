<template>
    <div class="list-asset">
        <h1 class="text-center" style="margin-top: 3rem" >Asset List</h1>
        <v-container>
            <v-card class="table-card">
                <v-data-table :headers="headers" :items="items" item-key="name" items-per-page="5" class="elevation-2">
                    <template v-slot:[`item.Edit`]="{ item }">
                        <v-btn class="update-btn white-text mr-2" @click="openUpdateForm(item)">Update</v-btn>
                        <v-btn class="delete-btn white-text" @click="deleteItem(item)">Delete</v-btn>
                    </template>
                    <template v-slot:[`item.View`]="{ item }">
                        <v-btn class="view-btn white-text" @click="viewEach(item)">View</v-btn>
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
                    title: 'Infomation',
                    align: 'center',
                    class: 'custom-title',
                    children: [
                        { title: 'Assets', value: 'name' },
                        { title: 'Description', value: 'Description' },
                        { title: 'Battery', value: 'Battery' },
                        { title: 'View History', value: 'View' },
                        { title: 'Edit', value: 'Edit' },
                    ],
                },
            ],
            items: [],
            updateDialog: false,
            updatedItem: {
                ID: '',
                Mac: '',
                name: '',
                Description: '',
            },
        };
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            try {
                const response = await axios.get('http://10.1.55.230:7777/tags/gets');
                const data = response.data;

                this.items = data.data.map(item => ({
                    ID: item._id,
                    name: item.assetName,
                    Mac: item.tagMac,
                    Description: item.description,
                    Battery: item.battery,
                }));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        openUpdateForm(item) {
            this.updatedItem.ID = item.ID;
            this.updatedItem.Mac = item.Mac;
            this.updatedItem.name = item.name;
            this.updatedItem.Description = item.description;
            this.updateDialog = true;
        },
        closeUpdateForm() {
            this.updateDialog = false;
        },
        async updateItem() {
            try {
                const response = await axios.patch(`http://10.1.55.230:7777/tags/update/${this.updatedItem.ID}`, {
                    assetName: this.updatedItem.name, // Update the assetName field
                    description: this.updatedItem.Description // Update the description field
                });
                console.log(response);
                // Check if the response contains the updated item data
                if (response.data && response.data._id) {
                    alert('Item updated successfully!');
                    // Optionally, you can update the item in the table without making another API call
                    const updatedIndex = this.items.findIndex(item => item.ID === this.updatedItem.ID);
                    if (updatedIndex !== -1) {
                        // Update both assetName and description fields in the table
                        this.items[updatedIndex].name = response.data.assetName;
                        this.items[updatedIndex].Description = response.data.description === undefined ? '-' : response.data.description;

                    }
                    // Close the update form dialog
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
            // Logic for deleting the item
            console.log('Delete item:', item);

            // Show confirmation dialog
            const confirmed = window.confirm(`Are you sure you want to delete this Tag Mac address: ${item.Mac} ?`);

            // If user confirms, proceed with deletion
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
    background-color: #ffffff; /* White */
}

.v-data-table >>> .v-data-table-header th {
    color: #37474f !important; /* Blue Grey 800 */
    font-weight: bold;
    text-transform: uppercase;
}


.v-data-table >>> tbody tr:nth-of-type(even) {
    background-color: #ffffff; /* Blue Grey 200 */
}


.v-data-table >>> tbody tr:hover {
    background-color: #DBD8E3; /* Blue Grey 300 */
}

.v-data-table >>> tbody td {
    color: #263238; /* Blue Grey 900 */
}

.update-btn {
    background-color: #348734 !important; /* Blue Grey 600 */
}

.update-btn:hover {
    opacity: 0.5;
}

.delete-btn {
    background-color: #F03C3C !important; /* Red 800 */
}

.delete-btn:hover {
    opacity: 0.5;
}

.view-btn {
    background-color: #107ED9 !important; /* Blue 800 */
}

.view-btn:hover {
    opacity: 0.5;
}

.white-text {
    color: white !important;
}

.update-card {
    background-color: #eceff1; /* Blue Grey 50 */
}

.update-card-title {
    background-color: #3aac13; /* Blue Grey 700 */
    color: white;
}

.update-card-actions {
    background-color: #cfd8dc; /* Blue Grey 100 */
}

.save-btn {
    background-color: #2e7d32 !important; /* Green 800 */
}

.save-btn:hover {
    opacity: 0.5;
}

.cancel-btn {
    color: #37474f !important; /* Blue Grey 800 */
}
</style>

