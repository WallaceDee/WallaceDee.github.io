addEventListener('load', function () {

    // 基础的几个配置项，其他基本以这几个配置项计算出来
    var circleRadius = 74;                                    /* 内圆半径 */
    var wheelRadius = 200;                                    /* 外圈半径 */
    var borderWidth = 2;                                      /* 描边宽度 */

    // 根据配置项进行一些位置计算
    var pointX = screen.width;                                /* 定位的屏幕中心点 */
    var pointY = screen.height / 3;                           /* 定位的屏幕中心点 */
    var circleWidth = circleRadius + borderWidth;
    var circleHeight = circleRadius * 2 + borderWidth * 2;
    var wheelWidth = wheelRadius + borderWidth;
    var wheelHeight = wheelRadius * 2 + borderWidth * 2;
    var oneDegree = Math.PI / 180;
    var slotAngle = Math.PI / 6;                              /* 每一个选项占多少角度 */
    var halfSlotAngle = Math.PI / 12;                         /* 每个选项一半是多少度 */
    var currentAngle = 0;                                     /* 当前角度，从-15度到15度 */
    var currentIndex = 0;                                     /* 当前选中的哪一个选项 */
    var selectedAlpha = 1;                                    /* 选中那一项的透明度，转动中会透明 */
    var drawStop;                                             /* 如果在停止转动动画进行中，再次转动，则停止动画，跟着用户操作转动 */
    var scrollCountMax = 20;                                  /* 页面滚动最多15帧 */
    var scrollStop;                                           /* 页面滚动停止 */
    var ScrollStatus = {
        init: 0,
        stopped: 1,
        autoScrolling: 2,
        autoStopping: 3,
        manualScrolling: 4
    };
    var scrollStatus = ScrollStatus.init;                     /* 是否自动滚动触发的屏幕滚动事件 */
    var scrollOrigin = 0;                                     /* 手动滚动屏幕的原点 */
    var wheelHideStop;                                        /* 当转盘隐藏时向上滚动，转盘出现，但动画导致转盘被再次隐藏 */
    var titleHideStop;                                        /* 标题栏隐藏动画时，又出现会导致标题栏再次被隐藏 */


    // canvas对象，以及确定其位置
    var $titleWrapper = document.getElementById("wheelTitleWrapper");
    var $title = document.getElementById("wheelTitle");
    var $circle = document.getElementById("circle");
    var $wheel = document.getElementById("wheel");
    var titleHeight = $title.clientHeight;
    $titleWrapper.style.top = (pointY - titleHeight / 2) + "px";
    $titleWrapper.style.width = (pointX - wheelRadius + 2) + "px";
    $titleWrapper.style.display = "none";
    $title.setAttribute("class", "hide");
    $circle.width = circleWidth;
    $circle.height = circleHeight;
    $circle.style.top = (pointY - circleRadius) + "px";
    $circle.setAttribute("class", "show");
    $wheel.width = wheelWidth;
    $wheel.height = wheelHeight;
    $wheel.style.top = (pointY - wheelRadius) + "px";
    $wheel.setAttribute("class", "show");

    // 获取绘图上下文
    var ctxCircle = $circle.getContext("2d");
    var ctxWheel = $wheel.getContext("2d");

    // 转盘的选项列表，必须大于等于7个，这儿可以由外部传入
    var items = [
        { name: "个人信息", desc: "个人信息", id: "personIntroTitle", src: "../../img/person-icon.png" },
        { name: "公司简介", desc: "公司简介", id: "company", src: "../../img/company-icon.png" },
        { name: "提供资源", desc: "提供资源", id: "provide-resource", src: "../../img/res-provide-icon.png" },
        { name: "需求资源", desc: "需求资源", id: "resneed", src: "../../img/res-need-icon.png" },
        { name: "商机", desc: "商机", id: "comerce", src: "../../img/comerce-icon.png" },
        { name: "招聘", desc: "招聘", id: "hire", src: "../../img/hire-icon.png" },
        { name: "关注", desc: "关注", id: "attention", src: "../../img/love-icon.png" }
    ];
    var itemsCount = items.length;

    if (items.length < 7) {
        throw new Exception("必须提供大于6个选项");
    }

    // 加载选项图标
    (function () {
        var loaded = 0;
        for (var index in items) {
            var item = items[index];
            var imgObj = new Image();
            imgObj.src = item.src;
            imgObj.onload = function () {
                loaded++;
                if (loaded == items.length) {
                    drawWheel();
                }
            }
            item.icon = imgObj;
        }
    })();

    // 绘制内圆
    var drawCircle = function () {
        var circle = new Path2D();
        circle.arc(circleWidth, circleWidth, circleRadius, Math.PI / 2, Math.PI + Math.PI / 2);
        ctxCircle.save();
        ctxCircle.fillStyle = "#1b8cec";
        ctxCircle.fill(circle);
        ctxCircle.strokeStyle = "white";
        ctxCircle.lineWidth = borderWidth;
        ctxCircle.stroke(circle);
        var logoImg = new Image();
        logoImg.onload = function () {
            ctxCircle.drawImage(logoImg, 15, 40, 54, 29);
            ctxCircle.fillStyle = '#ffffff';
            ctxCircle.font = '25px SimHei';
            ctxCircle.fillText("仁脉", 20, 95);
        }
        logoImg.src = "../../img/logo.png";
        ctxCircle.restore();
    }

    // 绘制轮盘，角度变化时，需要重绘选项
    var drawWheel = function () {
        ctxWheel.clearRect(0, 0, wheelWidth, wheelHeight);
        // 绘制外圈
        var wheel = new Path2D();
        wheel.arc(wheelWidth, wheelWidth, wheelRadius, Math.PI / 2, Math.PI + Math.PI / 2);
        ctxWheel.save();
        var gradient = ctxWheel.createLinearGradient(wheelRadius, 0, wheelRadius, wheelRadius * 2);
        gradient.addColorStop(0, "#5cc2fd");
        gradient.addColorStop(1, "#bee6fd");
        ctxWheel.fillStyle = gradient;
        ctxWheel.fill(wheel);
        ctxWheel.strokeStyle = "white";
        ctxWheel.lineWidth = borderWidth;
        ctxWheel.stroke(wheel);
        ctxWheel.restore();

        ctxWheel.save();
        // 为了后面的三角函数的计算，需要把坐标变化一下
        ctxWheel.translate(wheelWidth, wheelWidth);

        // 画橙色块，当转动过程中，色块变暗
        var fan = new Path2D();
        fan.moveTo(0, 0);
        var y = Math.sin(Math.PI / 12) * wheelRadius;
        var x = -(Math.cos(Math.PI / 12) * wheelRadius);
        fan.lineTo(x, y);
        fan.arc(0, 0, wheelRadius, Math.PI - Math.PI / 12, Math.PI + Math.PI / 12);
        fan.lineTo(0, 0);
        ctxWheel.fillStyle = "rgba(240,133,28," + selectedAlpha + ")";
        ctxWheel.fill(fan);
        ctxWheel.strokeStyle = "rgba(255,255,255," + selectedAlpha + ")";
        ctxWheel.lineWidth = borderWidth;
        ctxWheel.stroke(fan);

        // 绘制选项
        // 画各个图标，根据旋转角度来确定图标的位置
        // 如果把最下面算作0度，那么从大于-30度开始计算，小于等于-30度不预考虑，模30度
        // 当转动停止时，要转动到-15度的固定位置
        // 现在要确定哪个位置显示哪个图标，角度多少

        // 这儿需要一个算法，根据手指的转动程度来计算角度，并且根据角度来计算CurrentIndex，
        // 并且在整个过程中就要开始转动，而不是停下来才开始转动
        // 手指垂直向上或向下的阻尼，如何和沿着圆转动产生区别？
        // 这个问题可以根据圆心和手指的线段，和圆周相交的点来确定

        // 绘制选项，从currentIndex开始绘制
        var startAngle = translateAngle(currentAngle);
        var drawingAngle = startAngle;
        var drawingIndex = currentIndex;
        var reverse = false;
        while (true) {
            // 判断是应该反向，还是绘制完毕
            if (reverse) {
                // 顺时针画，如果绘画角度已经超过半圆，绘制完毕
                if (drawingAngle > (Math.PI + Math.PI / 2 + halfSlotAngle)) {
                    break;
                }
            } else {
                // 先逆时针画，如果绘画角度小于半圆，则反向画
                if (drawingAngle < (Math.PI / 2 - halfSlotAngle)) {
                    drawingAngle = startAngle + slotAngle;
                    reverse = true;
                    drawingIndex = nextIndex(currentIndex, reverse);
                    continue;
                }
            }

            // 绘制选项，选到半径2/3处，再计算绘制的坐标
            var item = items[drawingIndex];
            var itemX = Math.cos(drawingAngle) * (wheelRadius * 2 / 3);
            var itemY = Math.sin(drawingAngle) * (wheelRadius * 2 / 3);
            ctxWheel.drawImage(item.icon, itemX - 12.5, itemY - 25, 25, 25);
            ctxWheel.fillStyle = "#1573c9";
            ctxWheel.font = '15px SimHei';
            var textMetrix = ctxWheel.measureText(item.name);
            ctxWheel.fillText(item.name, itemX - textMetrix.width / 2 - 1, itemY + 18);

            // 获取下一个item的index和绘图角度
            if (reverse) {
                drawingAngle += slotAngle;
            } else {
                drawingAngle -= slotAngle;
            }
            drawingIndex = nextIndex(drawingIndex, reverse);
        }
        ctxWheel.restore();
    }

    // 换算角度，0度相当于180度
    var translateAngle = function (angle) {
        return angle + Math.PI;
    }

    // 获取下一个索引
    var nextIndex = function (index, reverse) {
        index = reverse ? index - 1 : index + 1;
        return adjustIndex(index);
    }

    var adjustIndex = function (index) {
        if (index < 0) {
            index = itemsCount + index;
        } else if (index >= itemsCount) {
            index = index - itemsCount;
        }
        return index;
    }

    // 转动的主要逻辑
    var rotate = function (startPoint, endPoint) {
        var angle;
        // startPoint和endPoint算出角度
        var startAngle = Math.atan2(startPoint.y, startPoint.x);
        var endAngle = Math.atan2(endPoint.y, endPoint.x);
        if (endPoint.y > 0 && startPoint.y < 0) {
            angle = Math.PI + startAngle + Math.PI - endAngle;
        } else if (endPoint.y < 0 && startPoint.y > 0) {
            angle = Math.PI - startAngle + Math.PI + endAngle;
        } else {
            angle = endAngle - startAngle;
        }

        // 根据角度旋转
        var movedAngle = currentAngle + angle;
        if (movedAngle > halfSlotAngle) {
            currentAngle = movedAngle - slotAngle;
            currentIndex++;
        } else if (movedAngle < (-halfSlotAngle)) {
            currentAngle = movedAngle + slotAngle;
            currentIndex--;
        } else {
            currentAngle = movedAngle;
        }
        currentIndex = adjustIndex(currentIndex);
        drawWheel();
    }

    // 根据这两个值来计算转动角度，并传入rotate
    var startPoint;

    var changeAxis = function (point) {
        return { x: point.x - pointX, y: point.y - pointY };
    }

    // 转动开始，记录起始坐标
    $wheel.addEventListener("touchstart", function ($event) {
        var circleClass = $circle.getAttribute("class");
        if (circleClass == "fade") {
            clearTimeout(wheelHideStop);
            $wheel.style.display = "block";
            setTimeout(function () {
                $wheel.setAttribute("class", "show");
                $circle.setAttribute("class", "show");
            }, 0);
        }

        // 隐藏标题栏
        if ($title.className == "show") {
            $title.setAttribute("class", "hide");
            titleHideStop = setTimeout(function () {
                $titleWrapper.style.display = "none";
            }, 300);
        }
        var touch = $event.changedTouches[0];
        startPoint = changeAxis({ x: touch.clientX, y: touch.clientY });
        selectedAlpha = 0.5;
    });

    // 转动中
    $wheel.addEventListener("touchmove", function ($event) {
        var touch = $event.changedTouches[0];
        var endPoint = changeAxis({ x: touch.clientX, y: touch.clientY });
        rotate(startPoint, endPoint);
        startPoint = endPoint;

        $event.preventDefault();
        return false;
    });

    // 停止转动
    $wheel.addEventListener("touchend", function ($event) {
        var touch = $event.changedTouches[0];
        var endPoint = changeAxis({ x: touch.clientX, y: touch.clientY });
        rotate(startPoint, endPoint);
        startPoint = endPoint;

        // 需要让转盘自动滚动到固定位置，如果在自动滚动的动画结束前，用户再次滚动，
        // 需要停止滚动动画，让转盘跟着用户的手动
        // 这儿需要几个动画一起：出标题栏，滚动屏幕。但如果用户没等动画完成就再次转动，那么标题栏和滚动屏幕继续，但转盘归位的动画就停止。
        // 需要计算出要画多少帧，因为涉及到颜色如何改变
        var count = Math.abs(currentAngle) / oneDegree + 1;
        var alphaIncrement = 0.5 / count;

        drawStop = setInterval(function () {
            if (currentAngle > 0) {
                currentAngle = currentAngle - oneDegree;
                if (currentAngle <= 0) {
                    currentAngle = 0;
                    selectedAlpha = 1;
                } else {
                    selectedAlpha += alphaIncrement;
                }
            } else {
                currentAngle = currentAngle + oneDegree;
                if (currentAngle >= 0) {
                    currentAngle = 0;
                    selectedAlpha = 1;
                } else {
                    selectedAlpha += alphaIncrement;
                }
            }
            drawWheel();
            if (currentAngle == 0) {
                clearInterval(drawStop);
            }
        }, 15);

        // 显示标题栏，当滚动到屏幕最上面时不出现
        if (currentIndex != 0 && currentIndex != itemsCount - 1) {
            clearTimeout(titleHideStop);
            $title.innerText = items[currentIndex].desc;
            $titleWrapper.style.display = "block";
            setTimeout(function () {
                $title.setAttribute("class", "show");
            }, 0);
        }

        // 滚动屏幕
        // 计算滚动到什么地方，以及从哪个点开始滚动
        var scrollPace = 4;
        var item = items[currentIndex];
        var $item = document.getElementById(item.id);
        var goalScrollTop;
        if (currentIndex == 0) {
            goalScrollTop = 0;
        } else {
            goalScrollTop = $item.offsetTop - pointY + titleHeight / 2;
        }

        var scrollDistance = document.body.scrollTop - goalScrollTop;
        if (scrollDistance == 0) {
            $event.preventDefault();
            return false;
        }

        var scrollCount = parseInt(Math.abs(scrollDistance) / scrollPace)
            + (parseInt(Math.abs(scrollDistance)) % scrollPace == 0 ? 0 : 1);

        if (scrollCount > scrollCountMax) {
            scrollCount = scrollCountMax;
            scrollPace = Math.abs(scrollDistance) / scrollCount;
        }
        if (scrollDistance == 0) {
            $event.preventDefault();
            return false;
        } else if (scrollDistance > 0) {
            scrollPace = -scrollPace;
        }
        scrollStatus = ScrollStatus.autoScrolling;

        scrollStop = setInterval(function () {
            if (scrollCount == 1 || scrollCount == 0) {
                window.scrollTo(0, goalScrollTop);
                clearInterval(scrollStop);
                scrollStatus = ScrollStatus.autoStopping;
            } else {
                window.scrollBy(0, scrollPace);
                scrollCount--;
            }
        }, 15);

        $event.preventDefault();
        return false;
    });

    // 手动滚动屏幕，隐藏转盘
    window.onscroll = function ($event) {
        var manualScrollOffset;
        var circleClass = $circle.getAttribute("class");
        switch (scrollStatus) {
            case ScrollStatus.init:
                scrollStatus = ScrollStatus.stopped;
                scrollOrigin = document.body.scrollTop;
                break;
            case ScrollStatus.autoScrolling: break;
            case ScrollStatus.autoStopping:
                scrollStatus = ScrollStatus.stopped;
                scrollOrigin = document.body.scrollTop;
                break;
            case ScrollStatus.stopped:
                scrollStatus = ScrollStatus.manualScrolling;
            case ScrollStatus.manualScrolling:
                // 隐藏标题栏
                if ($title.className == "show") {
                    $title.setAttribute("class", "hide");
                    titleHideStop = setTimeout(function () {
                        $titleWrapper.style.display = "none";
                    }, 300);
                }
                manualScrollOffset = scrollOrigin - document.body.scrollTop;
                if (manualScrollOffset < -50) {
                    if (circleClass == "show") {
                        $wheel.setAttribute("class", "hide");
                        $circle.setAttribute("class", "fade");
                        wheelHideStop = setTimeout(function () {
                            $wheel.style.display = "none";
                        }, 900);
                    }
                    scrollStatus = ScrollStatus.stopped;
                    scrollOrigin = document.body.scrollTop;
                } else if (manualScrollOffset > 50) {
                    if (circleClass == "fade") {
                        clearTimeout(wheelHideStop);
                        $wheel.style.display = "block";
                        setTimeout(function () {
                            $wheel.setAttribute("class", "show");
                            $circle.setAttribute("class", "show");
                        }, 0);
                    }
                    scrollStatus = ScrollStatus.stopped;
                    scrollOrigin = document.body.scrollTop;
                }
                break;
            default: break;
        }
    }

    $circle.onclick = function ($event) {
        if ($circle.className == "fade") {
            clearTimeout(wheelHideStop);
            $wheel.style.display = "block";
            setTimeout(function () {
                $wheel.setAttribute("class", "show");
                $circle.setAttribute("class", "show");
            }, 0);
        } else {
            // 隐藏标题栏
            if ($title.className == "show") {
                $title.setAttribute("class", "hide");
                titleHideStop = setTimeout(function () {
                    $titleWrapper.style.display = "none";
                }, 300);
            }
            $wheel.setAttribute("class", "hide");
            $circle.setAttribute("class", "fade");
            wheelHideStop = setTimeout(function () {
                $wheel.style.display = "none";
            }, 900);
        }
    }

    drawCircle();

});

// todo:
// 2. 猛地转动之后抬起手指，做一个自动力反馈的后续转动，体验更好