<template>
    <div class="total-quota-trend">
        <div class="amount-card">
            <div class="amount-card-top">
                <div class="card-title">趋势图</div>
                <div class="text">
                    <p>总使用额度</p>
                    <p>¥{{total}} <span style="font-size:12px">元</span> </p>
                </div>
            </div>
            <div class="amount-card-bottom">
                <v-chart
                ref="demo"
                :data="data"
                :width="width"
                >
                    <v-scale x field="month" />
                    <v-scale y field="value" />
                    <v-bar series-field="name" :adjust="{
                        type: 'dodge',
                        marginRatio:0.5 // 设置分组间柱子的间距
                    }" />

                    <v-tooltip show-value-in-legend />
                </v-chart>
            </div>
        </div>
    </div>
</template>
<script>
import VChart from '../commonComponents/vChart/v-chart.vue'
import VLine from '../commonComponents/vChart/v-line.vue'
import VArea from '../commonComponents/vChart/v-area.vue'
import VTooltip from '../commonComponents/vChart/v-tooltip.vue'
import VLegend from '../commonComponents/vChart/v-legend.vue'
import VBar from '../commonComponents/vChart/v-bar.vue'
import VPie from '../commonComponents/vChart/v-pie.vue'
import VGuide from '../commonComponents/vChart/v-guide.vue'
import VScale from '../commonComponents/vChart/v-scale.vue'
import bus from '../utils/bus'
export default {
    components: {
        VChart,
        VLine,
        VArea,
        VTooltip,
        VLegend,
        VBar,
        VPie,
        VGuide,
        VScale
    },
    name: 'totalQuotaTrend',
    data() {
        return {
            width:0,
            data: [
                { name:'London', month: 'Jan.', value: 0 }
            ],
            total:0,
            year:sessionStorage.getItem('approveYearMonthDate') ? sessionStorage.getItem('approveYearMonthDate') : new Date().getFullYear()
        }
    },
    created(){
        this.getData()
    },
    mounted(){
        // this.$refs.demo.repaint()
        this.width = document.getElementsByClassName('amount-card-bottom')[0].clientWidth
        bus.$off('years')
        bus.$on('years', (_year) => {
            console.log(this.$refs)
            this.year = _year
            this.totle = 0
            this.data = []
            this.getData()
        })
        bus.$emit('changetitle','额度趋势')
        // this.getData()
    },
    methods:{
        getData() {
            this.$utils.ajax({
                // baseURL:"http://192.168.0.251/api",
                url: '/allocation/comMonthlyHistory/pc/v1/getHistoryByYear',
                data: {
                    'comCode':window.userInfo.companyId,
                    dateYear:this.year
                },
                success: (res) => {
                    if (res.statusCode === 200) {
                        this.data=[]
                        _.each(res.data, (item) => {
                            this.data.push({
                                    name: '出差',
                                    month: (new Date(item.createTime).getMonth()+1)+'月份',
                                    value: item.ccUseQuota.toFixed(2)
                                })
                            this.data.push({
                                    name: '招待',
                                    month: (new Date(item.createTime).getMonth()+1)+'月份',
                                    value: item.zdUseQuota.toFixed(2)
                                })
                            this.data.push({
                                    name: '经营',
                                    month: (new Date(item.createTime).getMonth()+1)+'月份',
                                    value: item.jyUseQuota.toFixed(2)
                                })
                            this.data.push({
                                    name: '福利',
                                    month: (new Date(item.createTime).getMonth()+1)+'月份',
                                    value: item.flUseQuota.toFixed(2)
                                })
                            this.data.push({
                                    name: '通讯',
                                    month: (new Date(item.createTime).getMonth()+1)+'月份',
                                    value: item.txUseQuota.toFixed(2)
                                })
                            this.total = this.total + item.ccUseQuota + item.zdUseQuota+ item.jyUseQuota + item.flUseQuota + item.txUseQuota
                            // console.log(this.data)
                        })
                    } else {
                        this.$toast('出错了')
                    }
                },
                error: () => {
                    this.$toast('出错了')
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.total-quota-trend{
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
}
</style>