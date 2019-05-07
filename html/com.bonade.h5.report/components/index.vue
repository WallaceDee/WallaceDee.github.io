<template>
    <div>
        <div class="page-index">
            <mt-header title="写汇报">
                <mt-button icon="back" slot="left" v-on:click="exit"></mt-button>
            </mt-header>
            <tab-bar :selectedIndex="0" ref="tabBar"></tab-bar>
            <div class="content">
                <mt-loadmore :top-method="refresh" @translate-change="translateChange" @top-status-change="handleTopChange" ref="loadmore">
                    <div class="inner">
                        <div class="card-block" v-if="myTasks.length">
                            <h1 class="border-bottom">待提交汇报</h1>
                            <ul class="card-inner vertical list-block media-list" :class="{'open':open}">
                                <li v-for="item in myTasks" class="border-bottom item-content" v-bind:key="item.form_code" v-on:click="go2Write(item.form_code)">
                                    <div class="item-media">
                                        <span :style="'background-image:url('+item.form_icon+')'"></span>
                                    </div>
                                    <div class="item-inner">
                                        <div class="item-title-row">
                                            <div class="item-title">{{item.form_name}}
                                            </div>
                                        </div>
                                        <div class="item-subtitle">{{item.creatEmpList|getReceiver}}</div>
                                    </div>
                                    <div class="item-after">
                                        <div>
                                            <p>
                                                <i class="icon-clock"></i>
                                            </p>
                                            <p>{{item.batch_end_time|getCountDown(item.now_time)}}</p>
                                        </div>
                                    </div>
                                </li>
                                <li class="open-btn" v-on:click="openTrigger">展开更多</li>
                            </ul>
                        </div>
                        <div class="card-block">
                            <h1 class="border-bottom">汇报模板</h1>
                            <ul class="card-inner horizontal">
                                <li v-for="item in myTemplates" v-bind:key="item.formCode">
                                    <router-link :to="{name:'write',params:{formCode:item.formCode}}">
                                        <span :style="`background-image:url(${item.formIcon})`"></span>
                                        <p>{{item.formName}}</p>
                                    </router-link>
                                </li>
                                <li v-on:click="openPopup" class="add-btn">
                                    <a>
                                        <span>
                                            <i class="bnd-icon-plus"></i>
                                        </span>
                                        <p>添加模板</p>
                                    </a>
                                </li>
                                <li class="blank"></li>
                                <li class="blank"></li>
                            </ul>
                        </div>
                    </div>
                    <div slot="top" class="mint-loadmore-top">
                        <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span>
                        <span v-show="topStatus === 'loading'">
                            <mt-spinner type="snake" :size="20"></mt-spinner>
                        </span>
                    </div>
                </mt-loadmore>
            </div>
        </div>
        <mt-popup v-model="popupVisible" position="right" class="page-popup">
            <mt-header title="添加模板">
                <mt-button icon="back" slot="left" v-on:click="closePopup"></mt-button>
            </mt-header>
            <div class="content list-block media-list">
                <mt-loadmore :top-method="getTemplateList" @translate-change="translateChange" @top-status-change="handleTopChange" ref="loadmore1">
                    <ul>
                        <li v-for="item in myTemplates" class="border-bottom item-content" v-bind:key="item.formCode" v-bind:data-form-code="item.formCode">
                            <div class="item-media">
                                <span :style="'background-image:url('+item.formIcon+')'"></span>
                            </div>
                            <div class="item-inner">
                                <div class="item-title-row">
                                    <div class="item-title">{{item.formName}}
                                    </div>
                                </div>
                                <div class="item-subtitle">创建人： {{item.createName}}</div>
                            </div>
                            <div class="item-after">
                                <mt-button size="small" disabled>已添加</mt-button>
                            </div>
                        </li>
                        <li v-for="(item,index) in templateList" class="border-bottom item-content" v-bind:key="item.formCode">
                            <div class="item-media">
                                <span :style="'background-image:url('+item.formIcon+')'"></span>
                            </div>
                            <div class="item-inner">
                                <div class="item-title-row">
                                    <div class="item-title">{{item.formName}}
                                    </div>
                                </div>
                                <div class="item-subtitle">创建人： {{item.createName}}</div>
                            </div>
                            <div class="item-after">
                                <mt-button size="small" v-on:click.native="addTemplate(item.formName,item.formCode,index)">添加</mt-button>
                            </div>
                        </li>
                    </ul>
                    <div slot="top" class="mint-loadmore-top">
                        <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span>
                        <span v-show="topStatus === 'loading'">
                            <mt-spinner type="snake" :size="20"></mt-spinner>
                        </span>
                    </div>
                    <div slot="bottom" v-if="0">
                    </div>
                </mt-loadmore>
                <span class="no-data-tips" v-if="noData"></span>
            </div>
        </mt-popup>
    </div>
