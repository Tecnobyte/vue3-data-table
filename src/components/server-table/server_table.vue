<template>
    <div>
        
        <div>
            <select v-model="perPage" @change="onChangedPerPage">
                <option v-for="(page,index) in perPages" :key="index" :value="page">
                    {{ page }}
                </option>
            </select>
        </div>
        <table :class="classes.table" :style="{ marginTop:'.75rem'}">
            <thead>
                <tr >
                    <th v-for="(column,index) in columns" :key="index">
                        <slot :name="`header-${column.description}`">
                            {{ column.header || column.description }}
                        </slot>
                        <slot :name="`header-filter-${column.description}`" :handler="searchWithFilter">
                            <input :class="classes.input" type="text" v-if="column.filter" :placeholder="column.description" @input="(evt) => searchWithFilter(evt,column.description)">
                        </slot>
                        
                    </th>
                </tr>
                 <!-- <tr>
                    <th v-for="(column,index) in columns" :key="index">
                        <slot :name="`header-filter-${column.description}`">
                            <input :class="classes.input" type="text" v-if="column.filter" :placeholder="column.description" @input="(evt) => searchWithFilter(evt,column.description)">
                        </slot>
                    </th>
                </tr> -->
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
                   
                </template>
                <template v-if="records.length <= 0 && !loading">
                    <tr>
                        <td :colspan="columns.length">
                            <slot name="no-data">
                                Sin resultados
                            </slot>
                            
                        </td>
                    </tr>
                </template>
                

                <tr v-if="loading">
                    <td :colspan="columns.length">
                        <slot name="loading">
                            Cargando...
                        </slot>
                    </td>
                </tr>
                
            </tbody>
        </table>
        <div v-if="pagination > 0" class="pagination">
            <a @click="firstPage">&laquo;</a>
            <a @click="prevPage">&lt;</a>
            <template v-for="(pagina,index) in paginate">
                <template v-if="index == indexPaginate">
                    <a v-for="(item,pageIndex) in pagina" :key="pageIndex" @click="changePage(item,pagina)" :class="{'active' : page == item }">
                        {{ item }}
                    </a>
                </template>
            </template>
            <a @click="nextPage">&gt;</a>
            <a @click="lastPage">&raquo;</a>
        </div>
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
        classes:{
            type:Object,
            default:() => {
                return {

                    table : {
                        'fl-table' : true,
                    },
                    input:{
                        'input' : true
                    }
                }
            },
            required:true,
        }
    },
    setup(props,{ emit,slots }){
        
        const { url,options,request } = toRefs(props);
        const records = ref([]);
        const count = ref(0); 
        const page = ref(1);
        const perPage = ref(5);
        const query = ref({});
        const pagination = ref(1);
        const paginate = ref([]);
        const indexPaginate = ref(0);
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

        const nextPage = () => {
            if(page.value < pagination.value){
                page.value++;
                indexPaginate.value = paginate.value.findIndex( pag => pag.includes(page.value) );
                fetchData();
            }
        }

        const prevPage = () => {
            if(page.value > 1){
                page.value--;
                indexPaginate.value = paginate.value.findIndex( pag => pag.includes(page.value) );
                fetchData();
            }
        }

        const lastPage = () => {
            page.value = pagination.value;
            indexPaginate.value = paginate.value.findIndex( pag => pag.includes(page.value) );
            fetchData();
        }

        const firstPage = () => {
            page.value = 1;
            indexPaginate.value = paginate.value.findIndex( pag => pag.includes(page.value) );
            fetchData();
        }

        const changePage = (p) => {
            page.value = p;
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

        watch(pagination,(newVal)=>{

            let tempArrayPaginates = [];
            for(let i=1; i <= newVal;i++){
               tempArrayPaginates.push(i);
            }

            let chunk = 10;
            let paginates = [];
            for(let index = 0;index < tempArrayPaginates.length;index+=chunk){
                let tempArray = tempArrayPaginates.slice(index,index+chunk);
                paginates.push(tempArray);
            }
            paginate.value = paginates;

        })

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
            paginate,
            indexPaginate,
            changePage,
            nextPage,
            prevPage,
            page,
            firstPage,
            lastPage,
            pagination
            
        };

    }

};
</script>

<style scoped>



.fl-table {
    border-radius: 5px;
    font-size: 12px;
    font-weight: normal;
    border: none;
    border-collapse: collapse;
    width: 100%;
    max-width: 100%;
    white-space: nowrap;
    background-color: white;
}

.fl-table td, .fl-table th {
    text-align: center;
    padding: 8px;
}

.fl-table td {
    border-right: 1px solid #f8f8f8;
    font-size: 12px;
}

.fl-table thead th {
    color: #ffffff;
    background: #4FC3A1;
}


.fl-table thead th:nth-child(odd) {
    color: #ffffff;
    background: #324960;
}

.fl-table tr:nth-child(even) {
    background: #F8F8F8;
}

/* Responsive */

@media (max-width: 767px) {
    .fl-table {
        display: block;
        width: 100%;
    }
    .table-wrapper:before{
        content: "Scroll horizontally >";
        display: block;
        text-align: right;
        font-size: 11px;
        color: white;
        padding: 0 0 10px;
    }
    .fl-table thead, .fl-table tbody, .fl-table thead th {
        display: block;
    }
    .fl-table thead th:last-child{
        border-bottom: none;
    }
    .fl-table thead {
        float: left;
    }
    .fl-table tbody {
        width: auto;
        position: relative;
        overflow-x: auto;
    }
    .fl-table td, .fl-table th {
        padding: 20px .625em .625em .625em;
        height: 60px;
        vertical-align: middle;
        box-sizing: border-box;
        overflow-x: hidden;
        overflow-y: auto;
        width: 120px;
        font-size: 13px;
        text-overflow: ellipsis;
    }
    .fl-table thead th {
        text-align: left;
        border-bottom: 1px solid #f7f7f9;
    }
    .fl-table tbody tr {
        display: table-cell;
    }
    .fl-table tbody tr:nth-child(odd) {
        background: none;
    }
    .fl-table tr:nth-child(even) {
        background: transparent;
    }
    .fl-table tr td:nth-child(odd) {
        background: #F8F8F8;
        border-right: 1px solid #E6E4E4;
    }
    .fl-table tr td:nth-child(even) {
        border-right: 1px solid #E6E4E4;
    }
    .fl-table tbody td {
        display: block;
        text-align: center;
    }
}

.pagination a {
  color: black;
  float: left;
  padding: 8px 16px;
  text-decoration: none;
  border: 1px solid #ddd;
}

.pagination a.active {
  background-color: #4CAF50;
  color: white;
  border: 1px solid #4CAF50;
}

.pagination a:hover:not(.active) {background-color: #ddd;}

.pagination a:first-child {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}

.pagination a:last-child {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

.input{
    padding: 8px;
    display: block;
    border: none;
    border-bottom: 1px solid #ccc;
    width: 100%;
}

</style>