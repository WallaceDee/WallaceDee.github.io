import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import amount from '@/components/amount'
import amountDetail from '@/components/amountDetail'
import allAmount from '@/components/allAmount'
import totalQuotaTrend from '@/components/totalQuotaTrend'
import classificationQuotas from '@/components/classificationQuotas'
import classifyDetail from '@/components/classifyDetail'
import salaryTable from '@/components/salaryTable'
import classTable from '@/components/classTable'
Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: 'index',
            component: index
        },
        {
            path: '/index',
            name: 'index',
            component: index
        },
        {
            path: '/amount',
            name: 'amount',
            component: amount
        },
        {
            path: '/amountDetail',
            name: 'amountDetail',
            component: amountDetail,
            children: [{
                //额度总览
                path: 'allAmount',
                name: 'allAmount',
                component: allAmount
            },
            {
                //总额度趋势
                path: 'totalQuotaTrend',
                name: 'totalQuotaTrend',
                component: totalQuotaTrend
            },
            {
                //分类额度趋势
                path: 'classificationQuotas',
                name: 'classificationQuotas',
                component: classificationQuotas
            }
        ]
        },
        {
            path: '/classifyDetail',
            name: 'classifyDetail',
            component: classifyDetail
        },
        {
            path: '/salaryTable',
            name: 'salaryTable',
            component: salaryTable
        },
        {
            path: '/classTable',
            name: 'classTable',
            component: classTable
        },
        /*如果以上都匹配不成功则重定为index*/
        {
            path: '/*',
            redirect: '/index'
        }
    ]
})