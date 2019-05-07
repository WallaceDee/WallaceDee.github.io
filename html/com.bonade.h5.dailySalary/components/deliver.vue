<template>
    <div>
        <div class="page-deliver">
            <mt-header title="选择人">
                <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
            </mt-header>
            <div class="mint-tabbar button-wrapper">
                <mt-button size="large" v-on:click.native="doSubmit">确认提交</mt-button>
            </div>
            <div class="content">
                <div class="block-title">审批人</div>
                <div class="employee-chosen-list has-arrow">
                    <ul>
                        <li v-for="(item, index) in approverList" v-bind:key="item.id">
                            <span style="background-image: url(./static/img/default_avatar.png)">
                                <i class="icon-close" v-on:click="doDelete(approverList,index,true)"></i>
                            </span>
                            <p>{{item.userName}}</p>
                        </li>
                        <li class="add-btn" v-on:click="selectApprovers">
                            <span class="bnd-icon-plus"></span>
                        </li>
                    </ul>
                </div>
                <div class="block-title">发放人</div>
                <div class="employee-chosen-list single-select">
                    <ul>
                        <li v-for="(item, index) in distributorList" v-bind:key="item.id">
                            <span style="background-image: url(./static/img/default_avatar.png)">
                                <i class="icon-close" v-on:click="doDelete(distributorList,index,false)"></i>
                            </span>
                            <p>{{item.employeeName}}</p>
                        </li>
                        <li class="add-btn" v-on:click="selectDistributor">
                            <span class="bnd-icon-plus"></span>
                        </li>
                    </ul>
                </div>
                <div class="block-title">抄送人</div>
                <div class="employee-chosen-list">
                    <ul>
                        <li v-for="(item, index) in copyList" v-bind:key="item.id">
                            <span style="background-image: url(./static/img/default_avatar.png)">
                                <i class="icon-close" v-on:click="doDelete(copyList,index,false)"></i>
                            </span>
                            <p>{{item.userName}}</p>
                        </li>
                        <li class="add-btn" v-on:click="selectCc">
                            <span class="bnd-icon-plus"></span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <mt-popup v-model="popupVisible" position="right" class="page-popup">
            <mt-header title="选择发放人">
                <mt-button icon="back" slot="left" v-on:click="closePopup"></mt-button>
            </mt-header>
            <div class="content">
                <div class=" list-block media-list">
                    <ul>
                        <li v-bind:class="{ 'is-select': item.isSelect == true }" v-bind:key="item.id" v-for="item in distributorPool" v-on:click="handleAction(item)">
                            <div class="item-content">
                                <div class="item-media">
                                    <span style="background-image: url(./static/img/default_avatar.png)"></span>
                                </div>
                                <div class="item-inner">
                                    <div class="item-title-row">
                                        <div class="item-title">{{item.employeeName}}</div>
                                    </div>
                                    <div class="item-subtitle"></div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </mt-popup>
    </div>
</template>
<script>
export default {
    name: 'deliver',
    data() {
        return {
            approverList: [],
            distributorList: [],
            copyList: [],
            popupVisible: false,
            distributorPool: []
        }
    },
    computed: {
        payorId() {
            if (this.distributorList.length === 0) {
                return ''
            }
            return this.distributorList[0].id
        },
        salarySends() {
            let temp = []
            _.each(this.copyList, function(item) {
                temp.push({ userId: item.userInfoId, name: item.userName, empId: item.id })
            })
            if (temp.length === 0) {
                return ''
            }
            return JSON.stringify(temp)
        },
        flows() {
            let temp = []
            _.each(this.approverList, function(item) {
                temp.push({ userId: item.userInfoId, name: item.userName, empId: item.id })
            })
            if (temp.length === 0) {
                return ''
            }
            return JSON.stringify(temp)
        },
        salId() {
            return this.$route.params.salaryId
        }
    },
    methods: {
        doSubmit() {
            let fromData = [{
                    title: '审批人',
                    value: this.flows,
                    require: true,
                    select: true
                },
                {
                    title: '发放人',
                    value: this.payorId,
                    require: true,
                    select: true
                },
                {
                    title: '抄送人',
                    value: this.salarySends,
                    require: true,
                    select: true
                }
            ]
            console.log(fromData)
            let flag = this.$utils.validate(fromData)
            if (flag) {
                console.log(this.salarySends)
                console.log(this.flows)
                this.$utils.ajax({
                    url: '/sal/day/app/v1/submitSalary',
                    data: {
                        subEmpId: window.userInfo.empId,
                        companyId: window.userInfo.companyId,
                        subName: window.userInfo.username,
                        subUserId: window.userInfo.userId,
                        payorId: this.payorId,
                        salarySends: this.salarySends,
                        flows: this.flows,
                        salId: this.salId
                    },
                    success: (res) => {
                        if (res.statusCode === 200) {
                            this.$router.go(-2)
                            this.$toast('提交成功')
                        }
                    }
                })
            }
        },
        handleAction(employee) {
            console.log(employee)
            this.distributorList.push(employee)
            this.popupVisible = false
        },
        closePopup() {
            this.popupVisible = false
        },
        doDelete(arr, index, deleteAfter) {
            console.log(index)
            let size = _.size(arr)
            if (deleteAfter) {
                arr.splice(index, size - index)
            } else {
                arr.splice(index, 1)
            }
        },
        selectApprovers() {
            this.$employeePicker({
                title: '选择审批人',
                values: this.approverList,
                multiple: true,
                callback: (res) => {
                    this.approverList = res
                }
            })
        },
        selectDistributor() {
            this.$utils.ajax({
                url: '/sal/payor/list',
                data: {
                    employeeId: window.userInfo.empId,
                    companyId: window.userInfo.companyId,
                    userId: window.userInfo.userId,
                    row: this.row,
                    pageNum: this.pageNum
                },
                success: (res) => {
                    this.distributorPool = res.data
                }
            })
            this.popupVisible = true
        },
        selectCc() {
            this.$employeePicker({
                title: '选择抄送人',
                values: this.copyList,
                multiple: true,
                callback: (res) => {
                    console.log(res)
                    this.copyList = res
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
</style>