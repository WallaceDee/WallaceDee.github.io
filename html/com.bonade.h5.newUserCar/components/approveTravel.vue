<template>
  <div style="height:100%;" class="approveTravel">
      <!-- <mt-header title="审批出行">
        <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
        <mt-button icon="more" slot="right" v-on:click="openMenu" ref="button"></mt-button>
      </mt-header> -->
        <div class="slide-nav">
          <ul>
            <li v-on:click="switchTab" :class="[key == 0 ? 'active':'']" v-bind="{ 'id': statusItem.id,'value':statusItem.value }" v-for="(statusItem,key) in statusList" :key="statusItem.id">{{statusItem.name}}</li>
            <!-- <li class="active" id="all">全部</li>
            <li id="ready">未出发</li>
            <li id="ing">行程中</li>
            <li id="over">已完成</li>
            <li id="commit">已提交审批</li>
            <li id="approve">审批通过</li>
            <li id="close">已关闭</li> -->
          </ul>
        </div>
        <div class="card-header">
          <div>{{yearMonth}}</div>
          <div v-on:click="openPicker">
            <i class="icon-calendar"></i>
          </div>
        </div>
        <!-- <mt-tab-container v-model="selected">
          <mt-tab-container-item id="all"> -->
            <div class="fixeditem">
              <mt-loadmore :top-method="refresh" @translate-change="translateChange" @top-status-change="handleTopChange" :bottom-method="loadMore" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="false">
            <div class="cell-swipe-list" v-for="item in list" :key="item.id">
              <div v-if="item.status_ != '2'">
                <mt-cell-swipe :right="[{content: '<p class=\'delStyle\'><span>删除</span><p>',style: { background: '#E54100', color: '#fff' },handler: () => deleteSection(item.id)}]">
                  <div class="card">
                  <router-link 
                    :to="{
                        name:'travelDetail',
                        params: { 
                            routeId: item.id, 
                        }
                    }">
                    <div class="card-content">
                      <div class="info">
                        <img src="../assets/images/work@3x.png" v-if="item.name_ == '上下班'"/>
                        <img src="../assets/images/visitFamily@3x.png" v-else-if="item.name_ == '探亲'"/>
                        <img src="../assets/images/personalconsumption@3x.png" v-else-if="item.name_ == '个人消费'"/>
                        <img src="../assets/images/Business@3x.png" v-else-if="item.name_ == '出差办事'"/>
                        <img src="../assets/images/medicalTreatment@3x.png" v-else-if="item.name_ == '就医'"/>
                        <img src="../assets/images/deliverCustomers@3x.png" v-else-if="item.name_ == '接送客户'"/>
                        <img src="../assets/images/other@3x.png" v-else-if="item.name_ == '其它'"/>
                        <div>
                          <div class="carnumber">{{item.car_number}}</div>
                          <div class="tags">
                            <span class="lease" v-if="item.car_type == '0'"></span>
                            <span class="public" v-if="item.car_type == '1'"></span>
                            <span class="private" v-if="item.car_type == '2'"></span>
                            <span class="repeat" v-if="item.is_repeat == 'true'"></span>
                          </div>
                        </div>
                      </div>
                      <p>
                        <i class="icon-date"></i>
                        <span>{{item.create_time | datetime('MM月dd日 hh:mm',item.create_time)}}</span>
                      </p>
                      <div class="stroke">
                        <ul>
                          <li>
                            <span>{{item.expect_start_address | sitetitle(item.expect_start_address)}}</span>
                          </li>
                          <li>
                            <span>{{item.expect_end_address | sitetitle(item.expect_end_address)}}</span>
                          </li>
                        </ul>
                      </div>
                      <div class="icon-status">
                        <span class="icon-orange" v-if="item.status_ == '0'">已提交审批</span>
                        <span class="icon-orange" v-else-if="item.status_ == '1'">未出发</span>
                        <!-- <span class="icon-green" v-else-if="item.status_ == '2'">行程中</span> -->
                        <span class="icon-gray" v-else-if="item.status_ == '3'">已完成</span>
                        <span class="icon-gray" v-else-if="item.status_ == '4'">已撤销</span>
                        <span class="icon-gray" v-else-if="item.status_ == '5'">审批不通过</span>
                        <span class="icon-orange" v-else-if="item.status_ == '6'">已确认</span>
                        <span class="icon-gray" v-else-if="item.status_ == '7'">已过期未审批</span>
                        <span class="icon-gray" v-else-if="item.status_ == '8'">已过期</span>
                        <span class="icon-gray" v-else-if="item.status_ == '9'">已取消</span>
                        <span class="icon-gray" v-else-if="item.status_ == '10'">已提交</span>
                      </div>
                      <!-- <div class="pause-wrap" v-if="item.is_pause == '1'">
                        <div class="pause-icon"></div>
                      </div> -->
                      <div class="date-info">预计:{{item.expectl_predis / 1000}}km</div>
                    </div>
                    </router-link>
                    <div class="traver-footer" v-if="item.status_ == '0' || item.status_ == '1' || item.status_ == '2' || item.status_ == '5' || item.status_ == '3'">
                      <span v-if="item.status_ == '0'">审批通过后可出发</span>
                      <span v-if="item.status_ == '1'">到达开始时间自动开始</span>
                      <!-- <span v-if="item.status_ == '2'">到达目的地或结束时间自动结束</span> -->
                      <span v-if="item.status_ == '5'">审批不通过，行程已关闭</span>
                      <div class="btn-wrap">
                        <!-- <mt-button size="small" class="button" v-if="item.status_ == '1' && item.is_pause == '0'">暂停</mt-button> -->
                        <!-- <mt-button size="small" class="button" v-if="item.status_ == '1' && item.is_pause == '1'">继续行程</mt-button> -->
                        <!-- <mt-button size="small" class="close-travel button" v-on:click="doDel" v-if="item.status_ == '2'">结束行程</mt-button> -->
                        <mt-button size="small" class="button" v-if="item.status_ == '1'" v-on:click="start(item.id)">立即出发</mt-button>
                        <mt-button size="small" class="button" v-if="item.status_ == '3'" v-on:click="Jumprepeat(item.id)">重复行程</mt-button>
                      </div>
                    </div>
                  </div>
                </mt-cell-swipe>
              </div>

              <div class="card" v-if="item.status_ == '2'">
              <router-link 
                :to="{
                    name:'travelDetail',
                    params: { 
                        routeId: item.id, 
                    }
                }">
                <div class="card-content">
                  <div class="info">
                    <img src="../assets/images/work@3x.png" v-if="item.name_ == '上下班'"/>
                    <img src="../assets/images/visitFamily@3x.png" v-else-if="item.name_ == '探亲'"/>
                    <img src="../assets/images/personalconsumption@3x.png" v-else-if="item.name_ == '个人消费'"/>
                    <img src="../assets/images/Business@3x.png" v-else-if="item.name_ == '出差办事'"/>
                    <img src="../assets/images/medicalTreatment@3x.png" v-else-if="item.name_ == '就医'"/>
                    <img src="../assets/images/deliverCustomers@3x.png" v-else-if="item.name_ == '接送客户'"/>
                    <img src="../assets/images/other@3x.png" v-else-if="item.name_ == '其它'"/>
                    <div>
                      <div class="carnumber">{{item.car_number}}</div>
                      <div class="tags">
                        <span class="lease" v-if="item.car_type == '0'"></span>
                        <span class="public" v-if="item.car_type == '1'"></span>
                        <span class="private" v-if="item.car_type == '2'"></span>
                        <span class="repeat" v-if="item.is_repeat == 'true'"></span>
                      </div>
                    </div>
                  </div>
                  <p>
                    <i class="icon-date"></i>
                    <span>{{item.create_time | datetime('MM月dd日 hh:mm',item.create_time)}}</span>
                  </p>
                  <div class="stroke">
                    <ul>
                      <li>
                        <span>{{item.expect_start_address | sitetitle(item.expect_start_address)}}</span>
                      </li>
                      <li>
                        <span>{{item.expect_end_address | sitetitle(item.expect_end_address)}}</span>
                      </li>
                    </ul>
                  </div>
                  <div class="icon-status">
                    <!-- <span class="icon-orange" v-if="item.status_ == '0'">已提交审批</span>
                    <span class="icon-orange" v-else-if="item.status_ == '1'">未出发</span> -->
                    <span class="icon-green" v-if="item.status_ == '2'">行程中</span>
                    <!-- <span class="icon-gray" v-else-if="item.status_ == '3'">已完成</span>
                    <span class="icon-orange" v-else-if="item.status_ == '4'">已撤销</span>
                    <span class="icon-orange" v-else-if="item.status_ == '5'">审批不通过</span>
                    <span class="icon-gray" v-else-if="item.status_ == '6'">已确认</span>
                    <span class="icon-gray" v-else-if="item.status_ == '7'">已过期未审批</span>
                    <span class="icon-gray" v-else-if="item.status_ == '8'">已过期</span>
                    <span class="icon-gray" v-else-if="item.status_ == '9'">已取消</span>
                    <span class="icon-gray" v-else-if="item.status_ == '10'">已提交</span> -->
                  </div>
                  <!-- <div class="pause-wrap" v-if="item.is_pause == '1'">
                    <div class="pause-icon"></div>
                  </div> -->
                  <div class="date-info">预计:{{item.expectl_predis / 1000}}km</div>
                </div>
                </router-link>
                <div class="traver-footer">
                  <!-- <span v-if="item.status_ == '0'">审批通过后可出发</span>
                  <span v-if="item.status_ == '1'">到达开始时间自动开始</span> -->
                  <span v-if="item.status_ == '2'">到达目的地或结束时间自动结束</span>
                  <!-- <span v-if="item.status_ == '5'">审批不通过，行程已关闭</span> -->
                  <div class="btn-wrap">
                    <!-- <mt-button size="small" class="button" v-if="item.status_ == '1' && item.is_pause == '0'">暂停</mt-button> -->
                    <!-- <mt-button size="small" class="button" v-if="item.status_ == '1' && item.is_pause == '1'">继续行程</mt-button> -->
                    <mt-button size="small" class="close-travel button" v-on:click="end(item,item.id)" v-if="item.status_ == '2'">结束行程</mt-button>
                    <!-- <mt-button size="small" class="button" v-if="item.status_ == '1'" v-on:click="start(item.id)">立即出发</mt-button>
                    <mt-button size="small" class="button" v-if="item.status_ == '3'" v-on:click="start(item.id)">重复行程</mt-button> -->
                  </div>
                </div>
              </div>
            </div>
            </mt-loadmore>
            </div>
          <!-- </mt-tab-container-item>
        </mt-tab-container> -->
    <span class="no-data-tips" v-if="noData"></span>
      <baidu-map :ak="baiduMapAk">
        <bm-view class="map">
        </bm-view>
        <bm-driving 
          ref="drivemap"
          :start= "startLocation"
          :end= "endLocation"
          :auto-viewport="true"
          policy="BMAP_DRIVING_POLICY_LEAST_DISTANCE"
          NavigationControlType="BMAP_NAVIGATION_CONTROL_LARGE"
          :panel="false"
          v-on:resultshtmlset="panel"
          >
        </bm-driving> 
      </baidu-map>
  </div>
