<template>
    <div>
        <div class="page-demo">
            <mt-header title="工资表">
                <mt-button icon="back" slot="left" v-on:click="exit"></mt-button>
            </mt-header>
            <!-- <div class="mint-tabbar button-wrapper">
                <router-link to="test">
                    <mt-button size="large">进入测试页面</mt-button>
                </router-link>
            </div> -->
            <div class="content">
                <transition name="fade">
                    <div class="showBig" v-show="bigShow" v-on:click="bigShow=false">
                        <div class="box">
                            <table class="title">
                                <thead>
                                    <tr>
                                        <th v-for="item in columns" v-bind:key="item.column"><div class="cel2">{{item.columnName}}</div></th>
                                    </tr>
                                </thead>
                            </table>
                            <div  class="dataItem">
                                <table>
                                    <tbody>
                                    <tr>
                                        <td v-for="Citem in columns" v-bind:key="Citem.field"><div class="cel2">{{activeItem[Citem.column]}}</div></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </transition>
                    <div class="tablebox">
                        <table class="title">
                            <thead>
                                <tr>
                                    <th v-for="item in columns" v-bind:key="item.column"><div class="cel1">{{item.columnName}}</div></th>
                                </tr>
                            </thead>
                        </table>
                    <div class="container">
                    <mt-loadmore :top-method="refresh" @translate-change="translateChange" @top-status-change="handleTopChange" :bottom-method="loadMore" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="false">
                        <table>
                            <tbody>
                                <tr v-for="item in list" v-bind:key="item.id" v-on:click="setActive(item)">
                                    <td v-for="Citem in columns" v-bind:key="Citem.field"><div class="cel1">{{item[Citem.column]}}</div></td>
                                </tr>
                            </tbody>
                        </table>
                    <div slot="top" class="mint-loadmore-top">
                        <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span>
                        <span v-show="topStatus !== 'loading'">{{topStatus === 'drop'?"可以松开了...":"下拉刷新"}}</span>
                        <span v-show="topStatus === 'loading'">
                            <mt-spinner type="snake" :size="20"></mt-spinner>
                        </span>
                    </div>
                    <div slot="bottom" class="mint-loadmore-bottom">
                        <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
                        <span v-show="bottomStatus !== 'loading'">{{bottomStatus === 'drop'?"可以松开了...":"上拉加载更多"}}</span>
                        <span v-show="bottomStatus === 'loading'">
                        <mt-spinner type="snake" :size="20"></mt-spinner>
                        </span>
                    </div>
                </mt-loadmore>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'demo',
    data() {
        return {
            title: '你好伯渡22！',
            data:'',
            activeItem:'',
            bigShow:false,
            list: [],
            allLoaded: false,
            bottomStatus: '',
            topStatus: '',
            translate: 0,
            moveTranslate: 0,
            columns:'',
            row: 20,
            pageNum: 1,
            orderId:''
        }
    },
    mounted() {
        // this.batch = this.$route.query.currentrecord_batch
        this.orderId = this.$route.query.ordersId
        // console.log(this.$route.query.code)
        this.loadMore()
    },
    methods:{
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
        refresh() {
            this.pageNum = 1
            this.loadMore(true)
        },
        loadMore(isRefresh) {
            this.$utils.ajax({
                // baseURL:"http://192.168.0.251/api",
                url: '/allocation/salaryOrder/h5/v1/salaryOneDetailList',
                data: {
                    'page':this.pageNum,
                    'rows': this.row,
                    'ordersId':  this.orderId
                },
                success: (res) => {
                    if (res.httpCode === 200) {
                        this.columns = res.titiles
                        if (isRefresh) {
                        this.list = res.data.list
                        this.$refs.loadmore.onTopLoaded()
                        } else {
                        this.list = this.list.concat(res.data.list)
                        }
                        this.allLoaded = this.list.length >= res.data.total
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
        setActive(item){
            this.activeItem = item
            this.bigShow = true
        }
    }
}
</script>
<style lang="less" scoped>
    .container{
        overflow: hidden;
    }
    .tablebox{
        // border: 1px solid yellow;
        height: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        position: relative;
    }
    .title{
        thead{
            tr{
                th{
                    // border: 1px solid red;
                    background: #BA8833;
                    >div{
                        color: #fff;
                        font-size: 14px;
                        font-weight: 100;
                        word-break: break-word;
                        text-align: center;
                        // width: 80px;
                        padding: 13px 10px;
                    }
                }
            }
        }
    }
    .container{
        // border: 1px solid black;
        position:absolute;
        top: 45px;
        bottom: 0px;
        overflow-y: auto;
        overflow-x: hidden;
        tbody{
            tr{
                background: #FFF;
                td{
                    border-bottom: 1px solid #EFF1F0;
                    >div{
                        font-size: 12px;
                        color: #ACACAC;
                        word-break: break-word;
                        text-align: center;
                        // width: 80px;
                        padding: 13px 10px;
                    }
                }
            }
        }
    }
    .cel1{width:100px}
    .cel2{width:65px}
    .cel3{width:100px}
    .cel4{width:100px}
    .cel5{width:100px}
    .cel6{width:100px}
    .cel7{width:100px}
    .cel8{width:100px}
    .cel9{width:100px}
    .cel10{width:100px}
    .cel11{width:100px}
    .cel12{width:100px}
    .cel13{width:100px}
    .cel14{width:155px}
    .cel15{width:105px}

    .showBig{
        z-index: 99;
        // border:1px solid red;
        background: rgba(255, 255, 255, 0.8);
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        overflow-x: auto;
        .box{
            // border: 1px solid red;
            // width: 1837px;
            margin: 220px 0px 0 0px;
        }
        .title{
            thead{
                tr{
                    th{
                        // border: 1px solid red;
                        background: #BA8833;
                        >div{
                            color: #fff;
                            font-size: 20px;
                            font-weight: 100;
                            word-break: break-word;
                            text-align: center;
                            // width: 80px;
                            padding: 13px 10px;
                        }
                    }
                }
            }
        }
        .dataItem{
            tbody{
                tr{
                    background: #FFF;
                    td{
                        border-bottom: 1px solid #EFF1F0;
                        >div{
                            font-size: 18px;
                            color: #666;
                            word-break: break-word;
                            text-align: center;
                            // width: 80px;
                            padding: 13px 10px;
                        }
                    }
                }
            }
        }
        .cel1{width:300px}
        .cel2{width:150px}
        .cel3{width:160px}
        .cel4{width:125px}
        .cel5{width:125px}
        .cel6{width:125px}
        .cel7{width:125px}
        .cel8{width:125px}
        .cel9{width:125px}
        .cel10{width:125px}
        .cel11{width:125px}
        .cel12{width:125px}
        .cel13{width:125px}
        .cel14{width:200px}
        .cel15{width:150px}
    }
</style>