<template>
  <div>
    <div class="repeatTravelApply">
      <mt-header title="重复详情申请">
        <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
      </mt-header>
      <div class="content">
        <div class="margin-top">
            <mt-cell title="起点" v-bind:value="StartAddress"></mt-cell>
            <mt-cell title="终点" v-bind:value="EndAddress"></mt-cell>
            <a class="mint-cell">
                <div class="mint-cell-wrapper">
                    <div class="mint-cell-title">
                        <span class="mint-cell-text">预计里程<span class="subtitle">(预计轨迹)</span></span>
                    </div>
                    <div class="mint-cell-value">
                        <span>{{Number(car1RouteDetail.expectlPredis)/1000}}km</span>
                    </div>
                </div>
            </a>
            <mt-cell title="用车事由" value="接送客户"></mt-cell>
            <mt-cell title="车辆" v-bind:value="car1Route.carType=='1' ? car1RouteDetail.carPlate+'(公车)' : car1Route.carType=='0' ? car1RouteDetail.carPlate+'(租赁车辆)' : car1RouteDetail.carPlate+'(私车)'"></mt-cell>
            <mt-cell title="出发时间" v-bind:value="car1Route.startTime | datetime('hh:mm',car1Route.startTime)"></mt-cell>
            <mt-cell title="到达时间" v-bind:value="car1Route.endTime | datetime('hh:mm',car1Route.endTime)"></mt-cell>
        </div>
        <div class="margin-top">
            <mt-cell title="设置重复日期" value="每日生成行程"></mt-cell>
            <a class="mint-cell">
                <span class="mint-cell-mask"></span>
                <div class="mint-cell-left"></div>
                <div class="mint-cell-wrapper">
                    <div class="mint-cell-title">
                        <span class="mint-cell-text">开始时间</span>
                    </div>
                    <div class="mint-cell-value is-link" v-on:click="open('start')">
                        <span>{{repeatStartDate ? repeatStartDate : '请选择'}}</span>
                    </div>
                    <i class="mint-cell-allow-right"></i>
                </div>
            </a>
            <a class="mint-cell">
                <span class="mint-cell-mask"></span>
                <div class="mint-cell-left"></div>
                <div class="mint-cell-wrapper">
                    <div class="mint-cell-title">
                        <span class="mint-cell-text">结束时间</span>
                    </div>
                    <div class="mint-cell-value is-link" v-on:click="open('end')">
                        <span>{{repeatEndDate ? repeatEndDate : '请选择'}}</span>
                    </div>
                    <i class="mint-cell-allow-right"></i>
                </div>
            </a>
        </div>
        <div class="margin-top">
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
                    <span class="bnd-icon-plus"></span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="component-wrapper">
              <div class="block-title">抄送人</div>
              <div class="employee-chosen-list">
                <ul>
                  <li v-for="(item, index) in CCemployees" v-bind:key="item.id">
                    <span style="background-image: url(./static/img/default_avatar.png)">
                      <i class="icon-close" v-on:click="doDelete(employees,index)"></i>
                    </span>
                    <p>{{item.userName}}</p>
                  </li>
                  <li class="add-btn" v-on:click="selectCCEmployees">
                    <span class="bnd-icon-plus"></span>
                  </li>
                </ul>
              </div>
            </div>
        </div>
        <div class="usecar-btn">
          <mt-button size="large" v-on:click="submit">提交审批</mt-button>
        </div>
      </div>
    </div>
    <mt-datetime-picker v-model="repeatTime" ref="time" type="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="repeatTimeConfirm">
    </mt-datetime-picker>
    <!-- <mt-datetime-picker v-model="repeatendtime" ref="endtime" type="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="repeatendtimeConfirm">
    </mt-datetime-picker> -->
  </div>
