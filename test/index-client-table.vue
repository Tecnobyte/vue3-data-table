<template>
    <h1>client table</h1>
    <client-table :columns="column" :data="data" :options="option">
        <template #menu="{row, index}">
            <div> 
                <button @click="pais(row, index)">seleccion</button>
            </div>
        </template>

        <template #load>
            cargando...
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
                    filter: true,
                    order: false,
                    header: 'ID',
                    format: (row) => `${row.id}`
                },
                {
                    description: 'descripcion',
                    filter: true,
                    order: false,
                    header: 'DESCRIPCION'
                },
                {
                    description: 'origen',
                    filter: false,
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
                },{
                    id: 8,
                    descripcion: 'africa',
                    origen: 'continente',
                    poblacion: 1600000
                },{
                    id: 9,
                    descripcion: 'europa',
                    origen: 'continente',
                    poblacion: 1600000
                },{
                    id: 10,
                    descripcion: 'asia',
                    origen: 'continente',
                    poblacion: 1600000
                },{
                    id: 11,
                    descripcion: 'oceania',
                    origen: 'continente',
                    poblacion: 1600000
                },                {
                    id: 12,
                    descripcion: 'mexico',
                    origen: 'pais',
                    poblacion: 100000,
                },{
                    id: 13,
                    descripcion: 'estados unidos',
                    origen: 'pais',
                    poblacion: 200000
                },{
                    id: 14,
                    descripcion: 'españa',
                    origen: 'pais',
                    poblacion: 300000
                },{
                    id: 15,
                    descripcion: 'canada',
                    origen: 'pais',
                    poblacion: 400000
                },{
                    id: 16,
                    descripcion: 'londres',
                    origen: 'pais',
                    poblacion: 500000
                },{
                    id: 17,
                    descripcion: 'china',
                    origen: 'pais',
                    poblacion: 600000
                },{
                    id: 18,
                    descripcion: 'america',
                    origen: 'continente',
                    poblacion: 1600000
                },{
                    id: 19,
                    descripcion: 'africa',
                    origen: 'continente',
                    poblacion: 1600000
                },{
                    id: 20,
                    descripcion: 'europa',
                    origen: 'continente',
                    poblacion: 1600000
                },{
                    id: 21,
                    descripcion: 'asia',
                    origen: 'continente',
                    poblacion: 1600000
                },{
                    id: 22,
                    descripcion: 'oceania',
                    origen: 'continente',
                    poblacion: 1600000
                }
            ];
            let option = {
                time: 500,
                perPages: [5, 10, 20],
                text:{
                    loading: 'loading...'
                }
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
