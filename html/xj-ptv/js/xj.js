//Global
//var serverUrl="http://192.168.1.105:8081/jiejue/api/";
var serverUrl="http://120.24.244.174/jiejue/api/";
var brandCode="ptv";
var loginInfoTest=new Object();
loginInfoTest.token="phrJMGsPgLOoSkGiCYZ/cQ==";
loginInfoTest.mobileNo="13800138000";
loginInfoTest.brandCode=brandCode;
//正则表达式验证
(function ($) {
	$.fn.validator = function (type)
	{
		var value=$(this).val();
		switch (type)
		{
			case "telephone":
				return /(13\d|14[57]|15[^4,\D]|17[678]|18\d)\d{8}|170[059]\d{7}/.test(value);
				break;
			case "verificationCode":
				return /[0-9]{6}/.test(value);
				break;
		}
	}
})(Zepto);


//ajax获取数据接口
function func_ajax(type,url,callback,json){
	$.ajax({
		type:type,
		url:url,
		data:json,
		dataType:'json',
		success:function(data){
			//console.log(data);
			callback(data);
		},
		error:function(error){
			console.log('error');
		}
	});
}

//时间戳格式化
function func_format_data(temp){
	var date=new Date(temp*1);
	var year=date.getFullYear(),
		month=(date.getMonth()+1)>9?(date.getMonth()+1):'0'+(date.getMonth()+1),
		day=date.getDate()>9?date.getDate():'0'+date.getDate(),
		hour=(date.getHours()+1)>9?(date.getHours()+1):'0'+(date.getHours()+1),
		minute=date.getMinutes()>9?date.getMinutes():'0'+date.getMinutes();

	return {
		date:year+'-'+month+'-'+day,
		time:hour+':'+minute,
	};
}
template.helper('date_Format',function(date){
				var tmp_date=func_format_data(date);
				return tmp_date;
			})
//获取url参数
function func_getUrlString(key){
	var reg=new RegExp("(^|&)" + key + "=([^&]*)(&|$)","i");
	var r=window.location.search.substr(1).match(reg);
	if(r!=null){
		return (r[2]);
	}
	return null ;
}
//获取验证码60秒
 function count(element,seconds){
        if (seconds == 0) {
        element.removeAttribute("disabled");
		element.style.fontSize=".9rem";
        element.innerHTML="获取验证码";
        } else {
        element.setAttribute("disabled", true);
		element.style.fontSize=".8rem";
        element.innerHTML="重新发送(" + seconds + ")";
        setTimeout(function(){count(element,--seconds)},1000);
        }
}

//数量选择器
function numberpicker($picker){
	var p={
		$plus:$picker.find('.xj-plus'),
		$minus:$picker.find('.xj-minus'),
		num:0,
		$sum:$picker.find('.xj-sum'),
		plus:function(){
			p.num++;
			p.$sum.text(p.num);
			p.callback(p.num);
		},
		minus:function(){
			if(p.num>0){
				p.num--;
			}
			p.$sum.text(p.num);
			p.callback(p.num);
		},
		callback:function(){

		},
		setNum:function(num,cancelCallback){
			if(num==null){
				p.num=0;
			}
			else{
				p.num=num;
			}
			if(cancelCallback){

			}else{
				p.callback(p.num);
			}
		}
	};
	p.$plus.click(p.plus);
	p.$minus.click(p.minus);
	return p;
}

