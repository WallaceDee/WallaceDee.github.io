<template>
    <div>
        <div class="page-create-statis">
            <mt-header title="汇报统计">
                <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
                <mt-button v-on:click="toCreateTask" slot="right">修改 </mt-button>
            </mt-header>
            <div class="content list-block media-list">
                <div class="dateNav">
                    <span class="prev-btn" v-on:click="getNextBatch(batchData.beforeRecordBatch)">
                        <i class="mintui mintui-back" v-show="batchData.beforeRecordBatch"></i>
                    </span>
                    <div>{{title}}</div>
                    <span class="next-btn" v-on:click="getNextBatch(batchData.nextRecordBatch)">
                        <i class="mintui mintui-back" v-show="batchData.nextRecordBatch"></i>
                    </span>
                </div>
                <div class="buttons-row">
                    <mt-navbar v-model="selected">
                        <mt-tab-item v-for="(item,index)  in tabs" :id="item.id" :key="item.id">{{item.name}}({{list[index].total}})</mt-tab-item>
                    </mt-navbar>
                </div>
                <mt-tab-container v-model="selected">
                    <mt-tab-container-item v-for="(item,index)  in tabs" :id="item.id" :key="item.id">
                        <mt-loadmore :top-method="refresh" @translate-change="translateChange" @top-status-change="handleTopChange" :bottom-method="loadMore" @bottom-status-change="handleBottomChange" :bottom-all-loaded="list[index].allLoaded" ref="loadmore" :autoFill="false">
                            <ul>
                                <li v-for="item in list[index].data" v-bind:key="item.id" class="border-bottom item-content" v-on:click="toRead(item)">
                                    <div class="item-media">
                                        <span>{{formName[0]}}</span>
                                    </div>
                                    <div class="item-inner">
                                        <div class="item-subtitle">{{item.name_}}</div>
                                    </div>
                                    <div class="item-after" v-show="isCommittedTap">
                                        {{item.write_time}}
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
    name: 'createStatis',
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
            moveTranslate: 0,
            batchData: {},
            batch: ''
        }
    },
    computed: {
        title() {
            let title = ''
            if (this.workCycle === '1') {
                title = `日报（${this.batchData.current_batch_end_time}）`
            } else if (this.workCycle === '2') {
                title = `周报（${this.batchData.current_batch_start_time}-${this.batchData.current_batch_end_time}）`
            } else {
                title = `月报（${this.batchData.current_batch_start_time}-${this.batchData.current_batch_end_time}）`
            }
            return title
        },
        name() {
            return this.$route.query.name
        },
        workCycle() {
            return this.$route.query.workCycle
        },
        formName() {
            return this.$route.query.formName
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
        isCommittedTap() {
            return this.selected === 'committed'
        },
        noData() {
            return this.list[this.tabActiveIndex].data.length === 0 && this.list[this.tabActiveIndex].allLoaded
        }
    },
    mounted() {
        this.batch = this.$route.query.currentrecord_batch
        this.getNextBatch(this.batch)
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
                url: '/report/reporttaskrecord/app/v3/createbymerecordlist',
                loading: false,
                data: {
                    employeeId: window.userInfo.empId,
                    taskId: this.$route.query.taskId,
                    isRecord,
                    recordBatch: this.batch,
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
        toRead(item) {
            if (this.selected === 'committed') {
                this.$router.push({ name: 'read', query: { dataCode: item.data_code, pageFrom: 'task' } })
            }
        },
        toCreateTask() {
            this.$router.push({ name: 'createTask', query: { type: '2', taskId: this.$route.query.taskId } })
        },
        getNextBatch(batch) {
            if (!batch) {
                return false
            }
            this.$utils.ajax({
                url: '/report/reporttaskrecord/app/v3/createbymetaskworkcycle',
                data: {
                    employeeId: window.userInfo.empId,
                    taskId: this.$route.query.taskId,
                    recordBatch: batch
                },
                success: (sucData) => {
                    if (sucData.httpCode === '200') {
                        this.batchData = sucData.data
                        this.batch = batch
                        this.refresh()
                        this.selected = 'uncommitted'
                        this.refresh()
                        this.selected = 'committed'
                    } else {
                        this.$toast({ message: sucData.msg, position: 'bottom' })
                    }
                },
                error: (errData) => {
                    console.log(errData)
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.mint-tab-container {
    height: calc(~"100% - 87px");
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
        .item-subtitle {
            font-size: 16px;
            line-height: 25px;
        }
        .item-after {
            color: @gary;
            padding-right: 10px;
            font-size: 14px;
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

.filtrate {
    padding: 12px;
    .filterBar {
        width: 100%;
        display: table;
        border: 1px solid #BA8833;
        border-radius: 8px;
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

.dateNav {
    display: flex;
    height: 42px;
    background-color: #fff;
    line-height: 42px;
    color: @supportColor; // padding-left: 10px;
    // padding-right: 10px;
    font-size: 14px;
    justify-content: space-between;
    text-align: center;
    span {
        width: 30px;
    }
    .next-btn {
        transform: rotate(180deg);
    }
}
</style>