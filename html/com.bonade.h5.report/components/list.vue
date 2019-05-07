<template>
    <div>
        <div class="page-list">
            <mt-header title="看汇报">
                <mt-button icon="back" slot="left" v-on:click="exit"></mt-button>
                <mt-button v-show="isNotReadTap" icon="more" slot="right" ref="button" v-on:click="openMenuPopup"></mt-button>
                <mt-button v-show="isAllTap" slot="right" v-on:click="openFilterPopup">
                    <i class="icon-filter"></i>
                </mt-button>
            </mt-header>
            <tab-bar :selectedIndex="1" ref="tabBar" v-on:change="changeTabNumber"></tab-bar>
            <div class="content">
                <mt-navbar v-model="selected">
                    <mt-tab-item v-for="item in tabs" :id="item.id" v-bind:key="item.id">{{item.name}}
                        <span v-if="item.id==='notRead'">({{notReadNum}})</span>
                    </mt-tab-item>
                </mt-navbar>
                <div class="filter-bar" v-if="isFilt&&isAllTap">
                    <p>{{filterWord}}</p>
                    <span v-on:click="resetFilter">
                        <i class="bnd-icon-close"></i>
                    </span>
                </div>
                <div class="status-bar" v-if="timer">
                    <p>全部已读处理中</p>
                    <mt-spinner type="snake" :size="20"></mt-spinner>
                </div>
                <mt-tab-container v-model="selected" v-scroll-save>
                    <mt-tab-container-item v-for="(item,index) in tabs" v-bind:id="item.id" v-bind:key="item.id">
                        <mt-loadmore :top-method="refresh" @translate-change="translateChange" @top-status-change="handleTopChange" :bottom-method="loadMore" @bottom-status-change="handleBottomChange" :bottom-all-loaded="list[index].allLoaded" ref="loadmore" :autoFill="false">
                            <ul>
                                <li v-for="(item,i) in list[index].data" v-bind:key="item.id" v-bind:class="getReadClass(item)" v-on:click="go2Read(item.data_code,i)">
                                    <div class="item-header">
                                        <span v-on:click.stop="filterByUser({id:item.sendUserId,name:item.sendEmp})" :class="{'red-dot':item.isRead==='0'}" :style="`background-image:url(${item.userLogo||item.commentUserLogo||'./static/img/default_avatar.png'});`"></span>
                                        <div>
                                            <h1>
                                                <span v-if="isCommentTap">{{item.commentEmpName}}</span>
                                                <span v-else>{{item.empName||item.sendEmp}}的{{item.formName}}</span>
                                                <span v-if="isCommentTap">{{item.commentCreateTime||item.createTime|friendlyTime}}</span>
                                            </h1>
                                            <p class="comment" v-if="isCommentTap">{{decodeURI(item.comment)}}</p>
                                            <p v-else>{{item.createTime||item.commentCreateTime|friendlyTime}}</p>
                                            <div class="report-detail" v-if="isCommentTap">
                                                <h1>{{item.empName||item.sendEmp}}的{{item.formName}}</h1>
                                                <div>
                                                    <p v-for="entry in item.reportDataDetaillist" v-if="entry.fieldType!=='img'&&entry.fieldType!=='file'&&entry.fieldValue!==''" v-bind:key="entry.id">
                                                        {{entry.fieldName}}：{{entry.fieldValue}}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="item-content" v-if="!isCommentTap">
                                        <div :class="{'max':!getFirstImage(item.reportDataDetaillist).fieldValue}">
                                            <p :class="entry.class" v-for="entry in getReportItem( item.reportDataDetaillist).list" v-bind:key="entry.id">
                                                <span>{{entry.fieldName}}：</span>{{entry.fieldValue}}</p>
                                        </div>
                                        <div class="img-wrapper" v-if="getFirstImage(item.reportDataDetaillist).fieldValue">
                                            <span :style="`background-image:url(${getFirstImage(item.reportDataDetaillist).fieldValue});`"></span>
                                        </div>
                                    </div>
                                    <div class="item-info" v-if="!isCommentTap">
                                        <span v-if="item.notReadNum!=='0'">
                                            <i class="icon-check empty"></i>已读({{item.readNum}})</span>
                                        <span v-else>
                                            <i class="icon-check"></i>
                                            全部已读</span>
                                        <span>
                                            <i class="icon-comment"></i>评论({{item.commentNum}})</span>
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
        <mt-popup v-model="menuPopupVisible" popup-transition="popup-fade" class="menu-popup">
            <ol>
                <li v-on:click="doReadAll">
                    <i class="icon-all-read"></i>全部标记为已读
                </li>
            </ol>
        </mt-popup>
        <mt-popup v-model="popupVisible" position="bottom">
            <div class="bar bar-nav">
                <button class="button pull-left" v-on:click="closePicker">关闭</button>
                <button class="button pull-right" v-on:click="pick">确定</button>
            </div>
            <mt-picker ref="statusPicker" :slots="statusSlots" v-show="soltsVisible==='status'" value-key="name"></mt-picker>
            <mt-picker ref="typePicker" :slots="typeSlots" v-show="soltsVisible==='type'" value-key="formName"></mt-picker>
            <mt-picker ref="timePicker" :slots="timeSlots" v-show="soltsVisible==='time'" value-key="name"></mt-picker>
            <mt-picker ref="companyPicker" :slots="companySlots" v-show="soltsVisible==='company'" value-key="companyName"></mt-picker>
        </mt-popup>
        <!-- v-show="soltsVisible==='company'" -->
        <mt-popup v-model="filterPopupVisible" class="page-popup" position="right">
            <mt-header title="筛选">
                <mt-button icon="back" slot="left" v-on:click="closeFilterPopup"></mt-button>
            </mt-header>
            <div class="mint-tabbar">
                <div class="button-wrapper">
                    <button v-on:click="closeFilterPopup">取消</button>
                    <button v-on:click="doFilt">确定</button>
                </div>
            </div>
            <div class="content">
                <mt-cell title="企业" :value="filterPopupData.company.companyName" is-link v-on:click.native="openPicker('company')"></mt-cell>
                <mt-cell title="模板类型" :value="filterPopupData.type.formName" is-link v-on:click.native="openPicker('type')"></mt-cell>
                <a class="mint-cell">
                    <h1 class="filter-title">按发送人筛选</h1>
                    <div class="employee-chosen-list border-bottom">
                        <ul>
                            <li v-for="(item, index) in employees" v-bind:key="item.id">
                                <span style="background-image: url(./static/img/default_avatar.png)">
                                    <i class="bnd-icon-close" v-on:click="doDelete(employees,index)"></i>
                                </span>
                                <p>{{item.name}}</p>
                            </li>
                            <li class="add-btn" v-on:click="selectEmployees">
                                <span class="bnd-icon-plus"></span>
                            </li>
                        </ul>
                    </div>
                </a>
                <mt-cell title="时间" :value="filterPopupData.time.name" is-link v-on:click.native="openPicker('time')"></mt-cell>
                <a class="mint-cell">
                    <div class="mint-cell-wrapper">
                        <div class="mint-cell-title">
                            <span class="mint-cell-text">未读</span>
                        </div>
                        <div class="mint-cell-value is-link">
                            <mt-switch v-model="filterPopupData.isUnRead"></mt-switch>
                        </div>
                    </div>
                </a>
            </div>
        </mt-popup>
    </div>
