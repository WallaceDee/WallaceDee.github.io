<template>
  <div>
    <div class="page-amount">
      <mt-header title="额度总账">
        <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
        <mt-button icon="more" slot="right" ref="button" v-on:click="openMenuPopup"></mt-button>
      </mt-header>
      <div class="content">
        <div class="time">
          {{datetime}}<i class=""></i>
        </div>
        <div class="limit">
          <div>
            <h1>当前总额度</h1>
            <p>{{(info.monthTotalQuota||0).toFixed(2)}}</p>
          </div>
          <div>
            <h1>已结算额度</h1>
            <p>{{(info.payableQuota||0).toFixed(2)}}</p>
          </div>
        </div>
        <div class="card">
          <div class="header">
            <h1>列表</h1>
            <div class="info">
              <div>
                <p>总人数</p>
                <h1>{{info.empCount?info.empCount:0}}人</h1>
              </div>
              <div>
                <p>发放总额</p>
                <h1>{{sum[1]}}元</h1>
              </div>
              <div>
                <p>已使用额度</p>
                <h1>{{sum[2]}}元</h1>
              </div>
            </div>
          </div>
          <div class="chart">
            <div class="buttons-row">
              <mt-navbar v-model="selected">
                <mt-tab-item v-for="item in tabs" v-bind:id="item.id" v-bind:key="item.id">{{item.name}}</mt-tab-item>
              </mt-navbar>
            </div>
            <div class="legend-list">
              <ul>
                <li v-for="item in legend" v-bind:key="item.name">
                  <span><i :style="{'background-color':item.color}"></i>{{item.name}}</span>{{item.label}}
                </li>
              </ul>
            </div>
            <v-chart :width="width" :data="chart" style="margin-top: -15px;">
              <v-tooltip disabled />
              <v-scale y :options="yOptions" />
              <v-pie :radius="0.85" :inner-radius="0.7" series-field="name" :colors="colors" :pie-label="lebelOptions" />
              <v-legend :options="legendOptions" disabled />
            </v-chart>
          </div>
        </div>
      </div>
    </div>
    <mt-popup v-model="menuPopupVisible" popup-transition="popup-fade" class="menu-popup">
      <ol>
        <li class="border-bottom" @click="go2amountDetai(1)">
          <i class="icon-all-read"></i>额度总览
        </li>
        <li class="border-bottom" @click="go2amountDetai(2)">
          <i class="icon-all-read"></i>总额度趋势
        </li>
        <li @click="go2amountDetai(3)">
          <i class="icon-all-read"></i>分类额度趋势
        </li>
      </ol>
    </mt-popup>
  </div>
</template>
<script>
import VChart from '../commonComponents/vChart/v-chart.vue'
import VLine from '../commonComponents/vChart/v-line.vue'
import VArea from '../commonComponents/vChart/v-area.vue'
import VTooltip from '../commonComponents/vChart/v-tooltip.vue'
import VLegend from '../commonComponents/vChart/v-legend.vue'
import VBar from '../commonComponents/vChart/v-bar.vue'
import VPie from '../commonComponents/vChart/v-pie.vue'
import VGuide from '../commonComponents/vChart/v-guide.vue'
import VScale from '../commonComponents/vChart/v-scale.vue'