</template>
<script>
import bus from '../utils/bus';
import { baiduMapAk } from '@/config/'
import { BmlMarkerClusterer, BaiduMap, BmScale, BmMarker, BmCircle,BmDriving,BmView} from 'vue-baidu-map'
export default {
  name: 'approveTravel',
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
      baiduMapAk,
      selected: 'all',
      list: [],
      allLoaded: false,
      bottomStatus: '',
      topStatus: '',
      translate: 0,
      moveTranslate: 0,
      manualNum:0,
      row: 20,
      pageNum: 1,
      status:'',
      endLocation:{},
      startLocation:{},
      endLocationData:'',
      traveKm:'',
      itemId:'',
      yearMonth:new Date().getFullYear()+'-'+((new Date().getMonth()+1) < 10 ? '0'+(new Date().getMonth()+1):(new Date().getMonth()+1)),
      // delData:[{content: '<p class="delStyle"><span>删除</span><p>',style: { background: '#E54100', color: '#fff' },handler: () => this.$messagebox.confirm('确定要立即开始行程吗?').then(action => {

      // })}],
      statusList:[
        {'id':'all','name':'全部','value':' '},
        {'id':'ready','name':'未出发','value':'0'},
        {'id':'ing','name':'行程中','value':'1'},
        {'id':'over','name':'已完成','value':'2'},
        {'id':'commit','name':'已提交审批','value':'3'},
        {'id':'approve','name':'审批通过','value':'4'},
        {'id':'close','name':'已关闭','value':'5'},
      ],
      meunMore:false,
      menuVisible: false,
      buttonBottom: 0
    }
  },
  watch: {
    // selected(val, oldVal) {
    //   const currElement = document.querySelector('.active')
    //   currElement.className = ''
    //   let clickElement = document.querySelector('.slide-nav').querySelector('#' + val)
    //   clickElement.className = 'active'
    // }
  },
  computed:{
    noData() {
      return this.list.length === 0 && this.allLoaded
    },
  },
  methods: {
    leftButtonHandler(evt) {  
        console.log(123);  
    },
    switchTab(e) {
      if (e.target.tagName === 'LI') {
        for(var i=0;i<e.target.parentElement.childNodes.length;i++){
          e.target.parentElement.childNodes[i].className = '';
          if(e.target.id == this.statusList[i].id){
            e.target.className = 'active';
          }
        }

        if(e.target.textContent == '全部'){
          this.status = '';
        }else{
          this.status = e.target.value;
        }
        this.refresh()
      }
    },
    openPicker() {
      bus.$emit('appDate');
    },
    doDel() {
      this.$messagebox({
        title: '提示',
        message: '确定要结束行程吗?',
        showCancelButton: true
      })
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
    openMenu() {
      this.menuVisible = true
    },
    loadMore(isRefresh) {
      this.$utils.ajax({
        url:'route/app/v3/getroutelist',
        data:{employeeId:window.userInfo.empId,
              row: this.row,
              pageNum: this.pageNum,
              status:this.status,
              yearMonth:this.yearMonth
              },
        success:(res)=>{
            if (res.httpCode === '200') {
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
        },error: (err) => {
          this.$toast('出错了')
          this.allLoaded = true
        },
      })
    },
    refresh() {
      this.pageNum = 1
      this.loadMore(true)
    },
    start(id){
      this.$messagebox.confirm('确定要立即开始行程吗?').then(action => {
        this.$app.checkGPS((res)=>{
            if(res.status == '1'){
              this.$utils.ajax({
                url:'route/way/app/v2/wayrecord',
                data:{employeeId:window.userInfo.empId,
                      'routeId': id, 
                      'state': 0
                      },
                success:(res)=>{
                    if (res.httpCode === '200') {
                      this.$app.startLocation(id,(respose)=>{
                        this.refresh()
                      })
                    } else {
                      this.$toast(res.msg)
                    }
                },error: (err) => {
                  this.$toast('出错了')
                }
              // })
              });
            }
        })
      });
    },
    end(item,id){
      this.$messagebox.confirm('确定要结束行程吗?').then(action => {
        this.$app.checkGPS((respose)=>{
            if(respose.status == '1'){
              this.$app.getLocation((respose)=>{
                if(respose.status == '0'){
                  this.$toast(respose.msg)
                }else{
                  if(item.start_local){
                    this.startLocation = {lat:item.start_local.split(',')[1],lng:item.start_local.split(',')[0]}
                  }else{
                    this.startLocation = {lat:item.expect_start_local.split(',')[1],lng:item.expect_start_local.split(',')[0]}
                  }
                  this.endLocation = {lat:respose.data.lat,lng:respose.data.lng}
                  this.endLocationData = respose.data.lng+','+respose.data.lat
                  this.itemId = id;
                  this.$refs.drivemap.reload() 
                }
              })
            }else{
              this.$toast('无法定位')
            }
        })
      })
    },
    endRequest:_.debounce(function(){
      console.log(this.endLocationData)
        this.$utils.ajax({
          url:'route/way/app/v2/wayrecord',
          data:{employeeId:window.userInfo.empId,
                'routeId': this.itemId, 
                'state': 2,
                'endLocation':this.endLocationData,
                'mileage':this.traveKm
                },
          success:(res)=>{
              if (res.httpCode === '200') {
                      this.$app.stopLocation(this.itemId,(respose)=>{
                        this.refresh()
                      })
              } else {
                this.$toast(res.msg)
              }
          },error: (err) => {
            this.$toast('出错了')
          }
        });
    }, 500, true),
    panel(data){
      console.log(data.querySelector('.suggest-plan-des').innerHTML)
      let tripData = data.querySelector('.suggest-plan-des').innerHTML //百度返回数据(公里数及预计时间)
      tripData = tripData.split(' ')
      let timeValue = tripData[1].split(';')
      let unit = timeValue[0].split('&')[0] //预计里程单位(km/m)
      if(tripData){
        if(unit=='公里'){
          this.traveKm = tripData[0]*1000 
        }else if(unit=='米'){
          this.traveKm = tripData[0]
        }else{
          this.traveKm= '0'
        }
      }
      this.endRequest()
    },
    deleteSection(id){
      this.$messagebox.confirm('确定要删除行程吗?').then(action => {
        this.$utils.ajax({
          url:'route/app/v2/deleteroute',
          data:{employeeId:window.userInfo.empId,
                'routeId': id
                },
          success:(res)=>{
              if (res.httpCode === '200') {
                  this.$toast('删除成功')
                  this.refresh()
              } else {
                this.$toast(res.msg)
              }
          },error: (err) => {
            this.$toast('出错了')
          }
        });
      })
    },
    Jumprepeat(id){
      this.$router.push({'name':'repeatTravelApply',params:{
        'routeId':id
      }})
    }
  },
  mounted(){
    this.loadMore()
    bus.$emit('changetitle','审批出行');
    bus.$on('dateAppConfirm',(date)=>{
      var date = new Date(date);
      this.yearMonth = date.getFullYear()+'-'+((date.getMonth()+1) < 10 ? '0'+(date.getMonth()+1):(date.getMonth()+1));
      this.refresh()
    });
  }
}
</script>
<style lang="less">
.approveTravel{
.delStyle{
  display: table;
  width: 100%;
  height: 100%;
  span{
    display: table-cell;
    vertical-align: middle;
  }
}
.cell-swipe-list{
  margin-top: 10px;
  &:nth-child(2){
    margin-top: 0;
  }
}
.fixeditem{
  height: calc(~"100% - 60px");
  overflow-y: auto;
}
.mint-tab-item-label img{
  width: 24px;
  height: 24px;
}
.mint-tabbar{
  background-color:@mainColor;
  color:rgba(186, 136, 51, 0.5);
}
.mint-tabbar > .mint-tab-item.is-selected {
     background-color: @mainColor;
     color: @supportColor;
}
.mint-tab-item-label {
  color: @supportColor;
}
.use-car {
  position: absolute;
  bottom: 13px;
  left: 50%;
  margin-left: -26px;
  img{
    width: 52px;
    height: 52px;
  }
}

.icon-green {
  background-color: @green !important;
}

.icon-orange {
  background-color: #c09347 !important;
}

.icon-gray {
  background-color: #b4b4b4 !important;
}

.icon-orange:before {
  border-top: 6px solid #c09347 !important;
}

.icon-gray:before {
  border-top: 6px solid #b4b4b4 !important;
}
.icon-green:before {
  border-top: 6px solid @green !important;
}
.card-header {
  background-color: @bgColor;
  height: 30px;
  display: flex;
  line-height: 30px;
  justify-content: space-between;
  >div{
    &:nth-child(1){
      padding-left: 10px;
    }
    &:nth-child(2) {
      width: 30px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      padding-right: 10px;
    }
  }
}
.card {
  .card-content {
    position: relative;
    background-color: #fff;
    height: 150px;
    padding: 10px;
    border-bottom: 1px solid #eff1f0;
    .info {
      display: flex;
      img {
        display: block;
        width: 40px;
        height: 40px;
        margin-right: 10px;
      }
      >div {
        width: 50%;
        .carnumber{
          color: #303030;
        }
        .tags {
          margin-top: 5px;
          >span {
            font-size: 12px;
            padding: 2px 4px;
          }
          .public {
            background-color: rgba(245, 126, 83, 0.1);
            color: #f57e53;
            &:before {
              content: "公车"
            }
          }
          .repeat {
            background-color: rgba(186, 136, 51, 0.1);
            color: #ba8833;
            &:before {
              content: "重复"
            }
          }
        }
      }
    }
    p {
      height: 20px;
      line-height: 20px;
      margin-top: 10px;
      font-size: 12px;
      padding-left: 5px;
      color: @grayFont;
      i {
        vertical-align: -1px;
      }
    }
    .stroke ul {
      padding-left: 35px;
      padding-right: 10px;
      position: relative;
    }
    .stroke ul:before {
      content: "";
      display: block;
      width: 1px;
      height: 25px;
      position: absolute;
      top: 20px;
      left: 14px;
      border-left: 1px dashed #acacac;
    }
    .stroke ul li span {
      font-size: 12px;
      color: #303030;
    }
    .content-right {
      display: inline-block;
      float: right;
      .content-right-top {
        margin-top: -10px;
        text-align: right;
      }
      .content-right-centre {
        margin: 28px 0;
        padding-left: 22px;
      }
      .content-right-bottom {
        color: #ba8833;
        font-size: 12px;
        margin-top: 32px;
      }
    }
  }
  .traver-footer {
    background-color: white;
    padding: 10px;
    display: flex;
    align-items: center;
    span {
      color: #acacac;
      font-size: 12px;
      flex: 1;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .btn-wrap {
      text-align: right;
      // width: 50%;
      flex: 1;
      .close-travel {
        margin-left: 10px;
        margin-right: 2%;
      }
      .button{
        border: 1px solid #303030;
        color: #242424;
        background-color: #fff;
      }
    }
  }
  /*行程状态图标*/
  .icon-status {
    span {
      display: block;
      position: absolute;
      right: 10px;
      top: 0px;
      width: 64px;
      background-color: @green;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      color: #fff;
      text-align: center;
      &:before {
        content: "";
        display: inline-block;
        position: absolute;
        width: 0;
        height: 0;
        border-left: 32px solid transparent;
        border-right: 32px solid transparent;
        border-top: 6px solid @green;
        top: 20px;
        left: 0;
      }
    }
  }
  .pause-wrap {
    position: absolute;
    top: 54px;
    right: 30px;
  }
  .pause-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: @green;
    position: relative;
  }
  .pause-icon:before {
    content: "";
    width: 2px;
    height: 10px;
    display: inline-block;
    background-color: #fff;
    position: absolute;
    left: 7px;
    top: 7px;
  }
  .pause-icon:after {
    content: "";
    width: 2px;
    height: 10px;
    display: inline-block;
    background-color: #fff;
    position: absolute;
    right: 7px;
    top: 7px;
  }
  .date-info {
    position: absolute;
    top: 119px;
    right: 10px;
    color: @headerTitleColor;
    font-size: 12px;
  }
}

.slide-nav {
  background-color: #fff;
  overflow: auto;
  height: 30px;
  overflow: hidden;
  padding: 0 10px;
  ul {
    overflow-y: hidden;
    overflow-x: auto;
    white-space: nowrap;
  }
  li {
    list-style: none;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    font-size: 14px;
    display: inline-table;
    vertical-align: top;
    position: relative;
    color: @grayFont;
    &.active {
      color: @supportColor;
      &:before {
        content: "";
        display: block;
        height: 2px;
        width: 80%;
        background-color: @supportColor;
        position: absolute;
        bottom: 0;
        left: 10%;
      }
    }
  }
}
/*滑动删除样式*/
.mint-cell-swipe-button{
  background-color:#E54100;
} 
}

</style>
