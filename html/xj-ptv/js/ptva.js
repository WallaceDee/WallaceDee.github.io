var Scanner = {
    scan: function (params, callback, fail) {
        var json = {
            'params': params
        };
        return exec_asyn("Scanner", "scan", JSON.stringify(json), callback,
            fail);
    }
}


// html5应用
var App = {

    /**
     * 监听器
     */
    listener:null,

    /**
     * 获取应用ID
     *
     * @return 当前运行时的HTML5子应用ID
     */
    getAppId: function () {
        return exec_syn("App", "getAppId", null);
    },
    getClientVersion: function () {
        return exec_syn("App", "getClientVersionName", null);
    },

    //获取通讯录
    getContacts : function() {
        return exec_syn("App", "getContacts", null);
    },

    // 获取版本号
    getVersion: function () {
        return exec_syn("App", "getVersion", null);
    },
    // 截断android 返回键事件，用户在按返回键的时候就不会退出html5渲染界面了。
    overrideBackPressed: function (bound) {
        var json = {
            "bound": bound
        }
        return exec_syn("App", "overrideBackPressed", JSON.stringify(json));
    },

    // 退出应用，html5渲染界面关闭
    exitApp: function () {
        return exec_syn("App", "exitApp", null);
    },
    // 设置硬键盘监听，当用户按下返回，菜单，搜索按键的时候，onKeyEvent回调函数会被触发。
    // 事件如上 backpress、menupress、searchpress
    setKeyEventListener: function (listener) {
        window.listener = listener;
    },

    // 按键事件监听。如若setKeyEventListener设置了监听器，则当用户按下返回，菜单，搜索按键的时候，此函数会被触发
    // 事件如上 backpress、menupress、searchpress
    onKeyEvent: function (event) {
        if (typeof window.listener == 'function') {
            window.listener(event);
        }
    },

    // 设置html5应用标题内容。html5应用的标题是由android实现。
    setTitle: function (title) {
        var json = {
            "title": title
        }
        exec_syn("App", "setTitle", JSON.stringify(json));
    },
    
    setTitleColor : function(color) {
        var json = {
            "color" : color
        }
        exec_syn("App", "setTitleColor", JSON.stringify(json));
    },

    // 设置html5应用标题背景颜色。
    setTitleBackgroundColor: function (color) {
        var json = {
            "color": color
        }
        exec_syn("App", "setTitleBackground", JSON.stringify(json));
    },

    // 设置html5应用背景图片。
    setTitleBackgroundPath: function (path) {
        var json = {
            "path": path
        }
        exec_syn("App", "setTitleBackground", JSON.stringify(json));
    },


    /**
     * 设置html5应用右上角图片及事件
     * @param imgUrl    应用图片相对路径  String
     * @param funcStr   回调JS函数字符串   String
     * @param text  文本内容    String
     * @param textAlign     文本位置[left, right, top, bottom]    String
     */
    setTopBarImage: function (imgUrl, funcStr, text, textAlign) {
        var json = {"imageUrl": imgUrl, "callbackJS": funcStr, "text": text, "textAlign": textAlign};
        exec_syn("App", "setTopBarImage", JSON.stringify(json));
    },

    //显示html5应用右上角图片
    showTopBarImage: function () {
        exec_syn("App", "showTopBarImage", "{}");
    },

    //隐藏标题栏图片
    hideTopBarImage: function () {
        exec_syn("App", "hideTopBarImage", "{}");
    },

    getScreen: function () {
        return exec_syn("App", "getScreen", null);
    },
    /**
     * 跳转到原生页面
     *
     * @param viewName -
     *            预定义的页面名称
     * @param args －
     *            bundle参数
     * @param callback -
     *            调用成功返回时调用的函数
     * @param fail －
     *            调用失败时执行的函数
     * @since 1.0.8
     */
    jumpToNativeView: function (viewName, args, callback, fail) {
        if (typeof args == 'undefined')
            args = {};
        var json = args;
        json["viewName"] = viewName;
        exec_asyn("App", "jumpToNativeView", JSON.stringify(json), callback,
            fail);
    },
    /**
     * 设置右上角图标及事件
     * @param path 跳转页面的绝对路径 必须为bestpay目录下 String 例： /bestpay/youxuedai/*.htm
     * @param type 图标类型 String billhistory列表
     * 都为空值时则隐藏右上角图标
     */
    setRightBtnBackground: function (path, type) {
        var json = {
            "path": path || '',
            "type": type || ''
        }
        exec_syn("App", "setRightBtnBackground", JSON.stringify(json));
    },
    /**
    * 隐藏title
    */
    dismissTopbar: function(){
        return exec_syn("App", "dismissTopbar", "{}");
    },
    /**
    * 显示title
    */
    showTopbar: function(){
        exec_syn("App", "showTopbar", "{}");
    },
    /**
     * 显示title
     */
    showBack: function(isShow){
    
        var json = {
            "isShow": isShow || '0'
        }
        exec_syn("App", "showBack", JSON.stringify(json));
    },
    showTabbBar: function(isShow){
        var json = {
        "isShow": isShow || '0'
        }
        exec_syn("App", "showTabbBar", JSON.stringify(json));
    },
    /**
     * 关闭按钮触发事件
     * @param orderNo
     */
    closeH5: function (orderNo) {
        var json = {
            orderNo: orderNo
        };
        exec_syn("App", "closeH5", JSON.stringify(json));
    },

    /**
     * 获取本地图片或调用摄像头
     */
    getImage: function () {
        return exec_syn("App", "getImage", null);
    },
    // 打开摄像头
    takePhoto: function () {
        return exec_syn("App", "takePhoto", null);
    },
    // 打开本地图片
    pickPicture: function () {
        return exec_syn("App", "pickPicture", null);
    },

    //获取城市编码
    getCityCode: function(){
        return exec_syn("App", "getCityCode", null);
    },
    // 获取地位信息
    getLocinformation:function(){
        return exec_syn("App","getLocinformation");
    },

    //获取城市
    getCity:function(){
         return exec_syn("App", "getCity", null);
    }
}

