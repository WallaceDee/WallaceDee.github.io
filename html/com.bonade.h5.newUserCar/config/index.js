console.log(process.env.NODE_ENV)
//production,development
// const baseURL=process.env.NODE_ENV === 'production' ? 'http://192.168.0.251/api/' : 'http://192.168.0.251/api/'
//百度地图ak
const baiduMapAk = 'WwRWeUUKOpxuf4kn34xBtkdyPFPrNRpn'

//浏览器开发配置
const domain = 'http://192.168.0.251/api/'
const accessToken = 'a02d128e-9fa3-44c1-8adb-100ad9435600'
const userInfo = {
  companyId: '6',
  deptId: '91',
  empId: '2149',
  userId: 974,
  username: '吕进宁'
}
const location = {
  msg: '定位成功',
  status: '1',
  data: {
    lat: '22.817819',
    lng: '113.338182'
  }
}
export { baiduMapAk, domain, accessToken, userInfo, location }