export default {
  name: 'app',
  components: {
    VChart,
    VLine,
    VArea,
    VTooltip,
    VLegend,
    VBar,
    VPie,
    VGuide,
    VScale
  },
  watch: {
    selected(val, oldVal) {
      console.log(val, oldVal)
      this.chart = this.data[this.selected]
      this.setLegend()
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    go2amountDetai(id) {
      this.jumpInPopup()
      if(id === 1){
        this.$router.push({path:'amountDetail/allAmount'})
      }
      if(id === 2){
        this.$router.push({path:'amountDetail/totalQuotaTrend'})
      }
      if(id === 3){
        this.$router.push({path:'amountDetail/classificationQuotas'})
      }
    },
    openMenuPopup() {
      this.menuPopupVisible = true
    },
    setLegend() {
      this.data[this.selected].map((obj, index) => {
        if (this.selected === 0) {
          this.legend[index] = { label: obj.value + '人', color: this.colors[index], name: obj.name }
        } else {
          this.legend[index] = { label: obj.value + '元', color: this.colors[index], name: obj.name }
        }
      })
    },
    getData() {
      let now = new Date()
      let datetime = now.getFullYear() + '-' + now.getMonth() + 1
      this.datetime = datetime.replace('-', '年') + '月'
      this.$utils.ajax({
        url: '/allocation/comMonthlyHistory/pc/v1/getHistoryByMonth',
        data: {
          comCode: window.userInfo.companyId,
          dateMonth: datetime
        },
        success: res => {
          let result = res.data[0]
          this.info = result
          let sum = []
          this.sum.push(result['empFlCount'] + result['empCcCount'] + result['empJyCount'] + result['empZdCount'] + result['empTxCount'])
          this.sum.push(result['flQuota'] + result['ccQuota'] + result['jyQuota'] + result['zdQuota'] + result['txQuota'])
          this.sum.push(result['flUseQuota'] + result['ccUseQuota'] + result['jyUseQuota'] + result['zdUseQuota'] + result['txUseQuota'])
          console.log(sum)
          let keyArray = [{
            prefix: 'fl',
            name: '福利'
          }, {
            prefix: 'cc',
            name: '出差'
          }, {
            prefix: 'jy',
            name: '经营'
          }, {
            prefix: 'zd',
            name: '招待'
          }, {
            prefix: 'tx',
            name: '通讯'
          }]
          let chartArray = ['Quota', 'UseQuota']
          this.data[0] = [{
            value: result['empFlCount'],
            percent: result['empFlCount'] !== 0 ? (result['empFlCount'] / this.sum[0]) : 0,
            name: '福利',
            key: 'empFlCount'
          }, {
            value: result['empCcCount'],
            percent: result['empCcCount'] !== 0 ? (result['empCcCount'] / this.sum[0]) : 0,
            name: '出差',
            key: 'empCcCount'
          }, {
            value: result['empJyCount'],
            percent: result['empJyCount'] !== 0 ? (result['empJyCount'] / this.sum[0]) : 0,
            name: '经营',
            key: 'empJyCount'
          }, {
            value: result['empZdCount'],
            percent: result['empZdCount'] !== 0 ? (result['empZdCount'] / this.sum[0]) : 0,
            name: '招待',
            key: 'empZdCount'
          }, {
            value: result['empTxCount'],
            percent: result['empTxCount'] !== 0 ? (result['empTxCount'] / this.sum[0]) : 0,
            name: '通讯',
            key: 'empTxCount'
          }]
          for (let i = 0; i < chartArray.length; i++) {
            let temp = []
            console.log(this.sum[i + 1], i + 1)
            for (let j = 0; j < keyArray.length; j++) {
              temp.push({
                value: result[keyArray[j].prefix + chartArray[i]],
                percent: result[keyArray[j].prefix + chartArray[i]] !== 0 ? (result[keyArray[j].prefix + chartArray[i]] / this.sum[i + 1]) : 0,
                name: keyArray[j].name,
                key: keyArray[j].prefix + chartArray[i]
              })
            }
            this.data[i + 1] = temp
          }
          this.chart = this.data[this.selected]
          this.setLegend()
        }
      })
    }
  },
  data() {
    return {
      menuPopupVisible: false,
      colors: ['#FFA700', '#F7660D', '#3ECA5B', '#E1BA77', ' #3AA5F1'],
      selected: 0,
      sum: [],
      tabs: [{ id: 0, name: '人数' }, { id: 1, name: '发放总额' }, { id: 2, name: '已使用额度' }],
      width: document.body.clientWidth-15,
      datetime: '',
      legend: {},
      lebelOptions: {
        sidePadding: 30,
        // inflectionOffset:5,
        activeShape: true,
        label1: function label1(data) {
          return {
            text: (data.percent * 100).toFixed(2) + '%',
            fill: '#343434',
            fontWeight: 'bold'
          }
        },
        label2: function label2(data) {
          return {
            text: data.name,
            fill: '#999'
          }
        },
        onClick: function onClick(ev) {
          let data = ev.data
          console.log(ev, data)
        }
      },
      legendOptions: {
        position: 'top',
        itemFormatter(val) {
          return val + '  ' + map[val]
        }
      },
      yOptions: {
        formatter(val) {
          return (val * 100).toFixed(2) + '%'
        }
      },
      info: {},
      data: [],
      chart: [
        { name: '', percent: 0 }
      ]
    }
  }
}

</script>
<style lang="less" scoped>
.buttons-row {
  background-color: transparent;
  margin-top: 10px;
}

.buttons-row>div.mint-navbar a {
  border-color: #DFB772;
  color: #DFB772;
}

.buttons-row>div.mint-navbar a.is-selected {
  background-color: #DFB772;
  border-right: 1px solid #DFB772 !important;
  color: #fff;
}

.content {
  background-color: #303030;

  .time {
    color: #fff;
    text-align: right;
    font-size: 12px;
    padding-right: 10px;
  }

  .limit {
    color: #fff;
    display: flex;
    margin-top: 20px;
    margin-bottom: 35px;
    box-sizing: border-box;

    >div {
      width: 50%;
      text-align: center;
      letter-spacing: 1px;

      h1 {
        font-weight: normal;
        font-size: 16px;
      }

      p {
        // font-weight: bold;
        font-size: 22px;
        margin-top: 15px;
      }
    }
  }

  .card {
    background-color: #fff;
    height: calc(~"100% - 130px");
    margin: 10px;
    border-radius: 5px;
    overflow: auto;
    .header {
      >h1 {
        padding-left: 20px;
        margin-top: 10px;
        line-height: 30px;
        position: relative;

        &:before {
          content: '';
          display: block;
          background-color: #FAD43E;
          height: 20px;
          width: 4px;
          border-radius: 2px;
          position: absolute;
          top: 5px;
          left: 10px;
        }
      }

      .info {
        display: flex;
        border-bottom: 1px dashed #EFF1F0;
        padding: 15px 0;
        position: relative;

        >div {
          flex: 1;
          text-align: center;

          p {
            color: #303030;
            font-size: 14px;
            margin-bottom: 10px;
            opacity: .6;
          }

          h1 {
            font-size: 20px;
            white-space: nowrap;

          }
        }
      }
    }
  }
}

.chart {
  .legend-list {
    ul {
      padding: 10px 10px 0 10px;
      overflow: auto;
      list-style: none;
    }

    li {
      font-size: 12px;
      float: left;
      margin-bottom: 5px;
      width: 33.33%;

      span {
        color: #ACACAC;
        margin: 0 3px;
      }
    }

    i {
      margin: 0 3px;
      display: inline-block;
      vertical-align: 1px;
      width: 12px;
      height: 8px;
      background-color: #000;
    }
  }
}

.menu-popup {
  width: 150px;
  border-radius: 3px;
  transform: initial;
  right: 2px;
  top: 71px;
  padding: 0 9px;
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
    height: 35px;
    line-height: 35px;

    i {
      margin-right: 10px;
    }
  }
}

</style>
