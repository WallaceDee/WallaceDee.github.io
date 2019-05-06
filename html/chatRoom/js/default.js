//root font-size
(function (doc, win) {
	"use strict";
	var docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function () {
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


var temp_height = document.documentElement.clientHeight - $(".header").outerHeight(true);
$(".main").css("height", temp_height);




var username = "神秘人";
if (localStorage.getItem("username") === null) {
	username = "游客" + parseInt(Math.random() * 10000);
	localStorage.setItem("username", username);
} else {
	username = localStorage.getItem("username");
}

// 声明一个代理引用该集线器,记得$.connection.后面的方法首字母必须要小写,这也是我为什么使用别名的原因
var chat = $.connection.myHub;
// 这里是注册集线器调用的方法,和1.0不同的是需要chat.client后注册,1.0则不需要
chat.client.BroadMsg = function (rawMsg) {
	var msg_data = JSON.parse(rawMsg.split("内容：")[1]);
	console.log(msg_data);
	if (msg_data.name === username) {
		msg_data.name = "我";
		return false;
	}
		if ($(".msg-box ul li").length > 200) {
			$(".msg-box ul li").eq(0).remove();
		}
		$(".msg-box ul").append("<li><span>" + msg_data.name + "</span>" +AnalyticEmotion(msg_data.msg)  + "</li>");
		var h = $(".msg-box ul").height();
		$(".msg-box").scrollTop(h);
};

// 启动连接,这里和1.0也有区别
$.connection.hub.start().done(function () {


});



function getRandomNum(Min, Max) {
	var Range = Max - Min;
	var Rand = Math.random();
	return (Min + Math.round(Rand * Range));
}

(function cheat(plusSection, subSection, max, $ele) {
	var add = setInterval(function () {
		if (Math.random() > 0.4) {
			plus = getRandomNum(0, plusSection);
		} else {
			plus = -getRandomNum(0, subSection);
		}
		var r = Number($ele.html()) + plus;
		if (r > 0) {
			$ele.html(r);
		} else if (r > max) {
			clearInterval(add)
		}
	}, 1000);
})(20, 10, 1000, $(".count span"));

$("#face-btn").click(function (event) {
	$(".emoji-wrapper").toggleClass("hide");
});



var device = {};
var ua = navigator.userAgent;
var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
device.ios = device.android = device.iphone = device.ipad = false;
// Android
if (android) {
	device.android = true;
}
if (ipad || iphone) {
	device.ios = true;
}
device.isWeixin = /MicroMessenger/i.test(ua);
document.getElementById("video").style.display = "block";
if (!device.android && !device.ios && device.isWeixin) {
	window.player = videojs("video", {
		language: "zh-CN",
		techOrder: ["flash"]
	});
} else {
	window.player = videojs("video", {
		language: "zh-CN",
		techOrder: ["html5", "flash"],
		children: ["mediaLoader", "loadingSpinner", "bigPlayButton", "controlBar"],
		controlBar: {
			children: ["playToggle", "progressControl", "liveDisplay", "fullscreenToggle"]
		}
	});
}
window.player.on("error", function (a) {
	document.getElementById("video-wrapper").remove();

});
    videojs("video").ready(function() {
        this.play();
    });


$(document).on("click", "input", function () {
	setTimeout(function () {
		$(document).scrollTop(99999);
	}, 500);

});



$(".guide a").click(function () {
	$(".guide>a").removeClass("active");
	$(this).addClass("active");
	var show_target = $(".content .section").eq($(this).index());
	$(".content .section").removeClass("active");
	show_target.addClass("active");
});
