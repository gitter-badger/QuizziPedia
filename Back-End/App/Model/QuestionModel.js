/*******************************************************************************
* Name: QuizziPedia::Back-End::App::Models::QuestionModel;
* Description: classe che modella i dati relativi alle domande all’interno
* dell’applicazione;
* Creation data: 02-05-2016;
* Author: Marco Prelaz.
********************************************************************************
* Updates history
* -------------------------------------------------------------------------------
* Update data: 13-06-2016;
* Description: Corretto vari bugs;
* Author: Matteo Granzotto.
*-------------------------------------------------------------------------------
* ID: QuestionModel_20160509;
* Update data: 09-05-2016;
* Description: Aggiunti metodi createQuestion(), getQuestion(), getQuestions(),
* editQuestion(), updateLevel(), addKeyword(), addCorrect(), addTotal(),
* getAllQuestions()
* Autore: Marco Prelaz.
*-------------------------------------------------------------------------------
* ID: QuestionModel_20160509;
* Update data: 09-05-2016;
* Description: Modificato il questionSchema;
* Autore: Marco Prelaz.
*-------------------------------------------------------------------------------
* ID: QuestionModel_20160502;
* Update data: 02-05-2016;
* Description: Creata classe;
* Autore: Marco Prelaz.
*-------------------------------------------------------------------------------
* ID: QuestionModel_20160502;
* Update data: 02-05-2016;
* Description: Aggiunti metodi createQuestion(), getQuestion(), getQuestions(),
* editQuestion(), updateLevel(), addKeyword(), addCorrect(), addTotal(),
* getAllQuestions()
* Autore: Marco Prelaz.
*-------------------------------------------------------------------------------
*******************************************************************************/

var mongoose = require('mongoose');
var random = require('mongoose-simple-random');

var questionSchema = new mongoose.Schema({
    author: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    makeWith: String,
    language: String,
    question: [{
        _id:false,
        type: {type: String},
        questionText: {type: String},
        image: {type: String},
        answers: [{
            _id:false,
            text: {type: String},
            url: {type: String},
            //attributo per VF e Multipla
            isItRight: {type: String},
            //attributo ordinamenti
            position: {type: Number},
            //attributi collegamento
            text1: {type: String},
            text2: {type: String},
            url1: {type: String},
            url2: {type: String},
            //attributi area cliccabile
            x: {type: Number},
            y: {type: Number},
            //attributo spazi vuoti
            parolaNumero: {type: Number}
        }],
    }],
    keywords: [String],
    level: {type:Number, default: 500},
    totalAnswers: {type:Number, default: 0},
    correctAnswers: {type:Number, default: 0},
});


questionSchema.plugin(random);

questionSchema.statics.createQuestion=function(author,question, callback){
    question.author = author
    var new_question = new this(question);
    return new_question.save(callback);
};

questionSchema.statics.getQuestion=function(questionId,callback) {
    return this.findOne({'_id': questionId},'makeWith language question keywords', callback);
}

questionSchema.statics.getQuestions=function(author, callback){
    return this.find({'author': author},'_id makeWith language question.type question.questionText question.answers', callback);
};

questionSchema.statics.saveImages=function(questionId,images,callback){
    return this.findOne({'_id': questionId}, function(err, questionSelected){
        var exit=false;
        questionSelected.question.forEach(function(question) {
            var found = false;
            images.forEach(function (image) {
                if (question.image){
                  var str= question.image.replace(" ", "");
                  var arr = str.split("/");
                  questionImage=arr[arr.length-1];
                    if (questionImage==(image.filename.replace(" ", ""))) {
                        question.image = image.path.substr(10)
                        found = true;

                    }
                }
                else
                        found = true;
            });
            if (found)
                found = false;
            else{
                exit=true;
                return callback("Immagine non caricata",questionSelected)
            }

            question.answers.forEach(function (answer) {
                var found=false;
                images.forEach(function (image) {
                    if (answer.url || answer.url1 || answer.url2){
                        if (answer.url && answer.url == image.filename) {
                            answer.url = image.path.substr(10)
                            found = true;
                        }
                        if (answer.url1 && answer.url1 == image.filename) {
                            answer.url1 = image.path.substr(10)
                            found = true;
                        }
                        if (answer.url2 && answer.url2 == image.filename) {
                            answer.url2 = image.path.substr(10)
                            found = true;
                        }
                    }
                    else
                        found=true;
                })
                if (found)
                    found=false;
                else{
                    exit=true;
                    return callback("Immagine non caricata",questionSelected)
                }
            })
        })
        questionSelected.save(function (err) {
            if(err)
                return callback("Immagine non caricata",questionSelected)
        });
        if (!exit)
            return callback(null)
    });
}


questionSchema.statics.editQuestion=function(questionEdited,callback){
        questionEdited.question.forEach(function (quest) {
            if (quest.image) {
                quest.image = 'Images/Questions/'+questionEdited._id+'/'+ quest.image.replace(" ", "")
            }
            quest.answers.forEach(function (answer) {
                if (answer.url)
                    answer.url = 'Images/Questions/'+questionEdited._id+'/'+answer.url.replace(" ", "");
                if (answer.url1)
                    answer.url1 = 'Images/Questions/'+questionEdited._id+'/'+answer.url1.replace(" ", "");
                if (answer.url2)
                    answer.url2 = 'Images/Questions/'+questionEdited._id+'/'+answer.url2.replace(" ", "");
            })
        })
        return this.findOneAndUpdate({'_id' : questionEdited._id}, questionEdited, callback)
};

