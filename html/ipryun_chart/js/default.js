 //root font-size
 var chart_font_size = 0;
 (function(doc, win) {
     "use strict";
     var docEl = doc.documentElement,
         resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
         recalc = function() {
             var clientWidth = docEl.clientWidth;
             var htmlFontSize = 20;
             var designWidth = 1920;
             if (!clientWidth) return;
             docEl.style.fontSize = htmlFontSize * (clientWidth / designWidth) + 'px';
             var reality = Number(docEl.style.fontSize.substr(0, docEl.style.fontSize.length - 2));
             var theory = htmlFontSize * (clientWidth / designWidth);
             if (reality != theory) {
                 docEl.style.fontSize = htmlFontSize * theory / reality * (clientWidth / designWidth) + 'px';
             }
             chart_font_size = parseInt(docEl.style.fontSize);
         }
     if (!doc.addEventListener) return;
     win.addEventListener(resizeEvt, recalc, false);
     doc.addEventListener('DOMContentLoaded', recalc, false);
 })(document, window);

 $(document).ready(function() {
     $(window).resize(function() {
         line.resize();
         liquidfill.resize();
         pie.resize();
     });
     $(".calendar").flatpickr({
         inline: true,
         defaultDate: "today",
         maxDate: "today",
         dateFormat: "Y-m-d", //sample 2017-05-08   // "Y/m/d" sample 2017/05/08
         onChange: function() {
             var curr_day = $(".calendar").val();
             console.log("current day is " + curr_day);
             getNumByDate(curr_day);
             $(".tipso_bubble").remove();
         },
         onReady: function() {
             var curr_day = $(".calendar").val();
             console.log("current day is " + curr_day);
             getNumByDate(curr_day);
             $(".flatpickr-calendar .today").tipso("show");
         }
     });
     //COLOR
     var c = 0;
     var flag = $("html").hasClass('white-theme');
     if (flag) {
         c = 1;
     }
     var line_area_color = [new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
         offset: 0,
         color: 'rgb(24, 125, 194)'
     }, {
         offset: 1,
         color: 'rgba(22, 54, 137,0)'
     }]), new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
         offset: 0,
         color: 'rgb(81, 30, 129)'
     }, {
         offset: 1,
         color: 'rgba(62, 31, 113,1)'
     }])];
     line_area_color = line_area_color[c];

     var line_line_color = ['rgba(22, 54, 137,.5)', 'rgba(62, 31, 113,.8)'];
     line_line_color = line_line_color[c];

     var line_label_color = ["#fff", "#fff"];
     line_label_color = line_label_color[c];

     var line_symbol = ["path://M512 0c-282.77 0-512 229.23-512 512s229.23 512 512 512 512-229.23 512-512-229.23-512-512-512zM512 896c-212.078 0-384-171.922-384-384s171.922-384 384-384c212.078 0 384 171.922 384 384s-171.922 384-384 384z", "circle"];
     line_symbol = line_symbol[0];

     var line_xline_color = ["#fff", "#fff"];
     line_xline_color = line_xline_color[c];

     var liquidfill_border_color = ["rgba(255,255,255,.1)", "rgba(255,255,255,.1)"];
     liquidfill_border_color = liquidfill_border_color[c];

     var liquidfill_label_color = ["#fff", "#fff"];
     liquidfill_label_color = liquidfill_label_color[c];

     var pie_wrapper_color = ["#2E4490", "#4C3078"];
     pie_wrapper_color = pie_wrapper_color[c];

     var pie_title_color = ["#fff", "#fff"];
     pie_title_color = pie_title_color[c];

     var rank_color = [
         ["#f29600", "#40bcf5", "#00a199", "#dadf00", "#8dc21f", "#faed00", "#036eb7", "#c8bb9b", "#b28146", "#595757"]
     ];
     rank_color = rank_color[0];

     var pie_color_list = ["#40bcf5", "#f29600", "#00a199"];
     ///COLOR
     var line_data = temp_line_data.list;
     var x_data = new Array();
     var y_data = new Array();
     for (var i = 0; i < line_data.length; i++) {
         x_data.push(line_data[i].date);
         y_data.push(line_data[i].value);
     }
     var line = echarts.init(document.getElementById('line'));
     line_option = {
         xAxis: [{
             type: 'category',
             animation: false,
             boundaryGap: false,
             data: x_data,
             axisLine: {
                 lineStyle: {
                     color: line_xline_color
                 }
             },
             axisTick: {
                 show: false
             },
             axisLabel: {
                 show: true,
                 textStyle: {
                     fontSize: chart_font_size * 1,
                 }
             }
         }],
         yAxis: [{
             show: false,
         }],
         series: [{
             type: 'line',
             animation: false,
             smooth: true,
             symbolSize: chart_font_size * 1.6,
             symbol: line_symbol,
             lineStyle: {
                 normal: {
                     color: line_line_color,
                     width: 5
                 }
             },
             itemStyle: {
                 normal: {
                     color: 'rgb(255, 255, 255)',
                     label: {
                         show: true,
                         position: 'inside',
                         textStyle: {
                             color: line_label_color,
                             fontSize: chart_font_size * 0.7,
                         },
                     }
                 }
             },
             areaStyle: {
                 normal: {
                     color: line_area_color
                 }
             },
             data: y_data
         }]
     };
     line.setOption(line_option);



     var liquidfill_data = temp_liquidfill_data;
     var liquidfill = echarts.init(document.getElementById('liquidfill'));
     var liquidfill_option = {
         series: [{
             type: 'liquidFill',
             animation: false,
             data: [{
                 name: liquidfill_data.name,
                 value: liquidfill_data.value,
                 itemStyle: {
                     normal: {
                         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                             offset: 0,
                             color: '#6E23DC'
                         }, {
                             offset: 1,
                             color: '#1B7CC4'
                         }])
                     }
                 }
             }],
             backgroundStyle: {
                 color: 'transparent'
             },
             label: {
                 normal: {
                     formatter: function(param) {
                         return param.name
                     },
                     textStyle: {
                         fontSize: chart_font_size * 2,
                         color: liquidfill_label_color
                     }
                 }
             },
             outline: {
                 borderDistance: 0,
                 borderWidth: chart_font_size * 0.5,
                 itemStyle: {
                     borderColor: liquidfill_border_color
                 }
             }
         }]
     };
     liquidfill.setOption(liquidfill_option);


     var pie_data = temp_pie_data.list;
     var pie_total = temp_pie_data.total;
     var pie = echarts.init(document.getElementById('pie'));

     var legend_html = new String();
     for (var i = 0; i < pie_data.length; i++) {
         legend_html += '<li><span style="background-color:' + pie_color_list[i] + '"></span><span class="name">' + pie_data[i].name + '</span>　<span class="count">' + pie_data[i].value + '件</span></li>';
     }
     $(".pie-legend ul").html(legend_html);
     placeHolderStyle = {
         normal: {
             label: {
                 show: false,
                 position: "center"
             },
             labelLine: {
                 show: false
             },
             color: pie_wrapper_color,
             borderColor: pie_wrapper_color,
             borderWidth: chart_font_size * 0.25
         }
     };
     quarterStyle = {
         normal: {
             color: "transparent",
             borderColor: "transparent"
         }
     };
     pie_option = {
         series: [{
             type: 'pie',
             animation: false,
             hoverAnimation: false,
             radius: [8.25 * chart_font_size, 8.5 * chart_font_size],
             itemStyle: {
                 normal: {
                     label: {
                         show: false
                     },
                     borderWidth: 0.25 * chart_font_size,
                     borderColor: pie_color_list[0],
                     shadowColor: 'rgba(0, 0, 0, 0)'
                 }
             },
             data: [{
                 value: 0.25,
                 itemStyle: quarterStyle
             }, {
                 value: (1 - pie_data[0].value / pie_total) * 0.75,
                 itemStyle: placeHolderStyle
             }, {
                 value: pie_data[0].value / pie_total * 0.75,
             }]
         }, {
             type: 'pie',
             animation: false,
             hoverAnimation: false,
             radius: [6.25 * chart_font_size, 6.5 * chart_font_size],
             itemStyle: {
                 normal: {
                     label: {
                         show: false
                     },
                     borderWidth: 0.25 * chart_font_size,
                     borderColor: pie_color_list[1],
                     shadowColor: 'rgba(0, 0, 0, 0)'
                 }
             },
             data: [{
                 value: 0.25,
                 itemStyle: quarterStyle
             }, {
                 value: (1 - pie_data[1].value / pie_total) * 0.75,
                 itemStyle: placeHolderStyle
             }, {
                 value: pie_data[1].value / pie_total * 0.75,
             }]
         }, {
             type: 'pie',
             animation: false,
             hoverAnimation: false,
             radius: [4.25 * chart_font_size, 4.5 * chart_font_size],
             itemStyle: {
                 normal: {
                     label: {
                         show: false
                     },
                     borderWidth: 0.25 * chart_font_size,
                     borderColor: pie_color_list[2],
                     shadowColor: 'rgba(0, 0, 0, 0)'
                 }
             },
             data: [{
                 value: 0.25,
                 itemStyle: quarterStyle
             }, {
                 value: (1 - pie_data[2].value / pie_total) * 0.75,
                 itemStyle: placeHolderStyle
             }, {
                 value: pie_data[2].value / pie_total * 0.75,
             }]
         }, {
             type: 'pie',
             animation: false,
             hoverAnimation: false,
             radius: [3.75 * chart_font_size, 3.75 * chart_font_size],
             label: {
                 normal: {
                     position: 'center'
                 }
             },
             data: [{
                 value: 1,
                 label: {
                     normal: {
                         formatter: pie_total + "件",
                         textStyle: {
                             color: pie_title_color,
                             fontSize: chart_font_size * 2,
                             fontWeight: 'bold'
                         }
                     }
                 }
             }]
         }]
     };
     pie.setOption(pie_option);


     var rank_data = temp_rank_data.list;
     var temp_html = new String();
     var max_value = rank_data[0].value;
     var bgStyle = new String();
     for (var i = 0; i < rank_data.length; i++) {
         var per = new Number();
         if (max_value == 0) {
             per = 0;
         } else
             per = rank_data[i].value / max_value * 100;
         console.log(rank_color[i]);
         if (rank_color[i].indexOf(",") == -1) {
             bgStyle = 'background-color: ' + rank_color[i] + ' ;';
         } else {

             bgStyle = 'background:-webkit-linear-gradient(left, ' + rank_color[i] + ' );';
         }
         temp_html += '<li>\
                                    <div class="co-name">' + rank_data[i].name + '</div>\
                                    <div class="bar">\
                                        <div style="' + bgStyle + ' width: ' + per + '%;"></div>\
                                    </div>\
                                    <div class="count">' + rank_data[i].value + '件</div>\
                                </li>';
     }
     $("#rank ul").html(temp_html);
 });
