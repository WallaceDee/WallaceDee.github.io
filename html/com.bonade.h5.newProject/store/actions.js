const actions = {
  incrementAsync(context) {
    setTimeout(() => {
      context.commit('increment')
    }, 1000)
  }

}
export default actions
