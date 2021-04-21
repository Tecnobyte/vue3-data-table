<template>
    <div>
        <table>
            <thead>
                <!-- seccion para las columnas -->
                <tr>
                    <th v-for="(column, i) of columns" :key="i">
                        {{column.description}}
                        <li v-if="verify_columns_by_order(column)" @click="debounce('order', column.description, $event)">o</li>
                    </th>
                </tr>

                <!-- seccion para los filtros -->
                <tr>
                    <th v-for="(column, i) of columns" :key="i">
                        <input v-if="verify_columns_by_filter(column)" type="text" :name="column.description" v-on:keyup="debounce('key', column.description, $event)">
                    </th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="(row, i) of data_filter" :key="i">
                    <td v-for="column of columns" :key="column">
                        <!-- <slot :name="column.descripcion" :item="{row:row, index:i}"> -->
                        <slot :name="column.description" :item="row">
                            {{ row[column.description] }}    
                        </slot>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
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
                    }
                }
            },
        },
        data() {
            return {
                filter: [],
                _debounce: null,
                data_filter: []
            };
        },
        created(){
            this.data_filter = this.data
        }, mounted() {

        },
        methods: {
            debounce(type, column, event){
                if (this._debounce != null){
                    clearTimeout(this._debounce);
                    this._debounce == null;
                }
                this._debounce = setTimeout(()=>{
                    if (type == 'key'){
                        this.search_word(column ,event);
                    }else if (type == 'order'){
                        this.order_by(column ,event);
                    }
                }, this.options.time);
            },
            verify_columns_by_order(column){
                let order = false;
                if (column.hasOwnProperty('order')){
                    return column.order;
                }

                return order;
            },
            verify_columns_by_filter(column){
                let filter = false;
                if (column.hasOwnProperty('filter')){
                    return column.filter;
                }
                return filter;
            },
            verify_row(){

            },
            search_word(column, event){
                if (event.target.value != ''){ // si este ya tiene aplicado algun filtro que vuelva a filtrar en el mismo arreglo
                    let regex = new RegExp(event.target.value);
                    this.data_filter = this.data.filter( filter => regex.exec(filter[column]) );
                }else{
                    this.data_filter = this.data;
                }
            },
            order_by(column ,event){
                console.log('sort');
                console.log(event)
            },

        }
    };
</script>

<style scoped>

</style>
