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

function getParameter(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

$(function() {
    'use strict';


    /*****page-index*****/
    var time = 10; // time in seconds
    var $progressBar,
        $bar,
        $elem,
        isPause,
        tick,
        percentTime;

    function progressBar(elem) {
        $elem = elem;
        $progressBar = $("<div>", {
            class: "swiper-pagination-progress"
        });
        $bar = $("<span>", {
            class: "swiper-pagination-progressbar"
        });
        $elem.paginationContainer.after($progressBar.append($bar));
        start();
    }

    function start() {
        percentTime = 0;
        isPause = false;
        tick = setInterval(interval, 10);
    };

    function interval() {
        if (isPause === false) {
            percentTime += 1 / time;
            $bar.css({
                width: percentTime + "%"
            });
            if (percentTime >= 100) {
                $elem.slideNext();
            }
        }
    }

    function moved() {
        clearTimeout(tick);
        start();
    }

    $(document).on("keyup", ".counter input", function() {
        if (this.value.length == 1) {
            this.value = this.value.replace(/[^1-9]/g, '')
        } else {
            this.value = this.value.replace(/\D/g, '')
        }
        cartSum();
    });

    $(document).on("blur", ".counter input", function() {
        if (this.value == "") {
            this.value = 1;
        }
        cartSum();
    });

    $(document).on("click", ".counter .minus", function() {
        var $counter = $(this).next("input");
        if ($counter.val() != 1) {
            $counter.val(parseInt($counter.val()) - 1);
            cartSum();
        }
    });

    $(document).on("click", ".counter .plus", function() {
        var $counter = $(this).prev("input");
        $counter.val(parseInt($counter.val()) + 1);
        cartSum();
    });



    $(document).on("pageInit", "#page-index", function(e, pageId, $page) {
        $("#page-index .swiper-container").swiper({
            loop: true,
            pagination: '.swiper-pagination',
            onInit: progressBar,
            onTouchStart: function() {
                isPause = true;
            },
            onTouchEnd: function() {
                isPause = false;
            },
            onSlideChangeStart: moved
        });
    });

    $(document).on("keydown", "#page-index #search", function(event) {
        if (event.keyCode == 13) {
            alert(1);
        }
    });


    /*****page-details*****/
    $(document).on("pageInit", "#page-details", function(e, pageId, $page) {
        $("#page-details .address input").cityPicker({});
        //预先加载20条
        addItems(itemsPerLoad, 0);
    });
    $(document).on("click", "#page-details .desc", function(event) {
        event.preventDefault();
        $(this).toggleClass("open");
    });
    $(document).on("click", "#page-details .address", function(event) {
        event.preventDefault();
    });
    $(document).on("click", "#page-details .show-all-comment", function(event) {
        event.preventDefault();
        $("#page-details .tab-link").removeClass("active");
        $("#page-details [href='#tab3']").addClass("active");
        $("#page-details .tab").removeClass("active");
        $("#page-details #tab3").addClass("active");
    });

    // 加载flag
    var loading = false;
    // 最多可加载的条目
    var maxItems = 100;

    // 每次加载添加多少条目
    var itemsPerLoad = 5;

    function addItems(number, lastIndex) {
        // 生成新条目的HTML
        var html = '';
        for (var i = lastIndex + 1; i <= lastIndex + number; i++) {
            html += ' <li class="weui-comment-item">\
                  <div class="weui-comment-li"> <i class="icon-four-stars"></i>\
                  </div>\
                  <div class="userinfo"> <strong class="nickname">张飞</strong> <span class="avatar" style="background-image: url(images/demo/demo01.jpg);"> </span>\
                      <div class="weui-comment-msg">啊实打实啊实打实啊实打实啊实打实啊实打实啊实打实啊实打实啊实打实啊实打实啊实打实啊实打实啊实打实啊实打实</div>\
                      <p class="time">2017-08-25</p>\
              </li>';
        }
        // 添加新条目
        $('#page-details .infinite-scroll-bottom .list-container').append(html);

    }

    // 上次加载的序号
    var lastIndex = itemsPerLoad;

    // 注册'infinite'事件处理函数
    $(document).on('infinite', '#page-details .infinite-scroll-bottom', function() {
        // 如果正在加载，则退出
        if (loading) return;
        // 设置flag
        loading = true;
        // 模拟1s的加载过程
        setTimeout(function() {
            // 重置加载flag
            loading = false;
            if (lastIndex >= maxItems) {
                // 加载完毕，则注销无限加载事件，以防不必要的加载
                $.detachInfiniteScroll($('#page-details .infinite-scroll'));
                // 删除加载提示符
                $('#page-details .infinite-scroll-preloader').remove();
                return;
            }
            // 添加新条目
            addItems(itemsPerLoad, lastIndex);
            // 更新最后加载的序号
            lastIndex = $('#page-details .list-container li').length;
            //容器发生改变,如果是js滚动，需要刷新滚动
            $.refreshScroller();
        }, 1000);
    });

    /*****page-cart*****/
    $(document).on("pageInit", "#page-cart", function(e, pageId, $page) {



    });

    $(document).on("click", "#page-cart .select-all", function(event) {
        var isAll = $(this).find("input").is(':checked');
        if (isAll) {
            $("#page-cart .product-item  input[type='checkbox']").prop("checked", false);
            $(".select-all").not(this).find("input").prop("checked", false);
        } else {
            $("#page-cart .product-item  input[type='checkbox']").prop("checked", true);
            $(".select-all").not(this).find("input").prop("checked", true);
        }
        cartSum();
    });

    $(document).on("click", "#page-cart .product-item label", function(event) {
        var isAll = true;
        var isNotAll = true;
        $("#page-cart .product-item label").not(this).find("input[type='checkbox']").each(function() {
            if (!$(this).is(':checked')) {
                isAll = false;
            }
        });
        $("#page-cart .product-item label").find("input[type='checkbox']").each(function() {
            if (!$(this).is(':checked')) {
                isNotAll = false;
            }
        });
        if (isAll) {
            $("#page-cart .select-all input").prop("checked", true);
        }
        if (isNotAll) {
            $("#page-cart .select-all input").prop("checked", false);
        }
        // cartSum()
        var total_count = 0;
        var total_price = 0;
        /****************************/
        var flag = !$(this).find("input[type='checkbox']").is(':checked');
        if (flag) {
            var item_list = $("#page-cart .product-item label").find("input[type='checkbox']:checked");
            item_list.push($(this).find("input[type='checkbox']")[0]);
            item_list = item_list.parents(".product-item");
            console.log(item_list);
        } else {
            var item_list = $("#page-cart .product-item label").not(this).find("input[type='checkbox']:checked").parents(".product-item");
        }
        /****************************/
        item_list.each(function() {
            var this_count = parseInt($(this).find(".count").text() || $(this).find("input[type='number']").val());
            total_count += this_count;
            var this_price = parseFloat($(this).find(".price").text()) * this_count;
            total_price += this_price;
        });
        console.log("count--" + total_count);
        console.log("price--" + total_price);
        $("#page-cart .total-price").html(total_price);
        $("#page-cart .total-count").html(total_count);
    });

    $(document).on("click", "#page-cart .cart-title .edit-btn", function(event) {
        event.preventDefault();
        /* Act on the event */
        var $this = $(this);
        if ($this.hasClass("editing")) {
            //复原
            $("#page-cart .product-item .delete-btn").remove();
            $("#page-cart .product-item .counter").each(function() {
                var $this = $(this);
                var c = parseInt($this.find("input").val());
                $this.after('<span class="count">' + c + '</span>');
                $this.remove();
            });
            $this.removeClass("editing");
        } else {
            //开启编辑
            $("#page-cart .product-item").append('<div class="item-media delete-btn">删除</div>');
            $("#page-cart .product-item .count").each(function() {
                //获取原有count
                var $this = $(this);
                var c = parseInt($this.text());
                $this.after('<div class="counter"><a class="minus">-</a><input type="number" value="' + c + '"><a class="plus">+</a></div>');
                $this.remove();
            });
            $this.addClass("editing");
        }
    });

    $(document).on("click", "#page-cart .delete-btn", function(event) {
        event.preventDefault();
        /* Act on the event */
        var $this = $(this);
        $.confirm("确定要删除这个商品吗？", function() {
            $this.parents(".product-item").remove();
            var isAll = true;
            var isNotAll = true;
            $("#page-cart .product-item input[type='checkbox']").each(function() {
                if (!$(this).is(':checked')) {
                    isAll = false;
                }
            });
            if (isAll) {
                $("#page-cart .select-all input").prop("checked", true);
            }
            //删除最后一个商品
            if ($(".product-item").length == 0) {
                $(".list-block").html('<h1 class="no-goods">购物车空空如也<br>去挑几件好货吧</h1>');
                $(".bar-nav-secondary").remove();
            }
            cartSum();
        });



    });

    function cartSum() {
        var total_count = 0;
        var total_price = 0;
        var item_list = $("#page-cart .product-item input[type='checkbox']:checked").parents(".product-item");
        item_list.each(function() {
            var this_count = parseInt($(this).find(".count").text() || $(this).find("input[type='number']").val());
            total_count += this_count;
            var this_price = parseFloat($(this).find(".price").text()) * this_count;
            total_price += this_price;
        });

        console.log("count--" + total_count);
        console.log("price--" + total_price);
        $("#page-cart .total-price").html(total_price);
        $("#page-cart .total-count").html(total_count);
    }


    /*****page-order*****/
    $(document).on("pageInit", "#page-order", function(e, pageId, $page) {

        $("#express-type").picker({
            cols: [{
                textAlign: 'center',
                values: ["快递 ￥0", "到店自提"]
            }]
        });

    });


    $(document).on("click", "#page-order .express-type-wrapper", function(event) {
        event.preventDefault();
        /* Act on the event */

        $("#express-type").picker("open");
    });


    /*****page-my-order*****/
    $(document).on("pageAnimationStart", "#page-my-order", function(e, pageId, $page) {
      var id= sessionStorage.current_tab;
      console.log(id);
      var current_tab=$(id);
      var current_tab_link=$("a[href='"+id+"']");
      $(".active").removeClass("active");
      current_tab.addClass("active");
      current_tab_link.addClass("active");

    });

    /*****page-user-center*****/
        $(document).on("click", "#page-user-center .order-block [data-href]", function(event) {
        event.preventDefault();
        /* Act on the event */
       sessionStorage.current_tab=$(this).attr("data-href");
        });

    /*****page-address*****/
    $(document).on("click", "#page-address .delete-btn", function(event) {
        event.preventDefault();
        /* Act on the event */
        $.confirm("确定要删除这个地址吗？", function() {


        });
    });
    $(document).on("pageInit", "#page-edit-address", function(e, pageId, $page) {
        $("#page-edit-address .city-picker").cityPicker({});
    });

    $(document).on("pageInit", "#page-add-address", function(e, pageId, $page) {
        $("#page-add-address .city-picker").cityPicker({});
    });

    /*****page-bespeak*****/

    $(document).on("pageInit", "#page-bespeak", function(e, pageId, $page) {
        $("#page-bespeak .product-picker").productPicker({});


        $(".fault-picker").picker({
            cols: [{
                textAlign: 'center',
                values: ["不制冷", "不通电"]
            }]
        });
        $("#date").calendar({
            value: ['2015-12-05']
        });
    });
    /*****init*****/
    $.init();
});