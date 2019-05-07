import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'
import test from './modules/test'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const state = {
  count: 0,
  pageDirection: 'fade',
  routeChain: [],
  userInfo:{}
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {
    test
  },
  strict: debug
})
