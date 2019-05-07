<template>
    <div>
        <div class="page-sign">
            <mt-header title="打卡">
                <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
            </mt-header>
            <div class="content">
                <mt-cell v-bind:title="name" v-bind:label="'身份证：'+idNo"></mt-cell>
                <div class="sign-wrapeer">
                    <div class="sign-button" v-bind:class="{'illegal':!inRange,'on':onDuty,'off':!onDuty}" v-on:click="chooseImage">
                        <i class="icon-camera"></i>
                        <h1></h1>
                        <p>{{datetime}}</p>
                    </div>
                    <div class="location" v-bind:class="{'in-range':inRange,'out-range':!inRange}">
                        <p>
                            <i></i>
                            <span></span>
                            <span>{{addressmsg}}</span>
                            <a v-on:click="openPopup">去重新定位</a>
                        </p>
                    </div>
                </div>
                <div class="sign-list">
                    <ul>
                        <li v-bind:class="{ 'start': item.duty === 'S' ,'end': item.duty === 'O','normal':item.state==='1','illegal':item.state!=='1' }" class="normal start" v-for="item in list" v-bind:key="item.id">
                            <div>{{item.duty === 'S'?'上':'下'}}班打卡时间{{item.dutyTime|datetime('MM-dd hh:mm',item.dutyTime)}}</div>
                            <p>
                                <i class="icon-location"></i>{{item.dutyLocation}}</p>
                        </li>
                    </ul>
                    <div class="time-line"></div>
                </div>
            </div>
        </div>
        <mt-popup v-model="popupVisible" position="right" class="page-popup page-map">
            <mt-header title="">
                <mt-button icon="back" slot="left" v-on:click="closePopup"></mt-button>
            </mt-header>
            <div class="mint-tabbar button-wrapper">
                <mt-button size="large" v-on:click.native="closePopup">确定</mt-button>
            </div>
            <div class="content">
                <baidu-map id="BaiduMap" class="map" :center="circlePath.center" :zoom="circlePath.zoom" @ready="mapReady" :ak="baiduMapAk">
                    <bm-circle :center="dutyPath.center" :radius="dutyPath.radius" :stroke-color="stroke.color" :stroke-opacity="stroke.opacity" :stroke-weight="stroke.weight" :fillColor="fill.color" :fillOpacity="fill.opacity"></bm-circle>
                    <bm-marker :position="dutyPath.center" :icon="businessMarker" :offset="markerOffset"></bm-marker>
                    <bm-marker :position="singlePath" :icon="meMarker" :offset="markerOffset"></bm-marker>
                </baidu-map>
                <div class="relocation-btn" v-on:click="location">
                    <span v-bind:class="{'spiner':loading}">
                        <i class="icon-target"></i>
                    </span>&nbsp;重新定位
                </div>
                <div class="location-info" v-bind:class="{'in-range':inRange,'out-range':!inRange}">
                    <p>我的位置(
                        <i></i>
                        <span>考核范围</span>
                        内)</p>
                    <div>
                        <span></span>
                        <span>{{addressmsg}}</span>
                    </div>
                </div>
            </div>
        </mt-popup>
    </div>
