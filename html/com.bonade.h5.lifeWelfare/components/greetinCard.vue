<template>
    <div class="greetinCard">
        <mt-header title="贺卡" v-if="isApp">
            <mt-button icon="back" slot="left" v-on:click="goBack" v-show="!urlParam">返回</mt-button>
            <mt-button icon="back" slot="left" v-on:click="exit"   v-show="urlParam" >返回</mt-button>
            <mt-button slot="right" v-on:click="share">分享</mt-button>
        </mt-header>
        <div class="content" v-if="pageInfo">
            <div class="topImg">
                <img v-bind:src=pageInfo.part1Image alt="">
            </div>
            <div class="bottomImg">
                <img v-bind:src=pageInfo.part2Image >
                <div class="greetinText">
                    <!-- 语音贺卡 -->
                    <div class="title_souce" v-if="pageInfo.voiseAddress">
                        
                        <div class="logo"><img v-bind:src=pageInfo.companyLogo  :onerror="defaultImg"></div>
                        <div class="souceBar" v-on:click="setPay">
                            <img src="../assets/images/souceBar.png" alt=""> 
                            <span id='payOn' class="icon-pause2"></span>
                        </div>
                        <audio v-show="false" id='voise' autoplay="autoplay" v-bind:src="pageInfo.voiseAddress" controls="controls"></audio>
                    </div>
                    <!-- 文字贺卡 -->
                    <div class="title" v-if="!pageInfo.voiseAddress">
                        <div class="logo"><img v-bind:src=pageInfo.companyLogo :onerror="defaultImg" ></div>
                    </div>
                    <div class="text">
                        亲爱的{{pageInfo.userName}}:<br />
                        &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
                        {{pageInfo.wishes}}
                    </div>
                    <div class="name">{{pageInfo.companyName}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'app',
    data() {
        return {
            result: '测试',
            base64: '',
            src: './static/img/default_avatar.png',
            selected: 'second',
            searchBarVisible: true,
            keyword: '',
            employees: [],
            uploadList: [],
            pageInfo:'',
            urlParam:null,
            isApp:true,
            payEnd:true,
            defaultImg: 'this.src="' + require('../assets/images/default.png') + '"'
        }
    },
    computed: {
        isAndroid() {
            return this.$utils.device.android
        }
    },
    created() {
        this.getData();
        try {
           console.log(XqcH5JS)
        }
        catch(err) {
            this.isApp = false;
        }
        this.setVoise();


    },
    methods: {
        getData() {
            this.urlParam = this.$utils.getParameter("detailId");
            console.log(this.urlParam);
            console.log(this.$route.params.detailId);
            this.$utils.ajax({
                // baseURL:'http://192.168.1.182:8113',
                url:'/welfare/welfareDispatchInfo/app/v1/queryUserWelfareDetail'+'?detailId='+(this.$route.params.detailId?this.$route.params.detailId:this.urlParam),
                method:'get',
                success:(sucData)=>{
                    if(sucData.httpCode == 200){
                        console.log(sucData)
                        this.pageInfo = sucData.data;
                    }else{
                        this.$toast({message: sucData.msg,position:'bottom'});
                    }
                },
                error:(errData)=>{
                     console.log(errData)
                }
            })
        },
        share(){
            this.$app.sharePage(["WEIXIN","WEIXIN_CIRCLE"],
                                '薪起程贺卡',
                                this.pageInfo.wishes,
                                this.$app.getCurrentDomain().split('api/')[0] +'/xqc-h5/com.bonade.h5.lifeWelfare/index.html#/greetinCard?detailId='+(this.$route.params.detailId?this.$route.params.detailId:this.urlParam),
                                this.pageInfo.thumbnailImage
                                )
        },
        setVoise(){
            setTimeout(function() {
                let audio =  document.getElementById("voise");
                let payOn = document.getElementById("payOn");
                let class_name = payOn.getAttribute("class");
                audio.addEventListener("ended", //歌曲一经完整的加载完毕( 也可以写成上面提到的那些事件类型)
                    ()=>{
                        // console.log('4444445555')
                        class_name = class_name.replace("icon-pause2","icon-play3");
                        payOn.setAttribute("class",class_name);
                        
                }, false);
            }, 500);


        },
        setPay(){
            let payOn = document.getElementById("payOn");
            let class_name = payOn.getAttribute("class");
            let audio =  document.getElementById("voise");
                if(audio.paused){ //如果当前是暂停状态
                    class_name = class_name.replace("icon-play3","icon-pause2");
                    payOn.setAttribute("class",class_name);
                    audio.play(); //播放
                    return;
                }else{//当前是播放状态
                    class_name = class_name.replace("icon-pause2","icon-play3");
                    payOn.setAttribute("class",class_name);
                    audio.pause(); //暂停
                }
        }
    }
}
</script>
<style lang="less" >
    *{
        box-sizing:border-box;
    }
     .greetinCard{
         .content{
             .topImg{
                 width: 100%;
                 img{
                     width: 100%;
                    vertical-align: bottom;
                    pointer-events: none;
                 }
             }
             .bottomImg{
                 padding:35px;
                 width: 100%;
                min-height: 280px;
                position: relative;
                >img{
                    top: 0;
                    left: 0;
                    bottom: 0;
                    right: 0;
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    z-index: 1;
                }
                .greetinText{
                    // border:1px solid red;
                    position: relative;
                    z-index: 2;
                    .title_souce{
                        overflow: hidden;
                        .logo{
                            border: 1px solid #b58504;
                            width: 40px;
                            height: 40px;
                            border-radius: 50px;
                            background: #fff;
                            text-align: center;
                            float: left;
                            overflow: hidden;
                            img{
                                width: 100%;
                                height: 100%;
                                pointer-events: none;
                                background: url('../assets/images/default.png');
                                background-size: 100%;
                            }
                        }
                        .souceBar{
                            float: left;
                            margin-top: 7px;
                            margin-left: 10px;
                            img{
                                width: 130px;
                                pointer-events: none;
                            }
                            span{
                                float: right;
                                margin-top: 5px;
                                color: #9e771b;
                            }
                        }
                    }
                    .title{
                        .logo{
                            border: 1px solid #b58504;
                            width: 60px;
                            height: 60px;
                            margin:auto auto;
                            border-radius: 50px;
                            background: #fff;
                            text-align: center;
                            overflow: hidden;
                            img{
                                width: 100%;
                                height: 100%;
                                pointer-events: none;
                                background: url('../assets/images/default.png');
                                background-size: 100%;
                            }
                        }
                    }
                    .text{
                        margin-top: 10px;
                        line-height: 30px;
                    }
                    .name{
                        text-align: right;
                        margin-top: 5px;
                    }
                }
             }
         }
     }
    
</style>