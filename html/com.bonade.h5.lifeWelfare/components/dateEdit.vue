<template>
    <div class="dateList">
        <mt-header title="编辑纪念日">
            <mt-button icon="back" slot="left" v-on:click="goBack">返回</mt-button>
            <mt-button slot="right" v-on:click=""> <span >删除</span></mt-button>
        </mt-header>
        <div class="mint-tabbar button-wrapper">
            <router-link to="projectList">
                <mt-button size="large">保存</mt-button>
            </router-link>
        </div>
        <div class="content">
            <div class="list">
            <mt-cell title="纪念日名称" is-link>
                <span >结婚纪念日</span>
            </mt-cell>
            <mt-cell title="纪念日日期">
                <span >12月25日 &nbsp<i class="icon-calendar"></i></span>
            </mt-cell>
            <mt-cell title="是否提醒" is-link>
                <span >提前一个星期提醒</span>
            </mt-cell>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'app',
    data() {
        return {
            result: '测试',
            base64: '',
            src: './static/img/default_avatar.png',
            selected: 'second',
            searchBarVisible: true,
            keyword: '',
            employees: [],
            uploadList: []
        }
    },
    computed: {
        isAndroid() {
            return this.$utils.device.android
        }
    },
    created() {
        // this.getData();
    },
    methods: {
        toWelfareTip() {
            this.$router.push({name: 'welfareTip'});
        },
        toWeb(type){
            console.log(type)
            switch(type)
            {
                case 1:
                    this.$router.push({name: 'redEnvelope'});
                    break;
                case 2:
                    this.$router.push({name: 'greetinCard'});
                    break;
                default:
                    break;
            }
            
        }
    }
}
</script>
<style lang="less" >
    *{
        box-sizing:border-box;
    }
    .dateList{
        .mint-cell-text{
            font-size: 18px;
                padding-left: 6px;
                vertical-align: sub;
        }
        .icon-calendar{
                font-size: 16px;
                position: relative;
                top: 1px;
        }
        .mint-tabbar.button-wrapper{
            background: transparent;
        }
    }
    
</style>