/*
 * native提供uitl。
 */

var util = {

    /*
     * js与Android交互，通过调用该接口实现base64编码。
     *
     * @params {JSON} data {id_no:1;name:'ztm';card:'6225'} @return {JSON}
     * result {id_no:1;name:"enRt";card:"NjIyNQ=="}
     */
    base64Encode: function (jsonobj) {

        if (typeof (jsonobj) == "undefined" || typeof (jsonobj) != "object") {
            return false;
        } else {
            var _resultJson = {};
            var _result = "";
            _result = exec_syn("UtilPlugin", "base64Encode", JSON
                .stringify(jsonobj));
            _resultJson = JSON.parse(_result);
            return _resultJson;
        }
    },
    /*
     * js与Android交互，通过调用该接口实现base64解码。
     *
     * @params {JSON} data {id_no:1;name:"enRt";card:"NjIyNQ=="} @return {JSON}
     * result {id_no:1;name:'ztm';card:'6225'}
     */
    base64Decode: function (jsonobj) {

        if (typeof (jsonobj) == "undefined" || typeof (jsonobj) != "object") {
            return false;
        } else {
            var _resultJson = {};
            var _result = "";
            _result = exec_syn("UtilPlugin", "base64Decode", JSON
                .stringify(jsonobj));
            _resultJson = JSON.parse(_result);
            return _resultJson;
        }
    }

};

// 键值对本地数据存储。
var Preference = {
    // 存储
    put: function (key, value, prefname) {
        console.log("put-key:" + key + " value:" + value + " prefname:"
            + prefname);
        var args = {
            "key": key,
            "value": value,
            "prefname": prefname
        };
        exec_syn("Preference", "put", JSON.stringify(args));
    },
    // 取值
    get: function (key, defValue, prefname) {
        console.log("get-key:" + key + " defValue:" + defValue + " prefname:"
            + prefname);
        var args = {
            "key": key,
            "defValue": defValue,
            "prefname": prefname
        };
        return exec_syn("Preference", "get", JSON.stringify(args));
    },
    // 存值，指定SP文件的名称 By Cloudy 2013/11/20
    putWithApp: function (key, value, spname) {
        this.put(key, value, spname);
    },
    // 取值， 指定SP文件的名称 By Cloudy 2013/11/20
    getWithApp: function (key, defValue, spname) {
        return this.get(key, defValue, spname);
    }
}


// android风格Dialog
var Dialog = {
    // 弹出等待对话框
    // title:对话框标题
    // msg:对话框内容
    // return : 动态分配的id，供取消等待
    showWaitDialog: function (title, msg) {
        var json = {
            'title': title,
            'msg': msg
        };
        return exec_syn("Dialog", "showWaitDialog", JSON.stringify(json));
    },

    // 消失对话框
    // id: showDialog调用后返回的id。
    dismissDialog: function (id) {
        var json = {
            'id': id
        };
        return exec_syn("Dialog", "dismissDialog", JSON.stringify(json));
    },
    // 弹出等待对话框
    // title:对话框标题
    // msg:对话框内容
    // return : 动态分配的id，供取消等待
    showProgressDialog: function (title, msg) {
        var json = {
            'title': title,
            'msg': msg
        };
        return exec_syn("Dialog", "showProgressDialog", JSON.stringify(json));
    },
    alert: function (msg) {
        window.alert(msg);
    }
}
// Toast提示。功能如同android Toast
var Toast = {
    LENGTH_LONG: 1,
    LENGTH_SHORT: 0,
    /*
     *
     * @params {String} text the text to make toast. @params {Int} duration
     * LENGTH_SHORT:short,LENGTH_LONG:long
     *
     */
    makeText: function (text, duration) {
        var json = {
            "text": text,
            "duration": duration
        }
        exec_syn("Toast", "makeText", JSON.stringify(json));
    }
}

