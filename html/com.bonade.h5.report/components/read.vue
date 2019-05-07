<template>
    <div>
        <div class="page-read" ref="main">
            <mt-header :title="title">
                <mt-button icon="back" slot="left" v-on:click="goBackOrExit"></mt-button>
                <mt-button slot="right" v-on:click="openSheet" v-if="isMyReport">更多</mt-button>
            </mt-header>
            <div class="content" v-bind:style="{paddingBottom:height+'px'}" v-show="!data.loading">
                <!--                                 <div class="pagination border-bottom" v-if="paginationVisible">
                    <span v-if="data.previous" class="previous" v-on:click="jump(data.previous.data_code)">{{data.previous.sendEmp}}的{{data.previous.formName}}</span>
                    <span v-else class="previous none">没有上一篇了</span>
                    <span v-if="data.next" class="next" v-on:click="jump(data.next.data_code)">{{data.next.sendEmp}}的{{data.next.formName}}</span>
                    <span v-else class="next none">没有下一篇了</span>
                </div> -->
                <div class="header border-bottom">
                    <span :style="`background-image: url(${avatar});`"></span>
                    <div>
                        <h1>{{data.senderInfoInfo.name_}}</h1>
                        <p>{{data.senderInfoInfo.createTime}}</p>
                    </div>
                </div>
                <div class="main">
                    <div class="list-content border-bottom">
                        <ul>
                            <li v-for="item in data.dataDetailList" v-bind:key="item.id" v-if="item.fieldType!=='img'&&item.fieldType!=='file'">
                                <h1>{{item.fieldName}}</h1>
                                <div>
                                    <p v-for="(p,index) in (item.fieldValue||'').split('\n')" v-bind:key="index">{{p}}</p>
                                </div>
                            </li>
                            <li v-if="images.length">
                                <h1>图片</h1>
                                <ul>
                                    <li class="img-item" v-on:click="show(index)" v-for="(item,index) in images" v-bind:key="item.src">
                                        <span v-bind:style="`background-image:url(${item.src});`"></span>
                                    </li>
                                </ul>
                            </li>
                            <li v-if="fileList.length">
                                <h1>附件</h1>
                                <ul>
                                    <li class="file-item" v-for="(item,index) in fileList" v-bind:key="index">
                                        <i :class="getFileIcon(item.name)"></i>
                                        <a v-on:click="openDocument(item)">{{item.name}}</a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div class="reader-wrapper border-bottom">
                        <mt-navbar v-model="selected">
                            <mt-tab-item id="read" v-if="data.readTotal!=='0'">
                                <span style="font-size: 14px;">已读 ({{data.readTotal}})</span>
                            </mt-tab-item>
                            <mt-tab-item id="unread" v-if="data.notReadTotal!=='0'">
                                <span style="font-size: 14px;">未读 ({{data.notReadTotal}})</span>
                            </mt-tab-item>
                        </mt-navbar>
                        <mt-tab-container v-model="selected">
                            <mt-tab-container-item id="read">
                                <ul>
                                    <li v-for="item in data.readList" v-bind:key="item.employee_name">
                                        <span :style="`background-image:url(${!item.userLogo?'./static/img/default_avatar.png':item.userLogo});`"></span>
                                        <p>{{item.employee_name}}</p>
                                    </li>
                                </ul>
                            </mt-tab-container-item>
                            <mt-tab-container-item id="unread">
                                <ul>
                                    <li v-for="item in data.notReadList" v-bind:key="item.employee_name">
                                        <span :style="`background-image:url(${!item.userLogo?'./static/img/default_avatar.png':item.userLogo});`"></span>
                                        <p>{{item.employee_name}}</p>
                                    </li>
                                </ul>
                            </mt-tab-container-item>
                        </mt-tab-container>
                    </div>
                    <div class="comment-wrapper" v-if="data.commentList.length">
                        <h1>评论 ({{data.commentList.length}})</h1>
                        <ul>
                            <li v-for="(item,index) in data.commentList" v-bind:key="index">
                                <span :style="`background-image:url(${!item.userLogo?'./static/img/default_avatar.png':item.userLogo});`"></span>
                                <div>
                                    <h1>
                                        <span>{{item.employee_name}}</span>
                                        <span>{{item.create_time|friendlyTime}}</span>
                                    </h1>
                                    <p>{{decodeURI(item.comment)}}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <!-- v-if="!isMyReport" -->
            <div v-transfer-dom class="reply-wrapper  border-top" v-bind:style="{height:height+'px'}" :class="className">
                <div class="inner">
                    <button class="prev-btn" v-on:click="jump((data.previous||{}).data_code)" :class="{'none':(data.previous||{}).data_code===undefined}">上一页</button>
                    <form v-on:click="onclick"><textarea ref="textarea" v-model="reply" placeholder="做得不错，请再接再励！" maxlength="200" v-on:focus="onfocus" v-on:blur="onblur" :readonly="isGtIOS12"></textarea>
                    </form>
                    <button class="next-btn" v-on:click="jump((data.next||{}).data_code)" :class="{'none':((data.next||{}).data_code)===undefined}">下一页</button>
                </div>
                <div class="foot">
                    <span>已输入：{{reply.length}}/200</span>
                    <button class="send-btn" v-on:click="doSubmit">提交</button></div>
            </div>
        </div>
        <mt-popup class="page-popup reply-popup"  v-model="popupVisible" :class="{'hide':!popupVisible,'middle':!popupFocus}">
                        <mt-header  title="评论">
                <mt-button icon="back" slot="left" v-on:click="closePopup"></mt-button>
            </mt-header>
            <div class="main">
                <textarea v-model="reply" class="textareaPopup" ref="textareaPopup" name="" id="" cols="30" rows="8" v-on:focus="textareaPopupOnfocus" v-on:blur="textareaPopupOnBlur"></textarea>
            </div>
            <div class="foot">
                <span>已输入：{{reply.length}}/200</span>
                <button class="send-btn" v-on:click="doSubmit">提交</button></div>
        </mt-popup>
        <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
        <previewer ref="previewer" :list="images" :options="options">
        </previewer>
    </div>
