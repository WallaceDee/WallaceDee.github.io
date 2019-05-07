//百度地图ak
const baiduMapAk = 'WwRWeUUKOpxuf4kn34xBtkdyPFPrNRpn'

//浏览器开发配置
//dev,test,beta,product
const ENVIRONMENT = 'test'

const user = {
  username: '13580301423',
  password: '111111'
}

let option
switch (ENVIRONMENT) {
  default: option = {
    environment: 'dev',
    domain: 'http://192.168.0.251/api'
  }
  break
  case 'dev':
      option = {
      environment: 'dev',
      domain: 'http://192.168.0.251/api'
    }
    break
  case 'test':
      option = {
      environment: 'test',
      domain: 'https://gs.bndxqc.com/api'
    }
    break
  case 'beta':
      option = {
      environment: 'beta',
      domain: 'https://beta.bndxqc.com/api'
    }
    break
  case 'product':
      option = {
      environment: 'product',
      domain: 'https://html.bndxqc.com/api'
    }
    break
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
module.exports = { baiduMapAk, vConsoleTrigger, domain: option.domain, location, user, option }
