<template>
  <div>
    <div class="page-site">
      <mt-header title="地址">
        <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
      </mt-header>
      <div class="content">
          <div class="top-search">
            <div class="area" v-on:click="openCityPicker">{{city}}</div>
            <div>
              <div class="site-search">
                <i class="icon-search"></i>
                <input type="text" placeholder="你要去哪儿" v-model="keyword">
              </div>
            </div>
            <div v-on:click="reset">取消</div>
          </div>
          <div class="site-wrap">
            <div class="item-bar border-bottom" v-for="item in list" v-bind:key="item.uid" v-on:click="selectSite(item)">
              <div class="icon-location"></div>
              <div>
                <p>{{item.title}}</p>
                <p>{{item.address}}</p>
              </div>
            </div>
          </div>
           <baidu-map :ak="baiduMapAk">
             <bm-local-search :keyword="keyword" :auto-viewport="true" :location="location" v-on:searchcomplete="search" :panel="false" :forceLocal="true"></bm-local-search>
          </baidu-map>
      </div>
    </div>
    <mt-popup v-model="cityPickerVisible" position="bottom">
      <div class="bar bar-nav">
        <button class="button pull-right" v-on:click="closeSitePopUP">关闭</button>
        <h1 class="title">地区选择</h1>
      </div>
      <mt-picker :slots="addressSlots" @change="onAddressChange" :visible-item-count="5"></mt-picker>
    </mt-popup>
  </div>
