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
        <div class="table-wrapper">
            <table class="fl-table">
                <thead>
                    <!-- seccion para las columnas -->
                    <tr class="tr-columns-description">
                        <th v-for="(column, i) of columns" :key="i" class="th-columns-description">
                            {{ (column.hasOwnProperty('header') ) ? column.header : column.description}} <li v-if="VerifyColumnsByOrder(column)" @click="debounce('order', column.description, $event)" class="li-order">o</li>
                            <!-- // hacer un salto condicional en los inputs -->
                            <br>
                            <div class="form__group field" v-if="VerifyColumnsByFilter(column)"> 
                                <input type="text" class="form__field" :placeholder="(column.hasOwnProperty('header') ) ? column.header : column.description" :name="column.description" v-on:keyup="debounce('key', column.description, $event)">
                                <label :for="column.description" class="form__label">
                                    {{(column.hasOwnProperty('header') ) ? column.header : column.description}}
                                </label>
                            </div>
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
                                    {{options.text.loading}}
                                </slot>
                            </td>
                        </tr>
                    </template>

                </tbody>
            </table>
        </div>

        <!-- paginador de la tabla -->
        <ul class="page">
            <li class="page__btn active" @click="changePage('first')">&laquo;</li>
            <li class="page__btn active" @click="changePage('previo')">&lt;</li>
            <li v-for="i of totalPage" href="#" :key="i" @click="pageSelect(i)" class="page__numbers" :class="page == i ? 'active' : ''">{{i}}</li>
            <!-- <li class="page__dots">...</li> -->
            <li class="page__btn active" @click="changePage('next')">&gt;</li>
            <li class="page__btn active" @click="changePage('last')">&raquo;</li>
        </ul>

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
    /* estilos de la tabla */

        .fl-table {
            border-radius: 5px;
            font-size: 20px;
            font-weight: normal;
            border: none;
            border-collapse: collapse;
            width: 100%;
            max-width: 100%;
            white-space: nowrap;
            background-color: white;
            /* box-shadow: 0px 35px 50px rgba( 0, 0, 0, 0.2 ); */
        }

        .fl-table td, .fl-table th {
            text-align: center;
            padding: 8px;
        }

        .fl-table td {
            border-right: 1px solid #f8f8f8;
            font-size: 20px;
        }

        .fl-table thead th {
            color: #000000;
            /* background: #4FC3A1; */
        }

        .fl-table thead th:nth-child(odd) {
            color: #000000;
            /* background: #324960; */
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
                height: auto;
                vertical-align: middle;
                box-sizing: border-box;
                overflow-x: hidden;
                overflow-y: auto;
                width: auto;
                font-size: 13px;
                /* text-overflow: ellipsis; */
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

        .li-order{

        }
        .li-order:hover{
            cursor: pointer;
        }
    /* fin de los estilos de la tabla */

    /* estilos de los input y select */
        .form__group {
            position: relative;
            padding: 10px 0 0;
            margin-top: 5px;
            width: 50%;
            margin: 0 auto;
        }

        .form__field {
            font-family: inherit;
            width: 100%;
            border: 0;
            border-bottom: 2px solid #9b9b9b;
            outline: 0;
            font-size: 10px;
            color: rgb(2, 2, 2);
            padding: 10px 0;
            background: transparent;
            transition: border-color 0.2s;
        }

        .form__field::placeholder {
            color: transparent;
        }

        .form__field:placeholder-shown ~ .form__label {
            font-size: 1.3rem;
            cursor: text;
            top: 20px;
        }

        .form__label {
            position: absolute;
            top: 0;
            display: block;
            transition: 0.2s;
            font-size: 15px;
            color: #9b9b9b;
        }

        .form__field:focus {
            padding-bottom: 6px;
            font-weight: 700;
            border-width: 3px;
            border-image: linear-gradient(to right, #11998e, #38ef7d);
            border-image-slice: 1;
        }

        .form__field:focus ~ .form__label {
            position: absolute;
            top: 0;
            display: block;
            transition: 0.2s;
            font-size: 1rem;
            color: #11998e;
            font-weight: 700;
        }

        /* reset input */
        .form__field:required, .form__field:invalid {
            box-shadow: none;
        }

        select {
            margin-bottom: 1em;
            padding: .25em;
            border: 0;
            border-bottom: 2px solid currentcolor; 
            font-weight: bold;
            letter-spacing: .15em;
            border-radius: 0;
            &:focus, &:active {
                outline: 0;
                border-bottom-color: red;
            }
        }
    /* fin de los estilos de los input y select */

    /* paginator */

        .container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #cbe0dd;
            color: #2d4848;
        }
        ul {
            list-style-type: none;
        }
        .items-list {
            max-width: 90vw;
            margin: 2rem;
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            grid-gap: 3rem;
            justify-content: center;
            align-content: center;
        }
        @media only screen and (max-width: 600px) {
            .items-list {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        .item {
            width: 10rem;
            height: 10rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #2d4848;
            cursor: pointer;
        }
        .item span {
            background: #ffffff;
            box-shadow: 0 0.8rem 2rem rgba(90, 97, 129, 0.05);
            border-radius: 0.6rem;
            padding: 2rem;
            font-size: 3rem;
            transition: all 0.3s ease;
        }

        .item:hover span {
            transform: scale(1.2);
            color: #23adad;
        }
        .item p {
            font-size: 1.2rem;
            margin-top: 1rem;
            color: #23adade1;
        }
        .page {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 5rem;
            margin: 3rem;
            /* border: solid 1px; */
            border-radius: 0.6rem;
            background: #ffffff;
            box-shadow: 0 0.8rem 2rem rgba(90, 97, 129, 0.05);
        }
        .page__numbers, .page__btn, .page__dots {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0.8rem;
            font-size: 1.4rem;
            cursor: pointer;
        }
        .page__dots {
            width: 2.6rem;
            height: 2.6rem;
            color: #23adade1;
            cursor: initial;
        }
        .page__numbers {
            width: 2.6rem;
            height: 2.6rem;
            border-radius: 0.4rem;
        }
        .page__numbers:hover {
            color: #23adad;
        }
        .page__numbers.active {
            color: #ffffff;
            background: #23adad;
            font-weight: 600;
            border: 1px solid #23adad;
        }
        .page__btn {
            color: #23adade1;
            pointer-events: none;
        }
        .page__btn.active {
            color: #2d4848;
            pointer-events: initial;
        }
        .page__btn.active:hover {
            color: #23adad;
        }
    /* fin del paginator */

</style>
