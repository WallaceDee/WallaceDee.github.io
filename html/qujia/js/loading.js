// JavaScript Document
//author Wallace
var loading = {
	 info: null,
	init:function(info){
	//alert(info);
var style=document.createElement("style");
style.id="loading-style";
document.head.appendChild(style);
document.getElementById("loading-style").innerHTML="#loading{box-sizing:border-box;position:absolute;z-index:99999;left:0;top:0;width:100%;height:100%;background:#efeff4;overflow:hidden}#loading .loading-bg{height:100%;background-color:#df0011}#loading span,.icon-pin:after,.icon-pin{content:'';pointer-events:none;border:2px solid #fff}#loading .icon-pin{display:block;position:absolute;left:50%;top:50%;margin-left:-14px;vertical-align:middle;width:26px;height:26px;-webkit-border-radius:50% 50% 50% 0;border-radius:50% 50% 50% 0;text-indent:-9999px;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-webkit-animation:jump 2s 0s linear infinite;animation:jump 2s 0s linear infinite}#loading span{width:10px;height:10px;position:absolute;left:6px;top:6px;border-bottom-color:transparent;-webkit-border-radius:50%;border-radius:50%;-webkit-animation:rotate .75s 0s linear infinite;animation:rotate.75s 0s linear infinite}@-webkit-keyframes rotate{0%{transform:rotate(0deg) scale(1);-webkit-transform:rotate(0deg) scale(1)}50%{transform:rotate(180deg) scale(0.6);-webkit-transform:rotate(180deg) scale(0.6)}100%{transform:rotate(360deg) scale(1);-webkit-transform:rotate(360deg) scale(1)}}@-webkit-keyframes jump{0%{transform:rotate(-45deg);-webkit-transform:rotate(-45deg)}33%{transform:rotate(-45deg) translate(5px,-5px);-webkit-transform:rotate(-45deg) translate(5px,-5px)}66%{transform:rotate(-45deg) translate(-5px,5px);-webkit-transform:rotate(-45deg) translate(-5px,5px)}100%{transform:rotate(-45deg) translateY(0px);-webkit-transform:rotate(-45deg) translate(0px)}}";
//<div id='loading'><div class='loading-bg'><i class='icon-pin'></i></div></div>
var loading=document.createElement("div");
loading.id="loading";
document.body.appendChild(loading);
document.getElementById("loading").innerHTML="<div class='loading-bg'><i class='icon-pin'><span></span></i></div>";
},
end:function(){
		document.head.removeChild(document.getElementById("loading-style"));	
		document.body.removeChild(document.getElementById("loading-init"));
		document.body.removeChild(document.getElementById("loading"));
		}			
}
