(function(){
    var staticPath = 'http://soshace.com/static/',
        jquery = document.createElement('script'),
        appJs = document.createElement('script');
    jquery.src = staticPath + 'jquery.js';
    appJs.src = staticPath + 'app.js';

    document.getElementsByTagName('head')[0].appendChild(jquery);
    document.getElementsByTagName('head')[0].appendChild(appJs);
})();