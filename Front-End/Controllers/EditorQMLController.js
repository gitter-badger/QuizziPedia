/*******************************************************************************
 * Name: QuizziPedia::Front-End::Controllers::EditorQMLController;
 * Description: questa classe permette di gestire l'inserimento delle domande QML
 *
 *
 * Creation data: 03-05-2016;
 * Author: Alberto Ferrara;
 * License: MIT.
 ********************************************************************************
 * Updates history
 * -------------------------------------------------------------------------------
 * ID: EditorQMLController_20160526;
 * Update data: 26-05-2016;
 * Description: Aggiornato controller
 * Author: Franco Berton.
 *-------------------------------------------------------------------------------
 *
 * ID: EditorQMLController_20160510
 * Update data: 10-05-2016
 * Description: Aggiornato il controller alla versiona finalecon il metodo
 * goToWizard();
 * Author: Alberto Ferrara.
 * *-------------------------------------------------------------------------------
 * ID: EditorQMLController_20160505
 * Update data: 05-05-2016
 * Description: Aggiunti i metodi submitQuestion();
 * Author: Alberto Ferrara.
 * -------------------------------------------------------------------------------
 * ID: EditorQMLController_20160503
 * Update data: 03-05-2016
 * Description: Creato il controller;
 * Author: Alberto Ferrara.
 *-------------------------------------------------------------------------------
 *******************************************************************************/

app.controller('EditorQMLController', EditorQMLController);

EditorQMLController.$inject = ['$scope', '$rootScope', '$routeParams', 'QuestionsService', '$location', '$mdDialog', 'ErrorInfoModel','ngMeta', 'JSONtoQML','$window'];

