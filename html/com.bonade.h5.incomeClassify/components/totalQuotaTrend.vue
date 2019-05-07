<template>
    <div class="total-quota-trend">
        <div class="amount-card">
            <div class="amount-card-top">
                <div class="card-title">趋势图</div>
                <div class="text">
                    <p>总使用额度</p>
                    <p>¥{{totle}} <span style="font-size:12px">元</span></p>
                </div>
            </div>
            <div class="amount-card-bottom">
                <v-chart prevent-render ref="demo"
  @on-render="renderVChart" :width="width">
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
            data: [],
            width:500,
            totle:0,
            title:'',
            year:sessionStorage.getItem('approveYearMonthDate') ? sessionStorage.getItem('approveYearMonthDate') : new Date().getFullYear()
        }
    },
    computed:{

    },
    methods:{
        renderVChart({ chart }){
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
                                value: item.monthTotalQuota
                            })
                            this.totle += item.monthTotalQuota
                        })
                    chart.source(this.data)
                    this.data.map(function(obj) {
                    chart.guide().text({
                        position: [obj.month, obj.value],
                        content: `￥${obj.value}`,
                        style: {
                        textAlign: 'center',
                        textBaseline: 'bottom',
                        rotate: 150,
                        fill: '#ACACAC', // 文本颜色
                        fontSize: '10'
                        },
                        offsetX: -2,
                        offsetY: -5
                    })
                    })
                    chart.legend({
                        custom: true,
                        align: 'right',
                        itemWidth:10,
                        items:[{
                        name: `总额度  金额:元`,
                        marker: 'square',
                        fill: 'l(0) 0:#FFCD00 1:#FFA500',
                        stroke: 'red',
                        checked: true
                        }]
                    })
                    chart.interval().position('month*value').color('l(0) 0:#FFCD00 1:#FFA500')
                    chart.render()
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
        this.width = document.getElementsByClassName('amount-card-bottom')[0].clientWidth
        bus.$off('years')
        bus.$on('years', (_year) => {
            console.log(this.$refs)
            this.year = _year
            this.totle = 0
            this.data = []
            this.$refs.demo.rerender()
        })
        bus.$emit('changetitle','额度趋势')
    }
}
</script>
<style lang="less">
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
    // .noselect{
    //     width: 100% !important;
    // }
}
</style>