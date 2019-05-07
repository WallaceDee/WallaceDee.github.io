<template>
    <div>
        <div class="amount-detail">
            <mt-header :title="title">
                <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
                <mt-button slot="right" @click="openPicker">{{yearMonth}}年<img class="date-icon" src="../assets/images/dateicon.png"></mt-button>
            </mt-header>
            <mt-navbar v-model="selected">
                <mt-tab-item id="1">
                    <router-link replace to="/amountDetail/allAmount">
                        <div class="mint-tab-item-label">额度总览</div>
                    </router-link>
                </mt-tab-item>
                <mt-tab-item id="2">
                    <router-link replace to="/amountDetail/totalQuotaTrend">
                        <div class="mint-tab-item-label">总额度趋势</div>
                    </router-link>
                </mt-tab-item>
                <mt-tab-item id="3">
                    <router-link replace to="/amountDetail/classificationQuotas">
                        <div class="mint-tab-item-label">分类额度趋势</div>
                    </router-link>
                </mt-tab-item>
            </mt-navbar>
            <div class="content">
                <router-view></router-view>
            </div>
        </div>
        <mt-datetime-picker v-model="appDefaultTime" class="date-yyyy" ref="appPicker" type="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="approveHandleConfirm(appDefaultTime)">
        </mt-datetime-picker>
    </div>
</template>
<script>
import bus from '../utils/bus'
export default {
    name: 'amountDetail',
    data() {
        return {
            selected:'1',
            appDefaultTime: new Date().format('yyyy-MM-dd'),
            yearMonth:new Date().getFullYear(),
            title:''
        }
    },
    methods:{
        approveHandleConfirm(data){ //顶部日期查询
            let date = new Date(data)
            this.yearMonth = date.getFullYear()
            sessionStorage.setItem('approveYearMonthDate',this.yearMonth)
            bus.$emit('years',this.yearMonth)
        },
        openPicker() {
            this.$refs.appPicker.open()
        }
    },
    mounted(){
        if(this.$route.path === '/amountDetail/allAmount'){
            this.selected = '1'
        }else if(this.$route.path === '/amountDetail/totalQuotaTrend'){
            this.selected = '2'
        }else{
            this.selected = '3'
        }
    },
    created(){
        bus.$off('changetitle')
        bus.$on('changetitle', (title) => {
            this.title = title
        })
    }
}
</script>
<style lang="less">
.amount-detail{
    .date-icon{
        width: 12px;
        height: 12px;
        margin-left: 6px;
    }
    .mint-header ~ .content{
        top: 86px;
    }
    .mint-navbar .mint-tab-item{
        padding: 14px 0;
    }
    .mint-navbar .mint-tab-item .mint-tab-item-label{
        color: #303030 !important;
        font-size: 14px;
    }
    .mint-navbar .mint-tab-item.is-selected .mint-tab-item-label{
        color: #BA8833 !important;
    }
    .mint-navbar .mint-tab-item.is-selected:before{
        width: 100%;
        left: 0;
    }
}
    .date-yyyy{
        .picker-slot{
            &:nth-child(2){
                display: none;
            }
            &:nth-child(3){
                display: none;
            }
        }
    }
</style>