function EditorQMLController($scope, $rootScope, $routeParams, QuestionsService, $location, $mdDialog, ErrorInfoModel, ngMeta, JSONtoQML, $window) {

    if ($rootScope.listOfKeys!=undefined){
        metaData();
    }
    var langDownloaded = $rootScope.$on("langDownloaded", function(event, args) {
        if(args){
            metaData();
        }
    });
    $scope.$on('$destroy', langDownloaded);

    function metaData() {
        ngMeta.setTitle($rootScope.listOfKeys.titleLangQML);
        ngMeta.setTag('description',$rootScope.listOfKeys.QMLDescription);
    }

    $scope.images=[]
    $scope.id = $routeParams.idQuestion;
    console.log(JSONtoQML.getTempQuestionID());
    if ($scope.id) {
        QuestionsService.getQuestion($scope.id, $routeParams.lang)
            .then(function (result) {
                var questionDownloaded = result.data;
                var topic=result.data.topic;
                JSONtoQML.setTempQuestionID(questionDownloaded._id);

                questionDownloaded=JSONtoQML.setToBeViewed(questionDownloaded);
                var topics;
                loadTopics(function(data) {
                  topics = data.filter(function(elem){
                    return elem.name==topic;
                  });
                  $scope.selectedTopic=topics[0];
                  $scope.backUpQuestion=JSON.stringify(questionDownloaded, null, 2);
                  $scope.question = JSON.stringify(questionDownloaded, null, 2);
                  $scope.topics = data;
                });
            }, function (err) {
                $scope.error = new ErrorInfoModel("9", $rootScope.listOfKeys.genericError, $rootScope.listOfKeys.noQuestionIdDownloaded);
                alert = $mdDialog.alert()
                    .title($scope.error.getTitle())
                    .content($scope.error.getMessage())
                    .ok('Ok');
                $mdDialog
                    .show(alert)
                    .finally(function () {
                        alert = undefined;
                    });
            });
    }
    else {
      console.log("dovrei cancellare l'id");
      JSONtoQML.deleteTempQuestionID();
      console.log(JSONtoQML.getTempQuestionID());
      loadTopics(function(data) {
        $scope.topics = data;
      });
    }

    /*Controllo che il numero di immagini inserite sia lo stesso sia in QML che in $scope.image*/
    function checkImagesNewQuestion(resultQML, imagesOnScope) {
      var found = false;
      var numberOfImages=0;
      resultQML.question.forEach(function(question) {

          if (question.image){
              numberOfImages++;
              found=true;
          }

          question.answers.forEach(function (answer) {
              if (answer.url || answer.url1 || answer.url2){
                numberOfImages++;
                found = true;
              }
          });
      });

      var goOn=false;
      if(imagesOnScope.length===numberOfImages) {
        goOn=true;
      }
      return goOn;
    }
    /*Controllo che il numero di nuove immagini inserite sia lo stesso sia in QML che in $scope.image*/

    function checkImagesEditQuestion(resultQML, oldQuestion, imagesOnScope) {
      console.log("vengo chiamato");
      var found = false;
      var numberOfImages=0;
      console.log(resultQML);
      console.log(angular.fromJson(oldQuestion));
      resultQML.question.forEach(function(question) {


          if (question.image){
            console.log("+++++++++++++++++++++++++");
            console.log("Confronto:");
            console.log(question.image);
            angular.fromJson(oldQuestion).question.forEach(function(q) {
                console.log("Con:");
                console.log(q.image);
                if (question.image != q.image){
                    console.log("Sta volta entro: SONO DIVERSI!");
                    numberOfImages++;
                    found=true;
                }

            });
          }
          console.log("+++++++++++++++++++++++++");

          question.answers.forEach(function (answer) {
              if (answer.url || answer.url1 || answer.url2){
                console.log("Confronto:");
                console.log(answer.url);
                console.log(answer.url1);
                console.log(answer.url2);

                angular.fromJson(oldQuestion).question.forEach(function(q) {

                    q.answers.forEach(function (a) {
                        console.log("Con:");
                        console.log(a.url);
                        console.log(a.url1);
                        console.log(a.url2);
                        if (answer.url!=a.url || answer.url1!=a.url1 || answer.url2!=a.url2){
                          console.log("Sta volta entro: SONO DIVERSI!");
                          numberOfImages++;
                          found = true;
                        }
                    });
                });
                console.log("+++++++++++++++++++++++++");


              }
          });
      });

      var goOn=false;
      console.log(imagesOnScope.length);
      console.log(numberOfImages);
      if(imagesOnScope.length===numberOfImages) {
        goOn=true;
      }
      console.log(goOn);
      return goOn;
    }



    $scope.submitQuestion = function (selectedTopic) {
        console.log(JSONtoQML.getTempQuestionID());
        var question = document.getElementById('Juiceeditor').value;
        if (question == undefined) {
            alert = $mdDialog.alert()
                .title($rootScope.listOfKeys.genericError)
                .content($rootScope.listOfKeys.emptyQuestion)
                .ok('Ok');
            $mdDialog
                .show(alert)
                .finally(function () {
                    alert = undefined;
                });
        }
        else {
            var result = '';
            try {
                result = jsonlint.parse(question.toString());
            }
            catch (e) {
                alert = $mdDialog.alert()
                    .title($rootScope.listOfKeys.genericError)
                    .content(e.message)
                    .ok('Ok');
                $mdDialog
                    .show(alert)
                    .finally(function () {
                        alert = undefined;
                    });
                return;
            }
            if (result) {
                var res = '';
                QuestionsService
                    .getTopics($routeParams.lang)
                    .then(function (result) {
                        var topics = result.data;
                        var resultQML = controlloQML(question, res, selectedTopic.name, topics, $routeParams.lang, $mdDialog);
                        console.log(resultQML);
                        var goOn;
                        if($routeParams.idQuestion==undefined) {
                          console.log("a");
                          goOn=checkImagesNewQuestion(resultQML, $scope.images);
                        }
                        else {
                          console.log("b");
                          $scope.backUpQuestion=controlloQML($scope.backUpQuestion, res, selectedTopic.name, topics, $routeParams.lang, $mdDialog);
                          goOn=checkImagesEditQuestion(resultQML, $scope.backUpQuestion, $scope.images);
                        }

                        if(JSONtoQML.getTempQuestionID()!==undefined) {
                          resultQML._id=JSONtoQML.getTempQuestionID();
                        }
                        if (resultQML && goOn) {
                            $rootScope.isDownloading=true;
                            console.log($routeParams.idQuestion);
                            QuestionsService.sendQuestion(resultQML, $routeParams.lang, $routeParams.idQuestion)
                                .then(function (result) {
                                    if (result) {
                                        QuestionsService.uploadImageQuestion(result.data.questionId,$scope.images,$routeParams.lang,$routeParams.idQuestion)
                                            .then(function (result) {
                                                alert = $mdDialog.alert()
                                                    .title($rootScope.listOfKeys.okInsertTitle)
                                                    .content($rootScope.listOfKeys.okInsertQuestion)
                                                    .ok('Ok');
                                                $mdDialog
                                                    .show(alert)
                                                    .finally(function () {
                                                        alert = undefined;
                                                    });
                                                JSONtoQML.deleteTempQuestionID();
                                                $rootScope.isDownloading=false;
                                                $location.path('/' + $routeParams.lang + '/questions');
                                            }, function (err) {
                                                $scope.error = new ErrorInfoModel();
                                                alert = $mdDialog.alert()
                                                    .title($rootScope.listOfKeys.genericError)
                                                    .content($rootScope.listOfKeys.noUploadImage)
                                                    .ok('Ok');
                                                $mdDialog
                                                    .show(alert)
                                                    .finally(function () {
                                                        alert = undefined;
                                                    });
                                                $rootScope.isDownloading=false;
                                            })
                                    }
                                }, function (err) {
                                    $scope.error = new ErrorInfoModel();
                                    alert = $mdDialog.alert()
                                        .title($rootScope.listOfKeys.genericError)
                                        .content($rootScope.listOfKeys.noUploadQuestion)
                                        .ok('Ok');
                                    $mdDialog
                                        .show(alert)
                                        .finally(function () {
                                            alert = undefined;
                                        });
                                    $rootScope.isDownloading=false;
                                });

                        }
                        else {
                          alert = $mdDialog.alert()
                              .title($rootScope.listOfKeys.genericError)
                              .content($rootScope.listOfKeys.noUploadQuestion)
                              .ok('Ok');
                          $mdDialog
                              .show(alert)
                              .finally(function () {
                                  alert = undefined;
                              });
                        }

                    }, function (err) {
                        $scope.error = new ErrorInfoModel(err.data.code, err.data.message, err.data.title);
                        alert = $mdDialog.alert()
                            .title($scope.error.getTitle())
                            .content($scope.error.getCode() + ": " + $scope.error.getMessage())
                            .ok('Ok');
                        $mdDialog
                            .show(alert)
                            .finally(function () {
                                alert = undefined;
                            });
                        $rootScope.isDownloading=false;
                    });


            }
        }
    };

    $scope.goToWizard = function () {
      alert = $mdDialog.alert()
          .title($rootScope.listOfKeys.funtionalityNotImplementedTitle)
          .content($rootScope.listOfKeys.funtionalityNotImplemented)
          .ok('Ok');
      $mdDialog
          .show( alert )
          .finally(function() {
              alert = undefined;
          });
    };

    $scope.showTutorialFlag=false;
    $scope.tutorialShowIndex=false;
    $scope.showTutorial = function () {
        $scope.showTutorialFlag=!$scope.showTutorialFlag;
    };


    $scope.uploadImage = function(image){
        if (image)
            $scope.images.push(image)

    }

    $scope.removeImage=function(image){
        var idx = $scope.images.indexOf(image);
        if (idx > -1) {
            $scope.images.splice(idx, 1);
        }
    }

    function loadTopics(callback) {
      QuestionsService
        .getTopics($routeParams.lang)
        .then(function(result){
            topics = result.data;
            callback(topics);
        } ,function (err){
            $scope.error = new ErrorInfoModel(err.data.code,  err.data.message, err.data.title);
            alert = $mdDialog.alert()
                .title($scope.error.getTitle())
                .content($scope.error.getCode()+": "+$scope.error.getMessage())
                .ok('Ok');
            $mdDialog
                .show( alert )
                .finally(function() {
                    alert = undefined;
                });
        });
    }



}
