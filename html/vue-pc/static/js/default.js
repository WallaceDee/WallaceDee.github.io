;
(function () {
    var js = [];
    js.push('../static/js/config.js');
    js.push('../static/js/browser-polyfill.min.js');
    js.push('../static/js/js.cookie.min.js');
    js.push('../static/js/vue.js');
    js.push('../static/js/iview.min.js');
    js.push('../static/js/underscore-min.js');
    js.push('../static/js/axios.min.js');
    js.push('../static/js/require.js');
    js.push('../static/js/require_config.js');
    js.push('../static/components/page.js');
    js.push('../static/components/department-picker.js');
    js.push('../static/components/bnd-picker.js');
    js.push('../static/components/uploadImg.js');
    js.push('../static/components/addrPicker.js');
    js.push('../static/components/index.js');
    js.push('../static/js/utils.js');

    for (var i in js) {
        document.write('<script type="text/javascript" src="' + js[i] + '"><\/script>');
    }
})();