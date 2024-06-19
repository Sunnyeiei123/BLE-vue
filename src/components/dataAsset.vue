<template>
    <v-container>
        <v-row>
            <v-col cols="8" style="margin-top: 2rem; margin-left: 14rem;">
                <v-data-table :headers="headers" :items="items" item-key="name" items-per-page="5"></v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
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
                        { title: 'Room', value: 'Room' },
                        { title: 'Build', value: 'Build' },
                        { title: 'Status', value: 'Status' },
                    ],
                },
            ],
            items: [
                {
                    name: 'เตียงนอน',
                    location: 'Egypt',
                    Room: '1',
                    Build: 'A',
                    Status: 'Active',
                },
                {
                    name: 'ตู่เย็น',
                    location: 'Egypt',
                    Room: '2',
                    Build: 'A',
                    Status: 'Active',
                },
                {
                    name: 'ไม้เท้า',
                    location: 'Egypt',
                    Room: '104',
                    Build: 'A',
                    Status: 'Active',

                },
                {
                    name: 'เข็มฉีดตูด',
                    location: 'Egypt',
                    Room: '101',
                    Build: 'A',
                    Status: 'Active',
                },
                {
                    name: 'ยาบ้า',
                    location: 'Mexico',
                    Room: '65',
                    Build: 'A',
                    Status: 'Active',
                },
            ],
        };
    },
};
</script>

<style scoped>
.custom-title .v-data-table-header {
    padding-left: 20px;
    /* Adjust the padding to move the title to the left */
}
</style>