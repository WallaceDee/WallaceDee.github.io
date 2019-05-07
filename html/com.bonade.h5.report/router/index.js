import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import list from '@/components/list'
import write from '@/components/write'
import read from '@/components/read'
import edit from '@/components/edit'
import statis from '@/components/statis'
import test from '../commonComponents/test'
import createTask from '@/components/createTask'
import needStatis from '@/components/needStatis'
import createStatis from '@/components/createStatis'
Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            redirect: {
                name: 'index'
            }
        },
        {
            path: '/index',
            name: 'index',
            component: index
        },
        {
            path: '/list',
            name: 'list',
            component: list
        },
        {
            path: '/write/:formCode',
            name: 'write',
            component: write
        },
        {
            path: '/read',
            name: 'read',
            component: read
        },
        {
            path: '/edit/:formCode/:dataCode',
            name: 'edit',
            component: edit
        },
        {
            path: '/statis',
            name: 'statis',
            component: statis
        },
        {
            path: '/test',
            name: 'test',
            component: test
        },
        {
            path: '/createTask',
            name: 'createTask',
            component: createTask
        },
        {
            path: '/needStatis',
            name: 'needStatis',
            component: needStatis
        },
        {
            path: '/createStatis',
            name: 'createStatis',
            component: createStatis
        }
    ]
})