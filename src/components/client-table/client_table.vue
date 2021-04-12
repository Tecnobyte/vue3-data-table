<template>
    <div>
        <table>
            <thead>
                <!-- seccion para las columnas -->
                <tr>
                    <th v-for="(column, i) of columns" :key="i">{{column}}</th>
                </tr>

                <!-- seccion para los filtros -->
                <tr>
                    <!-- <template v-for="(column) of columns">
                        <template v-for="(input) of filter">
                            {{input}}

                        </template>
                    </template> -->
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, i) of data" :key="i">
                    <td v-for="column of columns" :key="column">
                        {{ item[column] }}
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
            };
        },
        mounted() {
            if (this.options.hasOwnProperty('filter')){ // --------------- verifico que exista el atributo filtro
                if (Array.isArray(this.options.filter)){ // -------------- verifico que sea de tipo array
                    if (this.options.filter.length > 0){// --------------- verifico que tenga datos
                        for (let column of this.columns ){// ------------- itero columnas
                            for (let row of this.options.filter){// ------ itero los filtros
                                this.filter.push({
                                    column: column,
                                    filter: column == row
                                });
                            }
                        }
                    }
                }
            }
            console.log(this.filter);
        },
        methods: {

        }
    };
</script>

<style scoped>

</style>