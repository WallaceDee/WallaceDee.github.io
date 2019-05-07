<template>
  <div>
    <div class="page-select-car">
      <mt-header title="选择车辆">
        <mt-button icon="back" slot="left" v-on:click="goUseCar"></mt-button>
      </mt-header>
      <div class="content">
        <div data-v-3d9b7110="" class="tab-wrap">
          <div data-v-3d9b7110="" class="mint-radiolist">
            <label class="mint-radiolist-title" v-if="comCarArr.length>0">公车</label>
            <a class="mint-cell" v-for="item in comCarArr" v-bind:key="item.id" v-if="comCarArr.length>0">
              <div class="mint-cell-left"></div>
              <div class="mint-cell-wrapper">
                <div class="mint-cell-title">
                  <label class="mint-radiolist-label">
                    <span class="mint-radio is-right">
                      <input type="radio" class="mint-radio-input"  name="carnum" value="" v-on:click="selectCar(item)"> 
                      <span class="mint-radio-core"></span>
                    </span>
                    <span class="mint-radio-label">{{item.car_number}}</span>
                  </label>
                </div> 
                <div class="mint-cell-value"><span></span></div> 
              </div> 
              <div class="mint-cell-right"></div>
            </a>
            <!-- 公车为空 -->
            <label class="mint-radiolist-title" v-if="comCarArr.length<1">公车</label>
            <a class="mint-cell" v-if="comCarArr.length<1">
              <div class="mint-cell-left"></div>
              <div class="mint-cell-wrapper">
                <div class="mint-cell-title">
                  <label class="mint-radiolist-label">
                    <span class="mint-radio is-right">
                      <input type="radio" class="mint-radio-input"  name="carnum" value=""> 
                      <!-- <span class="mint-radio-core"></span> -->
                    </span>
                    <span class="mint-radio-label">暂无</span>
                  </label>
                </div> 
                <div class="mint-cell-value"><span></span></div> 
              </div> 
              <div class="mint-cell-right"></div>
            </a>
            <label class="mint-radiolist-title" v-if="rentCarArr.length>0">租赁车辆</label>
            <a class="mint-cell" v-for="item in rentCarArr" v-bind:key="item.id" v-if="rentCarArr.length>0">
              <div class="mint-cell-left"></div>
              <div class="mint-cell-wrapper">
                <div class="mint-cell-title">
                  <label class="mint-radiolist-label">
                    <span class="mint-radio is-right">
                      <input type="radio" class="mint-radio-input" name="carnum" value="" v-on:click="selectCar(item)"> 
                      <span class="mint-radio-core"></span>
                    </span>
                    <span class="mint-radio-label">{{item.car_number}}</span>
                  </label>
                </div> 
                <div class="mint-cell-value"><span></span></div> 
              </div> 
              <div class="mint-cell-right"></div>
            </a>
             <!-- 租赁车辆为空时 -->
            <label class="mint-radiolist-title" v-if="rentCarArr.length<1">租赁车辆</label>
            <a class="mint-cell" v-if="rentCarArr.length<1">
              <div class="mint-cell-left"></div>
              <div class="mint-cell-wrapper">
                <div class="mint-cell-title">
                  <label class="mint-radiolist-label">
                    <span class="mint-radio is-right">
                      <input type="radio" class="mint-radio-input" name="carnum" value=""> 
                      <!-- <span class="mint-radio-core"></span> -->
                    </span>
                    <span class="mint-radio-label">暂无</span>
                  </label>
                </div> 
                <div class="mint-cell-value"><span></span></div> 
              </div> 
              <div class="mint-cell-right"></div>
            </a>
            <label class="mint-radiolist-title bar-title" v-if="empCarArr.length>0">
              <div>私车</div>
              <!-- <div><router-link
              :to="{
                  name:'carManage',
                  params:{ 
                    type:''
                  }
              }" > 
              私车管理
              </router-link></div> -->
              <div v-on:click="goCarManage">私车管理</div>
            </label>
            <a class="mint-cell" v-for="item in empCarArr" v-bind:key="item.id" v-if="empCarArr.length>0">
              <div class="mint-cell-left"></div>
              <div class="mint-cell-wrapper">
                <div class="mint-cell-title">
                  <label class="mint-radiolist-label">
                    <span class="mint-radio is-right">
                      <input type="radio" class="mint-radio-input" name="carnum" value="" v-on:click="selectCar(item)"> 
                      <span class="mint-radio-core"></span>
                    </span>
                    <span class="mint-radio-label">{{item.car_number}}</span>
                  </label>
                </div> 
                <div class="mint-cell-value"><span></span></div> 
              </div> 
              <div class="mint-cell-right"></div>
            </a>
            <!-- 私车为空时 -->
            <label class="mint-radiolist-title bar-title" v-if="empCarArr.length<1">
              <div>私车</div>
              <!-- <div>
                <router-link
                 :to="{
                    name:'carManage',
                    params:{ 
                      type:pageParms
                    }
                }" > 
                私车管理
                </router-link>
              </div> -->
              <div>私车管理</div>
            </label>
            <a class="mint-cell" v-if="empCarArr.length<1">
              <div class="mint-cell-left"></div>
              <div class="mint-cell-wrapper">
                <div class="mint-cell-title">
                  <label class="mint-radiolist-label">
                    <span class="mint-radio is-right">
                      <input type="radio" class="mint-radio-input" name="carnum" value=""> 
                      <!-- <span class="mint-radio-core"></span> -->
                    </span>
                    <span class="mint-radio-label">暂无</span>
                  </label>
                </div> 
                <div class="mint-cell-value"><span></span></div> 
              </div> 
              <div class="mint-cell-right"></div>
            </a>
          </div>
        </div>
        <div class="usecar-btn">
          <mt-button size="large" v-on:click.native="slectCarAffirm">确定</mt-button>    
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'selectCar',
  data() {
    return {
      rentCarArr:[], //租赁车辆
      comCarArr:[], //公车
      empCarArr:[], //私车
      carData:{},
      pageParms:'' 
    }
  },
  created(){
    console.log(this.$route.params.type,'进入')
    this.pageParms = this.$route.params.type
  },
  computed:{

  },
  watch: {
    selected(val, oldVal) {
      const currElement = document.querySelector('.active')
      currElement.className = ''
      let clickElement = document.querySelector('.slide-nav').querySelector('#' + val)
      clickElement.className = 'active'
    }
  },
  methods: {
    carInfo(){
      this.$utils.ajax({
        url:'/route/car2info/app/v3/getempallcar',
        data:{'employeeId':window.userInfo.empId},
        success:(res)=>{
          if (res.httpCode === '200') {
            // console.log(res,'数据')
            this.rentCarArr = res.data.rentCarList //租赁车辆
            this.comCarArr = res.data.comCarList  //公车
            this.empCarArr = res.data.empCarList  //私车
          } else {
            this.$toast(res.msg)
          }
        },error: (err) => {
          this.$toast(err.msg)
        },
      })
    },
    selectCar(data){
      console.log(data,'当前选中的车')
      this.carData = data
    },
    slectCarAffirm(){
      console.log(sessionStorage.getItem('carNumberType'),'车牌类型999')
      console.log(this.carData,'当前选中的车辆信息')
      // return false
      if(!this.carData.id){
        this.$toast('请选择车辆')
      }else{     
        if(this.$route.params.type=='travelCar'){
          this.carData.type = 'travelCar'
          this.carData.tabId = 1
          this.$router.push({name:'useCar',params:this.carData})
        }else if(this.$route.params.type=='approveTravelCar'){
          this.carData.type = 'approveTravelCar'
          this.carData.tabId = 2
          this.$router.push({name:'useCar',params:this.carData})
        }else if(sessionStorage.getItem('carNumberType')==1){
          this.carData.type = 'travelCar'
          this.carData.tabId = 1
          sessionStorage.setItem('carNumberType','')
          this.$router.push({name:'useCar',params:this.carData})
        }else if(sessionStorage.getItem('carNumberType')==2){
          this.carData.type = 'approveTravelCar'
          this.carData.tabId = 2
          sessionStorage.setItem('carNumberType','')
          this.$router.push({name:'useCar',params:this.carData})
        }
      }
    },
    goCarManage(){
      if(this.$route.params.type=='travelCar'){
        sessionStorage.setItem('carNumberType','1')
        this.$router.push({name:'carManage'})
      }else if(this.$route.params.type=='approveTravelCar'){
        sessionStorage.setItem('carNumberType','2')
        this.$router.push({name:'carManage'})
      }
    },
    goUseCar(){
      sessionStorage.setItem('carNumberType','')
      this.$router.push({name:'useCar'})
    }
  },
  mounted(){
    this.carInfo() //请求车辆详情
  }

}

</script>
<style lang="less" scoped>
  .tab-wrap{
    background-color: @bgColor;
    .car-manage{
      background-color:#EFF1F0;
      min-height: 22px;
    }
  }
  .usecar-btn {
    width: 90%;
    margin: 40px auto;
  }
  .bar-title{
    display: flex;
    a{
      color: #888;
    }
    div{
      width: 50%;
    }
    div:nth-child(2){
      text-align: right;
      position: relative;
      padding-right: 22px;
    }
    div:nth-child(2)::after{
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      border-top: 2px solid #D8D8D8;
      border-right: 2px solid #D8D8D8;
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
      position: absolute;
      top: 8px;
      right: 10px;
    }
  }
  .mint-radiolist-title{
    height: 24px;
    line-height: 24px;
    font-size: 14px;
  }
</style>
