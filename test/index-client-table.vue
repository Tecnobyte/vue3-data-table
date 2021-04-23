<template>
    <h1>client table</h1>
    <client-table :columns="column" :data="data" :options="option">
        <template #menu="{row, index}">
            <div> 
                <button @click="pais(row, index)">seleccion</button>
            </div>
        </template>
    </client-table>
</template>

<script>
import { ClientTable } from './../src/main';
    export default {
        setup() {
            let column = [
                {
                    description: 'id',
                    filter: false,
                    order: false,
                    header: 'ID'
                },
                {
                    description: 'descripcion',
                    filter: true,
                    order: false,
                    header: 'DESCRIPCION'
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
            ];
            let data = [
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
                },{
                    id: 7,
                    descripcion: 'america',
                    origen: 'continente',
                    poblacion: 1600000
                }
            ];
            let option = {
                time: 500,
                perPages: [5, 10, 20]
            };

            const pais = (row, index) =>{
                console.log(row);
                console.log(index);
            }

            return {
                // var
                column,
                data,
                option,

                // methods
                pais

            }
        },

        components: {
            ClientTable
        }

    };
</script>

<style scoped>

</style>