</template>
<script>
import tabBar from './tabBar.vue'
export default {
    name: 'index',
    components: {
        'tab-bar': tabBar
    },
    data() {
        return {
            popupVisible: false,
            myTemplates: [],
            myTasks: [],
            templateList: [],
            allLoaded: false,
            bottomStatus: '',
            topStatus: '',
            translate: 0,
            moveTranslate: 0,
            open: false
        }
    },
    computed: {
        noData() {
            return this.templateList.length === 0&&this.allLoaded&&this.myTemplates.length === 0
        }
    },
    filters: {
        getReceiver(createrList) {
            let receiver = []
            let count = createrList.length
            let result = ''
            for (let i = 0; i < count; i++) {
                if (i < 3) {
                    receiver.push(createrList[i].creatEmpName)
                } else {
                    break
                }
            }
            if (count < 4) {
                result = receiver.join(',')
            } else if (count > 3) {
                result = `${receiver.join(',')}等${count}人`
            }
            return result
        },
        getCountDown(deadlineTime, serverTime) {
            let deadlineTimestamp = new Date((deadlineTime || '').replace(/-/g, '/')).getTime()
            let serverTimestamp = new Date((serverTime || '').replace(/-/g, '/')).getTime()
            let rest = deadlineTimestamp - serverTimestamp
            //计算出相差天数
            let days = Math.floor(rest / (24 * 3600 * 1000))
            //计算出小时数
            // let leave1 = rest % (24 * 3600 * 1000)
            // let hours = Math.floor(leave1 / (3600 * 1000))
            // //计算相差分钟数
            // let leave2 = leave1 % (3600 * 1000)
            // let minutes = ('0' + Math.floor(leave2 / (60 * 1000))).slice(-2)
            //计算相差秒数
            // let leave3 = leave2 % (60 * 1000)
            // let seconds = ('0' + Math.round(leave3 / 1000)).slice(-2)
            if (days) {
                // return `${days}天`
                if (days === 1) {
                    return '明天'
                } else if (days === 2) {
                    return '后天'
                } else {
                    return new Date(deadlineTimestamp).format('MM-dd')
                }
            } else {
                // return `${hours}:${minutes}`
                return '今天'
            }
        }
    },
    mounted() {
        this.refresh()
    },
    methods: {
        go2Write(formCode) {
            this.$router.push({ name: 'write', params: { formCode } })
        },
        openTrigger() {
            this.open = !this.open
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
        openPopup() {
            this.popupVisible = true
            this.getTemplateList()
        },
        closePopup() {
            this.popupVisible = false
        },
        refresh() {
            this.getMyTemplate()
            this.getMyTask()
        },
        getMyTask() {
            this.$utils.ajax({
                url: '/report/reporttaskrecord/app/v3/needwritetasklist',
                loading: false,
                data: {
                    companyId: window.userInfo.companyId,
                    employeeId: window.userInfo.empId
                },
                success: (res) => {
                    if (res.httpCode === '200') {
                        this.myTasks = res.data
                    }
                }
            })
        },
        getMyTemplate() {
            this.$utils.ajax({
                url: '/report/reportmodel/app/v1/queryFormModelList',
                loading: false,
                data: {
                    comId: window.userInfo.companyId,
                    empId: window.userInfo.empId
                },
                success: (res) => {
                    if (res.httpCode === '200') {
                        this.$refs.loadmore.onTopLoaded()
                        this.myTemplates = res.data
                    }
                }
            })
        },
        getTemplateList() {
            this.$utils.ajax({
                url: '/report/reportmodel/app/v1/queryFormNotModelList',
                loading: false,
                data: {
                    comId: window.userInfo.companyId,
                    empId: window.userInfo.empId
                },
                success: (res) => {
                    if (res.httpCode === '200') {
                        this.templateList = res.data
                        this.allLoaded=true
                        _.each(this.templateList, function(item) {
                            let exItem = document.querySelector(`[data-form-code='${item.formCode}']`)
                            if (exItem) {
                                exItem.remove()
                            }
                        })
                        this.$refs.loadmore1.onTopLoaded()
                    } else {
                        this.$toast('出错了')
                    }
                }
            })
        },
        addTemplate(formName, formCode, index) {
            this.$messagebox.confirm(`是否添加 ${formName} 模板?`).then(action => {
                this.$utils.ajax({
                    url: '/report/reportmodel/app/v1/updateModelRole',
                    data: {
                        formCode,
                        empId: window.userInfo.empId
                    },
                    success: (res) => {
                        if (res.httpCode === '200') {
                            this.$toast('添加成功')
                            this.templateList.splice(index, 1)
                            this.refresh()
                        } else {
                            this.$toast('出错了')
                        }
                    }
                })
            })
        }
    }
}
</script>
<style lang="less">
.icon-clock {}

.page-index {
    .content {
        background-image: url(../assets/images/index_banner.png);
        background-size: 100%;
        background-repeat: no-repeat;
        .inner {
            overflow: auto;
            padding-top: 90px;
        }
    }
    .mint-loadmore {
        min-height: 100%;
    }
    .card-block {
        background-color: #fff;
        margin-left: 10px;
        margin-right: 10px;
        box-shadow: 0 4px 8px rgba(134, 134, 134, 0.3);
        border-radius: 8px;
        margin-bottom: 12px;
        >h1 {
            height: 44px;
            line-height: 44px;
            padding-left: 15px;
            font-size: 16px;
        }
        .card-inner.vertical {
            li:nth-child(3)~li:not(.open-btn) {
                display: none;
            }
            li:nth-last-child(2):after {
                display: none;
            }
            .open-btn {
                text-align: center;
                height: 36px;
                line-height: 36px;
                font-size: 14px;
                color: #666;
            }
            .item-content:nth-child(1),
            .item-content:nth-child(2),
            .item-content:nth-child(3) {
                &+.open-btn {
                    display: none;
                }
            }
            .item-content:nth-child(3):nth-last-child(2):after {
                display: none;
            }
        }
        .card-inner.vertical.open {
            li:nth-child(3)~li:not(.open-btn) {
                display: flex;
            }
            .open-btn {
                display: none;
            }
            li:nth-last-child(2):after {
                display: none;
            }
        }
        .card-inner.horizontal {
            overflow: auto;
            li {
                width: 33.33%;
                height: 100px;
                float: left;
                list-style: none;
                text-align: center;
                font-size: 16px;
                position: relative;
                &:before {
                    position: absolute;
                    z-index: 15;
                    top: 0;
                    right: 0;
                    bottom: auto;
                    left: auto;
                    display: block;
                    width: 1px;
                    height: 100%;
                    content: '';
                    transform-origin: 50% 0;
                    background-color: #e7e7e7;
                }
                &:after {
                    position: absolute;
                    z-index: 15;
                    top: 0;
                    right: auto;
                    bottom: auto;
                    left: 0;
                    display: block;
                    width: 100%;
                    height: 1px;
                    content: '';
                    transform-origin: 50% 0;
                    background-color: #e7e7e7;
                }
                &:nth-child(1):after,
                &:nth-child(2):after,
                &:nth-child(3):after,
                &:nth-child(3n):before {
                    display: none;
                }
                @media only screen and (-webkit-min-device-pixel-ratio: 2) {
                    &:after {
                        transform: scaleY(0.5);
                    }
                    &:before {
                        transform: scaleX(0.5);
                    }
                }
                a {
                    color: @mainColor;
                }
                p {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                >a>span {
                    display: block;
                    width: 36px;
                    height: 36px;
                    margin-left: auto;
                    margin-right: auto;
                    margin-top: 18px;
                    margin-bottom: 12px;
                    background-size: cover;
                }
                &.add-btn {
                    a>span {
                        line-height: 36px;
                        color: @supportColor;
                        border: 1px dashed @supportColor;
                        border-radius: 5px;
                    }
                }
                &.add-btn:nth-child(3n)~li,
                &.add-btn:nth-child(3n-1)+li {
                    display: none;
                }
            }
        }
    }
    &+.page-popup {
        .item-media span {
            width: 32px;
            height: 32px;
            border-radius: 0;
            background-color: transparent;
        }
        .list-block ul {
            background-color: transparent;
        }
        li.item-content {
            box-shadow: 0 1px 10px #e8e8e8;
            padding-left: 12px;
            padding-right: 12px;
            border-radius: 5px;
            min-height: 60px;
            margin: 12px 15px;
            background-color: #fff;
            &:after,
            .item-inner:after {
                display: none;
            }
            .item-subtitle {
                color: @gary;
                margin-top: 6px;
            }
            button {
                width: 70px;
                border: 1px solid @supportColor;
                background-color: transparent;
                color: @supportColor;
                &[disabled] {
                    border-color: @gary;
                    color: @gary;
                }
            }
        }
    }
    .mint-cell .mint-cell-title>i.icon-font,
    i.icon-font {
        font-size: 14px;
        background-color: @supportColor;
        color: #fff;
        display: inline-block;
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        border-radius: 5px;
    }

    .mint-cell .mint-cell-title>i.bnd-icon-plus {
        display: inline-block;
        width: 32px;
        height: 32px;
        line-height: 32px;
        border: 1px solid @supportColor;
        border-radius: 5px;
        font-size: 16px;
        text-align: center;
        color: @supportColor;
        margin-right: 5px;
        &+.mint-cell-text {
            line-height: 1;
            vertical-align: middle;
        }
    }

    .item-media span {
        background-color: transparent;
        border-radius: 0;
    }

    .item-inner {
        padding-right: 0!important;
    }

    .item-after {
        padding-right: 15px;
        width: 80px;
        max-height: initial!important;
        button {
            margin: 0 auto;
        }
    }

    .list-block .item-content {
        min-height: 70px;
        .item-inner {
            margin-left: 20px;
            padding-top: 15px;
        }
        .item-title {
            font-size: 16px;
        }
        .item-inner:after {
            display: none;
        }
        .item-after {
            justify-content: flex-end;
            color: @gary;
            line-height: 22px;
            .icon-clock {
                margin: 0 auto;
                margin-bottom: 5px;
                font-size: 16px;
            }
            text-align: center;
            font-size: 12px;
        }
    }

    .item-subtitle {
        color: @grayFont;
    }
}
</style>