<template>
    <div class="myWelfare">
        <mt-header title="祝福">
            <mt-button icon="back" slot="left" v-on:click="exit">返回</mt-button>
            <mt-button slot="right" v-on:click="toDateList"><img src="../assets/images/loveDate.png" style="position: relative;width: 24px;top: 3px;"></mt-button>
        </mt-header>

        <div class="content" ref="wrapper">
            <mt-loadmore :top-method="refresh" @translate-change="translateChange" @top-status-change="handleTopChange" :bottom-method="loadMore" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="false">
                <div class="list">
                    <div class="item" v-for="item in list" @click = "toWeb(item)">
                        <div class="left">
                            <div class="logo"><img v-bind:src=item.companyLogo :onerror="defaultImg" alt=""></div>
                        </div>
                        <div class="right">
                            <div class="title">
                                <span class="name">{{item.companyName}}</span>
                                <span class="date">{{item.dispatchTime}}</span>
                            </div>
                            <div class="text">{{item.wishes}}</div>
                            <div class="redPack" v-if="item.type == '1'">红包金额：<span>{{item.amount}}元</span></div>
                            <div class="redPack" v-if="item.type == '2'">红包金额：<span>{{item.amount}}积分</span></div>
                            <div class="souce" v-if="item.type == '3'"><img src="../assets/images/souceBar.png" alt=""></div>
                            <div class="img" v-if="item.type == '1'||item.type == '2'"><img v-bind:src='item.redPacketThumbnail' alt=""></div>
                            <div class="img" v-if="item.type == '3'"><img v-bind:src='item.cardThumbnail' alt=""></div>
                        </div>
                    </div>
                </div>
            <div slot="top" class="mint-loadmore-top">
                <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span>
                <span v-show="topStatus !== 'loading'">{{topStatus === 'drop'?"放开人家啦..":"下拉刷新"}}</span>
                <span v-show="topStatus === 'loading'">
                    <mt-spinner type="snake" :size="20"></mt-spinner>
                </span>
            </div>
            <div slot="bottom" class="mint-loadmore-bottom">
                <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
                <span v-show="bottomStatus !== 'loading'">{{bottomStatus === 'drop'?"放开人家啦..":"上拉加载更多"}}</span>
                <span v-show="bottomStatus === 'loading'">
                <mt-spinner type="snake" :size="20"></mt-spinner>
                </span>
            </div>
            </mt-loadmore>
            <span class="no-data-tips" v-if="noData"></span>
        </div>

    </div>
</template>
<script>
export default {
    name: 'app',
    data() {
        return {
            list: [],
            allLoaded: false,
            bottomStatus: '',
            topStatus: '',
            translate: 0,
            moveTranslate: 0,
            row: 5,
            pageNum: 1,
            defaultImg: 'this.src="' + require('../assets/images/default.png') + '"',
            topPText:"下拉刷新",
            topDText:"放开人家啦",
            bottomPText:"上拉加载更多"
        }
    },
    computed: {
        noData() {
            return this.list.length === 0 && this.allLoaded
        }
    },
    created() {

    },
    computed: {
        isAndroid() {
            return this.$utils.device.android
        }
    },
    methods: {
        handleBottomChange(status) {
            this.bottomStatus = status
        },
        handleTopChange(status) {
            this.moveTranslate = 1
            this.topStatus = status
        },
        translateChange(translate) {
            const translateNum = +translate
            this.translate = translateNum.toFixed(2)
            this.moveTranslate = (1 + translateNum / 70).toFixed(2)
        },
        loadMore(isRefresh) {
            this.$utils.ajax({
                    url: '/welfare/welfareDispatchInfo/app/v1/queryUserWelfarePage',
                    data: {
                    row: this.row,
                    pageNum: this.pageNum
                },
                success: (res) => {
                if (res.httpCode === '200') {
                    if (isRefresh) {
                    this.list = res.data.list
                    this.$refs.loadmore.onTopLoaded()
                    } else {
                    this.list = this.list.concat(res.data.list)
                    }
                    this.allLoaded = this.list.length >= res.data.total;
                    if (this.pageNum !== 1) {
                    this.$refs.loadmore.onBottomLoaded()
                    }
                    this.pageNum = this.pageNum + 1
                } else {
                    this.$toast('出错了')
                    this.allLoaded = true
                }
                },
                error: () => {
                this.$toast('出错了')
                this.allLoaded = true
                }
            })
        },
        refresh() {
            this.pageNum = 1
            this.loadMore(true)
        },
        toDateList() {
            this.$router.push({name: 'dateList'});
        },
        toWeb(item){
            console.log(item)
            switch(item.type)
            {
                case '1':
                    this.$router.push({name: 'redEnvelope',params:{detailId:item.detailId}});
                    break;
                case '2':
                    this.$router.push({name: 'redEnvelope',params:{detailId:item.detailId}});
                    break;
                case '3':
                    this.$router.push({name: 'greetinCard',params:{detailId:item.detailId}});
                    break; 
                default:
                    break;
            }
            
        }
    },
    mounted() {
        this.loadMore()
    }
}
</script>
<style lang="less" >
    *{
        box-sizing:border-box;
    }
    .myWelfare{
        .content{
            .list{
                .item{
                    display: table;
                    width: 100%;
                    background: #fff;
                    margin-bottom: 1px;
                    >div{
                        display: table-cell;
                    }
                    .left{
                        width: 20%;
                        padding-top: 10px;
                        .logo{
                            margin-left: 10px;
                            width: 45px;
                            border-radius: 100%;
                            text-align: center;
                            height: 45px;
                            border: 1px solid #b58504;
                            background: #fff;
                            overflow: hidden;
                            background: url('../assets/images/default.png');
                            background-size: 100%;
                            img{
                                width: 100%;
                                min-height: 100%;
                            }
                        }
                    }
                    .right{
                        width: 80%;
                        padding-left: 10px;
                        vertical-align: top;
                        padding-top: 10px;
                        .title{
                            margin-bottom:10px;
                            .date{
                                float: right;
                                margin-right: 10px;
                                font-size: 13px;
                                color: #9e9e9e;
                                margin-top: 3px;
                            }
                        }
                        .text{
                            padding-right: 10px;
                            font-size: 14px;
                            color: #9e9e9e;
                            line-height: 16px;
                            margin-bottom: 5px;
                        }
                        .redPack{
                            color: #9e9e9e;
                            font-size: 14px;
                            margin-bottom: 5px;
                            span{
                                     color: #f19218;
                            }
                        }
                        .souce{
                            img{
                                width: 45%;
                            }
                        }
                        .img{
                            img{
                                width: 50%;
                                margin-bottom: 14px;
                            }
                        }
                    }
                }
            }
        }
    }
    
</style>