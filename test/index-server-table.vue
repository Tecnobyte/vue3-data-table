<template>
    <h1>Server table</h1>
    <server-table ref="tabla" :columns="columns" :url="url" @loaded="loaded" texts="Mostrando {from} a {to} de {count}" >

        <template v-slot:no-data>
            No hay datos
        </template>    

        <!-- <template v-slot:loading>
            Esta cargando...
        </template>         -->
    </server-table>
</template>

<script>
import { ServerTable } from './../src/main';
import { onMounted, ref } from 'vue'
// import Axios from 'axios';

export default {
    components: {
        ServerTable
    },
    setup() {
        let data = ref([]);
        let url = ref('http://test-server-table.test/api/get-personas') ;

        const tabla = ref(null);

        
        let columns = [
            {
                description: 'id',
                filter: false,
                header:'ID',
                order: false,
            },
            {
                description: 'name',
                filter: true,
                header:'Nombre',
                order: false,
            },
            {
                description: 'last_name',
                header:'Apellido Paterno',
                filter: true,
                order: false
            },
            {
                description: 'number',
                header:'Número',
                filter: true,
                order: false
            },
        ];

        const response = (response) => {
            return{
                data:response.datos,
                count:response.total_datos
            }
        }

        // const request = async(url) => {
        //     const { data } = await Axios.get(url);
        //     return data;
        // }

        onMounted(() => {

            setTimeout(() => {
                tabla.value.refresh();
            }, 5000);
            // console.log(tabla.value);
        });

        return {
            columns,
            url,
            tabla,
            response,
            // request
        };

    }
};
</script>

<style scoped>

</style>
