<template>
  <div>
    <div class="driverqualifications">
      <mt-header title="司机详情">
        <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
      </mt-header>
      <div class="content">
            <div class="margin-top">
                <mt-cell title="状态" v-if="driverDetail.status == '0'" value="审核中"></mt-cell>
                <mt-cell title="状态" v-if="driverDetail.status == '1'" value="已登记"></mt-cell>
                <mt-cell title="状态" v-if="driverDetail.status == '2'" value="未通过"></mt-cell>
            </div>
            <div class="margin-top">
                <mt-cell title="姓名" v-bind:value="driverDetail.name"></mt-cell>
                <mt-cell title="国籍" v-bind:value="driverDetail.nation"></mt-cell>
                <mt-cell title="家庭住址" v-bind:value="driverDetail.address||'——'"></mt-cell>
            </div>
            <div class="margin-top">
                <mt-cell title="驾驶证号" v-bind:value="driverDetail.driverLicense"></mt-cell>
                <mt-cell title="档案编号" v-bind:value="driverDetail.fileCode"></mt-cell>
                <mt-cell title="准驾车型" v-bind:value="driverDetail.driverLicenseType"></mt-cell>
                <mt-cell title="初次领证时间">
                    <span>{{driverDetail.firstTime | datetime('yyyy-MM-dd',driverDetail.firstTime)}}</span>
                </mt-cell>
                <mt-cell class="dateText" title="有效日期">
                    <p>{{driverDetail.validStartTime | datetime('yyyy-MM-dd',driverDetail.validStartTime)}}</p>
                    <p>&nbsp;&nbsp;<i class="toForm"></i>&nbsp;&nbsp;</p>
                    <p>{{driverDetail.validEndTime | datetime('yyyy-MM-dd',driverDetail.validEndTime)}}</p>
                </mt-cell>
            </div>
            <div class="margin-top picmodule">
                <p>行驶证照片</p>
                <div class="piclist" v-on:click="show(index)" v-for="(picItem,index) in traveldata.picList" :key="picItem.id">
                    <img class="img-item" v-bind:src="picItem.path">
                </div>
            </div>
      </div>
    </div>
        <previewer ref="previewer" :list="previewerList" :options="options">
        </previewer>
  </div>
</template>
<script>
export default {
  name: 'driverqualifications',
  data() {
    return {
        traveldata:'',
        options: {
            getThumbBoundsFn(index) {
                let thumbnail = document.querySelectorAll('.img-item')[index]
                let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
                let rect = thumbnail.getBoundingClientRect()
                return { x: rect.left, y: rect.top + pageYScroll, w: rect.width }
            }
        },
        previewerList: []
    }    
  },    
  computed:{
    driverDetail(){
        if(!this.traveldata){
            return ''
        }else{
            return this.traveldata.driverDetail
        }
    }
  },
  methods:{
    openPicker() {
      this.$refs.fristDate.open()
    },
    show(index) {
        this.$refs.previewer.show(index)
    },
    requestData(){
        this.$utils.ajax({
            url:'driver/detail',
            data:{
                'employeeId':window.userInfo.empId
            },
            success:(res)=>{
                if (res.httpCode === 200) {
                    this.traveldata = res;
                    for(var i=0;i<this.traveldata.picList.length;i++){
                        this.previewerList.push({'src':this.traveldata.picList[i].path})
                    }
                    console.log(res)
                } else {
                this.$toast(res.msg)
                }
            },error: (err) => {
            this.$toast('出错了')
            },
        })
    }
  },
  mounted(){
    this.requestData()
  }
}

</script>
<style lang="less">
.driverqualifications{
.margin-top{
    margin-top: 10px;
}
.picmodule{
    background-color: #fff;
    padding: 10px;
}
.piclist{
    margin-top: 10px;
    margin-right: 10px;
    height: 44px;
    width: 44px;
    display: inline-block;
    img{
        max-width: 100%;
        max-height: 100%;
    }
}
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

    .mint-cell{
        .mint-cell-title{
            flex: none;
            width: 105px;
        }
        .mint-cell-wrapper{
            padding-right: 0; 
        }
    }
    .dateText{
        p{
            font-size: 14px;
        }
        
    }
}
</style>
