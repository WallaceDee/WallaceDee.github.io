<template>
    <div>
        <div class="page-edit">
            <mt-header :title="title">
                <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
            </mt-header>
            <div class="content">
                <div id="form-wrapper"></div>
                <div id="image-uploader">
                    <div class="block-title">图片
                        <img src="../assets/images/icon_image.png" alt="">
                    </div>
                    <image-uploader v-on:upload="upload" v-bind:option="uploadOption" v-bind:max="10" :list="exImages"></image-uploader>
                    <div class="block-title border-top" v-if="exFiles.length">已上传附件
                        <img src="../assets/images/icon_file.png" alt="">
                    </div>
                    <div class="file-wrapper">
                        <ul>
                            <li class="file-item" v-for="(item,index) in exFiles" v-bind:key="index">
                                 <i :class="getFileIcon(item.label)"></i>
                                <a v-on:click="openDocument(item)">{{item.label}}</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="button-wrapper">
                    <mt-button size="large" v-on:click.native="doUpdate" ref="button">提交</mt-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import formFactory from './formFactory.js'
export default {
    name: 'edit',
    data() {
        return {
            fields: [],
            title: '',
            fieldValues: [],
            uploadList: [],
            uploadOption: {
                uploadFileName: 'default',
                tableName: 'default',
                tableCloumn: 'default'
            }
        }
    },
    mounted() {
        // new Promise(this.getForm).then(this.getData())
        this.getForm(this.getData)
    },
    computed: {
        formCode() {
            return this.$route.params.formCode
        },
        dataCode() {
            return this.$route.params.dataCode
        },
        exImages() {
            let exImages = []
            _.each(this.fieldValues, function(item) {
                if (item.fieldType === 'img') {
                    exImages.push({
                        attach: {
                            name: item.fieldName,
                            path: item.fieldValue
                        }
                    })
                }
            })
            return exImages
        },
        exFiles() {
            let exFiles = []
            _.each(this.fieldValues, function(item) {
                if (item.fieldType === 'file') {
                    exFiles.push({
                        label: item.fieldName,
                        value: item.fieldValue,
                        type: 'file'
                    })
                }
            })
            return exFiles
        }
    },
    methods: {
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
            // this.$app.openDocument({ url: file.value, title: file.label })
            this.$app.openDocument({ url: file.value, title: '附件预览' })
        },
        doUpdate() {
            let formData = formFactory.getData({
                isUpdate: true,
                employees: this.employees,
                uploadList: this.uploadList
            })
            if (formData !== false) {
                this.$refs.button.$el.disabled = true
                this.$utils.ajax({
                    url: '/report/reportdata/app/v1/updatedatadetail',
                    data: {
                        userId: window.userInfo.userId,
                        title: this.title,
                        formCode: this.formCode,
                        companyId: window.userInfo.companyId,
                        empId: window.userInfo.empId,
                        dataCode: this.dataCode,
                        fileList: JSON.stringify(this.exFiles),
                        ...formData
                    },
                    success: (res) => {
                        if (res.httpCode === '200') {
                            this.$toast('修改成功')
                            this.goBack()
                        } else {
                            this.$toast('出错了')
                        }
                        this.$refs.button.$el.disabled = false
                    },
                    error: (err) => {
                        this.$toast('出错了')
                        console.log(err)
                        this.$refs.button.$el.disabled = false
                    }
                })
            }
        },
        getData() {
            this.$utils.ajax({
                url: '/report/reportdata/app/v1/querydatadetail',
                data: {
                    employeeId: window.userInfo.empId,
                    dataCode: this.dataCode
                },
                success: (res) => {
                    if (res.httpCode === '200') {
                        this.fieldValues = res.data.dataDetailList
                        formFactory.resume(this.fields, this.fieldValues)
                    } else {
                        this.$toast('出错了')
                    }
                }
            })
        },
        getForm(callback) {
            this.$utils.ajax({
                url: '/report/reportmodel/app/v1/getFormModelByCode',
                data: {
                    formCode: this.formCode,
                    empId: window.userInfo.empId
                },
                success: (res) => {
                    if (res.httpCode === '200') {
                        this.title = res.data.list[0].formName
                        this.fields = JSON.parse(res.data.list[0].defJson).items
                        formFactory.creater('form-wrapper', this.fields, false)
                        callback()
                    }
                }
            })
        },
        upload(urlArray) {
            this.uploadList = urlArray
            console.log(urlArray)
        }
    }
}
</script>
<style lang="less">
.page-edit {
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

    #form-wrapper,
    #image-uploader,
    #employee-wrapper {
        margin: 12px 15px;
        border-radius: 5px;
        overflow: hidden;
        box-shadow: 0 1px 10px #e8e8e8;
        .block-title {
            margin: 0;
            padding-top: 10px;
            color: @mainColor;
            font-size: 16px;
            background-color: #fff;
            padding-left: 10px;
            line-height: 30px;
            img {
                display: block;
                width: 22px;
                height: 22px;
                float: right;
                margin-right: 10px;
                margin-top: 4px;
            }
        }
    }
    #form-wrapper {
        a:first-child,
        p:first-child {
            border-top-right-radius: 5px;
            border-top-left-radius: 5px;
        }
        a:last-child,
        p:last-child {
            border-bottom-right-radius: 5px;
            border-bottom-left-radius: 5px;
        }
        p.block-title {
            padding-top: 0;
            font-size: 14px;
            color: @gary;
        }
    }
    .mint-cell-wrapper {
        display: block;
        height: 54px;
        transition: all .25s;

        .mint-cell-title {
            width: 100%;
            height: 54px;
            line-height: 54px;
            // transform: translate3d(0, 0, 0);
            transition: transform .25s;
            position: absolute;
            z-index: 1;
        }
        .mint-cell-value {
            // transform: translate3d(0, 0, 0);
            transition: transform .25s; // height: 54px;
            position: absolute;
            width: 100%;
            padding-right: 10px;
            box-sizing: border-box;
            z-index: 2;
            opacity: 0;
            input {
                line-height: 3.3;
                position: relative;
                z-index: 2;
            }
            textarea {
                height: 54px
            }
        }
        &.jb {
            .mint-cell-title {
                color: #878787;
            }
        }
        &.jbb,
        &.jb {
            min-height: 90px;
            .mint-cell-value {
                opacity: 1;
                top: 54px;
                // transform: translate3d(0, 0, 0);
                input {
                    line-height: 1.6;
                }
                textarea {
                    height: 30px;
                }
            }
        }
    }
    .datetimeHalf {
        .mint-cell-wrapper {
            height: 90px;
            .mint-cell-title {
                // transform: translate3d(0, -48px, 0);
            }
            .mint-cell-value {
                opacity: 1;
                top: 54px;
                // transform: translate3d(0, 0, 0);
                input {
                    line-height: 1.6;
                }
            }
        }
    }
    .datetimeHalf {
        display: none;
    }
    .hasDate+.datetimeHalf {
        display: block;
    }
    select {
        height: 27px;
        position: absolute;
        z-index: 3;
        opacity: 0;
        width: 92%;
    }
    .mint-cell-text.required {
        white-space: nowrap;
        &:after {
            content: '*';
            color: @red
        }
    }
    .mint-cell-value {
        position: relative;
        input[type=date]:before,
        input[type=time]:before {
            color: #757575;
            content: attr(placeholder);
            font-family: PingFangSC-Regular, sans-serif, 'Microsoft YaHei'
        }
        input[type=date].filled:before,
        input[type=time].filled:before {
            color: black;
            content: ""!important;
        }
        &.datetime {
            justify-content: space-between;
            .mint-field-core {
                flex: none;
                &:first-child {
                    width: 50%;
                }
                &:nth-child(2) {
                    width: 42%;
                }
            }
        }
        .mint-field-clear {
            display: none;
        }
        &.not-null.focus .mint-field-clear {
            display: block;
        }
    }

    .file-wrapper {
        background-color: #fff;
        padding: 10px;
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;

        ul {
            list-style: none;
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
            &:last-child {
                margin-bottom: 0;
            }
        }
    }
}
</style>