</template>
<script>
import { baiduMapAk } from '@/config/'
import { BmlMarkerClusterer, BaiduMap, BmScale, BmMarker, BmCircle } from 'vue-baidu-map'
export default {
    name: 'sign',
    components: {
        BmlMarkerClusterer,
        BaiduMap,
        BmScale,
        BmMarker,
        BmCircle
    },
    data() {
        return {
            baiduMapAk,
            list: [],
            pageNum: 1,
            row: 6,
            popupVisible: false, //popup的显示隐藏
            dutyPath: { //考勤定位
                center: { //初始化定位为北京天安门
                    lng: 116.404,
                    lat: 39.915
                },
                radius: 0 //考勤范围半径
            },
            circlePath: { //地图定位
                center: { //初始化定位为北京天安门
                    lng: 116.404,
                    lat: 39.915
                },
                zoom: 16 //考勤范围半径
            },
            singlePath: { //我的定位
                lng: 116.404,
                lat: 39.915
            },
            stroke: {
                color: '#ba8833',
                opacity: 1,
                weight: 1
            },
            fill: {
                color: '#ba8833',
                opacity: 0.2
            },
            meMarker: {
                url: './static/img/marker_me.png',
                size: {
                    width: 34,
                    height: 34
                }
            },
            businessMarker: {
                url: './static/img/marker_business.png',
                size: {
                    width: 34,
                    height: 34
                }
            },
            markerOffset: {
                width: 0,
                height: -17
            },
            singleLocationing: false, //是否显示重新定位
            addressmsg: '定位中...', //定位后的地址信息
            rangeState: 1, //考勤状态
            datetime: 0, //倒计时
            dutyPic: null, //考勤照片路径
            bMap: null,
            inRangeOnly: false,
            loading: false
        }
    },
    computed: {
        staffId() {
            return this.$route.params.staffId
        },
        name() {
            return this.$route.params.name
        },
        idNo() {
            return this.$route.params.idNo
        },
        projectId() {
            return this.$route.params.projectId
        },
        onDuty() {
            let temp = true
            if (this.list.length > 0) {
                if (this.list[0].duty === 'S') { temp = false }
            }
            return temp
        },
        inRange: {
            get() {
                return this.rangeState === 1
            },
            set(newValue) {
                newValue === true ? this.rangeState = 1 : this.rangeState = 2
            }
        }
    },
    created() {
        this.getCheckScope()
        this.counter()
        this.getDutyRecord()
    },
    methods: {
        openPopup() {
            this.popupVisible = true
            let BMap = this.bMap.BMap
            let map = this.bMap.map
            let points = [
                new BMap.Point(Number(this.dutyPath.center.lng), Number(this.dutyPath.center.lat)),
                new BMap.Point(Number(this.singlePath.lng), Number(this.singlePath.lat))
            ]
            setTimeout(() => {
                console.log(map.getViewport(points))
                this.circlePath = map.getViewport(points)
            }, 400)
        },
        closePopup() {
            this.popupVisible = false
        },
        //时钟
        counter() {
            let now = new Date() // 得到当前时间
            let hour, minute, second
            now.getHours() < 10 ? hour = '0' + now.getHours() : hour = now.getHours()
            now.getMinutes() < 10 ? minute = '0' + now.getMinutes() : minute = now.getMinutes()
            now.getSeconds() < 10 ? second = '0' + now.getSeconds() : second = now.getSeconds()
            this.datetime = hour + ':' + minute + ':' + second
            setTimeout(this.counter, 1000)
        },
        getDistance(lat1, lng1, lat2, lng2) { //计算两点间距离
            let radLat1 = lat1 * Math.PI / 180.0
            let radLat2 = lat2 * Math.PI / 180.0
            let a = radLat1 - radLat2
            let b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0
            let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
                Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
            s = s * 6378.137 // EARTH_RADIUS;
            s = Math.round(s * 10000) / 10
            return s
        },
        location() { //单点定位
            this.loading = true
            this.$app.getLocation((res) => {
                if (res.status === '1') {
                    let lat = res.data.lat
                    let lng = res.data.lng
                    let distance = this.getDistance(lat, lng, this.dutyPath.center.lat, this.dutyPath.center.lng)
                    if (distance < this.dutyPath.radius) {
                        this.inRange = true
                    } else {
                        this.inRange = false
                    }
                    this.$utils.getInfoByCoordinate({ lat, lng }, (res) => {
                        this.addressmsg = res.result.sematic_description
                        this.loading = false
                    })
                    this.singlePath = { lat, lng }
                    this.circlePath.center = {
                        lat: this.circlePath.center.lat - Math.random() / 1000000,
                        lng: this.circlePath.center.lng - Math.random() / 1000000
                    }
                } else {
                    this.$toast('定位失败')
                    this.loading = false
                    this.addressmsg = '定位失败，请重新定位'
                }
            })
        },
        getCheckScope() { //请求考勤范围
            this.$utils.ajax({
                url: '/sal/day/app/v1/getCheckScope',
                data: {
                    prjId: this.projectId
                },
                success: (res) => {
                    if (res.statusCode === 200 && res.data.dutyScope !== null) {
                        this.dutyPath = { //考勤定位
                            radius: Number(res.data.dutyScope), //考勤范围半径
                            center: { //初始化定位为北京天安门
                                lng: res.data.dutyLongitude,
                                lat: res.data.dutyLatitude
                            }
                        }
                        this.inRangeOnly = res.data.configState === '1'
                        this.location()
                    } else {
                        this.$toast('未配置考勤范围')
                    }
                }
            })
        },
        getDutyRecord() { //获取打卡信息
            this.$utils.ajax({
                url: '/sal/day/app/v1/getDutyRecord',
                data: {
                    prjId: this.projectId,
                    staffId: this.staffId,
                    pageNum: this.pageNum,
                    row: this.row
                },
                success: (res) => {
                    if (res.statusCode === 200) {
                        this.list = res.data.list
                    } else {
                        this.$toast('加载失败')
                    }
                }
            })
        },
        chooseImage() {
            let flag = this.inRangeOnly && !this.inRange //限制不能外勤打卡且不再考勤圈内
            if (flag) {
                this.$toast('不支持异地打卡')
                return false
            }
            if (this.addressmsg !== '定位中...') {
                this.$utils.chooseImage({
                    cameraOnly: true,
                    upload: true,
                    uploadFileName: this.projectId,
                    tableName: 'dailySalary',
                    tableCloumn: '日日薪考勤照片'
                }, (res) => {
                    this.dutyPic = res.attach.path
                    this.addDutyRecord()
                })
            } else {
                this.$toast('定位中，请稍等')
            }
        },
        addDutyRecord() { //打卡记录请求
            let duty
            this.onDuty === true ? duty = 'S' : duty = 'O'
            this.$utils.ajax({
                url: '/sal/day/app/v1/addDutyRecord',
                data: {
                    prjId: this.projectId,
                    empId: window.userInfo.empId,
                    staffId: this.staffId,
                    staffName: this.name,
                    duty: duty,
                    state: this.rangeState,
                    dutyLocation: this.addressmsg,
                    dutyLongitude: this.singlePath.lng,
                    dutyLatitude: this.singlePath.lat,
                    dutyPic: this.dutyPic
                },
                success: (res) => {
                    if (res.httpCode === 200) {
                        this.getDutyRecord()
                        this.$toast('打卡成功')
                    } else {
                        this.$toast('出错了')
                    }
                    this.$indicator.close()
                }
            })
        },
        mapReady({ BMap, map }) {
            this.bMap = { BMap, map }
        }
    }
}
</script>
<style lang="less" scoped>
.sign-wrapeer {
    height: 280px;
    overflow: auto;
}

