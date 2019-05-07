<template>
    <mt-tabbar>
        <a class="mint-tab-item" v-on:click="switchTab(item.path)" replace v-for="(item,index) in tab" :class="{'is-selected':selectedIndex===index}" v-bind:key="item.path">
            <div class="mint-tab-item-icon">
                <i :class="item.iconClass"></i>
            </div>
            <span class="mint-badge is-error is-size-small" v-if="getTabBadgeVisible(tabBadgeList[index])">{{tabBadgeList[index]|getTabBadge}}</span>
            <div class="mint-tab-item-label">
                {{item.name}}
            </div>
        </a>
    </mt-tabbar>
</template>
<script>
export default {
    name: 'tabBar',
    props: {
        selectedIndex: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            tab: [{
                name: '写汇报',
                path: '/',
                iconClass: { 'image-write': true }
            }, {
                name: '看汇报',
                path: 'list',
                iconClass: { 'image-read': true }
            }, {
                name: '汇报任务',
                path: 'statis',
                iconClass: { 'image-data': true }
            }],
            tabBadgeList: [0, 0, 0]
        }
    },
    filters: {
        getTabBadge(item) {
            if (typeof item === 'number') {
                return item
            } else {
                return item.total
            }
        }
    },
    watch: {
        tabBadgeList() {
            this.tab.map((item, index) => {
                if (this.tabBadgeList[index].total !== undefined) {
                    item.count = this.tabBadgeList[index].list[0]
                } else {
                    item.count = this.tabBadgeList[index]
                }
            })
            this.$emit('change', this.tab)
        }
    },
    methods: {
        switchTab(path){
            this.$router.replace({path})
        },
        getTabBadgeVisible(item) {
            if (typeof item === 'number' && item === 0) {
                return false
            } else if (item.total === 0) {
                return false
            } else {
                return true
            }
        },
        getTabBadges: _.debounce(function() {
            this.$utils.ajax({
                url: '/report/reportcopytodata/app/v2/getnotreadandcommentnum',
                loading: false,
                success: res => {
                    if (res.httpCode === '200') {
                        let total = res.data.notReadNum * 1 + res.data.commentNum * 1
                        this.$set(this.tabBadgeList, 1, { total, list: [(res.data.notReadNum * 1) || 0] })
                        this.$app.synchronizeRedPoint({
                            code: 'A_009_01',
                            number: (res.data.notReadNum * 1) || 0,
                            route: '/report/reportCopytoUser',
                            package: 'com.bonade.h5.report',
                            total: total
                        })
                        this.$app.synchronizeRedPoint({
                            code: 'A_009_02',
                            number: (res.data.commentNum * 1) || 0,
                            route: '/report/reportComment',
                            package: 'com.bonade.h5.report',
                            total: total
                        })
                    }
                }
            })
        }, 1000, true)
    },
    mounted() {
        this.getTabBadges()
    }
}
</script>
<style lang="less" scoped>
.image-write {
    display: block;
    width: 24px;
    height: 24px;
    background-image: url(../assets/images/icon_write.png);
    background-size: cover;
}

.image-read {
    display: block;
    width: 24px;
    height: 24px;
    background-image: url(../assets/images/icon_read.png);
    background-size: cover;
}

.image-data {
    display: block;
    width: 24px;
    height: 24px;
    background-image: url(../assets/images/icon_data.png);
    background-size: cover;
}

.is-selected {
    .image-write {
        background-image: url(../assets/images/icon_write_active.png);
    }
    .image-read {
        background-image: url(../assets/images/icon_read_active.png);
    }
    .image-data {
        background-image: url(../assets/images/icon_data_active.png);
    }
}

.mint-tabbar,
.mint-tabbar>.mint-tab-item.is-selected,
.mint-tabbar .mint-tab-item {
    background-color: #fff!important;
}

.mint-tabbar .mint-tab-item {
    color: @gary!important;
}

.mint-tabbar>.mint-tab-item.is-selected {
    color: @supportColor!important;
}

.mint-tabbar .mint-tab-item {
    .mint-badge {
        position: absolute;
        top: 5px;
    }
}
</style>