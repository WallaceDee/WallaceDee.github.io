// (function() {
var isWeixin = /MicroMessenger/i.test(navigator.userAgent);
//root font-size
(function(doc, win) {
    "use strict";
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {
            var clientWidth = docEl.clientWidth;
            var htmlFontSize = 20;
            var designWidth = 375;
            if (!clientWidth) return;
            docEl.style.fontSize = htmlFontSize * (clientWidth / designWidth) + 'px';
            var reality = Number(docEl.style.fontSize.substr(0, docEl.style.fontSize.length - 2));
            var theory = htmlFontSize * (clientWidth / designWidth);
            if (reality != theory) {
                docEl.style.fontSize = htmlFontSize * theory / reality * (clientWidth / designWidth) + 'px';
            }
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

function setCookie(name, value) {
    var Days = 999;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
// })();

// 监听页面加载处理
window.addEventListener('load', onloadHandler, false);

function onloadHandler() {
    var canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var k3dmain = new K3D.Controller(canvas, true);
    var ctx = canvas.getContext('2d');
    var rotationOffset = 0;
    var len = (canvas.height > canvas.width ? canvas.height : canvas.width) * 0.7;
    k3dmain.clearBackground = false;
    k3dmain.callback = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rotationOffset);
        var RAYCOUNT = 24;
        ctx.fillStyle = "#fdd971";
        ctx.beginPath();
        for (var i = 0; i < RAYCOUNT; i++) {
            ctx.rotate(TWOPI / RAYCOUNT);
            ctx.moveTo(0, 0);
            ctx.lineTo(-20, len);
            ctx.lineTo(20, len);
        }
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#fdd971";
        ctx.beginPath();
        for (var i = 0; i < RAYCOUNT; i++) {
            ctx.rotate(TWOPI / RAYCOUNT);
            ctx.moveTo(0, 0);
            ctx.lineTo(-15, len);
            ctx.lineTo(15, len);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        rotationOffset += 0.005;
        for (var i = 0, objs = k3dmain.objects; i < objs.length; i++) {
            objs[i].ophi += targetRotationX;
        }

        if (targetRotationX > -0.5) targetRotationX -= 0.05;
        else if (targetRotationX < -0.55) targetRotationX += 0.05;
        if (targetRotationX > -0.55 && targetRotationX < -0.5) targetRotationX = -0.5;
    };
    k3dmain.paused = true;
    setInterval(function() { k3dmain.tick() }, 1000 / 60);
}
var targetRotationX = 0;

jQuery(document).ready(function($) {
    $(".go-btn").click(function(event) {
        if (getCookie("money") !== null) {
            var r_m = getCookie("money");
        } else {
            var r_m = getRank();
            setCookie("money", r_m);
        }
        $(".money").html(r_m);
        $(".popup").removeClass('hide');
    });
    $(".go-back").click(function(event) {
        $(".popup").addClass('hide');
    });
    if (getCookie("money") !== null) {
        var r_m = getCookie("money");
        $(".money").html(r_m);
        $(".popup").removeClass('hide');
    }
});
var award_list = [800, 600, 500, 300];
var odds = [0.15, 0.45, 0.7, 1];

function getRank() {
    var r = Math.random();
    var result = 0;
    if (r <= odds[0]) {
        result = award_list[0];
    } else if (odds[0] < r && r <= odds[1]) {
        result = award_list[1];
    } else if (odds[1] < r && r <= odds[2]) {
        result = award_list[2];
    } else if (odds[2] < r && r <= odds[3]) {
        result = award_list[3];
    }
    console.log(result);
    return result;
}

function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}