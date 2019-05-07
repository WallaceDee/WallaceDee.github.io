//百度地图ak
const baiduMapAk = 'WwRWeUUKOpxuf4kn34xBtkdyPFPrNRpn'

//浏览器开发配置
//dev,test,beta,product
//环境配置，需要重启
const ENVIRONMENT = 'product'
//登录信息
const user = {
  username: '13202627449',
  password: 'fa447363121'
}

let option
switch (ENVIRONMENT) {
  default: option = { environment: 'dev', domain: 'http://192.168.0.251/api' }
  break
  case 'dev':
      option = { environment: 'dev', domain: 'http://192.168.0.251/api' }
    break
  case 'test':
      option = { environment: 'test', domain: 'https://gs.bndxqc.com/api' }
    break
  case 'beta':
      option = { environment: 'beta', domain: 'https://beta.bndxqc.com/api' }
    break
  case 'product':
      option = { environment: 'product', domain: 'https://html.bndxqc.com/api' }
    break
}
const proxyTable = {
  '/loginByPassword': {
    target: option.domain,
    changeOrigin: true,
    pathRewrite: {
      '^/loginByPassword': '/system/serviceuser/basic/app/v2/nolog/loginByPassword'
    }
  },
  '/getUserInfoForAppLogin': {
    target: option.domain,
    changeOrigin: true,
    pathRewrite: {
      '^/getUserInfoForAppLogin': '/system/serviceuser/search/app/v2/query/getUserInfoForAppLogin'
    }
  },
  //开发调试中，过滤个别业务含有指定关键字的请求指向特定服务器
  //该配置只[在../utils/publicUtils.js?24](baseURL: domain,)注释后才生效
  '/report': {
    target: 'http://192.168.0.30:8104',
    changeOrigin: true,
    pathRewrite: {
      '^/report': '/report'
    }
  }
}
const location = {
  msg: '定位成功',
  status: '1',
  data: {
    lat: '22.817819',
    lng: '113.338182'
  }
}
const vConsoleTrigger = false
module.exports = { baiduMapAk, vConsoleTrigger, domain: option.domain, location, user, option, proxyTable }
