if (typeof(videojs) != "undefined") {
    videojs.addLanguage("zh-CN", {
        "Play": "播放",
        "Pause": "暂停",
        "Current Time": "当前时间",
        "Duration Time": "时长",
        "Remaining Time": "剩余时间",
        "Stream Type": "媒体流类型",
        "LIVE": "直播",
        "Loaded": "加载完毕",
        "Progress": "进度",
        "Fullscreen": "全屏",
        "Non-Fullscreen": "退出全屏",
        "Mute": "静音",
        "Unmute": "取消静音",
        "Playback Rate": "播放速度",
        "Subtitles": "字幕",
        "subtitles off": "关闭字幕",
        "Captions": "内嵌字幕",
        "captions off": "关闭内嵌字幕",
        "Chapters": "节目段落",
        "Close Modal Dialog": "关闭弹窗",
        "Descriptions": "描述",
        "descriptions off": "关闭描述",
        "Audio Track": "音轨",
        "You aborted the media playback": "视频播放被终止",
        "A network error caused the media download to fail part-way.": "网络错误导致视频下载中途失败。",
        "The media could not be loaded, either because the server or network failed or because the format is not supported.": "视频因格式不支持或者服务器或网络的问题无法加载。",
        "The media playback was aborted due to a corruption problem or because the media used features your browser did not support.": "由于视频文件损坏或是该视频使用了你的浏览器不支持的功能，播放终止。",
        "No compatible source was found for this media.": "无法找到此视频兼容的源。",
        "The media is encrypted and we do not have the keys to decrypt it.": "视频已加密，无法解密。",
        "Play Video": "播放视频",
        "Close": "关闭",
        "Modal Window": "弹窗",
        "This is a modal window": "这是一个弹窗",
        "This modal can be closed by pressing the Escape key or activating the close button.": "可以按ESC按键或启用关闭按钮来关闭此弹窗。",
        ", opens captions settings dialog": ", 开启标题设置弹窗",
        ", opens subtitles settings dialog": ", 开启字幕设置弹窗",
        ", opens descriptions settings dialog": ", 开启描述设置弹窗",
        ", selected": ", 选择"
    });
}

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


var temp_height = document.documentElement.clientHeight - $(".header").outerHeight(true);
$(".main").css("height", temp_height);


$.ajax({
	url:"/API/GetLiveConfig.ashx",
	dataType:"json",
	async:false,
	success:function(data){
		var temp=""
		for(var i=0;i<data.length;i++){
			var type=data[i].Settingkey==="m3u8"?"application/x-mpegURL":"video/x-flv";
			temp+='<source src="'+data[i].SettingValue+'" type="'+type+'">';
		}
		$("#video").html(temp);
	}
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
window.player.on("error", function(a) {
    document.getElementById("video-wrapper").remove();
});
videojs("video").ready(function() {
    this.play();
});


$(document).on("click", "input", function() {
    setTimeout(function() {
        $(document).scrollTop(99999);
    }, 500);

});

$(".guide a").click(function() {
    $(".guide>a").removeClass("active");
    $(this).addClass("active");
    var show_target = $(".content .section").eq($(this).index());
    $(".content .section").removeClass("active");
    show_target.addClass("active");
});