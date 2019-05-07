<template>
    <div>
       <mt-datetime-picker ref="picker" type="date" v-model="postParam.festivalDate">
  </mt-datetime-picker>
    <div class="dateList">
        <mt-header v-bind:title="isEdit?'编辑纪念日':'新建纪念日'">
            <mt-button icon="back" slot="left" v-on:click="toDateList">返回</mt-button>
            <mt-button slot="right" v-on:click="delTip" v-show="isEdit"> <span >删除</span></mt-button>
        </mt-header>
        <div class="mint-tabbar button-wrapper" v-if="!isEdit">
                <mt-button size="large" v-on:click="save">保存</mt-button>
        </div>

        <div class="mint-tabbar button-wrapper" v-if="isEdit">
                <mt-button size="large" v-on:click="saveEdit">保存修改</mt-button>
        </div>

        <div class="content">
            <div class="radioList">
                <mt-radio align="right" v-model="postParam.festivalAttribute" :options=radioList> </mt-radio>
            </div>
            <div class="list">
                <mt-cell v-if="postParam.festivalAttribute == '2'" title="与我的关系" is-link>
                     <span v-on:click="changeRelation">{{postParam.relation?postParam.relation:'请选择'}}</span>
                </mt-cell>
                <mt-cell title="纪念日名称"  is-link>
                    <span v-on:click="changeName">{{postParam.festivalName?postParam.festivalName:'请选择'}}</span>
                </mt-cell>
                <mt-cell title="纪念日日期">
                    <span v-on:click="selDate" v-if="!postParam.festivalDate">请选择 &nbsp<i class="icon-calendar"></i></span>
                    <span v-on:click="selDate" v-if="postParam.festivalDate">{{postParam.festivalDate | datetime('yyyy-MM-dd',postParam.festivalDate) }} &nbsp<i class="icon-calendar"></i></span>
                </mt-cell>
                <mt-cell title="是否提醒" is-link>
                     <span v-on:click="changeRemindType">{{showDateTip?showDateTip:'请选择'}}</span>
                </mt-cell>
            </div>

        </div>

        <mt-popup v-model="relationPopup" position="bottom">
            <div class="bar bar-nav">
                <button class="button pull-right" v-on:click="affirmRelationName">确定</button>
                <button class="button pull-left" v-on:click="relationPopup = false">取消</button>
                <h1 class="title">与我的关系</h1>
            </div>
            <mt-picker :slots="relationList" @change="onRelationChange"></mt-picker>
        </mt-popup>


        <mt-popup v-model="dateNamePopup" position="bottom">
            <div class="bar bar-nav">
                <button class="button pull-right" v-on:click="affirmFestivalName" >完成</button>
                <button class="button pull-left" v-on:click="dateNamePopup = false">取消</button>
                <h1 class="title">选择纪念日</h1>
            </div>
            <mt-picker :slots="dateNameList" @change="onNameChange"></mt-picker>
        </mt-popup>
        
        <mt-popup v-model="dateTipPopup" position="bottom">
            <div class="bar bar-nav">
                <button class="button pull-right"></button>
                <!-- <button class="button pull-left" >取消</button> -->
                <h1 class="title">设置提醒</h1>
            </div>
            <mt-picker :slots="dateTipList" @change="dateTipChange"></mt-picker>
        </mt-popup>

    </div>

    </div>
