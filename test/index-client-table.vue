<template>
    <div>
        <div style=text-aling:center>
            <h1 >Cliente table</h1>
        </div>

        <div>
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
        </div>
    </div>
</template>

<script>
    /**
    * importacion de la tabla de tipo cliente
    */
    import { ClientTable } from './../src/main';
    export default {
        setup() {
            /** 
            * La creacion de las columnas podra tener n cantidad de atributos, deacuerdo a la informacion que se requiera visualizar en la tabla 
            * Para ello se declara un arreglo de objetos los cuales tendran los siguientes atributos.
            * 
            * description(required): Identifica el valor de los datos que se visualizara en la tabla.
            * filter(option): Indica si la columna podra ser filtrada o no. Por defecto es false.
            * order(option): indica si la columna filtrara los datos deacuerdo a un criterio. Por defecto es falso.
            * header(option): Define un nuevo nombre en caso de asignar otro titulo a la columna. Por defecto se toma el valor del atributo description
            * format(option): Permite definir un valor especifico pasando un callback que devolvera el valor del objeto de datos pasado
            */
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

            /**
            * Los datos de la tabla Se establecen como un arreglo de objectos. antes de eso se tiene que haber declarado las columnas de las tabla que permitan
            * identificar los valores a tomar.
            */
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

            /**
            * Las opciones se establece un conjunto de caracteristicas que tendra la tabla
            * Se describiran las siguientes opciones:
            * perPages: Establece el numero de elementos que se pueden seleccionar para mostrar, se le manda un arreglo.
            * text: Permite el cambio de los texto que se visualizan en la tabla en caso de cambiar, se le manda un objeto y tiene los siquientes atributos:
            *   - loading: cambia el texto al carga la informacion de la tabla.
            *   - recordatorio. agregar mas texto para el cambio
            */
            let option = {
                time: 500,
                perPages: [5, 10, 20],
                text:{
                    loading: 'loading...'
                }
            };

            /**
            * slot
            * description: el slot description toma el valor del atributo description de las columnas creadas
            * este retorna el valor de los datos y ademas el index de la tabla en ese momento
            * ejemplo: menu es una columna
                <template #menu="{row, index}">
                    <div> 
                        <button @click="pais(row, index)">seleccion</button>
                    </div>
                </template>
            * 
            */
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
