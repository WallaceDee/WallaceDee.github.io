<template>
  <div>
    <div class="repeatTravelDetal">
      <mt-header title="行程详情 (重复)">
        <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
        <mt-button slot="right" v-on:click="openMenu"><img src="../assets/images/meun@2x.png" /></mt-button>
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
                        <span>{{Number(car1RouteRepeat.expectlPredis)/1000}}km</span>
                    </div>
                </div>
            </a>
            <mt-cell title="用车事由" v-if="car1RouteRepeat.carPurposeId == '1'" value="上下班"></mt-cell>
            <mt-cell title="用车事由" v-if="car1RouteRepeat.carPurposeId == '2'" value="探亲"></mt-cell>
            <mt-cell title="用车事由" v-if="car1RouteRepeat.carPurposeId == '3'" value="接送客户"></mt-cell>
            <mt-cell title="用车事由" v-if="car1RouteRepeat.carPurposeId == '4'" value="就医"></mt-cell>
            <mt-cell title="用车事由" v-if="car1RouteRepeat.carPurposeId == '5'" value="出差办事"></mt-cell>
            <mt-cell title="用车事由" v-if="car1RouteRepeat.carPurposeId == '6'" value="个人消费"></mt-cell>
            <mt-cell title="用车事由" v-if="car1RouteRepeat.carPurposeId == '7'" value="其它"></mt-cell>
            <mt-cell title="车辆" v-bind:value="car1RouteRepeat.carType=='1' ? car1RouteRepeat.remark+'(公车)' : car1RouteRepeat.carType=='0' ? car1RouteRepeat.remark+'(租赁车辆)' : car1RouteRepeat.remark+'(私车)'"></mt-cell>
          </div>
          <div class="margin-top">
            <mt-cell title="出发时间">从{{car1RouteRepeat.repeatStartDate | datetime('MM月dd日',car1RouteRepeat.repeatStartDate)}}至{{car1RouteRepeat.repeatEndDate | datetime('MM月dd日',car1RouteRepeat.repeatEndDate)}}</mt-cell>
            <mt-cell title="出发时间">{{car1RouteRepeat.repeatStartTime | datetime('hh:mm',car1RouteRepeat.repeatStartTime)}}</mt-cell>
            <mt-cell title="到达时间">{{car1RouteRepeat.repeatEndTime | datetime('hh:mm',car1RouteRepeat.repeatEndTime)}}</mt-cell>
          </div>
          <div class="margin-top">
              <div class="cellBox">
                  <p class="cell-title">行程说明</p>
                  <p class="cell-content">{{car1RouteRepeat.repeatExperssion}}</p>
              </div>
          </div>
            <div class="linkList" v-if="car1RouteRepeat.flowId" v-on:click="jumpApproval">
                <mt-cell title="审批状态" is-link>
                    <span v-if="car1RouteRepeat.status == '0'">审批中</span>
                    <span v-if="car1RouteRepeat.status == '1' || car1RouteRepeat.status == '2' || car1RouteRepeat.status == '3' || car1RouteRepeat.status == '6'">审批通过</span>
                    <span v-if="car1RouteRepeat.status == '4'">已撤销</span>
                    <span v-if="car1RouteRepeat.status == '5'">审批不通过</span>
                    <span v-if="car1RouteRepeat.status == '7'">已过期未审批</span>
                    <span v-if="car1RouteRepeat.status == '8'">审批已过期</span>
                    <span v-if="car1RouteRepeat.status == '9'">审批已取消</span>
                </mt-cell>
            </div> 
            <div class="process-list list-block media-list" v-if="!car1RouteRepeat.flowId">
            <ul v-if="car1RouteRepeat.status != '4'">
                <li class="item-content" v-for="(flowItem,index) in flowDetailList">
                <div class="item-media">
                    <span style="background-image: url(./static/img/default_avatar.png)"></span>
                </div>
                <div class="item-inner">
                    <div class="item-title-row">
                    <div class="item-title">
                        <span v-if="userId == flowItem.userInfoId">我</span>
                        <span v-else-if="userList[index].id == flowItem.userInfoId && userId != flowItem.userInfoId">{{userList[index].name}}</span>
                        <span v-if="flowItem.myorder == '-1'">发起</span>
                        <span class="gray" v-if="flowItem.status == '0' && flowItem.node == '1'">等待审批中</span>
                        <span class="green" v-if="flowItem.status == '1' && flowItem.myorder != '-1'">通过</span>
                        <span class="red" v-if="flowItem.status == '2'">已拒绝</span>
                        </div>
                    <div class="item-after" v-if="flowItem.myorder != '-1'">{{flowItem.node == '0' ? flowItem.endTime : flowItem.startTime}}</div>
                    <div class="item-after" v-if="flowItem.myorder == '-1'">{{car1RouteRepeat.createTime}}</div>
                    </div>
                    <div class="item-text" v-if="index != 0">{{flowItem.remark}}</div>
                </div>
                </li>
            </ul>
            <ul v-if="car1RouteRepeat.status == '4'">
                <li class="item-content">
                <div class="item-media">
                    <span style="background-image: url(./static/img/default_avatar.png)"></span>
                </div>
                <div class="item-inner">
                    <div class="item-title-row">
                    <div class="item-title">我
                        <span>发起</span>
                    </div>
                    <div class="item-after">{{car1RouteRepeat.createTime}}</div>
                    </div>
                </div>
                </li>
                <li class="item-content">
                <div class="item-media">
                    <span style="background-image: url(./static/img/default_avatar.png)"></span>
                </div>
                <div class="item-inner">
                    <div class="item-title-row">
                    <div class="item-title">我
                        <span class="red">撤销</span>
                    </div>
                    <div class="item-after">{{car1RouteRepeat.updateTime}}</div>
                    </div>
                </div>
                </li>
            </ul>
            </div>
            <!-- <div class="approveorganization">
                <p class="oTitle">同行人</p>
                <div class="organizationlistbox">
                    <div class="organizationlist">
                        <p><img src="..\assets\images\yongche@3x.png" alt=""></p>
                        <p>唐同学</p>
                    </div>
                    <div class="organizationlist">
                        <p><img src="..\assets\images\yongche@3x.png" alt=""></p>
                        <p>唐同学</p>
                    </div>
                    <div class="organizationlist">
                        <p><img src="..\assets\images\yongche@3x.png" alt=""></p>
                        <p>唐同学</p>
                    </div>
                    <div class="organizationlist">
                        <p><img src="..\assets\images\yongche@3x.png" alt=""></p>
                        <p>唐同学</p>
                    </div>
                    <div class="organizationlist">
                        <p><img src="..\assets\images\yongche@3x.png" alt=""></p>
                        <p>唐同学</p>
                    </div>
                    <div class="organizationlist">
                        <p><img src="..\assets\images\yongche@3x.png" alt=""></p>
                        <p>唐同学</p>
                    </div>
                </div>
            </div> -->
      </div>
    </div>
    <mt-popup v-model="menuVisible" popup-transition="popup-fade" class="menu-popup" :style="{ top: buttonBottom }">
      <ul>
        <li v-on:click="deleteRepeat">
          <a>
            <i class="icon-trash-o"></i>删除行程</a>
        </li>
      </ul>
    </mt-popup>
  </div>
