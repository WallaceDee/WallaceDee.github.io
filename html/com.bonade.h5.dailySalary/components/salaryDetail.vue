<template>
    <div>
        <div class="page-salaryDetail">
            <mt-header title="工资详情表">
                <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
                <mt-button slot="right" v-on:click="doDelete">删除</mt-button>
            </mt-header>
            <div class="content">
                <mt-cell title="姓名" v-bind:value="info.staffName"></mt-cell>
                <mt-cell title="身份证号码" v-bind:value="info.idNo"></mt-cell>
                <mt-cell title="上下班考勤"></mt-cell>
                <a class="mint-cell sign-item" v-for="item in signList" v-bind:key="item.index">
                    <div class="mint-cell-wrapper">
                        <div class="mint-cell-title">
                            <div>上班打卡时间</div>
                            <div>{{item.startWork}}</div>
                        </div>
                        <div class="mint-cell-title">
                            <div>下班打卡时间</div>
                            <div>{{item.endWork}}</div>
                        </div>
                    </div>
                    <div class="mint-cell-right"></div>
                </a>
                <mt-cell title="累计工时" v-bind:value="info.totalHour +'小时'"></mt-cell>
                <mt-cell title="有效工时" v-bind:value="info.validHour+'小时'"></mt-cell>
                <mt-cell title="单价" v-bind:value="info.price+'元/小时'"></mt-cell>
                <mt-cell title="统计工资" v-bind:value="info.statisticsSalary +'元'"></mt-cell>
                <mt-cell title="应发工资" v-bind:value="info.shouldPay+'元'"></mt-cell>
                <mt-cell title="实发工资" v-bind:value="info.realPay+'元'" is-link v-on:click.native="openPopup"></mt-cell>
                <!--         <mt-field label="备注" type="textarea" v-bind:value="info.remark" readonly></mt-field> -->
            </div>
        </div>
        <mt-popup v-model="popupVisible" position="right" class="page-popup">
            <mt-header title="修改实发工资">
                <mt-button icon="back" slot="left" v-on:click="closePopup"></mt-button>
            </mt-header>
            <div class="content">
                <mt-field label="实发工资" placeholder="请输入实发工资" type="number" v-model="realPay" v-on:blur.native.capture="moneyFormatter">元</mt-field>
                <div class="button-wrapper">
                    <mt-button size="large" v-on:click="doSubmit" ref="button">确定</mt-button>
                </div>
            </div>
        </mt-popup>
    </div>
</template>
<script>
export default {
    name: 'salaryDetail',
    data() {
        return {
            introduction: '备注说明信息',
            popupVisible: false,
            info: {
                startWork: '',
                endWork: ''
            },
            realPay: 0
        }
    },
    computed: {
        detailId() {
            return this.$route.params.detailId
        },
        signList() {
            let s = this.info.startWork.split(',')
            let e = this.info.endWork.split(',')
            console.log(s, e)
            let list = []
            for (let i = 0; i < s.length; i++) {
                if (i > 2) {
                    break
                }
                list.push({ startWork: s[i], endWork: e[i], index: i })
            }
            return list
        }
    },
    created() {
        this.$utils.ajax({
            url: '/sal/day/app/v1/selectSalaryDetail',
            data: {
                detailId: this.$route.params.detailId
            },
            success: (res) => {
                this.info = res.data
                this.realPay = this.info.realPay
            }
        })
    },
    methods: {
        moneyFormatter() {
            this.realPay = this.$utils.moneyFormatter(this.realPay)
        },
        doDelete() {
            this.$messagebox.confirm('确定要删除此记录吗?').then(action => {
                console.log(this.$route.params.id)
                this.$utils.ajax({
                    url: '/sal/day/app/v1/delSalaryDetail',
                    data: {
                        detailId: this.detailId
                    },
                    success: (res) => {
                        if (res.statusCode === 200) {
                            this.$toast('删除成功')
                            this.goBack()
                        }
                    }
                })
            })
        },
        doSubmit() {
            if (this.realPay === 0) {
                this.$toast('请输入正确的实发工资')
                return false
            }
            let fromData = [{
                title: '正确的金额（两位小数）',
                value: this.realPay,
                rule: 'money',
                require: true
            }]
            let flag = this.$utils.validate(fromData)
            if (flag) {
                this.$refs.button.disabled = true
                console.log(this.realPay)
                this.$utils.ajax({
                    url: '/sal/day/app/v1/updateSalaryDetail',
                    data: {
                        detailId: this.detailId,
                        realPay: this.realPay
                    },
                    success: (res) => {
                        if (res.statusCode === 200) {
                            this.closePopup()
                            this.info.realPay = this.realPay
                            this.$toast('修改成功')
                            this.$refs.button.disabled = false
                        }
                    },
                    error: () => {
                        this.$refs.button.disabled = false
                    }
                })
            }
        },
        openPopup() {
            this.$data.popupVisible = true
        },
        closePopup() {
            this.$data.popupVisible = false
        }
    }
}
</script>
<style lang="less">
.page-salaryDetail .is-right button {
    font-size: 12px;
}

.page-salaryDetail textarea {
    color: #888!important;
}

.page-salaryDetail .sign-item .mint-cell-wrapper {

    display: block;
    .mint-cell-title {
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        align-items: middle;
        margin-top: 7px;
        padding-left: 10px;
        div:nth-child(2) {
            color: @grayFont;
        }
    }
}
</style>