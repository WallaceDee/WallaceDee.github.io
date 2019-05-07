<template>
    <div>
        <div class="page-demo">
            <mt-header title="工资表(汽车租赁)">
                <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
            </mt-header>
            <div class="content">
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'demo',
    data() {
        return {
            title: '你好伯渡！'
        }
    }
}
</script>
<style lang="less" scoped>
</style>