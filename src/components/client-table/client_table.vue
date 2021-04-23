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
                <tr v-for="(row, i) of dataFilter" :key="i" class="tr-row-data">
                    <td v-for="column of columns" :key="column" class="td-row-data">
                        <slot :name="column.description" :row="row" :index="i">
                            {{ row[column.description] }}    
                        </slot>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- <div class="center">
            <div class="pagination">
                <a href="#">&laquo;</a>
                <a href="#">&lt;</a>
                <a v-for="i of totalDate" href="#">{{i}}</a>
                <a href="#">&gt;</a>
                <a href="#">&raquo;</a>
            </div>
        </div> -->

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
                        perPages: [5,10,20,30,40,50]
                    }
                }
            },
        },
        setup(props, context){
            const { data, options, columns } = toRefs(props);
            const _debounce =  ref(null);
            const dataFilter = ref([]);
            const perPage = ref(options.value.perPages[0]);
            const perPages = ref([]);
            const filter = ref([]);
            const page = ref(0)
            const totalDate = data.value.length /perPage.value;

            const debounce = (type, column, event)=>{
                if (_debounce.value != null){
                    clearTimeout(_debounce.value);
                    _debounce.value == null;
                }

                _debounce.value = setTimeout(()=>{
                    if (type == 'key'){
                        search_word(column ,event);
                    }else if (type == 'order'){
                        order_by(column ,event);
                    }
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

            const search_word = (column, event) => {
                if (event.target.value != ''){ // si este ya tiene aplicado algun filtro que vuelva a filtrar en el mismo arreglo
                    let regex = new RegExp(event.target.value);
                    dataFilter.value = dataFilter.value.filter( filter => regex.exec(filter[column]) );
                }else{
                    dataFilter.value = data.value;
                }
            };

            const auto = computed(()=>{
                return null;
            });

            onMounted(()=>{
                console.log(page.value);
                console.log(perPage.value);
                console.log(perPage.value / data.value.length )
                dataFilter.value = data.value;
                perPages.value = options.value.perPages;
            });

            return {
                // var
                dataFilter,
                perPage,
                perPages,
                totalDate,

                // methods
                auto,
                debounce,
                VerifyColumnsByOrder,
                VerifyColumnsByFilter
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
