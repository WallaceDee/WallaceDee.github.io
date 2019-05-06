(function($) {
    $.extend({
        isCollsion: function(x1, y1, x2, y2, x3, y3, x4, y4) {
            if (
                (x1 > x3 && x1 > x4) ||
                (x3 > x1 && x3 > x2) ||
                (y1 > y3 && y1 > y4) ||
                (y3 > y1 && y3 > y2)
            ) {
                return false;
            } else {
                return true;
            }
        }
    });
    $.fn.isVisable = function(opt) {
        opt = $.extend({
            offsetTop: 0,
            offsetLeft: 0,
            addTop: 0,
            addRight: 0,
            addBottom: 0,
            addLeft: 0,
        }, opt);
        var me = $(this),
            srcInfo = {
                begin_left: (me.offset().left + opt.offsetLeft + opt.addLeft),
                begin_top: (me.offset().top + opt.offsetTop + opt.addTop)
            }
        srcInfo.end_left = (srcInfo.begin_left + me.width() + opt.addRight);
        srcInfo.end_top = (srcInfo.begin_top + me.height() + opt.addBottom);

        winInfo = {
            begin_left: $(window).scrollLeft(),
            begin_top: $(window).scrollTop()
        }
        winInfo.end_left = (winInfo.begin_left + $(window).width());
        winInfo.end_top = (winInfo.begin_top + $(window).height());
        return $.isCollsion(
            srcInfo.begin_left, srcInfo.begin_top, srcInfo.end_left, srcInfo.end_top,
            winInfo.begin_left, winInfo.begin_top, winInfo.end_left, winInfo.end_top
        );
    }
})($);
//初始化swiper,绑定导航图标，左右按键点击事件
var mySwiper = $(".swiper-container").swiper({
    onSlideChangeEnd: function(swiper) {
        var index = swiper.activeIndex;
        $(".pagination span").removeClass("active");
        $(".pagination span").eq(index).addClass("active");
    }
});
$(".icon-circle-left").on("click", function(e) {
    e.preventDefault();
    mySwiper.swipePrev();
});
$(".icon-circle-right").on("click", function(e) {
    e.preventDefault();
    mySwiper.swipeNext();
});

var activeIndex = 0;
$(".pagination span").hover(function() {
    $(".pagination span").removeClass("active");
    $(this).addClass("active");
    var index = $(this).index();
    mySwiper.swipeTo(index);
});

//绑定搜索栏回车搜索
$('.search-bar input').keydown(function(e) {
    /* Act on the event */
    if (e.keyCode == 13) {
        $(".search-bar a").click();
    }
});

// 根据input是否为空改变搜索按钮样式
$('.search-bar input').change(function(event) {
    /* Act on the event */
    if ($(this).val() != "") {
        $(this).addClass("has-value");
    } else {
        $(this).removeClass("has-value");
    }
});

//根据滚动高度改变header样式，开始画圆动画
window.one = false;
$(window).scroll(function(event) {
  console.log($(".main-banner").isVisable());
    if ($(".main-banner").isVisable()) {
        $(".header").removeClass("none-transparent");
    } else {
        $(".header").addClass("none-transparent");
    }
    if ($(".co-wrapper").isVisable() && !window.one) {
        window.one = true;
        $(".co-wrapper div").prepend('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="100%" height="210"><circle cx="95" cy="105" r="90" stroke-width="10" stroke="url(#green_blue)" fill="none" class="circle-load-svg"></circle></svg>');
    }
});
//banner大图视差插件初始化
$('.main-banner').iosParallax({
    movementFactor: 50
});