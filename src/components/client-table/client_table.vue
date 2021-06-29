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
                    <tr>
                        <th v-for="(column, i) of columns" :key="i">
                            {{ (column.hasOwnProperty('header') ) ? column.header : column.description}} <li v-if="VerifyColumnsByOrder(column)" @click="order_by(column.description, $event)" class="li-order">o</li>
                            <br>
                            <div v-if="VerifyColumnsByFilter(column)"> 
                                <input v-model="column.value" type="text" :placeholder="(column.hasOwnProperty('header') ) ? column.header : column.description" :name="column.description" v-on:keyup="search_word()">
                            </div>
                        </th>
                    </tr>
                </thead>

                <tbody :class="[css[theme].table.tbody]">
                    <template v-if="loader">
                        <tr v-for="(row, i) of primary" :key="i">
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
                    <div>
                        <pagination :paginates="totalPage" :pagination="page" @inputPage="current_page" />
                    </div>
                    <!-- mostrando {{primary.length}} de {{data.length}}
                    {{totalPage}}
                    {{page}} -->
                </tfoot>
            </table>
        </div>
    </div>
</template>

<script>
    import { ref, computed, onMounted, toRefs, watch} from 'vue';
    import {Themes} from '../../themes/themes.js';
    import Pagination from '../Pagination.vue';

    export default {
        name: 'client-table',
        components:{
            Pagination
        },
        props:{
            data: { // array of data
                type: Array,
                required: true
            },
            columns: { // columns table
                type: Array,
                required: true
            },
            options: { //opctions
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
            const primary = ref([]); // lista principal de la informacion
            const aux = ref([]); // lista la cua guardare la informacion de la busqueda
            const aux_2 = ref([]); // lista la cua guardare la informacion de la busqueda
            const loader = ref(false);
            const css = ref(Themes)
            
            // var pages
            const page = ref(1) // current page
            const perPages = ref([]); // array limits data por pages
            const perPage = ref(options.value.perPages[0]); // option seect of limit data for page
            const totalPage = ref([5]); // total page for the pagination
            const filterColumn = ref([]);
            
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
                aux.value = [...data.value];
                columns.value.forEach(col => {
                    if(col.hasOwnProperty('value')){
                        let regex = new RegExp(col.value); // creo la expresion regular para la busqueda
                        aux.value =  aux.value.filter(filter => regex.exec(filter[col.description]));
                    }
                });
                fnTotalPage(aux.value);
                filterArray(aux.value);
            };
            const order_by = ()=>{}
            // funciones de paginacion
            const fnTotalPage = (array = null) => { // get total number of page
                if(array == null){
                    totalPage.value = [Math.ceil(data.value.length /perPage.value)]
                }else{
                    totalPage.value = [Math.ceil(array.length /perPage.value)]
                }
            }
            const onChangedPerPage = () =>{ // event change of number per page
                page.value = 1;
                fnTotalPage();
            }
            const current_page = (p)=>{ // get number of page
                page.value = p;
            }
            const filterArray = (array)=>{
                if(array == null){
                    primary.value = data.value.slice( ( (page.value -1) * perPage.value) , ( (page.value -1) * perPage.value) + perPage.value );
                }else{
                    primary.value = array.slice( ( (page.value -1) * perPage.value) , ( (page.value -1) * perPage.value) + perPage.value );
                }
            }
            // const vue
            watch(page, (val, old)=>{
                search_word()
            });
            watch(perPage, (val, old)=>{
                search_word()
            });
            onMounted(()=>{
                fnTotalPage();
                loader.value = true;
                primary.value = data.value.slice( ( (page.value -1) * perPage) , ( (page.value -1) * perPage.value) + perPage.value );
                perPages.value = options.value.perPages;
            });

            return {
                css,

                // var
                primary, // lista principal 
                perPage,
                perPages,
                totalPage,
                page,
                loader,

                // methods
                debounce, VerifyColumnsByOrder, VerifyColumnsByFilter, format, order_by, search_word,
                // page
                current_page, onChangedPerPage
            }
        }
    };
</script>

<style scoped>

</style>
