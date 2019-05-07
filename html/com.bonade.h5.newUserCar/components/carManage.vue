<template>
  <div>
    <div class="page-car-manage">
      <mt-header title="私车管理">
        <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
      </mt-header>
      <div class="content">
        <div class="tab-wrap" v-if="empCarArr.length>0">
          <mt-cell title="私车"></mt-cell>
          <mt-cell-swipe
            :title= "item.car_number"
            :right="[
              {
                content: '删除',
                style: { background: 'red', color: '#fff', fontSize:'14px'},
                handler: () => deleteSection(item.id,index)
              }
            ]" v-for="(item, index) in empCarArr" v-bind:key="item.id">
            <mt-cell title="" v-on:click.native="openPopup(item,1)">
              <span class="tetx-edit">编辑</span>
            </mt-cell>
          </mt-cell-swipe>  
        </div>
        <!-- 当前无私车数据 -->
        <div class="tab-wrap" v-if="empCarArr.length<1">
          <mt-cell title="私车"></mt-cell>
          <mt-cell title="暂无私车"></mt-cell>
        </div>
        <div class="usecar-btn"  v-on:click="openPopup()">
          <mt-button size="large">添加车辆</mt-button>    
        </div>
      </div>
    </div>
    <mt-popup
      class="page-popup"
      v-model="popupVisible"
      position="right"
      >
      <mt-header :title="title">
        <mt-button icon="back" slot="left" v-on:click="closePopup"></mt-button>
      </mt-header>
      <mt-cell title="车辆号码"></mt-cell>
      <div class="car-num">
          <span v-on:click="openProvincePopup">{{capital}}</span>
          <span><input type="text" placeholder="请输入车牌号码" v-model="carInput" style="text-transform:uppercase;" ></span>
      </div>
      <div class="save-btn">
        <mt-button size="large" ref="button" v-on:click="editCar">保存</mt-button>    
      </div>
    </mt-popup>
    <mt-popup
      v-model="provincePopup"
      popup-transition="popup-fade"
      position="bottom"
      >
      <div class="bar bar-nav">
        <button class="button pull-left"></button>
         <h1 class="title">选择地区</h1>
        <button class="button pull-right"></button>
      </div>
      <ul class="content-wrap">
        <li v-for="item in capitalData" v-bind:key="item.name" v-on:click="carArea(item.name)">
          <p>{{item.name}}</p>
        </li>
      </ul>
    </mt-popup>
  </div>
