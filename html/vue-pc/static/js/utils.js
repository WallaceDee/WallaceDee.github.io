'use strict';
var $loading = window.$loading || window.parent.$loading || { finish: function() {}, start: function() {}, error: function() {} };
var $message = window.$message || window.parent.$message || { info: function(msg) { alert(JSON.stringify(msg)); }, success: function(msg) { alert(JSON.stringify(msg)); }, warning: function(msg) { alert(JSON.stringify(msg)); }, error: function(msg) { alert(JSON.stringify(msg)); } };
var $notice = window.$notice || window.parent.$notice || $message;

var utils = {
    getParameter: function(key) {
        var url = window.location.href;
        var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)');
        if (!url.split('?')[1]) { return null }
        var result = null;
        for (var i = 0; i < url.split('?').length; i++) {
            result = url.split('?')[i].match(reg);
            if (result !== null) { break }
        }
        return result ? decodeURIComponent(result[2]) : null;
    },
    onload: function() {
        $loading.finish();
    },
    qs: function(data) {
        var params = [];
        for (var i in data) {
            params.push(i + '=' + data[i]);
        }
        return params.join('&');
    },
    getButtons: function() {
        if (window.frameElement) {
            return JSON.parse(window.frameElement.getAttribute('data-buttons'))
        } else {
            return []
        }
    },
    ajax: function(option) {
        var myInterceptor;
        var defaultOption = {
            token: true,
            baseURL: DOMAIN,
            loading: true,
            url: '',
            data: '',
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
                console.log(res);
            },
            error: function(err) {
                if (err.response) {
                    window.$notice.error({ title: '错误', desc: (err.response.data || { msg: '操作失败！' }).msg })
                }
                console.error(err);
            },
            validateStatus: function(status) {
                return status >= 200 && status < 300 && status !== 207 // 默认的
            }
        }
        var opt = _.extend(defaultOption, option);
        opt.headers['CHANNEL'] = 'BROWSER';
        if (opt.method === 'get' && opt.data) {
            opt.url = opt.url + '?' + this.qs(opt.data)
        } else {
            if (opt.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
                opt.data = this.qs(opt.data);
            }
        }
        if (opt.token) {
            var token = IS_PLATFORM ? Cookies('PLATFORM_ACCESS_TOKEN') : Cookies('ACCESS_TOKEN');
            if (token) {
                opt.headers.ACCESS_TOKEN = IS_PLATFORM ? Cookies('PLATFORM_ACCESS_TOKEN') : Cookies('ACCESS_TOKEN');
            } else {
                $loading.error();
                opt.error(new Error('没有token信息'));
                return false;
            }
        }
        var _successCallBack = function(res) {
            $loading.finish();
            opt.success(res);
        }
        var _errorCallBack = function(err) {
            $loading.error();
            if (err.response) {
                var httpCode = err.response.status;
                switch (httpCode) {
                    case 207:
                        $notice.warning({
                            title: '警告',
                            desc: '你手速太快了！'
                        });
                        break;
                    case 403:
                        $notice.error({
                            title: '错误',
                            desc: '没有权限访问'
                        });
                        break;
                    case 498:
                    case 499:
                        $notice.error({
                            title: '错误',
                            desc: '登录信息过期，2秒之后跳转登录页面。'
                        })
                        setTimeout(function() {
                            try {
                                window.parent.location.href = ASSETS_PUBLIC_PATH + '/login.html';
                            } catch (err) {
                                window.location.href = ASSETS_PUBLIC_PATH + '/login.html';
                            }
                        }, 2000);
                        break;
                }
                opt.error(err);
            } else {
                console.error(err);
            }
        }
        var instance = axios.create();
        if (opt.loading) {
            myInterceptor = instance.interceptors.request.use(function(config) {
                $loading.start();
                return config;
            })
        }
        instance(opt).then(function(res) {
            _successCallBack(res.data);
            if (opt.loading) {
                instance.interceptors.request.eject(myInterceptor);
            }
        }).catch(function(err) { _errorCallBack(err) });
    },
    getUserInfo: function() { //只有首页，或没有嵌套的子页面会进入
        var token = IS_PLATFORM ? Cookies('PLATFORM_ACCESS_TOKEN') : Cookies('ACCESS_TOKEN');
        var xhr = null;
        if (token) {
            xhr = new XMLHttpRequest();
            xhr.open('post', DOMAIN + '/usercenter/search/app/v1/query/getUserInfoAfterLogin', false); //false:同步请求
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
            xhr.setRequestHeader('ACCESS_TOKEN', token);
            xhr.setRequestHeader('CHANNEL', 'BROWSER');
            var us = IS_PLATFORM ? Cookies('isPlatformAdmin') : Cookies('isAdmin');
            xhr.send('useScena=' + (us === '1' ? 'platFormCenter' : USE_SCENA));
            //
            if (!IS_PLATFORM) {
                var xhr1 = new XMLHttpRequest();
                xhr1.open('post', DOMAIN + '/companycenter/comCompany/pc/v1/queryCurrentCompany', false); //false:同步请求
                xhr1.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
                xhr1.setRequestHeader('ACCESS_TOKEN', token);
                xhr1.setRequestHeader('CHANNEL', 'BROWSER');
                xhr1.send();
            }
        }
        if (xhr !== null && xhr.status === 200) {
            var userRawData = JSON.parse(xhr.responseText).data;
            if (!IS_PLATFORM) {
                userRawData.currentCompany = JSON.parse(xhr1.responseText).data;
            }
            return userRawData
        } else if (xhr === null || xhr.status === 499 || xhr.status === 498) {
            //如果是index.html
            // alert('没有检查到token或token过期。');
            if (IS_PLATFORM) {
                Cookies.remove('PLATFORM_ACCESS_TOKEN');
            } else {
                Cookies.remove('ACCESS_TOKEN');
            }
            window.location.href = ASSETS_PUBLIC_PATH + '/login.html';
            return {
                employeeList: [],
                userInfo: {}
            }
        }
    },
    setTopJUICookie: function(employeeList, userInfo, currentCompany) {
        var USERALLINFO = [];
        employeeList.forEach(function(item) {
            USERALLINFO.push({
                companyInfoId: item.companyInfoId,
                id: item.id,
                companyName: item.companyName,
                operateCompanyInfoId: item.operateCompanyInfoId,
                deptName: item.deptName,
                jobName: item.jobName
            });
        });
        var topJUICookies = {
            ACCOUNT: userInfo.account,
            CHOOSE_COMPANY_ID: currentCompany.companyInfoId,
            CHOOSE_OPERATE_COMPANY_ID: currentCompany.operateCompanyInfoId,
            CHOOSE_EMPLOYEE_ID: currentCompany.id,
            COMPANY_NAME: currentCompany.companyName,
            USERALLINFO: JSON.stringify(USERALLINFO),
            USER_ID: userInfo.id,
            USER_NAME: userInfo.name,
            userInfo: JSON.stringify({
                empID: currentCompany.id,
                companyID: currentCompany.companyInfoId,
                companyName: currentCompany.companyName,
                userID: userInfo.id,
                userName: userInfo.name,
                operateCompanyInfoId: currentCompany.operateCompanyInfoId,
                mobile: userInfo.mobile
            })
        }
        for (var item in topJUICookies) {
            Cookies(item, topJUICookies[item]);
        }
    },
    changeSkin: function(pathName) {
        if (document.querySelector('.skin')) {
            var path = document.querySelector('.skin').href;
            var currentSkin = path.match(/theme\/(\S*)\/default.css/)[1];
            if (pathName !== currentSkin) {
                var newPath = path.replace(currentSkin, pathName);
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.href = newPath;
                link.onload = function() {
                    link.classList.add('skin');
                    if (document.querySelectorAll('link.skin').length >= 2) {
                        document.querySelector('.skin').remove();
                    }
                }
                document.head.appendChild(link);
                var pages = document.querySelectorAll('.inner-page');
                for (var i = 0; i < pages.length; i++) {
                    if (pages[i].contentWindow.utils) {
                        pages[i].contentWindow.utils.changeSkin(pathName);
                    }
                }
                Cookies('skin', pathName);
            }
        }
    },
    device: function() {
        var ua = window.navigator.userAgent
        var device = {
            ios: false,
            android: false,
            androidChrome: false,
            desktop: false,
            windows: false,
            iphone: false,
            iphoneX: false,
            ipod: false,
            ipad: false
        }
        var windows = ua.match(/(Windows Phone);?[\s\/]+([\d.]+)?/)
        var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/)
        var ipad = ua.match(/(iPad).*OS\s([\d_]+)/)
        var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/)
        var iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/)
        var iphoneX = iphone && window.screen.width === 375 && window.screen.height === 812
        // Windows
        if (windows) {
            device.os = 'windows'
            device.osVersion = windows[2]
            device.windows = true
        }
        // Android
        if (android && !windows) {
            device.os = 'android'
            device.osVersion = android[2]
            device.android = true
            device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0
        }
        if (ipad || iphone || ipod) {
            device.os = 'ios'
            device.ios = true
        }
        // iOS
        if (iphone && !ipod) {
            device.osVersion = iphone[2].replace(/_/g, '.')
            device.iphone = true
            device.iphoneX = iphoneX
        }
        if (ipad) {
            device.osVersion = ipad[2].replace(/_/g, '.')
            device.ipad = true
        }
        if (ipod) {
            device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null
            device.iphone = true
        }
        // iOS 8+ changed UA
        if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
            if (device.osVersion.split('.')[0] === '10') {
                device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0]
            }
        }
        // Desktop
        device.desktop = !(device.os || device.android)
        // Pixel Ratio
        device.pixelRatio = window.devicePixelRatio || 1
        // Export object
        var classNames = []
        var html = document.querySelector('html')
        if (!html) return
        // Pixel Ratio
        classNames.push('device-pixel-ratio-' + Math.floor(device.pixelRatio))
        if (device.pixelRatio >= 2) {
            classNames.push('device-retina')
        }
        // OS classes
        if (device.os) {
            classNames.push(
                'device-' + device.os,
                'device-' + device.os + '-' + device.osVersion.split('.')[0],
                'device-' + device.os + '-' + device.osVersion.replace(/\./g, '-')
            )
            if (device.os === 'ios') {
                var major = parseInt(device.osVersion.split('.')[0], 10)
                for (var i = major - 1; i >= 6; i -= 1) {
                    classNames.push('device-ios-gt-' + i)
                }
                if (device.iphoneX) {
                    classNames.push('device-iphone-x')
                }
            }
        } else if (device.desktop) {
            classNames.push('device-desktop')
        }
        // Add html classes
        classNames.forEach(function(className) {
            html.classList.add(className)
        })
        window.device = device;
        return device
    },
    tableAutoHeight: function(option) {
        function adjustTableHeight(opt) {
            var childrens = opt.tableElement.parentElement.children;
            var otherHeight = 0;
            setTimeout(function() {
                for (var i = 0; i < childrens.length; i++) {
                    if (childrens[i] === opt.tableElement) {
                        continue;
                    }
                    var finalStyle = childrens[i].currentStyle ? childrens[i].currentStyle : document.defaultView.getComputedStyle(childrens[i], null);
                    var outer = parseInt(finalStyle.paddingBottom) + parseInt(finalStyle.paddingTop) + parseInt(finalStyle.marginTop) + parseInt(finalStyle.marginBottom);
                    otherHeight += childrens[i].offsetHeight + outer;
                }
                var parentStyle = opt.tableElement.parentElement.currentStyle ? opt.tableElement.parentElement.currentStyle : document.defaultView.getComputedStyle(opt.tableElement.parentElement, null);
                var parentOuter = parseInt(parentStyle.paddingBottom) + parseInt(parentStyle.paddingTop) + parseInt(parentStyle.marginTop) + parseInt(parentStyle.marginBottom);
                var tempHeight = opt.tableElement.parentElement.offsetHeight - parentOuter - otherHeight - (opt.table.otherHeight || 0);
                if (opt.minHeight && tempHeight < opt.minHeight) {
                    tempHeight = opt.minHeight
                }
                opt.table.height = tempHeight;
            }, 0);
        }
        setTimeout(function() { adjustTableHeight(option); }, 200);
        window.addEventListener('resize', _.debounce(function() {
            adjustTableHeight(option);
        }, 200));
    }
}
Array.prototype.getName = function(value) {
    let result = _.find(this, function(item) { return item.value === value })
    if (result) {
        return result.name
    } else {
        return ''
    }
}
Array.prototype.hasPermission = function(permissionCode) {
    return _.findIndex(this, { permission: permissionCode }) !== -1
}
//格式化日期
//new Date().format('yyyy-MM-dd hh:mm:ss')
Date.prototype.format = function(fmt) {
    var o = {
        'M+': this.getMonth() + 1,
        'd+': this.getDate(),
        'h+': this.getHours(),
        'm+': this.getMinutes(),
        's+': this.getSeconds(),
        'q+': Math.floor((this.getMonth() + 3) / 3),
        'S': this.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
    }
    return fmt
}

if (Cookies('skin')) {
    utils.changeSkin(Cookies('skin'));
}
utils.device();
Vue.prototype.$utils = utils;
Vue.config.devtools = true;

(function() {
    var excludeList = ['/login.html', '/resetPassword.html'];
    var isInclude = true;
    for (var i = 0; i < excludeList.length; i++) {
        if (window.location.href.indexOf(excludeList[i]) !== -1) {
            isInclude = false;
        }
    }
    if (isInclude) {
        window.userRawData = window.parent.userRawData || utils.getUserInfo();
        userRawData.employeeList = userRawData.employeeList || [];
        var currentCompany = userRawData.currentCompany || {};
        window.userInfo = window.parent.userInfo || {
            userId: userRawData.userInfo.userId || userRawData.userInfo.id,
            username: userRawData.userInfo.name || userRawData.userInfo.account,
            companyId: currentCompany.companyInfoId || currentCompany.companyId,
            companyName: currentCompany.companyName
            // operateCompanyId: currentCompany.operateCompanyInfoId,
            // employeeId: currentCompany.id
        }
        // console.log(currentCompany);
    }
})();