<template>
    <index-client-table v-if="client" />
    <index-server-table v-else >
    </index-server-table>
</template>
<script>

import IndexClientTable from './index-client-table.vue';
import IndexServerTable from './index-server-table.vue';
import { config } from './config.js';

export default {
    components:{
        IndexClientTable,
        IndexServerTable
    },
    setup() {
        let client = config.client;
        return {
            client
        }
        
    },
}
</script>
