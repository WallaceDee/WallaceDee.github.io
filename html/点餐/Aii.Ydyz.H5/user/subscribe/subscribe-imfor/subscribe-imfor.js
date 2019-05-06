/**
 * Created by 84694 on 2017/9/27.
 */
var ladyImg = $('#ladyImg');
var ladyName = $('#ladyName');
var sirImg = $('#sirImg');
var sirName = $('#sirName');

function imageSwitchL(obj) {
    ladyImg.attr('src','../../../img/sex-check.png');
    sirImg.attr('src','../../../img/choice2.png');
    ladyName.addClass('isChooesSex');
    sirName.removeClass('isChooesSex');
}

function imageSwitchS(obj) {
    sirImg.attr('src','../../../img/sex-check.png');
    ladyImg.attr('src','../../../img/choice2.png');
    sirName.addClass('isChooesSex');
    ladyName.removeClass('isChooesSex');
}