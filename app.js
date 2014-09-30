var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

var port = process.env.PORT || 8080,
    router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/elance');

var Question = mongoose.model('Question', {
    test: String,
    question: String,
    answer: String
});

//Метод получает ответ
router.get('/answer', function (request, response) {
    var query = request.query;
    Question.findOne(query).exec(function (error, question) {
        var answer;

        if (error) {
            response.json({answer: null});
            return;
        }

        answer = question && question.answer;
        response.json({answer: answer});
    });
});

//Метод сохраняет вопрос в базу
router.post('/answer', function (request, response) {
    var postData = request.body,
        question = new Question(postData);

    question.save(function (error) {
        if (error) {
            response.json({error: 'Question did not saved'});
            return;
        }

        response.json({success: 'Question saved'});
    });
});

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);