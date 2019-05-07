<template>
    <div>
        <div class="page-write">
            <mt-header v-bind:title="title">
                <mt-button icon="back" slot="left" v-on:click="goBackOrExit"></mt-button>
            </mt-header>
            <div class="content">
                <div class="last-update-time">
                    <mt-spinner class="loading" type="snake" :size="15"></mt-spinner>
                    <p>上次保存时间：
                        <span class="time"></span>
                    </p>
                </div>
                <div id="form-wrapper"></div>
                <div id="image-uploader">
                    <div class="block-title">图片
                        <img src="../assets/images/icon_image.png" alt="">
                    </div>
                    <image-uploader v-on:upload="upload" v-bind:option="uploadOption" v-bind:max="10" :list="exImages"></image-uploader>
                </div>
                <div id="employee-wrapper">
                    <div class="block-title">发给谁</div>
                    <div class="employee-chosen-list">
                        <ul>
                            <li class="employee-item" v-for="(item, index) in employees" v-bind:key="item.id">
                                <span v-bind:data-id="item.id" style="background-image: url(./static/img/default_avatar.png)">
                                    <i class="bnd-icon-close" v-on:click="doDelete(employees,index)"></i>
                                </span>
                                <p>{{item.name}}</p>
                            </li>
                            <li class="add-btn" v-on:click="selectEmployees">
                                <span class="bnd-icon-plus"></span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="button-wrapper">
                    <mt-button size="large" v-on:click.native="doSubmit" ref="button">提交</mt-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import formFactory from './formFactory.js'

export default {
    name: 'write',
    data() {
        return {
            title: '',
            type: 'mt-field',
            list: [],
            introduction: '',
            uploadList: [],
            uploadOption: {
                uploadFileName: 'default',
                tableName: 'default',
                tableCloumn: 'default'
            },
            employees: [],
            fieldValues: []
        }
    },
    filters: {
        getFormType(value) {
            let type = value
            return type
        }
    },
    computed: {
        formCode() {
            return this.$route.params.formCode
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
        }
    },
    // watch: {
    //   employees(val, OldVal) {
    //     console.log(val.length, OldVal.length)
    //     if (val.length !== OldVal.length) {
    //       alert(1)
    //     }
    //   }
    // },
    mounted() {
        this.getForm()
    },
    methods: {
        // getLastReceiver() {
        //   this.$utils.ajax({
        //     url: '/report/reportdata/app/v1/querylastresiverlist',
        //     data: {
        //       empId: window.userInfo.empId,
        //       formCode: this.formCode
        //     },
        //     success: (res) => {
        //       if (res.httpCode === '200') {
        //         _.each(res.data, (item) => {
        //           this.employees.push({
        //             name: item.emp_name,
        //             id: item.emp_id
        //           })
        //         })
        //       }
        //     }
        //   })
        // },
        doSubmit() {
            let formData = formFactory.getData({
                validate: true
            })
            if (formData !== false) {
                this.$refs.button.$el.disabled = true
                let data = {
                    userId: window.userInfo.userId,
                    title: this.title,
                    formCode: this.formCode,
                    companyId: window.userInfo.companyId,
                    empId: window.userInfo.empId,
                    ...formData
                }
                console.log(data)
                this.$utils.ajax({
                    url: '/report/reportdata/app/v1/saveDataWithArgs',
                    data,
                    success: (res) => {
                        if (res.httpCode === '200') {
                            this.$toast('提交成功')
                            this.$router.push({ name: 'index' })
                        } else {
                            this.$toast('出错了')
                            console.log(res)
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
        upload(urlArray) {
            this.uploadList = urlArray
            this.$nextTick(() => {
                if (document.querySelector('.loaded')) {
                    formFactory.doSave()
                }
            })
        },
        selectEmployees() {
            this.$employeePicker({
                title: '选择接收人',
                values: this.employees,
                multiple: true,
                callback: (res) => {
                    this.employees = res
                    this.$nextTick(() => {
                        if (document.querySelector('.loaded')) {
                            formFactory.doSave()
                        }
                    })
                }
            })
        },
        doDelete(arr, index) {
            arr.splice(index, 1)
            this.$nextTick(() => {
                formFactory.doSave()
            })
        },
        getForm() {
            this.$utils.ajax({
                url: '/report/reportmodel/app/v1/getFormModelByCode',
                data: {
                    formCode: this.formCode,
                    empId: window.userInfo.empId
                },
                success: (res) => {
                    if (res.httpCode === '200') {
                        this.title = res.data.list[0].formName
                        this.list = JSON.parse(res.data.list[0].defJson).items
                        this.fieldValues = res.data.reportDataCachedList
                        formFactory.creater('form-wrapper', this.list, true)
                        formFactory.resume(this.list, this.fieldValues)
                        _.each(res.data.copyUserList, (item) => {
                            this.employees.push({
                                name: item.empName,
                                id: item.empId
                            })
                        })
                        if (res.data.reportDataCachedList.length !== 0) {
                            document.querySelector('.last-update-time').classList.add('visible')
                            document.querySelector('.last-update-time .time').innerHTML = res.data.reportDataCachedList[0].updateTime
                        }
                        setTimeout(() => { document.querySelector('.page-write').classList.add('loaded') }, 0)
                    }
                }
            })
        }
    }
}
</script>
<style lang="less">
.page-write {
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

    .last-update-time {
        display: none;
        text-align: right;
        height: 30px;
        line-height: 30px;
        font-size: 12px; // background-color: #fff;
        color: @mainColor;
        padding-right: 10px;
        &.visible {
            display: block;
            ~#form-wrapper {
                margin-top: 0;
            }
        }
        .loading {
            float: right;
            position: relative;
            top: 50%;
            transform: translateY(-50%);
            display: none;
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
            transition: transform .25s;
            position: absolute;
            z-index: 1;
        }
        .mint-cell-value {
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
}
</style>