</template>
<script>
export default {
  name: 'carManage',
  data() {
    return {
      selected: 'depart',
      defaultTime: new Date().format('yyyy-MM-dd'),
      popupVisible:false,
      provincePopup:false,
      capitalData:[
        {'name':'京'},
        {'name':'沪'},
        {'name':'浙'},
        {'name':'苏'},
        {'name':'粤'},
        {'name':'鲁'},
        {'name':'晋'},
        {'name':'冀'},
        {'name':'豫'},
        {'name':'川'},
        {'name':'渝'},
        {'name':'辽'},
        {'name':'吉'},
        {'name':'黑'},
        {'name':'皖'},
        {'name':'鄂'},
        {'name':'湘'},
        {'name':'赣'},
        {'name':'闽'},
        {'name':'陕'},
        {'name':'甘'},
        {'name':'宁'},
        {'name':'蒙'},
        {'name':'津'},
        {'name':'贵'},
        {'name':'云'},
        {'name':'桂'},
        {'name':'琼'},
        {'name':'清'},
        {'name':'新'},
        {'name':'藏'}
      ],
      empCarArr:[],
      title:'',
      capital:'粤',
      carInput:'',
      carData:{
        employeeId:window.userInfo.empId,
        employeeName:window.userInfo.username,
        carNumber:''
      },
      pageParms:'' 
    }
  },
  created(){
    console.log(this.$route.params.type,'进入车辆编辑')
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
    },
    carInput(val, oldVal) {
      // console.log(val,'当前状态')
      // console.log(oldVal,'改变前状态')
      this.carInput = this.carInput.toUpperCase()
      // console.log(this.carInput,'转换大写')
    }
  },
  methods: {
    switchTab(e) {
      if (e.target.tagName === 'LI') {
        this.selected = e.target.id
      }
    },
    openPicker() {
      this.$refs.picker.open()
    },
    // goBackPage(){
    //   this.$router.push({name:'selectCar',params:{'type':this.pageParms}})
    // },
    carInfo(){
      this.$utils.ajax({
        url:'/route/car2info/app/v3/getempallcar',
        data:{'employeeId':window.userInfo.empId},
        success:(res)=>{
          if (res.httpCode === '200') {
            // console.log(res,'数据')
            this.empCarArr = res.data.empCarList  //私车
          } else {
            this.$toast(res.msg)
          }
        },error: (err) => {
          this.$toast(err.msg)
        },
      })
    },
    doDel() {
      this.$messagebox({
        title: '提示',
        message: '确定要结束行程吗?',
        showCancelButton: true
      })
    },
    openPopup(item,type){
      if(type==1){
        this.title ='编辑车辆'
        let data =item.car_number
        this.capital = data.substring(0,1)
        this.carInput = data.substring(1)
        this.carData.id =item.id
        this.popupVisible=true
      }else{
        this.title ='添加车辆'
        this.capital = '粤'
        this.carInput = ''
        this.popupVisible=true
      }
    },
    closePopup(){
      this.popupVisible=false
    },
    openProvincePopup(){
      this.provincePopup =true
    },
    carArea(name){
      // console.log(name,'当前选中的地区')
      this.capital = name
      this.provincePopup =false
    },
    deleteSection(id,index){ 
      // console.log(id,'删除回调')
      this.$utils.ajax({
        url:'/route/car2info/app/v3/deleteempcar',
        data:{id:id},
        success:(res)=>{
          if (res.httpCode === '200') {
            this.$toast('删除成功')
            this.carInfo() //请求车辆详情
          } else {
            this.$toast(res.msg)
          }
        },error: (err) => {
          this.$toast(err.msg)
        },
      })
    },
    editCar(){
      let fromData=[
        {
          title: '车牌号码',
          rule:/^[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/,
          value: this.carInput,
          require: true
      }]
      let flag = this.$utils.validate(fromData) //表单校验
      if(flag){
        this.carData.carNumber = this.capital + this.carInput
        console.log(this.carData,'参数')
        this.$refs.button.disabled = true
        this.$utils.ajax({
        url:'/route/car2info/app/v3/saveempcarinfo',
        data:this.carData,
        success:(res)=>{
          if (res.httpCode === '200') {
            if(this.title=='编辑车辆'){
              this.$toast('车辆编辑成功')
              this.popupVisible=false
              this.carInfo() //请求车辆详情
            }else if(this.title=='添加车辆'){
              this.$toast('车辆添加成功')
              this.popupVisible=false
              this.carInfo() //请求车辆详情  
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
    }   
  },
  mounted(){
    this.carInfo() //请求车辆详情
  },
}

</script>
<style lang="less">
.page-car-manage{
  .usecar-btn {
    width: 90%;
    margin: 40px auto;
  }
  .mint-cell-value{
    color: #888;
    font-size: 14px;
  }
  .mint-popup.mint-popup-bottom{
    width: 100%;
  }
  .page-select-car{
    .mint-cell-value .tetx-edit{
      font-size: 14px;
    }
    .tab-wrap{
      background-color: @bgColor;
    }
  }
}
  .car-num{
    background-color: #fff;
    height: 48px;
    line-height: 48px;
    box-sizing: border-box;
    padding-left: 10px;
    span:nth-child(1){
      display: inline-block;
      width: 48px;
      height: 26px;
      line-height: 26px;
      border-radius: 4px;
      background-color: @supportColor;
      color: #fff;
      position: relative;
      padding-left: 8px;
    }
    input{
      width: 70%;
      height: 34px;
      line-height: 34px;
      border: none;
      text-indent: 10px;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 1px;
    }
    span:nth-child(1)::after{
      content: '';
      width: 6px;
      height: 6px;
      border-top: 2px solid #ffffff;
      border-right: 2px solid #ffffff;
      transform: rotate(135deg);
      position: absolute;
      top: 8px;
      right: 8px;
    } 
  }
  .mint-popup.mint-popup-bottom{
    width: 100%;
  }
  .save-btn{
    width: 90%;
    margin: 40px auto;
  }
  .content-wrap{
    display:flex;
    flex-wrap:wrap;
    text-align: center;
    padding-top: 10px;
    li{
      list-style: none;
      -webkit-flex: 0 0 16.6667%;
      -moz-flex: 0 0 16.6667%;
      -ms-flex: 0 0 16.6667%;
      flex: 0 0 16.6667%;
      max-width: 16.6667%;
      p{
      width: 36px;
      height: 36px;
      background-color: @supportColor;
      color: #fff;
      text-align: center;
      line-height: 36px;
      display: inline-block;
      margin-bottom: 10px;
      }
    }
  } 
</style>
