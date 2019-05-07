<template>
  <div>
    <div class="page-travel">
        <mt-header title="审批详情">
            <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
        </mt-header>
        <div class="content">
            <div class="details-list">
              <mt-cell title="起点" value="清晖园"></mt-cell>
              <mt-cell title="终点" value="华南家电研究院"></mt-cell>
              <mt-cell title="出发时间" value="2017-03-23 11:32"></mt-cell>
              <mt-cell title="到达时间" value="2017-03-23 11:32"></mt-cell>
              <mt-cell title="车辆" value="湘T22333(公车)"></mt-cell>
              <mt-cell title="预计里程" value="23km"></mt-cell>
              <mt-cell title="实际里程" value="0.5km"></mt-cell>
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
            </div>
            <p class="detailtitle">审批信息</p>
            <div class="approvelist">
                <div class="approveradio">
                    <p>用车事由</p>
                    <p>上下班</p>
                </div>
                 <div class="approvetextarea">
                    <p>备注</p>
                    <p>上下班用车，中间接送客户</p>
                </div>
                <div class="approveorganization">
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
                </div>
                <div class="approveimage">
                    <p class="iTitle">图片</p>
                    <div class="imagelistbox">
                        <p class="imagelist">
                            <img src="..\assets\images\car-home.png" alt="">
                        </p>
                        <p class="imagelist">
                            <img src="..\assets\images\car-home.png" alt="">
                        </p>
                        <p class="imagelist">
                            <img src="..\assets\images\car-home.png" alt="">
                        </p>
                    </div>
                </div>
            </div>
            <div class="linkList">
            <mt-cell title="审批状态" is-link>
                <span>审批通过</span>
            </mt-cell>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'approvalnfo',
  data() {
    return {
     
    }
  },
  methods: {

  }
}

</script>
<style lang="less">
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
.approveradio,.approvetextarea{
    display: flex;
    min-height: 48px;
    padding: 0 10px;
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
.approvelist{
    background-color: #fff;
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

.btn {
  padding: 20px 10px;
  .mint-button-text {
    font-size: 14px;
  }
}
</style>
