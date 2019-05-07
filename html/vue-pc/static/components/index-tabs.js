var BndTabs = {
    name: 'BndTabs',
    template: '<tabs closable v-model="path"  type="card" :animated="false" @on-tab-remove="handleTabRemove" @on-click="initLazyLoad">\
                            <tab-pane :class="{\'index-tab\':isIndexPage}" v-if="currentTabs[i].visible" :label="item.label" v-for="(item,i) in currentTabs" :name="item.path" :icon="item.icon"  >\
                             <spin fix v-show="currentTabs[i].visible&&currentTabs[i].loaded!==true"></spin>\
                                <iframe class="inner-page" name="page" :data-buttons="item.buttons" :data-src="item.path"  :data-loaded="currentTabs[i].loaded"></iframe></tab-pane>\
                                <button-group size="small" slot="extra">\
                                    <i-button @click="switch2Index" :disabled="isIndexPage" title="主页">\
                                        <icon type="md-home"></icon>\
                                    </i-button>\
                                    <i-button @click="refreshTab" title="刷新">\
                                        <Icon type="md-refresh"></icon>\
                                    </i-button>\
                                    <i-button @click="closeTab" :disabled="!closable" title="关闭">\
                                        <Icon type="md-close"></icon>\
                                    </i-button>\
                                </button-group>\
                        </tabs>',
    data: function () {
        return {
            currentTabs: [],
            visibleTabs: [],
            path: '',
            tabsIndex: 0,
            visibleIndex: 0,
            isIndexPage: true
        }
    },
    watch: {
        path: function (val) {
            this.tabsIndex = _.findIndex(this.currentTabs, { path: val });
            this.visibleIndex = _.findIndex(this.visibleTabs, { path: val });
            this.isIndexPage = _.find(this.visibleTabs, { path: val }).name === 'index';
        }
    },
    props: {
        tabs: {
            type: Array,
            default: []
        }
    },
    mounted: function () {
        var tempList = []
        this.tabs.forEach(function (item) {
            item.visible = true;
            tempList.push(item);
        }.bind(this));
        this.currentTabs = tempList;
        this.updateCurrentTabs();
        this.$nextTick(function () {
            var pages = document.querySelectorAll('.inner-page');
            for (var i = 0; i < pages.length; i++) {
                (function (index) {
                    var iframe = pages[index];
                    var callback = function () { // 非IE  
                        var all = document.querySelectorAll('.inner-page');
                        // console.log(all)
                        var vIndex = -1;
                        for (var i = 0; i < all.length; i++) {
                            if (all[i] === iframe) {
                                vIndex = i;
                                break;
                            }
                        }
                        this.$set(this.visibleTabs[vIndex], 'loaded', true)
                    }.bind(this);
                    if (iframe.attachEvent) {
                        iframe.attachEvent("onload", callback);
                    } else {
                        iframe.onload = callback;
                    }
                }.bind(this))(i); //调用时参数 
            }
        }.bind(this));
    },
    computed: {
        closable: function () {
            if (this.visibleTabs[this.visibleIndex]) {
                return this.visibleTabs[this.visibleIndex].closable !== false
            } else {
                return false
            }
        }
    },
    methods: {
        initLazyLoad: function () {
            this.$nextTick(function () {
                var $el, lazySrc;
                try {
                    $el = document.querySelectorAll('.inner-page')[this.visibleIndex];
                    lazySrc = $el.getAttribute('data-src');
                    // statements
                } catch (e) {
                    // statements//数组越界自动跳最后一页
                    $el = _.last(document.querySelectorAll('.inner-page'))
                    lazySrc = $el.getAttribute('data-src');
                    // console.log(e);
                }
                if (lazySrc !== '') {
                    $el.setAttribute('src', lazySrc);
                    $el.setAttribute('data-src', '');
                    // this.$set(this.visibleTabs[this.visibleIndex], 'loaded', true);
                }
            }.bind(this));
        },
        updateCurrentTabs: function () {
            var temp = [];
            for (var i in this.currentTabs) {
                if (this.currentTabs[i].visible === true) {
                    temp.push(this.currentTabs[i])
                }
            }
            this.visibleTabs = temp;
        },
        handleTabRemove: function (name) {
            this.closeTabAction(name)
        },
        load: function () {
            // this.$set(this.currentTabs[this.tabsIndex], 'loaded', true);
            this.initLazyLoad();
        },
        switch2Index: function () {
            this.path = _.find(this.currentTabs, { name: 'index' }).path;
            console.log(this.index)
        },
        closeOtherTab: function () {
            this.currentTabs = [this.currentTabs[0]]
            this.visibleTabs = [this.visibleTabs[0]]
            this.path = this.visibleTabs[0].path;
        },
        refreshTab: function () {
            this.$Loading.start();
            var currentPath=this.visibleTabs[this.visibleIndex].path;
            // var currentEl = document.querySelector('.ivu-tabs-tab-active');
            // var childrens = document.querySelectorAll('.ivu-tabs-tab');
            // var index = -1;
            // for (var i = 0; i < childrens.length; i++) {
            //     if (childrens[i] === currentEl) {
            //         index = i;
            //         break;
            //     }
            // }
            this.$set(this.visibleTabs[this.visibleIndex], 'loaded', false);
               var iframe = document.querySelector('[src="' + currentPath+ '"]');
                    // console.log(iframe)
                    var callback = function () { // 非IE  
                        this.$set(this.visibleTabs[this.visibleIndex], 'loaded', true);
                        this.$Loading.finish();
                    }.bind(this);
                    if (iframe.attachEvent) {
                        iframe.attachEvent("onload", callback);
                    } else {
                        iframe.onload = callback;
                    }
            document.querySelectorAll('.inner-page')[this.visibleIndex].contentWindow.location.reload(true);
        },
        closeTab: function () {
            this.closeTabAction(this.path);
        },
        closeTabAction: function (path) {
            this.$nextTick(function () {
                //优化 判断时候是visible的最后一个对象，如果是，裁剪数组
                var deleteVisibleIndex = _.findIndex(this.visibleTabs, { path: path });
                var deleteIndex = _.findIndex(this.currentTabs, { path: path });
                if (this.visibleTabs[deleteVisibleIndex].loaded !== true) {
                    //未加载就删除
                    this.$Loading.error();
                }
                // console.log(deleteVisibleIndex, deleteIndex)
                if (deleteVisibleIndex === this.visibleTabs.length - 1) {
                    this.currentTabs = this.currentTabs.slice(0, deleteIndex);
                    // console.log('已裁剪')
                } else {
                    this.$set(this.currentTabs[deleteIndex], 'visible', false);
                    this.$set(this.currentTabs[deleteIndex], 'loaded', false);
                }
                this.updateCurrentTabs();
                this.path = _.last(this.visibleTabs).path;
                this.initLazyLoad();
                // this.$set(_.last(this.visibleTabs), 'loaded', true);
            }.bind(this));
        },
        openTab: function (tab) {
            var isExist = _.findLastIndex(this.currentTabs, { path: tab.path });
            if (isExist === -1) {
                tab.visible = true;
                this.currentTabs.push(tab);
                this.updateCurrentTabs();
                this.path = tab.path;
                this.$nextTick(function () {
                    // this.$set(this.visibleTabs[this.visibleIndex], 'loaded', true);
                    var iframe = document.querySelector('[data-src="' + tab.path + '"]');
                    // console.log(iframe)
                    var callback = function () { // 非IE  
                        this.$set(_.last(this.visibleTabs), 'loaded', true);
                        this.$Loading.finish();
                    }.bind(this);
                    if (iframe.attachEvent) {
                        iframe.attachEvent("onload", callback);
                    } else {
                        iframe.onload = callback;
                    }
                    var lazySrc = iframe.getAttribute('data-src');
                    if (lazySrc !== '') {
                        iframe.setAttribute('src', lazySrc);
                        iframe.setAttribute('data-src', '');
                    }
                }.bind(this));
                this.$Loading.start();
            } else {
                this.path = tab.path;
                var currentTab = this.currentTabs[_.findIndex(this.currentTabs, { path: tab.path })];
                this.$set(currentTab, 'visible', true);
                if (currentTab.loaded !== true) {
                    this.$nextTick(function () {
                        // this.$set(this.visibleTabs[this.visibleIndex], 'loaded', true);
                        var iframe = document.querySelector('[data-src="' + tab.path + '"]');
                        // console.log(iframe)
                        var callback = function () { // 非IE  
                            this.$set(currentTab, 'loaded', true);
                            this.$Loading.finish();
                        }.bind(this);
                        if (iframe.attachEvent) {
                            iframe.attachEvent("onload", callback);
                        } else {
                            iframe.onload = callback;
                        }
                        var lazySrc = iframe.getAttribute('data-src');
                        if (lazySrc !== '') {
                            iframe.setAttribute('src', lazySrc);
                            iframe.setAttribute('data-src', '');
                        }
                    }.bind(this));
                }
                this.updateCurrentTabs();
            }
        }
    }
}