</template>
<script>
import TransferDom from '../commonComponents/transferDom/index.js'
export default {
    name: 'read',
    directives: {
        TransferDom
    },
    data() {
        return {
            popupFocus: false,
            popupVisible: false,
            counter: 0,
            looper: null,
            selected: 'read',
            sheetVisible: false,
            height: 45,
            data: {
                loading: true,
                previous: {},
                next: {},
                senderInfoInfo: {
                    name_: '',
                    formName: '',
                    userLogo: '',
                    createTime: ''
                },
                commentList: [],
                dataDetailList: [{ createTime: '' }]
            },
            scrollTop: -1,
            reply: '',
            options: {
                getThumbBoundsFn(index) {
                    let thumbnail = document.querySelectorAll('.img-item')[index]
                    let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
                    let rect = thumbnail.getBoundingClientRect()
                    return { x: rect.left, y: rect.top + pageYScroll, w: rect.width }
                }
            },
            className: {
                'onfocus': false
            }
        }
    },
    mounted() {
        this.getData()
        // console.log(this.scrollTop)
        // this.$refs.main.addEventListener('scroll', () => {
        //    this.$refs.main.scrollTop =  this.$refs.main.scrollHeight;
        //   this.scrollTop = this.$refs.main.scrollTop
        //   console.log(this.scrollTop)
        // })
    },
    computed: {
        isGtIOS12() {
            let flag = false
            if (window.device.ios) {
                flag = parseInt(window.device.osVersion) >= 12
            }
            return flag
        },
        paginationVisible() {
            return this.$route.query.pageFrom === 'all' || this.$route.query.pageFrom === 'notRead' || this.$route.query.pageFrom === 'ISend'
        },
        actions() {
            return [{
                    name: `写${this.data.senderInfoInfo.formName}`,
                    method: () => { this.go2Write(this.formCode) }
                }, {
                    name: `修改${this.data.senderInfoInfo.formName}`,
                    method: this.go2Edit
                },
                {
                    name: '删除',
                    method: this.doDelete
                }
            ]
        },
        title() {
            if (this.data.senderInfoInfo.name_ && this.data.senderInfoInfo.formName) {
                return this.data.senderInfoInfo.name_ + '的' + this.data.senderInfoInfo.formName
            } else {
                return ''
            }
        },
        avatar() {
            return !this.data.senderInfoInfo.userLogo ? './static/img/default_avatar.png' : this.data.senderInfoInfo.userLogo
        },
        isMyReport() {
            return this.data.role === 'send'
        },
        fileList() {
            let fileList = []
            _.each(this.data.dataDetailList, function(item) {
                if (item.fieldType === 'file') {
                    fileList.push({ name: item.fieldName, src: item.fieldValue })
                }
            })
            return fileList
        },
        images() {
            let images = []
            _.each(this.data.dataDetailList, function(item) {
                if (item.fieldType === 'img') {
                    images.push({ src: item.fieldValue })
                }
            })
            return images
        },
        dataCode() {
            return this.$route.query.dataCode
        },
        formCode() {
            return this.data.formCode
        }
    },
    watch: {
        reply(value) {
            if (value.length >= 200) {
                this.reply = value.substring(0, 200)
            }
            this.setTextareaHeight()
        },
        popupVisible(value, oldValue) {
            if (value === false) {
                this.className = {
                    'onfocus': false,
                    'hasValue': this.reply !== ''
                }
                this.setTextareaHeight()
                if (this.reply === '') {
                    this.height = this.height - 40
                }
            }
        }
    },
    methods: {
        setTextareaHeight() {
            this.$refs.textarea.style.height = '30px'
            this.height = Number(this.$refs.textarea.style.height.replace('px', '')) + 15 + 40
            //不可逆的特征检测，只能每次重置，修改高度
            if (this.$refs.textarea.scrollHeight < 31) {
                return false
            }
            this.$refs.textarea.style.height = 'auto'
            this.$refs.textarea.style.overflow = 'hidden'
            this.$refs.textarea.style.height = this.$refs.textarea.scrollHeight + 'px'
            console.log(Number(this.$refs.textarea.style.height.replace('px', '')))
            this.height = Number(this.$refs.textarea.style.height.replace('px', '')) + 15 + 40
        },
        onclick() {
            if (this.isGtIOS12) {
                this.popupVisible = true
                this.$refs.textareaPopup.focus()
                this.className = {
                    'onfocus': true
                }
                if (this.reply === '') {
                    this.height = this.height + 40
                }
            }
        },
        closePopup() {
            this.popupVisible = false
            this.className = {
                'onfocus': false,
                'hasValue': this.reply !== ''
            }
            this.setTextareaHeight()
            if (this.reply === '') {
                this.height = this.height - 40
            }
        },
        textareaPopupOnfocus() {
            this.popupFocus = true
            // this.looper = setInterval(() => {
            //   if (this.counter < 3) {
            //     this.counter = this.counter + 1
            //   } else {
            //     clearInterval(this.looper)
            //     this.counter = 0
            //     this.looper = null
            //     return
            //   }
            //   document.activeElement.scrollIntoViewIfNeeded()
            //   window.scrollTo(0, 0)
            //   document.body.scrollTop = 0
            //   this.$refs.textareaPopup.style.top='166px'
            // }, 333)
        },
        textareaPopupOnBlur() {
            this.popupFocus = false
            console.log(this.popupFocus)
        },
        onfocus() {
            this.className = {
                'onfocus': true
            }
            if (this.reply === '') {
                this.height = this.height + 40
            }
            this.looper = setInterval(() => {
                if (this.counter < 3) {
                    this.counter = this.counter + 1
                } else {
                    clearInterval(this.looper)
                    this.counter = 0
                    this.looper = null
                    return
                }
                document.activeElement.scrollIntoViewIfNeeded()
                window.scrollTo(0, 9999)
                document.body.scrollTop = 9999
            }, 333)
        },
        onblur() {
            this.className = {
                'onfocus': false,
                'hasValue': this.reply !== ''
            }
            this.setTextareaHeight()
            if (this.reply === '') {
                this.height = this.height - 40
            }
            if (this.looper) {
                clearInterval(this.looper)
                this.counter = 0
                this.looper = null
            }
        },
        jump(dataCode) {
            if (!dataCode) {
                return false
            }
            let query = {
                dataCode,
                pageFrom: this.$route.query.pageFrom,
                formCode: this.$route.query.formCode,
                dateType: this.$route.query.dateType,
                senders: this.$route.query.senders,
                isRead: this.$route.query.isRead,
                createUserID: this.$route.query.createUserID
            }
            this.$router.replace({ path: 'read', query })
            this.getData()
        },
        getFileIcon(filename) {
            let className = {
                'icon-else': true
            }
            if (/.doc/.test(filename)) {
                className = {
                    'icon-doc': true
                }
            } else if (/.ppt/.test(filename)) {
                className = {
                    'icon-ppt': true
                }
            } else if (/.pdf/.test(filename)) {
                className = {
                    'icon-pdf': true
                }
            } else if (/.xls/.test(filename)) {
                className = {
                    'icon-xls': true
                }
            }
            return className
        },
        openDocument(file) {
            // this.$app.openDocument({ url: file.src, title: file.name })
            this.$app.openDocument({ url: file.src, title: '附件预览' })
        },
        doSubmit() {
            this.$utils.ajax({
                url: '/report/reportcomment/app/v2/submitcoment',
                data: {
                    employeeId: window.userInfo.empId,
                    dataCode: this.dataCode,
                    commentText: encodeURI(this.reply) || '做得不错，请再接再励！'
                },
                success: (res) => {
                    if (res.httpCode === '200') {
                        this.$toast('评论成功')
                        this.data.commentList.push({
                            userLogo: window.userInfo.user.userLogo,
                            comment: encodeURI(this.reply) || '做得不错，请再接再励！',
                            create_time: new Date().format('yyyy-MM-dd hh:mm:ss'),
                            employee_name: window.userInfo.username
                        })
                        this.reply = ''
                        this.className = {
                            'onfocus': false,
                            'hasValue': this.reply !== ''
                        }
                        this.popupVisible = false
                        this.$nextTick(() => {
                            this.$refs.textarea.style.height = '30px'
                            this.height = Number(this.$refs.textarea.style.height.replace('px', '')) + 15
                        })
                    } else {
                        this.$toast('出错了')
                    }
                }
            })
        },
        getData() {
            this.$utils.ajax({
                url: '/report/reportdata/app/v2/querydatadetail',
                data: {
                    employeeId: window.userInfo.empId,
                    dataCode: this.dataCode,
                    pageFrom: this.$route.query.pageFrom,
                    formCode: this.$route.query.formCode,
                    dateType: this.$route.query.dateType,
                    senders: this.$route.query.senders,
                    isRead: this.$route.query.isRead,
                    createUserID: this.$route.query.createUserID
                },
                success: (res) => {
                    if (res.httpCode === '200') {
                        this.data = res.data
                        if (this.data.readTotal === '0') {
                            this.selected = 'unread'
                        }
                    } else {
                        this.$toast(res.message)
                        setTimeout(() => { this.goBackOrExit() }, 3000)
                    }
                }
            })
        },
        show(index) {
            this.$refs.previewer.show(index)
        },
        openSheet() {
            this.sheetVisible = true
        },
        go2Write(formCode) {
            if (this.data.formEnabled === '1') {
                document.querySelector('.v-modal').remove()
                this.$router.push({ name: 'write', params: { formCode } })
            } else {
                this.$messagebox('提示', '该模板已被删除')
            }
        },
        go2Edit() {
            if (this.data.formEnabled === '1') {
                document.querySelector('.v-modal').remove()
                this.$router.push({ name: 'edit', params: { formCode: this.formCode, dataCode: this.dataCode } })
            } else {
                this.$messagebox('提示', '该模板已被删除')
            }
        },
        doDelete() {
            this.$messagebox.confirm('是否删除改日报?').then(action => {
                document.querySelector('.v-modal').remove()
                this.$utils.ajax({
                    url: '/report/reportdata/app/v1/deletedatadetail',
                    data: {
                        userId: window.userInfo.userId,
                        employeeId: window.userInfo.empId,
                        dataCode: this.dataCode
                    },
                    success: (res) => {
                        if (res.statusCode === '200') {
                            this.$toast('删除成功')
                            this.$router.push({ name: 'list', params: { deletedDataCode: this.dataCode } })
                        }
                    }
                })
            })
        }
    }
}
</script>
<style lang="less" scoped>
.icon-doc {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-size: cover;
    background-image: url(../assets/images/icon_doc.png);
}

