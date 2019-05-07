<template>
  <div>
    <div class="page-approve-depart">
      <mt-header title="审批出行">
        <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
        <mt-button slot="right">立即出行</mt-button>
      </mt-header>
      <div class="content">
        <mt-navbar v-model="selected" v-on:click="switchTab">
          <mt-tab-item id="depart">
             <router-link to="/useCar" class="depart">立即出发</router-link>
          </mt-tab-item>
          <mt-tab-item id="approve">审批出行</mt-tab-item>
        </mt-navbar>
        <div class="tab-wrap">
          <mt-tab-container v-model="selected">
            <mt-tab-container-item id="approve">
              <div class="tab-nav">
                <div>车辆</div>
                <div>
                  <router-link to="/selectCar" class="car-number">粤XTQ265</router-link>
                </div>
              </div>
              <div class="tab-data">
                <div class="tab-item start border-bottom">
                  <div>起点</div>
                  <div>清晖园</div>
                </div>
                <div class="tab-item start end border-bottom">
                  <div>终点</div>
                  <div><input type="text" placeholder="你要去哪儿"></div>
                </div>
                <div class="tab-mileage">
                  <div><span class="icon-mileage"></span>预计里程：324KM</div>
                  <div>
                    <router-link to="/traveltrack" class="tarck-btn">
                      <a class="tarck-btn">查看预计轨迹</a>
                    </router-link>
                  </div>
                </div>
              </div>
              <div class="tab-bar">
                <div>记录行程</div>
                <div v-on:click="travelOpen">手动</div>
              </div>
              <div class="tab-bar">
                <div>预计出发时间</div>
                <div v-on:click="openPicker">立即出发</div>
              </div>
              <div class="tab-bar">
                <div>用车事由</div>
                <div v-on:click="openUseCarType">上下班</div>
              </div>
              <div class="tab-notes">
                <div>备注 (0/200)</div>
                <div><textarea class="text-frame" placeholder="请输入"></textarea></div>
              </div>
              <div class="user-frame border-bottom">
                <div>审批人</div>
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
              </div>
              <div class="user-frame border-bottom">
                <div>抄送人</div>
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
              </div>
              <!-- 记录行程弹窗 -->
              <mt-popup v-model="isOpenTravel" position="bottom">
                <div class="bar bar-nav">
                  <button class="button pull-left" v-on:click="closePopup">关闭</button>
                  <!-- <h1 class="title">审批出行</h1> -->
                  <button class="button pull-right" v-on:click="affirmPopup">确定</button>
                </div>
                <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
              </mt-popup>
              <!-- 预计出发时间弹窗 -->
              <mt-datetime-picker
                ref="departDate"
                type="datetime"
                year-format="{value} 年"
                month-format="{value} 月"
                date-format="{value} 日"
                hour-format="{value} 时"
                minute-format="{value} 分"
                v-model="defaultTime">
              </mt-datetime-picker>
              <!-- 用车事由弹窗 -->
              <mt-popup v-model="useCarCause" position="bottom">
                <div class="bar bar-nav">
                  <button class="button pull-left" v-on:click="closePopup">关闭</button>
                  <!-- <h1 class="title">审批出行</h1> -->
                  <button class="button pull-right" v-on:click="affirmPopup">确定</button>
                </div>
                <mt-picker :slots="useCarType" @change="onValuesChange"></mt-picker>
              </mt-popup>
            </mt-tab-container-item>
          </mt-tab-container>
          <div class="usecar-btn">
            <mt-button size="large">提交审批</mt-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name:'approveDepart',
  data(){
    return {
      selected: 'approve',
      defaultTime: new Date().format('yyyy-MM-dd hh:mm:ss'),
      employees:[],
      isOpenTravel:false,
      slots: [
         {
           values:['自动','手动']
         }
      ],
      useCarType:[
        {
          values:['上下班','探亲','出差','外出']
        }
      ],
      useCarCause:false
    }
  },
  watch: {
    selected(val, oldVal) {
      const currElement = document.querySelector('.active')
      currElement.className = ''
      let clickElement = document
        .querySelector('.slide-nav')
        .querySelector('#' + val)
      clickElement.className = 'active'
    }
  },
  methods: {
    switchTab(e) {
      if (e.target.tagName === 'LI') {
        this.selected = e.target.id
      }
    },
    openPicker() {
      this.$refs.departDate.open()
    },
    doDel() {
      this.$messagebox({
        title: '提示',
        message: '确定要结束行程吗?',
        showCancelButton: true
      })
    },
    travelOpen(){
      this.isOpenTravel = true
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
    onValuesChange(){
      console.log('222')
    },
    closePopup(){
      this.isOpenTravel=false
    },
    affirmPopup(){
      this.isOpenTravel=false
    },
    openUseCarType(){
      this.useCarCause=true
    }
  }
}
</script>
<style lang="less" scoped>
.mint-popup{
  width: 100%;
}
.mint-button.mint-button--default.mint-button--normal {
  color: #ba8833;
  font-size: 14px;
}
.depart {
  color: #ba8833;
}
.tab-wrap {
  background-color: @bgColor;
  padding: 10px 0;
  .tab-nav {
    height: 48px;
    line-height: 48px;
    background-color: #fff;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    div:nth-child(1) {
      width: 50%;
      padding-left: 12px;
    }
    div:nth-child(2) {
      width: 50%;
      padding-right: 28px;
      text-align: right;
      color: @grayFont;
      font-size: 14px;
      .car-number {
        color: @grayFont;
      }
    }
    div:nth-child(2)::after {
      content: "";
      display: inline-block;
      width: 8px;
      height: 8px;
      border-top: 2px solid #d8d8d8;
      border-right: 2px solid #d8d8d8;
      transform: rotate(45deg);
      position: absolute;
      top: 20px;
      right: 10px;
    }
  }
  .tab-bar {
    height: 48px;
    line-height: 48px;
    background-color: #fff;
    display: flex;
    align-items: center;
    margin: 10px 0;
    position: relative;
    div:nth-child(1) {
      width: 50%;
      padding-left: 12px;
    }
    div:nth-child(2) {
      width: 50%;
      padding-right: 28px;
      text-align: right;
      color: @grayFont;
      font-size: 14px;
      .car-number {
        color: @grayFont;
      }
    }
    div:nth-child(2)::after {
      content: "";
      display: inline-block;
      width: 8px;
      height: 8px;
      border-top: 2px solid #d8d8d8;
      border-right: 2px solid #d8d8d8;
      transform: rotate(45deg);
      position: absolute;
      top: 20px;
      right: 10px;
    }
  }
  .tab-notes {
    background-color: #fff;
    height: 120px;
    margin: 10px 0;
    padding: 10px;
    .text-frame {
      width: 100%;
      resize: none;
      color: #acacac;
      font-size: 16px;
      height: 80px;
      margin-top: 8px;
      font-family: PingFangSC-Regular, sans-serif, "Microsoft YaHei";
      border: none;
    }
  }
  .user-frame {
    background: #fff;
    padding: 10px;
  }
  .tab-data {
    background-color: #fff;
    .tab-item {
      padding-left: 27px;
      height: 44px;
      line-height: 44px;
      font-size: 12px;
      color: #303033;
      position: relative;
    }
    .tab-item::before {
      content: "";
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #15cc6b;
      position: absolute;
      left: 14px;
      top: 18px;
    }
    .tab-item.start {
      padding: 0 10px;
      display: flex;
      align-items: center;
    }
    .tab-item.start div:nth-child(1) {
      width: 10%;
      margin-left: 16px;
    }
    .tab-item.start div:nth-child(2) {
      width: 90%;
      font-size: 14px;
      color: #303033;
    }
    .tab-item.end::before {
      content: "";
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      position: absolute;
      left: 14px;
      top: 18px;
      background-color: #e54100;
    }
    .tab-item.end {
      display: flex;
      align-items: center;
      div:nth-child(1) {
        width: 10%;
      }
      div:nth-child(2) {
        width: 90%;
        font-size: 14px;
      }
      input {
        width: 90%;
        height: 32px;
        font-size: 14px;
        border: none;
        background-color: #ffff;
      }
    }
    .tab-mileage {
      height: 42px;
      line-height: 42px;
      display: flex;
      align-items: center;
      padding: 0 12px;
      div:nth-child(1) {
        font-size: 12px;
        color: #303033;
        width: 50%;
        .icon-mileage {
          font-size: 16px;
          color: #dfb772;
          margin-right: 5px;
          vertical-align: text-bottom;
        }
      }
      div:nth-child(2) {
        font-size: 12px;
        color: #ba8833;
        width: 50%;
        text-align: right;
        .tarck-btn {
          color: #dfb772;
        }
      }
    }
  }
  .usecar-btn {
    width: 90%;
    margin: 40px auto;
  }
}
</style>
