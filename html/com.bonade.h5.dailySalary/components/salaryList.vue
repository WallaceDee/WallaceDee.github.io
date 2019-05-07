<template>
  <div>
    <div class="page-salaryList">
      <mt-header title="人员工资信息">
        <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
        <mt-button slot="right" v-on:click="openSearchBar">
          <i class="icon-search"></i>
        </mt-button>
      </mt-header>
      <search-bar v-model="searchBarVisible" v-on:keyword="doSearch" v-bind:type="'transform'"></search-bar>
      <div class="mint-tabbar button-wrapper">
        <router-link :to="{name:'deliver',params:{salaryId:salaryId}}">
          <mt-button size="large">下一步</mt-button>
        </router-link>
      </div>
      <div class="content">
        <div class="thead">
          <span>姓名</span>
          <span>单价</span>
          <span>实发</span>
          <span>累计工时</span>
        </div>
        <div class="tbody" ref="wrapper">
          <mt-loadmore :top-method="refresh" @translate-change="translateChange" @top-status-change="handleTopChange" :bottom-method="loadMore" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="false">
            <ul>
              <li class="border-bottom" v-for="item in list" v-bind:key="item.id">
                <router-link :to="{name:'salaryDetail',params:{detailId:item.id}}">
                  <span>{{item.staffName}}</span>
                  <span>{{item.price}}元/小时</span>
                  <span>{{item.realPay.toFixed(2)}}</span>
                  <span>{{item.totalHour}}</span>
                </router-link>
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
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'salaryList',
  data() {
    return {
      list: [],
      allLoaded: false,
      bottomStatus: '',
      topStatus: '',
      translate: 0,
      moveTranslate: 0,
      row: 20,
      pageNum: 1,
      searchBarVisible: false,
      keyword: ''
    }
  },
  computed: {
    salaryId() {
      return this.$route.params.salaryId
    },
    noData() {
      return this.list.length === 0 && this.allLoaded
    }
  },
  methods: {
    doSearch: _.debounce(function(keyword) {
      this.keyword = keyword
      this.refresh()
    }, 1000),
    openSearchBar() {
      this.searchBarVisible = true
    },
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
    loadMore(isRefresh) {
      this.$utils.ajax({
        url: '/sal/day/app/v1/selectSalaryDetailList',
        data: {
          salId: this.salaryId,
          staffName: this.keyword,
          row: this.row,
          pageNum: this.pageNum
        },
        success: (res) => {
          if (res.httpCode === 200) {
            if (isRefresh) {
              this.list = res.data.list
              this.$refs.loadmore.onTopLoaded()
            } else {
              this.list = this.list.concat(res.data.list)
            }
            this.allLoaded = this.list.length >= res.data.total
            if (this.pageNum !== 1) {
              this.$refs.loadmore.onBottomLoaded()
            }
            this.pageNum = this.pageNum + 1
          } else {
            this.$toast('出错了')
            this.allLoaded = true
          }
        },
        error: () => {
          this.$toast('出错了')
          this.allLoaded = true
        }
      })
    },
    refresh() {
      this.pageNum = 1
      this.loadMore(true)
    }
  },
  mounted() {
    this.loadMore()
  }
}

</script>
<style lang="less" scoped>
.thead {
  display: flex;
  justify-content: space-between;
  span {
    text-align: center;
    display: block;
    height: 40px;
    line-height: 40px;
    background-color: @supportColor;
    color: #fff;
    font-weight: normal;
    font-size: 14px;
    width: 20%;
    &:nth-child(2) {
      width: 25%;
    }
    &:nth-child(3) {
      width: 25%;
    }
    &:nth-child(4) {
      width: 30%;
    }
  }
}

.tbody {
  height: calc(~"100% - 40px");
  overflow: auto;
  ul {
    list-style: none;
  }
  li {
    list-style: none;
    height: 50px;
    a {
      color: @mainColor;
      width: 100%;
      display: flex;
    }
    span {
      text-align: center;
      display: block;
      background-color: #fff;
      font-size: 14px;
      height: 50px;
      line-height: 50px;
      width: 20%;
      &:nth-child(2) {
        width: 25%;
      }
      &:nth-child(3) {
        width: 25%;
        color: @supportColor;
      }
      &:nth-child(4) {
        width: 30%;
      }
    }
  }
}

</style>
