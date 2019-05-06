function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

function loadBaiduJs() {
    var _hmt = _hmt || [];
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?fd15f24b6c05f00e8655495902649096";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
}
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.returnExports = factory();
    }
}(this, function() {
    var createXHR = function() {
        try {
            return new window.XMLHttpRequest();
        } catch (e) {
            return new window.ActiveXObject("Microsoft.XMLHTTP");
        }
    };
    var ajax = function(config) {
        config.type = (config.type || 'GET').toUpperCase();
        var xhr = createXHR();
        xhr.open(config.type, config.url, true);
        if (config.type === 'POST') {
            xhr.setRequestHeader("Content-Type", config.contentType || "application/x-www-form-urlencoded");
        }
        xhr.send(config.data || null);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                config.onSuccess && config.onSuccess(xhr.responseText);
            }
            if (xhr.readyState === 4 && xhr.status === 404) {
                config.on404 && config.on404(xhr.responseText);
            }
        }
    };
    var object = new Object();
    object.ajax = ajax;
    return object;
}));
var ajax = window.returnExports.ajax;

var reg = /\/((\w|-|\s)+)\.html/ig;
var curr_page = window.location.href.split("#")[0].split("/");
curr_page = curr_page[curr_page.length - 1].replace(".html", "");

var curr_pwd = getCookie("u");
var hasPwd = curr_pwd != null;


ajax({
    url: 'http://live.gu0018.com/API/GetLiveInfo.ashx?id=2',
    onSuccess: function(data) {
        data = JSON.parse(data);
        if (curr_page === "login") {
            if (hasPwd) {
                ajax({
                    type: "post",
                    url: "http://live.gu0018.com/API/Login.ashx?id=2",
                    data: "pwd=" + curr_pwd,
                    onSuccess: function(data) {
                        data = JSON.parse(data);
                        if (data.ret == "ok") {
                      //      window.location.href = "http://live.gu0018.com";
                        }
                    }
                });
            }
        } else {
            if (hasPwd) {
                ajax({
                    type: "post",
                    url: "http://live.gu0018.com/API/Login.ashx?id=2",
                    data: "pwd=" + curr_pwd,
                    onSuccess: function(data) {
                        data = JSON.parse(data);
                        if (data.ret != "ok") {
                       //     window.location.href = "http://live.gu0018.com/login.html";
                        }
                    }
                });
            } else {
             // window.location.href = "http://live.gu0018.com/login.html";
            }
        }
    }
});
