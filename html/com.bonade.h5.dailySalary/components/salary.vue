<template>
  <div>
    <div class="page-salary">
      <mt-header title="待审批工资表">
        <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
        <mt-button slot="right" v-on:click="openPopup">生成汇总表</mt-button>
      </mt-header>
      <div class="content">
        <div class="list-block" ref="wrapper">
          <mt-loadmore :top-method="refresh" @translate-change="translateChange" @top-status-change="handleTopChange" :bottom-method="loadMore" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="false">
            <ul>
              <li v-for="item in list" v-bind:key="item.id">
                <div class="card">
                  <div class="card-header border-bottom">
                    <div>{{item.name}}{{item.createTime|datetime('yyyy-MM-dd',item.createTime)}}工资统计表</div>
                    <div>
                      <p>{{item.statisticsStart|datetime('MM-dd hh:mm',item.statisticsStart)}}</p>
                      <p>{{item.statisticsEnd|datetime('MM-dd hh:mm',item.statisticsEnd)}}</p>
                    </div>
                  </div>
                  <div class="card-content">
                    <a class="del-btn" v-on:click="doDelete(item.id)">
                      <i class="icon-trash-o"></i>
                    </a>
                    <p>应发总金额：
                      <span>{{item.shouldPay}}元</span>
                    </p>
                    <p>实发总金额：
                      <span>{{item.realPay}}元</span>
                    </p>
                    <p>人数：
                      <span>{{item.totalStaff}}位</span>负责人：
                      <span>{{item.headName}}</span>
                    </p>
                  </div>
                  <div class="card-footer">
                    <router-link :to="{name:'salaryList', params:{salaryId:item.id}}">
                      <mt-button size="small">详情</mt-button>
                    </router-link>
                    <router-link :to="{name:'deliver', params:{salaryId:item.id}}">
                      <mt-button size="small">提交</mt-button>
                    </router-link>
                  </div>
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
        </div>
      </div>
    </div>
    <mt-popup v-model="popupVisible" position="bottom">
      <div class="bar bar-nav">
        <button class="button pull-right" v-on:click="closePopup">关闭</button>
        <h1 class="title">选择时间</h1>
      </div>
      <mt-field label="开始时间" placeholder="请选择开始时间" v-model="startTime" readonly v-on:click.native.capture="openPicker('start')"></mt-field>
      <mt-field label="结束时间" placeholder="请选择结束时间" v-model="endTime" readonly v-on:click.native.capture="openPicker('end')"></mt-field>
      <div class="button-wrapper">
        <mt-button size="large" v-on:click="doSubmit" ref="button">确定</mt-button>
      </div>
    </mt-popup>
    <mt-datetime-picker v-model="defaultTime" year-format="{value}年" month-format="{value}月" date-format="{value}日" hourFormat="{value}时" minuteFormat="{value}分" ref="picker" @confirm="handleConfirm">
    </mt-datetime-picker>
  </div>
</template>
<script>
export default {
  name: 'salary',
  data() {
    return {
      list: [],
      allLoaded: false,
      bottomStatus: '',
      topStatus: '',
      translate: 0,
      moveTranslate: 0,
      row: 10,
      pageNum: 1,
      popupVisible: false,
      defaultTime: new Date().format('yyyy-MM-dd'),
      startTime: '',
      endTime: ''
    }
  },
  computed: {
    projectId() {
      return this.$route.params.projectId
    },
    noData() {
      return this.list.length === 0 && this.allLoaded
    }
  },
  methods: {
    getTimestamp(str) {
      str = str.replace(/\s/, '-').replace(/\:/g, '-')
      let arr = str.split('-')
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Number(arr[i])
        if (i === 1) {
          arr[i] = arr[i] - 1
        }
      }
      return new Date(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]).getTime()
    },
    doDelete(id) {
      this.$messagebox.confirm('确定要删除此记录吗?').then(action => {
        console.log(id)
        this.$utils.ajax({
          url: '/sal/day/app/v1/deleteSalary',
          data: {
            recId: id
          },
          success: (res) => {
            if (res.statusCode === 200) {
              this.refresh()
              this.$toast('删除成功')
            }
          }
        })
      })
    },
    doSubmit() {
      let fromData = [{
        title: '开始时间',
        value: this.startTime,
        require: true
      }, {
        title: '结束时间',
        value: this.endTime,
        require: true
      }]
      if (this.getTimestamp(this.startTime) > this.getTimestamp(this.endTime)) {
        this.$toast('开始时间应早于结束时间')
        return false
      }
      let flag = this.$utils.validate(fromData)
      if (flag) {
        this.$refs.button.disabled = true
        this.$utils.ajax({
          url: '/sal/day/app/v1/createSalary',
          data: {
            empId: window.userInfo.empId,
            prjId: this.projectId,
            startTime: this.startTime,
            endTime: this.endTime
          },
          success: (res) => {
            if (res.statusCode === 200) {
              this.refresh()
              this.closePopup()
              this.$toast('生成成功')
            } else if (res.statusCode === 300) {
              this.$toast('暂无记录')
              this.closePopup()
            }
            this.$refs.button.disabled = false
          },
          error: () => {
            this.$toast('生成失败')
            this.closePopup()
            this.$refs.button.disabled = false
          }
        })
      }
    },
    openPicker(type) {
      this.type = type
      this.$refs.picker.open()
    },
    handleConfirm(data) {
      if (this.type === 'start') {
        this.startTime = data.format('yyyy-MM-dd hh:mm:ss')
      }
      if (this.type === 'end') {
        this.endTime = data.format('yyyy-MM-dd hh:mm:ss')
      }
    },
    closePopup() {
      this.popupVisible = false
    },
    openPopup() {
      this.popupVisible = true
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
        url: '/sal/day/app/v1/salaryList',
        data: {
          empId: window.userInfo.empId,
          prjId: this.projectId,
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
.button-wrapper {
  padding-top: 5px;
  padding-bottom: 5px;
}

.list-block ul {
  background-color: transparent;
}

.list-block li {
  margin-bottom: 10px;
}

.card {
  background-color: #fff;
  .card-header {
    height: 40px;
    display: flex;
    line-height: 40px;
    font-size: 14px;
    padding: 0 10px;
    justify-content: space-between;
    position: relative;
    >div:first-child {
      width: 80%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    >div:nth-child(2) {
      width: 80px;
      color: @grayFont;
      p {
        font-size: 12px;
        line-height: 20px;
      }
    }
  }
  .card-content {
    padding: 10px;
    font-size: 14px;
    p {
      line-height: 20px;
      span {
        color: @supportColor;
      }
      span:first-child {
        margin-right: 20px;
      }
    }
    .del-btn {
      border: none;
      font-size: 18px;
      display: block;
      position: absolute;
      height: 28px;
      width: 28px;
      border-radius: 50%;
      line-height: 28px;
      text-align: center;
      right: 10px;
      background-color: @lightGary;
      color: #999;
      outline: none;
    }
  }
  .card-footer {
    padding: 10px;
    display: flex;
    justify-content: flex-end;
    .mint-button--default {
      margin-left: 10px;
      height: 30px;
      padding: 0 10px;
      background-color: transparent;
      color: @supportColor;
      border: 1px solid @supportColor;
      font-size: 14px;
      box-shadow: none;
    }
  }
}

.mint-popup {
  width: 100%;
}

</style>
