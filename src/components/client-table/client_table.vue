<template>
    <div>
        <!-- select de las tablas -->
        <div>
            <select v-model="perPage" @change="onChangedPerPage">
                <option v-for="(page, index) in perPages" :key="index" :value="page">
                    {{ page }}
                </option>
            </select>
        </div>

        <!-- tabla principal -->
        <div class="table-container">
            <table :class="[css[theme].table.main]">
                <thead :class="[dark ? 'dark': '', css[theme].table.thead] ">
                    <!-- seccion para las columnas -->
                    <tr>
                        <th v-for="(column, i) of columns" :key="i">
                            {{ (column.hasOwnProperty('header') ) ? column.header : column.description}} <li v-if="VerifyColumnsByOrder(column)" @click="order_by(column.description, $event)" class="li-order">o</li>
                            <br>
                            <div v-if="VerifyColumnsByFilter(column)"> 
                                <input type="text" :placeholder="(column.hasOwnProperty('header') ) ? column.header : column.description" :name="column.description" v-on:keyup="search_word(column.description, $event)">
                            </div>
                        </th>
                    </tr>
                </thead>

                <tbody :class="[css[theme].table.tbody]">
                    <template v-if="loader">
                        <tr v-for="(row, i) of dataFilter" :key="i">
                            <td v-for="column of columns" :key="column">
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
                                    {{options.text.loading}}
                                </slot>
                            </td>
                        </tr>
                    </template>
                </tbody>

                <tfoot>
                    <pagination :paginates="totalPage" :pagination="page" @inputPage="inputPage" />
                </tfoot>
            </table>
        </div>

        
    </div>
</template>

<script>
    import { ref, computed, onMounted, toRefs} from 'vue';
    import {Themes} from '../../themes/themes.js';
    import Pagination from '../Pagination.vue';

    export default {
        name: 'client-table',
        components:{
            Pagination
        },
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
                        time: 500,
                        perPages: [5,10,20,30,40,50],
                        text:{
                            loading: 'loading...'
                        }
                    }
                }
            },
            theme:{
                type:String,
                default: 'default_theme'
            },
            dark:{
                type:Boolean,
                default: false,
            }
        },
        setup(props, context){
            const { data, options, columns } = toRefs(props);
            const _debounce =  ref(null);
            const dataFilter = ref([]);
            const loader = ref(false);
            const css = ref(Themes)

            // var pages
            const page = ref(1) // current page
            const perPages = ref([]); // array limits data por pages
            const perPage = ref(options.value.perPages[0]); // option seect of limit data for page
            const totalPage = ref([1,2,3]); // total page for the pagination
            
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
            const order_by = (column, event)=>{}

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
                loader.value = true;
                dataFilter.value = data.value.slice( ( (page.value -1) * perPage) , ( (page.value -1) * perPage.value) + perPage.value );
                perPages.value = options.value.perPages;
            });

            return {
                css,
                // var
                dataFilter,
                perPage,
                perPages,
                totalPage,
                page,
                loader,

                // methods
                auto,
                debounce, VerifyColumnsByOrder, VerifyColumnsByFilter, format, order_by, search_word,
                // page
                onChangedPerPage,pageSelect, changePage
            }
        }
    };
</script>

<style scoped>

</style>
