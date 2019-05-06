function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
jQuery.extend(jQuery.easing, {
    easeOutBack: function(x, t, b, c, d, s) {
        s = s || 1.3;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    }
});


function setIframeHeight(id) {
    var iframeid = document.getElementById(id); //iframe id 
    if (document.getElementById) {
        if (iframeid && !window.opera) {
            if (iframeid.contentDocument && iframeid.contentDocument.body.offsetHeight) {
                iframeid.height = iframeid.contentDocument.body.offsetHeight;
            } else if (iframeid.Document && iframeid.Document.body.scrollHeight) {
                iframeid.height = iframeid.Document.body.scrollHeight;
            }
        }
    }
}
//mor init
function mor_init() {
    // Set the first preview image
    $('.mor-list a').first().addClass('selected');
    var $this = $('.mor-list a').first();
    var mor_photo_caption = $this.attr('title');
    var mor_photo_fullsize = $this.attr('href');
    var mor_photo_preview = mor_photo_fullsize.replace("_fullsize", "_preview");
    var date = $this.data("date");
    var html = $this.data("html");
    var week = $this.data("week");
    var pool = $this.data("pool");

    $(".details-top .date-wrapper").html(date);
    $(".details-top .week-wrapper").html(week);
    $(".details-content").html(html);
    $(".details-bottom-content").html(pool);

    $('.mor-preview-content').html('<a target="_blank" href="' + mor_photo_preview + '"title="' + mor_photo_caption + '" ><img class="mor-preview-img" src="' + mor_photo_preview + '"></a>');
    var IScroll = $.AMUI.iScroll;
    $(".mor-preview-img").on("load", function(event) {
        myScroll = new IScroll('#wrapper', { mouseWheel: true });
    });

}

//noon init
function noon_init() {
    // Set the first preview image
    $('.noon-list a').first().addClass('selected');
    var noon_photo_caption = $('.noon-list a').first().attr('title');
    var noon_photo_fullsize = $('.noon-list a').first().attr('href');
    var noon_photo_preview = noon_photo_fullsize.replace("_fullsize", "_preview");
    $('.noon-preview-content').html('<a target="_blank" href="' + noon_photo_fullsize + '" title="' + noon_photo_caption + '" ><img class="noon-preview-img" src="' + noon_photo_preview + '"></a>');

    return noon_photo_fullsize;
}

//over init
function over_init() {
    // Set the first preview image
    $('.over-list a').first().addClass('selected');
    var over_photo_caption = $('.over-list a').first().attr('title');
    var over_photo_fullsize = $('.over-list a').first().attr('href');
    var over_photo_preview = over_photo_fullsize.replace("_fullsize", "_preview");
    $('.over-preview-content').html('<a target="_blank" href="' + over_photo_fullsize + '"  title="' + over_photo_caption + '" ><img class="over-preview-img" src="' + over_photo_preview + '"></a>');

}