</template>
<script>
export default {
  name: 'repeatTravelDetal',
  data() {
    return {
        menuVisible: false,
        buttonBottom: 0,
        traveldata:'',
        endAddress:'',
        startAddress:'',
        userId:window.userInfo.userId,
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
        car1RouteRepeat(){
            if(!this.traveldata){
                return ''
            }else{
                return this.traveldata.car1RouteRepeat
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
    openMenu() {
      this.menuVisible = true
    },
    repeatTravelDetal(){
      this.$utils.ajax({
        url:'route/app/v2/dailydetail',
        data:{employeeId:window.userInfo.empId,
              id: this.$route.params.repeatrouteId,
              },
        success:(res)=>{
            if (res.httpCode === '200') {
                this.traveldata = res.data
                this.startAddress = this.traveldata.car1RouteRepeat.expectStartAddress
                this.endAddress = this.traveldata.car1RouteRepeat.expectEndAddress
                // this.startTime = this.traveldata.car1RouteRepeat.startTime
                // this.endTime = this.traveldata.car1RouteRepeat.endTime
            } else {
              this.$toast('出错了')
            }
        },error: (err) => {
          this.$toast('出错了')
        },
      })
    },
    deleteRepeat(){
        this.$messagebox.confirm('确定要删除行程吗?').then(action => {
            this.$utils.ajax({
                url:'route/app/v2/deleterepeatroute',
                data:{employeeId:window.userInfo.empId,
                    repeatId: this.$route.params.repeatrouteId,
                    },
                success:(res)=>{
                    if (res.httpCode === '200') {
                        this.$toast('删除重复行程成功')
                    } else {
                    this.$toast(res.msg)
                    }
                },error: (err) => {
                this.$toast('出错了')
                },
            })
        })
    },
    jumpApproval(){
        this.$app.goToUrl({
            h5Code:'com.bonade.h5.approve',
            route:'index.html#/main/myApproveIndex?processId='+this.car1RouteRepeat.flowId
        })
    }
  },  
  mounted(){
    this.repeatTravelDetal()
  }
}

</script>
<style lang="less">
.repeatTravelDetal{
.process-list{
    margin-top: 10px;
}
.menu-popup{
  margin-top: 44px;
}
.v-modal{
  background-color:initial;
  opacity: initial;
}   
.is-right{
    img{
        width: 24px;
        height: 24px;
        margin-top: 5px;
    }
}
.margin-top{
    margin-top: 10px;
}
.subtitle{
    font-size: 12px;
    color: #ACACAC;
    margin-left: 10px;
}
.cellBox{
    background-color: #fff;
    padding: 10px;
    .cell-title{
        font-size: 16px;
        margin-bottom: 10px;
    }
    .cell-content{
        font-size: 14px;
        color: #ACACAC;
    }
}
.approveorganization{
    border-top: 1px solid @bgColor;
    padding: 10px;
    background-color: #fff;
    .oTitle{
        font-size: 16px;
    }
    .organizationlistbox{
        padding-top: 15px;
    }
    .organizationlist{
        display: inline-block;
        width: 50px;
        text-align: center;
        margin-right: 10px;
        margin-bottom: 15px;
        p{
            &:first-child{
                width: 44px;
                height: 44px;
                img{
                    max-width: 100%;
                }
                margin: 0 auto;
            }
            &:last-child{
                margin-top: 5px;
                font-size: 12px;
            }
        }
    }
}
}
</style>