.icon-xls {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-size: cover;
    background-image: url(../assets/images/icon_xls.png);
}

.icon-ppt {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-size: cover;
    background-image: url(../assets/images/icon_ppt.png);
}

.icon-pdf {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-size: cover;
    background-image: url(../assets/images/icon_pdf.png);
}

.icon-else {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-size: cover;
    background-image: url(../assets/images/icon_else.png);
}

.main {
    height: calc(~"100% - 65px");
    overflow: auto;

    >div:last-child {
        margin-bottom: 10px;
    }
}

// .pagination {
//     &~.main {
//         height: calc(~"100% - 115px");
//     }
//     margin-bottom: 10px;
//     display: flex;
//     background-color: #fff;
//     justify-content: space-between; // padding: 0 10px;
//     height: 40px;
//     line-height: 40px;
//     >span {
//         display: block;
//         position: relative;
//         padding: 0 10px;
//     }
//     .previous {
//         padding-left: 20px;
//         &:before {
//             border: 2px solid #c8c8cd;
//             border-bottom-width: 0;
//             border-left-width: 0;
//             content: " ";
//             top: 50%;
//             left: 10px;
//             position: absolute;
//             width: 5px;
//             height: 5px;
//             transform: translateY(-50%) rotate(-135deg);
//         }
//         &.none {
//             color: @gary;
//         }
//     }
//     .next {
//         padding-right: 20px;
//         &:after {
//             border: 2px solid #c8c8cd;
//             border-bottom-width: 0;
//             border-left-width: 0;
//             content: " ";
//             top: 50%;
//             right: 10px;
//             position: absolute;
//             width: 5px;
//             height: 5px;
//             transform: translateY(-50%) rotate(45deg);
//         }
//         &.none {
//             color: @gary;
//         }
//     }
// }
.foot {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 7px;
    color: @gary;

    span {
        font-size: 12px;
    }

    button {
        display: block;
        width: 75px;
        height: 30px;
        font-size: 12px;
        background-color: @supportColor;
        border-radius: 2px;
        color: #fff;
        border: none;
    }
}

