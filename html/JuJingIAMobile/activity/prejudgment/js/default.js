(function() {
    "use strict";
    var mySwiper = new Swiper('.swiper-container');

    function checkStockLocation(code) {
        if (code.length === 6) {
            var preCode = code.substring(0, 3);
            var preStr = "";
            var sz_list = ["300", "000", "002", "200", "080", "031"];
            var sh_list = ["600", "601", "603", "900", "730", "700", "580"];
            for (var i = 0; i < sz_list.length; i++) {
                if (preCode === sz_list[i]) {
                    preStr = "sz";
                    break;
                }
            }
            if (preStr !== "sz") {
                for (var j = 0; j < sh_list.length; j++) {
                    if (preCode === sh_list[j]) {
                        preStr = "sh";
                        break;
                    }
                }
            }
            if (preStr !== "") {
                return preStr + code;
            }
        }
        return null;
    }

    function showErrorPop() {
        $(".error-pop").addClass("show");
        $("body").css("overflow", "hidden");
        setTimeout(function() {
            closeErrorPop();
        }, 2000);
    }


    function closeErrorPop() {
        $(".error-pop").removeClass("show");
        $("body").css("overflow", "auto");
    }
    $(".search-wrapper button").click(function() {
        var code = $(this).prev("input").val();
        if (code === "") {
            $("input").focus();
            return false;
        }
        var full_code = checkStockLocation(code);
        if (full_code !== null) {
            var src = "http://hq.sinajs.cn/list=" + full_code;
            var head = document.body;
            var script = document.createElement("script");
            script.src = src;
            head.appendChild(script);
            script.onload = function() {
                var param_string = "hq_str_" + full_code;
                var Fn = Function;
                var param = new Fn('return ' + param_string)();
                if (param !== "") {
                    mySwiper.slideTo(0);
                    $(".scan").removeClass("scan-to-red").removeClass("scan-to-green");
                    $(".loading span").eq(0).attr("class","");
                    $(".status").removeClass("red").removeClass("green");
                    $(".loading").addClass("visible");
                    for (var i = 0; i < 5; i++) {
                        var j = 1;
                        setTimeout(function() {
                            $(".loading span").eq(0).addClass("tips" + j);
                            j++;
                        }, i * 1000);
                    }
                    $.ajax({
                        url: "http://www.gu0018.com/Stock/StockData.aspx",
                        type: "get",
                        async: false,
                        data: {
                            s: code,
                            d: 1
                        },
                        dataType: "json",
                        success: function(data) {
                            if (data.data[0].ms1 < 0) { //持股
                                $(".scan").addClass('scan-to-red');
                                $(".status").addClass("red");
                                $(".status").html("今日持股");
                            } else {
                                $(".scan").addClass('scan-to-green');
                                $(".status").addClass("green");
                                $(".status").html("今日持币");
                            }
                            $(".name").html(param.split(",")[0]);
                            $(".code").html(code);
                            setTimeout(function() {
                                mySwiper.slideTo(1);
                                $(".loading").removeClass("visible");
                                $(".scan").removeClass("scan-to-red").removeClass("scan-to-green");
                            }, 6000);
                        }
                    });
                } else {
                    showErrorPop();
                }
            };
        } else {
            showErrorPop();
        }
    });

    $(".error-pop").click(function() {
        closeErrorPop();
    });

    var wx_config_data = null;
    var curr_url = location.href.split('#')[0];
    var ws_sdk_src = "http://res.wx.qq.com/open/js/jweixin-1.0.0.js";
    var head = document.body;
    var ws_sdk_script = document.createElement("script");
    ws_sdk_script.src = ws_sdk_src;
    head.appendChild(ws_sdk_script);
    ws_sdk_script.onload = function() {
        $.ajax({
            url: "/Handler/GetJSApiTicket.ashx",
            async: false,
            data: {
                url: curr_url
            },
            dataType: "json",
            success: function(data) {
                wx_config_data = data;
            }
        });
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: wx_config_data.appId, // 必填，公众号的唯一标识
            timestamp: wx_config_data.timestamp, // 必填，生成签名的时间戳
            nonceStr: wx_config_data.nonceStr, // 必填，生成签名的随机串
            signature: wx_config_data.signature, // 必填，签名，见附录1
            jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(function() {
            var shareData = {
                title: "聚牛财经-神经元智能诊股系统",
                desc: "聚牛财经-神经元智能诊股系统，由美国麻省理工大学Franzi科学家倾心研发，一眼看涨跌！",
                link: "http://www.gu0018.com/mobile/activity/prejudgment/index.html",
                imgUrl: "http://www.gu0018.com/mobile/activity/prejudgment/images/share.jpg"
            };
            wx.onMenuShareAppMessage(shareData);
            wx.onMenuShareTimeline(shareData);
        });
    };
})();