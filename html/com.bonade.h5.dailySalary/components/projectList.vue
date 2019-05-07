<template>
  <div>
    <div class="page-project-list">
      <mt-header title="工资日结">
        <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
      </mt-header>
      <div class="content" ref="wrapper">
        <mt-loadmore :top-method="refresh" @translate-change="translateChange" @top-status-change="handleTopChange" :bottom-method="loadMore" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="false">
          <div>
            <mt-cell v-bind:title="item.name" is-link v-for="item in list" :to="{ name: 'project', params: { projectId: item.id,projectName:item.name }}" v-bind:key="item.id"></mt-cell>
          </div>
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
</template>
<script>
export default {
  name: 'projectList',
  data() {
    return {
      list: [],
      allLoaded: false,
      bottomStatus: '',
      topStatus: '',
      translate: 0,
      moveTranslate: 0,
      row: 20,
      pageNum: 1
    }
  },
  computed: {
    noData() {
      return this.list.length === 0 && this.allLoaded
    }
  },
  methods: {
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
      if(!window.userInfo){
        this.allLoaded=true
        return false
      }
      this.$utils.ajax({
        url: '/sal/day/app/v1/getHeadProjectList',
        data: {
          empId: window.userInfo.empId,
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
