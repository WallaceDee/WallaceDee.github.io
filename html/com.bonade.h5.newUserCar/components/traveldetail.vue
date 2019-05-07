<template>
  <div>
    <div class="page-travel">
        <mt-header title="行程明细">
            <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
        </mt-header>
        <div class="content">
            <div class="details-list" v-if="car1Route.status == '0' || car1Route.status == '5' || car1Route.status == '7' || car1Route.status == '4' || car1Route.status == '1' || car1Route.status == '2' || car1Route.status == '8' || car1Route.status == '9'">
                <mt-cell title="起点" v-bind:value="StartAddress"></mt-cell>
                <mt-cell title="终点" v-bind:value="EndAddress"></mt-cell>
                <mt-cell title="出发时间" v-bind:value="car1Route.expectStartTime"></mt-cell>
                <mt-cell title="到达时间" v-bind:value="car1Route.expectEndTime"></mt-cell>
                <mt-cell title="车辆" v-bind:value="car1Route.carType=='1' ? car1RouteDetail.carPlate+'(公车)' : car1Route.carType=='0' ? car1RouteDetail.carPlate+'(租赁车辆)' : car1RouteDetail.carPlate+'(私车)'"></mt-cell>
                <mt-cell title="预计里程" v-bind:value="(car1RouteDetail.expectlPredis/1000)+'km'"></mt-cell>
                <!-- <mt-cell title="实际里程" value="0.5km"></mt-cell> -->
                <!-- <div v-if="car1Route.status == '2'">
                    <mt-cell title="轨迹">
                        <a v-on:click="checkTravel('1')">查看轨迹</a>
                    </mt-cell>
                </div> -->
            </div>
            <div class="details-list" v-if="car1Route.status == '3' || car1Route.status == '6' || car1Route.status == '10'">
                <mt-cell title="起点" v-bind:value="StartAddress"></mt-cell>
                <mt-cell title="终点" v-bind:value="EndAddress"></mt-cell>
                <mt-cell title="出发时间" v-bind:value="car1Route.startTime"></mt-cell>
                <mt-cell title="到达时间" v-bind:value="car1Route.endTime"></mt-cell>
                <mt-cell title="车辆" v-bind:value="car1Route.carType=='1' ? car1RouteDetail.carPlate+'(公车)' : car1Route.carType=='0' ? car1RouteDetail.carPlate+'(租赁车辆)' : car1RouteDetail.carPlate+'(私车)'"></mt-cell>
                <mt-cell title="预计里程" v-bind:value="(car1RouteDetail.expectlPredis/1000)+'km'"></mt-cell>
                <mt-cell title="实际里程" v-bind:value="(car1RouteDetail.runRoad/1000)+'km'"></mt-cell>
                <mt-cell title="轨迹">
                    <a v-on:click="checkTravel">查看轨迹</a>
                </mt-cell>
            </div>
         <!-- <div class="stroke border-top">
          <mt-cell title="轨迹1" value="实际里程:5km"></mt-cell>
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
        </div> -->
        <!-- <p class="detailtitle">审批信息</p> -->
        <div class="approvelist">
            <div class="approveradio">
                <p>用车事由</p>
                <p v-if="car1Route.carPurposeId == '1'">上下班</p>
                <p v-if="car1Route.carPurposeId == '2'">探亲</p>
                <p v-if="car1Route.carPurposeId == '3'">接收客户</p>
                <p v-if="car1Route.carPurposeId == '4'">就医</p>
                <p v-if="car1Route.carPurposeId == '5'">出差办事</p>
                <p v-if="car1Route.carPurposeId == '6'">个人消费</p>
                <p v-if="car1Route.carPurposeId == '7'">其他</p>
            </div>
              <div class="approvetextarea">
                <p>备注</p>
                <p>{{car1Route.remark}}</p>
            </div>
            <div class="process-list list-block media-list" v-if="!car1Route.flowId">
            <ul v-if="car1Route.status != '4'">
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
                    <div class="item-after" v-if="flowItem.myorder == '-1'">{{car1Route.createTime}}</div>
                    </div>
                    <div class="item-text" v-if="index != 0">{{flowItem.remark}}</div>
                </div>
                </li>
            </ul>
            <ul v-if="car1Route.status == '4'">
                <li class="item-content">
                <div class="item-media">
                    <span style="background-image: url(./static/img/default_avatar.png)"></span>
                </div>
                <div class="item-inner">
                    <div class="item-title-row">
                    <div class="item-title">我
                        <span>发起</span>
                    </div>
                    <div class="item-after">{{car1Route.createTime}}</div>
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
                    <div class="item-after">{{car1Route.updateTime}}</div>
                    </div>
                </div>
                </li>
            </ul>
            </div>
            <div class="linkList" v-if="car1Route.flowId">
                <mt-cell title="审批状态" is-link>
                    <span v-if="car1Route.status == '0'">审批中</span>
                    <span v-if="car1Route.status == '1' || car1Route.status == '2' || car1Route.status == '3' || car1Route.status == '6'">审批通过</span>
                    <span v-if="car1Route.status == '4'">已撤销</span>
                    <span v-if="car1Route.status == '5'">审批不通过</span>
                    <span v-if="car1Route.status == '7'">已过期未审批</span>
                    <span v-if="car1Route.status == '8'">审批已过期</span>
                    <span v-if="car1Route.status == '9'">审批已取消</span>
                </mt-cell>
            </div> 
            <div class="component-wrapper" v-if="car1Route.status == '3'">
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
                    <span class="bnd-icon-plus"></span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="component-wrapper" v-if="car1Route.status == '3'">
              <div class="block-title">上传单据</div>
              <image-uploader v-on:upload="upload" v-bind:option="uploadOption" v-bind:max="2"></image-uploader>
            </div>
              <div class="approvetextarea" v-if="car1Route.status == '3'">
                <p style="margin-top:5px;">票据说明</p>
                <p><textarea class="text-frame" v-model="billExplain" placeholder="选填" maxlength="200"></textarea></p>
            </div>
        </div> 
        <div class="btn" v-if="car1Route.status == '3'">
            <mt-button size="large" v-on:click="submit">提交</mt-button>
        </div>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'travelDetail',
  data() {
    return {
        routeId:'',
        traveldata:'',
        startAddress:'',
        endAddress:'',
        carPurpose:'',
        userId:window.userInfo.userId,
        employees: [],
        passengerList:[],
        billExplain:'',
        uploadList: [],
        uploadOption: {
            uploadFileName: 'default',
            tableName: 'Car1Route',
            tableCloumn: '单据图片'
        },
        pointObj:{
            lat:'',
            lng:''
        }
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
  methods: {
    upload(urlArray) {
      this.uploadList = urlArray
      console.log(urlArray)
    },
    selectEmployees() {
      this.$employeePicker({
        title: '选择同行人',
        values: this.employees,
        multiple: true,
        callback: (res) => {
          this.employees = res
          for(var i=0;i<this.employees.length;i++){
                this.passengerList.push({'empId':this.employees[i].id,'empName':this.employees[i].name})
          }
          
          console.log(this.passengerList)
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
              routeId: this.routeId,
              },
        success:(res)=>{
            if (res.httpCode === '200') {
                this.traveldata = res.data
                this.startAddress = this.traveldata.car1Route.expectStartAddress
                this.endAddress = this.traveldata.car1Route.expectEndAddress
                this.carPurpose = this.car1Route.carPurposeId
                if(this.car1Route.startAddress){
                    this.pointObj.lng = this.car1Route.startAddress.split(',')[0];
                    this.pointObj.lat = this.car1Route.startAddress.split(',')[1];
                }else{
                    this.pointObj.lng = this.car1Route.startLocal.split(',')[0];
                    this.pointObj.lat = this.car1Route.startLocal.split(',')[1];
                }
                sessionStorage.setItem('approveDetailStartObj',JSON.stringify(this.pointObj));
                if(this.car1Route.endAddress){
                    this.pointObj.lng = this.car1Route.endAddress.split(',')[0];
                    this.pointObj.lat = this.car1Route.endAddress.split(',')[1];
                }else{
                    this.pointObj.lng = this.car1Route.endLocal.split(',')[0];
                    this.pointObj.lat = this.car1Route.endLocal.split(',')[1];
                }
                sessionStorage.setItem('approveDetailEndObj',JSON.stringify(this.pointObj));
            } else {
              this.$toast('出错了')
            }
        },error: (err) => {
          this.$toast('出错了')
        },
      })
    },
    checkTravel(){
        // if(num == '1'){
        //     this.$app.checkGPS((respose)=>{
        //         if(respose.status == '1'){
        //         this.$app.getLocation((respose)=>{
        //             if(respose.status == '0'){
        //                 this.$toast(respose.msg)
        //             }else{
        //                 sessionStorage.setItem('approveDetailWayObj',JSON.stringify({lat:respose.data.lat,lng:respose.data.lng}));
        //                 this.$router.push({name:'travelTrack',params:{type:'approveDetailPoint',num:num}})
        //             }
        //         })
        //         }else{
        //         this.$toast('无法定位')
        //         }
        // })  
        // }else{
            this.$router.push({name:'travelTrack',params:{type:'approveDetailPoint'}})
        // }
        
    },
    submit(){
        let fromData = [{
                title: '同行人',
                value: this.passengerList,
                require: true,
                select: true
            },{
                title: '单据',
                value: this.uploadList,
                require: true,
                select: true
            }
        ]
        console.log(fromData)
        let flag = this.$utils.validate(fromData)
        if(flag){
            this.$utils.ajax({
                url: 'route/car2routecommit/app/v3/commitauditroute',
                data: {
                    employeeId:window.userInfo.empId,
                    routeId:this.routeId,
                    isSubmitExpect:1,
                    passengerList:this.passengerList,
                    picList:this.uploadList,
                    billExplain:this.billExplain
                },
                success: (res) => {
                    if (res.statusCode === '200') {
                        this.requestData()
                        this.$toast('提交成功')
                    }
                }
            })
        }
    }
  },
  mounted(){
      this.routeId = this.$route.params.routeId
      this.requestData()
  }
}
</script>
<style lang="less">
.process-list{
    margin-top: 10px;
}
.text-frame {
    width: 100%;
    resize: none;
    font-size: 14px;
    height: 80px;
    padding-left: 10px;
    font-family: PingFangSC-Regular, sans-serif, "Microsoft YaHei";
    border: none;
    outline: none;
}
.details-list{
    margin-top: 10px;
}
.margin-top{
    margin-top: 10px;
}
.linkList {
  margin-top: 10px;
  .mint-cell-text {
    font-size: 14px;
    color: #acacac;
  }
  .mint-cell-wrapper {
    .mint-cell-value {
      span {
        color: #303030;
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
.btn {
  padding: 20px 10px;
  .mint-button-text {
    font-size: 14px;
  }
}
.approveradio,.approvetextarea{
    display: flex;
    min-height: 48px;
    padding: 0 10px;
    margin-top: 10px;
    background-color: #fff;
    p{
        flex: 1;
    }
}
.approveradio{
    p{
        line-height: 48px;
        font-size: 14px;
        &:last-child{
            color: #acacac;
            text-align: right;
        }
    }
}
.approvetextarea{
    border-top: 1px solid #EFF1F0;
    padding: 15px 10px;
    p{
        font-size: 14px;
        &:first-child{
            max-width: 60px;
        }
        &:last-child{
            color: #acacac;
        }
    }
}
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

.detailtitle{
  padding: 10px;
  font-size: 14px;
}
.mint-popup{
  width: 100%;
}
.approveorganization{
    .oTitle{
        font-size: 14px;
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
.approveorganization,.approveimage{
    border-top: 1px solid #EFF1F0;
    padding: 10px;
}
.approveimage{
    .iTitle{
        font-size: 14px; 
    }
    .imagelistbox{
        margin-top: 10px;
    }
    .imagelist{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        margin-right: 10px;
        img{
            max-width: 100%;
            max-height: 100%;
        }
    }
}

</style>
