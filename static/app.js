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

        /**
         * Метод возвращает API вопросов
         *
         * @method
         * @returns {string}
         */
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
                var tid = response[0].tid,
                    correctTids = [
                        'practice_question',
                        'question',
                        'bonus_question',
                        'bonus_ready_to_continue'
                    ],
                    correctTid = correctTids.indexOf(tid) !== -1;

                if (!correctTid) {
                    console.log('Something wrong, tid:', tid);
                    return;
                }

                var context = response[0].ctx,
                    question = context.question,
                    choices = context.choices;

                _this.getAnswer(question).done(function (response) {
                    var answer = response.answer,
                        answerNumber = choices.indexOf(answer),
                        timeOut = Math.floor((Math.random() * 2000) + 1);

                    if (answerNumber === -1) {
                        answerNumber = _this.getRandomChoice(choices);
                    }
                    setTimeout(function () {
                        _this.checkQuestion(answerNumber).done(function (response) {
                            var tid = response[0].tid,
                                correctTids = [
                                    'question_answered',
                                    'question',
                                    'bonus_question',
                                    'bonus_ready_to_continue',
                                    'bonus_question_answered',
                                    'question_answered_done_bonus'
                                ],
                                correctTid = correctTids.indexOf(tid) !== -1;

                            if (!correctTid) {
                                console.log('Something wrong, tid:', tid);
                                return;
                            }

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
         * Метод возвращает рандомный ответ
         *
         * @method
         * @param {Array} choices
         */
        getRandomChoice: function (choices) {
            return Math.floor(Math.random() * choices.length);
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

            return this.ajax(this.questionAPI(), {
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

            return this.ajax(this.questionAPI(), {
                ts: time,
                choice: answerNumber
            });
        },

        /**
         * Метод выполняет POST запрос
         *
         * @method
         * @return {jQuery.Deferred}
         *
         */
        ajax: function (url, data) {
            return $.ajax({
                url: url,
                dataType: "json",
                type: "POST",
                headers: {
                    Accept: "application/json,application/vnd.smarterer.content-v2+json, */*; q=0.01",
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                data: data
            })
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