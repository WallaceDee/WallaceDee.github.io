var code =GetQueryString("code");

Number.prototype.change = function() {
    var s = new Number();
    if (this / 100000000 > 1) {
        s = (this / 100000000).toFixed(2) + "亿";
    } else if ((this / 10000 < 10000) && (this / 10000 > 1)) {
        s = (this / 10000).toFixed(2) + "万";
    } else s = this;
    return s;
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

function checkStockLocation(code) {
    var preCode = code.substring(0, 3);
    var preStr = new String();
    var sz_list = ["300", "000", "002", "200", "080", "031"];
    var sh_list = ["600", "601", "603", "900", "730", "700", "580"];
    for (var i = 0; i < sz_list.length; i++) {
        if (preCode === sz_list[i]) {
            preStr = "sz";
            break;
        }
    }
    if (preStr != "sz") {
        for (var i = 0; i < sh_list.length; i++) {
            if (preCode === sh_list[i]) {
                preStr = "sh";
                break;
            }
        }
    }
    return preStr + code;
}

function splitKlineData(rawData) {
    var category = new Array();
    var values = new Array();

    for (var i = 0; i < rawData.length; i++) {
        var temp = new Array();
        temp.push(parseFloat(rawData[i].open));
        temp.push(parseFloat(rawData[i].close));
        temp.push(parseFloat(rawData[i].low));
        temp.push(parseFloat(rawData[i].high));
        temp.push(parseFloat(rawData[i].ms1));

        temp.push(parseFloat(rawData[i].amount));
        temp.push(parseFloat(rawData[i].volume));
        category.push(rawData[i].date);
        values.push(temp);
    }
    return {
        category: category,
        values: values
    };
}

function colorKLine(data) {
    var result = new Object();
    var g_arr = new Array();
    var r_arr = new Array();
    for (var i = 0; i < data.length; i++) {
        var temp_red = new Array();
        var temp_green = new Array();
        if (data[i][4] > 0) {
            for (var j = 0; j < 4; j++) {
                temp_green.push(data[i][j]);
                temp_red.push("");
            }
        } else {
            for (var j = 0; j < 4; j++) {
                temp_red.push(data[i][j]);
                temp_green.push("");
            }
        }
        g_arr.push(temp_green);
        r_arr.push(temp_red);
    }
    result.green = g_arr;
    result.red = r_arr;
    return result;
}

function getBSPoint(kdata) {
    var data = kdata.values;
    var category = kdata.category;
    var result = new Object();
    var b = new Array();
    var s = new Array();
    for (var i = 0; i < data.length - 1; i++) {
        var flag1 = data[i][4] > 0 ? 1 : -1;
        var flag2 = data[i + 1][4] > 0 ? 1 : -1;
        if (flag1 != flag2) {
            //2
            if (flag2 < 0) { //B
                b.push({
                    name: "B",
                    xAxis: category[i + 1],
                    yAxis: data[i + 1][2]
                });
            } else { //S
                s.push({
                    name: "S",
                    xAxis: category[i + 1],
                    yAxis: data[i + 1][3]
                });
            }
        }
    }
    result.b = b;
    result.s = s;
    return result;
}

var full_code = checkStockLocation(code);

var src = "http://hq.sinajs.cn/list=" + full_code;
var head = document.body;
var script = document.createElement("script");
script.src = src;
head.appendChild(script);
script.onload = function() {
    var param_string = "hq_str_" + full_code;
    var param = eval(param_string);
    console.log(param.split(",")[0]);
    document.querySelector(".name-wrapper h1").innerHTML = param.split(",")[0];
    document.querySelector(".name-wrapper h2").innerHTML = code;
    document.title = param.split(",")[0] + "(" + code + ")";
};

window.rawData = new Object();
$.ajax({
    url: "http://www.gu0018.com/Stock/StockData.aspx",
    type: "get",
    data: {
        s: code,
        d: 180
    },
    dataType: "json",
    async: false,
    success: function(data) {
        window.rawData = data.data;
    }
});

var k_line = echarts.init(document.getElementById('k-line'));
// 数据意义：开盘(open)，收盘(close)，最低(lowest)，最高(highest)
var k_line_data = splitKlineData(window.rawData);

var chart_values = k_line_data.values;
//推荐
document.querySelector(".suggest-wrapper").style.display = "block";
if (chart_values[chart_values.length - 1][4] < 0) { //持股
    document.getElementById("b").style.display = "block";
} else {
    document.getElementById("s").style.display = "block";
}
var ma10 = new Array();
var ma30 = new Array();
var volume = new Array();
for (var i = 0; i < rawData.length; i++) {
    ma10.push(rawData[i].ma10);
    ma30.push(rawData[i].ma30);
    volume.push(rawData[i].volume);
}

var color_k_line = colorKLine(chart_values);
var green_k_line = color_k_line.green;
var red_k_line = color_k_line.red;

var buy_sale_point = getBSPoint(k_line_data);
var buy_point_list = buy_sale_point.b;
var sale_point_list = buy_sale_point.s;

var icon_B_path = "path://M 512 111.702 c -220.714 0 -400.298 179.585 -400.298 400.299 c 0 220.714 179.585 400.297 400.298 400.297 S 912.298 732.714 912.298 512 c 0 -220.715 -179.585 -400.299 -400.298 -400.299 Z m 142.45 593.47 c -26.188 21.348 -62.484 32.016 -108.88 32.016 H 381.007 V 286.812 h 144.459 c 47.837 0 84.803 9.954 110.891 29.85 c 26.083 19.896 39.127 50.473 39.127 91.716 c 0 20.623 -6.236 38.77 -18.714 54.442 s -28.92 27.22 -49.333 34.645 v 0.924 c 27.012 5.565 48.145 18.609 63.41 39.132 c 15.256 20.524 22.89 44.797 22.89 72.843 c 0 41.86 -13.1 73.47 -39.287 94.808 Z M 597.384 459.873 c 13.918 -12.264 20.874 -29.85 20.874 -52.738 c 0 -25.153 -7.786 -43.763 -23.349 -55.829 c -15.574 -12.066 -38.72 -18.103 -69.444 -18.103 H 438.23 v 146.004 h 102.698 c 23.712 -0.615 42.532 -7.06 56.455 -19.334 Z M 554.23 525.302 h -116 v 165.79 h 107.34 c 29.075 0 51.502 -6.851 67.278 -20.567 c 15.777 -13.715 23.663 -33.556 23.663 -59.545 c 0 -27.012 -6.649 -48.04 -19.95 -63.098 c -13.305 -15.057 -34.08 -22.58 -62.33 -22.58 Z";
var icon_S_path = "path://M 511.999 0 C 229.23 0 0 229.229 0 512 s 229.23 512 511.999 512 C 794.771 1024 1024 794.771 1024 512 S 794.771 0 511.999 0 Z m 166.525 738.483 c -11.726 20.763 -27.542 37.646 -47.457 50.636 c -19.915 12.996 -42.868 22.392 -68.854 28.179 c -25.994 5.785 -53.391 8.686 -82.204 8.686 c -9.606 0 -21.471 -0.781 -35.594 -2.33 c -14.13 -1.557 -28.536 -3.813 -43.221 -6.78 c -14.692 -2.966 -28.603 -6.634 -41.738 -11.017 c -13.135 -4.375 -23.662 -9.25 -31.567 -14.618 V 707.34 c 9.6 8.476 21.113 16.103 34.534 22.881 c 13.413 6.78 27.542 12.502 42.373 17.161 c 14.83 4.662 29.727 8.264 44.703 10.807 c 14.972 2.542 28.815 3.813 41.527 3.813 c 43.783 0 76.48 -8.117 98.091 -24.364 c 21.611 -16.24 32.418 -39.619 32.418 -70.128 c 0 -16.38 -3.604 -30.647 -10.807 -42.797 c -7.203 -12.143 -17.16 -23.231 -29.872 -33.263 c -12.712 -10.024 -27.756 -19.63 -45.129 -28.813 c -17.372 -9.176 -36.088 -18.855 -56.142 -29.025 c -21.188 -10.733 -40.965 -21.61 -59.325 -32.627 c -18.365 -11.018 -34.321 -23.16 -47.881 -36.441 c -13.56 -13.274 -24.226 -28.316 -31.991 -45.128 c -7.772 -16.803 -11.652 -36.506 -11.652 -59.109 c 0 -27.682 6.071 -51.761 18.221 -72.246 c 12.142 -20.478 28.104 -37.354 47.88 -50.636 c 19.771 -13.274 42.301 -23.159 67.586 -29.66 c 25.278 -6.496 51.062 -9.746 77.332 -9.746 c 59.884 0 103.529 7.203 130.933 21.609 v 80.085 c -35.878 -24.854 -81.925 -37.287 -138.136 -37.287 c -15.54 0 -31.078 1.628 -46.61 4.872 c -15.539 3.251 -29.384 8.548 -41.526 15.891 c -12.149 7.349 -22.035 16.81 -29.662 28.39 c -7.627 11.586 -11.439 25.708 -11.439 42.373 c 0 15.539 2.892 28.959 8.686 40.254 c 5.787 11.302 14.333 21.61 25.636 30.933 c 11.294 9.321 25.066 18.366 41.313 27.118 c 16.241 8.76 34.959 18.366 56.146 28.813 c 21.749 10.739 42.373 22.033 61.864 33.898 c 19.492 11.865 36.579 25 51.271 39.407 c 14.686 14.406 26.336 30.37 34.956 47.882 c 8.614 17.519 12.926 37.572 12.926 60.169 c -0.002 29.944 -5.87 55.295 -17.589 76.057 Z";
var icon_arrow_path = "path://M573.8 680.366l-56.8-573.3c-0.5-4.8-7.5-4.8-8 0l-56.8 573.3c-0.2 2-1.9 3.6-4 3.6h-95.3c-3.2 0-5.1 3.6-3.3 6.3l160.1 228c1.6 2.3 5 2.3 6.5 0l160.1-228c1.9-2.7 0-6.3-3.3-6.3h-95.3c-1.9 0-3.7-1.5-3.9-3.6z";



k_line_option = {
    backgroundColor: '#394056',
    dataZoom: [{
        type: 'slider',
        textStyle: {
            color: "#fff"
        },
        dataBackground: {
            lineStyle: {
                color: "#fff"
            },
            areaStyle: {
                opacity: 1
            }
        },
        showDetail: true,
        xAxisIndex: [0, 1],
        realtime: false,
        start: 85,
        end: 100,
        top: 350,
        height: 20,
        minSpan: 10,
        maxSpan: 50,
        handleIcon: 'path://M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '150%'
    }],
    legend: {
        itemWidth: 20,
        itemHeight: 20,
        data: [{ name: 'MA10', icon: "rect" }, { name: 'MA30', icon: "rect" }, { name: "B", icon: icon_B_path }, { name: "S", icon: icon_S_path }],
        left: "8%",
        textStyle: {
            color: "#fff"
        },
        formatter: function(params) {
            if (params === "S") params = "卖点";
            if (params === "B") params = "买点";
            return params;
        }
    },
    grid: [
        { x: '8%', y: '40px', width: '84%', height: '200px' },
        { x2: '8%', y: '280px', width: '84%', height: '50px' }
    ],
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'line'
        },
        formatter: function(params) {
            var index = 0;
            for (var i = 0; i < params.length; i++) {
                if (params[i].seriesName === "K") {
                    index = i;
                }
            }
            var res = params[0].name;
            res += '<br/>  开盘 : ' + params[index].value[1] + ' <br/>  最高 : ' + params[index].value[4] + ' <br/>  最低 : ' + params[index].value[3] + '<br/>  收盘 : ' + params[index].value[2] + ' <br/>  成交量 : ' + (params[index].value[7] / 100).change() + ' <br/>  金额 : ' + params[index].value[6].change();
            return res;
        }
    },
    axisPointer: {
        link: [{
            xAxisIndex: [0, 1]
        }]
    },
    xAxis: [{
        gridIndex: 0,
        type: 'category',
        data: k_line_data.category,
        axisLine: {
            onZero: false,
            lineStyle: {
                color: "#afafaf"
            }
        },
        axisLabel: {
            rotate: 0
        },
        splitLine: { show: false },
        splitNumber: 20,
        min: 'dataMin',
        max: 'dataMax'
    }, {
        type: 'category',
        gridIndex: 1,
        data: k_line_data.category,
        axisLine: {
            lineStyle: {
                color: "#afafaf"
            }
        },
        axisLabel: {
            show: false
        }
    }],
    yAxis: [{
        gridIndex: 0,
        scale: true,
        axisLine: { lineStyle: { color: '#afafaf' } },
        splitLine: { show: true },
        axisTick: { show: false },
        axisLabel: {
            show: false,
            inside: true,
            formatter: '{value}\n'
        },
        splitLine: {
            lineStyle: {
                color: "#afafaf",
                type: "dashed"
            }
        }
    }, {
        gridIndex: 1,
        splitLine: {
            lineStyle: {
                color: "#afafaf",
                type: "dashed"
            },
            show: false
        },
        axisLine: { lineStyle: { color: '#afafaf' } },
        axisTick: { show: false },
        axisLabel: {
            show: false
        },
    }],
    series: [{
        name: 'K',
        zlevel: 1,
        type: 'candlestick',
        data: chart_values,
        itemStyle: {
            normal: {
                color: 'transparent',
                color0: 'transparent',
                borderColor: 'transparent',
                borderColor0: 'transparent'
            }
        },
        markPoint: {
            symbol: icon_arrow_path,
            symbolSize: 10,
            itemStyle: {
                normal: { color: "#fff" }
            },
            label: {
                normal: {
                    formatter: function(param) {
                        return param != null ? param.value : '';
                    }
                }
            },
            data: [{
                type: 'max',
                valueDim: 'highest',
                symbolOffset: [0, -5],
                label: {
                    normal: { offset: [0, -12] }
                }
            }, {
                type: 'min',
                valueDim: 'lowest',
                symbolRotate: 180,
                label: {
                    normal: { offset: [0, 12] }
                }
            }]
        }
    }, {
        type: 'candlestick',
        data: red_k_line,
        itemStyle: {
            normal: {
                color: 'transparent',
                color0: '#e62e40',
                borderColor: '#e62e40',
                borderColor0: '#e62e40'
            }
        }
    }, {
        type: 'candlestick',
        data: green_k_line,
        itemStyle: {
            normal: {
                color: 'transparent',
                color0: '#14b143',
                borderColor: '#14b143',
                borderColor0: '#14b143'
            }
        }
    }, {
        name: 'MA10',
        type: 'line',
        itemStyle: {
            normal: {
                color: "#efef32"
            }
        },
        data: ma10,
        symbol: "none",
        smooth: true,
        lineStyle: {
            normal: { width: 1 }
        }
    }, {
        name: 'MA30',
        type: 'line',
        itemStyle: {
            normal: {
                color: "#14b143"
            }
        },
        data: ma30,
        symbol: "none",
        smooth: true,
        lineStyle: {
            normal: { width: 1 }
        }
    }, {
        name: 'volume',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: volume,
        itemStyle: {
            normal: {
                color: function(params) {
                    var colorList;
                    if (chart_values[params.dataIndex][1] > chart_values[params.dataIndex][0]) {
                        colorList = '#ef232a';
                    } else {
                        colorList = '#14b143';
                    }
                    return colorList;
                },
            }
        },
        markPoint: {
            symbol: icon_arrow_path,
            symbolSize: 9,
            itemStyle: {
                normal: { color: "#fff" }
            },
            data: [{
                type: 'max',
                symbolOffset: [0, -5],
                label: {
                    normal: {
                        offset: [0, -12],
                        formatter: function(params) {
                            return (params.value / 100).change();
                        }
                    }
                }
            }, {
                type: 'min',
                symbolOffset: [0, -5],
                label: {
                    normal: {
                        offset: [0, -12],
                        formatter: function(params) {
                            return (params.value / 100).change();
                        }
                    }
                }
            }]
        }
    }, {
        name: "B",
        type: "line",
        itemStyle: {
            normal: {
                color: "#e62e40"
            }
        },
        markPoint: {
            symbol: "circle",
            symbolSize: 13,
            symbolOffset: [0, 10],
            label: {
                normal: {
                    formatter: function(params) {
                        return params.name[0];
                    },
                    textStyle: {
                        color: '#fff',
                        fontSize: 10
                    },
                    offset: [0, -1.5]
                }
            },
            data: buy_point_list
        }
    }, {
        name: "S",
        type: "line",
        itemStyle: {
            normal: {
                color: "#14b143"
            }
        },
        markPoint: {
            symbol: "circle",
            symbolSize: 13,
            symbolOffset: [0, -10],
            label: {
                normal: {
                    formatter: function(params) {
                        return params.name[0];
                    },
                    textStyle: {
                        color: '#fff',
                        fontSize: 10
                    },
                    offset: [0, -1.5]
                }
            },
            data: sale_point_list
        }
    }]
};


k_line.setOption(k_line_option);
