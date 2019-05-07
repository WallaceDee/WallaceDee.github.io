<template>
  <div>
    <div class="page-use-car">
      <mt-header title="用车">
        <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
      </mt-header>
      <div class="content">
        <mt-navbar v-model="selected" v-on:click="switchTab">
          <mt-tab-item id="depart">立即出发</mt-tab-item>
          <mt-tab-item id="approve"> 审批出行</mt-tab-item>
        </mt-navbar>
          <mt-tab-container v-model="selected">
            <mt-tab-container-item id="depart" class="tab-depart"> 
              <div class="tab-nav">
                <div>车辆</div>
                <div>
                  <router-link class="car-number" 
                  :to="{
                      name:'selectCar',
                      params:{ 
                        type: 'travelCar',
                      }
                  }"> 
                  {{travelparam.carNumber}}
                  </router-link> 
                </div>
              </div>      
              <div class="tab-data">
                <router-link
                  :to="{
                      name:'site',
                      params:{ 
                        type: 'traveStart',
                        tabId:1
                      }
                  }"> 
                  <div class="tab-item start border-bottom">
                    <div>起点</div>
                    <div>{{startName}}</div>
                  </div>
                </router-link>
                 <router-link 
                  :to="{
                      name:'site',
                      params:{ 
                        type: 'traveEnd',
                        tabId:1
                      }
                  }"> 
                  <div class="tab-item start end border-bottom">
                    <div>终点</div>
                    <div>{{endName}}</div>
                  </div>
                </router-link>
                <div class="tab-mileage">
                  <div><span class="icon-mileage"></span>预计里程：{{traveKm}}</div>
                  <div>
                      <a class="tarck-btn" v-on:click="trackDetail">查看预计轨迹</a>
                  </div>
                </div>
              </div>
              <div class="tab-bar">
                <div>用车事由</div>
                <div v-on:click="openTravelReason(1)">{{causeTitle}}</div>
              </div>
              <div class="usecar-btn">
                <mt-button size="large" v-on:click.native="travelSubmit(1)" ref="button">立即出发</mt-button>    
              </div>
              <div class="footer-text" v-on:click="travelSubmit(2)" ref="button">稍后出发</div>
            </mt-tab-container-item>
            <!-- 审批出行 -->
            <mt-tab-container-item id="approve" class="tab-approve">
              <div class="tab-nav">
                <div>车辆</div>
                <div>
                  <router-link class="car-number"
                  :to="{
                      name:'selectCar',
                      params:{ 
                        type: 'approveTravelCar',
                      }
                  }"> 
                    {{approveCarNumber}}
                  </router-link> 
                </div>
              </div>      
              <div class="tab-data">
                <router-link
                  :to="{
                      name:'site',
                      params:{ 
                        type: 'approveTraveStart',
                        tabId:2
                      }
                  }"> 
                  <div class="tab-item start border-bottom">
                    <div>起点</div>
                    <div>{{approveStartName}}</div>
                  </div>
                </router-link>
                 <router-link 
                  :to="{
                      name:'site',
                      params:{ 
                        type: 'approveTraveEnd',
                        tabId:2
                      }
                  }"> 
                  <div class="tab-item start end border-bottom">
                    <div>终点</div>
                    <div>{{approveEndName}}</div>
                  </div>
                </router-link>
                <div class="tab-mileage">
                  <div><span class="icon-mileage"></span>预计里程：{{approveTraveKm}}</div>
                  <div>
                      <a class="tarck-btn" v-on:click="approveTrackDetail">查看预计轨迹</a>
                  </div>
                </div>
              </div>
              <div class="tab-bar">
                <div>记录行程</div>
                <div v-on:click="travelOpen">{{approveTravelSwitch}}</div>
              </div>
              <div class="tab-bar">
                <div>预计出发时间</div>
                <div v-on:click="openPicker">{{departTime}}</div>
              </div>
              <div class="tab-bar">
                <div>用车事由</div>
                <div v-on:click="openTravelReason(2)">{{approveCauseTitle}}</div>
              </div>
              <div class="tab-notes">
                <div>备注 ({{approvTravelparam.routeNote.length}}/200)</div>
                <div><textarea class="text-frame" placeholder="请输入" v-model="approvTravelparam.routeNote" maxlength="200"></textarea></div>
              </div>
              <div class="user-frame border-bottom">
                <div>审批人</div>
                  <div class="employee-chosen-list has-arrow">
                      <ul>
                          <li v-for="(item, index) in approvalPersons" v-bind:key="item.id">
                              <span style="background-image: url(./static/img/default_avatar.png)">
                                  <i class="icon-close" v-on:click="doDelete(approverList,index,true)"></i>
                              </span>
                              <p>{{item.userName}}</p>
                          </li>
                          <li class="add-btn" v-on:click="selectApprovePerson">
                              <span class="icon-plus"></span>
                          </li>
                      </ul>
                  </div>
              </div>
              <div class="user-frame border-bottom">
                <div>抄送人</div>
                <div class="employee-chosen-list has-arrow">
                  <ul>
                      <li v-for="(item, index) in copyPersons" v-bind:key="item.id">
                          <span style="background-image: url(./static/img/default_avatar.png)">
                              <i class="icon-close" v-on:click="doDelete(approverList,index,true)"></i>
                          </span>
                          <p>{{item.userName}}</p>
                      </li>
                      <li class="add-btn" v-on:click="selectCopyPerson">
                          <span class="icon-plus"></span>
                      </li>
                  </ul>
                </div>
              </div>
              <div class="usecar-btn">
                <mt-button size="large" v-on:click.native="approveTravelSubmit" ref="approveButton">提交审批</mt-button>    
              </div>
            </mt-tab-container-item>
          </mt-tab-container>
      </div>
      <!-- 立即出发map -->
      <baidu-map :ak="baiduMapAk">
        <bm-view class="map">
        </bm-view>
        <bm-driving
          ref="map"
          :start= "mapStart"
          :end= "mapEnd"
          :auto-viewport="true"
          policy="BMAP_DRIVING_POLICY_LEAST_DISTANCE"
          NavigationControlType="BMAP_NAVIGATION_CONTROL_LARGE"
          :panel="false"
          v-on:resultshtmlset="traveMapPanel"
          >
        </bm-driving> 
      </baidu-map>
      <!-- 审批出行map -->
      <baidu-map :ak="baiduMapAk">
        <bm-view class="map">
        </bm-view>
        <bm-driving
          ref="map"
          :start= "approveMapStart"
          :end= "approveMapEnd"
          :auto-viewport="true"
          policy="BMAP_DRIVING_POLICY_LEAST_DISTANCE"
          NavigationControlType="BMAP_NAVIGATION_CONTROL_LARGE"
          :panel="false"
          v-on:resultshtmlset="approveMapPanel"
          >
        </bm-driving> 
      </baidu-map>
    </div>
    <!-- 用车事由弹窗（立即出发） -->
    <mt-popup v-model="useCarReason" position="bottom">
      <div class="bar bar-nav">
        <button class="button pull-left" v-on:click="closeUsecar">关闭</button>
        <button class="button pull-right" v-on:click="affirmUsecar">确定</button>
      </div>
      <mt-picker :slots="reasonSlots"  value-key="name" ref="travelForm"></mt-picker>
    </mt-popup>
    <!-- 用车事由弹窗（审批出行） -->
    <mt-popup v-model="useCarReasonApprove" position="bottom">
      <div class="bar bar-nav">
        <button class="button pull-left" v-on:click="closeUsecarApprove">关闭</button>
        <button class="button pull-right" v-on:click="affirmUsecarApprove">确定</button>
      </div>
      <mt-picker :slots="approveReasonSlots"  value-key="name" ref="approveTravelForm"></mt-picker>
    </mt-popup>
    <!-- 记录行程弹窗 -->
    <mt-popup v-model="isOpenTravel" position="bottom">
      <div class="bar bar-nav">
        <button class="button pull-left" v-on:click="closePopup">关闭</button>
        <!-- <h1 class="title">审批出行</h1> -->
        <button class="button pull-right" v-on:click="affirmPopup">确定</button>
      </div>
      <mt-picker :slots="slots" value-key="name" ref="traveForm"></mt-picker>
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
      v-model="defaultTime"
      @confirm="deteCallback"
      >
    </mt-datetime-picker>
  </div>
