import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import test from '../commonComponents/test' 
import redEnvelope from '@/components/redEnvelope'
import greetinCard from '@/components/greetinCard'
import myWelfare from '@/components/myWelfare'
import dateList from '@/components/dateList'
import welfareTip from '@/components/welfareTip'
import dateEdit from '@/components/dateEdit'
import dateCreate from '@/components/dateCreate'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/test',
      name: 'test',
      component: test
    },
    {
      path: '/redEnvelope',
      name: 'redEnvelope',
      component: redEnvelope
    },
    {
      path: '/greetinCard',
      name: 'greetinCard',
      component: greetinCard
    },
    {
      path: '/',
      name: 'myWelfare',
      component: myWelfare
    },
    {
      path: '/dateList',
      name: 'dateList',
      component: dateList
    },
    {
      path: '/welfareTip',
      name: 'welfareTip',
      component: welfareTip
    },
    {
      path: '/dateEdit',
      name: 'dateEdit',
      component: dateEdit
    },
    {
      path: '/dateCreate',
      name: 'dateCreate',
      component: dateCreate
    }

  ]
})