.sign-button {
    width: 140px;
    height: 140px;
    margin-top: 40px;
    background: -webkit-gradient(linear, left top, left bottom, from(#7b7b7b), to(#303030));
    border-radius: 50%;
    box-shadow: 0 5px 5px #888;
    margin-right: auto;
    margin-left: auto;
    text-align: center;
    position: relative;
    &.illegal {
        background: -webkit-gradient(linear, left top, left bottom, from(#7cffb9), to(#15cc6b));
    }
    i {
        display: block;
        color: rgba(255, 255, 255, .5);
        font-size: 22px;
        height: 50px;
        line-height: 80px;
    }
    h1 {
        font-size: 18px;
        color: #fff;
        font-weight: normal;
        height: 46px;
        line-height: 46px;
    }
    p {
        color: rgba(255, 255, 255, .5);
        height: 46px;
        font-size: 14px;
    }
}

.sign-button.on {
    h1:after {
        content: '上班打卡';
    }
}

.sign-button.off {
    h1:after {
        content: '下班打卡';
    }
}

.location {
    font-size: 12px;
    margin-top: 30px;
    text-align: center;
    &.in-range {
        i:before {
            font-style: normal;
            font-family: 'icomoon';
            content: "\e905";
            background-color: @green;
            color: #fff;
            font-size: 12px;
            border-radius: 50%;
            margin-right: 5px;
            text-align: center;
        }
        span:nth-child(2):before {
            content: "已进入考勤范围：";
        }
    }
    &.out-range {
        i:before {
            font-style: normal;
            font-family: 'icomoon';
            content: "\e906";
            background-color: @red;
            color: #fff;
            font-size: 12px;
            border-radius: 50%;
            margin-right: 5px;
        }
        span:nth-child(2):before {
            content: "未进入考勤范围：";
        }
    }
    span {
        display: inline-block;
        width: 100px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: middle;
        vertical-align: top;
    }
    a {
        color: @supportColor;
    }
}

.sign-list {
    padding-left: 50px;
    position: relative;
    overflow: hidden;
    margin-bottom: 10px;
    .time-line {
        height: 600px;
        width: 2px;
        background-color: @gary;
        position: absolute;
        left: 30px;
        top: 0;
        z-index: 1;
    }
    ul {
        list-style: none;
    }
    li {
        min-height: 60px;
        padding: 5px;
        position: relative;
        &:before {
            display: block;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            font-size: 12px;
            color: @normalFont;
            text-align: center;
            line-height: 18px;
            position: absolute;
            left: -27px;
            z-index: 2;
        }
        &.start:before {
            content: "上";
            background-color: @supportColor;
        }
        &.end:before {
            content: "下";
            background-color: @green;
        }
        div {
            font-size: 16px;
            &:after {
                font-size: 12px;
                border: 1px solid;
                border-radius: 3px;
                padding: 0 3px;
                margin-left: 5px;
            }
        }
        &.normal div:after {
            content: "正常";
            border-color: @mainColor;
            color: @mainColor;
        }
        &.illegal div:after {
            content: "异常";
            border-color: @supportColor;
            color: @supportColor;
        }
        p {
            color: @grayFont;
            font-size: 14px;
            margin-top: 10px;
            i {
                margin-right: 3px;
            }
        }
    }
}

#BaiduMap {
    height: calc(~"100% - 80px");
    width: 100%;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.spiner {
    animation: spin 800ms infinite linear;
}

.relocation-btn {
    position: absolute;
    z-index: 9999;
    left: 10px;
    bottom: 90px;
    background-color: #fff;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    border-radius: 30px;
    border: 1px solid @gary;
    font-size: 14px;
    span {
        display: inline-block;
        width: 14px;
        height: 14px;
        line-height: 14px;
        text-align: center;
        i {
            color: @supportColor;
        }
    }
}

.location-info {
    height: 80px;
    background-color: @mainColor;
    color: @normalFont;
    width: 100%;
    box-sizing: border-box;
    padding: 10px 15px;
    position: absolute;
    bottom: 0;
    p {
        font-size: 16px;
        margin-top: 5px;
        i {
            font-style: normal;
        }
        span {
            color: @supportColor;
        }
    }
    div {
        display: flex;
        margin-top: 10px;
        margin-bottom: 10px;
        span:nth-child(1) {
            width: 40px;
            text-align: center;
            background-color: #fff;
            color: @mainColor;
            font-size: 12px;
            padding: 2px;
            border-radius: 3px;
            margin-right: 10px;
        }
        span:nth-child(2) {
            padding: 2px 0;
            font-size: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
    &.in-range {
        p {
            i:before {
                content: "在";
            }
        }
        div {
            span:nth-child(1) {
                background-color: @supportColor;
                color: #fff;
                &:before {
                    content: "正常"
                }
            }
        }
    }
    &.out-range {
        p {
            i:before {
                content: "不在";
            }
        }
        div {
            span:nth-child(1) {
                background-color: #fff;
                &:before {
                    content: "外勤"
                }
            }
        }
    }
}
</style>