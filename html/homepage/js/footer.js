document.writeln("    <div class=\'footer\'>");
document.writeln("        <div class=\'am-g cooperation\'>");
document.writeln("            <div class=\'co-wrapper\'>");
document.writeln("                <div class=\'left\'>");
document.writeln("                    <p>合作机构</p>");
document.writeln("                    <img class=\'cooperation-img\' src=\'images/cooperation01.jpg\' alt=\'\'>");
document.writeln("                </div>");
document.writeln("                <div class=\'left\'>");
document.writeln("                    <p>合作伙伴</p>");
document.writeln("                    <img class=\'cooperation-img\' src=\'images/cooperation02.jpg\' alt=\'\'>");
document.writeln("                </div>");
document.writeln("                <div class=\'left wechat\'>");
document.writeln("                    <img src=\'images/contact_qrcode.jpg\' alt=\'\'>");
document.writeln("                    <p>官方微信</p>");
document.writeln("                </div>");
document.writeln("            </div>");
document.writeln("        </div>");
document.writeln("        <div class=\'copyright\'>");
document.writeln("            <div class=\'am-container\'>");
document.writeln("                <p><a href=\'disclaimer.html\'>免责声明</a>　<a href=\'product.html\'>会员专享</a>　<a href=\'payment.html\'>付款方式</a>　<a href=\'contact.html\'> 联系我们</a>　<a href=\'join_us.html\'>加入我们</a></p>");
document.writeln("                <p>湖南巨景证券投资顾问有限公司广州分公司：中国证监会首批认证证券咨询机构（编号ZX0018）</p>");
document.writeln("                <p>地址：广州市番禺区市桥捷进二路1号骏和广场403室</p>");
document.writeln("                <p>投诉、咨询电话：0731-82735966(总部) 020-84806199 13392657899　服务时间：9:00 - 17:30 (交易日)</p>");
document.writeln("                <p>1993-2017 湖南巨景证券投资顾问有限公司广州分公司版权所有 网站备案号：<a target=\'_blank\'  href=\'http://www.miitbeian.gov.cn/\'>粤ICP备17017433号</a></p>");
document.writeln("                <p>股市有风险，投资需谨慎</p>");
document.writeln("            </div>");
document.writeln("        </div>");
document.writeln("    </div>");
var reg = /\/((\w|-|\s)+)\.html/ig;
var temp = window.location.href.split("#")[0].split("/");
temp = temp[temp.length - 1]
// temp=temp[temp.length-1].replace(".html","");
if (temp == "product_list.html") { temp = temp.replace("_list", ""); }
console.log();
if (temp == "index.html" || temp == "") {

} else {
    $(".cooperation").remove();
}
if(temp!=""){
$("a[href='" + temp + "']").parent().addClass("nav-current");
}else{
	$("a[href='index.html']").parent().addClass("nav-current");
}
$("script[src='js/footer.js']").remove();