</template>
<script>
export default {
    name: 'app',
    data() {
        return {
            dateTipPopup:false,
            relationPopup:false,
            dateNamePopup:false,
            radioList:[ {label: '我的纪念日',value: '1'},{label: '家人的纪念日',value: '2'}],
            relationList:[{
                values: ['丈夫','妻子','父亲','母亲','岳父','岳母','女儿','儿子','哥哥','弟弟','姐姐','妹妹','爷爷','奶奶','外公','外婆'],
            }],
            dateNameList:[{
                values: ['生日','结婚纪念日','入职纪念日','大学毕业周年','自定义名称'],
            }],
            dateTipList:[{
                values: ['提前一天','提前三天','提前一周','不提醒'],
            }],
            showDateTip:'',
            postParam:{
                festivalName:'',
                festivalDate:new Date().format('yyyy-MM-dd'),
                festivalAttribute:'1',
                relation:'',
                remindType:''
            },
            copyParam:{
                festivalName:'',
                festivalDate:new Date().format('yyyy-MM-dd'),
                festivalAttribute:'1',
                relation:'',
                remindType:''
            },
            avtivePicker:null,
            isEdit:false,
        }
    },
    computed: {
        setdateTip:{
            // getter
            get: function () {
                return this.postParam.remindType
            },
            // setter
            set: function (newValue) {
                if(newValue == '提前一天'){
                    this.postParam.remindType ='1'
                }else if(newValue == '提前三天'){
                    this.postParam.remindType ='2'
                }else if(newValue == '提前一周'){
                    this.postParam.remindType ='3'
                }else if(newValue == '不提醒'){
                    this.postParam.remindType ='0'
                }
            }
        },
        isAndroid() {
            return this.$utils.device.android
        }
    },
    created() {
        this.init();
        // this.getData();
    },
    methods: {
        getTime(str) {
            str = str.replace(/\s/, '-').replace(/\:/g, '-')
            let arr = str.split('-')
            for (let i = 0; i < arr.length; i++) {
                arr[i] = Number(arr[i])
                if (i === 1) {
                arr[i] = arr[i] - 1
                }
            }
            return new Date(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5])    
        },
        init() {
            // 是否编辑
            if(this.$route.params.id){
                this.isEdit = true;
                console.log(parseInt(this.$route.params.id))
                this.$utils.ajax({
                    // baseURL:'http://192.168.0.172:82/api',
                    url:'/system/userFestival/app/v1/queryUserFestivalDetail'+'?id='+this.$route.params.id,
                    method:'get',
                    // data:{id:parseInt(this.$route.params.id) },
                    success:(sucData)=>{
                        if(sucData.httpCode == 200){
                            this.postParam = sucData.data;
                            if(this.postParam.remindType == '1'){
                                this.showDateTip ='提前一天'
                            }else if(this.postParam.remindType == '2'){
                                this.showDateTip ='提前三天'
                            }else if(this.postParam.remindType == '3'){
                                this.showDateTip ='提前一周'
                            }else if(this.postParam.remindType == '0'){
                                this.showDateTip ='不提醒'
                            }
                            this.postParam.festivalDate = this.getTime(this.postParam.festivalDate);
                            console.log(this.postParam)
                        }else{
                            this.$toast({message: sucData.msg,position:'bottom'});
                        }
                    },
                    error:(errData)=>{
                        console.log(errData)
                    }
                })
            }


        },
        toDateList(){
            this.$router.push({name: 'dateList'});
        },
        selDate() {
            this.$refs.picker.open();
        },
        onNameChange(picker,value){//
            this.copyParam.festivalName = value[0];
            if(value[0] == '自定义名称'){
                this.copyParam.festivalName = '';
                this.$messagebox.prompt('自定义名称','提示',{inputPlaceholder: '最多12个字'}).then(({ value, action }) => {
                    this.dateNamePopup=false;
                    this.copyParam.festivalName = value;
                    this.postParam.festivalName = JSON.parse(JSON.stringify(this.copyParam.festivalName));
                });
            }
            this.avtivePicker = picker;
        },
        affirmFestivalName(){
            this.postParam.festivalName = JSON.parse(JSON.stringify(this.copyParam.festivalName));
            this.dateNamePopup = false;
            
        },
        changeName() {
            // console.log(1123)
            this.avtivePicker.setSlotValue(0, '生日');
            this.dateNamePopup = true;
        },

        onRelationChange(picker,value){
            this.copyParam.relation = value[0];
            
        },
        affirmRelationName(){
            this.postParam.relation = JSON.parse(JSON.stringify(this.copyParam.relation));
            this.relationPopup = false;

        },

        changeRelation() {
            // console.log(1123)
            this.relationPopup = true;
        },
        changeRemindType(){
            this.dateTipPopup = true;
        },
        dateTipChange(picker,value){
            this.setdateTip = value[0];
            this.showDateTip = value[0];
        },

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
            
        },
        save(){
            console.log(this.postParam)
            if( typeof(this.postParam.festivalDate) != "string" ) this.postParam.festivalDate = this.postParam.festivalDate.format('yyyy-MM-dd');
            if(this.postParam.festivalName == ""){this.$toast({message: '请选择纪念日名称',position:'bottom'}); return };
            if(this.postParam.festivalName.length>12){this.$toast({message: '自定义名称最多12个字',position:'bottom'}); return };
            if(this.postParam.relation == "" && this.postParam.festivalAttribute == '2'){this.$toast({message: '请选择我与家人的关系',position:'bottom'}); return };
            console.log(this.postParam)
            
            this.$utils.ajax({
                // baseURL:'http://192.168.0.172:82/api',
                url:'/system/userFestival/app/v1/addUserFestival',
                method:'post',
                data:this.postParam,
                success:(sucData)=>{
                    if(sucData.httpCode == 200){
                        this.$toast({
                            message: '操作成功',
                            position:'bottom'
                        });
                        this.$router.push({name: 'dateList'});
                    }else{
                        this.$toast({message: sucData.msg,position:'bottom'});
                    }
                },
                error:(errData)=>{
                     console.log(errData)
                }
            })
        },
        saveEdit(){
            if( typeof(this.postParam.festivalDate) != "string" ) this.postParam.festivalDate = this.postParam.festivalDate.format('yyyy-MM-dd')
            if(this.postParam.festivalName == ""){this.$toast({message: '请选择纪念日名称',position:'bottom'}); return }
            if(this.postParam.festivalName.length>12){this.$toast({message: '自定义名称最多12个字',position:'bottom'}); return }
            if(this.postParam.relation == "" && this.postParam.festivalAttribute == '2'){this.$toast({message: '请选择我与家人的关系',position:'bottom'}); return };
            console.log(this.postParam)
            this.$utils.ajax({
                // baseURL:'http://192.168.0.172:82/api',
                url:'/system/userFestival/app/v1/updateUserFestival',
                method:'post',
                data:this.postParam,
                success:(sucData)=>{
                    if(sucData.httpCode == 200){
                        this.$toast({
                            message: '操作成功',
                            position:'bottom'
                        });
                        this.$router.push({name: 'dateList'});
                    }else{
                        this.$toast({message: sucData.msg,position:'bottom'});
                    }
                
                },
                error:(errData)=>{
                     console.log(errData)
                }
            })
        },
        delTip(){
            this.$messagebox({
                title: '提示',
                message: '确认删除此纪念日?',
                showCancelButton: true
            }).then(action => {
                if (action == 'confirm') { 
                    this.$utils.ajax({
                        // baseURL:'http://192.168.0.172:82/api',
                        url:'/system/userFestival/app/v1/deleteById'+'?id='+this.$route.params.id,
                        method:'get',
                        // data:this.postParam,
                        success:(sucData)=>{
                            if(sucData.httpCode == 200){
                                this.$toast({message: '操作成功',position:'bottom'});
                                setTimeout(() =>{
                                    this.$router.push({name: 'dateList'});
                                },300)
                                
                            }else{
                                this.$toast({message: sucData.msg,position:'bottom'});
                            }
                        },
                        error:(errData)=>{
                            console.log(errData)
                        }
                    })
                }
            });
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
        .radioList{
            margin-bottom: 30px;
        }
        .is-right button .mint-button-text {
            font-size: 17px;
        }
    }
    .mint-popup {
        width: 100%;
    }
    
</style>