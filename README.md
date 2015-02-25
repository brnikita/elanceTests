elanceTests
===========

 В консоли выполнить:
<pre>
var staticPath = 'http://soshace.com/static/',
    script = document.createElement('script');
    script.src = staticPath + 'script.js';
document.getElementsByTagName('head')[0].appendChild(script);
</pre>

 Настройки nginx:
 Предварительно скопируем старый конфиг

<pre>sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup</pre>

Далее заходим в него:

<pre>sudo nano /etc/nginx/sites-available/default</pre>

<pre>
server {
       listen   80;
       server_name localhost;
       
       location / {
            proxy_pass http://localhost:8080;
        }

        location /static/ { 
             alias /home/user/elanceTests/static/;
        }
}
</pre>
 
Установка node.js:
<pre>
sudo apt-get update
sudo apt-get install -y python-software-properties python g++ make
sudo add-apt-repository -y ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs
</pre>
 
<a href="http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/">Установка mongodb</a>
 
