(function () {

    var app = {
        /**
         * Имя теста
         *
         * @field
         * @type {string | null}
         */
        testName: null,

        /**
         * Флаг означающий, что тест надо остановить
         *
         * @field
         * @type {boolean}
         */
        _stopTest: false,

        /**
         * Поле содержит имя хоста и алиас API
         *
         * @field
         * @type {string}
         */
        apiPath: 'http://soshace.com/api/',

        questionAPI: function () {
            var testName = this.testName;

            return '/tests/' + testName + '/run';
        },

        /**
         * @method
         * @param {string} testName имя теста
         */
        startTets: function (testName) {
            this.testName = testName;
            this._stopTest = false;
            this.iterator();
        },

        /**
         * Метод останавливает опросник
         *
         * @method
         * @returns {undefined}
         */
        stopTest: function () {
            this._stopTest = true;
        },

        /**
         * Метод циклично запускается
         * Собирает ответы на вопросы
         *
         * @method
         * @returns {undefined}
         */
        iterator: function () {
            var _this = this;

            this.getQuestion().done(function (response) {
                var context = response[0].ctx,
                    question = context.question,
                    choices = context.choices;

                _this.getAnswer(question).done(function (response) {
                    var answer = response.answer,
                        answerNumber = choices.indexOf(answer),
                        timeOut = Math.floor((Math.random() * 2000) + 1);

                    setTimeout(function () {
                        _this.checkQuestion(answerNumber).done(function (response) {
                            var context = response[0].ctx,
                                answerNumber = context.answer,
                                correct = context.correct,
                                answer = choices[answerNumber],
                                score = context.score;

                            if (!correct) {
                                _this.saveAnswer(question, answer);
                            }

                            console.log('score: ', score);

                            if (!_this._stopTest) {
                                _this.iterator();
                            }
                        });
                    }, timeOut);
                })
            });
        },

        /**
         * Метод возвращает время для запроса
         *
         * @method
         * @returns {string}
         */
        getTime: function () {
            var today = new Date(),
                time = String(today.getTime());

            return time.substring(0, time.length - 3);
        },

        /**
         * Метод получет вопрос
         *
         * @method
         * @returns {jQuery.Deferred}
         */
        getQuestion: function () {
            var time = this.getTime();

            return $.post(this.questionAPI(), {
                ts: time,
                action: 'continue'
            });
        },

        /**
         * Метод проверяет вопрос используя API опросника
         *
         * @method
         * @param {number | string} answerNumber
         * @returns {jQuery.Deferred}
         */
        checkQuestion: function (answerNumber) {
            var time = this.getTime();

            return $.post(this.questionAPI(), {
                ts: time,
                choice: answerNumber
            });
        },

        /**
         * Метод спршивает ответ у сервера
         *
         * @method
         * @param {string} question
         * @returns {jQuery.Deferred}
         */
        getAnswer: function (question) {
            var apiPath = this.apiPath,
                testName = this.testName;

            return $.get(apiPath + 'answer', {
                test: testName,
                question: question
            });
        },

        /**
         * Метод сохраняет вопрос с ответом
         *
         * @method
         * @param {string} question
         * @param {string} answer
         * @returns {jQuery.Deferred}
         */
        saveAnswer: function (question, answer) {
            var apiPath = this.apiPath,
                testName = this.testName;

            return $.post(apiPath + 'answer', {
                test: testName,
                question: question,
                answer: answer
            });
        }
    };

    window.testHack = app;
})();