// 联系人
var Contacts = {
    // 打开联系人
    openContacts: function (success, fail) {
        exec_asyn("Contacts", "openContacts", '{}', success, fail);
    },
    // 打电话
    tel: function (tel) {
        var json = {

            'tel': tel
        }
        return exec_syn("Contacts", "call", JSON.stringify(json));
    }
}

/**
 * HTML5与Android异步交互
 *
 */
var BestpayHtml5 = {
    idCounter: 0, // 参数序列计数器
    INPUT_CMDS: "", // 入参服务与命令名
    INPUT_ARGS: "", // 入参的参数
    OUTPUT_RESULTS: "", // 输出的结果

    // 输出的结果成功时调用的方法
    CALLBACK_SUCCESS: function (result) {
        // stub
        console.log(result);
        return;
    },
    // 输出的结果失败时调用的方法
    CALLBACK_FAIL: function (result) {
        // stub
        console.log(result);
        return;
    },
    /*
     * exec_asyn调用的方法 @params {JSONObject} cmd 服务名和动作命令 @params {String} args 参数
     */
    callNative: function (cmd, args) {
        this.INPUT_CMDS = cmd;
        this.INPUT_ARGS = args;
        var key = "ID_" + (++this.idCounter);
        window.nintf.setCmds(this.getInputCmd(), key);
        window.nintf.setArgs(this.getInputArgs(), key);
        var iframe = document.createElement("IFRAME");
        iframe.setAttribute("src", "bestpayhtml://ready?id=" + key);
        document.documentElement.appendChild(iframe);
        iframe.parentNode.removeChild(iframe);
        iframe = null;

        console.log(2);
        console.log("return this.OUTPUT_RESULTS:" + this.OUTPUT_RESULTS);
        return this.OUTPUT_RESULTS;
    },
    getInputCmd: function () {
        // alert("c=="+JSON.stringify(INPUT_CMDS));
        return JSON.stringify(this.INPUT_CMDS);
    },
    getInputArgs: function () {
        // alert("p=="+(INPUT_ARGS));
        return this.INPUT_ARGS;
    },

    callBackJs: function (result) {
        // alert("BACK:"+result);
        this.OUTPUT_RESULTS = result;
        console.log(1);
        var obj = JSON.parse(result);
        var message = obj.message;
        console.log("message:" + message);
        var status = obj.status;
        if (status == 0) {
            if (typeof this.CALLBACK_SUCCESS != "undefined")
                setTimeout("BestpayHtml5.CALLBACK_SUCCESS('" + message + "')",
                    0);
        } else {
            if (typeof this.CALLBACK_FAIL != "undefined")
                setTimeout("BestpayHtml5.CALLBACK_FAIL('" + message + "')", 0);
        }
        console.log("你先:" + "(" + (BestpayHtml5.idCounter) + ")" + result);
    }
};


var exec_syn = function (service, action, args) {
    var json = {
        "service": service,
        "action": action
    };

    var result_str = prompt(JSON.stringify(json), args);
    var result, status, message;
    try {
        result = JSON.parse(result_str);
    } catch (e) {
        console.error(e.message);
    }
    if (result) {
        status = result.status;
        message = result.message;
    }
    if (status == 0) {

        return message;
    } else {

        console.error("service:" + service + " action:" + action + " error:"
            + message);

    }
}
// Webserver 端口
var port;

/*
 * Html5与Android异步交互接口
 * 
 * @params {String} service The name of the service to use @params {String}
 * action Action to be run in proxy @params {JSON} args Arguments to pass to the
 * method,it's maybe null if the method doesn't need arguments @params
 * {Function} success The success callback @params {Function} fail The fail
 * callback
 */
var exec_asyn = function (service, action, args, success, fail) {
    var json = {
        "service": service,
        "action": action
    };

    if (typeof fail != 'success')
        BestpayHtml5.CALLBACK_SUCCESS = success;
    if (typeof fail != 'undefined') {
        BestpayHtml5.CALLBACK_FAIL = fail;
    } else {
        BestpayHtml5.CALLBACK_FAIL = function () {
        };// add by ztm 2014/4/17 cause by 全局函数引起的问题
    }

    var result = BestpayHtml5.callNative(json, args);

    console.log("我先:" + "(" + (BestpayHtml5.idCounter) + ")" + result);
}
