<template>
  <div>
    <div class="page-travel">
      <mt-header v-bind:title="title">
        <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
        <mt-button icon="more" slot="right" v-on:click="openMenu" v-if="title == '审批出行'" ref="button"></mt-button>
      </mt-header>
        <!-- <p>
        <router-link to="/userCarTab/travel">立即出发</router-link> 
        <router-link to="/userCarTab/approveTravel">审批出行</router-link> 
        </p>    -->
        <div class="mint-tabbar is-fixed">
            <a class="mint-tab-item is-selected">
                <router-link to="/userCarTab/travel">
                    <img src="../assets/images/chufa@3x.png"/>
                    <div class="mint-tab-item-label">立即出发</div>
                </router-link> 
            </a>
            <a class="mint-tab-item">
                <router-link to="/userCarTab/approveTravel">
                    <img src="../assets/images/shenpi@3x.png"/>
                    <div class="mint-tab-item-label">审批出行</div>
                </router-link> 
            </a>
            <router-link to="/useCar" class="use-car">
                <img src="../assets/images/yongche@3x.png" />
            </router-link>
        </div>    
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
    <mt-datetime-picker v-model="immDefaultTime" class="date-yyyy-mm" ref="immPicker" type="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="immediatelyHandleConfirm">
    </mt-datetime-picker>
    <mt-datetime-picker v-model="appDefaultTime" class="date-yyyy-mm" ref="appPicker" type="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="approveHandleConfirm">
    </mt-datetime-picker>
    <mt-popup v-model="menuVisible" popup-transition="popup-fade" class="menu-popup" :style="{ top: buttonBottom }">
      <ul>
        <li v-on:click="isJoin">
          <a><i class="icon-driver"></i>司机登记</a>
        </li>
        <li v-on:click="repeatItem">
          <a><i class="icon-travel"></i>重复行程管理</a>
        </li>
      </ul>
    </mt-popup>
  </div>
</template>
<script>
import bus from '../utils/bus';
export default {
  name: 'userCarTab',
  data() {
    return {
      immDefaultTime: new Date().format('yyyy-MM-dd'),
      appDefaultTime: new Date().format('yyyy-MM-dd'),
      title:'',
      menuVisible: false,
      buttonBottom: 0,
      autoArr:[],
      manualArr:'',
    }
  },
  watch: {

  },
  methods: {
    immediatelyHandleConfirm(){
      // console.log(this.defaultTime)
      bus.$emit('dateImmConfirm',this.immDefaultTime);
    },
    approveHandleConfirm(){
      // console.log(this.defaultTime)
      bus.$emit('dateAppConfirm',this.appDefaultTime);
    },
    goBack(){
      this.$app.finish();
    },   
    openMenu() {
      this.menuVisible = true
    },
    getTopRoute(){
      this.$utils.ajax({
        url:'route/app/v2/applist',
        data:{employeeId:window.userInfo.empId,
              'state': '2'
              },
        success:(res)=>{
            if (res.httpCode === '200') {
              sessionStorage.setItem('TopRouteNum','1')
              for(var i=0;i<res.data.length;i++){
                if(res.data[i].routeType == '2'){
                  this.autoArr.push(res.data[i].id)
                }else{
                  this.manualArr = res.data[i].id
                }
              }
              if(this.autoArr.length > 0 || this.manualArr){
                this.$app.initLocation(this.manualArr,this.autoArr,function(respose){
                })
              }
            } else {
              this.$toast('出错了')
            }
        },error: (err) => {
          this.$toast('出错了')
        },
      })
    },
    isJoin(){
      document.querySelector('.v-modal').remove()
			if(window.userInfo.defaultCompany.isDriver == '1' || window.userInfo.defaultCompany.isDriver == '0' || window.userInfo.defaultCompany.isDriver == '2') {
        this.$router.push({name:'driverqualifications'})
      } else {
        if (window.userInfo.user.isIdentity) {
          this.$router.push({'name':'driverCertification'})
        } else {
          this.$toast('请先进行实名认证');
        }
      }
    },
    repeatItem(){
      document.querySelector('.v-modal').remove()
      this.$router.push({'name':'repeatTravel'})
    }
  },
  created(){
    if(!sessionStorage.getItem('TopRouteNum')){
      this.getTopRoute()
    }
    bus.$on('immDate', ()=> {
        this.$refs.immPicker.open()
    });
    bus.$on('appDate', ()=> {
        this.$refs.appPicker.open()
    });
    bus.$on('changetitle', (title)=> {
       this.title = title
    });
  }
}

</script>
<style lang="less" scoped>
.menu-popup{
  margin-top: 44px;
}
.v-modal{
  background-color:initial;
  opacity: initial;
}
.router-link-exact-active.router-link-active{
  img,.mint-tab-item-label{
    opacity: 1 !important;
  }
}
.mint-tabbar.is-fixed {
  height: 54px;
  z-index: 3;
  background-color: #303030;
  a:not(.use-car) {
    background-color: @mainColor;
  }
  a:nth-child(1)>img{
    width: 24px;
    height: 24px;
    opacity: 0.5;
  }
  a:nth-child(2)>img{
    width: 24px;
    height: 24px;
    opacity: 0.5;
  }
  a:nth-child(3)>img{
    width: 52px;
    height: 52px;
  }
}
.mint-tab-item-label {
  color: @supportColor;
  opacity: 0.5;
}

.use-car {
  position: absolute;
  bottom: 13px;
  left: 50%;
  margin-left: -26px;
}
</style>
