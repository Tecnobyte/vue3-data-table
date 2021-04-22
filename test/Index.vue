<template>
    <index-client-table v-if="false" />
    <index-server-table v-if="true" />
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
