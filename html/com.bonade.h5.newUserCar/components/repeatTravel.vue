<template>
  <div>
    <div class="repeatTravel">
      <mt-header title="重复行程">
        <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
      </mt-header>
      <div class="content">
          <mt-loadmore :top-method="refresh" @translate-change="translateChange" @top-status-change="handleTopChange" :bottom-method="loadMore" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="false">
        <!-- {{list}} -->
                  
        <div class="cell-swipe-list" v-for="item in list" :key="item.id">
            <mt-cell-swipe
            :right="[
                {
                content: '<P class=\'delstyle\'><span>删除</span></p>',
                style: { background: 'red', color: '#fff' },
                handler: () => deleterepeat(item.id)
                }
            ]">
                <router-link 
                    :to="{
                        name:'repeatTravelDetal',
                        params: { 
                            repeatrouteId: item.id, 
                        }
                    }">
                <div class="repeatItem">
                    <div class="left">
                        <p class="cateType" v-if="item.remark == '上下班'"><img src="../assets/images/work.png">&nbsp;&nbsp;上下班</p>
                        <p class="cateType" v-if="item.remark == '探亲'"><img src="../assets/images/visitFamily.png">&nbsp;&nbsp;探亲</p>
                        <p class="cateType" v-if="item.remark == '个人消费'"><img src="../assets/images/personalconsumption.png">&nbsp;&nbsp;个人消费</p>
                        <p class="cateType" v-if="item.remark == '出差办事'"><img src="../assets/images/Business.png">&nbsp;&nbsp;出差办事</p>
                        <p class="cateType" v-if="item.remark == '就医'"><img src="../assets/images/medicalTreatment.png">&nbsp;&nbsp;就医</p>
                        <p class="cateType" v-if="item.remark == '接送客户'"><img src="../assets/images/deliverCustomers.png">&nbsp;&nbsp;接送客户</p>
                        <p class="cateType" v-if="item.remark == '其它'"><img src="../assets/images/other.png">&nbsp;&nbsp;其它</p>
                        <div class="repeatTime">
                            <!-- 从7月30日 至 9月11日 每天11:30 至 12:30 -->
                        从{{item.repeatStartDate | datetime('MM月dd日',item.repeatStartDate)}}至{{item.repeatEndDate | datetime('MM月dd日',item.repeatEndDate)}} 每天{{item.repeatStartTime | datetime('hh:mm',item.repeatStartTime)}}至{{item.repeatEndTime | datetime('hh:mm',item.repeatEndTime)}}    
                            </div>
                        <div class="repeataddress">{{item.expectStartAddress | sitetitle(item.expectStartAddress)}}&nbsp;&nbsp;<i class="toForm"></i>&nbsp;&nbsp;{{item.expectEndAddress | sitetitle(item.expectEndAddress)}}</div>
                    </div>
                    <div class="right">
                    <p class="repeatStatus">
                        <span class="orange" v-if="item.repeatStatus == '0'">审批中</span>
                        <span class="gary" v-if="item.repeatStatus == '1'">已过期未审批</span>
                        <span class="orange" v-if="item.repeatStatus == '2'">已通过</span>
                        <span class="red" v-if="item.repeatStatus == '3'">已拒绝</span>
                        <span class="red" v-if="item.repeatStatus == '4'">已撤销</span>
                        <span class="gary" v-if="item.repeatStatus == '5'">已取消</span>
                        <span class="gary" v-if="item.repeatStatus == '6'">已完成</span>
                        <i class="rightArrow"></i></p>
                    </div>              
                </div>
                </router-link>
            </mt-cell-swipe>
        </div>

        </mt-loadmore>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'repeatTravel',
  data() {
    return {
        list: [],
        allLoaded: false,
        row: 20,
        pageNum: 1,
        bottomStatus: '',
        topStatus: '',
        translate: 0,
        moveTranslate: 0,
    } 
  },
  methods:{
    loadMore(isRefresh) {
      this.$utils.ajax({
        url:'route/app/v2/getemprepeatlist',
        data:{employeeId:window.userInfo.empId,
              row: this.row,
              pageNum: this.pageNum,
              },
        success:(res)=>{
            if (res.httpCode === '200') {
              if (isRefresh) {
                this.list = res.data
                this.$refs.loadmore.onTopLoaded()
              } else {
                this.list = this.list.concat(res.data)
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
    deleterepeat(id){
        this.$messagebox.confirm('确定要删除行程吗?').then(action => {
            this.$utils.ajax({
                url:'route/app/v2/deleterepeatroute',
                data:{employeeId:window.userInfo.empId,
                    repeatId: id,
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
    }
  },
  mounted(){
    this.loadMore()
  }
}

</script>
<style lang="less">
.cell-swipe-list{
    margin-top: 10px;
}
.delstyle{
    display: table;
    height: 100%;
    span{
        display: table-cell;
        vertical-align: middle;
    }
}
.repeatItem{
    position: relative;
    height: 94px;
    width: 100%;
    display: flex;
    padding: 10px;
}
.left{
    display: flex;
    flex-wrap: wrap;
    align-content: stretch;
    padding: 5px 0;
}
.right{
    -webkit-flex: 0 0 16.6667%;
    -moz-flex: 0 0 16.6667%;
    -ms-flex: 0 0 16.6667%;
    flex: 0 0 16.6667%;
    max-width: 16.6667%;
    align-self: center;
}
.mint-cell-value{
    width: 100%;
}
.repeatStatus{
    font-size: 14px;
    .orange{
        color: @supportColor;
    }
    .gary{
        color: @gary;
    }
    .red{
        color: @red;
    }
}
.rightArrow{
    display: inline-block;
    width: 8px;
    height: 8px;
    border-top: 2px solid #D8D8D8;
    border-right: 2px solid #D8D8D8;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
}
.repeatTravel{
    .mint-cell-title{
        flex: none;
    }
}
.cateType{
    color: #666;
    font-size: 14px;
    img{
        width: 16px;
        height: 16px;
        vertical-align: bottom;
    }
}
.cateType,.repeatTime,.repeataddress{
    -webkit-flex: 0 0 100%;
    -moz-flex: 0 0 100%;
    -ms-flex: 0 0 100%;
    flex: 0 0 100%;
    max-width: 100%;
    align-self: center;
}
.repeatTime{
    color: #7C7C7C;
    font-size: 14px;
}
.repeataddress{
    color: #303030;
    font-size: 14px;
    .toForm{
        display: inline-block;
        height: 1px;
        width: 30px;
        background:rgba(216,216,216,1);
        border-radius:0px 100px 100px 0px;
        position: relative;
        vertical-align: middle;
        &:before{
            content: '';
            position: absolute;
            -webkit-transform: rotate(45deg);
            transform: rotate(45deg);
            width: 4px;
            height: 1px;
            background:rgba(216,216,216,1);
            border-radius:100px 100px 25px 66px;
            right: 0;
            top: -1.5px;
        }
        &:after{
            content: '';
            position: absolute;
            width:3px;
            height:3px;
            background:rgba(216,216,216,1);
            border-radius:3px;
            left: 0px;
            top: 50%;
            margin-top: -1.5px;
        }
    }
}
</style>
