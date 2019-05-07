<template>
    <div>
        <div class="page-create-statis">
            <mt-header :title="title">
                <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
                <mt-button slot="right" v-on:click="deleteComfirm" v-show="isEdit">删除</mt-button>
            </mt-header>
            <div class="mint-tabbar button-wrapper">
                <mt-button size="large" v-on:click="savePost">保存</mt-button>
            </div>
            <div class="content">
                <div class="list">
                    <mt-cell title="选择模板" :is-link="!isEdit" :class="{'disabled':isEdit}">
                        <span v-on:click="openModelPicker">{{this.modelType?this.modelType:'请选择'}}</span>
                    </mt-cell>
                    <mt-cell title="谁要提交" is-link>
                        <span v-on:click="selectEmployees">
                            <div v-if="employees.length>0" class="selEmp">
                                <span v-for="item in employees" v-bind:key="item.id">{{item.name?item.name:item.deptName}} </span>
                            </div>
                            <span v-if="employees.length == 0">请选择</span>
                        </span>
                    </mt-cell>
                    <br>
                    <mt-cell title="提交周期" :class="{'disabled':isEdit}">
                        <span>
                            <div class="cycle" v-if="!isEdit">
                                <span v-bind:class="{ active: saveParam.workCycle == '1' }" v-on:click="changeType('1')">每天</span>
                                <span v-bind:class="{ active: saveParam.workCycle == '2' }" v-on:click="changeType('2')">每周</span>
                                <span v-bind:class="{ active: saveParam.workCycle == '3' }" v-on:click="changeType('3')">每月</span>
                            </div>
                            <div v-else>{{ saveParam.workCycle ==='1'?'每天': saveParam.workCycle === '2'?'每周': saveParam.workCycle === '3'?'每月':''}}</div>
                        </span>
                    </mt-cell>
                    <mt-cell title="指定日期" :is-link="!isEdit" v-show="saveParam.workCycle == '1'" :class="{'disabled':isEdit}">
                        <span v-on:click="showDate" class="dateText">{{dateText?dateText:'请选择'}}</span>
                    </mt-cell>
                    <div class="note" v-show="saveParam.workCycle == '1'">
                        每天17:00开始写当天的汇报，24:00前提交为正常提交，未完成将被标记为“未交”;
                    </div>
                    <div class="note" v-show="saveParam.workCycle == '2'">
                        每周五17:00开始写本周的汇报，周日24:00前提交为正常提交，未完成将被标记为“未交”;
                    </div>
                    <div class="note" v-show="saveParam.workCycle == '3'">
                        每月25日00:00开始写本月的汇报，本月最后一天24:00前提交为正常提交，未完成将被标记为“未交”;
                    </div>
                    <mt-cell title="提醒员工提交">
                        <mt-switch v-model="showNotice" @change="changeNotice"></mt-switch>
                    </mt-cell>
                    <div class="note">
                        开启后，至截至时间前三个小时对方仍未提交，将推送消息提醒。
                    </div>
                </div>
            </div>
            <!-- 选择模板 -->
            <mt-popup v-model="modelPickerVisible" position="bottom">
                <div class="bar bar-nav">
                    <button class="button pull-right" v-on:click="affrimMu">确定</button>
                    <button class="button pull-left" v-on:click="closeModelPicker">取消</button>
                    <h1 class="title">选择模板</h1>
                </div>
                <mt-picker :slots="muList" valueKey="name" @change="changeMu"></mt-picker>
            </mt-popup>
            <!-- 选择周几汇报 -->
            <mt-popup v-model="datePopup" position="bottom">
                <div class="bar bar-nav">
                    <button class="button pull-right" v-on:click="affrimDate">确定</button>
                    <button class="button pull-left" v-on:click="datePopup = false">取消</button>
                    <h1 class="title">选择日期</h1>
                </div>
                <mt-checklist v-model="selList" :options="dateList"> </mt-checklist>
            </mt-popup>
        </div>
    </div>
