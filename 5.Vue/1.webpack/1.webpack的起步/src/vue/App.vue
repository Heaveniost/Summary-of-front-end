<template>
    <div>
        <h2 class="title">{{ message }}</h2>
        <button @click='btnClick'>按钮</button>
        <h2>{{ name }}</h2>
        <cpn></cpn>
    </div>
</template>

<script>
    import Cpn from './Cpn'
    export default {
        name: 'App',
        data() {
            return {
                message: 'hello Hurst',
                name: 'xingxing'
            }
        },
        components: {
            Cpn
        },
        methods: {
            btnClick() {}
        }
    }
</script>

<style scoped>
    .title {
        color: green;
    }
</style>