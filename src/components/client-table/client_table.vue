<template>
    <div>
        <table>
            <thead>
                <!-- seccion para las columnas -->
                <tr>
                    <th v-for="(column, i) of columns" :key="i">{{column.descripcion}}</th>
                </tr>

                <!-- seccion para los filtros -->
                <tr>
                    <th v-for="(column, i) of columns" :key="i">
                        <input type="text" :name="column.descripcion" v-if="column.filter" v-on:keyup="debounce('key', column.descripcion,$event)">
                    </th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="(item, i) of data_filter" :key="i">
                    <td v-for="column of columns" :key="column">
                        {{ item[column.descripcion] }}
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
                required: true
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
            debounce(type, column,event){
                if (this._debounce != null){
                    clearTimeout(this._debounce);
                    this._debounce == null;
                }
                this._debounce = setTimeout(()=>{
                    if (type == 'key'){
                        this.search_word(column ,event);
                    }else if (type == 'order'){
                        this.order_by(event);
                    }
                }, this.options.time);
            },
            search_word(column, event){
                // console.log('search');
                console.log(event.target.value == '')
                if (event.target.value != ''){
                    this.data_filter = this.data.filter(filter => filter[column] == event.target.value );
                }else{
                    this.data_filter = this.data;
                }
                console.log(this.data_filter);
            },
            order_by(event){
                console.log('sort');
                console.log(event)
            },



        }
    };
</script>

<style scoped>

</style>