.reply-wrapper {
    position: fixed;
    bottom: 0;
    z-index: 99;
    width: 100%;
    background-color: @bgColor;

    >div.inner {

        background-color: #fff;

        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        padding: 7px;
        box-sizing: border-box;
    }

    form {
        display: block;
        width: 70%;
        margin-right: 10px;
        margin-left: 10px;
        min-height: 30px;

        textarea {
            padding-right: 5px;
            padding-left: 5px;
            padding-top: 5px;
            box-sizing: border-box;
            display: block;
            height: 30px;
            background-color: #fff;
            border: none;
            resize: none;
            border-radius: 4px;
            width: 100%;
            outline: none;
            font-size: 14px;
            line-height: 18px;

            border: 1px solid @gary;
            appearance: none;

        }

    }

    button {
        display: block;
        width: 75px;
        height: 30px;
        font-size: 12px;
        background-color: @supportColor;
        border-radius: 2px;
        color: #fff;
        border: none;

        &.none {
            background-color: @gary
        }
    }

    .foot {
        // display: none;
    }

    &.onfocus {
        form {
            width: 100%;
            margin-left: 0;
            margin-right: 0;
        }

        button:not(.send-btn) {
            display: none;
        }

        .foot {
            display: flex;
        }
    }
}

&.hasValue {
    form {
        width: 100%;
        margin-left: 0;
        margin-right: 0;
    }

    button:not(.send-btn) {
        display: none;
    }

}

