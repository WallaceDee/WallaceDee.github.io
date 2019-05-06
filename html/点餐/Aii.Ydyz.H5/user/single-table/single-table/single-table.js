/**
 * Created by 84694 on 2017/9/26.
 */
var detailFood = $('#showDetailFood');        //点击菜名弹层
var remark = $('#remark');                    //点击选好了弹层
var cart = $('#cart');                          //点击购物车弹层
var allUser = $('#allUser');                          //点击顶部箭头，展示此桌所用用户
var remarkWordNumBox = $('#remarkWordNum');      //备注框动态显示当前字数span
var remarkWordNum = 0;    //备注字数


//点击菜名弹层
function showDetailFood() {
    detailFood.show();
}
function cancelDetail() {
    detailFood.hide();
}

//点击选好了备注弹层
function showRemark() {
    remark.show();
}
function cancelRemark() {
    remark.hide();
}
function checkWordNum(obj) {
    remarkWordNum = $(obj).val().length;
    remarkWordNumBox.html(remarkWordNum+'/50字');
}

//点击购物车弹层
function shopCart() {
    cart.show();
}
function cancelCart() {
    cart.hide();
}

//点击顶部箭头，展示此桌所用用户
function allTable() {
    allUser.show();
}
function cancelAllTable() {
    allUser.hide();
}