questionSchema.statics.updateLevel=function(questionId,userLevel,isCorrected,callback){
    this.findOne({_id:questionId}, function(err,question){
        if(err){
            return next(err);
        }
        var oldDifficult = question.level;
        var differentLevel = oldDifficult - userLevel;
        // caso in cui la domanda sia piÃ¹ difficile dell'abilitÃ  dell'utente:
        if(differentLevel <= 100 && differentLevel > 0){
            var scarto = oldDifficult - userLevel;
            if(isCorrected == true){
                if(scarto > 90){
                    question.level = oldDifficult + 21;
                }else if(scarto > 80){
                    question.level = oldDifficult + 20;
                }else if(scarto > 70){
                    question.level = oldDifficult + 19;
                }else if(scarto > 60){
                    question.level = oldDifficult + 18;
                }else if(scarto > 50){
                    question.level = oldDifficult + 17;
                }else if(scarto > 40){
                    question.level = oldDifficult + 16;
                }else if(scarto > 30){
                    question.level = oldDifficult + 15;
                }else if(scarto > 20){
                    question.level = oldDifficult + 14;
                }else if(scarto > 10){
                    question.level = oldDifficult + 13;
                }else if(scarto > 0){
                    question.level = oldDifficult + 12;
                }
            } else{
                if(scarto > 90){
                    question.level = oldDifficult - 1;
                }else if(scarto > 80){
                    question.level = oldDifficult - 2;
                }else if(scarto > 70){
                    question.level = oldDifficult - 3;
                }else if(scarto > 60){
                    question.level = oldDifficult - 4;
                }else if(scarto > 50){
                    question.level = oldDifficult - 5;
                }else if(scarto > 40){
                    question.level = oldDifficult - 6;
                }else if(scarto > 30){
                    question.level = oldDifficult - 7;
                }else if(scarto > 20){
                    question.level = oldDifficult - 8;
                }else if(scarto > 10){
                    question.level = oldDifficult - 9;
                }else if(scarto > 0){
                    question.level = oldDifficult - 10;
                }
            }
        }
        else{
            // caso in cui la domanda sia più facile dell'abilità  dell'utente
            var scarto = userLevel - oldDifficult;
            if(isCorrected == true){
                if(scarto > 90){
                    question.level = oldDifficult - 1;
                }else if(scarto > 80){
                    question.level = oldDifficult - 2;
                }else if(scarto > 70){
                    question.level = oldDifficult - 3;
                }else if(scarto > 60){
                    question.level = oldDifficult - 4;
                }else if(scarto > 50){
                    question.level = oldDifficult - 5;
                }else if(scarto > 40){
                    question.level = oldDifficult - 6;
                }else if(scarto > 30){
                    question.level = oldDifficult - 7;
                }else if(scarto > 20){
                    question.level = oldDifficult - 8;
                }else if(scarto > 10){
                    question.level = oldDifficult - 9;
                }else if(scarto > 0){
                    question.level = oldDifficult - 10;
                }else if(scarto == 0){
                    question.level = oldDifficult - 11;
                }
            } else{
                if(scarto > 90){
                    question.level = oldDifficult + 21;
                }else if(scarto > 80){
                    question.level = oldDifficult + 20;
                }else if(scarto > 70){
                    question.level = oldDifficult + 19;
                }else if(scarto > 60){
                    question.level = oldDifficult + 18;
                }else if(scarto > 50){
                    question.level = oldDifficult + 17;
                }else if(scarto > 40){
                    question.level = oldDifficult + 16;
                }else if(scarto > 30){
                    question.level = oldDifficult + 15;
                }else if(scarto > 20){
                    question.level = oldDifficult + 14;
                }else if(scarto > 10){
                    question.level = oldDifficult + 13;
                }else if(scarto > 0){
                    question.level = oldDifficult + 12;
                }else if(scarto == 0){
                    question.level = oldDifficult + 11;
                }
            }
        }
        // controllo che il livello non sia oltre i limiti
        if(question.level > 1000){
            question.level = 1000;
        }
        else if(question.level < 0){
            question.level = 0;
        }
        return question.save(callback)
    })

}

questionSchema.statics.addKeyword=function(questionId,keyword,callback){

}

questionSchema.statics.addCorrect=function(questionId,callback){
    this.findOneAndUpdate({_id: questionId},{ $inc: { correctAnswers: 1 }},callback)

}

questionSchema.statics.addTotal=function(questionId,callback){
    this.findOneAndUpdate({_id: questionId},{ $inc: { totalAnswers: 1 }},callback)
}

questionSchema.statics.getAllQuestions = function(questionsID, keywords, lang, callback) {
    if (keywords[0]!='null')
        this.find({_id: questionsID.question,language: lang,keywords: {$in :keywords}}, callback)
    else{
        var questions_array = [];
        var this1=this;

        if (questionsID.length) {
            var i=questionsID.length
            questionsID.forEach(function (questionID) {
                this1.find({_id: {$in: questionID.question}, language: lang}, function (err, q) {
                    q.forEach(function (question) {
                        questions_array.push(question);
                    })
                    i--;
                    if (i == 0)
                        callback(null, questions_array)
                })
            })
        }
        else {
            this1.find({_id: {$in: questionsID.question}, language: lang}, callback)
        }

    }
}


module.exports = mongoose.model('Question', questionSchema);
