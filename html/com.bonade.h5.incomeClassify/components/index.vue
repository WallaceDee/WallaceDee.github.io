<template>
    <div>
        <div class="page-demo">
            <mt-header title="企业账簿">
                <mt-button icon="back" slot="left" v-on:click="exit"></mt-button>
            </mt-header>
            <div class="content">
                <div class="top-bgc"></div>
                <div class="cheart-wrap">
                    <div class="top-title">当月额度总览</div>
                    <div class="cheart">
                        <v-chart
                            :data="data"
                            :padding="[20, 'auto']"
                            :width="width"
                            >
                            <v-tooltip disabled />
                            <v-scale y :options="yOptions" />
                            <v-pie :radius="0.85" :inner-radius="0.7" series-field="name" :colors="colors" />
                            <v-legend disabled/>
                        </v-chart>
                        <div class="cheart-center" v-on:click="amountInfo">
                            <div><span>{{amountData.totalQuota}}</span>万</div>
                            <div>当前总额度</div>
                            <div>点击查看</div>
                        </div>
                    </div>
                    <div class="money-all">
                        <div class="icon">
                            <p>{{amountData.useQuota}}</p>
                            <div>
                                <img src="../assets/images/index_money.png">
                                <span>发放总额</span>
                            </div>
                        </div>
                        <div class="icon">
                            <p>{{amountData.settlementQuota}}</p>
                            <div>
                                <img src="../assets/images/index_close.png">
                                <span>结算额度</span>
                            </div>
                        </div>
                    </div>
                    <div class="gather-info">
                        <div class="info-title">收入 / 分类 / 发放</div>
                        <div class="info-tab">
                            <div>
                                <img src="../assets/images/index_icon1.png">
                                <p>{{amountData.inCome}}元</p>
                                <p>综合收入</p>
                            </div>
                            <div>
                                <img src="../assets/images/index_icon2.png">
                                <p class="col-blue">{{amountData.grant}}元</p>
                                <p>发放</p>
                            </div>
                        </div>
                        <div class="btn-info" v-on:click="toIncomeInfo">点击查看详情</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
