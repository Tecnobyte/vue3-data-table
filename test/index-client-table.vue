<template>
    <h1>client table</h1>
    <client-table :columns="column" :data="data" :options="option">
        <template v-slot:menu="row">
            <div> 
                <button @click="pais(row)">seleccion</button>
            </div>
        </template>
    </client-table>
</template>

<script>
import { ClientTable } from './../src/main';
    export default {
        data() {
            return {
                column: [
                    {
                        description: 'id',
                        filter: false,
                        order: false
                    },
                    {
                        description: 'descripcion',
                        filter: true,
                        order: false
                    },
                    {
                        description: 'origen',
                        filter: true,
                        order: false
                    },
                    {
                        description: 'poblacion',
                        filter: false,
                        order: false
                    },
                    {
                        description: 'menu',
                        filter: false,
                        order: false
                    }
                ], data: [
                    {
                        id: 1,
                        descripcion: 'mexico',
                        origen: 'pais',
                        poblacion: 100000,
                    },{
                        id: 2,
                        descripcion: 'estados unidos',
                        origen: 'pais',
                        poblacion: 200000
                    },{
                        id: 3,
                        descripcion: 'españa',
                        origen: 'pais',
                        poblacion: 300000
                    },{
                        id: 4,
                        descripcion: 'canada',
                        origen: 'pais',
                        poblacion: 400000
                    },{
                        id: 5,
                        descripcion: 'londres',
                        origen: 'pais',
                        poblacion: 500000
                    },{
                        id: 6,
                        descripcion: 'china',
                        origen: 'pais',
                        poblacion: 600000
                    }
                ], option:{
                    time: 500

                },
                seleccion: null,
            };
        },
        components: {
            ClientTable
        },
        setup() {
        }, mounted() {

        }, methods: {
            pais(row){
                console.log(row)
            }
        }
    };
</script>

<style scoped>

</style>
