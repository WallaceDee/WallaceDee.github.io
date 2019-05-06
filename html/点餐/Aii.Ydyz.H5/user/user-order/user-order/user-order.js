/**
 * Created by 84694 on 2017/9/27.
 */
var end = $('#uol-end');           //获取结束盒子id
var noEnd = $('#uol-no-end');       //获取未结束盒子id


function changeClassL(obj) {
    $(obj).addClass('top-button').siblings().removeClass('top-button');
    noEnd.show();
    end.hide();
}

function changeClassR(obj) {
    $(obj).addClass('top-button').siblings().removeClass('top-button');
    end.show();
    noEnd.hide();
}