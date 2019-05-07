<template>
  <div>
    <div class="page-travel-track">
      <mt-header title="行程轨迹">
        <mt-button icon="back" slot="left" v-on:click="goBackPage"></mt-button>
      </mt-header>
      <div class="content">
      	<baidu-map :ak="baiduMapAk"> 
					<bm-view class="map"  v-bind:style="{height:height + 'px'}">
					</bm-view>
					<bm-driving
						:start= "mapStart"
						:end= "mapEnd"
						:auto-viewport="true"
						policy="BMAP_DRIVING_POLICY_LEAST_DISTANCE"
						NavigationControlType="BMAP_NAVIGATION_CONTROL_LARGE"
						:panel="false"
						>
					</bm-driving> 
				</baidu-map>
      </div>
    </div>
  </div>
</template>
<script>
import { baiduMapAk } from '@/config/'
import { BmlMarkerClusterer, BaiduMap, BmScale, BmMarker, BmCircle,BmDriving,BmView} from 'vue-baidu-map'
export default {
	name: 'travelTrack',
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
			height:500
    }
	},
	created(){
		this.height = document.body.clientHeight-44
		console.log(this.$route.params.type)
		//立即出发
		if(this.$route.params.type=='travelPoint'){
			console.log(this.$route.params.type,'当前类型')
			let traveStartData = JSON.parse(sessionStorage.getItem('traveStartObj'))
			let traveEndData = JSON.parse(sessionStorage.getItem('traveEndObj'))
			this.mapStart={lat:traveStartData.lat,lng:traveStartData.lng} 
			this.mapEnd={lat:traveEndData.lat,lng:traveEndData.lng} 
		}else if(this.$route.params.type=='approveDetailPoint'){
			let traveStartData = JSON.parse(sessionStorage.getItem('approveDetailStartObj'))
			let traveEndData = JSON.parse(sessionStorage.getItem('approveDetailEndObj'))
			this.mapStart={lat:traveStartData.lat,lng:traveStartData.lng} 
			this.mapEnd={lat:traveEndData.lat,lng:traveEndData.lng} 
		}else if(this.$route.params.type=='approveTravelPoint'){
			let traveStartData = JSON.parse(sessionStorage.getItem('approveTraveStartObj'))
			let traveEndData = JSON.parse(sessionStorage.getItem('approveTraveEndObj'))
			this.mapStart={lat:traveStartData.lat,lng:traveStartData.lng} 
			this.mapEnd={lat:traveEndData.lat,lng:traveEndData.lng}
		}
	},
	methods:{
		goBackPage(){
			if(this.$route.params.tabId==1){
				this.$router.push({name:'useCar',params:{'type':'travelPoint','tabId':1}})
			}else if(this.$route.params.tabId==2){
				this.$router.push({name:'useCar',params:{'type':'approveTravelPoint','tabId':2}})
			}else{
				this.goback()
			}
		}
	}
}

</script>
<style lang="less" scoped>

</style>
