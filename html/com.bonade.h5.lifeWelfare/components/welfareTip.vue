<template>
    <div class="welfareTip">
        <mt-header title="福利提醒">
            <mt-button icon="back" slot="left" v-on:click="goBack">返回</mt-button>
            <!-- <mt-button slot="right" v-on:click=""><img src="../assets/images/tip.png" style="position: relative;width: 24px;top: 3px;"></mt-button> -->
        </mt-header>
        <!-- <div class="mint-tabbar button-wrapper">
            <router-link to="projectList">
                <mt-button size="large">新建纪念日</mt-button>
            </router-link>
        </div> -->
        <div class="content">
            <div class="list">
                <mt-cell v-for="(item,index) in pageInfo" v-bind:key="index" v-bind:title="item.extendkeyText">
                    <mt-switch v-model="item.checked" @change="set(item)"></mt-switch>
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
            uploadList: [],
            pageInfo:''
        }
    },
    created() {
        this.getData();
    },
    computed: {
        isAndroid() {
            return this.$utils.device.android
        }
    },
    methods: {
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
            
        },
        getData(){
            this.$utils.ajax({
                // baseURL:'http://192.168.0.251/api',
                url:'/system/serviceuser/basic/userExpValue/app/v2/getUserExpValueBykeys',
                method:'post',
                data:{expKeys:'FLXXWSTXFLAG,JNRTXFLAG'},
                success:(sucData)=>{
                    if(sucData.httpCode == 200){
                        
                        this.pageInfo = sucData.data;
                        this.pageInfo.forEach((item) =>{
                            if(item.extendVal == '1'){
                                item.checked = true;
                            }else{
                                item.checked = false;
                            }
                        });
                        console.log(this.pageInfo);
                    }else{
                        this.$toast({message: sucData.msg,position:'bottom'});
                    }
                
                },
                error:(errData)=>{
                     console.log(errData)
                }
            })
        },
        set(item){
            this.$utils.ajax({
                // baseURL:'http://192.168.0.251/api',
                url:'/system/serviceuser/basic/userExpValue/app/v2/insertOrUpdateUserExpValue',
                method:'post',
                data:{
                    expKey:item.extendkey,
                    expVal:item.checked?'1':'0'
                    },
                success:(sucData)=>{
                    if(sucData.httpCode == 200){
                        this.getData();
                        console.log(this.pageInfo);
                    }else{
                        this.$toast({message: sucData.msg,position:'bottom'});
                    }
                
                },
                error:(errData)=>{
                     console.log(errData)
                }
            })
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