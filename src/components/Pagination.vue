<template>
    <div v-if="pagination > 0" class="pagination">
        <a @click="firstPage">&laquo;</a>
        <a @click="prevPage">&lt;</a>
        <template v-for="(pagina,index) in paginates">
            <template v-if="index == indexPaginate">
                <a v-for="(item,pageIndex) in pagina" :key="pageIndex" @click="changePage(item)" :class="{'selected' : page == item }">
                    {{ item }}
                </a>
            </template>
        </template>
        <a @click="nextPage">&gt;</a>
        <a @click="lastPage">&raquo;</a>
    </div>
</template>
<script>
import { ref, toRefs, watch } from 'vue';
export default {
    props:{
        paginates:{ 
            type:Array,
            default:() => [],
            required:true
        },
        pagination:{ // current page
            type:Number,
            default:0,
            required:true
        },
        theme:{
            type:Object,
            default: () =>{ return{'pagination':true} } 
        },
        server: {
            type: Boolean,
            default: true
        }
    },
    setup(props,{emit}){
        const { pagination,paginates, server } = toRefs(props);

        const indexPaginate = ref(0); 
        const page = ref(1);
        
        watch(paginates, (newVal,oldVal) => {
            if(server.value){
                indexPaginate.value = 0;
                page.value = 1;
            }
        })

        const nextPage = () => {
            if(page.value < pagination.value){
                page.value++;
                indexPaginate.value = paginates.value.findIndex( pag => pag.includes(page.value) );
                emit('inputPage',page.value);
            }
        }

        const prevPage = () => {
            if(page.value > 1){
                page.value--;
                indexPaginate.value = paginates.value.findIndex( pag => pag.includes(page.value) );
                emit('inputPage',page.value);
            }
        }

        const lastPage = () => {
            page.value = pagination.value;
            indexPaginate.value = paginates.value.findIndex( pag => pag.includes(page.value) );
            emit('inputPage',page.value);
        }

        const firstPage = () => {
            page.value = 1;
            indexPaginate.value = paginates.value.findIndex( pag => pag.includes(page.value) );
            emit('inputPage',page.value);
        }

        const changePage = (p) => {
            page.value = p;
            emit('inputPage',p);
        }

        return {
            indexPaginate,
            page,
            prevPage,
            nextPage,
            lastPage,
            firstPage,
            changePage
        };

    }
    
}
</script>
<style scoped>
.pagination {
    display: flex;
	padding: 20px 0;
}
.pagination a {
    font-family: 'Open Sans';
    font-size: 1.08em;
    width: 25px;
    height: 25px;
    background-color: transparent;
    color: #222;
    border: 1px solid #ddd;
    /* display: inline-block; */
    /* vertical-align: middle; */
    /* line-height: 25px; */
    text-decoration: none;
    font-weight: 700;
    margin: 4px;
    transition: all 0.2s linear;
}
.pagination a:hover, .pagination a.selected {
    color: #fff;
    background-color: #73c0f4;
    border-color: #73c0f4;
    cursor: pointer;
}
 
</style>