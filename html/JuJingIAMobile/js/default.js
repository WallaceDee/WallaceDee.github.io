//root font-size
(function(doc, win) {
    "use strict";
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {
            var clientWidth = docEl.clientWidth;
            var htmlFontSize = 20;
            var designWidth = 375;
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

Date.prototype.format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
//根据日期(parameter:04/14)查找当前图片的index值
Array.prototype.indexOfByDate = function(el) {
    for (var i = 0, n = this.length; i < n; i++) {
        var temp = this[i].Title;
        if (temp === el) {
            return i;
        }
    }
    return -1;
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

//为加载的图片添加loading
;
(function($) {
    $.extend($.fn, {
        loadImageWithIndicator: function(imgUrl) {
            $.showIndicator();
            var temp = new Image();
            temp.src = imgUrl;
            var img = this;
            temp.onload = function() {
                img[0].setAttribute("src", imgUrl);
                $.hideIndicator();
            }
        }
    })
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

$(function() {

    //*****pubilc*****//
    $(document).on("click", ".scroll-to-top-btn", function() {
        $('.content').scrollTop(0);
    });

    //*****page-research*****//
    var all_list = new Array();
    var today = new Date().format("yyyy-MM-dd");
    var today_list = new Array();
    var min_day = new Date().getTime() - (86400000 * 28);

    $(document).on("pageInit", "#page-research", function(e, pageId, $page) {
        $("#curr-day-picker").calendar({
            //value: [today_list],
            maxDate: today,
            minDate: min_day,
            yearPicker: false,
            firstDay: 1,
            weekendDays: [5, 6],
            weekendDisable: true,
            dateFormat: "mm/dd"
        });
        $.ajax({
            url: "/Handler/GetArticleMorningByType.ashx",
            dataType: "json",
            async: false,
            data: {
                typeid: 1,
                size: 20
            },
            success: function(data) {
                all_list.push(data);
                today_list = data[0].CTime.substring(0, 10);
                $("#curr-day-picker").val(today_list.substring(5, 10).replace(/-/ig, "/"));
                //默认显示晨报
                //$("#tab1 .content-block img").loadImageWithIndicator(data[0].PicPath);
                var cur_day = $("#page-research #curr-day-picker").val();
                var arr_index = 0;
                //根据日期查找索引
                var arr_j_index = all_list[arr_index].indexOfByDate(cur_day);
                updateReseachImg(arr_index, arr_j_index);
            }
        });
        $.ajax({
            url: "/Handler/GetArticleByType.ashx",
            dataType: "json",
            async: false,
            data: {
                typeid: 5,
                size: 20
            },
            success: function(data) {
                all_list.push(data);
            }
        });
        $.ajax({
            url: "/Handler/GetArticleByType.ashx",
            dataType: "json",
            async: false,
            data: {
                typeid: 7,
                size: 20
            },
            success: function(data) {
                all_list.push(data);
            }
        });
    });

    function updateReseachImg(arr_index, arr_j_index) {
        if (arr_j_index != -1) {
            var data = all_list[arr_index][arr_j_index];
            $("#page-research .tabs img").eq(arr_index).loadImageWithIndicator(data.PicPath);
        } else {
            $.alert('该日没有资料！');
            //todo
        }
    }

    $(document).on("click", "#page-research .tab-link", function(event) {
        event.preventDefault();
        /* Act on the event */
        var cur_day = $("#page-research #curr-day-picker").val();
        var arr_index = $(this).index();
        //根据日期查找索引
        var arr_j_index = all_list[arr_index].indexOfByDate(cur_day);

        updateReseachImg(arr_index, arr_j_index);
    });

    $(document).on('change', '#page-research #curr-day-picker', function(event) {
        event.preventDefault();
        /* Act on the event */
        var cur_day = $("#page-research #curr-day-picker").val();
        var arr_index = $("#page-research .tab-link.active").index();
        //根据日期查找索引
        var arr_j_index = all_list[arr_index].indexOfByDate(cur_day);

        updateReseachImg(arr_index, arr_j_index);
    });

    //*****page-videos*****//
    $(document).on("pageInit", "#page-videos", function(e, pageId, $page) {
        $.ajax({
            url: "/Handler/GetArticleByType.ashx",
            async: false,
            data: {
                typeid: 8,
                size: 1
            },
            dataType: "json",
            success: function(data) {
                if (data != null) {
                    $("#page-videos #hjsdb-content .card-content-inner").css("background-image", "url(" + data[0].PicPath + ")");
                    $("#page-videos #hjsdb-content h1").html(data[0].Title);
                    $("#page-videos #hjsdb-content p").html(data[0].Content);
                    $("#page-videos #hjsdb-content .card-content-inner>a").attr("href", "video_play.html?id=" + data[0].Id);
                } else {
                    $("#page-videos #hjsdb-content").css("display", "none");
                    $("#page-videos .bar-nav #hjsdb-more").css("display", "none");
                }
            }
        });
        $.ajax({
            url: "/Handler/GetArticleByType.ashx",
            async: false,
            data: {
                typeid: 12,
                size: 1
            },
            dataType: "json",
            success: function(data) {
                if (data != null) {
                    $("#page-videos #jrsd-content .card-content-inner").css("background-image", "url(" + data[0].PicPath + ")");
                    $("#page-videos #jrsd-content h1").html(data[0].Title);
                    $("#page-videos #jrsd-content p").html(data[0].Content);
                    $("#page-videos #jrsd-content .card-content-inner>a").attr("href", "video_play.html?id=" + data[0].Id);
                } else {
                    $("#page-videos #jrsd-content").css("display", "none");
                    $("#page-videos .bar-nav #jrsd-more").css("display", "none");
                }
            }
        });
        $.ajax({
            url: "/Handler/GetArticleByType.ashx",
            async: false,
            data: {
                typeid: 13,
                size: 1
            },
            dataType: "json",
            success: function(data) {
                if (data != null) {
                    $("#page-videos #szzb-content .card-content-inner").css("background-image", "url(" + data[0].PicPath + ")");
                    $("#page-videos #szzb-content h1").html(data[0].Title);
                    $("#page-videos #szzb-content p").html(data[0].Content);
                    $("#page-videos #szzb-content .card-content-inner>a").attr("href", "video_play.html?id=" + data[0].Id);
                } else {
                    $("#page-videos #szzb-content").css("display", "none");
                    $("#page-videos .bar-nav #szzb-more").css("display", "none");
                }
            }
        });
        // $.ajax({
        //     url: "/Handler/GetArticleByType.ashx",
        //     async: false,
        //     data: {
        //         typeid: 14,
        //         size: 1
        //     },
        //     dataType: "json",
        //     success: function(data) {
        //         if (data != null) {
        //             $("#page-videos #zzjt-content .card-content-inner").css("background-image", "url(" + data[0].PicPath + ")");
        //             $("#page-videos #zzjt-content h1").html(data[0].Title);
        //             $("#page-videos #zzjt-content p").html(data[0].Content);
        //             $("#page-videos #zzjt-content .card-content-inner>a").attr("href", "video_play.html?id=" + data[0].Id);
        //         } else {
        //             $("#page-videos #zzjt-content").css("display", "none");
        //             $("#page-videos .bar-nav #zzjt-more").css("display", "none");
        //         }
        //     }
        // });
    });

    $(document).on('click', '#page-videos .play-btn', function(event) {
        event.preventDefault();
        /* Act on the event */
        var temp_iframe_html = ' <iframe frameborder="0"  src="' + $(this).attr("data-url") + '" allowfullscreen scrolling="no"></iframe>';
        var temp_title = $(this).parent().find('.bottom-col h1').text();
        var temp_desc = $(this).parent().find('.bottom-col p').text();

        $("#page-video-play .video-title").html(temp_title);
        $("#page-video-play .desc-wrapper").html(temp_desc);
        $("#page-video-play .video-content").html(temp_iframe_html);

    });

    //*****page-video-play*****//
    $(document).on("pageInit", "#page-video-play", function(e, pageId, $page) {
        var curr_id = GetQueryString("id");
        $.ajax({
            url: "/Handler/GetArticleById.ashx",
            data: {
                id: curr_id
            },
            dataType: "json",
            success: function(data) {
                var temp_iframe_html = ' <iframe frameborder="0" data-vidtype="2" src="' + data.VideoPath + '" allowfullscreen></iframe>';
                var temp_title = data.Title;
                var temp_desc = data.Content;

                $("#page-video-play .video-title").html(temp_title);
                $("#page-video-play .desc-wrapper").html(temp_desc);
                $("#page-video-play .video-content").html(temp_iframe_html);
            }
        });
    });

    //*****page-video-list*****//
    $(document).on("pageInit", "#page-video-list", function(e, pageId, $page) {
        var curr_type = GetQueryString("type");
        $.ajax({
            url: "/Handler/GetArticleByType.ashx",
            data: {
                typeid: curr_type,
                size: 15
            },
            dataType: "json",
            success: function(data) {
                var temp_html = new String();
                for (var i = 0; i < data.length; i++) {
                    temp_html += '<li>\
                                <a href="video_play.html?id=' + data[i].Id + '" class="item-link item-content">\
                                            <div class="item-inner ">\
                                                <div class="item-title">' + data[i].Title + '</div>\
                                            </div>\
                                     </a>\
                            </li>';
                }
                $("#page-video-list .video-list").html(temp_html);
            }
        });
    });

    //*****page-product*****//
    $(document).on("click", "#page-product .nav-list-wrapper a", function() {
        var index = $(this).parent().index();

        $("#page-product-desc .tabs .tab.active").removeClass("active");
        $("#page-product-desc .tabs .tab").eq(index).addClass('active');
        $("#page-product-desc .nav-list-wrapper .tab-link.active").removeClass("active");
        $("#page-product-desc .nav-list-wrapper li").eq(index).find('a').addClass("active");
    });

    //*****page-reference*****//
    $(document).on("pageInit", "#page-reference", function(e, pageId, $page) {
        var isIOS = $.device.ios;
        $.ajax({
            url: "/Handler/GetArticleByType.ashx",
            data: {
                typeid: 10,
                size: 15
            },
            dataType: "json",
            success: function(data) {
                var path = new String();
                var temp_html = new String();
                var viewerUrl = "http://www.gu0018.com/mobile/plugin/pdfViewer/viewer.html?file=";
                for (var i = 0; i < data.length; i++) {
                    if (isIOS) {
                        path = data[i].VideoPath
                    } else {
                        path = viewerUrl + data[i].VideoPath;
                    }
                    temp_html += '<li>\
                                <a href="' + path + '" class="item-link item-content">\
                                            <div class="item-inner ">\
                                                <div class="item-title">' + data[i].Title + '</div>\
                                            </div>\
                                     </a>\
                            </li>';
                }
                $("#page-reference .reference-list").html(temp_html);
            }
        });
    });
    //*****page-course*****//
    $(document).on("pageInit", "#page-course", function(e, pageId, $page) {
        $.ajax({
            url: "/mobile/activity/course/js/CourseList.json",
            dataType: "json",
            success: function(data) {
                var temp_basic_list = data.basic;
                var basic_list_html = new String();
                var temp_senior_list = data.senior;
                var senior_list_html = new String();
                for (var i = 0; i < temp_basic_list.length; i++) {
                    basic_list_html += '<li><a href="activity/course/' + temp_basic_list[i].path + '/index.html"><img src="activity/course/' + temp_basic_list[i].path + '/cover.jpg" alt="' + temp_basic_list[i].name + '"></a></li>'
                }
                for (var i = 0; i < temp_senior_list.length; i++) {
                    senior_list_html += '<li><a href="activity/course/' + temp_senior_list[i].path + '/index.html"><img src="activity/course/' + temp_senior_list[i].path + '/cover.jpg" alt="' + temp_senior_list[i].name + '"></a></li>'
                }
                $("#page-course #tab1 ul").html(basic_list_html);
                $("#page-course #tab2 ul").html(senior_list_html);
            }
        });
    });

    //*****page-broadcast*****//
    // 每次加载添加多少条目
    var broadcast_itemsPerLoad = 20;

    // 最多可加载的条目
    var broadcast_maxItems = 100;
    var broadcast_loading = false;
    var broadcast_lastIndex = $('#page-broadcast .list-container li').length;

    function addBroadcastItems(number, lastIndex) {
        // 生成新条目的HTML
        var html = '';
        for (var i = broadcast_lastIndex; i < broadcast_lastIndex + number; i++) {
            html += '<li class="item-content yellow-message">\
                            <div class="item-inner">\
                                <div class="item-title-row">\
                                    <div class="item-title"></div>\
                                    <div class="item-after">17:14</div>\
                                </div>\
                                <div class="item-text">此处是文本内容' + i + '</div>\
                            </div>\
                        </li>';
        }
        // 添加新条目
        $('#page-broadcast .infinite-scroll .list-container').append(html);
    }

    $(document).on('infinite', "#page-broadcast", function() {
        // 如果正在加载，则退出
        if (broadcast_loading) return;
        // 设置flag
        broadcast_loading = true;
        // 模拟1s的加载过程
        setTimeout(function() {
            // 重置加载flag
            broadcast_loading = false;
            if (broadcast_lastIndex >= broadcast_maxItems) {
                // 加载完毕，则注销无限加载事件，以防不必要的加载
                $.detachInfiniteScroll($('#page-broadcast .infinite-scroll'));
                // 删除加载提示符
                $('#page-broadcast .infinite-scroll-preloader').remove();
                return;
            }
            addBroadcastItems(broadcast_itemsPerLoad, broadcast_lastIndex);
            // 更新最后加载的序号
            broadcast_lastIndex = $('#page-broadcast .list-container li').length;
            $.refreshScroller();
        }, 1000);
    });

    // 添加'refresh'监听器
    $(document).on('refresh', '#page-broadcast .pull-to-refresh-content', function(e) {
        setTimeout(function() {
            console.log(1);
            // 加载完毕需要重置
            $.pullToRefreshDone('#page-broadcast .pull-to-refresh-content');
        }, 1000);
    });


    // 最多可加载的条目
    var trends_maxItems = 100;
    var trends_loading = false;
    var trends_lastIndex = $('#page-trends .list-container li').length;

    function addTrendsItems(number, lastIndex) {
        // 生成新条目的HTML
        var html = '';
        for (var i = trends_lastIndex; i < trends_lastIndex + number; i++) {
            html += '<li class="item-content orange-message">\
                            <div class="item-inner">\
                                <div class="item-title-row">\
                                    <div class="item-title"></div>\
                                    <div class="item-after">17:14</div>\
                                </div>\
                                <div class="item-text">此处是文本内容' + i + '</div>\
                            </div>\
                        </li>';
        }
        // 添加新条目
        $('#page-trends .infinite-scroll .list-container').append(html);
    }

    $(document).on('infinite', "#page-trends", function() {
        // 如果正在加载，则退出
        if (trends_loading) return;
        // 设置flag
        trends_loading = true;
        // 模拟1s的加载过程
        setTimeout(function() {
            // 重置加载flag
            trends_loading = false;
            if (trends_lastIndex >= broadcast_maxItems) {
                // 加载完毕，则注销无限加载事件，以防不必要的加载
                $.detachInfiniteScroll($('#page-trends .infinite-scroll'));
                // 删除加载提示符
                $('#page-trends .infinite-scroll-preloader').remove();
                return;
            }
            addTrendsItems(itemsPerLoad, trends_lastIndex);
            // 更新最后加载的序号
            trends_lastIndex = $('#page-trends .list-container li').length;
            $.refreshScroller();
        }, 1000);
    });

    // 添加'refresh'监听器
    $(document).on('refresh', '#page-trends .pull-to-refresh-content', function(e) {
        setTimeout(function() {
            console.log(1);
            // 加载完毕需要重置
            $.pullToRefreshDone('#page-trends .pull-to-refresh-content');
        }, 1000);
    });



    var myPhotoBrowserStandalone = $.photoBrowser({
        photos: ['http://www.33lc.com/uploadfile/2016/1216/20161216041523112.png']
    });
    $(document).on('click', '#page-broadcast img,#page-broadcast img', function(event) {
        event.preventDefault();
        /* Act on the event */
        myPhotoBrowserStandalone.open();
    });
    //*****page-vip*****//
    $(document).on("pageInit", "#page-vip", function(e, id, page) {




    });
    $(document).on("pageInit", "#page-vip-login", function(e, id, page) {
        // var noneType = ($("#page-vip-login>.content").attr("class").indexOf("type")) == -1;
        // if (noneType) {
        //     $.router.back();
        // }
        var verifyCode = new GVerify({ id: "verify-code", type: "number" });
    });
    $(document).on('click', '#page-vip .nav-list-wrapper button', function(event) {
        event.preventDefault();
        /* Act on the event */
        var type = $(this).parents("a").attr("data-type");
        $.router.load("#page-vip-login");
        var ex_type = $("#page-vip-login>.content").attr("class").match(/([^\s])+(-type)/ig, "");
        if (ex_type != null) {
            ex_type = ex_type[0];
        } else {
            ex_type = "";
        }
        $("#page-vip-login>.content").removeClass(ex_type).addClass(type);
    });

    //*****page-product-professional*****//
    window.professional_tab1 = new Object();
    window.professional_tab2 = new Object();
    $(document).on("pageInit", "#page-product-professional", function(e, id, page) {
        window.professional_tab1 = $("#page-product-professional #tab1 .swiper-container").swiper({
            onTouchEnd: function(swiper) {
                var index = $("#page-product-professional #tab1 .swiper-container").find(".swiper-slide-active").index();
                $("#page-product-professional #tab1 .swpier-nav a").removeClass("active");
                $("#page-product-professional #tab1 .swpier-nav a").eq(index).addClass("active");
            }
        });
        window.professional_tab2 = $("#page-product-professional #tab2 .swiper-container").swiper({
            onTouchEnd: function(swiper) {
                var index = $("#page-product-professional #tab2 .swiper-container").find(".swiper-slide-active").index();
                $("#page-product-professional #tab2 .swpier-nav a").removeClass("active");
                $("#page-product-professional #tab2 .swpier-nav a").eq(index).addClass("active");
            }
        });
        setTimeout(function() { $("#page-product-professional #tab2").removeClass("active") }, 0);
    });
    $(document).on("click", "#page-product-professional #tab1 .swpier-nav a", function(event) {
        /* Act on the event */
        var index = $(this).index();
        window.professional_tab1.slideTo(index);
        $("#page-product-professional #tab1 .swpier-nav a").removeClass("active");
        $("#page-product-professional #tab1 .swpier-nav a").eq(index).addClass("active");
    });
    $(document).on("click", "#page-product-professional #tab2 .swpier-nav a", function(event) {
        /* Act on the event */
        var index = $(this).index();
        window.professional_tab2.slideTo(index);
        $("#page-product-professional #tab2 .swpier-nav a").removeClass("active");
        $("#page-product-professional #tab2 .swpier-nav a").eq(index).addClass("active");
    });

    $(document).on("click", "#page-product-professional table a", function(event) {
        var modal_data = {
            title: "中国金融科技与区块链创新峰",
            text: "中国金融科技与区块链创新峰会2017年度盛会将于2017年5月25-26号在上海举行，大会汇聚来自政府协会、银行、互联网金融、消费金融、P2P、电商、大数据、支付平台、人工智能、征信公司、投资公司、保险、律所、证券、基金、 科研院校等1000余位参会代表，共同探讨金融科技与区块链创新话题。大会以“融合·创新·共赢”为理念，以“区块链助力金融科技的创新发展”为核心内容，重点讨论区块链技术在金融业的创新与应用发展。"
        }
        /* Act on the event */
        $.modal({
            extraClass: "comment-modal",
            title: modal_data.title,
            text: modal_data.text,
            afterText: '<a onclick="$.closeModal();"><i class="icon icon-close"></i></a>'
        });
    });

    //*****page-product-private*****//
    window.private_tab1 = new Object();
    window.private_tab2 = new Object();
    window.private_tab3 = new Object();
    $(document).on("pageInit", "#page-product-private", function(e, id, page) {
        window.private_tab1 = $("#page-product-private #tab1 .swiper-container").swiper({
            onTouchEnd: function(swiper) {
                var index = $("#page-product-private #tab1 .swiper-container").find(".swiper-slide-active").index();
                $("#page-product-private #tab1 .swpier-nav a").removeClass("active");
                $("#page-product-private #tab1 .swpier-nav a").eq(index).addClass("active");
            }
        });
        window.private_tab2 = $("#page-product-private #tab3 .swiper-container").swiper({
            onTouchEnd: function(swiper) {
                var index = $("#page-product-private #tab3 .swiper-container").find(".swiper-slide-active").index();
                $("#page-product-private #tab3 .swpier-nav a").removeClass("active");
                $("#page-product-private #tab3 .swpier-nav a").eq(index).addClass("active");
            }
        });
        window.private_tab3 = $("#page-product-private #tab4 .swiper-container").swiper({
            onTouchEnd: function(swiper) {
                var index = $("#page-product-private #tab4 .swiper-container").find(".swiper-slide-active").index();
                $("#page-product-private #tab4 .swpier-nav a").removeClass("active");
                $("#page-product-private #tab4 .swpier-nav a").eq(index).addClass("active");
            }
        });
        setTimeout(function() {
            $("#page-product-private #tab3").removeClass("active");
            $("#page-product-private #tab4").removeClass("active")
        }, 0);
    });
    $(document).on("click", "#page-product-private #tab1 .swpier-nav a", function(event) {
        /* Act on the event */
        var index = $(this).index();
        console.log(index);
        window.private_tab1.slideTo(index);
        $("#page-product-private #tab1 .swpier-nav a").removeClass("active");
        $("#page-product-private #tab1 .swpier-nav a").eq(index).addClass("active");
    });
    $(document).on("click", "#page-product-private #tab3 .swpier-nav a", function(event) {
        /* Act on the event */

        var index = $(this).index();
        console.log(index);
        window.private_tab2.slideTo(index);
        $("#page-product-private #tab3 .swpier-nav a").removeClass("active");
        $("#page-product-private #tab3 .swpier-nav a").eq(index).addClass("active");
    });
    $(document).on("click", "#page-product-private #tab4 .swpier-nav a", function(event) {
        /* Act on the event */
        var index = $(this).index();
        window.private_tab3.slideTo(index);
        $("#page-product-private #tab4 .swpier-nav a").removeClass("active");
        $("#page-product-private #tab4 .swpier-nav a").eq(index).addClass("active");
    });

    $(document).on("click", "#page-product-private table a", function(event) {
        var modal_data = {
            title: "中国金融科技与区块链创新峰",
            text: "中国金融科技与区块链创新峰会2017年度盛会将于2017年5月25-26号在上海举行，大会汇聚来自政府协会、银行、互联网金融、消费金融、P2P、电商、大数据、支付平台、人工智能、征信公司、投资公司、保险、律所、证券、基金、 科研院校等1000余位参会代表，共同探讨金融科技与区块链创新话题。大会以“融合·创新·共赢”为理念，以“区块链助力金融科技的创新发展”为核心内容，重点讨论区块链技术在金融业的创新与应用发展。"
        }
        /* Act on the event */
        $.modal({
            extraClass: "comment-modal",
            title: modal_data.title,
            text: modal_data.text,
            afterText: '<a onclick="$.closeModal();"><i class="icon icon-close"></i></a>'
        });
    });
    $(document).on("pageInit", "#page-join-us", function(e, id, page) {
        alert(window.location.href);
        AOS.init();
    });


    // page-team

    // 最多可加载的条目
    var team_pageIndex = 1;
    var team_loading = false;
    var team_itemsPerLoad = 10;

    var team_maxItems = 0;


    var team_lastIndex = 0;


    function addTeamItems(number, lastIndex) {
        // 生成新条目的HTML
        var html = '';
        $.ajax({
            url: "/Handler/GetEmployee.ashx",
            data: {
                page: team_pageIndex
            },
            success: function(data) {
                var temp = data;
                temp = temp.replace(/'/g, "\"");
                //测试
                data = JSON.parse(temp);
                team_maxItems = data.Total * 1;
                for (var i = 0; i < data.Data.length; i++) {
                    html += '<li class="card">\
                            <div class=" item-content">\
                                <div class="item-media"><span style="background-image: url(' + data.Data[i].ImagePath + ');"></span></div>\
                                <div class="item-inner">\
                                    <div class="item-title name">' + data.Data[i].Name + '</div>\
                                    <div class="item-title t-title">' + data.Data[i].Position + '</div>\
                                    <div class="item-title number">' + data.Data[i].EID + '</div>\
                                </div>\
                            </div>\
                            <div class="item-text">' + data.Data[i].Motto + '</div>\
                        </li>';
                }
                // 添加新条目
                $('#page-team .infinite-scroll .list-container').append(html);


                team_pageIndex++;
                team_lastIndex = $('#page-team .list-container li').length;
                team_loading = false;
                if (team_lastIndex >= team_maxItems) {
                    $.detachInfiniteScroll($('#page-team .infinite-scroll'));
                    $('#page-team .infinite-scroll-preloader').remove();
                    return;
                }
                $.refreshScroller();
            }
        });
    }

    $(document).on("pageInit", "#page-team", function() {
        //清除html
        $('#page-team .infinite-scroll-bottom .list-block ul').html("");
        //重置参数
        team_pageIndex = 1;
        // 加载flag
        team_loading = false;
        // 最多可加载的条目
        team_maxItems = 0;
        // 每次加载添加多少条目
        team_itemsPerLoad = 10;
        team_lastIndex = 0;
        //预先加载
        addTeamItems(team_itemsPerLoad, team_lastIndex);

    });


    $(document).on('infinite', "#page-team", function() {
        // 如果正在加载，则退出
        if (team_loading) return;
        // 设置flag
        team_loading = true;
        addTeamItems(team_itemsPerLoad, team_lastIndex);
    });
    //*****init*****//
    $.init();
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
            title: "聚牛财经-股市牛人集中营",
            desc: "湖南巨景证券投资顾问有限公司（简称“巨景投顾”），成立于1993年，是我国最早开展证券投资咨询业务的元老级咨询公司之一，也是中国证监会首批授权证券投资咨询机构[ZX0018]。在中国证券业协会和中国证监会官网上都有公司资质备案。2013年初，公司由北京迁址湖南长沙，并更名为巨景投顾，由此步入再次腾飞的发展新阶段，巨景投顾正致力于成为中国投资顾问行业走向正规化、专业化、实效化的指向标！",
            link: "http://www.gu0018.com/mobile/index.html",
            imgUrl: "http://www.gu0018.com/mobile/images/share.jpg"
        };
        wx.onMenuShareAppMessage(shareData);
        wx.onMenuShareTimeline(shareData);
    });
});