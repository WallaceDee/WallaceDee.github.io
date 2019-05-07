<template>
    <div>
        <div class="page-index">
            <mt-header title="日日薪">
                <mt-button icon="back" slot="left" v-on:click="exit"></mt-button>
            </mt-header>
            <div class="mint-tabbar button-wrapper">
                <router-link to="projectList">
                    <mt-button size="large">进入</mt-button>
                </router-link>
            </div>
            <div class="content">
                <img src="../assets/images/surface.jpg">
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'index',
    data() {
        return {}
    }
}
</script>
<style lang="less" scoped>
img {
    display: block;
    width: 100%;
}
</style>