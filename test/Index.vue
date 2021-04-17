<template>
  <h1>client table</h1>
  <client-table :columns="column" :data="data" :options="option"></client-table>
</template>

<script>
import { ClientTable } from './../src/main';
    export default {
        data() {
            return {
                column: ['id', 'descripcion', 'origen', 'poblacion'],
                data: [
                    {
                        id: 1,
                        descripcion: 'mexico',
                        origen: 'pais',
                        poblacion: 100000
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
                ],
                option:{
                    filter: ['id', 'origen']

                }
            };
        },
        components: {
            ClientTable
        },
        setup() {
            // const count = ref(0);
            // const inc = () => {
            //   count.value++;
            // };
            // return {
            //   count,
            //   inc,
            // };
        },
        mounted() {},
    };
</script>

<style scoped>

</style>
