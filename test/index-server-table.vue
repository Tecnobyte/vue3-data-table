<template>
    <h1>Server table</h1>
    <server-table :columns="columns" :url="url" @loaded="loaded">
        
    </server-table>
</template>

<script>
import { ServerTable } from './../src/main';
import { ref } from 'vue'

export default {
    components: {
        ServerTable
    },
    setup() {
        let data = ref([]);
        let url = 'http://test-server-table.test/api/get-personas';
        let columns = [
            {
                description: 'id',
                filter: false,
                header:'ID',
                order: false,
            },
            {
                description: 'name',
                filter: true,
                header:'Nombre',
                order: false,
            },
            {
                description: 'last_name',
                filter: true,
                order: false
            },
            {
                description: 'number',
                filter: true,
                order: false
            },
        ];

        return {
            columns,
            url
        };

    }
};
</script>

<style scoped>

</style>
