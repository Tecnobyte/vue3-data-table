<template>
    <div>

        <div>
            <select v-model="perPage" @change="onChangedPerPage">
                <option v-for="(page, index) in perPages" :key="index" :value="page">
                    {{ page }}
                </option>
            </select>
        </div>

        <table class="table-main">
            <thead>
                <!-- seccion para las columnas -->
                <tr class="tr-columns-description">
                    <th v-for="(column, i) of columns" :key="i" class="th-columns-description">
                        {{ (column.hasOwnProperty('header') ) ? column.header : column.description}}
                        <li v-if="VerifyColumnsByOrder(column)" @click="debounce('order', column.description, $event)" class="li-order">o</li>
                    </th>
                </tr>

                <!-- seccion para los filtros -->
                <tr class="tr-columns-inputs">
                    <th v-for="(column, i) of columns" :key="i" class="th-columns-inputs">
                        <input v-if="VerifyColumnsByFilter(column)" type="text" class="input-filter" :placeholder="(column.hasOwnProperty('header') ) ? column.header : column.description" :name="column.description" v-on:keyup="debounce('key', column.description, $event)">
                    </th>
                </tr>
            </thead>

            <tbody>
                <template v-if="loader">
                    <tr v-for="(row, i) of dataFilter" :key="i" class="tr-row-data">
                        <td v-for="column of columns" :key="column" class="td-row-data">
                            <slot :name="column.description" :row="row" :index="i">
                                {{ format(row, column) }}
                            </slot>
                        </td>
                    </tr>
                </template>

                <template v-else>
                    <tr>
                        <td :colspan="columns.length">
                            <slot name="load">
                                {{options.text}}
                            </slot>
                        </td>
                    </tr>
                </template>


            </tbody>
        </table>

        <div class="center">
            <div class="pagination">
                <a href="#" @click="changePage('first')">&laquo;</a>
                <a href="#" @click="changePage('previo')">&lt;</a>
                <a v-for="i of totalPage" href="#" :key="i" @click="pageSelect(i)" :class="page == i ? 'active' : ''">{{i}}</a>
                <a href="#" @click="changePage('next')">&gt;</a>
                <a href="#" @click="changePage('last')">&raquo;</a>
            </div>
        </div>

    </div>
</template>

<script>
    import { ref, computed, onMounted, toRefs} from 'vue';
    export default {
        name: 'client-table',
        props:{
            data: {
                type: Array,
                required: true
            },
            columns: {
                type: Array,
                required: true
            },
            options: {
                type: Object,
                default: () =>{
                    return {
                        time: 1000,
                        perPages: [5,10,20,30,40,50],
                        text:{
                            loading: 'loading...'
                        }
                    }
                }
            },
        },
        setup(props, context){
            const { data, options, columns } = toRefs(props);
            const _debounce =  ref(null);
            const dataFilter = ref([]);
            const loader = ref(false);

            // var pages
            const perPages = ref([]); // array limits data por pages
            const perPage = ref(options.value.perPages[0]); // limit data for page
            const totalPage = ref(Math.ceil(data.value.length /perPage.value)); // total page
            const page = ref(1) // page actual

            const debounce = (type, column, event)=>{
                if (_debounce.value != null){
                    clearTimeout(_debounce.value);
                    _debounce.value == null;
                }
                loader.value = false;

                _debounce.value = setTimeout(()=>{
                    if (type == 'key'){
                        search_word(column ,event);
                    }else if (type == 'order'){
                        order_by(column ,event);
                    }
                    loader.value = true;
                }, options.value.time);
            };
            const VerifyColumnsByOrder = (column)=>{
                let order = false;
                if (column.hasOwnProperty('order')){
                    return column.order;
                }
                return order;
            };
            const VerifyColumnsByFilter = (column)=>{
                let filter = false;
                if (column.hasOwnProperty('filter')){
                    return column.filter;
                }
                return filter;
            }
            const format = (record,column) => {
                return column.hasOwnProperty('format') ? column.format(record) : record[column.description]; 
            }
            const search_word = (column, event) => {
                if (event.target.value != ''){ // si este ya tiene aplicado algun filtro que vuelva a filtrar en el mismo arreglo
                    let regex = new RegExp(event.target.value);
                    dataFilter.value = data.value.filter( filter => regex.exec(filter[column]) );
                    // falta agregar que cuando se escriba para un filtro, este se recalcule la cantidad de paginas y se realize un slice a la informacion

                    // totalPage.value = Math.ceil(dataFilter.value.length /perPage.value)
                    // dataFilter.value = dataFilter.value.slice( ( (page.value -1) * perPage.value) , ( (page.value -1) * perPage.value) + perPage.value );
                }else{
                    dataFilter.value = data.value;
                }
            };

            const onChangedPerPage = () =>{
                page.value = 1;
                debounce('load');
                totalPage.value = Math.ceil(data.value.length /perPage.value)
                dataFilter.value = data.value.slice( ( (page.value -1) * perPage.value) , ( (page.value -1) * perPage.value) + perPage.value );
            }

            const changePage = (action)=>{
                if (action == 'first'){
                    if (page.value == 1){
                        return false;
                    }
                    page.value = 1;
                }else if(action == 'previo'){
                    if (page.value == 1){
                        return false;
                    }
                    page.value--;
                }else if(action == 'next'){
                    if (page.value == totalPage.value){
                        return false;
                    }
                    page.value++;
                }else if(action == 'last'){
                    if (page.value == totalPage.value){
                        return false;
                    }
                    page.value = totalPage.value;
                }
                debounce('load');
                dataFilter.value = data.value.slice( ( (page.value -1) * perPage.value) , ( (page.value -1) * perPage.value) + perPage.value );

            }
            const pageSelect = (i) =>{
                page.value = i;
                debounce('load');
                dataFilter.value = data.value.slice( ( (page.value -1) * perPage.value) , ( (page.value -1) * perPage.value) + perPage.value );
            }

            // const vue
            const auto = computed(()=>{
                return null;
            });
            onMounted(()=>{
                debounce('load');
                dataFilter.value = data.value.slice( ( (page.value -1) * perPage) , ( (page.value -1) * perPage.value) + perPage.value );
                perPages.value = options.value.perPages;
            });

            return {
                // var
                dataFilter,
                perPage,
                perPages,
                totalPage,
                page,
                loader,

                // methods
                auto,
                debounce, VerifyColumnsByOrder, VerifyColumnsByFilter, format,
                // page
                onChangedPerPage,pageSelect, changePage
            }
        }
    };
</script>

<style scoped>

    .table-main{

    }

    .tr-columns-description{
        
    }

    .th-columns-description{
        
    }

    .li-order{
        
    }

    .li-order:hover{
        cursor: pointer;
    }

    .tr-columns-inputs{
        
    }

    .th-columns-inputs{
        
    }

    .input-filter{
        
    }

    .tr-row-data{
        
    }

    .td-row-data{
        
    }

    /* paginator */

    .center {
        text-align: center;
    }

    .pagination {
        display: inline-block;
    }

    .pagination a {
        color: black;
        float: left;
        padding: 8px 16px;
        text-decoration: none;
        transition: background-color .3s;
        border: 1px solid #ddd;
        margin: 0 4px;
    }

    .pagination a.active {
        background-color: #4CAF50;
        color: white;
        border: 1px solid #4CAF50;
    }

    .pagination a:hover:not(.active) {background-color: #ddd;}
</style>
