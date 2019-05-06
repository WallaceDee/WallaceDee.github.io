$(function() {
	'use strict';

	/***************************************************************************/
	/*index*/
	/***************************************************************************/
	$(document).on("pageInit", "#index", function(e, pageId, $page) {

		var banner = $(".index-banner").swiper({
			pagination: '.swiper-pagination',
			paginationClickable: true,
			autoplay: 5000,
			effect: 'coverflow',
			touchMoveStopPropagation: true,
			speed: 1000,
			loop: true,
			onAutoplayStop: function(swiper) {
				banner.startAutoplay();
			}
		});

		$("#index .index-icon-list li").click(function(event) {
			$.router.load("goods_list.html");
		});

	});
	/***************************************************************************/
	/*goods-details*/
	/***************************************************************************/
	$(document).on("pageInit", "#goods-details", function(e, pageId, $page) {

		var goods_banner = $(".goods-details-banner").swiper({
			pagination: '.swiper-pagination',
			paginationClickable: true,
			autoplay: 5000,
			effect: 'coverflow',
			touchMoveStopPropagation: true,
			speed: 1000,
			loop: true,
			onAutoplayStop: function(swiper) {
				goods_banner.startAutoplay();
			}
		});

	});
	var myPhotoBrowserStandalone = $.photoBrowser({
		photos: [
			'images/goods_details01.png',
			'images/goods_details02.png',
		],
		onClose: function() {
			$(".photo-browser").remove();
		}
	});
	//点击时打开图片浏览器
	$(document).on('click', '#goods-details .goods-details-banner img', function() {
		myPhotoBrowserStandalone.open();
	});
	//购买数量counter
	$(document).on('click', "#goods-details .plus-btn", function() {
		var n = $(this).prev().val();
		var num = parseInt(n) + 1;
		if (num == 0) {
			return;
		}
		$(this).prev().val(num);
	});
	$(document).on('click', "#goods-details .minus-btn", function() {
		var n = $(this).next().val();
		var num = parseInt(n) - 1;
		if (num == 0) {
			return
		}
		$(this).next().val(num);
	});
	/***************************************************************************/
	/*new-address*/
	/***************************************************************************/
	$(document).on("pageInit", "#new-address", function(e, pageId, $page) {
		$(".city-picker").cityPicker({
			toolbarTemplate: '<header class="bar bar-nav">\
  			<button class="button button-link pull-right close-picker">确定</button>\
   			<h1 class="title">选择所在地区</h1>\
  			</header>'
		});
	});
	/***************************************************************************/
	/*edit-address*/
	/***************************************************************************/
	$(document).on("pageInit", "#edit-address", function(e, pageId, $page) {
		$(".city-picker").cityPicker({
			toolbarTemplate: '<header class="bar bar-nav">\
  			<button class="button button-link pull-right close-picker">确定</button>\
   			<h1 class="title">选择所在地区</h1>\
  			</header>'
		});
	});

	/***************************************************************************/
	/*init*/
	/***************************************************************************/
	$.init();
});