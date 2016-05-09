/*******************************************************************************
 * Name: QuizziPedia::Front-End::Models:QuestionnaireModel;
 * Description: ;
 * Relations with other classes:
 * +
 * Creation data: 03-05-2016;
 * Author: Simone Magagna;
 * License: MIT.
 ********************************************************************************
 * Updates history
 *-------------------------------------------------------------------------------
 * ID: QuestionnaireModel_20160504;
 * Update data: 27-04-2016;
 * Description: Creata la classe;
 * Author: Simone Magagna.
 *-------------------------------------------------------------------------------
 *******************************************************************************/

app.factory('QuestionnaireModel', QuestionnaireModel);

function QuestionnaireModel() {

    var QuestionnaireModel = function (author, name, keyword, argument, questions, id) {
        var author = author;
        var name_ = name;
        var keyword = keyword;
        var argument = argument;
        var questions = [];
        var id_ = id;

        this.setAuthor = function (author) {
            author_ = author;
        };

        this.setName = function (name) {
            name_ = name;
        };

        this.setKeyword = function (keyword) {
            keyword_ = keyword;
        };

        this.setArgument = function (argument) {
            argument_ = argument;
        };


        this.setId = function (id) {
            id_ = id;
        };


        this.getName = function () {
            return name_;
        };

        this.getKeyword = function () {
            return keyword_;
        };

        this.getArgument = function () {
            return argument_;
        };

        this.getId = function () {
            return id_;
        };

        this.getQuestions = function () {
            return questions;
        };

        this.insertQuestion = function(question) {
            questions.push(question);
        };

        this.removeQuestion = function(id) {
            qLength = questions.length;
            for(var i = 0; i < qLength; i++) {
                if(questions[i].id === id) {
                    delete questions[i];
                }
            }
        };
    }
    return QuestionnaireModel;
}