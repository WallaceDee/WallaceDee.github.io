/**
 * Created by 84694 on 2017/9/26.
 */
var todaySubscribe = $('#today-subscribe-box');
var monthSubscribe = $('#month-subscribe-box');
var historySubscribe = $('#history-subscribe-box');

function todaySubscribeTab(obj) {
    $(obj).addClass('highlight').siblings().removeClass('highlight');
    todaySubscribe.show();
    monthSubscribe.hide();
    historySubscribe.hide();
}
function monthSubscribeTab(obj) {
    $(obj).addClass('highlight').siblings().removeClass('highlight');
    todaySubscribe.hide();
    monthSubscribe.show();
    historySubscribe.hide();
}
function historySubscribeTab(obj) {
    $(obj).addClass('highlight').siblings().removeClass('highlight');
    todaySubscribe.hide();
    monthSubscribe.hide();
    historySubscribe.show();
}