requirejs.config({
    baseUrl: IS_PLATFORM ? '../../static/js' : '../static/js',
    paths: {
        'md5': 'md5',
        'jsencrypt': 'jsencrypt'
    }
});