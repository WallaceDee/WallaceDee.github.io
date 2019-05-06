  //root font-size
(function (doc, win) {
    "use strict";
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            var htmlFontSize=20;//³õÊ¼´óÐ¡
            var designWidth=375;//Éè¼Æ¸å¿í¶È
            if (!clientWidth) return;
            docEl.style.fontSize = htmlFontSize * (clientWidth / designWidth) + 'px';
            var  reality = Number(docEl.style.fontSize.substr(0,docEl.style.fontSize.length-2));
            var theory = htmlFontSize * (clientWidth / designWidth);
            if(reality!=theory){
                docEl.style.fontSize=htmlFontSize *theory/reality*(clientWidth/ designWidth) + 'px';
            }
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);



  var turnplate = {
      restaraunts: [], //大转盘奖品名称
      colors: [], //大转盘奖品区块对应背景颜色
      outsideRadius: 190, //大转盘外圆的半径
      textRadius: 150, //大转盘奖品位置距离圆心的距离
      insideRadius: 20, //大转盘内圆的半径
      startAngle: 0, //开始角度

      bRotate: false //false:停止;ture:旋转
  };

  $(document).ready(function() {
      //动态添加大转盘的奖品与奖品区域背景颜色
      turnplate.restaraunts = ["特等奖", "一等奖", "二等奖", "三等奖", "一等奖", "二等奖", "三等奖 "];
      turnplate.colors = ["#FEF9F7", "#FBC6A9", "#FFDECC", "#FBC6A9", "#FFDECC", "#FBC6A9", "#FFDECC"];


      var rotateTimeOut = function() {
          $('#wheelcanvas').rotate({
              angle: 0,
              animateTo: 2160,
              duration: 8000,
              callback: function() {
                  alert('网络超时，请检查您的网络设置！');
              }
          });
      };

      //旋转转盘 item:奖品位置; txt：提示语;
      var rotateFn = function(item, txt) {
          var angles = item * (360 / turnplate.restaraunts.length) - (360 / (turnplate.restaraunts.length * 2));
          if (angles < 270) {
              angles = 270 - angles;
          } else {
              angles = 360 - angles + 270;
          }
          $('#wheelcanvas').stopRotate();
          $('#wheelcanvas').rotate({
              angle: 0,
              animateTo: angles + 1800,
              duration: 8000,
              callback: function() {
                  alert(txt);
                  turnplate.bRotate = !turnplate.bRotate;
              }
          });
      };

      $('.pointer').click(function() {
          if (turnplate.bRotate) return;
          turnplate.bRotate = !turnplate.bRotate;
          //获取随机数(奖品个数范围内)
          var item = rnd(1, turnplate.restaraunts.length);
          //奖品数量等于10,指针落在对应奖品区域的中心角度[252, 216, 180, 144, 108, 72, 36, 360, 324, 288]
          rotateFn(item, turnplate.restaraunts[item - 1]);
          console.log(item);
      });
  });

  function rnd(n, m) {
      var random = Math.floor(Math.random() * (m - n + 1) + n);
      return random;

  }


  //页面所有元素加载完毕后执行drawRouletteWheel()方法对转盘进行渲染
  var img = new Image();
  window.onload = function() {
      img.src = "images/icon_award.png";
      img.style.display = "none";
      $("body").append(img);
      img.onload = function() {
          drawRouletteWheel();
      }
  };

  function drawRouletteWheel() {
      var canvas = document.getElementById("wheelcanvas");
      if (canvas.getContext) {
          //根据奖品个数计算圆周角度
          var arc = Math.PI / (turnplate.restaraunts.length / 2);
          var ctx = canvas.getContext("2d");
          //在给定矩形内清空一个矩形
          ctx.clearRect(0, 0, 422, 422);
          //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式  
          ctx.strokeStyle = "#E6575E";
          //font 属性设置或返回画布上文本内容的当前字体属性

          for (var i = 0; i < turnplate.restaraunts.length; i++) {
              var angle = turnplate.startAngle + i * arc;
              ctx.fillStyle = turnplate.colors[i];
              ctx.beginPath();
              //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）    
              ctx.arc(211, 211, turnplate.outsideRadius, angle, angle + arc, false);
              ctx.arc(211, 211, turnplate.insideRadius, angle + arc, angle, true);
              ctx.stroke();
              ctx.fill();
              //锁画布(为了保存之前的画布状态)
              ctx.save();

              //----绘制奖品开始----
              ctx.fillStyle = "#000";
              var text = turnplate.restaraunts[i];
              var line_height = 17;
              //translate方法重新映射画布上的 (0,0) 位置
              ctx.translate(211 + Math.cos(angle + arc / 2) * turnplate.textRadius, 211 + Math.sin(angle + arc / 2) * turnplate.textRadius);

              //rotate方法旋转当前的绘图
              ctx.rotate(angle + arc / 2 + Math.PI / 2);

              /** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/

              ctx.font = 'bold 20px Microsoft YaHei';

              ctx.fillText(text, -ctx.measureText(text).width / 2, 0);

              ctx.drawImage(img, -25, 20);

              //把当前画布返回（调整）到上一个save()状态之前 
              ctx.restore();
              //----绘制奖品结束----
          }
      }
  }
