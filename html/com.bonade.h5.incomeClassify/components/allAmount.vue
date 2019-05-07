<template>
    <div class="all-amount">
        <div class="amount-card">
            <div class="amount-card-top">
                <div class="card-title">列表</div>
                <div class="text">
                    <p>总使用额度</p>
                    <p>¥{{totle}} <span style="font-size:12px">元</span></p>
                </div>
            </div>
            <div class="amount-card-bottom">
                <div class="table">
                    <div class="table-header">
                        <ul>
                            <li>月份</li>
                            <li>福利(万)</li>
                            <li>出差(万)</li>
                            <li>招待(万)</li>
                            <li>通讯(万)</li>
                            <li>经营(万)</li>
                        </ul>
                    </div>
                    <div class="table-content">
                        <ul v-for="(item,index) in data" v-bind:key="index">
                            <li>{{item.month}}</li>
                            <li>{{(parseInt(item.ccUseQuota) / 10000).toFixed(1)}}</li>
                            <li>{{(parseInt(item.zdUseQuota) / 10000).toFixed(1)}}</li>
                            <li>{{(parseInt(item.jyUseQuota) / 10000).toFixed(1)}}</li>
                            <li>{{(parseInt(item.flUseQuota) / 10000).toFixed(1)}}</li>
                            <li>{{(parseInt(item.txUseQuota) / 10000).toFixed(1)}}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import bus from '../utils/bus'
export default {
    name: 'allAmount',
    data() {
        return {
            data:[],
            totle:0,
            year:sessionStorage.getItem('approveYearMonthDate') ? sessionStorage.getItem('approveYearMonthDate') : new Date().getFullYear()
        }
    },
    methods:{
        getData(){
            this.$utils.ajax({
                // baseURL:'http://192.168.0.251/api',
                url:'allocation/comMonthlyHistory/pc/v1/getHistoryByYear',
                data:{comCode:window.userInfo.companyId,
                dateYear:this.year
                    },
                success:(res) => {
                    if (res.httpCode === 200) {
                        _.each(res.data, (item) => {
                            this.data.push({
                                month: (new Date(item.createTime).getMonth()+1)+'月',
                                ccUseQuota: item.ccUseQuota,
                                zdUseQuota: item.zdUseQuota,
                                jyUseQuota: item.jyUseQuota,
                                flUseQuota: item.flUseQuota,
                                txUseQuota: item.txUseQuota
                            })
                            this.totle += item.monthTotalQuota
                        })
                    } else {
                    this.$toast('出错了')
                    }
                },
                error:(err) => {
                    this.$toast('出错了')
                }
            })
        }
    },
    mounted(){
        this.getData()
        bus.$off('years')
        bus.$on('years', (_year) => {
            this.year = _year
            this.totle = 0
            this.data = []
            this.getData()
        })
        bus.$emit('changetitle','额度总览')
    }
}
</script>
<style lang="less" scoped>
.all-amount{
    height: 100%;
    width: 100%;
    padding: 10px;
    .amount-card{
        position: relative;
        height: 100%;
        width: 100%;
    }
    .amount-card-top{
        position: relative;
        border-radius:6px;
        height: 116px;
        background-color: #fff;
        border-bottom: 1px dashed #EFF1F0;
        &:before{
            content: '';
            position: absolute;
            left: -10px;
            bottom: -10px;
            background-color: #EFF1F0;
            height: 20px;
            width: 20px;
            z-index: 10;
            border-radius: 50%;
        }
        &:after{
            content: '';
            position: absolute;
            right: -10px;
            bottom: -10px;
            z-index: 10;
            background-color: #EFF1F0;
            height: 20px;
            width: 20px;
            border-radius: 50%;
        }
    }
    .amount-card-bottom{
        position: absolute;
        top: 117px;
        border-radius:6px;
        background-color: #fff;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .card-title{
        position: relative;
        padding: 20px 0 0 20px;
        font-weight: bold;
        &:before{
            position: absolute;
            content: '';
            width: 4px;
            height: 16px;
            left: 10px;
            bottom: 0;
            background-color: #FAD43E;
            border-radius: 2px 0;
        }
    }
    .text{
        margin-top: 12px;
        text-align: center;
        p{
            &:nth-child(1){
                font-size: 14px;
                color:rgba(48,48,48,0.6);
                margin-bottom: 8px;
            }
            &:nth-child(2){
                font-size: 20px;
                font-weight: bold;
            }
        }
    }
    ul li{
        list-style-type: none;
    }
    .table{
        position: relative;
        height: 100%;
    }
    .table-content{
        position: absolute;
        top: 59px;
        bottom: 0;
        left: 0;
        right: 0;
        overflow-y: scroll;
        ul li{
            color: #ACACAC;
        }
    }
    .table-header{
        padding-top: 6px;
    }
    ul{
        display: flex;
        font-size: 14px;
        margin-right: 10px;
        margin-left: 10px;
        align-items: center;
        border-bottom: 1px solid #EFF1F0;
        li{
            flex: 1;
            padding: 12px 0;
            text-align: center;
        }
    }
}

</style>