<template>
    <div :style="{ overflowX:'auto'}">
        <div>
            <select v-model="perPage" @change="onChangedPerPage">
                <option v-for="(page,index) in perPages" :key="index" :value="page">
                    {{ page }}
                </option>
            </select>
        </div>
        
        <table :class="tema.table" :style="{ marginTop:'.75rem'}">
            <thead>
                <tr >
                    <th v-for="(column,index) in columns" :key="index" @click="column.filterable ? filter(column) : null" >
                        <slot :name="`header-${column.description}`">
                            {{ column.header || column.description }}
                        </slot>
                        <!-- <slot :name="`header-filter-${column.description}`" :handler="searchWithFilter">
                            <input :class="classes.input" type="text" v-if="column.filter" :placeholder="column.description" @input="(evt) => searchWithFilter(evt,column.description)">
                        </slot> -->
                        <template v-if="column.filterable">
                            <span v-if="column.direction === 'asc'">&darr;</span>
                            <span v-else>&uarr;</span>
                        </template>
                    </th>
                </tr>
                 <tr>
                    <th v-for="(column,index) in columns" :key="index">
                        <slot :name="`header-filter-${column.description}`">
                            <input :class="tema.input" type="text" v-if="column.filter" :placeholder=" column.header || column.description" @input="(evt) => searchWithFilter(evt,column.description)">
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
                            <tr class="" v-for="(record,rowIndex) in records" :key="rowIndex">
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
                            <div :style="{display:'flex',justifyContent:'center'}">
                                <div class="on-load">
                                    <div class="spinner"></div>
                                </div>
                            </div>
                            
                        </slot>
                    </td>
                </tr>
                
            </tbody>
        </table>

        <div v-if="!loading" class="texts">{{ showText }}</div>

        <pagination :theme="theme.pagination" :paginates="paginate" :pagination="pagination" @inputPage="inputPage" />
    </div>
</template>

<script>
import Pagination from '../Pagination.vue';
import {Themes} from '../../themes/themes.js';
import { ref,watch,toRefs,onMounted, computed } from 'vue';
export default {
    components:{
        Pagination
    },
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
        theme:{
            type:String,
            default:'default'
        },
        customThem:{
            type:Object|null,
            default:null
        },

        texts:{
            type:String,
            default:`Showing {from} to {to} from {count}`
        },
        responseAdapter:{
            type:Function,
            default:function(response) {
                const { count,data } = response;
                return {
                    count:count,
                    data:data
                };            
            }
        },
        request:{
            type:Function,
            default:async function(api){
                const response = await fetch(api,{
                    method:'GET',
                    headers: {
                        'Content-Type': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });
                return response.json();
            }
        },
    },
    setup(props,{ emit,slots }){
        
        const {columns, url,options,request,theme,customThem,responseAdapter,texts } = toRefs(props);
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
        const tema = customThem.value ? customThem.value : Themes[theme.value];
        const direction = ref('asc');
        const column = ref(null);
        let inicio = ref(0);
        let fin = ref(null);
        perPages.value =  options ? options.perPages || [5,10,20,30,40,50] : [5,10,20,30,40,50];

        for(let col of columns.value ){
            if(col.filterable){ 
                column.value = col.description;
                break;
            }
        }

        const onRequest = async () => {
            let symbol = /.\?/gi.test(url.value) ? '&' : '?';
            let api = `${url.value}${symbol}query=${JSON.stringify(query.value)}&page=${page.value}&limit=${perPage.value}&direction=${direction.value}${ column.value ? '&column='+column.value : ''}`;
            const response = await request.value(api); 
            return response;
        }

        const fetchData = async () => {
            loading.value = true;
            const response = await onRequest();
            const { count:total,data } = responseAdapter.value(response);
            count.value = total;
            pagination.value = parseInt(total / perPage.value);
            records.value = data;
            loading.value = false;
            query.value = {};
            calculate()
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

        const filter = (col) => {
            direction.value = col.direction === 'asc' ? 'desc' : 'asc';
            col.direction = direction.value;
            column.value = col.description;
            fetchData();
        }


        const format = (record,column) => {
            return column.format ? column.format(record) : record[column.description]; 
        }


        watch(url,(url,prevUrl) => {
            fetchData();
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
        });

        watch(page,(newVal) => {
            fetchData();
        })

        onMounted(() => {
            fetchData();  
        });

        const inputPage = (p) => {
            page.value = p;
        }

        const refresh = () => {
            page.value = 1;
            fetchData();
        }

        const refreshOnPage = () => {
            fetchData();
        }


        const calculate = () => {
            inicio.value = ((page.value-1) * perPage.value) + 1;
            fin.value = (perPage.value * ( page.value) )- (perPage.value - records.value.length);
        }


        const showText = computed(() => {
            return texts.value.replace(/{from}/g,inicio.value)
            .replace(/{to}/g,fin.value)
            .replace(/{count}/,count.value);
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
            page,
            pagination,
            inputPage,
            tema,
            refresh,
            refreshOnPage,
            direction,
            filter,
            showText
        };

    }

};
</script>

<style scoped>


.tecno-table{
    
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #e1e1e1;
    /* overflow: hidden; */
}


.tecno-table tr:nth-child(odd)  { background: #e6eff3; } 
.tecno-table tr:nth-child(even) { background: #ffffff; } 


.tecno-table td,th {
    padding: 16px;
    /* padding-top: 16px;
    padding-bottom: 16px;
    padding-left: 16px; */
    font-family: "Lato-Regular";

}

.tecno-table td,th{
    border-right: 1px solid #e1e1e1;
    border-left: 1px solid #e1e1e1;
}

.input{
    padding: 8px;
    display: block;
    border: none;
    border-bottom: 1px solid #ccc;
    width: 100%;
}

.texts{
    text-align: center;
    font-size: 18px;
}

.on-load {
    opacity: 0;
    animation: fade-in-up 1s forwards;
}
 @keyframes fade-in-up {
	 from {
		 opacity: 0;
		 transform: translateY(8px);
	}
	 to {
		 opacity: 1;
		 transform: translateY(0);
	}
}
 .spinner {
	 pointer-events: none;
	 width: 32px;
	 height: 32px;
	 border: 2px solid transparent;
	 border-color: #f2f2f2;
	 border-top-color: #7769e4;
	 border-radius: 50%;
	 animation: spin 1s, colour-wheel 3s;
	 animation-iteration-count: infinite;
	 animation-timing-function: ease-in-out;
}
 @keyframes spin {
	 0% {
		 transform: rotateZ(0);
	}
	 100% {
		 transform: rotateZ(360deg);
	}
} 

</style>