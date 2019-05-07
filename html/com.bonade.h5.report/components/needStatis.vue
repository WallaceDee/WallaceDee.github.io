<template>
    <div>
        <div class="page-need-statis">
            <mt-header title="汇报统计">
                <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
            </mt-header>
            <div class="content list-block media-list">
                <div class="buttons-row">
                    <mt-navbar v-model="selected">
                        <mt-tab-item v-for="(item,index)  in tabs" :id="item.id" :key="item.id">{{item.name}}({{list[index].total}})</mt-tab-item>
                    </mt-navbar>
                </div>
                <div class="desc">
                    <p>任务发起人：{{name}}</p>
                    <p>提交时间：{{commitTips}} </p>
                </div>
                <mt-tab-container v-model="selected">
                    <mt-tab-container-item v-for="(item,index)  in tabs" :id="item.id" :key="item.id">
                        <mt-loadmore :top-method="refresh" @translate-change="translateChange" @top-status-change="handleTopChange" :bottom-method="loadMore" @bottom-status-change="handleBottomChange" :bottom-all-loaded="list[index].allLoaded" ref="loadmore" :autoFill="false">
                            <ul>
                                <li v-for="item in list[index].data" v-bind:key="item.id" class="border-bottom item-content" v-on:click="go2Read(item.data_code)">
                                    <div class="item-media">
                                        <span>{{formName[0]}}</span>
                                    </div>
                                    <div class="item-inner">
                                        <div class="item-title-row">
                                            <div class="item-title">{{isCommittedTap?'提交时间':'截止至'}}
                                            </div>
                                        </div>
                                        <div v-if="isCommittedTap" class="item-subtitle">{{item.write_time}}</div>
                                        <div v-else class="item-subtitle">{{item.batch_end_time|datetime('yyyy-MM-dd')+' 24:00'}}</div>
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
                    </mt-tab-container-item>
                </mt-tab-container>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'needStatis',
    data() {
        return {
            selected: 'committed',
            tabs: [{ name: '准时提交', id: 'committed' }, { name: '未交', id: 'uncommitted' }],
            list: [{
                data: [],
                allLoaded: false,
                row: 20,
                pageNum: 1,
                total: '-'
            }, {
                data: [],
                allLoaded: false,
                row: 20,
                pageNum: 1,
                total: '-'
            }],
            bottomStatus: '',
            topStatus: '',
            translate: 0,
            moveTranslate: 0
        }
    },
    computed: {
        commitTips() {
            let tips = ''
            if (this.workCycle === '1') {
                tips = this.$route.query.dateStr
            } else if (this.workCycle === '2') {
                tips = '每周五至周日'
            } else {
                tips = '每月25日至当月最后一天'
            }
            return tips
        },
        name() {
            return this.$route.query.name
        },
        formName() {
            return this.$route.query.formName
        },
        workCycle() {
            return this.$route.query.workCycle
        },
        tabActiveIndex() {
            let index = 0
            for (let i = 0; i < this.tabs.length; i++) {
                if (this.tabs[i].id === this.selected) {
                    index = i
                    break
                }
            }
            return index
        },
        noData() {
            return this.list[this.tabActiveIndex].data.length === 0 && this.list[this.tabActiveIndex].allLoaded
        },
        isCommittedTap() {
            return this.selected === 'committed'
        }
    },
    watch: {
        tabActiveIndex(val, odlVal) {
            if (this.list[val].data.length === 0) {
                this.refresh()
            }
        }
    },
    mounted() {
        this.refresh()
        this.selected = 'uncommitted'
        this.refresh()
        this.selected = 'committed'
    },
    methods: {
        refresh() {
            this.loadMore(true)
        },
        loadMore(isRefresh) {
            let i = this.tabActiveIndex
            if (isRefresh) {
                this.list[i].pageNum = 1
            }
            let isRecord = '1'
            if (i === 1) {
                isRecord = '0'
            }
            this.$utils.ajax({
                url: '/report/reporttaskrecord/app/v3/needwritebymerecordlist',
                loading: false,
                data: {
                    employeeId: window.userInfo.empId,
                    taskId: this.$route.query.taskId,
                    isRecord,
                    pageNum: this.list[i].pageNum,
                    row: this.list[i].row
                },
                success: (res) => {
                    if (res.httpCode === '200') {
                        if (isRefresh) {
                            this.$set(this.list[i], 'data', res.data.records)
                            this.$refs.loadmore[i].onTopLoaded()
                        } else {
                            this.$set(this.list[i], 'data', this.list[i].data.concat(res.data.records))
                        }
                        this.$set(this.list[i], 'total', res.data.total)
                        this.$set(this.list[i], 'allLoaded', this.list[i].data.length >= res.data.total)
                        if (this.list[i].pageNum !== 1) {
                            this.$refs.loadmore[i].onBottomLoaded()
                        }
                        this.$set(this.list[i], 'pageNum', this.list[i].pageNum + 1)
                    } else {
                        this.$toast('出错了')
                        this.$set(this.list[i], 'allLoaded', true)
                    }
                },
                error: () => {
                    this.$toast('出错了')
                    this.$set(this.list[i], 'allLoaded', true)
                }
            })
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
        go2Read(dataCode) {
            if (this.selected === 'committed') {
                this.$router.push({ name: 'read', query: { dataCode, pageFrom: 'task' } })
            }
        }
    }
}
</script>
<style lang="less" scoped>
.filtrate {
    padding: 12px;
    .filter-bar {
        width: 100%;
        display: table;
        border: 1px solid #BA8833;
        border-radius: 4px;
        color: #BA8833;
        overflow: hidden;
        span {
            display: table-cell;
            width: 50%;
            text-align: center;
            padding: 8px 0;
            font-size: 14px;
        }
        .active {
            background: #BA8833;
            color: #fff;
        }
    }
}

.desc {
    height: 50px;
    padding: 0 12px;
    p {
        font-size: 14px;
        line-height: 24px;
        color: #666;
    }
}

.buttons-row {
    height: 45px;
    background-color: transparent;
    &>div.mint-navbar a.is-selected {
        color: #fff;
    }
}

.list-block ul {
    margin-top: 5px;
    .item-content {
        .item-inner:after {
            display: none;
        }
        .item-title {
            color: @gary;
            font-size: 14px;
        }
        .item-subtitle {
            font-size: 16px;
        }
        .item-media>span {
            text-align: center;
            line-height: 36px;
            color: #fff;
            background: -webkit-gradient(linear, left top, left bottom, from(#FFC44C), to(#FFB319));
            box-shadow: 1px 1px 5px #ffecc5;
        }
    }
}

.mint-tab-container {
    height: calc(~"100% - 100px");
}
</style>