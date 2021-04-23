<template>
    <index-client-table v-if="true" />
    <index-server-table v-if="false" />
</template>
<script>

import IndexClientTable from './index-client-table.vue';
import IndexServerTable from './index-server-table.vue';
export default {
    components:{
        IndexClientTable,
        IndexServerTable
    },
    setup() {
        
    },
}
</script>
