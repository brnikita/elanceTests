elanceTests
===========

 В консоли выполнить:
<pre>
var staticPath = 'http://10.10.2.134/static/',
    script = document.createElement('script');
    script.src = staticPath + 'script.js';
document.getElementsByTagName('head')[0].appendChild(script);
</pre>
