<template>
    <v-container>
        <v-row>
            <v-col cols="8" style="margin-top: 2rem; margin-left: 14rem;">
                <v-data-table :headers="headers" :items="items" item-key="name" items-per-page="5">
                    <template v-slot:[`item.Edit`]="{ item }">
                        <v-btn class="color white-text" style="margin-right: 1rem;"
                            @click="updateItem(item)">Update</v-btn>
                        <v-btn color="red" class="white-text" @click="deleteItem(item)">Delete</v-btn>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios';

export default {
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
                        { title: 'Update & Delete', value: 'Edit' },
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
                const response = await axios.get('http://10.1.55.230:7777/tags/gets');
                const data = response.data;

                this.items = data.data.map(item => ({
                    ID: item._id,
                    name: item.assetName,
                    Mac: item.tagMac,
                    Description: item.Description,
                    Edit: null  // This will be replaced by the slot content
                }));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        async updateItem(item) {
            // Logic for updating the item
            console.log('Update item:', item);
            try {
                const data = { "assetName": "test update" };
                const response = await axios.patch(`http://10.1.55.230:7777/tags/update/${item.ID}`, data);
                alert(response.data)
                this.fetchData();
            } catch (error) {
                console.error('Error fetching data:', error);
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
