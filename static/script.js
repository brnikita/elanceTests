(function(){
    var staticPath = 'http://' + window.serverUrl + '/static/',
        jquery = document.createElement('script'),
        appJs = document.createElement('script'),
        classJs = document.createElement('script');

    jquery.src = staticPath + 'jquery.js';
    appJs.src = staticPath + 'app.js';
    classJs.src = staticPath + 'class.js';

    document.getElementsByTagName('head')[0].appendChild(jquery);
    document.getElementsByTagName('head')[0].appendChild(classJs);
    document.getElementsByTagName('head')[0].appendChild(appJs);
})();