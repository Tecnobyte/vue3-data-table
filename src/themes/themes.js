// por defecto se carga el tema por defecto
// para la carga de los estilos de la tabla, se cuenta con un json que define cada clase que contendra la tabla para ello se describen las siguientes
// main: la clase contedora de la tabla, es equivalente a la etiqueta table, se podra cambiar las propiedades de la tabla
// thead: Permite el cambio de los header de la tabla. Solo afecta a la etiqueta <thead>
// tbody: Permite el cambio del cotnenido de la tabla. Solo afecta a la etiqueta <tbody>


export const Themes = {
    default_theme:{
        table:{
            main: 'default-table',
            thead: 'default-thead-table',
            tbody: 'default-tbody-table',
            tfooter: 'default-tfooter-table'
        },
        pagination:{
        }
    },
    ligth:{
        table:{
            main: 'light-table-theme',
            thead: 'light-thead-theme',
            tbody: 'light-tbody-theme',
        },
        pagination:{
        }

    },
    custom_theme:{
        table:{
            main: '',
            thead: '',
            tbody: '',
            tfooter: ''
        },
        pagination:{

        }
    },
}