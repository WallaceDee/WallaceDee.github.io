<template>
    <div>
        <div class="page-memberInfo">
            <mt-header title="成员信息详情">
                <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
            </mt-header>
            <div class="content">
                <div class="block-title">个人信息</div>
                <mt-cell title="姓名" v-bind:value="info.name"></mt-cell>
                <mt-cell title="身份证号码" v-bind:value="info.idNo"></mt-cell>
                <div class="block-title">开户信息</div>
                <mt-cell title="开户行" v-bind:value="info.bank"></mt-cell>
                <mt-cell title="银行卡号" v-bind:value="info.cardNo" is-link v-on:click.native="openCardPopup"></mt-cell>
                <div class="block-title">工时信息</div>
                <mt-cell title="工时" v-bind:value="info.price+'元/小时'" is-link v-on:click.native="openPopup"></mt-cell>
                <div class="block-title">打卡信息</div>
                <mt-cell title="打卡" is-link v-on:click.native="go2Sign"></mt-cell>
            </div>
        </div>
        <mt-popup v-model="popupVisible" position="right" class="page-popup">
            <mt-header title="修改工时">
                <mt-button icon="back" slot="left" v-on:click="closePopup"></mt-button>
            </mt-header>
            <div class="content">
                <mt-field label="工时" placeholder="请输入工时" type="number" v-model="salary" v-on:blur.native.capture="moneyFormatter">元/小时</mt-field>
                <div class="button-wrapper">
                    <mt-button size="large" v-on:click="doSubmit" ref="button">确定</mt-button>
                </div>
            </div>
        </mt-popup>
        <mt-popup v-model="cardPopupVisible" position="right" class="page-popup card-popup">
            <mt-header title="修改银行卡">
                <mt-button icon="back" slot="left" v-on:click="closeCardPopup"></mt-button>
            </mt-header>
            <div class="content">
                <mt-cell title="开户行" v-bind:value="editBankName" v-on:click.native="openBankPopup" is-link></mt-cell>
                <mt-field label="银行卡号" placeholder="请输入银行卡号" v-model="editBankCardNo" type="tel">
                    <div class="camera-btn" v-on:click="ocr">
                        <i class="icon-camera-o"></i>
                    </div>
                </mt-field>
                <div class="button-wrapper">
                    <button class="mint-button mint-button--default mint-button--large" v-on:click="doSubmit">
                        <label class="mint-button-text">确定</label>
                    </button>
                </div>
            </div>
        </mt-popup>
        <mt-popup v-model="bankPopupVisible" position="right" class="page-popup">
            <mt-header title="选择开户行">
                <mt-button icon="back" slot="left" v-on:click="closeBankPopup"></mt-button>
            </mt-header>
            <div class="content">
                <mt-cell :title="item.bankName" v-bind:key="item.bankCode" v-for="item in list" v-on:click.native="handleAction(item)">
                    <img slot="icon" :src="item.imgUrl+item.imgNameApp" width="30" height="30">
                </mt-cell>
            </div>
        </mt-popup>
    </div>