$(function(){
	$(document).on('pageInit',"#page-index",function(e,id,page){
		App.setTitle("喜聚PTV");
		App.showBack('0');
		func_ajax('POST',serverUrl+'product/vipProductList',func_vip_item);

		function func_vip_item(data){
			var data={list:data.dataObject};
			var htmls=template('tmp_vip_item',data);
			$(".xj-vip-lists>ul").append(htmls);
		}

		func_ajax('POST',serverUrl+'product/todayProductList',func_today_item);

		function func_today_item(data){
			var data={list:data.dataObject};
			var htmls=template('tmp_today_item',data);
			$(".xj-swiper-today>.swiper-wrapper").append(htmls);

			var todaySwiper=new Swiper('.xj-swiper-today',{
				pagination:'.swiper-pagination-today',
				autoplay:2000,
				speed:1200,
				loop:true,
				autoplayDisableOnInteraction:false,
			});
		}

		func_ajax('POST',serverUrl+'product/tomorrowProductList',func_tomorrow_item);

		function func_tomorrow_item(data){
			var data={list:data.dataObject};
			var htmls=template('tmp_tomorrow_item',data);

			$(".xj-swiper-tomorrow>.swiper-wrapper").append(htmls);

			var swiper_tomorrow=false;
			$(".xj-index-tab>.button").click(function(){
				if($(".xj-index-tab>.button").hasClass('active')){
					$(".xj-index-tab>.button").removeClass('active');
				}
				$(this).addClass('active');
				var temp=$(this).attr('data-tab');
				$(".xj-tab-content").hide();

				$(".xj-tab-content."+temp).show();
				if(!swiper_tomorrow){
					swiper_tomorrow=true;
					setTimeout(function(){
						var tomorrowSwiper=new Swiper('.xj-swiper-tomorrow',{
							autoplay:2000,
							speed:1200,
							loop:true,
							autoplayDisableOnInteraction:false,
						});
					},100);
				}
			});
			$(".xj-index .xj-swiper-tomorrow .xj-room-card").click(function(){
				$.router.loadPage($(this).attr('data-go'));
			});
			$(".xj-index .xj-swiper-tomorrow .xj-room-card .room-card-btn>div").click(function(event){
				event.stopPropagation();
				if($(this).hasClass('xj-active')){
					$(this).removeClass('xj-active');
					tomorrowSwiper.lockSwipes();
					var that=this;
					var buttons1=[
						{
							text:'确定取消提醒?',
							label:true,
						},{
							text:'确定',
							onClick:function(){
								$(that).removeClass('xj-active');
								$(that).find('span').text('提醒');
								tomorrowSwiper.unlockSwipes();
								tomorrowSwiper.startAutoplay();
							}
						}
					];
					var buttons2=[
						{
							text:'取消',
							bg:'danger',
							onClick:function(){
								tomorrowSwiper.unlockSwipes();
								tomorrowSwiper.startAutoplay();
							}

						}
					]
					var groups=[buttons1,buttons2];
					$.actions(groups);

				}else{
					$(this).addClass('xj-active');
					$(this).find('span').text('取消提醒');
					$(".xj-index .xj-tab-content.tomorrow .xj-swiper-btn-tip").show();
					setTimeout(function(){
						$(".xj-index .xj-tab-content.tomorrow .xj-swiper-btn-tip").hide();
					},1000);
				}

			});
		}

		func_ajax('POST',serverUrl+'product/vipRoomFavorList',func_vipRoom_item);

		function func_vipRoom_item(data){

		}

		func_ajax('POST',serverUrl+'product/vipPersonFavorList',func_vipPerson_item);

		function func_vipPerson_item(data){

		}


	});
	$(document).on('pageAnimationEnd',"#page-index",function(e,id,page){
		App.setTitle("喜聚PTV");
		App.showBack('0');
		$.closeModal();
	});

	$(document).on('pageInit','#page-limitSaleNow',function(e,id,page){
		App.setTitle("今日特价");
		App.showBack('1');
		var xj_id=func_getUrlString("id");
		if(xj_id==null){
			history.go(-1);
			return ;
		}
		var _json={productId:xj_id*1};
		func_ajax('POST',serverUrl+'product/detail',func_showToday_list,_json);

		function func_showToday_list(data){
			var data={list:data.dataObject};
			var htmls=template('tmp_limitSaleNow_item',data);
			$(".xj-limit-sale-now").html(htmls);
		}

	});
	$(document).on('pageAnimationEnd','#page-limitSaleNow',function(e,id,page){
		App.setTitle("今日特价");
		App.showBack('1');
	});

	$(document).on('pageInit','#page-limitSaleTomorow',function(e,id,page){
		App.setTitle("明日预告");
		App.showBack('1');

		var xj_id=func_getUrlString("id");
		if(xj_id==null){
			history.go(-1);
			return ;
		}
		var _json={productId:xj_id*1};
		func_ajax('POST',serverUrl+'product/detail',func_showTomorrow_list,_json);

		function func_showTomorrow_list(data){
			var data={list:data.dataObject};
			var htmls=template('tmp_limitSaleTomorrow_item',data);
			$(".xj-limit-sale-tomorrow").html(htmls);

		}
	});
	$(document).on('pageAnimationEnd','#page-limitSaleTomorow',function(e,id,page){
		App.setTitle("明日预告");
		App.showBack('1');
	});

	$(document).on('pageInit','#page-vips',function(e,id,page){
		App.setTitle("VIP专享");
		App.showBack('1');
	});
	$(document).on('pageAnimationEnd','#page-vips',function(e,id,page){
		App.setTitle("VIP专享");
		App.showBack('1');
	});

	$(document).on('pageInit','#page-roomDiscount',function(e,id,page){
		App.setTitle("VIP房间优惠");
		App.showBack('1');

		var loading=false;
		var itemsPerload=12;
		var pageNum=1;
		var maxItems;
		var _json={pageNumber:pageNum};
		var lastIndex=12;


		func_ajax('POST',serverUrl+'product/vipRoomFavorList',func_roomDiscount_item,_json);

		$(document).on('infinite','.infinite-scroll-bottom',function(){
			if(loading) return ;

			loading=true;

			if(lastIndex >= maxItems){
				$.detachInfiniteScroll($('.infinite-scroll'));
				$('.infinite-scroll-preloader').remove();
				return;
			}

			pageNum++;

			func_ajax('POST',serverUrl+'product/vipRoomFavorList',func_roomDiscount_item,{pageNumber:pageNum});

			lastIndex=$('.list-container li').length;

			$.refreshScroller();

		});

		function func_roomDiscount_item(data){
			maxItems=data.total;
			var data={list:data.dataObject};
			var htmls=template('tmp_roomDiscount_item',data);
			$(".xj-list-container>ul").append(htmls);
		}

	});
	$(document).on('pageAnimationEnd','#page-roomDiscount',function(e,id,page){
		App.setTitle("VIP房间优惠");
		App.showBack('1');
	});

	$(document).on('pageInit','#page-peopleDiscount',function(e,id,page){
		App.setTitle("VIP人数优惠");
		App.showBack('1');

		var loading=false;
		var itemsPerload=12;
		var pageNum=1;
		var maxItems;
		var _json={pageNumber:pageNum};
		var lastIndex=12;


		func_ajax('POST',serverUrl+'product/vipPersonFavorList',func_peopleDiscount_item,_json);

		$(document).on('infinite','.infinite-scroll-bottom',function(){
			if(loading) return ;

			loading=true;

			if(lastIndex >= maxItems){
				$.detachInfiniteScroll($('.infinite-scroll'));
				$('.infinite-scroll-preloader').remove();
				return;
			}

			pageNum++;

			func_ajax('POST',serverUrl+'product/vipPersonFavorList',func_roomDiscount_item,{pageNumber:pageNum});

			lastIndex=$('.list-container li').length;

			$.refreshScroller();

		});

		function func_peopleDiscount_item(data){
			maxItems=data.total;
			var data={list:data.dataObject};
			var htmls=template('tmp_peopleDiscount_item',data);
			$(".xj-list-container>ul").append(htmls);
		}
	});
	$(document).on('pageAnimationEnd','#page-peopleDiscount',function(e,id,page){
		App.setTitle("VIP人数优惠");
		App.showBack('1');
	});

	$(document).on('pageInit','#page-DiscountDetail',function(e,id,page){
		App.setTitle("房间详情");
		App.showBack('1');

		var xj_id=func_getUrlString("id");
		if(xj_id==null){
			history.go(-1);
			return ;
		}
		var _json={productId:xj_id*1};
		func_ajax('POST',serverUrl+'product/detail',func_showDetail,_json);

		function func_showDetail(data){
			var data={list:data.dataObject};
			var htmls=template('tmp_detail_item',data);
			$(".xj-discount-detail").html(htmls);
		}

	});
	$(document).on('pageAnimationEnd','#page-DiscountDetail',function(e,id,page){
		App.setTitle("房间详情");
		App.showBack('1');
	});

	$(document).on('pageInit','#page-submitOrder',function(e,id,page){
		App.setTitle("提交订单");
		App.showBack('1');

		var num_order,total_price;

		var xj_id=func_getUrlString("id");
		if(xj_id==null){
			history.go(-1);
			return ;
		}
		var _json={productId:xj_id*1};
		func_ajax('POST',serverUrl+'product/detail',func_showInfo,_json);

		function func_showInfo(data){
			var data={list:data.dataObject};
			var htmls=template('tmp_order_info',data);
			$(".xj-submit-order .xj-order-info").html(htmls);
			//默认选择1个,初始化合计值
			$(".xj-opera .xj-opera-money>i").text($(".xj-opera .xj-order-price>i").text()*1);
			//绑定数量选择器
			num_order=numberpicker($(".xj-opera .xj-opera-inp"));
			num_order.setNum(1);
			num_order.callback=func_getTotal;
		}
		function func_getTotal(){
			var unit_price=$(".xj-opera .xj-order-price>i").text()*1;
			total_price=unit_price*num_order.num;
			$(".xj-opera .xj-opera-money>i").text(total_price);
		}
	});
	$(document).on('pageAnimationEnd','#page-submitOrder',function(e,id,page){
		App.setTitle("提交订单");
		App.showBack('1');
	});

	$(document).on('pageInit','#page-orderPayment',function(e,id,page){
		App.setTitle("支付方式");
		App.showBack('1');
	});
	$(document).on('pageAnimationEnd','#page-orderPayment',function(e,id,page){
		App.setTitle("支付方式");
		App.showBack('1');
	});

	$(document).on('pageAnimationEnd','#page-reserve',function(e,id,page){
		App.setTitle("预约");
		App.showBack('1');
	});
	$(document).on('pageInit',"#page-reserve",function(e,id,page){
		var data_roomType,data_roomType_sel,data_roomType_index;
		App.setTitle("预约");
		App.showBack('1');

		var peopleNum=new Array();
		for(var i=1;i<=68;i++){
			peopleNum.push(i);
		}
		$("#xj-reserve-peoplenum").picker({
			cols:[{
				textAlign:'center',
				values:peopleNum,
			}]
		});
		//计时模式列表
		func_ajax('POST',serverUrl+'roomType/getAll',func_roomType_item);
		function func_roomType_item(data){
			data_roomType=data.dataObject;
			var data={list:data.dataObject};
			var htmls=template('tmp_roomType_reserveItem',data);
			$(".popup_roomType .content .xj-reserve-roomType-list>ul").html(htmls);

			$(".xj-reserve-roomType-list li").click(function(){
				if($(".xj-reserve-roomType-list li").hasClass("xj-active")){
					$(".xj-reserve-roomType-list li").removeClass('xj-active');
				}
				var roomType=$(this).text();
				$(".xj-item-inp-a").text(roomType);
				$(this).addClass("xj-active");
				//$.closeModal('.popup_roomType');
				$.closeModal();
			});
		}

		//套餐模式
		func_ajax('POST',serverUrl+'product/packageProductList',func_package_item);

		function func_package_item(data){
			var data={list:data.dataObject};
			var htmls=template('tmp_package_item',data);
			$(".popup.popup_package .content .xj-package-radios").html(htmls);

			//套餐模式的列表
			$(".xj-package-radios .xj-package-radio-head").click(function(){
				if($(".xj-package-radios .xj-package-radio-head").hasClass('xj-active')){
					$(".xj-package-radios .xj-package-radio-head").removeClass('xj-active');
				}
				$(this).addClass('xj-active');
			});
			$(".xj-package-sure").click(function(){
				package_txt=$(".xj-package-radios .xj-package-radio-head.xj-active").text();
				$(".inp_partten").val($.trim(package_txt));
				$.closeModal();

			});
		}

		//团购模式
		func_ajax('POST',serverUrl+'product/groupProductList',func_groupbuy_item);

		function func_groupbuy_item(data){
			var data={list:data.dataObject};
			var htmls=template('tmp_groupbuy_item',data);
			console.log(data);
			$(".popup_groupbuy .content .xj-groupbuy-lists").html(htmls);

			$('.xj-groupbuy-lists .xj-groupbuy-item').click(function(){
				if($('.xj-groupbuy-lists .xj-groupbuy-item').hasClass('xj-active')){
					$('.xj-groupbuy-lists .xj-groupbuy-item').removeClass('xj-active');
				}
				$(this).addClass('xj-active');
			});
			$(".xj-groupbuy-sure").click(function(){
				groupbuy_txt=$('.xj-groupbuy-lists .xj-groupbuy-item.xj-active .xj-groupbuy-content').text();
				$(".inp_partten").val($.trim(groupbuy_txt));
				$.closeModal();
			});

		}

		$(document).on('click','.open-roomType',function(){
			if(!$(this).hasClass('xj-disabled')){
				$.popup('.popup_roomType');
			}

		});
		//选择模式
		var package_txt,groupbuy_txt;
		$(".xj-reserve-pattern .xj-reserve-pattern-btn").click(function(){

			if($(".xj-reserve-pattern .xj-reserve-pattern-btn").hasClass('xj-active')){
				$(".xj-reserve-pattern .xj-reserve-pattern-btn").removeClass('xj-active');
			}
			if($("#xj-reserve-peoplenum").val()){
				if($("#xj-reserve-peoplenum").val()>0 && $("#xj-reserve-peoplenum").val() <=68){
					if(!data_roomType_sel){
						for(var item in data_roomType){
							if($("#xj-reserve-peoplenum").val()>=data_roomType[item].minCapacity && $("#xj-reserve-peoplenum").val()<=data_roomType[item].maxCapacity){
								data_roomType_sel=data_roomType[item];
								data_roomType_index=item;
								break ;
							}
						}
						if(data_roomType_sel){
							$(".xj-reserve-item .xj-item-inp .xj-item-inp-a").text(data_roomType_sel.name).removeClass('xj-disabled');
						}

					}


				}else{
					$.toast("若预约人数大于68,请联系客服");
					return ;
				}
			}else{
				$.toast("请先选择进场人数");
				return ;
			}
			var mark=$(this).attr('data-mark');
			$(this).addClass('xj-active');
			if(mark==1){
				$(".inp_partten").val('计时模式');
				if($(".xj-reserve-item .xj-item-inp .xj-item-inp-a").hasClass('xj-disabled')){
					$(".xj-reserve-item .xj-item-inp .xj-item-inp-a").removeClass('xj-disabled');
				}
			}else if(mark==2){
				$.popup('.popup_package');
				$(".xj-reserve-item .xj-item-inp .xj-item-inp-a").addClass('xj-disabled');
			}
			else if(mark==3){
				$.popup('.popup_groupbuy');
				$(".xj-reserve-item .xj-item-inp .xj-item-inp-a").addClass('xj-disabled');
			}
		});

		//时间
		var date=new Date(),date1=date;
		var form_time=date;
		date={
			year:date.getFullYear(),
			month:date.getMonth()+1>9?date.getMonth()+1:'0'+(date.getMonth()+1),
			day:date.getDate()>9?date.getDate():'0'+date.getDate(),
			hours:date.getHours(),
			minutes:date.getMinutes()>9?date.getMinutes():'0'+date.getMinutes(),
		};
		$("#datetime-picker").datetimePicker({
			value:[date.year,date.month,date.day,date.hours,date.minutes],
		});

		$("#datetime-picker").change(function(){
			form_time=$(this).val();
			var date2=new Date(form_time);
			if(Date.parse(date2)<Date.parse(date1)){
				$.toast('进场时间不能在目前预约时间前');
				$("#datetime-picker").datetimePicker({
					value:[date.year,date.month,date.day,date.hours,date.minutes],
				});
				return ;
			}
			console.log(form_time);
		});
	});

	$(document).on('pageInit','#page-hotSpot',function(e,id,page){
		var hotSwiper=new Swiper('.xj-hotspot-swiper',{
			pagination:'.swiper-pagination-hotspot',
			autoplay:2000,
			speed:2000,
			loop:true,
			autoplayDisableOnInteraction:false,
		});
	});
	//login
    $(document).on('pageAnimationEnd', '#page-login', function(e, id, page) {
    	App.setTitle("登录");
    	App.showBack('0');
    	App.setRightBtnBackground('', '');
    });
    $(document).on('pageInit', "#page-login", function(e, id, page) {
    	App.setTitle("登录");
    	App.showBack('0');
    	App.setRightBtnBackground('', '');
    	$(".verify-btn").click(function() {
    		var parameter = new Object();
    		parameter.mobileNo = $(".phone-number").val();
    		parameter.brandCode = brandCode;
    		parameter.functionCode = "login";

    		function func_getIdentifyingCode(data) {
    			if (data.success) {
    				Toast.makeText("验证码已发送，请查收！", 5000);
    				$(".verify-code").val(data.dataObject.identifyingCode);
    			} else {
    				Toast.makeText("获取验证码失败！", 5000);
    			}
    		}
    		func_ajax('post', serverUrl + 'identifyingCode/add', func_getIdentifyingCode, parameter);
    	});

    	$(".login-btn").click(function() {
    		var parameter = new Object();
    		parameter.mobileNo = $(".phone-number").val();
    		parameter.checkCode = $(".verify-code").val();
    		function func_login(data) {
    			if (data.success) {
    				Toast.makeText("登录成功！", 5000);
    				var content = {
    					'token': data.dataObject.token,
    					'mobileNo': $(".phone-number").val()
    				};
    				Preference.put('loginInfo', content, "userFlag");
    				setTimeout(function() {
    					$.router.loadPage("mine.html");
    				}, 1000);
    			} else {
    				Toast.makeText("登录失败！", 5000);
    			}
    		}
    		func_ajax('post', serverUrl + 'member/login', func_login, parameter);
    	});
    });
    //mine
    $(document).on('pageAnimationEnd', '#page-mine', function(e, id, page) {
    	App.setTitle("我");
    	App.showBack('0');
    	App.setRightBtnBackground('setting.html', 'billhistory');
    	App.showTabbBar('1');
    });
    $(document).on('pageInit', '#page-mine', function(e, id, page) {
    	App.setTitle("我");
    	App.showBack('0');
    	App.setRightBtnBackground('setting.html', 'billhistory');
    	App.showTabbBar('1');
    	var parameter = JSON.parse(Preference.get('loginInfo', '', "userFlag"));
    	parameter.brandCode = brandCode;
    	if (Preference.get('loginInfo', '', "userFlag") != "") {
    		func_ajax('post', serverUrl + 'member/getMemberInfo', func_loginSuccess, parameter);
    	} else {
    		Toast.makeText("请先新登录！", 5000);
    		$.router.loadPage("login.html");
    	}

    	function func_loginSuccess(data) {
    		if (data.success) {
    			var data = {
    				list: data.dataObject
    			};
    			var htmls = template('tmp_mine_info', data);
    			$(".xj-mine-head").html(htmls);
    		} else {
    			Toast.makeText("登录已失效，请重新登录！", 5000);
    			$.router.loadPage("login.html");
    		}
    	}
    });
    //discover
    $(document).on('pageAnimationEnd', '#page-discover', function(e, id, page) {
    	App.setTitle("发现");
    	App.showBack('0');
    });
    $(document).on('pageInit', '#page-discover', function(e, id, page) {
    	App.setTitle("发现");
    	App.showBack('0');
    });
    //setting
    $(document).on('pageAnimationEnd', '#page-setting', function(e, id, page) {
    	App.setTitle("设置");
    	App.showBack('1');
    	App.setRightBtnBackground('', '');
    	App.showTabbBar('0');
    });
    $(document).on('pageInit', '#page-setting', function(e, id, page) {
    	App.setTitle("设置");
    	App.showBack('1');
    	App.setRightBtnBackground('', '');
    	App.showTabbBar('0');
    });
    //personalProfile
    $(document).on('pageAnimationEnd', '#page-personalProfile', function(e, id, page) {
    	App.setTitle("个人资料");
    	App.showBack('1');
    	App.setRightBtnBackground('', '');
    	App.showTabbBar('0');
    });
    $(document).on('pageInit', '#page-personalProfile', function(e, id, page) {
    	App.setTitle("个人资料");
    	App.showBack('1');
    	App.setRightBtnBackground('', '');
    	App.showTabbBar('0');
    	var parameter = JSON.parse(Preference.get('loginInfo', '', "userFlag"));
    	parameter.brandCode = brandCode;
		func_ajax('post', serverUrl + 'member/getMemberInfo', func_getMemberInfo, parameter);
    	function func_getMemberInfo(data) {
    		if (data.success) {
    			var data = {
    				list: data.dataObject
    			};
    			var htmls = template('tmp_personal_profile', data);
    			$(".xj-profile-list").html(htmls);
    			$(".birthday-picker").calendar();
    			$(".gander-picker").picker({
                  cols: [
                    {
                      textAlign: 'center',
                      values: ['男', '女']
                    }
                  ],
                  onClose:function(){
                   $.alert("你选择了"+$(".gander-picker").val());
                  }
                });
    		} else {
    			Toast.makeText("登录已失效，请重新登录！", 5000);
    			$.router.loadPage("login.html");
    		}
    	};
		$(document).on('click','.select-picture-actions', function () {
			  var buttons1 = [
				{
				  text: '请选择',
				  label: true
				},
				{
				  text: '拍照',
				  bold: true,
				  color: 'danger',
				  onClick: function() {
				 $.alert("你选择了“拍照“");
				  }
				},
				{
				  text: '本地图片',
				  onClick: function() {
					$.alert("你选择了“本地图片“");
				  }
				}
			  ];
			  var buttons2 = [
				{
				  text: '取消',
				  bg: 'danger'
				}
			  ];
			  var groups = [buttons1, buttons2];
			  $.actions(groups);
		  });
		$(document).on('change','.birthday-picker', function () {
			$.alert("你选择了"+$(this).val());
		});
		$(document).on('click','.modify-nickname-btn', function () {
			$.popup('.popup-modify-nickname');
		});
		$(document).on('opened','.popup-modify-nickname', function () {
			$(".popup-modify-input").focus();
		});
	});
    //points
    $(document).on('pageAnimationEnd', '#page-points', function(e, id, page) {
    	App.setTitle("积分");
    	App.showBack('1');
        App.setRightBtnBackground('', '');
        App.showTabbBar('0');
    });
    $(document).on('pageInit', '#page-points', function(e, id, page) {
    	App.setTitle("积分");
    	App.showBack('1');
        App.setRightBtnBackground('', '');
       	App.showTabbBar('0');
		var parameter = JSON.parse(Preference.get('loginInfo', '', "userFlag"));
    	parameter.brandCode = brandCode;
    	parameter.page=1;
		func_ajax('post', serverUrl + 'bonuspointHist/getBonuspointHistByMobileNoAndBrandCode', func_getPoint, parameter);
    	function func_getPoint(data) {
		//alert(JSON.stringify(data));
		}

	// 加载flag
          var loading = false;
          // 最多可加载的条目
          var maxItems = 100;
          // 每次加载添加多少条目
          var itemsPerLoad = 20;
          function addItems(number, lastIndex) {
                  // 生成新条目的HTML
                  var html = '';
                  for (var i = lastIndex + 1; i <= lastIndex + number; i++) {
                      html += '<li class="item-content"><div class="item-inner"><div class="item-title">Item ' + i + '</div></div></li>';
                  }
                  // 添加新条目
                  $('.infinite-scroll-bottom .list-container').append(html);
              }
              //预先加载20条
          addItems(itemsPerLoad, 0);
          // 上次加载的序号
          var lastIndex = 20;
          // 注册'infinite'事件处理函数
          $(document).on('infinite', '.infinite-scroll-bottom',function() {
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
                      $.detachInfiniteScroll($('.infinite-scroll'));
                      // 删除加载提示符
                      $('.infinite-scroll-preloader').remove();
                      return;
                  }
                 // 添加新条目
                  addItems(itemsPerLoad, lastIndex);
                  // 更新最后加载的序号
                  lastIndex = $('.list-container li').length;
                  //容器发生改变,如果是js滚动，需要刷新滚动
                  $.refreshScroller();
              }, 1000);
          });


    });




	$.init();
});
