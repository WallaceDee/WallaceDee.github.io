import Vue from 'vue'
import Router from 'vue-router'
import demo from '@/components/demo'
import test from '../commonComponents/test'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: 'demo',
            component: demo
        },
        {
            path: '/test',
            name: 'test',
            component: test
        }
    ]
})