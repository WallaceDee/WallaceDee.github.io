<template>
    <div>
        <div class="page-app">
            <mt-header title="测试">
                <mt-button icon="back" slot="left" v-on:click="exit">关闭</mt-button>
                <mt-button slot="right" v-on:click="reload">刷新</mt-button>
            </mt-header>
            <div class="content">
                <mt-navbar v-model="selected">
                    <mt-tab-item id="first">源生接口</mt-tab-item>
                    <mt-tab-item id="second">公共组件</mt-tab-item>
                    <mt-tab-item id="third">选项三</mt-tab-item>
                </mt-navbar>
                <mt-tab-container v-model="selected">
                    <mt-tab-container-item id="first">
                        <div class="result-pannel">
                            <a class="mint-cell mint-field is-textarea">
                                <div class="mint-cell-wrapper">
                                    <div class="mint-cell-title">
                                        <span class="mint-cell-text">返回图片</span>
                                    </div>
                                    <div class="mint-cell-value">
                                        <img :src="src">
                                    </div>
                                </div>
                            </a>
                            <mt-field label="返回结果" placeholder="返回结果" type="textarea" rows="3" v-bind:value="result" readonly></mt-field>
                        </div>
                        <div class="function-list">
                            <mt-cell v-on:click.native="go2MyTest" title="测试" label="" is-link></mt-cell>
                            <mt-cell v-on:click.native="getAssessToken" title="获取assess_token" label="" is-link></mt-cell>
                            <mt-cell v-on:click.native="refreshToken" title="刷新token" label="" is-link></mt-cell>
                            <mt-cell v-on:click.native="getUserInfo" title="获取用户信息" label="" is-link></mt-cell>
                            <mt-cell v-on:click.native="getReqHead" title="ios getReqHead" label="" is-link></mt-cell>
                            <mt-cell v-on:click.native="getDomain" title="获取当前环境域名" label="" is-link></mt-cell>
                            <mt-cell v-on:click.native="getLocation" title="获取定位" label="" is-link></mt-cell>
                            <mt-cell v-on:click.native="takePhoto" title="源生拍照" label="调用app源生接口" is-link></mt-cell>
                            <mt-cell v-on:click.native="chooseImage" title="相册选图" label="html5 input file 调用相册" is-link></mt-cell>
                            <mt-cell v-on:click.native="ocr('idCardFront')" title="ocr(身份证)" label="" is-link></mt-cell>
                            <mt-cell v-on:click.native="ocr('bankCard')" title="ocr(银行卡)" label="" is-link></mt-cell>
                            <mt-cell v-on:click.native="goLive" title="去生活页面" label="" is-link></mt-cell>
                        </div>
                    </mt-tab-container-item>
                    <mt-tab-container-item id="second">
                        <div class="component-wrapper">
                            <div class="block-title">搜索框</div>
                            <div class="search-bar-wrapper">
                                <search-bar v-model="searchBarVisible" v-on:keyword="doSearch"></search-bar>
                            </div>
                            <mt-cell title="keyword" v-bind:value="keyword" label="搜索做了函数防抖，停止输入1秒后触发"></mt-cell>
                            <mt-cell title="searchBarVisible" label="" v-bind:value="searchBarVisible"></mt-cell>
                            <div class="button-wrapper">
                                <mt-button size="large" v-on:click="searchBarTrigger">打开/关闭 searchBar</mt-button>
                            </div>
                        </div>
                        <div class="component-wrapper">
                            <div class="block-title">组织架构</div>
                            <div class="employee-chosen-list has-arrow">
                                <ul>
                                    <li v-for="(item, index) in employees" v-bind:key="item.id">
                                        <span style="background-image: url(./static/img/default_avatar.png)">
                                            <i class="icon-close" v-on:click="doDelete(approverList,index,true)"></i>
                                        </span>
                                        <p>{{item.userName}}</p>
                                    </li>
                                    <li class="add-btn" v-on:click="selectEmployees">
                                        <span class="icon-plus"></span>
                                    </li>
                                </ul>
                            </div>
                            <mt-field label="employees" type="textarea" rows="4" v-bind:value="employees"></mt-field>
                        </div>
                        <div class="component-wrapper">
                            <div class="block-title">图片上传</div>
                            <image-uploader></image-uploader>
                            <mt-field label="uploadList" type="textarea" rows="4" v-bind:value="employees"></mt-field>
                        </div>
                    </mt-tab-container-item>
                    <mt-tab-container-item id="third">
                    </mt-tab-container-item>
                </mt-tab-container>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'app',
    data() {
        return {
            result: '测试',
            base64: '',
            src: './static/img/default_avatar.png',
            selected: 'second',
            searchBarVisible: true,
            keyword: '',
            employees: [],
            uploadList: []
        }
    },
    computed: {
        isAndroid() {
            return this.$utils.device.android
        }
    },
    methods: {
        go2MyTest() {
            window.location.href = 'http://192.168.1.69:8080/#/test'
        },
        reload() {
            location.reload()
        },
        refreshToken() {
            let _this = this
            this.$app.refreshToken(function(res) {
                _this.result = JSON.stringify(res)
            })
        },
        takePhoto() {
            let _this = this
            this.$app.takePhoto(function(res) {
                _this.src = 'data:image/jpeg;base64,' + res
            })
        },
        getUserInfo() {
            this.result = JSON.stringify(this.$app.getLoginInfo())
        },
        getReqHead() {
            this.result = JSON.stringify(this.$app.getReqHead())
        },
        getLocation() {
            let _this = this
            this.$app.getLocation(function(res) {
                _this.result = JSON.stringify(res)
            })
        },
        getAssessToken() {
            this.result = JSON.stringify(this.$app.getAccessToken())
        },
        getDomain() {
            this.result = this.$app.getCurrentDomain()
        },
        chooseImage() {
            let _this = this
            this.$utils.chooseImage({ upload: false }, function(res) {
                _this.src = res
            })
        },
        ocr(type) {
            let _this = this
            this.$app.ocr(type, function(res) {
                _this.src = 'data:image/jpeg;base64,' + res.bitmap
                //   res.bitmap = 'too long to show'
                _this.result = JSON.stringify(res)
            })
        },
        goLive() {
            alert('点击去生活页面按钮')
            XqcH5JS.goLive()
        },
        //commonComponents
        doSearch: _.debounce(function(keyword) {
            this.keyword = keyword
            this.refresh()
        }, 1000),
        searchBarTrigger() {
            this.searchBarVisible = !this.searchBarVisible
        },
        selectEmployees() {
            let _this = this
            this.$employeePicker({
                title: '选择审批人',
                values: this.employees,
                multiple: true,
                callback(res) {
                    _this.employees = res
                }
            })
        },
        uploadImage() {
            console.log(1)
        }
    }
}
</script>
<style lang="less" scoped>
.result-pannel {
    background-color: @mainColor;
    img {
        max-height: 50px;
        display: block;
    }
}

.button-wrapper {
    background-color: #fff;
}

.function-list {
    margin-top: 1px;
    height: calc(~"100% - 150px");
    overflow: auto;
}

//commonComponents
.search-bar-wrapper {
    position: relative;
    background-color: @mainColor;
    height: 44px;
}
</style>