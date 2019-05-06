<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ChatHome.aspx.cs" Inherits="WEBLive.ChatHome" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
<title>巨景视频直播中心</title>
<link rel="stylesheet" href="css/reset.css">
<link rel="stylesheet" href="css/default.css">
<link href="http://live.gu0018.com/css/video-js.min.css" rel="stylesheet">
</head>
<body>
<div class="header">
  <div class="container "><i class="icon icon-title"></i></div>
</div>
<div class="main">
  <div id="video-wrapper"> <span class="count"> <i class="icon icon-user"></i>在线：<span>0</span> </span>
    <video id="video" class="video-js vjs-default-skin" controls webkit-playsinline="true" playsinline="true" style="display: none;">
      <source id="hls-src" src="http://ivi.bupt.edu.cn/hls/cctv6hd.m3u8" type="application/x-mpegURL">
      <!--<source id="hls-src" src="http://z.gu0018.com/AppName/StreamName.m3u8?auth_key=1506407072-0-0-5195d887c03ccde6b435039475db6679" type="application/x-mpegURL">-->
      <source id="flv-src" src="http://z.gu0018.com/AppName/StreamName.flv?auth_key=1506407072-0-0-88b286ee4a284f63c4598ced184be540" type="video/x-flv">
    </video>
  </div>
  <div class="black-block">
    <div>
      <h1>直播暂未开始</h1>
    </div>
  </div>
  <div class="content">
    <div class="guide"><a class="active"><span>聊天</span></a><a><span>系统消息</span></a><a><span>分析师介绍</span></a></div>
    <div class="active section chat">
      <div class="msg-box">
        <ul>
        </ul>
      </div>
      <div class="emoji-wrapper hide">
        <ul>
        </ul>
      </div>
      <div class="msg-input flex">
        <div id="face-btn" class="icon icon-emoji"></div>
        <input class="msg-text flex-item" type="text" placeholder="说点什么……">
        <a class="send">发送</a> </div>
    </div>
    <div class="section news"> <img src="./images/list.png" alt="" style="width: 100%;margin-top: .5rem;">
      <p style="color: #BF2317;font-size: .7rem;margin-top: .25rem;padding-left: .75rem;padding-right: .75rem;line-height: 1.2rem;">聚牛股管理员：在股友交流区，发广告或联系方式(qq/微信/手机)，严重者将被封号！</p>
    </div>
    <div class="section teacher">
      <div class="border-content">
        <div class="flex top-section"> <span class="avatar c"></span>
          <div class="flex-item name">
            <h1>陈政雄</h1>
            <h2>罗兴文智囊</h2>
            <p><span>执业编号:</span><span>A0080617070003</span></p>
          </div>
        </div>
        <div class="desc">
          <h1>选取最具成长性行业进行价值投资</h1>
          <p>引进国外先进的六位合一the one战法</p>
          <p>代表战绩：持续7年跑赢大盘</p>
          <div class="flex">
            <div style="width: 4rem;">
              <p>主　　张：</p>
            </div>
            <div class="flex-item">
              <p>选取最具成长性行业进行价值投资让利润自由奔跑</p>
            </div>
          </div>
          <p class="skill"> 操盘战法：独创操盘金字塔理论。</p>
        </div>
      </div>
    </div>
  </div>
</div><div class="footer">
        <div class="container">
            <div class="info-wrapper">
                <p class="address">湖南巨景证券投资顾问有限公司广州分公司：中国证监会首批认证证券咨询机构（编号ZX0018）</p>
                <p class="copyright"><span>1993-2017 湖南巨景证券投资顾问有限公司广州分公司版权所有</span><span>网站备案号：粤ICP备17017433号</span></p>
                <p>股市有风险，投资需谨慎</p>
            </div>
            <div class="qr-code-wrapper">
                <img src="http://www.gu0018.com/images/contact_qrcode.jpg" alt="">
                <span>官方微信</span>
            </div>
        </div>
    </div>
<script src="http://live.gu0018.com/js/video.min.js" type="text/javascript"></script> 
<script src="http://live.gu0018.com/js/videojs-contrib-hls.min.js" type="text/javascript"></script> 
<script src="http://live.gu0018.com/js/videojs-flash.min.js" type="text/javascript"></script> 
<script src="js/jquery.min.js"></script> 
<script src="scripts/jquery.signalR-2.1.2.min.js"></script> 
<script src="signalr/hubs"></script> 
<script src="js/default.js"></script> 
<script>
	
$(window).resize(function() {
    var temp_height = document.documentElement.clientHeight - $(".header").outerHeight(true);
$(".main").css("height", temp_height);
});

		$(".send").click(function () {
		var kw = $(".msg-text").val();
		if (kw == "") {
			return false;
		}
	//	chat.server.sendMess(JSON.stringify(temp));
		$.ajax({
			url:"http://test.gu0018.com/API/ReceiveLiveMsg.ashx",
			data:{
				nickName:username,
				msg:kw
			}
		});
				$(".msg-box ul").append("<li><span>" + "我" + "</span>" +AnalyticEmotion(kw)  + "</li>");
		var h = $("ul").height()
		$(".msg-box").scrollTop(h);
		$(".msg-text").val("");
		$(".msg-input input").blur();
	});
	
	
	var  emoji_list=["dx","hs","wy","dk","wx","xh","hx","yw","bs"];
	var emoji_html="";
	for(i in emoji_list){
		emoji_html+="<li data-emoji=\""+emoji_list[i]+"\"><a><img src=\"./images/emoji/"+emoji_list[i]+".png\"></a></li>";
	}
	$(".emoji-wrapper ul").html(emoji_html);
	
	$(".emoji-wrapper ul li").click(function(){
		console.log($(this).data("emoji"));
		$(".emoji-wrapper").addClass("hide");
		$(".msg-text").val($(".msg-text").val()+"["+$(this).data("emoji")+"]").focus();
	});
	

	//替换
function AnalyticEmotion(s) {
	if (typeof (s) != "undefined") {
		var sArr = s.match(/\[.*?\]/g);
		console.log(sArr);
		if (sArr != null) {
			for (var i = 0; i < sArr.length; i++) {
					var n=sArr[i].substr(1,2);
					var reStr = "<img src=\"./images/emoji/" +n  + ".png\" />";
					s = s.replace(sArr[i], reStr);

			}
		}
	}
	return s;
}
	</script>
</body>
</html>