.reader-wrapper {
    padding: 10px 15px;
    background-color: #fff;

    .mint-navbar {
        &:after {
            display: none;
        }

        width: 150px;
        background-color: transparent;

        .mint-tab-item {
            margin-right: 10px;
            padding: 5px 0;
            text-align: left;
            color: @gary;

            &.is-selected {
                color: @mainColor;

                &:before {
                    display: none;
                }
            }
        }
    }

    ul li {
        list-style: none;
        float: left;
        font-size: 12px;
        width: 50px;
        margin: 5px 10px 5px 0;
        text-align: center;

        span {
            margin: 0 auto;
            display: block;
            width: 44px;
            height: 44px;
            background-size: cover;
            background-color: @mainColor;
            border-radius: 50%;
            margin-bottom: 5px;
        }

        p {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
    }
}

.comment-wrapper {
    background-color: #fff;
    padding: 10px 15px;

    >h1 {
        font-size: 14px;
        font-weight: normal;
        margin-bottom: 10px;
    }

    ul {
        list-style: none;
        overflow: auto;

        li {
            display: flex;
            margin-bottom: 20px;

            &:last-child {
                margin-bottom: 0;
            }

            >span {
                display: block;
                background-size: cover;
                width: 44px;
                height: 44px;
                background-color: #303030;
                border-radius: 50%;
                margin-right: 10px;
            }

            >div {
                width: 80%;
                font-size: 14px;

                p {
                    line-height: 18px;
                    word-break: break-all;
                    font-size: 14px;
                    color: @gary;
                }

                h1 {
                    font-weight: normal;
                    font-size: 15px;
                    display: flex;
                    justify-content: space-between;
                    margin-top: 2px;
                    margin-bottom: 8px;

                    span {
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }

                    span:nth-child(2) {
                        color: @gary;
                        font-size: 12px;
                    }
                }
            }
        }
    }
}

.header {
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 10px 15px;

    >span {
        display: block;
        width: 45px;
        height: 45px;
        border-radius: 50%;
        margin-right: 10px;
        background-size: cover;
        background-color: @mainColor;
    }

    h1 {
        font-weight: normal;
        font-size: 15px;
        margin-bottom: 8px;
    }

    p {
        color: @gary;
        font-size: 12px;
    }
}

.list-content {
    background-color: #fff;
    padding: 10px 15px;
    min-height: 150px;

    ul {
        list-style: none;
        overflow: auto;
    }

    >ul {
        overflow: initial;
    }

    li {
        >div {
            margin-bottom: 20px;
        }

        margin-bottom: 10px;

        .img-item {
            display: block;
            width: 50px;
            height: 50px;
            float: left;
            margin-right: 18px;

            span {
                border-radius: 5px;
                background-size: cover;
                display: block;
                width: 100%;
                height: 100%;
                background-size: cover;
                background-color: @mainColor;
            }
        }

        .file-item {
            line-height: 20px;
            font-size: 14px;
            margin-bottom: 10px;
            word-break: break-all;

            i {
                font-size: 20px;
                vertical-align: text-bottom;
            }

            a {
                color: @supportColor;
            }
        }

        &:last-child {
            margin-bottom: 0;
        }
    }

    h1 {
        font-size: 14px;
        margin-bottom: 10px;
    }

    p {
        font-size: 15px;
        line-height: 22px;
        color: #666;
        min-height: 10px;
        word-break: break-all;
    }
}

.mint-popup {
    // top: 40%;
    // width: 80%;
    // // height:100px;
    // padding-bottom: 5px;
    // border-radius: 10px;
    opacity: 1;

    &.hide {
        display: block !important;
        z-index: -1 !important;
        opacity: 0 !important;
    }

    &.middle {
        // top: 50% !important;
    }

    .main {
        padding: 10px 10px 0 10px;
       height: 200px;
    }

    .textareaPopup {
        border: 1px dashed @gary;
        width: 100%;
        font-size: 14px;
        appearance: none;
        outline: none;
        padding: 5px;
        border-radius: 3px;
        // margin-right: 10px;
        // margin-left: 10px;
        box-sizing: border-box;
    }

    .foot {
        padding: 10px;

    }

    .head {
        height: 40px;
        background-color: @supportColor;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        line-height: 40px;
        color: #fff;
        text-align: center;

        i {
            position: absolute;
            right: 0;
            color: #fff;
            line-height: 40px;
            width: 40px;
            text-align: center;
            font-size: 26px;
        }
    }
}
</style>