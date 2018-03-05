var index = 0;
jQuery(document).ready(function($) {
	"use strict";
    var pic_src = "";
    var username = "";
    //var groupId = parseInt(getQueryString("id") === null ? 1 : getQueryString("id"));
    var groupId = 64;
    var fromTag = "360";
    $.ajax({
        type: "post",
        url: "http://www.319505.top/SEM/GetWeChat.ashx",
        data: {
            id: groupId
        },
        success: function(data) {
            pic_src = data.match(/'pic':'(\S*)','groupid'/)[1];
            username = data.match(/'username':'(\S*)','pic'/)[1];
            $(".code-wrapper img").attr("src", pic_src);
        }
    });
    setInterval(function() {
        $(".list-content").find("ul:first").animate({
            marginTop: "-16px"
        }, 500, function() {
            $(this).css({ marginTop: "0" }).find("li:first").appendTo(this);
        });
    }, 2000);
    setInterval(function() {
        $(".left-content .small-item-wrapper ul").addClass("rolling");
        setTimeout(function() {
            $(".left-content .small-item-wrapper ul").removeClass("rolling").find("li:first").appendTo($(".left-content .small-item-wrapper ul"));
        }, 2000);
    }, 3000);
    setInterval(function() {
        $(".right-content .small-item-wrapper ul").addClass("rolling2");
        setTimeout(function() {
            $(".right-content .small-item-wrapper ul").removeClass("rolling2").find("li:first").appendTo($(".right-content .small-item-wrapper ul"));
        }, 2000);
    }, 3000);
    var oUl = document.querySelector('.question-list ul'),
        l = oUl.offsetWidth / 2,
        t = oUl.offsetHeight / 2,
        aLi = oUl.getElementsByTagName('li');
    oUl.onmousemove = function(ev) {
        var oEv = ev || event,
            iL = oEv.clientX,
            iT = oEv.clientY;
        for (var i = 0; i < aLi.length; i++) {
            aLi[i].style.marginLeft = (iL - l) / 100 * aLi[i].style.zIndex + 'px';
            aLi[i].style.marginTop = (iT - t) / 70 * aLi[i].style.zIndex + 'px';
        }
    };
    $(".section").not(".section-one").append($(".input-content").clone());
    var result = [{ "code": "300666", "name": "江丰电子" }, { "code": "300678", "name": "中科信息" }, { "code": "300672", "name": "国科微" }, { "code": "603559", "name": "中通国脉" }, { "code": "300685", "name": "艾德生物" }, { "code": "300676", "name": "华大基因" }, { "code": "300618", "name": "寒锐钴业" }, { "code": "603019", "name": "中科曙光" }, { "code": "300675", "name": "建科院" }, { "code": "603896", "name": "寿仙谷" }, { "code": "000868", "name": "安凯客车" }, { "code": "300567", "name": "精测电子" }, { "code": "002830", "name": "名雕股份" }, { "code": "000830", "name": "鲁西化工" }, { "code": "601888", "name": "中国国旅" }, { "code": "002405", "name": "四维图新" }, { "code": "300545", "name": "联得装备" }, { "code": "002194", "name": "武汉凡谷" }, { "code": "002362", "name": "汉王科技" }, { "code": "300656", "name": "民德电子" }, { "code": "002008", "name": "大族激光" }, { "code": "002222", "name": "福晶科技" }, { "code": "002285", "name": "世联行" }, { "code": "300316", "name": "晶盛机电" }, { "code": "002451", "name": "摩恩电气" }, { "code": "000792", "name": "盐湖股份" }, { "code": "300496", "name": "中科创达" }, { "code": "600196", "name": "复星医药" }, { "code": "601318", "name": "中国平安" }, { "code": "002415", "name": "海康威视" }, { "code": "600519", "name": "贵州茅台" }, { "code": "000786", "name": "北新建材" }, { "code": "600231", "name": "凌钢股份" }, { "code": "601113", "name": "华鼎股份" }, { "code": "603899", "name": "晨光文具" }, { "code": "002813", "name": "路畅科技" }, { "code": "603288", "name": "海天味业" }, { "code": "000333", "name": "美的集团" }, { "code": "300520", "name": "科大国创" }, { "code": "603180", "name": "金牌厨柜" }, { "code": "300467", "name": "迅游科技" }, { "code": "000537", "name": "广宇发展" }, { "code": "300649", "name": "杭州园林" }, { "code": "300142", "name": "沃森生物" }, { "code": "000717", "name": "韶钢松山" }, { "code": "600584", "name": "长电科技" }, { "code": "300703", "name": "创源文化" }, { "code": "000725", "name": "京东方A" }, { "code": "300527", "name": "华舟应急" }, { "code": "600887", "name": "伊利股份" }, { "code": "600859", "name": "王府井" }];
    changeResult(result);
    setInterval(function() { changeResult(result); }, 20000);
    $(".submit-btn").on('mouseover', function(event) {
        event.preventDefault();
        $(".robot-arm").addClass("hover-btn");
    });
    $(".submit-btn").on('mouseout', function(event) {
        event.preventDefault();
        $(".robot-arm").removeClass("hover-btn");
    });
    $(document).on("keyup", "input[name='code']", function() {
        $("input[name='code']").not($(this)).val($(this).val());
    });
    $(".submit-btn").on('click', function(event) {
        event.preventDefault();
        var button_index = $(this).parents(".input-content").index(".input-content") + 1;
        var v = $(this).prev("input").val();
        // if (/^(sz|sh)?(((002|000|300|600)[\d]{3})|60[\d]{4})$/.test(v)) {
            if(v!=""){
            $.ajax({
                type: "get",
                url: "http://www.319505.top/SEM/ClickWeChat.ashx",
                data: {
                    username: username,
                    id: groupId,
                    fromTag: fromTag,
                    memo: button_index
                }
            });
            $("body").addClass("open-popup");
            var countdown = setInterval(function() {
                var $ele = $(".open-popup .loader .tips>span>em");
                var s = $ele.text() * 1;
                $ele.html(--s);
            }, 1000);
            setTimeout(function() {
                $(".open-popup .loader").addClass("hide");
                $(".open-popup .code").removeClass("hide");
                $(".open-popup .loader .tips>span>em").html(3);
                clearInterval(countdown);
            }, 3500);
        } else {
            alert("请输入股票代码或名称！");
        }
    });
    $(".drop").on('click', function(event) {
        event.preventDefault();
        $(".fadeIn").removeClass("fadeIn").addClass("fadeOut");
        $(".flipInX").removeClass("flipInX").addClass("flipOutX");
        setTimeout(function() {
            $("body").removeClass("open-popup");
            $(".fadeOut").removeClass("fadeOut").addClass("fadeIn");
            $(".flipOutX").removeClass("flipOutX").addClass("flipInX");
            $(".popup .loader").removeClass("hide");
            $(".popup .code").addClass("hide");
        }, 1000);
    });
    $(document).on("keydown", function(e) {
        if (e.keyCode === 13) {
            $(".submit-btn").eq(0).click();
        }
    });
});
Element.prototype.typewriter = function() {
    var d = this,
        c = d.innerHTML,
        b = 0;
    d.innerHTML = "";
    var e = setInterval(function() {
        var f = c.substr(b, 1);
        if (f == "<") {="" b="c.indexOf("">", b) + 1
        } else {
            b++
        }
        d.innerHTML = c.substring(0, b) + (b & 1 ? "_" : "");
        if (b >= c.length) {
            clearInterval(e)
        }
    }, 300)
    return this
}

