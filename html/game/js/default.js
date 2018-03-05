(function() {
    var isWeixin = /MicroMessenger/i.test(navigator.userAgent);
    //root font-size
    (function(doc, win) {
        "use strict";
        var docEl = doc.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            recalc = function() {
                var clientWidth = docEl.clientWidth;
                var htmlFontSize = 20; //³õÊ¼´óÐ¡
                var designWidth = 375; //Éè¼Æ¸å¿í¶È
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

    var $table = $("table.turntable");

    var rank_list = [];

    var $tr = $table.find("tr");
    $tr.eq(0).find("td").each(function(index, el) {
        rank_list.push(this);
    });
    for (var i = 1; i < $tr.length - 1; i++) {
        rank_list.push($tr.eq(i).find("td").last()[0])
    }
    var reverse_list = []
    $tr.eq($tr.length - 1).find("td").each(function(index, el) {
        reverse_list.push(this);
    });
    rank_list = rank_list.concat(reverse_list.reverse());

    for (var i = $tr.length - 2; i > 0; i--) {
        rank_list.push($tr.eq(i).find("td").first()[0])
    }

    var my_award = JSON.parse(localStorage.getItem("award"));
    var step = 100;


    var index = -1;
    var isRolling = false;
    var odds = [0.2, 0.4, 0.55, 0.7, 0.8, 0.9, 0.95, 1];
    var award_index = [5, 6, 2, 7, 1, 3, 0, 4];

    function getRank(cheat) {
        var r = Math.random();
        var result = 0;
        if (r <= odds[0]) {
            result = award_index[0];
        } else if (odds[0] < r && r <= odds[1]) {
            result = award_index[1];
        } else if (odds[1] < r && r <= odds[2]) {
            result = award_index[2];
        } else if (odds[2] < r && r <= odds[3]) {
            result = award_index[3];
        } else if (odds[3] < r && r <= odds[4]) {
            result = award_index[4];
        } else if (odds[4] < r && r <= odds[5]) {
            result = award_index[5];
        } else if (odds[5] < r && r <= odds[6]) {
            result = award_index[6];
        } else if (odds[6] < r && r <= odds[7]) {
            result = award_index[7];
        }
        if (cheat && (result === 3 || result === 7)) {
            return getRank(true);
        } else {
            return result;
        }
    }


    //0=3000,
    //1=2000,
    //2=1000,
    //3=锦囊,
    //4=5000,
    //5=500,
    //6=800,
    //7寻龙
    function roll() {

        var ms = 1;
        if (index > 8) {
            ms = 100;
        }
        if (index > 16) {
            ms = 150;
        } else if (index > 24) {
            ms = 200;
        } else if (index > 32) {
            ms = 1000;
        } else if (index > 40) {
            ms = 2000;
        }
        index++;
        var i = index % 8;
        $(".turntable .active").removeClass("active");
        $(rank_list[i]).addClass('active');
        if ((index > 40) && (i === rank)) {
            setTimeout(function() {
                $(".go-btn").prop("disabled", false);
                var temp = [];
                if (localStorage.getItem("award") !== null) {
                    temp = JSON.parse(localStorage.getItem("award"));
                }
                temp.push($(".turntable td.active").attr("class").split(" ")[0]);
                localStorage.setItem("award", JSON.stringify(temp));

                openPopup();
            }, 800);
            return false;
        }

        setTimeout(function() { roll() }, ms);
    }


    function openPopup() {
        var $award = $(".turntable td.active");

        var award_name = $award.attr("title");
        var award_body = $award.clone().addClass("active");
        $(".popup-drop .tab1 table tr").html(award_body);
        $(".popup-drop .tab1 p span").html(award_name);

        my_award = JSON.parse(localStorage.getItem("award"));
        if (my_award !== null) {
            $(".tab2 ul").html("");
            for (var i = 0; i < my_award.length; i++) {

                $(".tab2 ul").append("<li><table><tbody><tr></tr></tbody></table></li>");
                $(".tab2 ul li:last tr").append($(".turntable ." + my_award[i]).clone().addClass("active"));
                console.log($(".turntable ." + my_award[i]));
            }
        }

        $(".popup-drop").removeClass("hide");
        $("body").css("overflow", "hidden");

    }

    var rank = -1;

    $(".go-btn").click(function(event) {
        var f = JSON.parse(localStorage.getItem("award")) || [];
        if (f.length > 1) {
            $(".tab1,.tab2").toggleClass("hide");
            $(".popup-drop a").css({
                margin: '0 auto',
                float: 'none'
            });
            $(".popup-drop a.record,.tab1").remove();
            $(".tab2").removeClass("hide");
            openPopup();
            return false;
        } else {
            $(".tab1").removeClass("hide");
            $(".tab2").addClass("hide");

            $(".popup-drop a.record").html("中奖纪录");

        }
        if (!isWeixin) {
            alert("请在微信中打开！");
            return false;
        }
        rank = getRank(false);
        var money_award = "a1a2a3a5a6a6";
        my_award = JSON.parse(localStorage.getItem("award"));
        if (my_award !== null) {
            if (money_award.indexOf(my_award[0]) === -1) {
                rank = getRank(true);
            }
        }
        index = 0;
        $(".go-btn").prop("disabled", true);
        roll();
    });


    $(".popup-drop a.close").click(function(event) {
        /* Act on the event */
        $("body").css("overflow", "auto");
        $(this).parents(".popup-drop").addClass("hide");
    });
    $(".popup-drop a.record").click(function(event) {
        /* Act on the event */
        if ($(".tab2").hasClass("hide")) {
            $(this).html("返回");
        } else {
            $(this).html("中奖纪录");
        }
        $(".tab1,.tab2").toggleClass("hide");
    });


    if (my_award !== null && my_award.length >= 2) {
        openPopup();
        $(".tab1,.tab2").toggleClass("hide");
        $(".popup-drop a").css({
            margin: '0 auto',
            float: 'none'
        });
        $(".popup-drop a.record").remove();
    }

    setInterval(function() {
        $(".list-content").find("ul:first").animate({
            marginTop: "-16px"
        }, 500, function() {
            $(this).css({ marginTop: "0" }).find("li:first").appendTo(this);
        });
    }, 2000);

    var count = 0;
    if (localStorage.getItem("count") !== null) {
        count = localStorage.getItem("count");
    } else { count = parseInt($(".count em").text()); }

    function countNum() {
        count++;
        localStorage.setItem("count", count);
        $(".count em").html(count);
    }
    countNum();
    setInterval(function() {
        countNum();
    }, 2000);
})();