</template>
<script>
/* eslint-disable */
export default {
    name: 'createTask',
    data() {
        return {
            muList: [{
                values: [],
            }],
            modelPickerVisible: false,
            saveParam: {
                formCode: '',
                employeeId: window.userInfo.empId,
                employees: '',
                depts: '',
                workCycle: '1',
                workDays: '1,2,3,4,5',
                isNotice: '0'
            },
            showNotice: false,
            currentType: '',
            modelType: '',
            datePopup: false,
            dateList: [
                { label: '星期一', value: '1' },
                { label: '星期二', value: '2' },
                { label: '星期三', value: '3' },
                { label: '星期四', value: '4' },
                { label: '星期五', value: '5' },
                { label: '星期六', value: '6' },
                { label: '星期日', value: '0' }
            ],
            selList: ['1', '2', '3', '4', '5'],
            employees: []
        }
    },
    mounted() {
        this.getformmodellist();
        // this.getData();
        if (this.isEdit) {
            this.getEditData()
        }
    },
    computed: {
        isEdit() {
            return this.$route.query.type === '2'
        },
        title() {
            return `${this.isEdit?'编辑':'创建'}任务`
        },
        taskId() {
            return this.$route.query.taskId
        },
        dateText() {
            let dateText = ''
            for (let item of this.sortarr(this.selList)) {
                if (item == 1) dateText += '星期一 '
                if (item == 2) dateText += '星期二 '
                if (item == 3) dateText += '星期三 '
                if (item == 4) dateText += '星期四 '
                if (item == 5) dateText += '星期五 '
                if (item == 6) dateText += '星期六 '
                if (item == 0) dateText += '星期日 '
            }
            return dateText
        }
    },
    methods: {
        deleteComfirm() {
            this.$messagebox.confirm('您是否确定删除任务？').then(action => {
                this.doDelete()
            }, action => {
                console.log(action)
            })
        },
        doDelete() {
            console.log('删除')
            this.jumpInPopup()
            this.$utils.ajax({
                url: '/report/reporttask/app/v3/deletereporttask',
                data: {
                    employeeId: window.userInfo.empId,
                    reportTaskId: this.taskId
                },
                success: res => {
                    if (res.httpCode === '200') {
                        this.$router.replace({
                            name: 'statis'
                        })
                        this.$toast('删除成功')
                    }
                }
            })
        },
        changeType(type) {
            if (this.isEdit) {
                return false
            }
            this.saveParam.workCycle = type
            if (type !== '1') {
                this.saveParam.workDays = ''
            }
        },
        getEditData() {
            this.$utils.ajax({
                url: '/report/reporttask/app/v3/getreporttaskdetail',
                data: {
                    reportTaskId: this.taskId,
                    employeeId: window.userInfo.empId
                },
                success: res => {
                    if (res.httpCode === '200') {
                        this.modelType = res.data.formName
                        let tempEmployees = []
                        res.data.deptList.map((item) => {
                            tempEmployees.push({
                                id: item.dept_id,
                                deptName: item.dept_name,
                                type: 'dep'
                            })
                        })
                        res.data.employeeList.map((item) => {
                            tempEmployees.push({
                                id: item.emp_id,
                                name: item.emp_name,
                                type: 'emp'
                            })
                        })
                        // console.log(tempEmployees)
                        this.employees = tempEmployees
                        this.saveParam.workCycle = res.data.reportTask.workCycle
                        this.saveParam.workDays = res.data.reportTask.workDays
                        this.selList = this.saveParam.workDays.split(",")
                        this.showNotice = res.data.reportTask.isNotice === '1' ? true : false
                    } else {
                        this.$toast(res.msg)
                    }
                }
            })
        },
        sortarr(arr) {
            for (var i = 0; i < arr.length - 1; i++) {
                for (var j = 0; j < arr.length - 1 - i; j++) {
                    if (arr[j] > arr[j + 1]) {
                        var temp = arr[j];
                        arr[j] = arr[j + 1];
                        arr[j + 1] = temp;
                    }
                }
            }
            return arr;
        },
        openModelPicker() {
            if (this.isEdit) {
                return false
            }
            this.modelPickerVisible = true
        },
        closeModelPicker() {
            this.modelPickerVisible = false
        },
        changeMu(picker, value) {
            try {
                this.currentType = value[0];
            } catch (error) {

            }
        },
        affrimMu() {
            this.saveParam.formCode = this.currentType.value
            this.modelType = this.currentType.name
            this.closeModelPicker()
            // console.log(this.saveParam)
        },
        getformmodellist() {
            this.$utils.ajax({
                url: '/report/reportmodel/app/v1/queryFormModelList',
                method: 'POST',
                data: {
                    comId: window.userInfo.companyId,
                    empId: window.userInfo.empId,
                },
                success: (sucData) => {
                    if (sucData.httpCode == 200) {
                        for (let item of sucData.data) {
                            this.muList[0].values.push({ name: item.formName, value: item.formCode })
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
        showDate() {
            if (this.isEdit) {
                return false
            }
            if (this.saveParam.workDays) this.selList = this.saveParam.workDays.split(",");
            this.datePopup = true;
        },
        affrimDate() {
            this.saveParam.workDays = this.selList.join()
            this.datePopup = false;
            // console.log(this.saveParam.workDays);
        },
        changeNotice(value) {
            this.saveParam.isNotice = this.showNotice ? "1" : "0";
            console.log(this.showNotice);
        },
        savePost() {
            let depId = [],
                empId = []
            _.each(this.employees, (item) => {
                if (item.type == 'dep') depId.push(item.id)
                if (item.type == 'emp') empId.push(item.id)
            })
            if (this.isEdit) {
                this.$utils.ajax({
                    url: '/report/reporttask/app/v3/updatereporttask',
                    data: {
                        reportTaskId: this.taskId,
                        employeeId: window.userInfo.empId,
                        employees: empId.join(','),
                        depts: depId.join(','),
                        isNotice: this.showNotice ? "1" : "0"
                    },
                    success: (sucData) => {
                        if (sucData.httpCode == 200) {
                            this.$toast({ message: '修改成功', position: 'bottom' });
                            this.$router.push({ name: 'statis' });
                        } else {
                            this.$toast({ message: sucData.msg, position: 'bottom' });
                        }
                    },
                    error: (errData) => {
                        console.log(errData)
                    }
                })
            } else {
                if (!this.saveParam.formCode) { this.$toast({ message: '请选择模板', position: 'middle' }); return }
                if (this.saveParam.workCycle == '1' && !this.saveParam.workDays) { this.$toast({ message: '请选择日期', position: 'middle' }); return }
                this.saveParam.employees = empId.join();
                this.saveParam.depts = depId.join();
                if (!this.saveParam.employees && !this.saveParam.depts) { this.$toast({ message: '请选择人员', position: 'middle' }); return }
                console.log(this.saveParam);
                this.$utils.ajax({
                    url: '/report/reporttask/app/v3/savereporttask',
                    data: this.saveParam,
                    success: (sucData) => {
                        if (sucData.httpCode == 200) {
                            this.$toast({ message: '创建成功', position: 'bottom' });
                            this.$router.push({ name: 'statis' });
                        } else {
                            this.$toast({ message: sucData.msg, position: 'bottom' });
                        }
                    },
                    error: (errData) => {
                        console.log(errData)
                    }
                })
            }
        },
        selectEmployees() {
            this.$employeePickerV2({
                title: '选择谁要提交',
                values: this.employees,
                multiple: true,
                callback: (res) => {
                    this.employees = res;
                    // console.log("456",this.employees);
                }
            })
        },
    }
}
</script>
<style lang="less">
.page-create-statis {
    .mint-tabbar.button-wrapper {
        background-color: transparent;
    }

    .mint-cell.disabled {
        .mint-cell-text {
            color: @gary
        }
    }

    .dateText {
        text-align: right;
        width: 200px; // border: 1px solid red;
        overflow: hidden;
        font-size: 17px;
        text-overflow: ellipsis;
        white-space: nowrap
    }

    .list {
        .note {
            color: #B3B3B3;
            font-size: 14px;
            padding: 10px 10px;
            line-height: 19px;
        }
    }

    .mint-popup {
        width: 100%;
    }

    .cycle {
        border: 1px solid #AF8030;
        border-radius: 4px;
        overflow: hidden;

        span {
            color: #AF8030;
            float: left;
            display: inline-block;
            width: 60px;
            text-align: center;
            border-right: 1px solid #AF8030;
            margin: 0;
            padding: 0;
            padding: 5px 0;

            &:last-child {
                border: none;
            }
        }

        .active {
            background: #AF8030;
            color: #fff
        }
    }

    .selEmp {
        max-width: 153px;
        min-width: 65px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
}
</style>