</template>
<script>
import tabBar from './tabBar.vue'
export default {
    name: 'list',
    components: {
        'tab-bar': tabBar
    },
    data() {
        return {
            tabs: [{ id: 'all', name: '全部' }, { id: 'notRead', name: '未读' }, { id: 'ISend', name: '我发出的' }, { id: 'comment', name: '评论' }],
            selected: 'all',
            popupVisible: false,
            menuPopupVisible: false,
            filterPopupVisible: false,
            soltsVisible: 'status',
            employees: [],
            notReadNum: 0,
            list: [{
                    data: [],
                    allLoaded: false,
                    row: 5,
                    pageNum: 1
                }, {
                    data: [],
                    allLoaded: false,
                    row: 5,
                    pageNum: 1
                }, {
                    data: [],
                    allLoaded: false,
                    row: 5,
                    pageNum: 1
                },
                {
                    data: [],
                    allLoaded: false,
                    row: 5,
                    pageNum: 1
                }
            ],
            bottomStatus: '',
            topStatus: '',
            translate: 0,
            moveTranslate: 0,
            filterPopupData: {
                company: {
                    companyId: '',
                    companyName: '全部'
                },
                type: { formCode: '', formName: '所有类型' },
                time: { code: '', name: '所有时间' },
                isUnRead: false,
                senders: '',
                createUser: {}
            },
            filterSetting: {
                'all': {
                    url: '/report/reportdata/app/v2/selectallreport',
                    createUserID: '',
                    isUnRead: false,
                    senders: '',
                    company: {
                        companyId: '',
                        companyName: '全部'
                    },
                    type: { formCode: '', formName: '所有类型' },
                    time: { code: '', name: '所有时间' },
                    createUser: {}
                },
                'notRead': {
                    url: '/report/reportdata/app/v2/selectnotreadreport'
                },
                'ISend': {
                    url: '/report/reportdata/app/v2/selectsendbymereport'
                },
                'comment': {
                    url: '/report/reportdata/app/v3/selectisendorresivedcomment'
                }
            },
            filterWord: '',
            isFilt: false,
            statusSlots: [{
                flex: 1,
                values: [{ code: '', name: '所有状态' }, { code: '1', name: '已读' }, { code: '0', name: '未读' }],
                className: 'slot1'
            }],
            typeSlots: [{
                flex: 1,
                defaultIndex: 1,
                values: [{ formCode: '', formName: '所有类型' }],
                className: 'slot1'
            }],
            timeSlots: [{
                flex: 1,
                values: [{ code: '', name: '所有时间' }, { code: '1', name: '今天' }, { code: '2', name: '最近一周' }, { code: '3', name: '最近一个月' }],
                className: 'slot1'
            }],
            companySlots: [{
                flex: 1,
                defaultIndex: 1,
                values: [{
                    companyId: '',
                    companyName: '全部'
                }],
                className: 'slot1'
            }],
            timer: 0
        }
    },
    computed: {
        noData() {
            return this.list[this.tabActiveIndex].data.length === 0 && this.list[this.tabActiveIndex].allLoaded
        },
        isCommentTap() {
            return this.selected === 'comment'
        },
        isAllTap() {
            return this.selected === 'all'
        },
        isNotReadTap() {
            return this.selected === 'notRead'
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
        filterSettingSenders() {
            let result = []
            this.employees.map(function(employee) {
                result.push(employee.id)
            })
            return result.join(',')
        },
        filterSettingSendersName() {
            let result = []
            this.employees.map(function(employee) {
                result.push(employee.name)
            })
            return result.join(',')
        }
    },
    watch: {
        filterSettingSenders(val, odlVal) {
            this.$set(this.filterPopupData, 'senders', val)
        },
        tabActiveIndex(val, odlVal) {
            if (this.list[val].data.length === 0) {
                this.refresh()
            }
        }
    },
    methods: {
        isMyComment(commentEmpId) {
            return commentEmpId * 1 === window.userInfo.userId * 1
        },
        doReadAll() {
            this.closeMenuPopup()
            this.timer = setInterval(() => {
                this.$refs.tabBar.getTabBadges()
            }, 1001)
            this.$utils.ajax({
                url: '/report/reportdata/app/v3/markreaded',
                loading: false,
                success: res => {}
            })
        },
        closeMenuPopup() {
            this.menuPopupVisible = false
        },
        openMenuPopup() {
            this.menuPopupVisible = true
        },
        changeTabNumber(tabData) {
            this.notReadNum = tabData[1].count
            if (this.notReadNum === 0 && this.timer) {
                clearInterval(this.timer)
                this.timer = 0
                this.selected = 'notRead'
                this.refresh()
            }
        },
        getReadClass(item) {
            let className = {}
            let isMyReport=item.sendUserId*1===window.userInfo.userId*1
            if(isMyReport){
            }else if (item.IRead === '1' && this.isAllTap) {
                className = {
                    'read': true
                }
            } else if (item.INotRead === '1' && this.isAllTap) {
                className = {
                    'unread': true
                }
            }
            return className
        },
        filterByUser(user) {
            if ((user.id * 1 === window.userInfo.userId * 1) || this.isCommentTap) {
                return false
            }
            this.selected = 'all'
            this.filterPopupData.createUser = user
            this.$nextTick(() => {
                this.doFilt()
            })
        },
        getReportItem(items) {
            let temp = []
            for (let i = 0; i < items.length; i++) {
                if (items[i].fieldType !== 'img' && items[i].fieldType !== 'file') {
                    if (temp.length === 4) {
                        break
                    }
                    if (items[i].fieldValue === '') {
                        continue
                    }
                    temp.push(items[i])
                }
            }
            temp.map((item) => {
                if (temp.length === 4) {
                    item.class = { 'line-clamp-1': true }
                } else if (temp.length === 2 || temp.length === 3) {
                    item.class = { 'line-clamp-2': true }
                } else if (temp.length === 1) {
                    item.class = { 'line-clamp-4': true }
                }
            })
            return { list: temp }
        },
        getFirstImage(items) {
            let img = {}
            for (let i = 0; i < items.length; i++) {
                if (items[i].fieldType === 'img') {
                    img = items[i]
                    break
                }
            }
            return img
        },
        doFilt() {
            _.extend(this.filterSetting.all, this.filterPopupData)
            let filterArray = []
            if (this.filterPopupData.company.companyId) {
                filterArray.push(this.filterPopupData.company.companyName)
            }
            if (this.filterPopupData.type.formCode) {
                filterArray.push(this.filterPopupData.type.formName)
            }
            if (this.filterSettingSendersName) {
                filterArray.push(this.filterSettingSendersName)
            }
            if (this.filterPopupData.createUser.name) {
                filterArray.push(this.filterPopupData.createUser.name)
            }
            if (this.filterPopupData.time.code) {
                filterArray.push(this.filterPopupData.time.name)
            }
            if (this.filterPopupData.isUnRead) {
                filterArray.push('未读')
            }
            if (filterArray.length !== 0) {
                this.isFilt = true
                this.filterWord = filterArray.join('-')
                this.refresh()
            }
            this.closeFilterPopup()
        },
        selectEmployees() {
            this.$employeePicker({
                companyId: this.filterPopupData.company.companyId,
                title: '选择发送人',
                values: this.employees,
                multiple: true,
                callback: (res) => {
                    console.log(res)
                    this.employees = res
                }
            })
        },
        doDelete(arr, index) {
            arr.splice(index, 1)
        },
        getCompanyList() {
            this.$utils.ajax({
                url: '/report/reportcopytodata/app/v2/getcopytotypecompany',
                data: {
                    companyId: window.userInfo.companyId
                },
                success: (res) => {
                    if (res.httpCode === '200') {
                        this.$refs.companyPicker.setSlotValues(0, [this.$refs.companyPicker.getSlotValues(0)[0]].concat(res.data))
                        let index = 0
                        let slots = this.$refs.companyPicker.getSlotValues(0)
                        console.log(slots)
                        for (let i = 0; i < slots.length; i++) {
                            if (slots[i].companyId * 1 === this.filterPopupData.company.companyId * 1) {
                                index = i
                                break
                            }
                        }
                        this.$refs.companyPicker.setSlotValue(0, slots[index])
                    } else {
                        this.$toast('出错了')
                    }
                }
            })
        },
        openFilterPopup() {
            this.getCompanyList()
            this.filterPopupVisible = true
        },
        closeFilterPopup() {
            this.filterPopupVisible = false
        },
        go2Read(dataCode, i) {
            if (this.list[this.tabActiveIndex].data[i].sendUserId * 1 !== window.userInfo.userId * 1) {
                this.$set(this.list[this.tabActiveIndex].data[i], 'IRead', '1')
            }
            let query = {
                dataCode,
                pageFrom: this.selected
            }
            if (this.selected === 'all') {
                query.companyId = this.filterSetting.all.company.id || ''
                query.formCode = this.filterSetting.all.type.formCode
                query.dateType = this.filterSetting.all.time.code
                query.isRead = this.filterSetting.all.isUnRead ? '0' : ''
                query.senders = this.filterSetting.all.senders
                query.createUserID = this.filterSetting.all.createUser.id
            }
            this.$router.push({ name: 'read', query })
        },
        closePicker() {
            this.popupVisible = false
        },
        resetFilter() {
            this.isFilt = false
            this.filterPopupData.company = { companyId: '', companyName: '全部' }
            this.filterPopupData.createUser = {}
            this.filterPopupData.type = { formCode: '', formName: '所有类型' }
            this.filterPopupData.time = { code: '', name: '所有时间' }
            this.filterPopupData.isUnRead = false
            this.filterPopupData.senders = ''
            this.employees = []
            _.extend(this.filterSetting.all, this.filterPopupData)
            this.refresh()
        },
        pick() {
            if (this.soltsVisible === 'company') {
                this.filterPopupData.company = this.$refs.companyPicker.getValues()[0]
                this.getTypeList()
                this.employees = []
                this.$set(this.filterPopupData, 'type', { formCode: '', formName: '所有类型' })
            } else if (this.soltsVisible === 'type') {
                this.filterPopupData.type = this.$refs.typePicker.getValues()[0]
            } else if (this.soltsVisible === 'time') {
                this.filterPopupData.time = this.$refs.timePicker.getValues()[0]
            }
            this.closePicker()
        },
        openPicker(type) {
            console.log(type)
            this.soltsVisible = type
            if (this.soltsVisible === 'status') {
                let index = 0
                let slots = this.$refs.statusPicker.getSlotValues(0)
                for (let i = 0; i < slots.length; i++) {
                    if (slots[i].code === this.filterSetting[this.selected].status.code) {
                        index = i
                    }
                }
                this.$refs.statusPicker.setSlotValue(0, slots[index])
            } else if (this.soltsVisible === 'type') {
                this.getTypeList()
            } else if (this.soltsVisible === 'time') {
                let index = 0
                let slots = this.$refs.timePicker.getSlotValues(0)
                for (let i = 0; i < slots.length; i++) {
                    if (slots[i].code === this.filterSetting[this.selected].time.code) {
                        index = i
                    }
                }
                this.$refs.timePicker.setSlotValue(0, slots[index])
            }
            this.popupVisible = true
        },
        doSearch: _.throttle(function(keyword) {
            console.log(keyword)
            this.filterSetting[this.selected].keyword = keyword
            this.refresh()
        }, 1000),
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
        getTypeList() {
            this.$utils.ajax({
                url: '/report/reportcopytodata/app/v2/getcopytotypelist',
                data: {
                    employeeId: window.userInfo.empId,
                    companyId: this.filterPopupData.company.companyId
                },
                success: (res) => {
                    if (res.httpCode === '200') {
                        this.$refs.typePicker.setSlotValues(0, [this.$refs.typePicker.getSlotValues(0)[0]].concat(res.data))
                        let index = 0
                        let slots = this.$refs.typePicker.getSlotValues(0)
                        for (let i = 0; i < slots.length; i++) {
                            if (slots[i].formCode === this.filterSetting[this.selected].type.formCode) {
                                index = i
                            }
                        }
                        this.$refs.typePicker.setSlotValue(0, slots[index])
                    } else {
                        this.$toast('出错了')
                    }
                }
            })
        },
        refresh() {
            this.$refs.tabBar.getTabBadges()
            this.loadMore(true)
        },
        loadMore(isRefresh) {
            let i = this.tabActiveIndex
            if (isRefresh) {
                this.list[i].pageNum = 1
            }
            let data = {
                companyId: this.filterSetting.all.company.companyId,
                employeeId: window.userInfo.empId,
                pageNum: this.list[i].pageNum,
                row: this.list[i].row
            }
            if (this.isAllTap) {
                data.formCode = this.filterSetting.all.type.formCode
                data.dateType = this.filterSetting.all.time.code
                data.isRead = this.filterSetting.all.isUnRead ? '0' : ''
                data.senders = this.filterSetting.all.senders
                data.createUserID = this.filterSetting.all.createUser.id || ''
            }
            this.$utils.ajax({
                url: this.filterSetting[this.selected].url,
                loading: false,
                data,
                success: (res) => {
                    if (res.httpCode === '200') {
                        if (isRefresh) {
                            this.$set(this.list[i], 'data', res.data.records)
                            this.$refs.loadmore[i].onTopLoaded()
                        } else {
                            this.$set(this.list[i], 'data', this.list[i].data.concat(res.data.records))
                        }
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
        }
    },
    mounted() {
        this.refresh()
    },
    activated() {
        this.$refs.tabBar.getTabBadges()
        if (this.$route.params.deletedDataCode) {
            for (let i = 0; i < this.list[this.tabActiveIndex].data.length; i++) {
                if (this.list[this.tabActiveIndex].data[i].data_code === this.$route.params.deletedDataCode) {
                    console.log('删除')
                    this.$delete(this.list[this.tabActiveIndex].data, i)
                }
            }
        }
        if (this.selected === 'notRead' || this.selected === 'comment') {
            this.refresh()
        } else {
            setTimeout(() => { document.querySelector('.mint-tab-container').scrollTop = document.querySelector('.mint-tab-container').getAttribute('data-y') }, 500)
        }
    }
}
</script>
<style lang="less">
.icon-all-read {
    display: inline-block;
    width: 18px;
    height: 19px;
    background-image: url(../assets/images/icon_all_read.png);
    background-size: cover;
    background-position: center;
    vertical-align: middle;
}

.icon-check {
    position: relative;
    display: inline-block;
    border: 1px solid #acacac;
    background-color: #acacac;
    border-radius: 100%;
    position: relative;
    width: 16px;
    height: 16px;
    vertical-align: top;
    &:after {
        border: 1px solid #fff;
        transform: rotate(45deg) scale(1);
        border-left: 0;
        border-top: 0;
        content: " ";
        top: 2px;
        left: 5px;
        position: absolute;
        width: 4px;
        height: 8px;
    }
    &.empty {
        background-color: #fff;
    }
}

.icon-comment {
    display: inline-block;
    vertical-align: 5px;
    color: #fff;
    text-align: center;
    line-height: 5px;
    border-radius: 2px;
    height: 12px;
    width: 16px;
    background-color: #acacac;
    position: relative;
    &:after {
        content: "…"
    }
    &:before {
        position: absolute;
        content: "";
        display: block;
        width: 0;
        height: 0;
        bottom: -3px;
        border-width: 5px;
        border-style: solid;
        border-color: transparent transparent transparent #acacac;
    }
}

.mint-popup {
    width: 100%;
}

.page-list~.page-popup {
    a.mint-cell {
        margin: 10px 0;
    }
}

.page-list {
    .mint-tabbar .mint-tab-item {
        .mint-badge {
            position: absolute;
            top: 5px;
        }
    }

    .mint-navbar .mint-tab-item {
        padding: 14px 0;
        font-size: 14px!important;
        .mint-tab-item-label {
            font-size: 14px;
        }
    }
    .mint-tab-container {
        height: calc(~"100% - 42px");
    }
    .filter-bar,
    .status-bar {
        display: flex;
        height: 35px;
        line-height: 35px;
        background-color: #fdf8ed;
        font-size: 14px;
        color: @supportColor;
        padding-left: 10px;
        padding-right: 5px;
        justify-content: space-between;
        p {
            width: 90%;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        span> {
            margin-top: 7px;
        }
        span {
            padding: 0 10px;
            font-size: 24px;
        }
    }

    .filter-bar~.mint-tab-container {
        height: calc(~"100% - 77px");
    }
    .list-content {
        height: calc(~"100% - 114px");
        position: relative;
    }

    .mint-tab-container {
        ul {
            list-style: none;
        }
        li {
            margin: 12px;
            border-radius: 5px;
            position: relative;
            box-shadow: 0 1px 10px #e8e8e8;
            background-color: #fff;
            margin-bottom: 10px;
            padding: 10px 15px;
            &.read {
                &:after {
                    font-family: 'icomoon' !important;
                    content: "\e903";
                    font-size: 60px;
                    color: @gary;
                    position: absolute;
                    right: 10px;
                    top: 0;
                }
            }
            &.unread {
                &:after {
                    font-family: 'icomoon' !important;
                    content: "\e900";
                    font-size: 60px;
                    color: @red;
                    position: absolute;
                    right: 10px;
                    top: 0;
                }
            }
            a {
                color: @mainColor;
            }

            .item-header {
                font-size: 15px;
                display: flex;
                align-items: flex-start;
                margin-bottom: 10px;
                .report-detail {
                    margin-top: 5px;
                    font-size: 14px;
                    line-height: 16px;
                    background-color: #f5f5f5;
                    padding: 8px;
                    border-radius: 5px;
                    color: #666;
                    >div {
                        display: -webkit-box;
                        overflow: hidden;
                        max-height: 34px;
                        text-overflow: ellipsis;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }
                    h1 {
                        color: @mainColor;
                        margin-bottom: 2px;
                    }
                }
                >div {
                    width: 80%;
                }
                >span {
                    display: block;
                    background-size: cover;
                    background-color: @mainColor;
                    height: 44px;
                    width: 44px;
                    border-radius: 50%;
                    margin-right: 10px;
                    position: relative;
                    &.red-dot:after {
                        content: "";
                        display: block;
                        width: 10px;
                        height: 10px;
                        border-radius: 50%;
                        background-color: @red;
                        position: absolute;
                        right: 0;
                    }
                }
                h1 {
                    margin-top: 5px;
                    margin-bottom: 8px;
                    font-weight: normal;
                    display: flex;
                    justify-content: space-between;
                    span:nth-child(2) {
                        font-size: 14px;
                        color: @gary;
                    }
                }
                p {
                    font-size: 12px;
                    color: @gary;
                    &.comment {
                        font-size: 14px;
                        line-height: 18px;
                        word-break: break-all;
                    }
                }
            }
            .item-content {
                font-size: 14px;
                display: flex;
                justify-content: space-between;
                >div:not(.img-wrapper) {
                    width: 70%;
                    max-height: 88px;
                    overflow: hidden;
                    &.max {
                        width: 100%;
                    }
                    p {
                        line-height: 23px;
                        width: 100%;
                        display: -webkit-box;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        -webkit-box-orient: vertical;
                        &.line-clamp-1 {
                            max-height: 22px;
                            -webkit-line-clamp: 1;
                        }
                        &.line-clamp-2 {
                            max-height: 44px;
                            -webkit-line-clamp: 2;
                        }
                        &.line-clamp-4 {
                            max-height: 88px;
                            -webkit-line-clamp: 4;
                        }
                        span {
                            color: @gary;
                        }
                    }
                }
                .img-wrapper {
                    width: 90px;
                    min-width: 90px;
                    display: block;
                    overflow: auto;
                    span {
                        background-size: cover;
                        float: left;
                        display: block;
                        width: 90px;
                        height: 90px;
                        border-radius: 5px;
                        background-color: @mainColor;
                    }
                }
            }
            .item-info {
                height: 16px;
                font-size: 12px;
                margin-top: 10px;
                color: @gary;
                span {
                    margin-right: 25px;
                }
                i {
                    margin-right: 5px;
                }
            }
        }
    }
}

.page-list~.menu-popup {
    width: 200px;
    border-radius: 3px;
    transform: initial;
    right: 2px;
    top: 71px;
    padding: 9px;
    max-width: 200px;
    &:before {
        display: inline-block;
        width: 0;
        height: 0;
        border: solid transparent;
        border-width: 7px;
        border-bottom-color: #fff;
        content: "";
        position: absolute;
        top: -14px;
        right: 10px;
    }
    ol>li {
        list-style: none;
        font-size: 16px;
        height: 30px;
        line-height: 30px;
        i {
            margin-right: 10px;
        }
    }
}

.page-list~.page-popup {
    .filter-title {
        background-color: #fff;
        font-weight: normal;
        padding-top: 10px;
    }
    .mint-tabbar {
        display: block;
        height: initial;
        background-color: #FDF8ED;
        .button-wrapper {
            padding: 0;
            display: flex;
            align-items: center;
            height: 48px;
            padding: 0 12px;
            button {
                display: block;
                border-radius: 5px;
                width: 50%;
                flex: 1;
                border: none;
                height: 34px;
                font-size: 14px;
                background-color: @supportColor;
                color: @normalFont;
                &:nth-child(1) {
                    margin-right: 20px;
                    background-color: #fff;
                    border: 1px solid @gary;
                    color: @gary;
                }
            }
        }
    }
}
</style>