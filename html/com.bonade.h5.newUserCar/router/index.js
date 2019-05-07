import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import userCarTab from '@/components/userCarTab'
import travel from '@/components/travel'
import approveTravel from '@/components/approveTravel'
import useCar from '@/components/useCar'
import travelDetail from '@/components/travelDetail'
import approvaInfo from '@/components/approvaInfo'
import travelTrack from '@/components/travelTrack'
import approveDepart from '@/components/approveDepart'
import selectCar from '@/components/selectCar'
import approvaDetail from '@/components/approvaDetail'
import site from '@/components/site'
import carManage from '@/components/carManage'
import driverCertification from '@/components/driverCertification'
import driverqualifications from '@/components/driverqualifications'
import repeatTravel from '@/components/repeatTravel'
import repeatTravelDetal from '@/components/repeatTravelDetal'
import repeatTravelApply from '@/components/repeatTravelApply'
import demo from '@/components/demo'
import test from '../commonComponents/test'

Vue.use(Router)

export default new Router({
    routes: [
        //用车-首页
        {
            path: '/',
            name: 'index',
            component: index,
            beforeEnter: (to, from, next) => {
                // console.log('1'+JSON.stringify(to));
                // console.log('2'+JSON.stringify(from));
                if (localStorage.getItem('isJoinIndex')) {
                    return next({ path: '/userCarTab/travels' })
                }
                next()
            }
        },
        // tab公共
        {
            path: '/userCarTab',
            name: 'userCarTab',
            component: userCarTab,
            children: [{
                    // 当 /user/:id/profile 匹配成功，
                    // UserProfile 会被渲染在 User 的 <router-view> 中
                    //立即出发
                    path: 'travel',
                    name: 'travel',
                    component: travel
                },
                {
                    // 当 /user/:id/posts 匹配成功
                    // UserPosts 会被渲染在 User 的 <router-view> 中
                    //审批出行
                    path: 'approveTravel',
                    name: 'approveTravel',
                    component: approveTravel
                }
            ]
        },
        //用车-用车
        {
            path: '/useCar',
            name: 'useCar',
            component: useCar
        },
        // 用车-行程明细
        {
            path: '/travelDetail/:routeId',
            name: 'travelDetail',
            component: travelDetail
        },
        // 用车-行程轨迹
        {
            path: '/travelTrack',
            name: 'travelTrack',
            component: travelTrack
        },
        // 用车-审批出行
        {
            path: '/approveDepart',
            name: 'approveDepart',
            component: approveDepart
        },
        // 用车-选择车辆
        {
            path: '/selectCar',
            name: 'selectCar',
            component: selectCar
        },
        //用车-审批信息
        {
            path: '/approvaInfo',
            name: 'approvaInfo',
            component: approvaInfo
        },
        // 用车-审批详情
        {
            path: '/approvaDetail',
            name: 'approvaDetail',
            component: approvaDetail
        },
        //用车-私车管理
        {
            path: '/carManage',
            name: 'carManage',
            component: carManage
        },
        //用车-地址搜索
        {
            path: '/site',
            name: 'site',
            component: site
        },
        //用车-司机认证
        {
            path: '/driverCertification',
            name: 'driverCertification',
            component: driverCertification
        },
        //用车-司机认证详情页
        {
            path: '/driverqualifications',
            name: 'driverqualifications',
            component: driverqualifications
        },
        //用车-重复行程
        {
            path: '/repeatTravel',
            name: 'repeatTravel',
            component: repeatTravel
        },
        //用车-行程详情（重复）
        {
            path: '/repeatTravelDetal/:repeatrouteId',
            name: 'repeatTravelDetal',
            component: repeatTravelDetal
        },
        //用车-重复详情申请
        {
            path: '/repeatTravelApply/:routeId',
            name: 'repeatTravelApply',
            component: repeatTravelApply
        },
        {
            path: '/demo',
            name: 'demo',
            component: demo
        },
        {
            path: '/test',
            name: 'test',
            component: test
        },
        /*如果以上都匹配不成功则重定为travel*/
        {
            path: '/*',
            redirect: '/userCarTab/travel'
        }
    ]
})