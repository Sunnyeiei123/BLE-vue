<template>
    <div>
        <h2 class="text-center" style="margin-top: 5rem;">List of Assets</h2>
        <v-container>
            <div style="justify-content: center;">
                <v-row>
                    <v-col>
                        <v-data-table :headers="headers" :items="items" item-key="name" items-per-page="5">
                            <template v-slot:[`item.Edit`]="{ item }">
                                <v-btn class="color white-text" style="margin-right: 1rem;"
                                    @click="openUpdateForm(item)">Update</v-btn>
                                <v-btn color="red" class="white-text" @click="deleteItem(item)">Delete</v-btn>
                            </template>
                            <template v-slot:[`item.View`]="{ item }">
                                <v-btn class="color white-text" style="margin-right: 1rem;"
                                    @click="viewEach(item)">View</v-btn>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
            </div>


            <!-- Update Form Dialog -->
            <v-dialog v-model="updateDialog" max-width="600px">
                <!-- <template v-slot:activator="{ on }"></template> -->
                <v-card>
                    <v-card-title>
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
                    <v-card-actions>
                        <v-btn color="blue darken-1" @click="updateItem">Save</v-btn>
                        <v-btn @click="closeUpdateForm">Cancel</v-btn>
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
                { title: 'Assets', value: 'name' },
                {
                    title: 'Infomation',
                    align: 'center',
                    class: 'custom-title',
                    children: [
                        { title: 'Mac', value: 'Mac' },
                        { title: 'Description', value: 'Description' },
                        { title: 'Battery', value: 'Battery' },
                        { title: 'View', value: 'View' },
                        { title: 'Update & Delete', value: 'Edit' },
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
                // Check if the response contains the updated item data
                if (response.data && response.data._id) {
                    alert('Item updated successfully!');
                    // Optionally, you can update the item in the table without making another API call
                    const updatedIndex = this.items.findIndex(item => item.ID === this.updatedItem.ID);
                    if (updatedIndex !== -1) {
                        // Update both assetName and description fields in the table
                        this.items[updatedIndex].name = response.data.assetName;
                        this.items[updatedIndex].Description = response.data.description;
                    }
                    // Close the update form dialog
                    this.updateDialog = false;
                } else {
                    alert('Failed to update item. Please try again later.');
                }
            } catch (error) {
                console.error('Error updating item:', error);
                alert('An error occurred while updating the item. Please try again later.');
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
.custom-title .v-data-table-header {
    padding-left: 20px;
    /* Adjust the padding to move the title to the left */
}

.color {
    background-color: rgb(32, 42, 62);
}

.white-text {
    color: white;
}
</style>
