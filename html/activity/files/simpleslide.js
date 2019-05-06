$(function () {
    $('.btn_case>li').mouseover(function () {
        $(this).parent().children('li').removeClass("on");
        $(this).parent().next().children('li').removeClass("on");
        $(this).addClass("on");
        $(this).parent().next().children('li').eq($(this).index()).addClass("on");
    });

    $('.slide_case>ul>li').mouseover(function () {
        $(this).parent().children('li').removeClass("on");
        $(this).parent().parent().parent().find(".case").children('ul').children('li').removeClass("on");
        $(this).addClass("on");
        $(this).parent().parent().parent().find(".case").children('ul').children('li').eq($(this).index()).addClass("on");
    });

});