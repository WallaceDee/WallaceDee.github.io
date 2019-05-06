function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

var reg = /\/((\w|-|\s)+)\.html/ig;
var curr_page = window.location.href.split("?")[0].split("/");
curr_page = curr_page[curr_page.length - 1].replace(".html", "");

var curr_pwd = getCookie("u");
var hasPwd = curr_pwd != null;

var g = getQueryString("g");


if (g === null) {
     g=1;
} 

$.ajax({
    url: '/API/GetLiveInfo.ashx',
    success: function(data) {
        data = JSON.parse(data);
        if (curr_page === "login") {
            if (hasPwd) {
                window.location.href = "index.html?g=" +g;
            }
        } else {
            if (!hasPwd) {
                window.location.href = "login.html?g=" + g;
            }
        }
    }
});