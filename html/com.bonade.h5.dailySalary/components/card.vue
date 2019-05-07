<template>
    <div>
        <div class="page-card">
            <mt-header title="绑定银行卡">
                <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
            </mt-header>
            <div class="content">
                <div class="block-title">持卡人信息</div>
                <mt-field label="姓名" placeholder="请输入姓名" v-model="name"></mt-field>
                <mt-field label="身份证号码" placeholder="请输入身份证号码" v-model="id" type="text"></mt-field>
                <div class="block-title">持卡人银行卡信息</div>
                <mt-field label="开户行" placeholder="请选择开户行" v-model="bankName" v-on:click.native="openPopup" readonly disableClear></mt-field>
                <mt-field label="银行卡号" placeholder="请输入银行卡号" v-model="account" type="tel">
                    <div class="camera-btn" v-on:click="ocr">
                        <i class="icon-camera-o"></i>
                    </div>
                </mt-field>
                <div class="button-wrapper">
                    <mt-button size="large" v-on:click="doSubmit" ref="button">确定</mt-button>
                </div>
            </div>
        </div>
        <mt-popup v-model="tipsPopupVisible" position="right" class="page-popup">
            <mt-header title="实名成功">
                <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
            </mt-header>
            <div class="content">
                <div class="icon-wrapper">
                    <div class="icon-check"></div>
                    <h1>实名成功</h1>
                </div>
                <div class="button-wrapper">
                    <a>
                        <mt-button size="large" v-on:click.native="go2Scan">继续加人</mt-button>
                    </a>
                    <a>
                        <mt-button size="large" v-on:click.native="go2Sign">打卡</mt-button>
                    </a>
                </div>
            </div>
        </mt-popup>
        <mt-popup v-model="popupVisible" position="right" class="page-popup">
            <mt-header title="选择开户行">
                <mt-button icon="back" slot="left" v-on:click="closePopup"></mt-button>
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
    name: 'card',
    data() {
        return {
            tipsPopupVisible: false,
            bankName: '',
            account: '',
            name: '',
            id: '',
            staffId: '',
            base64: '',
            popupVisible: false,
            list: []
        }
    },
    created() {
        this.bankName = this.$route.params.bankName.trim()
        this.account = this.$route.params.account.trim()
        this.name = this.$route.params.name.trim()
        this.id = this.$route.params.id.trim()
    },
    computed: {
        projectId() {
            return this.$route.params.projectId
        }
    },
    methods: {
        go2Scan() {
            document.querySelector('.v-modal').remove()
            this.$router.replace({ name: 'scan', params: { projectId: this.projectId } })
        },
        go2Sign() {
            document.querySelector('.v-modal').remove()
            this.$router.replace({ name: 'sign', params: { staffId: this.staffId, name: this.name, idNo: this.id, projectId: this.projectId } })
        },
        handleAction(item) {
            this.closePopup()
            this.bankName = item.bankName
        },
        openPopup() {
            this.popupVisible = true
            this.getBankList()
        },
        closePopup() {
            this.popupVisible = false
        },
        getBankList() {
            if (this.list.length !== 0) {
                return false
            }
            this.$utils.ajax({
                url: '/bonade-accounting-web/cupacct/app/v1/getsupportedbanks',
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
        doSubmit() {
            let fromData = [{
                title: '姓名',
                value: this.name,
                rule: 'name',
                require: true
            }, {
                title: '身份证',
                value: this.id,
                rule: 'id',
                require: true
            }, {
                title: '开户行',
                value: this.bankName,
                require: true
            }, {
                title: '银行卡号',
                value: this.account,
                require: true
            }]
            let flag = this.$utils.validate(fromData)
            if (flag) {
                this.$refs.button.disabled = true
                if (sessionStorage.getItem('idCardBitmap') !== null) {
                    this.$utils.ajax({
                        url: '/common/image',
                        data: {
                            uploadFile: sessionStorage.getItem('idCardBitmap'),
                            uploadFileName: 'idCard' + '_' + new Date().getTime() + '.jpeg', //
                            tableName: 'dailySalary',
                            tableCloumn: '日日身份证',
                            uploading: true
                        },
                        success: (res) => {
                            if (res.statusCode === 200) {
                                indicator.close()
                                this.addMember(res.attach.path)
                            } else {
                                this.$toast(res.msg)
                                this.$refs.button.disabled = false
                            }
                        },
                        error: () => {
                            this.$refs.button.disabled = true
                        }
                    })
                } else {
                    this.addMember('')
                }
            }
        },
        addMember(imageUrl) {
            this.$utils.ajax({
                url: '/sal/day/app/v1/addMembers',
                data: {
                    prjId: this.projectId,
                    empId: window.userInfo.empId,
                    userName: this.name,
                    idNo: this.id,
                    bank: this.bankName,
                    cardNo: this.account,
                    idFace: imageUrl,
                    idBack: '',
                    cardImg: ''
                },
                success: (res) => {
                    if (res.statusCode === 200) {
                        this.staffId = res.data.id
                        this.tipsPopupVisible = true
                        this.$refs.button.disabled = false
                    } else {
                        this.$toast(res.msg)
                        this.$refs.button.disabled = false
                    }
                },
                error: () => {
                    this.$refs.button.disabled = true
                }
            })
        },
        ocr() {
            this.$app.ocr('bankCard', (res) => {
                console.log(res)
                if (res.status === '1' && res.data.ret === '0') {
                    this.bankName = res.data.bankInfo.replace(/\(([0-9]*)\)/ig, '')
                    this.account = res.data.cardNo
                    let bankNameList = []
                    new Promise(
                        () => {
                            this.getBankList()
                        }
                    ).then(
                        () => {
                            _.each(this.list, (bank) => {
                                if (bank.bankName.indexOf(this.bankName) !== -1) {
                                    bankNameList.push(bank.bankName)
                                }
                            })
                            if (bankNameList.length === 1) {
                                this.bankName = bankNameList[0]
                            }
                        }
                    )
                } else {
                    this.bankName = ''
                    this.account = ''
                    this.$toast('识别失败,请重新扫描')
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.icon-camera-o {
    display: block;
    height: 43px;
    line-height: 43px;
    padding: 0 10px;
    color: @supportColor;
}

.camera-btn {
    position: relative;
}

input[type=file] {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: #000;
    z-index: 2;
    opacity: 0;
}

.page-popup .button-wrapper {
    display: flex;
    justify-content: space-between;
    a {
        display: block;
        width: 48%;
    }
}

.icon-wrapper {
    background-color: #fff;
    text-align: center;
    padding: 50px 0;
    margin-bottom: 10px;
    h1 {
        color: @supportColor;
        margin-top: 10px;
    }
    .icon-check {
        background-color: @supportColor;
        color: @normalFont;
        font-size: 80px;
        display: block;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        margin: 0 auto;
    }
}
</style>