// import { VChart, VLine, VArea, VTooltip, VLegend, VBar, VPie, VGuide, VScale } from 'vux'
import VChart from '../commonComponents/vChart/v-chart.vue'
import VLine from '../commonComponents/vChart/v-line.vue'
import VArea from '../commonComponents/vChart/v-area.vue'
import VTooltip from '../commonComponents/vChart/v-tooltip.vue'
import VLegend from '../commonComponents/vChart/v-legend.vue'
import VBar from '../commonComponents/vChart/v-bar.vue'
import VPie from '../commonComponents/vChart/v-pie.vue'
import VGuide from '../commonComponents/vChart/v-guide.vue'
import VScale from '../commonComponents/vChart/v-scale.vue'
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
    data() {
        return {
            width:document.body.clientWidth*0.94,
            yOptions: {
                formatter (val) {
                return val * 100 + '%'
                }
            },
            data:[
                { name: '当月额度总览', percent: 50, a: '1' },
                { name: '发放总额', percent: 25, a: '1' },
                { name: '结算额度', percent: 25, a: '1' }
            ],
            colors:['#DFB772','#36A1EF','#3BC858'],
            amountData:''
        }
    },
    beforecreate(){
        this.$indicator.open()
    },
    created(){
        this.$indicator.close()
    },
    methods: {
        amountInfo(){
           this.$router.push({path: '/amount'})
        },
        toIncomeInfo(){
          this.$app.openOriginalTap('com.bonade.xxp.ui.main.salary.imboss.AllListActivity', null, 'XQCConsolidatedIncomeViewController', null)
        },
        getAmountinfo(){
            this.$indicator.open()
            this.$utils.ajax({
                url:'/allocation/comMonthlyHistory/pc/v1/getBossIndexData',
                data:{'companyCode':window.userInfo.companyId},
                success:(res) => {
                    if (res.httpCode === 200) {
                       this.$indicator.close()
                       this.amountData = res.data
                        if(this.amountData.totalQuota === null || this.amountData.totalQuota < 0){
                           this.amountData.totalQuota = 0
                        }
                        if(this.amountData.settlementQuota === null || this.amountData.settlementQuota < 0){
                            this.amountData.settlementQuota = 0
                        }
                        if(this.amountData.useQuota === null || this.amountData.useQuota < 0){
                            this.amountData.useQuota = 0
                        }
                        if(this.amountData.inCome === null || this.amountData.inCome < 0){
                            this.amountData.inCome = 0
                        }
                        if(this.amountData.grant === null || this.amountData.grant < 0){
                            this.amountData.grant = 0
                        }
                        this.data = [
                            { name: '当月额度总览', percent:this.amountData.totalQuota, a: '1' },
                            { name: '发放总额', percent: this.amountData.useQuota, a: '1' },
                            { name: '结算额度', percent: this.amountData.settlementQuota, a: '1' }
                        ]
                        if(this.amountData.totalQuota === 0){
                            this.data[0].percent = 1
                            this.data[1].percent = 0
                            this.data[2].percent = 0
                        }
                        if(this.amountData.totalQuota){
                            this.amountData.totalQuota = (this.amountData.totalQuota/10000).toFixed(1)
                            let oldValue = parseFloat(this.amountData.totalQuota)
                            let newValue = parseInt(this.amountData.totalQuota)
                            if((oldValue-newValue) === 0){
                                this.amountData.totalQuota = parseInt(this.amountData.totalQuota)
                            }
                        }
                    } else {
                        this.$toast(res.msg)
                        this.$indicator.close()
                    }
                },
                error:(err) => {
                    this.$toast('出错了')
                    this.$indicator.close()
                }
            })
        }
    },
    mounted() {
        this.getAmountinfo()
    }
}
</script>
<style lang="less">
.content{
    text-align: center;
    .cheart{
        position: relative;
    }
    .cheart-center{
        line-height: 24px;
        width: 100%;
        height: 40px;
        text-align: center;
        position: absolute;
        top: 40%;
        div:nth-child(1){
            color: #D9AF67;
            font-size: 22px;
            letter-spacing: 1px;
            span{
                font-size: 30px;
            }
        }
        div:nth-child(2){
            color: #E1BC7A;
            font-size: 14px;
            letter-spacing: 1px;
        }
        div:nth-child(3){
            color: #ACACAC;
            font-size: 14px;
            letter-spacing: 1px;
        }
    }
   .top-bgc{
       height: 120px;
       background-color: #303030;
   }
   .cheart-wrap{
        background-color: #fff;
        box-shadow:0px 0px 6px 0px rgba(0,0,0,0.1);
        border-radius:8px;
        width: 94%;
        position: absolute;
        left: 3%;
        top: 22px;
        .top-title{
            width:170px;
            height:33px;
            line-height: 33px;
            background: -webkit-linear-gradient(#F1DCAB, #E8C98E , #E0BA76); /* Safari 5.1 - 6.0 */
            background: -o-linear-gradient(#F1DCAB, #E8C98E , #E0BA76); /* Opera 11.1 - 12.0 */
            background: -moz-linear-gradient(#F1DCAB, #E8C98E , #E0BA76); /* Firefox 3.6 - 15 */
            background: linear-gradient(#F1DCAB, #E8C98E , #E0BA76); /* 标准的语法（必须放在最后） */
            color: #fff;
            font-size:16px;
            border-radius:20px;
            position: relative;
            margin: 15px 0;
            margin: 0 auto;
            letter-spacing: 2px;
            margin-top: 20px;
        }
        .top-title::before{
            width: 0;
            height: 0;
            content: "";
            border-width: 8px 8px 0;
            border-style: solid;
            border-color: #E1BD7B transparent transparent;
            position: absolute;
            top: 33px;
            z-index: 9;
            left: 50%;
            transform: translateX(-8px);
        }
        .money-all{
            display: flex;
            justify-content: space-around;
            align-content: flex-start;
            width: 100%;
            .icon{
                width: 46%;
                line-height: 28px;
                p{
                    font-size:24px;
                    color: #38A4F0;
                }
                span{
                    font-size:14px;
                    color: #38A4F0;
                }
                img{
                    width: 14px;
                    height: 14px;
                    vertical-align: middle;
                }
            }
            .icon:nth-child(2){
                p,span{
                    color: #44CF60;
                }
            }
        }
        .gather-info{
            width: 94%;
            border:1px solid rgba(239,241,240,1);
            margin: 20px auto;
            position: relative;
            .info-title{
                position: absolute;
                width:130px;
                height:26px;
                line-height: 26px;
                border-radius:13px;
                border:1px solid rgba(239,241,240,1);
                left: 50%;
                transform: translateX(-65px);
                top: -13px;
                background-color: #fff;
                color:#8c8585;
                font-size: 14px;
            }
            .info-tab{
                display: flex;
                justify-content: space-around;
                align-content: flex-start;
                margin-top: 20px;
                width: 100%;
                line-height: 28px;
                margin-top: 28px;
                img{
                    width: 90%;
                }
                div{
                    border:1px solid rgba(239,241,240,1);
                    width: 46%;
                    border-radius: 6px;
                    box-shadow:0px 0px 4px 0px rgba(0,0,0,0.1);
                }
                p{
                    text-align: left;
                    text-indent: 12px;
                }
                p:nth-child(2){
                    color: #D6A95F;
                    font-size: 20px;
                }
                p:nth-child(3){
                    color: #C7C7C7;
                    font-size: 14px;
                }
                p.col-blue{
                    color: #38A4F0;
                }
            }
            .btn-info{
                color: #BA8833;
                font-size: 12px;
                height: 50px;
                line-height: 50px;
            }
        }
   }
}

</style>