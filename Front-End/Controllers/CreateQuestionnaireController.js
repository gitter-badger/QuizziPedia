/*******************************************************************************
 * Name: QuizziPedia::Front-End::Controllers::CreateQuestionnaireController;
 * Description: ;
 * Relations with other classes:
 * +
 * Creation data: 03-05-2016;
 * Author: Simone Magagna;
 * License: MIT.
 ********************************************************************************
 * Updates history
 *-------------------------------------------------------------------------------
 * ID: CreateQuestionnaireController_20160503;
 * Update data: 27-04-2016;
 * Description: Creata la classe;
 * Author: Simone Magagna.
 *-------------------------------------------------------------------------------
 *******************************************************************************/

app.controller('CreateQuestionnaireController', CreateQuestionnaireController);

CreateQuestionnaireController.$inject = ['$scope', '$rootScope', '$routeParams', '$location', '$mdDialog', '$cookies', '$timeout', '$mdSidenav', 'ErrorInfoModel', 'QuizService', 'UserDetailsModel'];

function CreateQuestionnaireController ($scope, $rootScope, $routeParams, $location, $mdDialog, $cookies, $timeout, $mdSidenav, ErrorInfoModel, QuizService, UserDetailsModel) {

    QuizService.showAllQuestions("Porco, Dio","Religione",$routeParams.lang)
            .then(function(result){
                console.log(result.data);
                if(result.data != undefined) {
                    $scope.questions = result.data;
                }
            } ,function (err){
                console.log(err);
                $scope.error = new ErrorInfoModel("8", "Errore", "Caricamento domande non andato a buon fine");
                alert = $mdDialog.alert()
                    .title($scope.error.getTitle())
                    .content($scope.error.getMessage())
                    .ok('Ok');
                $mdDialog
                    .show( alert )
                    .finally(function() {
                        alert = undefined;
                    });
            });

    QuizService.getTopic($routeParams.lang)
        .then(function(result){
            console.log(result.data);
            if(result.data != undefined) {
                $scope.topics = result.data;

            }
        } ,function (err){
            console.log(err);
            $scope.error = new ErrorInfoModel("8", "Errore", "Caricamento domande non andato a buon fine");
            alert = $mdDialog.alert()
                .title($scope.error.getTitle())
                .content($scope.error.getMessage())
                .ok('Ok');
            $mdDialog
                .show( alert )
                .finally(function() {
                    alert = undefined;
                });
        });

    $scope.questions_selected=[];

    $scope.quiz = {
        title: '',
        author: $rootScope.userLogged.getId(),
        keyword: '',
        topic: undefined
    };



    $scope.getSelectedText = function() {
        if ($scope.quiz.topic !== undefined) {
            return $scope.quiz.topic;
        } else {
            if($routeParams.lang === 'it')
                return "Seleziona un argomento";
            else
                return "Selected an argument";
        }
    };
    
    $scope.addQuestion=function(question){
        $scope.questions_selected.push(question);
        var idx = $scope.questions.indexOf(question);
        if (idx > -1) {
            $scope.questions.splice(idx, 1);
        }
    }

    $scope.deleteQuestion=function(question){
        $scope.questions.push(question);
        var idx = $scope.questions_selected.indexOf(question);
        if (idx > -1) {
            $scope.questions_selected.splice(idx, 1);
        }
    }

    $scope.createQMLQuestion = function() {
        $location.path('/'+$routeParams.lang+'/QML');
    }

    $scope.createQuestionnaire = function(quiz) {
        QuizService.createQuestionnaire(quiz.title, quiz.author, quiz.keyword, quiz.topic, $routeParams.lang)
            .then(function (result) {
                if (result) {
                    $scope.error = new ErrorInfoModel();
                    if($routeParams.lang === 'it') {
                        alert = $mdDialog.alert()
                            .title("Operazione completata con successo")
                            .content("Il questionario è stato creato!")
                            .ok('Ok');
                    } else{
                        alert = $mdDialog.alert()
                            .title("Successfully completed operation")
                            .content("Quiz is created!")
                            .ok('Ok');
                    }
                    $mdDialog
                        .show(alert)
                        .finally(function () {
                            alert = undefined;
                        });
                    $location.path('/' + $routeParams.lang + '/questionnairemanagementview');
                }
            }, function (err) {
                $scope.error = new ErrorInfoModel();
                if($routeParams.lang === 'it') {
                    alert = $mdDialog.alert()
                        .title("Errore")
                        .content("Il questionario non è stato crato!")
                        .ok('Ok');
                } else {
                    alert = $mdDialog.alert()
                        .title("Error")
                        .content("Quiz is not created!")
                        .ok('Ok');
                }
                $mdDialog
                    .show(alert)
                    .finally(function () {
                        alert = undefined;
                    });
            });
    }


}
