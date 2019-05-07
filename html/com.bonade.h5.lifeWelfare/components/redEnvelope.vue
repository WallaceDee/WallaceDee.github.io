<template>
    <div class="redEnvelope">

        <div class="content">
            <div class="header" >
                <img v-bind:src='pageInfo.redPacketImage' >
                <span class="left" v-if="isApp && (!urlParam)" v-on:click="goBack">关闭</span>
                <span class="left" v-if="isApp && urlParam" v-on:click="exit">关闭</span>
                <span class="right" v-if="isApp" v-on:click="share">分享</span>
                <span class="Logo">
                    <img v-bind:src=pageInfo.companyLogo :onerror="defaultImg" alt="">
                </span>
            </div>
            <div class="text">
                <div class="title">{{pageInfo.companyName}}</div>
                <div class="textNote">亲爱的{{pageInfo.userName}}：
                    <br>{{pageInfo.wishes}}</div>
                <div class="count">
                    {{pageInfo.amount}} 
                    <span v-if="pageInfo.type == '1'">元</span> 
                    <span v-if="pageInfo.type == '2'">积分</span> 
                </div>
                <div class="tip" v-if="!isApp" >已存入薪起程个人电子钱包</div>
                <div class="tip" v-if="pageInfo.type == '2' && isApp" v-on:click="toAcountDetail(2)">已存入薪起程个人电子钱包，点击查看明细</div>
                <div class="tip" v-if="pageInfo.type == '1' && isApp" v-on:click="toAcountDetail(1)">已存入薪起程个人电子钱包，点击查看明细</div>
            </div>
            <div class="donwLoad" v-if="!isApp" v-on:click="toDnow">
                <img src="../assets/images/u45558.png" alt="">
                <div>薪起程APP</div>
                <p>点击即可下载薪起程APP</p>
            </div>
            <div class="bottom"  v-if=" isApp ">
                <div class="shopTitle">
                    <div>收了红包赶紧买点东西犒赏自己吧~</div> <span v-on:click="toGoodsMore()">更多特价<i class="icon-circle-right"></i></span>
                </div>
                <div class="goodsBox">
                    <div class="goodsItem" v-on:click="toGoodsDatail(goodsList.resultList[0])">
                        <div v-if="  goodsList.resultList[0] ">
                            <div class="img" >
                                <img v-bind:src="'http://img13.360buyimg.com/n0/'+goodsList.resultList[0].imageUrl" alt="">
                            </div>
                            <div class="goodsText">
                                <div class="goodsTitle">{{goodsList.resultList[0].wareName}}</div>
                                <div class="goodsCount"><span>{{goodsList.resultList[0].menuName}}</span>￥{{goodsList.resultList[0].sellPrice}}</div>
                            </div>                            
                        </div>

                    </div>
                    <div class="goodsItem" v-on:click="toGoodsDatail(goodsList.resultList[1])">
                        <div v-if="  goodsList.resultList[1] ">
                            <div class="img">
                                <img v-bind:src="'http://img13.360buyimg.com/n0/'+goodsList.resultList[1].imageUrl" alt="">
                            </div>
                            <div class="goodsText">
                                <div class="goodsTitle">{{goodsList.resultList[1].wareName}}</div>
                                <div class="goodsCount"><span>{{goodsList.resultList[1].menuName}}</span>￥{{goodsList.resultList[1].sellPrice}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="goodsItem" v-on:click="toGoodsDatail(goodsList.resultList[2])">
                        <div v-if="  goodsList.resultList[2] ">
                            <div class="img">
                                <img v-bind:src="'http://img13.360buyimg.com/n0/'+goodsList.resultList[2].imageUrl" alt="">
                            </div>
                            <div class="goodsText">
                                <div class="goodsTitle">{{goodsList.resultList[2].wareName}}</div>
                                <div class="goodsCount"><span>{{goodsList.resultList[2].menuName}}</span>￥{{goodsList.resultList[2].sellPrice}}</div>
                            </div>
                        </div>

                    </div>
                </div>
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
            goodsList:{'resultList':[]},
            pageInfo:'',
            urlParam:null,
            isApp:true,
            defaultImg: 'this.src="' + require('../assets/images/default.png') + '"'
        }
    },
    computed: {
        isAndroid() {
            return this.$utils.device.android
        }
    },
    created() {
        this.getData();
        this.getGoods();
        try {
           console.log(XqcH5JS)
        }
        catch(err) {
            this.isApp = false;
        }
    },
    methods: {
        getData() {
            this.urlParam = this.$utils.getParameter("detailId");
            console.log(this.urlParam);
            console.log(this.$route.params.detailId);
            this.$utils.ajax({
                // baseURL:'http://192.168.1.182:8113',
                url:'/welfare/welfareDispatchInfo/app/v1/queryUserWelfareDetail'+'?detailId='+(this.$route.params.detailId?this.$route.params.detailId:this.urlParam),
                method:'get',
                // data:this.postParam,
                success:(sucData)=>{
                    if(sucData.httpCode == 200){
                        console.log(sucData)
                        this.pageInfo = sucData.data;
                    }else{
                        this.$toast({message: sucData.msg,position:'bottom'});
                    }
                },
                error:(errData)=>{
                     console.log(errData)
                }
            })
        },
        getGoods() {
            this.$utils.ajax({
                // baseURL:'http://192.168.0.251',
                url:'/mall/mallIndex/app/v1/indexActivity',
                method:'POST',
                data:{'userCode':window.userInfo.userId,'row':'3'},
                success:(sucData)=>{
                    if(sucData.httpCode == 200){
                        console.log(sucData)
                        if(sucData.data){
                            this.goodsList = sucData.data;
                            console.log('sdf',this.goodsList)
                        }
                    }else{
                        this.$toast({message: sucData.msg,position:'bottom'});
                    }
                },
                error:(errData)=>{
                     console.log(errData)
                }
            })
        },
        toAcountDetail(type){
            if(type == 2) this.$app.openOriginalTap(//积分明细
                'com.bonade.xxp.ui.user.integral.IntegralDetailActivity',
                {'ACCOUNT_NUMBER':this.pageInfo.acctCode},

                'XQCPointsAccountDetailViewController',
                {'acctCode':this.pageInfo.acctCode})

            if(type == 1) this.$app.openOriginalTap(//钱包明细

                'com.bonade.xxp.ui.user.walletnew.paymanager.transactrecord.TransactRecordActivity',
                {'TransactRecordActivity.BUNDLE_PARAM_WALLETACCOUNTID':this.pageInfo.accountId},

                'XQCTransactionHistoryViewController',
                {'accountIdStr':this.pageInfo.accountId})

        },
        share(){
            
            this.$app.sharePage(["WEIXIN","WEIXIN_CIRCLE"],
                                '薪起程红包',
                                this.pageInfo.wishes,
                                this.$app.getCurrentDomain().split('api/')[0] +'/xqc-h5/com.bonade.h5.lifeWelfare/index.html#/redEnvelope?detailId='+(this.$route.params.detailId?this.$route.params.detailId:this.urlParam),
                                this.pageInfo.thumbnailImage
                                )
        },
        toDnow(){
            window.location.href='http://a.app.qq.com/o/simple.jsp?pkgname=com.bonade.xxp'
        },
        toGoodsDatail(item){
           this.$app.goToUrl(
               {
                h5Code: 'com.bonade.h5.mall',
                route: 'index.html#/main/commodityDetail/commodity/'+item.skuId,
                access: 'com.bonade.h5.mall/index.html',
                style: '0',
               }
           )
        },
        toGoodsMore(){
           this.$app.goToUrl(
               {
                h5Code: 'com.bonade.h5.mall',
                route: 'index.html#/main/specialGoods/',
                access: 'com.bonade.h5.mall/index.html',
                style: '0',
               }
           )
        }
    }
}
</script>
<style lang="less" >
    *{
        box-sizing:border-box;
    }
    .redEnvelope{
        // border: 1px solid black;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: #f5f5f5;
        .header{
            position: relative;
            // border: 1px solid red;
            // overflow: hidden;
            // height: 130px;
            img{
                width: 100%;
                height: 100%;
                pointer-events: none;
            }
            background-size:100% auto;
            .left{
                position:absolute;
                top: 10px;
                left: 10px;
                color: #fff;
                z-index: 9;    
                padding: 10px;
            }
            .right{
                position:absolute;
                top: 10px;
                right: 10px;
                color: #fff;
                z-index: 9;    
                padding: 10px;
            }
            .Logo{
                position: absolute;
                z-index: 10;
                border: 2px solid #b58504;
                width: 90px;
                height: 90px;
                left: 50%;
                margin-left: -45px;
                bottom: -40px;
                border-radius: 52px;
                text-align: center;
                overflow: hidden;
                background: url('../assets/images/default.png');
                background-size: 100%;
                img{
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    background: url('../assets/images/default.png');
                    background-size: 100%;
                }
            }
        }
        .text{
            margin-top: 63px;
            >div{
                text-align: center;

            }
            .title{
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 20px;
            }
            .textNote{
                line-height: 24px;
                font-size: 15px;
                margin-bottom: 10px;
                color: #424242;
                padding:0 18px;
            }
            .count{
                font-size: 30px;
                font-weight: bold;
                margin-bottom: 17px;
                color:#e69d1e;
                span{
                    font-size: 18px;
                    font-weight: normal;
                    color:#333;
                }
            }
            .tip{
                font-size: 13px;
                color: #909090;
            }

        }
        .bottom{
            background: #fff;
            border-top: 1px solid #ddd;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 235px;
            .shopTitle{
                overflow: hidden;
                padding-top: 10px;
                div{
                    margin-left: 10px;
                    float: left;
                    font-size: 13px;
                }
                span{
                     margin-right: 10px;
                    float: right;
                     font-size: 13px;
                }
            }
            .goodsBox{
                width: 100%;
                display: table;
                // border: 1px solid red;
                height: 191px;
                margin-top: 12px;
                .goodsItem{
                    width: 33.333333%;
                    display: table-cell;
                    // border: 1px solid green;
                    .img{
                        width: 100%;
                        text-align: center;
                        // border: 1px solid black;
                        height: 110px;
                        img{
                            width: 106px;
                            // border: 1px solid red;
                            pointer-events: none;
                        }
                    }
                    .goodsText{
                        .goodsTitle{
                            // border:1px solid black;
                            padding:5px 8px 0 8px;
                            font-size: 12px;
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 2;
                            overflow: hidden;
                            height: 39px;
                            line-height: 16px;
                        }
                        .goodsCount{
                            margin-top: 5px;
                            text-align: center;
                            font-size: 12px;
                            line-height: 20px;
                            span{
                                background: #ff6b3d;
                                color: #fff;
                                padding:1px 3px;
                                margin-right: 2px;
                            }
                            font-size: 12px;
                        }
                    }
                }
            }
        }
        .donwLoad{
            background: #fff;
            border-top: 1px solid #ddd;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 180px;
            text-align: center;
            img{
                width: 70px;
                margin-top: 16px;
            }
            div{
                margin-top: 6px;
            }
            p{
                margin-top: 18px;
                color: #929292;
            }
            
        }

    }
</style>