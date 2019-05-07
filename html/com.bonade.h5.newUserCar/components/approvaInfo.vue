<template>
  <div>
    <div class="page-travel">
        <mt-header title="审批信息">
            <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
        </mt-header>
        <div class="content">
            <p class="detailtitle">行程数据</p>
            <div class="details-list">
              <mt-cell title="起点" value="清晖园"></mt-cell>
              <mt-cell title="终点" value="华南家电研究院"></mt-cell>
              <mt-cell title="出发时间" value="2017-03-23 11:32"></mt-cell>
              <mt-cell title="到达时间" value="2017-03-23 11:32"></mt-cell>
              <mt-cell title="车辆" value="湘T22333(公车)"></mt-cell>
              <mt-cell title="预计里程" value="23km"></mt-cell>
              <mt-cell title="实际里程" value="0.5km"></mt-cell>
            </div>
            <div class="stroke border-top">
              <mt-cell title="轨迹2" value="实际里程:5km"></mt-cell>
              <a href="">点击查看</a>
              <ul>
                <li>
                  <span>清晖园</span>
                </li>
                <li>
                  <span>华南家电研究院综合楼华南家电研究院综合楼华南家电研究院综合楼</span>
                </li>
              </ul>
            </div>
            <div class="swiperBtn">
              <mt-cell title="没有实际轨迹，使用预计轨迹提交"><mt-switch></mt-switch></mt-cell>
            </div>
            <p class="detailtitle">审批信息</p>
            <!-- <mt-button v-on:click.native="handleClicks">点击触发</mt-button> -->
             <div class="linkList">
              <mt-cell title="用车事由" is-link v-on:click.native="handleClicks">
                  <span v-text="catetype">请选择</span>
              </mt-cell>
            </div>
            <div>
              <mt-field label="备注" placeholder="请输入行程情况说明，例如：开车司机是谁，行程产生费用，轨迹变化原因等" type="textarea" rows="2"></mt-field>
            </div>
            <div class="component-wrapper">
              <div class="block-title">添加同行人</div>
              <div class="employee-chosen-list">
                <ul>
                  <li v-for="(item, index) in employees" v-bind:key="item.id">
                    <span style="background-image: url(./static/img/default_avatar.png)">
                      <i class="icon-close" v-on:click="doDelete(employees,index)"></i>
                    </span>
                    <p>{{item.userName}}</p>
                  </li>
                  <li class="add-btn" v-on:click="selectEmployees">
                    <span class="icon-plus"></span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="component-wrapper">
              <div class="block-title">图片<span>(可上传票据，加油发票等凭证)</span></div>
              <image-uploader v-on:upload="upload" v-bind:option="uploadOption" v-bind:max='2'></image-uploader>
            </div>
            <div class="component-wrapper">
              <div class="block-title">审批人</div>
              <div class="employee-chosen-list has-arrow">
                <ul>
                  <li v-for="(item, index) in employees" v-bind:key="item.id">
                    <span style="background-image: url(./static/img/default_avatar.png)">
                      <i class="icon-close" v-on:click="doDelete(employees,index)"></i>
                    </span>
                    <p>{{item.userName}}</p>
                  </li>
                  <li class="add-btn" v-on:click="selectEmployees">
                    <span class="icon-plus"></span>
                  </li>
                </ul>
              </div>
            </div>
          <div class="btn">
            <mt-button size="large">提交审批</mt-button>
        </div>
        </div>
    </div>
    <mt-popup v-model="popupVisible" position="bottom">
      <div class="bar bar-nav">
        <button class="button pull-left" v-on:click="closePopup">关闭</button>
        <h1 class="title">用车事由</h1>
        <button class="button pull-right" v-on:click="confirmPopup">确定</button>
      </div>
      <mt-picker :slots="slots" @change="onValuesChange" ref="picker"></mt-picker>
    </mt-popup>
  </div>
</template>
<script>
export default {
  name: 'approvalnfo',
  data() {
    return {
      popupVisible:false,
      catetype:'',
      employees: [],
      uploadList: [],
      uploadOption: {
        uploadFileName: 'default',
        tableName: 'default',
        tableCloumn: 'default'
      },
      uploadOption:'',
      slots: [
        {
          flex: 1,
          values: ['上下班', '探病', '出差', '2015-04', '2015-05', '2015-06'],
          className: 'slot1',
          textAlign: 'center'
        }
      ]
    }
  },
  methods: {
    onValuesChange(picker) {
      // if (values[0] > values[1]) {
      //   picker.setSlotValue(1, values[0]);
      // }
      console.log(picker.getValues());
    },
    closePopup(){
      this.popupVisible = false;
    },
    confirmPopup(picker){
// console.log(this.$refs.picker.getValues());
      this.catetype = this.$refs.picker.getValues()[0];
      this.popupVisible = false;
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
    doDelete(arr, index) {
      arr.splice(index, 1)
    },
    upload(urlArray) {
      this.uploadList = urlArray
      console.log(urlArray)
    },
    handleClicks:function(){
      this.popupVisible = true;
    }
  }
}

</script>
<style lang="less">
.linkList {
  margin-top: 10px;
  .mint-cell-text {
    font-size: 14px;
    color: #303030;
  }
  .mint-cell-wrapper {
    .mint-cell-value {
      span {
        color: #acacac;
        font-size: 14px;
      }
      &.is-link {
        margin-right: 15px;
      }
    }
    .mint-cell-allow-right::after {
      right: 15px;
    }
  }
  .mint-cell {
    background-color: #fff;
  }
}
.swiperBtn{
  background-color: #fff;
  border: 1px solid @bgColor;
  .mint-cell-text{
    font-size: 14px;
  }
}
.mint-switch-core{
  width: 32px;
  height: 14px;
  &:before {
    width: 30px;
    height: 12px;
    background-color: #fdfdfd;
  }
  &:after{
        width: 12px;
      height: 12px;
  }
}
.mint-switch-input:checked + .mint-switch-core::after{
  -webkit-transform: translateX(18px);
    transform: translateX(18px);
}
.detailtitle{
  padding: 10px;
  font-size: 14px;
}
.mint-popup{
  width: 100%;
}
.is-textarea{
  border-top: 1px solid #EFF1F0;
  .mint-cell-title{
    font-size: 14px;
  }
  .mint-cell-wrapper{
    align-items: flex-start;
  }
  textarea::-webkit-input-placeholder{
    font-size: 12px;
    color: #ACACAC;
  }
}
.btn {
  padding: 20px 10px;
  .mint-button-text {
    font-size: 14px;
  }
}
</style>
