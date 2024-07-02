<template>
    <div class="list-asset">
        <h1 class="text-center" style="margin-top: 3rem">Total Asset</h1>
        <v-container>
            <v-card class="table-card">
                <v-data-table :headers="headers" :items="items" item-key="name" items-per-page="10" class="elevation-2">
                    <template v-slot:[`item.Edit`]="{ item }">
                        <v-btn class="update-btn white-text mr-2" @click="openUpdateForm(item)">Update</v-btn>
                        <v-btn class="delete-btn white-text" @click="deleteItem(item)">Delete</v-btn>
                    </template>
                    <template v-slot:[`item.View`]="{ item }">
                        <v-btn class="view-btn white-text" @click="viewEach(item)">View</v-btn>
                    </template>
                </v-data-table>
            </v-card>

            <!-- Add Button -->
            <v-btn class="add-btn white-text" @click="openAddForm">Add</v-btn>

            <!-- Update/Add Form Dialog -->
            <v-dialog v-model="updateDialog" max-width="600px">
                <v-card :class="[isEdit ? 'update-card' : 'add-card']">
                    <v-card-title :class="[isEdit ? 'update-card-title' : 'add-card-title']">
                        {{ isEdit ? 'Update' : 'Add' }} Tag
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field v-model="updatedItem.Mac" label="Mac Address"></v-text-field>
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
                    <v-card-actions :class="[isEdit ? 'update-card-actions' : 'add-card-actions']">
                        <v-btn :class="[isEdit ? 'save-btn white-text' : 'add-card-title']" @click="saveItem">{{ isEdit ? 'Save' : 'Add' }}</v-btn>
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
                        { title: 'Description', value: 'Description' },
                        { title: 'Battery', value: 'Battery' },
                        { title: 'View History', value: 'View' },
                        { title: 'Edit', value: 'Edit' },
                    ],
                },
            ],
            items: [],
            updateDialog: false,
            isEdit: false,
            updatedItem: {
                ID: '',
                Mac: '',
                name: '',
                Description: '', // New field for Add Item
            }
        };
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        // Fetch data from API
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
        // Open update form
        openUpdateForm(item) {
            this.isEdit = true;
            this.updatedItem.ID = item.ID;
            this.updatedItem.Mac = item.Mac;
            this.updatedItem.name = item.name;
            this.updatedItem.Description = item.Description;
            this.updateDialog = true;
        },
        // Open add form
        openAddForm() {
            this.isEdit = false;
            this.updatedItem = { ID: '', Mac: '', name: '', Description: '', addItem: '' }; // Reset fields
            this.updateDialog = true;
        },
        // Close form dialog
        closeUpdateForm() {
            this.updateDialog = false;
        },
        // Save item (add or update)
        async saveItem() {
            if (this.isEdit) {
                await this.updateItem();
            } else {
                await this.addItem();
            }
        },
        // Update item
        async updateItem() {
            try {
                const response = await axios.patch(`http://10.1.55.230:7777/tags/update/${this.updatedItem.ID}`, {
                    assetName: this.updatedItem.name, // Update the assetName field
                    description: this.updatedItem.Description // Update the description field
                });
                console.log(response);
                if (response.data && response.data._id) {
                    alert('Item updated successfully!');
                    const updatedIndex = this.items.findIndex(item => item.ID === this.updatedItem.ID);
                    if (updatedIndex !== -1) {
                        this.items[updatedIndex].name = response.data.assetName;
                        this.items[updatedIndex].Description = response.data.description === undefined ? '-' : response.data.description;
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
        // Add new item
        async addItem() {
            console.log(this.updatedItem.Mac.replace(/\s/g, "").length)
            const mac = this.updatedItem.Mac.replace(/\s/g, "");
            if(mac.length != 12){
                alert("Please input Mac address 12 latter only");
            }else{
                try {
                    var data = {
                    tagMac: mac,
                    assetName: this.updateItem.name == "" ? this.updateItem.name : "unknown",
                    description: this.updateItem.Description == "" ? this.updateItem.name : "-"
                }
                const response = await axios.post('http://10.1.55.230:7777/tags/add', data);
                console.log(response);
                if (response.data && response.data._id) {
                    alert('Item added successfully!');
                    this.items.push({
                        ID: response.data._id,
                        Mac: response.data.tagMac,
                        name: response.data.assetName,
                        Description: response.data.description,
                        Battery: '-',
                    });
                    this.updateDialog = false;
                } else {
                    alert('Failed to add item. Please try again later.');
                }
            } catch (error) {
                console.error('Error adding item:', error);
                alert('Failed to add item. Please try again later.');
            }
            }
        },
        // Delete item
        async deleteItem(item) {
            console.log('Delete item:', item);
            const confirmed = window.confirm(`Are you sure you want to delete this Tag Mac address: ${item.Mac} ?`);
            if (confirmed) {
                try {
                    const response = await axios.delete(`http://10.1.55.230:7777/tags/delete/${item.ID}`, {
                        data: {
                            tagMac: item.Mac
                        }
                    });
                    alert(response.data.detail);
                    this.fetchData();
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            } else {
                console.log('Deletion canceled by user.');
            }
        },
        // View item details
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
    background-color: #37474f
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
/* Add button styles */
.add-btn {
    background-color: #212A3E !important; /* Green */
    color: white !important;
    margin-top: 1rem;
}

.add-btn:hover {
    opacity: 0.5;
}
.add-btn {
    background-color: rgb(32, 42, 62) !important; /* Green 800 */
}
.add-card-title {
    background-color: rgb(32, 42, 62); /* Blue Grey 700 */
    color: white;
}
</style>

