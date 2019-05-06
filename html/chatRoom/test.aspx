<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ChatHome.aspx.cs" Inherits="WEBLive.ChatHome" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
<title>巨景视频直播中心</title>
<link rel="stylesheet" href="css/reset.css">
<link rel="stylesheet" href="css/jquery.sinaEmotion.css">
<link rel="stylesheet" href="css/jquery.toast.css">
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
      <source id="hls-src" src="   http://ivi.bupt.edu.cn/hls/cctv6hd.m3u8" type="application/x-mpegURL">
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
   <div class="guide"><a class="active"><span>聊天</span></a><a><span>分析师介绍</span></a></div>
   <div class="active section">
    <div class="msg-box">
      <ul>
      </ul>
    </div>
    <div class="present-wrapper hide">
      <ul>
        <li class="monkey"></li>
        <li class="rose"></li>
        <li class="stick"></li>
        <li class="kiss"></li>
        <li class="jewel"></li>
        <li class="car"></li>
        <li class="plane"></li>
        <li class="cannon"></li>
      </ul>
    </div>
    <div class="msg-input flex">
      <div id="face-btn" class="icon icon-emoji"></div>
      <div id="present-btn" class="icon icon-present"></div>
      <input class="msg-text flex-item" type="text" placeholder="说点什么">
      <a class="send">发送</a>
    </div>
    </div>
    
     <div class="section">
    <div id="teacher-wrapper">
            <div id="tab-link-list">
                <ul>
                    <li class="active"><a data-href="#tab1"><span class="y"></span></a></li>
                    <li><a data-href="#tab2"><span class="w"></span></a></li>
                    <li><a data-href="#tab3"><span class="c"></span></a></li>
                </ul>
            </div>
            <div id="tabs-list">
                <div id="tab1" class="active">
                    <div class="border-content">
                        <div class="flex top-section">
                            <span class="avatar"></span>
                            <div class="flex-item name">
                                <h1 class="tag">袁水洋</h1>
                                <h2>聚牛王牌投顾</h2>
                                <p><span>执业编号:</span><span>A0080617080003</span></p>
                            </div>
                        </div>
                        <div class="desc">
                            <h1>先学会逃顶，再学会赚钱</h1>
                            <h1>买在起涨点，赢在主升浪</h1>
                            <p> 2001年入行，十年前开启全国投资报告会演讲，2007年就已突破3万学员，历任知名股票软件公司首席讲师，期货公司项目经理，投顾公司调研总监。</p>
                            <p>广东卫视、广东新闻频道、广州经济频道 《谈股论金》栏目以及电台财经927的特邀嘉宾。</p>
                            <p class="skill">操盘战法：开发【博弈大师】指标，自创 【决战龙头】战法。</p>
                        </div>
                    </div>
                </div>
                <div id="tab2">
                    <div class="border-content">
                        <div class="flex top-section">
                            <span class="avatar w"></span>
                            <div class="flex-item name">
                                <h1>吴界</h1>
                                <h2>金牌投资顾问</h2>
                                <p><span>执业编号:</span><span>A0080617070002</span></p>
                            </div>
                        </div>
                        <div class="desc">
                            <h1>股海有经纬，增值无边界</h1>
                            <p>12年实战经验，曾在私募机构任职首席操盘手，曾任职于知名炒股软件公司，主导研发多个实战技术指标，使用者过千万，广获股民好评。</p>
                            <p class="skill">独创【涨停系列战法】，擅长以敏锐的洞察能力、精准的分析能力解读市场，捕抓最佳买点。
                            </p>
                        </div>
                    </div>
                </div>
                <div id="tab3">
                    <div class="border-content">
                        <div class="flex top-section">
                            <span class="avatar c"></span>
                            <div class="flex-item name">
                                <h1>陈政雄</h1>
                                <h2>金牌投资顾问</h2>
                                <p><span>执业编号:</span><span>A0080617070003</span></p>
                            </div>
                        </div>
                        <div class="desc">
                            <h1>选取最具成长性</h1>
                            <h1>行业进行价值投资</h1>
                            <p>引进国外先进的六位合一the one战法。连续3年稳健高增长。</p>
                            <p>代表战绩：持续7年跑赢大盘。</p>
                            <p>主张：选取最具成长性行业进行价值投资让利润自由奔跑。</p>
                            <p class="skill"> 操盘战法：独创操盘金字塔理论。</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    
    
  </div>
</div>
<script src="http://live.gu0018.com/js/video.min.js" type="text/javascript"></script> 
<script src="http://live.gu0018.com/js/videojs-contrib-hls.min.js" type="text/javascript"></script> 
<script src="http://live.gu0018.com/js/videojs-flash.min.js" type="text/javascript"></script> 
<script src="scripts/jquery-1.10.2.min.js"></script> 
<script src="scripts/jquery.signalR-2.1.2.min.js"></script> 
<script src="signalr/hubs"></script> 
<script src="scripts/jquery.sinaEmotion.js"></script> 
<script src="scripts/jquery.toast.js"></script> 
<script src="scripts/default.js"></script> 
<script src="http://wechatfe.github.io/vconsole/lib/vconsole.min.js?v=3.0.0.0"></script>
</body>
</html>
