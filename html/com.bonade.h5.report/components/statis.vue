<template>
    <div>
        <div class="page-statis">
            <mt-header title="汇报任务">
                <mt-button icon="back" slot="left" v-on:click="exit"></mt-button>
                <mt-button v-on:click="toCreateTask" slot="right">新增 </mt-button>
            </mt-header>
            <tab-bar :selectedIndex="2" :badgeList="[0,0,0]"></tab-bar>
            <div class="content">
                <!-- 没有任务、没有设置任务时 -->
                <div class="noData" v-show="needWriteData.length == 0 && createData.length == 0">
                    <img src="../assets/images/noData.png" alt="">
                    <p>定时提醒员工写汇报</p>
                    <p>谁写谁没写一目了然</p>
                    <div class="button" v-on:click="toCreateTask">
                        <mt-button size="large">创建汇报任务</mt-button>
                    </div>
                </div>
                <!-- 我要写的日报 -->
                <div class="myNeed" v-show="needWriteData.length>0">
                    <div class="title">我要写的日报</div>
                    <div class="list">
                        <div class="item" v-for="item in needWriteData" v-bind:key="item.id" v-on:click="toNeedStatis(item)">
                            <div class="top">
                                <span>{{item.form_name}}</span>
                                <i class="icon-flag"></i>
                            </div>
                            <div class="bottom">
                                <div class="note">
                                    <i class="icon-user"></i> {{item.name_}}</div>
                                <div class="note">
                                    <i class="icon-linechart"></i> 准时提交 {{item.recordTimes}} 次，未交 {{item.notRecordTimes}} 次</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 我创建的汇报 -->
                <div class="create" v-show="createData.length>0">
                    <div class="title">我创建的汇报任务统计</div>
                    <div class="list">
                        <div class="item" v-for="item in createData" v-bind:key="item.id" v-on:click="toCreateStatis(item)">
                            <div class="top">
                                <span>{{item.form_name}}</span>
                                <i class="icon-flag"></i>
                            </div>
                            <div class="bottom">
                                <div class="note">
                                    <i class="icon-users "></i> {{item.firstEmployeeName}}等，共 {{item.count}} 人</div>
                                <div class="note" v-show="item.work_cycle == '1'">
                                    <i class="icon-clock "></i> {{item.dateStr}}</div>
                                <div class="note" v-show="item.work_cycle == '2'">
                                    <i class="icon-clock "></i> 每周五至周日</div>
                                <div class="note" v-show="item.work_cycle == '3'">
                                    <i class="icon-clock "></i> 每月25日至当月最后一天</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
/* eslint-disable */
import tabBar from './tabBar.vue'
export default {
    name: 'statis',
    components: {
        'tab-bar': tabBar
    },
    data() {
        return {
            title: '你好伯渡！',
            needWriteData: [],
            createData: [],
        }
    },
    created() {
        this.getNeed();
        this.getCreate()
    },
    methods: {
        toCreateTask() {
            this.$router.push({ name: 'createTask', query: { type: "1" } });
        },
        toNeedStatis(item) {
            this.$router.push({
                name: 'needStatis',
                query: {
                    taskId: item.task_id,
                    name: item.name_,
                    workCycle: item.work_cycle,
                    workDays: item.work_days,
                    formName: item.form_name,
                    dateStr: item.dateStr
                }
            });
        },
        toCreateStatis(item) {
            this.$router.push({
                name: 'createStatis',
                query: {
                    taskId: item.task_id,
                    name: item.name_,
                    workCycle: item.work_cycle,
                    workDays: item.work_days,
                    formName: item.form_name,
                    dateStr: item.dateStr,
                    currentrecord_batch: item.currentrecord_batch
                }
            });
        },
        getNeed() {
            this.$utils.ajax({
                url: '/report/reporttaskrecord/app/v3/needwritebymetasklist',
                method: 'POST',
                data: {
                    companyId: window.userInfo.companyId,
                    employeeId: window.userInfo.empId,
                },
                success: (sucData) => {
                    if (sucData.httpCode == 200) {
                        this.needWriteData = sucData.data.records;
                        for (let item of this.needWriteData) {
                            let arr = item.work_days.split(',');
                            item.dateStr = '';
                            if (arr.length > 0) {
                                _.each(arr, (str) => {
                                    // console.log(str)
                                    if (str == '0') item.dateStr += '周日 '
                                    if (str == '1') item.dateStr += '周一 '
                                    if (str == '2') item.dateStr += '周二 '
                                    if (str == '3') item.dateStr += '周三 '
                                    if (str == '4') item.dateStr += '周四 '
                                    if (str == '5') item.dateStr += '周五 '
                                    if (str == '6') item.dateStr += '周六 '
                                })
                            }
                        }
                    } else {
                        this.$toast({ message: sucData.msg, position: 'bottom' });
                    }
                },
                error: (errData) => {
                    console.log(errData)
                }
            })
        },
        getCreate() {
            this.$utils.ajax({
                url: '/report/reporttaskrecord/app/v3/createbymetasklist',
                method: 'POST',
                data: {
                    companyId: window.userInfo.companyId,
                    employeeId: window.userInfo.empId,
                },
                success: (sucData) => {
                    if (sucData.httpCode == 200) {
                        this.createData = sucData.data.records;
                        for (let item of this.createData) {
                            let arr = item.work_days.split(',');
                            item.dateStr = '';
                            if (arr.length > 0) {
                                _.each(arr, (str) => {
                                    if (str == '0') item.dateStr += '周日 '
                                    if (str == '1') item.dateStr += '周一 '
                                    if (str == '2') item.dateStr += '周二 '
                                    if (str == '3') item.dateStr += '周三 '
                                    if (str == '4') item.dateStr += '周四 '
                                    if (str == '5') item.dateStr += '周五 '
                                    if (str == '6') item.dateStr += '周六 '
                                })
                            }
                        }

                    } else {
                        this.$toast({ message: sucData.msg, position: 'bottom' });
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
.noData {
    width: 100%;
    text-align: center;
    position: absolute;
    transform: translateY(-50%);
    top: 50%;

    img {
        width: 180px;
        margin-bottom: 50px;
    }

    p {
        font-size: 18px;
        color: #666;
        letter-spacing: 2px;
        line-height: 28px;
    }

    .button {
        width: 200px;
        margin: 20px auto;
    }
}

.myNeed,
.create {
    .title {
        padding: 10px 15px;
        color: #666666;
        font-size: 14px;
    }

    .list {
        padding: 0 15px;

        .item {
            background: #fff;
            border-radius: 5px;
            margin-bottom: 10px;

            .top {
                border-bottom: 1px solid #EFF1F0;
                padding: 9px 10px;
                position: relative;
                overflow: hidden;

                >span {
                    color: #BA8833;
                    font-size: 16px;
                }

                .icon-flag {
                    position: absolute;
                    right: 10px;
                    top: -4px;
                    color: #BA8833;
                }
            }

            .bottom {
                padding: 13px 10px;

                .note {
                    line-height: 25px;
                    font-size: 14px;
                    color: #666666;

                    i {
                        font-size: 16px;
                        margin-right: 10px;
                    }
                }
            }
        }
    }
}

.create .list .item .top .icon-flag {
    color: #7ecd34;
}
</style>