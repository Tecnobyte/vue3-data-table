<template>
  <h1>client table</h1>
  <client-table :columns="column" :data="data" :options="option"></client-table>
</template>

<script>
import ClientTable from './components/client-table/client_table.vue';
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
    img {
        width: 200px;
    }

    h1 {
        font-family: Arial, Helvetica, sans-serif;
    }

    .btn {
        line-height: 1.5715;
        position: relative;
        display: inline-block;
        font-weight: 400;
        white-space: nowrap;
        text-align: center;
        background-image: none;
        -webkit-box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
        box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
        cursor: pointer;
        -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -ms-touch-action: manipulation;
        touch-action: manipulation;
        height: 32px;
        width: 128px;
        padding: 4px 15px;
        font-size: 14px;
        border-radius: 2px;

        border: 1px solid #d9d9d9;
        color: #fff;
        background: #1890ff;
        border-color: #1890ff;
        text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
        -webkit-box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
        box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
    }
</style>
