const mutations = {
  addRouteChain(state, route) {
    state.routeChain.push(route)
  },
  popRouteChain(state) {
    state.routeChain.pop()
  },
  setPageDirection(state, dir) {
    state.pageDirection = dir
  },
  setUserInfo(state, obj) {
    state.userInfo = obj
  },

  //test demo
  increment(state, payload) {
    // 变更状态
    console.log('参数：', payload)
    state.count++
  },
  reduce(state, payload) {
    console.log('参数：', payload)
    state.count--
  },
  chooseCarNumber(state, CarNumber) {
    state.carNumber = CarNumber
  }
}
export default mutations
