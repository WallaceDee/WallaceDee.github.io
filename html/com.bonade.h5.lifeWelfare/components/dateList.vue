<template>
    <div class="dateList">
        <mt-header title="我的纪念日">
            <mt-button icon="back" slot="left" v-on:click="toMyWelfare">返回</mt-button>
            <mt-button slot="right" v-on:click="toWelfareTip"><img src="../assets/images/tip.png" style="position: relative;width: 24px;top: 3px;"></mt-button>
        </mt-header>
        <div class="mint-tabbar button-wrapper">
            <router-link to="dateCreate">
                <mt-button size="large">新建纪念日</mt-button>
            </router-link>
        </div>
        <div class="content">
            <div class="list" v-for="item in pageInfo.list" v-on:click="toDateCreate(item)">
                <mt-cell v-bind:title="item.festivalName" >
                    <span >{{item.festivalDateFmt}} &nbsp<i class="icon-calendar"></i></span>
                    <img slot="icon" src="../assets/images/cake.png" width="24" height="24">
                </mt-cell>
            </div>
            <span class="no-data-tips" v-show="pageInfo.total==0 && pageInfo"></span>
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
            uploadList: [],
            pageInfo:[]
        }
    },
    
    computed: {
        isAndroid() {
            return this.$utils.device.android
        }
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.$utils.ajax({
                // baseURL:'http://192.168.0.172:82/api',
                url:'/system/userFestival/app/v1/queryUserFestivalPage',
                method:'post',
                data:{'row':'100'},
                success:(sucData)=>{
                    if(sucData.httpCode == 200){
                        this.pageInfo = sucData.data;
                        console.log(sucData);
                    }else{
                        this.$toast({message: sucData.msg,position:'bottom'});
                    }

                },
                error:(errData)=>{
                     console.log(errData)
                }
            })
        },
        toDateCreate(item) {
            this.$router.push({
                name: 'dateCreate',          
                params: {
                            id:item.id
                        }
          });
        },
        toMyWelfare(){
            this.$router.push({name: 'myWelfare'});
        },
        toWelfareTip(){
            this.$router.push({name: 'welfareTip'});
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
        .content{
            .list{
                margin-top: 1px;
            }
        }
    }
    
</style>