</template>
<script>
import { baiduMapAk } from '@/config/'
import { BmlMarkerClusterer, BaiduMap, BmScale, BmMarker, BmCircle ,BmLocalSearch } from 'vue-baidu-map'
import { citiesData } from '../commonComponents/cities-data.js'
export default {
  name: 'site',
  components: {
    BmlMarkerClusterer,
    BaiduMap,
    BmScale,
    BmMarker,
    BmCircle,
    BmLocalSearch
  },
  data() {
    return {
      list:[],
      defaultTime: new Date().format('yyyy-MM-dd'),
      baiduMapAk,
      location:'佛山',
      keyword: '',
      cityPickerVisible:false,
      addressSlots: [{
        flex: 1,
        values: Object.keys(citiesData),
        className: 'slot1',
        textAlign: 'center'
      }, {
        flex: 1,
        className: 'slot2',
        textAlign: 'center',
        values: Object.keys(citiesData['广东']),
        defaultIndex:1
      }],
      province: '',
      city: ''
    }
  },
  created() {
    this.$app.getLocation((res)=> {
        this.$utils.getInfoByCoordinate({
          lat: res.data.lat,
          lng: res.data.lng
        }, (res) => { 
          let currentLocation = res.result.addressComponent.city
          this.location = currentLocation
        })
    })
  },
  computed:{

  },
  // watch: {
  //   selected(val, oldVal) {
  //     const currElement = document.querySelector('.active')
  //     currElement.className = ''
  //     let clickElement = document.querySelector('.slide-nav').querySelector('#' + val)
  //     clickElement.className = 'active'
  //   }
  // },
  methods: {
    switchTab(e) {
      if (e.target.tagName === 'LI') {
        this.selected = e.target.id
      }
    },
    doDel() {
      this.$messagebox({
        title: '提示',
        message: '确定要结束行程吗?',
        showCancelButton: true
      })
    },
    mapReady({ BMap, map }) {
        this.bMap = { BMap, map }
    },
    search(data){
      if(data===undefined){
         data=[]
      }
      this.list = data.Br
      console.log(data.Br,'搜索结果')
    },
    openCityPicker() {
      this.cityPickerVisible = true
    },
    onAddressChange(picker, values) {
      picker.setSlotValues(1, Object.keys(citiesData[values[0]]))
      this.province = values[0]
      this.city = values[1]
      if(values[0]=='北京' || values[0]=='上海' || values[0]=='天津'|| values[0]=='重庆'|| values[0]=='香港' || values[0]=='澳门'|| values[0]=='台湾'|| values[0]=='其他'){
        this.location = values[0]
      }else{
        this.location = values[1]
      }
    },
    closeSitePopUP(){
      this.cityPickerVisible=false
    },
    reset(){
      this.keyword=''
    },
    selectSite(data){
      // console.log(data,'当前选中的数据')
      // console.log(this.$route.params.type,'当前从哪个页面调用此搜索')
      let siteObj ={
        'name':'',
        'title':'',
        'lat':'',
        'lng':''
      }
      //立即出发(起点)
      if(this.$route.params.type=='traveStart'){
        siteObj.name = data.address
        siteObj.title = data.title
        siteObj.lat = data.point.lat
        siteObj.lng = data.point.lng
        siteObj = JSON.stringify(siteObj)
        sessionStorage.setItem('traveStartObj',siteObj)
        this.$router.push({name:'useCar',params:{siteType:this.$route.params.type,tabId:this.$route.params.tabId}})
      }
      //立即出发(终点)
      if(this.$route.params.type=='traveEnd'){
        siteObj.name = data.address
        siteObj.title = data.title
        siteObj.lat = data.point.lat
        siteObj.lng = data.point.lng
        siteObj = JSON.stringify(siteObj)
        sessionStorage.setItem('traveEndObj',siteObj)
        this.$router.push({name:'useCar',params:{siteType:this.$route.params.type,tabId:this.$route.params.tabId}})
      }
      //审批出行(起点)
      if(this.$route.params.type=='approveTraveStart'){
        siteObj.name = data.address
        siteObj.title = data.title
        siteObj.lat = data.point.lat
        siteObj.lng = data.point.lng
        siteObj = JSON.stringify(siteObj)
        sessionStorage.setItem('approveTraveStartObj',siteObj)
        this.$router.push({name:'useCar',params:{siteType:this.$route.params.type,tabId:this.$route.params.tabId}})
      }
      //审批出行(终点)
      if(this.$route.params.type=='approveTraveEnd'){
        siteObj.name = data.address
        siteObj.title = data.title
        siteObj.lat = data.point.lat
        siteObj.lng = data.point.lng
        siteObj = JSON.stringify(siteObj)
        sessionStorage.setItem('approveTraveEndObj',siteObj)
        this.$router.push({name:'useCar',params:{siteType:this.$route.params.type,tabId:this.$route.params.tabId}})
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .mint-popup.mint-popup-bottom{
    width: 100%;
  }
  .top-search{
    display: flex;
    height: 44px;
    line-height: 44px;
    background-color: @mainColor;
    color: @subColor;
    padding: 0 10px;
    .area{
      position: relative;
      padding-right: 22px;
      &::after{
        content:'';
        width: 8px;
        height: 8px;
        border-top: 2px solid #dfb772;
        border-right: 2px solid #dfb772;
        -webkit-transform: rotate(135deg);
        transform: rotate(135deg);
        position: absolute;
        top: 50%;
        right: 5px;
        margin-top: -6px;
      }
    }
    div:nth-child(2){     
      flex: 1;
      align-self: center;
      .site-search{
        height: 32px;
        background-color:rgba(223,183,114,0.14);
        border-radius:16px;
        position: relative;
      }
      input{
        border: none;
        color: #dfb772;
        background-color: transparent;
        font-size: 14px;
        padding-left: 34px;
        padding-right: 10px;
        width: 90%;
        padding-bottom: 17px;
        outline: none;
      }
      i{
        position: absolute;
        left: 10px;
        top: 50%;
        margin-top: -8px;
      }
    }
    div:nth-child(3){
      -webkit-flex: 0 0 40px;
      -moz-flex: 0 0 40px;
      -ms-flex: 0 0 40px;
      flex: 0 0 40px;
      max-width: 40px;
      text-align: right;
    }
  }
  .site-wrap{
    height:calc(~"100% - 44px");
    overflow: auto;
  }
  .item-bar{
    height: 56px;
    background-color: #fff;
    display: flex;
    padding: 0 12px;
    box-sizing: border-box;
    div:nth-child(1){
      width: 40px;
      font-size: 28px;
      color: rgba(172,172,172,1);
      line-height: 56px;
    }
    div:nth-child(2){
      width: 90%;
      p:nth-child(1){
        color: #303030;
        font-size: 16px;
        margin: 10px 0;
        overflow: hidden;  
        text-overflow: ellipsis;  
        white-space: nowrap;
      }
      p:nth-child(2){
        color: #ACACAC;
        font-size: 14px;
        overflow: hidden;  
        text-overflow: ellipsis;  
        white-space: nowrap;
      }
    }
  }
  
</style>
