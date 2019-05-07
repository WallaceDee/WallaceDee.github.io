<template>
  <div>
    <div class="page-index">
      <mt-header title="用车">
        <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
      </mt-header>
      <div class="content">
      	<div class="main-bgimg">
						<router-link to="/userCarTab/travel">
							 <button type="button" class="home-btn" v-on:click="addNum">立即用车</button>
						</router-link>
      	</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'index',
  data() {
    return {
			isJoinIndex:false
    }
	},
	methods:{
		addNum(){
			this.isJoinIndex = true
			localStorage.setItem('isJoinIndex',this.isJoinIndex)
		},
		goBack(){
      this.$app.finish()
    }
	},
	beforeCreate(){
			if(localStorage.getItem('isJoinIndex')){
				this.$router.push({path: '/userCarTab/travel'})
			}
	}
}

</script>
<style lang="less" scoped>
	.main-bgimg{
		height: 100%;
		width: 100%;
		background: url(../assets/images/car-home.png)no-repeat;
		background-size: 100%;
	}
	.main-bgimg .home-btn{
		  width: 200px;
	    height: 40px;
	    position: absolute;
	    bottom: 8%;
			left: 50%;
			margin-left: -100px;
	    background-color: transparent;
	    color: white;
	    border: 1px solid #fff;
	    font-size: 20px;
	    letter-spacing:1px;
	    border-radius: 4px;
	    font-family: "SimSun";
		}
</style>
