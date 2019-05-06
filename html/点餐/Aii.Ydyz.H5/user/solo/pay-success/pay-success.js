/**
 * Created by 84694 on 2017/9/26.
 */
var noticePay = $('#notice-pay');       //获取线下支付提示弹层

function payReminder() {
    noticePay.show()
}
function cancelNoticePay() {
    noticePay.hide()
}