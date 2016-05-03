var mongoose = require('mongoose');
var Question = require('./QuestionModel');
var User = require('./UserModel');


var quizSchema = new mongoose.Schema({
    title: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    questions:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    registeredUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    activeUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    correctAnswers: Number
});



quizSchema.statics.createQuiz = function(info, callback) {
    var quiz = new this();
    quiz.title = info.title;
    quiz.correctAnswers = info.correctAnswers;
    return quiz.save(callback);
}

quizSchema.statics.editQuiz = function(info, callback) {

}

quizSchema.statics.addUser = function(userId, callback) {

}


quizSchema.statics.getQuiz=function(quizId, callback){
    var quizJson = new this();
    quizJson = Quiz.findOne({'_id':quizId}, callback);
    console.log(quizJson);
    return quizJson;


    /*Question.getQuestion(quizJson.quiz.questions,function(err,questions){
        if (err) return handleError(err);
        quizJson.questions=questions;
        return quizJson;
    });*/

}

var Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;

