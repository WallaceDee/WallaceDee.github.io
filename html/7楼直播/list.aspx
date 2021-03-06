﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ChatHome.aspx.cs" Inherits="WEBLive.ChatHome" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
    <head runat="server">
    <meta charset="utf-8">
    <title>列表</title>
    <script src="./js/jquery.min.js" type="text/javascript"></script>
    <script src="scripts/jquery.signalR-2.1.2.min.js"></script>
    <script src="signalr/hubs"></script>
    <style>
table {
	background: #eee;
	width: 800px;
	text-align: center;
}
table td {
	background: #FFF
}
table th:nth-child(1) {
	width: 170px;
}
table th:nth-child(2) {
	width: 100px;
}
table th:nth-child(4) {
	width: 150px;
}
table th:nth-child(5) {
	width: 100px;
}
table label {
	cursor: pointer;
}
tr.green td {
	background-color: green;
}
tr.red td {
	background-color: red;
}
</style>
    </head>

    <body>
<table>
      <thead>
    <tr>
          <th>时间</th>
          <th>用户</th>
          <th>消息内容</th>
          <th>IP</th>
          <th>是否禁止发送</th>
          <th>状态</th>
        </tr>
  </thead>
      <tbody>
  </tbody>
    </table>
<script>
    var receive = function() {
        $.ajax({
            type: "get",
            url: "http://test.gu0018.com/API/GetLiveMsg.ashx",
            success: function(data) {
                //后台返回的结果不是json
                if (data.substr(0, 1) == '{') {
                    data = data.replace("{", "[");
                    data = data.substring(0, data.length - 1);
                    data += "]";
                    data = JSON.parse(data);
                } else {
                    data = [];
                }
                //倒序
                data.reverse();
                var temp_html = "";
                for (i in data) {
                    temp_html += "<tr><td>" + data[i][0].ReceiveTime + "</td><td>" + data[i][0].NickName + "</td><td>" + data[i][0].Msg + "</td><td>" + data[i][0].IP + "</td><td><label><input type='checkbox' >禁止</label></td><td><span class='count-down todo'>10</span>s后发送</td></tr>";
                }
                $("tbody").prepend(temp_html);
                $(".todo").each(function(index, el) {

                    countDown(10, $(this));
                    $(this).removeClass("todo");
                });
            }
        });
    }
    setInterval(receive, 1000);
    var countDown = function(seconds, ele) {
        var flag = $(ele).parents("tr").find("input").prop('checked');
        if (flag) {
            $(ele).parents("tr").addClass("red");
            $(ele).parents("tr").find("input").prop('disabled', true);
            $(ele).parent("td").text("已禁止");
        } else {
            setTimeout(function() {
                seconds--;
                if (seconds >= 0) {
                    $(ele).text(seconds);
                    countDown(seconds, ele);
                } else {
                    $(ele).parents("tr").addClass("green");
                    $(ele).parents("tr").find("input").prop('disabled', true);
                    //发送
					var username=$(ele).parents("tr").find("td").eq(1).text();
					var content=$(ele).parents("tr").find("td").eq(2).text();
					var temp = {};
					temp.name = username;
					temp.msg = content;
                    send(JSON.stringify(temp));
                    $(ele).parent("td").text("已发送");
                }
            }, 1000);
        }
    }


    var send = function(msg) {
		chat.server.sendMess(msg);
    }
	
	
// 声明一个代理引用该集线器,记得$.connection.后面的方法首字母必须要小写,这也是我为什么使用别名的原因
var chat = $.connection.myHub;
// 这里是注册集线器调用的方法,和1.0不同的是需要chat.client后注册,1.0则不需要


// 启动连接,这里和1.0也有区别
$.connection.hub.start().done(function () {
	$(".content .send").click(function () {


		var temp = {};
		temp.name = username;
		temp.msg = AnalyticEmotion(kw);
		chat.server.sendMess(JSON.stringify(temp));
	});


});
    </script>
</body>
</html>