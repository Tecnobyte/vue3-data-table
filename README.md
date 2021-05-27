# Vue Data Table

# Instalación
<pre>npm i vue3-data-table</pre>

## Configuración

```javascript
let url = ref('http://test-server-table.test/api/get-personas') ;
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
```
```vue
<server-table ref="tabla" :columns="columns" :url="url" >
</server-table>
```