</template>
<script>
export default {
  name: 'repeatTravelApply',
  data() {
    return {
      employees: [],
      CCemployees:[],
      traveldata:'',
      startAddress:'',
      repeatTime:new Date().format('yyyy-MM-dd'),
      repeatStartDate:'',
      repeatEndDate:'',
      CCempArr:[],
      empArr:[],
      repeatData:{},
      type:'',
      endAddress:'',
      startTime:'',
      endTime:''
    }   
  },
      computed:{
        StartAddress() {
            if(this.startAddress.split('_7_')[0] != ''){
                return this.startAddress.split('_7_')[0];
            }else if(this.startAddress.split('_7_')[1]){
                return this.startAddress.split('_7_')[1];
            }
        },
        EndAddress() {
            if(this.endAddress.split('_7_')[0] != ''){
                return this.endAddress.split('_7_')[0];
            }else if(this.endAddress.split('_7_')[1]){
                return this.endAddress.split('_7_')[1];
            }
        },
        car1Route(){
            if(!this.traveldata){
                return ''
            }else{
                return this.traveldata.car1Route
            }
        },
        car1RouteDetail(){
            if(!this.traveldata){
                return ''
            }else{
                return this.traveldata.car1RouteDetail
            }
        },
        flowDetailList(){
            if(!this.traveldata){
                return ''
            }else{
                return this.traveldata.flowDetailList
            }
        },
        userList(){
            if(!this.traveldata){
                return ''
            }else{
                return this.traveldata.userList
            }
        }
  },
  methods:{
    selectEmployees() {
      this.$employeePicker({
        title: '选择审批人',
        values: this.employees,
        multiple: true,
        callback: (res) => {
          this.employees = res
          this.employees = [];
          for(var i=0;i<this.employees.length;i++){
                this.empArr.push(this.employees[i].id)
          }
        }
      })
    },
    selectCCEmployees() {
      this.$employeePicker({
        title: '选择抄送人',
        values: this.CCemployees,
        multiple: true,
        callback: (res) => {
          this.CCemployees = res
          this.CCempArr = [];
          for(var i=0;i<this.CCemployees.length;i++){
                this.CCempArr.push(this.CCemployees[i].id)
          }
        }
      })
    },
    doDelete(arr, index) {
      arr.splice(index, 1)
    },
    requestData(){
      this.$utils.ajax({
        url:'route/app/v2/getroutedetail',
        data:{employeeId:window.userInfo.empId,
              routeId: this.$route.params.routeId,
              },
        success:(res)=>{
            if (res.httpCode === '200') {
                this.traveldata = res.data
                this.startAddress = this.traveldata.car1Route.expectStartAddress
                this.endAddress = this.traveldata.car1Route.expectEndAddress
                this.startTime = this.traveldata.car1Route.startTime
                this.endTime = this.traveldata.car1Route.endTime
            } else {
              this.$toast('出错了')
            }
        },error: (err) => {
          this.$toast('出错了')
        },
      })
    },
    open(type){
      this.type = type;
      this.$refs.time.open()
    },
    repeatTimeConfirm(){
      var repeatDate = new Date(this.repeatTime);
      if(this.type == 'start'){
        this.repeatStartDate = repeatDate.getFullYear()+'-'+((repeatDate.getMonth()+1) < 10 ? '0'+(repeatDate.getMonth()+1):(repeatDate.getMonth()+1)) + '-' +(repeatDate.getDate() < 10 ? '0'+repeatDate.getDate():repeatDate.getDate())
      }else{
        this.repeatEndDate = repeatDate.getFullYear()+'-'+((repeatDate.getMonth()+1) < 10 ? '0'+(repeatDate.getMonth()+1):(repeatDate.getMonth()+1)) + '-' +(repeatDate.getDate() < 10 ? '0'+repeatDate.getDate():repeatDate.getDate())
      }
    },
    submit(){
        let fromData = [

            {
              title: '开始时间',
              value: this.repeatStartDate,
              require: true,
              select: true
            },{
              title: '结束时间',
              value: this.repeatEndDate,
              require: true,
              select: true  
            },{
                title: '审批人',
                value: this.empArr,
                require: true,
                select: true
            },{
                title: '抄送人',
                value: this.CCempArr,
                require: true,
                select: true
            }
        ]
      if (Date.parse(this.repeatStartDate) >= Date.parse(this.repeatEndDate)) {
        this.$toast('开始时间应早于结束时间')
        return false
      }
        let flag = this.$utils.validate(fromData)
        if(flag){
          this.repeatData = {
            'routeId':this.$route.params.routeId,
            'repeatStartDate':Date.parse(this.repeatStartDate+' '+this.startTime.split(' ')[1]),
            'repeatEndDate':Date.parse(this.repeatEndDate+' '+this.endTime.split(' ')[1]),
            'approvalPersons':this.empArr.toString(),
            'copyPersons':this.CCempArr.toString(),
            'employeeId':window.userInfo.empId
          }
          this.$utils.ajax({
            url:'route/apply/app/v3/submitrepeatapply',
            data:this.repeatData,
            success:(res)=>{
                if (res.httpCode === '200') {
                    this.$toast('提交成功')
                    this.$router.push({'name':'approveTravel'})
                } else {
                  this.$toast(res.data.msg)
                }
            },error: (err) => {
              this.$toast('出错了')
            },
          })
        }
    }
  },
  mounted(){
      this.requestData()
  }
}

</script>
<style lang="less">
.margin-top{
    margin-top: 10px;
}
.subtitle{
    font-size: 12px;
    color: #ACACAC;
    margin-left: 10px;
}
.usecar-btn{
    padding: 10px;
}
</style>
