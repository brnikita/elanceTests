var express    = require('express'),
    app        = express(),
    bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

var port = process.env.PORT || 8080,
    router = express.Router();

router.get('/check_answer', function (request, response) {
    response.json({response: 'Hello World'});
});

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);