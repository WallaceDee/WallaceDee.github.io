<template>
    <div>
        <div class="page-demo">
            <mt-header title="demo">
                <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
            </mt-header>
            <div class="mint-tabbar button-wrapper">
                <router-link to="test">
                    <mt-button size="large">进入测试页面</mt-button>
                </router-link>
            </div>
            <div class="content">
                {{title}}
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