</template>
<script>
import { baiduMapAk } from '@/config/'
import { BmlMarkerClusterer, BaiduMap, BmScale, BmMarker, BmCircle,BmDriving,BmView} from 'vue-baidu-map'
export default {
  name: 'useCar',
  components:{
  BmlMarkerClusterer,
  BaiduMap,
  BmScale,
  BmMarker,
  BmCircle,
  BmDriving,
  BmView 
  },
  data() {
    return {
      selected: 'depart',
      baiduMapAk,
      defaultTime: new Date().format('yyyy-MM-dd hh:mm'),
      isOpenTravel:false,
      slots: [
        {
          values:[{name:'手动',id:'1'},{name:'自动',id:'2'}]
        }
      ],
      reasonSlots:[{values:''}], //用车事由数据（立即出发）
      approveReasonSlots:[{values:''}], //用车事由数据（审批出行）
      useCarReason:false,
      useCarReasonApprove:false,
      traveKm:'0KM',
      traveTime:'',
      mapStart:{}, //起点经纬度
      mapEnd:{},  //终点经纬度
      startName:'', //起点地址（立即出发）
      endName:'',   //终点地址（立即出发）
      expectTime:'',
      travelparam:{
        employeeId:window.userInfo.empId,//员工id
        carType:'', //车辆类型
        carId:'', //车辆id
        carNumber:'请选择', //车牌号
        causeId:'', //用车事由id
        expectStartAddress:'', //预计出发地地址
        expectEndAddress:'', //预计目的地地址
        expectStartLocation:'', //预计出发地经纬度
        expectEndLocation:'', //预计目的地经纬度
        expectMileage:'', //预计里程（km）
        commitType:'', //提交类型
        startAddress:'', //实际出发地地址
        startLocation:'', //实际出发地经纬度
        expectArriveTime:'', //预计到达时间
      },
      causeTitle:'请选择' ,//确认用车事由赋值
      commitType:'', //提交类型初始化
      approvTravelparam:{
        companyId:window.userInfo.companyId,//员工企业id
        employeeId:window.userInfo.empId,//员工id
        carType:'', //车辆类型
        carId:'', //车辆id
        causeId:'', //用车事由id
        startAddress:'', //起点地址
        endAddress:'', //目的地地址
        startGpsData:'', //起点经纬度
        endGpsData:'', //目的地经纬度
        routeLen:'', //预计里程（km）
        routeType:'', //行程类型
        startTime:'', //出发时间
        endTime:'', //到达时间
        routeNote:'', //行程说明
        cartCateId:'', //	用车事由id
        approvalPersons:'', //流程审核人ids
        copyPersons:'' //抄送人ids
      },
      approveCarNumber:'请选择',
      approveStartName:'', //起点地址（审批出行）
      approveEndName:'',   //终点地址（审批出行）
      approveMapStart:{}, //起点经纬度
      approveMapEnd:{},  //终点经纬度
      approveTraveKm:'0KM',
      approveExpectTime:'',
      approveCauseTitle:'请选择' ,//确认用车事由赋值(审批)
      approveTravelSwitch:'请选择', //记录行程（审批）
      departTime:'请选择',
      approvalPersons: [], //审批人数组
      copyPersons: []   //抄送人数组
    }
  },
  created(){
    if(this.$route.params.tabId==1){
      this.selected='depart'
    }else if(this.$route.params.tabId==2){
      this.selected='approve'
    }else{
      this.selected='depart'
    }
    //立即出发(起点)
    if(this.$route.params.siteType =='traveStart'){
      let traveStartData = JSON.parse(sessionStorage.getItem('traveStartObj'))
      this.mapStart = traveStartData//经纬度
      this.startName = traveStartData.title //起点赋值
      this.travelparam.expectStartAddress = traveStartData.title +'_7_'+ traveStartData.name //预计出发地地址
      this.travelparam.expectStartLocation = traveStartData.lng +','+ traveStartData.lat //预计起点经纬度
    }else if(sessionStorage.getItem('traveStartObj')){
      let traveStartData = JSON.parse(sessionStorage.getItem('traveStartObj'))
      this.mapStart = traveStartData//经纬度
      this.startName = traveStartData.title //起点赋值
      this.travelparam.expectStartAddress = traveStartData.title +'_7_'+ traveStartData.name //预计出发地地址
      this.travelparam.expectStartLocation = traveStartData.lng +','+ traveStartData.lat //预计起点经纬度
    }else{
      this.startName ='你要去哪儿'
    }
    //立即出发(终点)
    if(this.$route.params.siteType =='traveEnd'){
      let traveEndData = JSON.parse(sessionStorage.getItem('traveEndObj'))
      this.mapEnd = traveEndData//经纬度
      this.endName = traveEndData.title //终点赋值
      this.travelparam.expectEndAddress = traveEndData.title +'_7_'+ traveEndData.name  //预计终点地址
      this.travelparam.expectEndLocation = traveEndData.lng +','+ traveEndData.lat //预计终点经纬度
    }else if(sessionStorage.getItem('traveEndObj')){
      let traveEndData = JSON.parse(sessionStorage.getItem('traveEndObj'))
      this.mapEnd = traveEndData//经纬度
      this.endName = traveEndData.title //终点赋值
      this.travelparam.expectEndAddress = traveEndData.title +'_7_'+ traveEndData.name  //预计终点地址
      this.travelparam.expectEndLocation = traveEndData.lng +','+ traveEndData.lat //预计终点经纬度
    }else{
      this.endName ='你要去哪儿'
    }
     //审批出行(起点)
    if(this.$route.params.siteType =='approveTraveStart'){
      let traveStartData = JSON.parse(sessionStorage.getItem('approveTraveStartObj'))
      this.approveMapStart = traveStartData//经纬度
      this.approveStartName = traveStartData.title //起点赋值
      this.approvTravelparam.startAddress = traveStartData.title +'_7_'+ traveStartData.name //预计出发地地址
      this.approvTravelparam.startGpsData = traveStartData.lng +','+ traveStartData.lat //预计起点经纬度
    }else if(sessionStorage.getItem('approveTraveStartObj')){
      let traveStartData = JSON.parse(sessionStorage.getItem('approveTraveStartObj'))
      this.approveMapStart = traveStartData//经纬度
      this.approveStartName = traveStartData.title //起点赋值
      this.approvTravelparam.startAddress = traveStartData.title +'_7_'+ traveStartData.name //预计出发地地址
      this.approvTravelparam.startGpsData = traveStartData.lng +','+ traveStartData.lat //预计起点经纬度
    }else{
      this.approveStartName ='你要去哪儿'
    }
    //审批出行(终点)
    if(this.$route.params.siteType =='approveTraveEnd'){
      let traveEndData = JSON.parse(sessionStorage.getItem('approveTraveEndObj'))
      this.approveMapEnd = traveEndData//经纬度
      this.approveEndName = traveEndData.title //终点赋值
      this.approvTravelparam.endAddress = traveEndData.title +'_7_'+ traveEndData.name  //预计终点地址
      this.approvTravelparam.endGpsData = traveEndData.lng +','+ traveEndData.lat //预计终点经纬度
    }else if(sessionStorage.getItem('approveTraveEndObj')){
      let traveEndData = JSON.parse(sessionStorage.getItem('approveTraveEndObj'))
      this.approveMapEnd = traveEndData//经纬度
      this.approveEndName = traveEndData.title //终点赋值
      this.approvTravelparam.endAddress = traveEndData.title +'_7_'+ traveEndData.name  //预计终点地址
      this.approvTravelparam.endGpsData = traveEndData.lng +','+ traveEndData.lat //预计终点经纬度
    }else{
      this.approveEndName ='你要去哪儿'
    }
  },
  // computed:{
  //   carNumber(){
  //     return this.$store.state.carNumber;
  //   }
  // },
  watch: {
    selected(val, oldVal) {
      // console.log(val,'当前状态')
      // console.log(oldVal,'改变前状态')
      if(val=='approve'){
         this.approveTravelDetail()
      }
    }
  },
  methods: {
    switchTab(e) {
      if (e.target.tagName === 'LI') {
        this.selected = e.target.id
      }
    },
    travelOpen(){
      this.isOpenTravel = true;
    },
    closePopup(){ //审批出行-记录行程取消选择
      this.isOpenTravel=false
    },
    affirmPopup(){ //审批出行-记录行程确认选择
      let reason = this.$refs.traveForm.getValues()
      this.approveTravelSwitch = reason[0].name
      this.approvTravelparam.routeType = reason[0].id
      this.isOpenTravel=false
    },
    openPicker() {
      this.$refs.departDate.open()
    },
    deteCallback(){
      console.log(this.defaultTime,'时间回调')
      let date = new Date(this.defaultTime)
      let Y = date.getFullYear() + '-'
      let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
      let D = date.getDate() + ' '
      let h = date.getHours() + ':'
      let m = date.getMinutes()
      this.departTime = Y+M+D+h+m//页面赋值
      this.approvTravelparam.startTime = new Date(Y+M+D+h+m).getTime() //出发时间（时间戳）
      // console.log(new Date(Y+M+D+h+m).getTime(),'时间戳')
    },
    getUseCarReason(){ //请求用车事由
      this.$utils.ajax({
        url:'/route/apply/app/v2/cate',
        data:this.travelparam,
        success:(res)=>{
          if(res.httpCode === '200') {
            let data = res.data //用车事由列表
            let initArr =[]
            for(let i=0; i<data.length; i++){
              initArr.push({
                name:data[i].name,
                id:data[i].id
              })
            }
            this.reasonSlots[0].values = initArr
            this.approveReasonSlots[0].values = initArr
          } else {
            this.$toast(res.msg)
          }
        },error: (err) => {
          this.$toast(err.msg)
        },
      })
    },
    openTravelReason(type){
      if(type==1){ //立即出发-用车事由
        this.useCarReason=true 
      }
      if(type==2){//审批出行-用车事由
        this.useCarReasonApprove=true 
      }
    },
    closeUsecar(){ //用车事由-窗口关闭
      this.useCarReason=false
    },
    affirmUsecar(){ //用车事由-确认选择
      let reason = this.$refs.travelForm.getValues()
      this.causeTitle = reason[0].name
      this.travelparam.causeId = reason[0].id
      this.useCarReason=false
    },
    closeUsecarApprove(){ //用车事由-窗口关闭(审批)
      this.useCarReasonApprove=false
    },
    affirmUsecarApprove(){ //用车事由-确认选择（审批）
      let reason = this.$refs.approveTravelForm.getValues()
      this.approveCauseTitle = reason[0].name
      this.approvTravelparam.cartCateId = reason[0].id
      this.useCarReasonApprove=false
    },
    trackDetail(){ //立即出发-查看预计轨迹
      // console.log(!sessionStorage.getItem('traveStartObj'),'轨迹信息')
      if(!sessionStorage.getItem('traveStartObj')){
        this.$messagebox.alert('未选择起点,无法查看轨迹')
      }else if(!sessionStorage.getItem('traveEndObj')){
        this.$messagebox.alert('未选择终点,无法查看轨迹')
      }else{
        this.$router.push({name:'travelTrack',params:{'type':'travelPoint','tabId':1}})
      }
    },
    approveTrackDetail(){//审批出行-查看预计轨迹
      // console.log(!sessionStorage.getItem('traveStartObj'),'轨迹信息')
      if(!sessionStorage.getItem('approveTraveStartObj')){
        this.$messagebox.alert('未选择起点,无法查看轨迹')
      }else if(!sessionStorage.getItem('approveTraveEndObj')){
        this.$messagebox.alert('未选择终点,无法查看轨迹')
      }else{
        this.$router.push({name:'travelTrack',params:{'type':'approveTravelPoint','tabId':2}})
      }
    },
    traveMapPanel(data){ //百度地图面板回调
      this.getPlanTime(data)
    },
    approveMapPanel(data){//百度地图面板回调
      this.getApprovePlanTime(data)
    },
    getPlanTime(data){
      let tripData = data.querySelector('.suggest-plan-des').innerHTML //百度返回数据(公里数及预计时间)
      tripData = tripData.split(' ')
      let timeValue = tripData[1].split(';')
      let unit = timeValue[0].split('&')[0] //预计里程单位(km/m)
      let timeType = tripData[tripData.length-1] //获取预计时间类型(小时/分钟 分钟 天/小时)
      let timeNumber = timeValue[timeValue.length-1] //获取时间值
      if(tripData){
        if(unit=='公里'){
          this.traveKm = tripData[0]+'Km'
          this.travelparam.expectMileage=tripData[0] //预计里程（m）
        }else if(unit=='米'){
          this.traveKm = tripData[0]+'m'
          this.travelparam.expectMileage=tripData[0]/1000 //预计里程（m）
        }else{
          this.traveKm= '0Km'
          this.travelparam.expectMileage= 0 //预计里程（m）
        }
      }
      //行程预计时间计算
      if(timeType=='分钟'){
        let minute = parseInt(timeValue[timeValue.length-1])
        let totalTime = minute*60*1000*1.5
        this.expectTime = totalTime
        //console.log(totalTime,'总时间')
      }
      if(timeType.indexOf('小时') != -1 && timeType.indexOf('分钟') != -1){
         let hour = parseInt(timeValue[timeValue.length-1])
         let minute = tripData[tripData.length-1].match(/小时(\S*)分钟/)[1]
         minute = parseInt(minute)
         let totalTime = (hour*60 + minute)*60*1000*1.5
         this.expectTime = totalTime
        //console.log(totalTime,'总时间')
      }
      if(timeType.indexOf('天') != -1 && timeType.indexOf('小时') != -1){
         let day = parseInt(timeValue[timeValue.length-1])
         let hour = tripData[tripData.length-1].match(/天(\S*)小时/)[1]
         hour = parseInt(hour)
         let totalTime = (day*24*60 + hour*60)*60*1000*1.5
         this.expectTime = totalTime
        //console.log(totalTime,'总时间')
      }
    },
    getApprovePlanTime(data){
      // console.log(data,'地图回调')
      let tripData = data.querySelector('.suggest-plan-des').innerHTML //百度返回数据(公里数及预计时间)
      tripData = tripData.split(' ')
      let timeValue = tripData[1].split(';')
      let unit = timeValue[0].split('&')[0] //预计里程单位(km/m)
      let timeType = tripData[tripData.length-1] //获取预计时间类型(小时/分钟 分钟 天/小时)
      let timeNumber = timeValue[timeValue.length-1] //获取时间值
      if(tripData){
        if(unit=='公里'){
          this.approveTraveKm = tripData[0]+'Km'
          this.approvTravelparam.routeLen=tripData[0]*1000 //预计里程（m）
        }else if(unit=='米'){
          this.approveTraveKm = tripData[0]+'m'
          this.approvTravelparam.routeLen=tripData[0] //预计里程（m）
        }else{
          this.approveTraveKm= '0Km'
          this.approvTravelparam.routeLen= 0 //预计里程（m）
        }
      }
      //行程预计时间计算
      if(timeType=='分钟'){
        let minute = parseInt(timeValue[timeValue.length-1])
        let totalTime = minute*60*1000*1.5
        this.approveExpectTime = totalTime
        //console.log(totalTime,'总时间')
      }
      if(timeType.indexOf('小时') != -1 && timeType.indexOf('分钟') != -1){
         let hour = parseInt(timeValue[timeValue.length-1])
         let minute = tripData[tripData.length-1].match(/小时(\S*)分钟/)[1]
         minute = parseInt(minute)
         let totalTime = (hour*60 + minute)*60*1000*1.5
         this.approveExpectTime = totalTime
        //console.log(totalTime,'总时间')
      }
      if(timeType.indexOf('天') != -1 && timeType.indexOf('小时') != -1){
         let day = parseInt(timeValue[timeValue.length-1])
         let hour = tripData[tripData.length-1].match(/天(\S*)小时/)[1]
         hour = parseInt(hour)
         let totalTime = (day*24*60 + hour*60)*60*1000*1.5
         this.approveExpectTime = totalTime
        //console.log(totalTime,'总时间')
      }
    },
    traveInfo() { //请求立即出发详情
      this.$utils.ajax({
        url:'/route/car2route/app/v3/getcarlist',
        data:{employeeId:window.userInfo.empId},
        success:(res)=>{
          if (res.httpCode === '200') {
            //console.log(res)
            // console.log(this.$route.params,'页面接收参数')
            if(this.$route.params.type =='travelCar'){
              this.travelparam.carNumber = this.$route.params.car_number //车牌赋值
              this.travelparam.carId = this.$route.params.id
              this.travelparam.carType = this.$route.params.car_type
            }else{
              this.travelparam.carNumber = res.data.lastUseCar.car_number //车牌赋值
              this.travelparam.carId = res.data.lastUseCar.car_id
              this.travelparam.carType = res.data.lastUseCar.car_type
            }
            this.getUseCarReason() //请求用车事由
          } else {
            this.$toast(res.msg)
          }
        },error: (err) => {
          this.$toast(err.msg)
        },
      })
    },
    travelSubmit(type){
      this.commitType=type
      this.getLocation() //调用当前定位
      if(type == 1){
        this.travelparam.commitType=1
      }else{
        this.travelparam.commitType=2
      }
      let fromData=[{
          title: '车辆',
          value: this.travelparam.carId,
          require: true
      }, {
          title: '起点',
          value: this.travelparam.expectStartAddress,
          require: true
      }, {
          title: '终点',
          value: this.travelparam.expectEndAddress,
          require: true
      }, {
          title: '用车事由',
          value: this.travelparam.causeId,
          require: true
      }]
      let flag = this.$utils.validate(fromData) //表单校验
      if(flag){
        this.$refs.button.disabled = true
        this.travelparam.expectArriveTime =  this.expectTime + new Date().getTime() //预计到达时间
        // console.log(this.travelparam,'请求参数')
        this.$utils.ajax({
          url:'/route/car2route/app/v3/commitimmediateroute',
          data:this.travelparam,
          success:(res)=>{
            if (res.httpCode === '200') {
              if(type==1){
                this.$toast('立即出发请求成功')
                this.$router.push({name:'travel'})
              }else{
                this.$toast('稍后出发请求成功')
                this.$router.push({name:'travel'})
              }
            } else {
              this.$toast(res.msg)
              this.$refs.button.disabled = false
            }
          },error: (err) => {
            this.$toast(err.msg)
            this.$refs.button.disabled = true
          },
        })
      }
    },
    getLocation(){
      this.$app.getLocation((res)=>{
        //console.log(res,'定位信息')
        if(this.commitType == 1){
          this.travelparam.startLocation = res.data.lng +','+ res.data.lat //实际出发地经纬度
          this.$utils.getInfoByCoordinate({
            lat:res.data.lat,
            lng:res.data.lng
          }, (res) => {
            //console.log(res,'当前地址')
            this.travelparam.startAddress = res.result.formatted_address //实际出发地经纬度
          })
        }else{
           this.travelparam.startLocation = '' //实际出发地经纬度
           this.travelparam.startAddress = '' //实际出发地经纬度
        }
      })
    },
    approveTravelDetail(){ //请求审批出行详情
        this.$utils.ajax({
        url:'/route/car2info/app/v3/getsubmitinfo',
        data:{
          employeeId:window.userInfo.empId,
          companyInfoId:window.userInfo.companyId
          },
        success:(res)=>{
          if (res.httpCode === '200') {
            // console.log(res,'审批出行data')
            if(res.data.status=='0'){
              this.$messagebox.confirm('', { 
                message: '你未完成司机登记,请先提交登记资料并等待管理员审批通过', 
                title: '提示', 
                confirmButtonText: '提交资料', 
                cancelButtonText: '返回' 
                }).then(action => {
                  if (action == 'confirm'){//确认的回调
                    // console.log(1,'提交资料')
                  }
                }).catch(err => { 
                  if (err == 'cancel') { //取消的回调
                    this.selected = 'depart'
                  } 
              })
            }else if(res.data.status=='1'){
              // console.log(this.$route.params,'页面接收参数')
              if(this.$route.params.type =='approveTravelCar'){
                this.approveCarNumber = this.$route.params.car_number //车牌赋值
                this.approvTravelparam.carId = this.$route.params.id
                this.approvTravelparam.carType = this.$route.params.car_type
              }else{
                this.approveCarNumber = res.data.lastUseCar.car_number //车牌赋值
                this.approvTravelparam.carId = res.data.lastUseCar.car_id
                this.approvTravelparam.carType = res.data.lastUseCar.car_type
              }
            }
          } else {
            this.$toast(res.msg)
          }
        },error: (err) => {
          if(err.msg){
            this.$toast(err.msg)
          }
        },
      })
    },
    selectApprovePerson() { //审批人
      this.$employeePicker({
          title: '选择审批人',
          values: this.approvalPersons,
          multiple: true,
          callback(res) {
            //console.log(res,'当前选中的审批人')
            this.approvalPersons = res
          }
      })
    },
    selectCopyPerson() { //抄送人
      this.$employeePicker({
          title: '选择抄送人',
          values: this.copyPersons,
          multiple: true,
          callback(res) {
            // console.log(res,'当前选中的抄送人')
            this.copyPersons = res
          }
      })
    },
    //审批出行提交
    approveTravelSubmit(){ 
      if(this.approvalPersons.length>0){ //审批人id 
        let ids = this.approvalPersons
        let idsArr =[]
        for(let i=0; i<ids.length; i++){
          idsArr.push(ids[i].id)
        }
        this.approvTravelparam.approvalPersons = idsArr.join(',')
      }
      if(this.copyPersons.length>0){ //抄送人id 
        let ids = this.copyPersons
        let idsArr =[]
        for(let i=0; i<ids.length; i++){
          idsArr.push(ids[i].id)
        }
        this.approvTravelparam.copyPersons = idsArr.join(',')
      }
      let fromData=[
        {
          title: '车辆',
          value: this.approvTravelparam.carId,
          require: true
      },
       {
          title: '起点',
          value: this.approvTravelparam.startAddress,
          require: true
      }, {
          title: '终点',
          value: this.approvTravelparam.endAddress,
          require: true
      }, {
          title: '记录行程',
          value: this.approvTravelparam.routeType,
          require: true
      },
      {
          title: '预计出发时间',
          value: this.approvTravelparam.startTime,
          require: true
      },
      {
          title: '用车事由',
          value: this.approvTravelparam.cartCateId,
          require: true
      },
      {
          title: '审批人',
          value: this.approvTravelparam.approvalPersons,
          require: true
      }]
      let flag = this.$utils.validate(fromData) //表单校验
      if(flag){
        this.$refs.approveButton.disabled = true
        if(this.approvTravelparam.routeType==2){
          this.approvTravelparam.endTime = this.approveExpectTime + new Date().getTime() //预计到达时间
        }
        console.log(this.approvTravelparam,'请求参数')
        this.$utils.ajax({
          url:'/route/apply/app/v3/submitapply',
          data:this.approvTravelparam,
          success:(res)=>{
            if (res.httpCode === '200') {
              this.$toast('审批出行请求成功')
              this.$router.push({name:'travel'})
            } else {
              this.$toast(res.msg)
              this.$refs.approveButton.disabled = false
            }
          },error: (err) => {
            this.$toast(err.msg)
            this.$refs.approveButton.disabled = true
          },
        })
      }
    }
  },
  mounted(){
    this.traveInfo() //请求立即出发详情
  }
}
</script>
<style lang="less" scoped>
.page-use-car .map{
  width: 100%;
  height: 100px;
  position: fixed;
  bottom: 3px;
  position: absolute;
  z-index: -1;
  opacity: 0;
}
.mint-popup.mint-popup-bottom{
  width: 100%;
}
.mint-popup .mint-popup-bottom{
  width: 100%;
}
  .approve{
    color: #ba8833;
  }
  .footer-text{
    position: fixed;
    bottom: 20px;
    left: 50%;
    display: inline-block;
    width: 74px;
    margin-left: -37px;
    font-size: 18px;
    color: #ACACAC;
    a{
      color: #ACACAC;
    }
    }
  .tab-depart{
    background-color: @bgColor;
    padding: 10px 0;
    .tab-nav{
      height: 48px;
      line-height: 48px;
      background-color: #fff;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      div:nth-child(1){
        width: 50%;
        padding-left: 12px;
      }
      div:nth-child(2){
        width: 50%;
        padding-right: 28px;
        text-align: right;
        color: @grayFont;
        font-size: 14px;
        .car-number{
          color: @grayFont;
        }
      }
      div:nth-child(2)::after{
        content: '';
        display: inline-block;
        width: 8px;
        height: 8px;
        border-top: 2px solid #D8D8D8;
        border-right: 2px solid #D8D8D8;
        transform: rotate(45deg);
        position: absolute;
        top: 79px;
        right: 10px;
      }
    }
    .tab-data{
      background-color: #fff;
      .tab-item{
        padding-left: 27px;
        height: 44px;
        line-height: 44px;
        font-size: 12px;
        color: #303033;
        position: relative;
      }
      .tab-item::before{
        content: '';
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #15CC6B;
        position: absolute;
        left: 14px;
        top: 18px;
      }
      .tab-item.start{
        padding:0 10px;
        display: flex;
        align-items: center;
      }
      .tab-item.start div:nth-child(1){
          width: 10%;
          margin-left: 16px;
      }
      .tab-item.start div:nth-child(2){
          width: 90%;
          font-size: 14px;
          color: #303033;
          overflow: hidden;  
          text-overflow: ellipsis;  
          white-space: nowrap;
      }
      .tab-item.end::before{
        content: '';
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        position: absolute;
        left: 14px;
        top: 18px;
        background-color:#E54100;
      }
      .tab-item.end{
        display: flex;
        align-items: center;
        div:nth-child(1){
          width: 10%;
        }
        div:nth-child(2){
          width: 90%;
          font-size: 14px;
        }
      }
      .tab-mileage{
        height: 42px;
        line-height: 42px;
        display: flex;
        align-items: center;
        padding: 0 12px;
        div:nth-child(1){
          font-size: 12px;
          color: #303033;
          width: 50%;
          .icon-mileage{
            font-size: 16px;
            color: #DFB772;
            margin-right: 5px;
            vertical-align: text-bottom;
          } 
        }
        div:nth-child(2){
          font-size: 12px;
          color: #BA8833;
          width: 50%;
          text-align: right;
          .tarck-btn{
            color: #DFB772;
          }
        }
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
    .usecar-btn{
      width: 90%;
      margin: 40px auto;
    } 
  }
  .tab-approve {
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
      top: 79px;
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
