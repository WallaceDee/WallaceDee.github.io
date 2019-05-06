//rem字体大小
(function (doc, win) {
	"use strict";
	var docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function () {
			var clientWidth = docEl.clientWidth;
			var htmlFontSize=20;
			var designWidth=375;
			if (!clientWidth) return;
			docEl.style.fontSize = htmlFontSize * (clientWidth / designWidth) + 'px';
			var  reality = Number(docEl.style.fontSize.substr(0,docEl.style.fontSize.length-2));
			var theory = htmlFontSize * (clientWidth / designWidth);
			// alert(reality);
			// alert(theory);
			if(reality!=theory){
				docEl.style.fontSize=htmlFontSize *theory/reality*(clientWidth/ designWidth) + 'px';
			}
		};
	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

var mysystem = 'android'; //android或ios
// 判断是否ios
var isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
if (isIOS) {
	mysystem = 'ios';
};
(function() {
	var ptv = "js/ptva.js";
	if (mysystem == 'ios') {
		ptv ="js/ptvi.js";
	};
	var body = document.getElementsByTagName('body')[0],
		js = document.createElement('script');
	js.setAttribute('type', 'text/javascript');
	js.setAttribute('src', ptv);
	body.appendChild(js);

	//加入xj.js,确保在ptv.js加载完执行
	var xjUrl='js/xj.js',
		xj=document.createElement('script');
	xj.setAttribute('type','text/javascript');
	xj.setAttribute('src',xjUrl);
	js.onload=function(){
		body.appendChild(xj);
	}

})();