<template>
    <div>
        <div class="page-project">
            <mt-header :title="title">
                <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
                <mt-button slot="right" v-on:click="openSearchBar">
                    <i class="icon-search"></i>
                </mt-button>
            </mt-header>
            <search-bar v-model="searchBarVisible" v-on:keyword="doSearch" v-bind:type="'transform'"></search-bar>
            <div class="content">
                <div class="tool-bar">
                    <div>
                        <router-link :to="{name:'salary', params:{projectId:projectId}}">
                            <img src="../assets/images/icon-wage.png">
                            <p>工资结算</p>
                        </router-link>
                    </div>
                    <div>
                        <router-link :to="{name:'scan', params:{projectId:projectId}}">
                            <img src="../assets/images/icon-add.png">
                            <p>扫描加人</p>
                        </router-link>
                    </div>
                </div>
                <div class="member-list">
                    <div class="list-block media-list" ref="wrapper">
                        <mt-loadmore :top-method="refresh" @translate-change="translateChange" @top-status-change="handleTopChange" :bottom-method="loadMore" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="false">
                            <ul>
                                <li v-for="item in list" class="border-bottom item-content" v-bind:key="item.id" v-on:click="go2memberInfo(item.id)">
                                    <div class="item-media">
                                        <span style="background-image: url(./static/img/default_avatar.png)"></span>
                                    </div>
                                    <div class="item-inner">
                                        <div class="item-title-row">
                                            <div class="item-title">{{item.name}}
                                                <span v-bind:class="{'off-duty':item.duty!=='S','on-duty':!(item.duty!=='S')}"></span>
                                            </div>
                                        </div>
                                        <div class="item-subtitle">身份证号：{{item.idNo}}</div>
                                    </div>
                                    <div class="item-after">
                                        <mt-button size="small" v-on:click.native.stop="go2sign(item)">打卡</mt-button>
                                    </div>
                                </li>
                            </ul>
                            <div slot="top" class="mint-loadmore-top">
                                <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span>
                                <span v-show="topStatus === 'loading'">
                                    <mt-spinner type="snake" :size="20"></mt-spinner>
                                </span>
                            </div>
                            <div slot="bottom" class="mint-loadmore-bottom">
                                <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
                                <span v-show="bottomStatus === 'loading'">
                                    <mt-spinner type="snake" :size="20"></mt-spinner>
                                </span>
                            </div>
                        </mt-loadmore>
                        <span class="no-data-tips" v-if="noData"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'project',
    data() {
        return {
            list: [],
            allLoaded: false,
            bottomStatus: '',
            topStatus: '',
            translate: 0,
            moveTranslate: 0,
            row: 20,
            pageNum: 1,
            searchBarVisible: false,
            keyword: ''
        }
    },
    computed: {
        noData() {
            return this.list.length === 0 && this.allLoaded
        },
        title() {
            return this.$route.params.projectName
        },
        projectId() {
            return this.$route.params.projectId
        }
    },
    methods: {
        doSearch: _.debounce(function(keyword) {
            this.keyword = keyword
            this.refresh()
        }, 1000),
        openSearchBar() {
            this.searchBarVisible = true
        },
        go2memberInfo(staffId) {
            this.$router.push({ name: 'memberInfo', query: { staffId, projectId: this.projectId } })
        },
        go2sign(item) {
            this.$router.push({ name: 'sign', params: { staffId: item.id, name: item.name, idNo: item.idNo, projectId: this.projectId } })
        },
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
                url: '/sal/day/app/v1/getProjectMember',
                data: {
                    prjId: this.projectId,
                    staffName: this.keyword,
                    row: this.row,
                    pageNum: this.pageNum
                },
                success: (res) => {
                    if (res.httpCode === 200) {
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
        refresh() {
            this.pageNum = 1
            this.loadMore(true)
        }
    },
    mounted() {
        this.loadMore()
    }
}
</script>
<style lang="less" scoped>
.tool-bar {
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    div {
        width: 50%;
        position: relative;
        p {
            text-align: center;
            color: @supportColor;
        }
        img {
            width: 50px;
            display: block;
            margin: 0 auto;
        }
    }
    div:first-child:after {
        content: '';
        position: absolute;
        right: 0;
        top: 0;
        left: auto;
        bottom: auto;
        width: 1px;
        height: 100%;
        background-color: #b5b5b5;
        display: block;
        z-index: 15;
        -webkit-transform-origin: 100% 50%;
        transform-origin: 100% 50%;
    }
    @media only screen and (-webkit-min-device-pixel-ratio: 2) {
        div:first-child:after {
            -webkit-transform: scaleX(0.5);
            transform: scaleX(0.5);
        }
    }
    @media only screen and (-webkit-min-device-pixel-ratio: 3) {
        div:first-child:after {
            -webkit-transform: scaleX(0.33);
            transform: scaleX(0.33);
        }
    }
}

.member-list {
    position: absolute;
    top: 110px;
    width: 100%;
    bottom: 0;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .item-inner {
        padding-right: 0!important;
    }
    .item-after {
        padding-right: 15px;
        width: 60px;
        max-height: initial!important;
        height: 30px;
        button {
            margin: 0 auto;
        }
    }
    .item-subtitle {
        color: @grayFont;
    }
    .item-title {
        span {
            font-size: 12px;
            display: inline-block;
            vertical-align: 2px;
            margin-left: 5px;
            &.on-duty:before {
                content: '工作中';
                color: @supportColor;
            }
            &.off-duty:before {
                content: '未上班';
                color: @redFont;
            }
        }
    }
    .mint-button--default {
        height: 30px;
        padding: 0 10px;
        background-color: transparent;
        color: @supportColor;
        border: 1px solid @supportColor;
        font-size: 14px;
        box-shadow: none;
    }
}

.border-bottom:last-child:after,
.border-bottom .item-inner:after {
    display: none;
}
</style>