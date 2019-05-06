 (function($) {
     $.getScript = function(url, callback) {
         var head = document.getElementsByTagName('head')[0];
         var js = document.createElement('script');
         js.setAttribute('type', 'text/javascript');
         js.setAttribute('src', url);
         head.appendChild(js);
         var callbackFn = function() {
             if (typeof callback === 'function') {
                 callback();
             }
         };
         if (document.all) { //IE
             js.onreadystatechange = function() {
                 if (js.readyState == 'loaded' || js.readyState == 'complete') {
                     callbackFn();
                 }
             }
         } else {
             js.onload = function() {
                 callbackFn();
             }
         }
     }
 })(Zepto);
 var mySwiper = new Swiper('.swiper-container');
// console.log("▕▔▔▔▔▔▔▔▔▔▔▔╲\n▕╮╭┻┻╮╭┻┻╮╭▕╮╲\n▕╯┃╭╮┃┃╭╮┃╰▕╯╭▏\n▕╭┻┻┻┛┗┻┻┛　┈ ╰ ▏\n▕╰━━━┓┈┈┈╭╮▕╭╮▏\n▕╭╮╰┳┳┳┳╯╰╯▕╰╯▏\n▕╰╯┈┗┛┗┛┈╭╮▕╭╮▏what are you looking at?");

//资金面 技术面 基本面
 function checkStockLocation(code) {
     if (code.length == 6) {
         var preCode = code.substring(0, 3);
         var preStr = new String();
         var sz_list = ["300", "000", "002", "200", "080", "031"];
         var sh_list = ["600", "601", "603", "900", "730", "700", "580"];
         for (var i = 0; i < sz_list.length; i++) {
             if (preCode === sz_list[i]) {
                 preStr = "sz";
                 break;
             }
         }
         if (preStr != "sz") {
             for (var i = 0; i < sh_list.length; i++) {
                 if (preCode === sh_list[i]) {
                     preStr = "sh";
                     break;
                 }
             }
         }
         if (preStr != "") {
             return preStr + code;
         }
     }
     return null;
 };

 function showErrorPop() {
     $(".error-pop").addClass("show");
     $("body").css("overflow", "hidden");
     setTimeout(function() { closeErrorPop() }, 2000);
 }

 function closeErrorPop() {
     $(".error-pop").removeClass("show");
     $("body").css("overflow", "auto");
 }
 $(".search-wrapper button").click(function(event) {
     /* Act on the event */
     var code = $(this).prev("input").val();
     if (code == "") {
         $("input").focus();
         return false;
     }
     var full_code = checkStockLocation(code);
     if (full_code != null) {



         var src = "http://hq.sinajs.cn/list=" + full_code;
         var head = document.body;
         var script = document.createElement("script");
         script.src = src;
         head.appendChild(script);
         script.onload = function() {

             var param_string = "hq_str_" + full_code;
             var param = eval(param_string);
             if (param != "") {
                 mySwiper.slideTo(0);
                 $(".scan").removeClass("scan-to-red").removeClass("scan-to-green");
                 $(".status").removeClass("red").removeClass("green");
                 $(".loading").addClass("visible");
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
                         }, 5500);
                     }
                 });
             } else showErrorPop();
         }
     } else showErrorPop();
 });

 $(".error-pop").click(function(event) {
     /* Act on the event */
     closeErrorPop();
 });

 var wx_config_data = new Object();
 var curr_url = location.href.split('#')[0];
 $.getScript("http://res.wx.qq.com/open/js/jweixin-1.0.0.js", function() {
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
 });
