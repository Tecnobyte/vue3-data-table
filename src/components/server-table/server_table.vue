<template>
    <div>
        <table>
            <thead>
                <tr>
                    <th>

                    </th>
                </tr>

            </thead>
            <tbody>

            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        props:{
            url:{
                type: String,
                required: true
            },
            columns: {
                type: Array,
                required: true
            },
            option: {
                type: Object,
                required: true
            },

        },
        data() {
            return {
                
            };
        },
        mounted() {
            
        },
        methods: {

        }
    };
</script>

<style scoped>

</style>