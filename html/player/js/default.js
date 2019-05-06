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

function checkStream() {
    console.info("check_stream");
    ajax({
        url: 'http://z.gu0018.com/AppName/StreamName.m3u8?auth_key=1503821391-0-0-a2b64cee3a9f770b30ea87e50a52e981',
        on404: function(data) {
            console.warn(data);
        },
        onSuccess: function(data) {
            location.reload();
        }
    });
}

function loadBaiduJs() {
    var _hmt = _hmt || [];
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?fd15f24b6c05f00e8655495902649096";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
}

function loginOnLoad() {
    document.getElementById("btn").addEventListener("click", function() {
        var tips = document.getElementById("tips");
        tips.className = "error-tips";
        var password = document.getElementById("pwd").value;
        if (password == "") {
            tips.className = "error-tips enterPwd";
        } else {
            ajax({
                type: "post",
                data: "pwd=" + password,
                url: "http://live.gu0018.com/API/Login.ashx",
                onSuccess: function(data) {
                    data = JSON.parse(data);
                    if (data.ret == "ok") {
                     //   window.location.href = "http://live.gu0018.com";
                    } else {
                        tips.className = "error-tips wrongPwd";
                    }
                }
            });
        }
    }, false);
    loadBaiduJs();
}

function indexOnLoad() {
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
        // var check_live = setInterval(checkStream, 30000);
    });
    videojs("video").ready(function() {
        this.play();
    });
    var link_list = document.getElementById("tab-link-list").querySelectorAll("li");
    for (var i = 0; i < link_list.length; i++) {
        link_list[i].addEventListener("click", function() {
            for (var i = 0; i < link_list.length; i++) {
                link_list[i].className = "";
            }
            this.className = "active";
            var target = this.getElementsByTagName("a")[0].getAttribute("data-href").replace("#", "");
            var tl_removeClass = document.getElementById("tabs-list").childNodes;
            for (var i = 0; i < tl_removeClass.length; i++) {
                tl_removeClass[i].className = "";
            }
            document.getElementById(target).className = "active";
        }, false);
        link_list[i].addEventListener("touchend ", function() {
            for (var i = 0; i < link_list.length; i++) {
                link_list[i].className = "";
            }
            this.className = "active";
            var target = this.getElementsByTagName("a")[0].getAttribute("data-href").replace("#", "");
            var tl_removeClass = document.getElementById("tabs-list").childNodes;
            for (var i = 0; i < tl_removeClass.length; i++) {
                tl_removeClass[i].className = "";
            }
            document.getElementById(target).className = "active";
        }, false);
    }
    loadBaiduJs();
};