function changeLeftResult(obj) {
    $(".left-result .code,.left-result .name").addClass("hide");
    $(".left-result .code").html(obj.code);
    $(".left-result .name").html(obj.name);
    $(".left-result").removeClass("rotateInDownRight");
    $(".left-result").addClass("rotateOutDownRight");
    setTimeout(function() {
        $(".left-result").removeClass("rotateOutDownRight");
        $(".left-result").addClass("hide rotateInDownRight");
    }, 1000);
    setTimeout(function() {
        $(".left-result").removeClass("hide");
        setTimeout(function() {
            $(".left-result .code").removeClass("hide");
            $(".left-result .code")[0].typewriter();
            setTimeout(function() {
                $(".left-result .name").removeClass("hide");
                $(".left-result .name")[0].typewriter();
            }, 2000);
        }, 1000);
    }, 1000);
}

function changeRightResult(obj) {
    $(".right-result .code").html(obj.code);
    $(".right-result .name").html(obj.name);
    $(".right-result").removeClass("rotateInDownLeft");
    $(".right-result").addClass("rotateOutDownLeft");
    setTimeout(function() {
        $(".right-result").removeClass("rotateOutDownLeft");
        $(".right-result").addClass("hide rotateInDownLeft");
        $(".right-result .code,.right-result .name").addClass("hide");
    }, 1000);
    setTimeout(function() {
        $(".right-result").removeClass("hide");
        setTimeout(function() {
            $(".right-result .code").removeClass("hide");
            $(".right-result .code")[0].typewriter();
            setTimeout(function() {
                $(".right-result .name").removeClass("hide");
                $(".right-result .name")[0].typewriter();
            }, 2000);
        }, 1000);
    }, 1000);
}

function changeResult(result) {
    changeLeftResult(result[index]);
    index++;
    if (index > result.length - 1) {
        index = 0;
    }
    setTimeout(function() {
        changeRightResult(result[index]);
        index++;
        if (index > result.length - 1) {
            index = 0;
        }
    }, 4500);
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}</")>