</template>
<script>
export default {
    name: 'memberInfo',
    data() {
        return {
            info: {},
            salary: 0,
            popupVisible: false,
            bankPopupVisible: false,
            cardPopupVisible: false,
            list: [],
            editBankName: '',
            editBankCardNo: ''
        }
    },
    computed: {
        staffId() {
            return this.$route.query.staffId
        },
        projectId() {
            return this.$route.query.projectId
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        getData() {
            this.$utils.ajax({
                url: '/sal/day/app/v1/selectMemberDetails',
                data: {
                    staffId: this.staffId
                },
                success: (res) => {
                    this.info = res.data
                    this.salary = res.data.price
                }
            })
        },
        go2Sign() {
            let info = this.info
            this.$router.push({ name: 'sign', params: { staffId: info.id, name: info.name, idNo: info.idNo, projectId: info.projectId } })
        },
        getBankList() {
            if (this.list.length !== 0) {
                return false
            }
            this.$utils.ajax({
                url: '/bonade-accounting-web/cupacct/app/v1/getsupportedbanks',
                loading: false,
                success: (res) => {
                    if (res.statusCode === 200) {
                        this.list = res.data
                    } else {
                        this.$toast(res.msg)
                        this.$indicator.close()
                    }
                }
            })
        },
        ocr() {
            this.$app.ocr('bankCard', (res) => {
                console.log(res.data)
                if (res.status === '1' && res.data.ret === '0') {
                    this.editBankName = res.data.bankInfo.replace(/\(([0-9]*)\)/ig, '')
                    this.editBankCardNo = res.data.cardNo
                    let bankNameList = []
                    new Promise(
                        () => {
                            this.getBankList()
                        }
                    ).then(
                        () => {
                            _.each(this.list, (bank) => {
                                if (bank.bankName.indexOf(this.editBankName) !== -1) {
                                    bankNameList.push(bank.bankName)
                                }
                            })
                            if (bankNameList.length === 1) {
                                this.editBankName = bankNameList[0]
                            }
                        }
                    )
                } else {
                    this.editBankName = ''
                    this.editBankCardNo = ''
                    this.$toast('识别失败,请重新扫描')
                }
            })
        },
        moneyFormatter() {
            this.salary = this.$utils.moneyFormatter(this.salary)
        },
        doSubmit() {
            if (this.popupVisible) {
                if (this.salary === 0) {
                    this.$toast('请输入正确的工时')
                    return false
                }
                let fromData = [{
                    title: '正确的金额（两位小数）',
                    value: this.salary,
                    rule: 'money',
                    require: true
                }]
                let flag = this.$utils.validate(fromData)
                if (flag) {
                    this.$refs.button.disabled = true
                    this.$utils.ajax({
                        url: '/sal/day/app/v1/updateTimeUnitPrice',
                        data: {
                            staffId: this.staffId,
                            price: this.salary
                        },
                        success: (res) => {
                            if (res.statusCode === 200) {
                                this.closePopup()
                                this.info.price = this.salary
                                this.$toast('修改成功')
                            }
                            this.$refs.button.disabled = false
                        },
                        error: () => {
                            this.$refs.button.disabled = false
                        }
                    })
                }
            } else {
                this.$utils.ajax({
                    // baseURL: 'http://192.168.0.46:8102',
                    url: '/sal/day/app/v1/updateAccount',
                    data: {
                        prjId: this.projectId,
                        idNo: this.info.idNo,
                        bank: this.editBankName,
                        cardNo: this.editBankCardNo
                    },
                    success: res => {
                        if (res.httpCode === 200) {
                            this.closeCardPopup()
                            this.$toast('修改成功')
                            this.getData()
                        } else {
                            this.$toast(res.msg)
                        }
                    }
                })
            }
        },
        openPopup() {
            this.popupVisible = true
        },
        closePopup() {
            this.popupVisible = false
        },
        openCardPopup() {
            this.editBankName = this.info.bank
            this.editBankCardNo = this.info.cardNo
            this.cardPopupVisible = true
        },
        closeCardPopup() {
            this.cardPopupVisible = false
        },
        openBankPopup() {
            this.getBankList()
            this.bankPopupVisible = true
        },
        closeBankPopup() {
            this.bankPopupVisible = false
        },
        handleAction(item) {
            this.closeBankPopup()
            this.editBankName = item.bankName
        }
    }
}
</script>
<style lang="less">
.page-memberInfo {
    &~.card-popup {
        .icon-camera-o {
            display: block;
            height: 43px;
            line-height: 43px;
            padding: 0 10px;
            color: @supportColor;
        }
        .mint-cell:not(.mint-field) {
            .mint-cell-title {
                display: block;
                width: 105px;
                flex: initial;
            }
        }
    }
}
</style>