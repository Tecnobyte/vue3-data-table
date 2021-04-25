<template>
    <div>
        <div>
            <select v-model="perPage" @change="onChangedPerPage">
                <option v-for="(page,index) in perPages" :key="index" :value="page">
                    {{ page }}
                </option>
            </select>
        </div>
        <table>
            <thead>
                <tr >
                    <th v-for="(column,index) in columns" :key="index">
                        <slot :name="`header-${column.description}`">
                            {{ column.header || column.description }}
                        </slot>
                        
                    </th>
                </tr>
                 <tr>
                    <th v-for="(column,index) in columns" :key="index">
                        <slot :name="`header-filter-${column.description}`">
                            <input type="text" v-if="column.filter" :placeholder="column.description" @input="(evt) => searchWithFilter(evt,column.description)">
                        </slot>
                    </th>
                </tr>
            </thead>
            <tbody>
                <template v-if="!loading">
                    <template v-if="records.length > 0">
                        <template v-if="slots.body">
                            <template  v-for="(record,rowIndex) in records" :key="rowIndex">
                                <slot name="body" :record="record"></slot>
                            </template>
                        </template>
                        <template v-else>
                            <tr v-for="(record,rowIndex) in records" :key="rowIndex">
                                <slot v-if="slots['body-cell']" name="body-cell" :row="record" :index="rowIndex" />
                                <slot v-else>
                                    <td v-for="(column,columnIndex) in columns" :key="columnIndex">
                                        <slot :name="`cell-${column.description}`" :row="record" :index="rowIndex">
                                            {{ format(record,column) }}
                                        </slot>
                                    </td>
                                </slot>
                            </tr>
                        </template>
                    </template>
                    <template v-else>
                        <tr>
                            <td :colspan="columns.length">
                                Sin resultados...
                            </td>
                        </tr>
                    </template>
                </template>
                <template v-else>
                    <tr>
                        <td :colspan="columns.length">
                            Cargando...
                        </td>
                    </tr>
                </template>
               
              
                
            </tbody>
        </table>
        <div class="pagination">
            <a href="#">&laquo;</a>
            <a href="#">&lt;</a>
            <a href="#">1</a>
            <a href="#">2</a>
            <a href="#">3</a>
            <a href="#">4</a>
            <a href="#">5</a>
            <a href="#">6</a>
            <a href="#">&gt;</a>
            <a href="#">&raquo;</a>
        </div>
        <div></div>
    </div>
</template>

<script>
import { ref,watch,toRefs,onMounted } from 'vue';
export default {
    props:{
        url:{
            type: String,
            required: true
        },
        columns: {
            type: Array,
            required: true
        },
        options: {
            type: Object,
            required: true
        },

    },
    setup(props,{ emit,slots }){
        
        const { url,options,request } = toRefs(props);
        const records = ref([]);
        const count = ref(0); 
        const page = ref(0);
        const perPage = ref(5);
        const query = ref({});
        const pagination = ref(1);
        const perPages = ref([]);
        const loading = ref(false);
        const timeOut = ref(null);

        perPages.value =  options ? options.perPages || [5,10,20,30,40,50] : [5,10,20,30,40,50];

        const onRequest = request ? request : async () => {
            let api = `${url.value}?query=${JSON.stringify(query.value)}&page=${page.value}&limit=${perPage.value}`;
            const response = await fetch(api,{
                method:'GET',
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            return await response.json();
        }

        const fetchData = async () => {
            loading.value = true;
            const { count:total,data } = await onRequest();
            count.value = total;
            pagination.value = parseInt(total / perPage.value);
            records.value = data;
            loading.value = false;
            query.value = {};
            emit('loaded',{data:records.value,count:count.value});
        };

        const onChangedPerPage = () => {
            page.value = 1;
            fetchData();
        }

        const searchWithFilter = ({target},filter) => {
            let { value } = target;
            query.value[filter] = value;
            if(timeOut) clearTimeout(timeOut.value);
            timeOut.value = setTimeout(() => {
                fetchData();
            }, 500);
        }


        const format = (record,column) => {
            return column.format ? column.format(record) : record[column.description]; 
        }


        watch(url,(url,prevUrl) => {
            // fetchData();
        });

        onMounted(() => {
            fetchData();  
        });
       

        return {
            fetchData,
            records,
            loading,
            perPages,
            perPage,
            format,
            onChangedPerPage,
            searchWithFilter,
            slots,
        };

    }

};
</script>

<style scoped>

</style>