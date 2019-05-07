import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import scan from '@/components/scan'
import card from '@/components/card'
import memberInfo from '@/components/memberInfo'
import projectList from '@/components/projectList'
import project from '@/components/project'
import salary from '@/components/salary'
import salaryList from '@/components/salaryList'
import salaryDetail from '@/components/salaryDetail'
import sign from '@/components/sign'
import deliver from '@/components/deliver'
import test from '../commonComponents/test'
//const deliver = () => import('@/components/deliver')
Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/scan/:projectId',
      name: 'scan',
      component: scan
    },
    {
      path: '/card/:id/:name/:account/:bankName/:projectId',
      name: 'card',
      component: card
    },
    {
      path: '/memberInfo',
      name: 'memberInfo',
      component: memberInfo
    },
    {
      path: '/projectList',
      name: 'projectList',
      component: projectList
    },
    {
      path: '/project/:projectId/:projectName',
      name: 'project',
      component: project
    },
    {
      path: '/salary/:projectId',
      name: 'salary',
      component: salary
    },
    {
      path: '/salaryList/:salaryId',
      name: 'salaryList',
      component: salaryList
    },
    {
      path: '/salaryDetail/:detailId',
      name: 'salaryDetail',
      component: salaryDetail
    },
    {
      path: '/sign/:staffId/:name/:idNo/:projectId',
      name: 'sign',
      component: sign
    },
    {
      path: '/deliver/:salaryId',
      name: 'deliver',
      component: deliver
    },
    {
      path: '/test',
      name: 'test',
      component: test
    }
  ]
})
