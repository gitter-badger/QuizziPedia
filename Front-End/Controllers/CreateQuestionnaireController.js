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

CreateQuestionnaireController.$inject = ['$scope', '$rootScope', '$routeParams', '$location', '$mdDialog', '$cookies', '$timeout', '$mdSidenav', 'QuizService', 'ErrorInfoModel'];

function CreateQuestionnaireController ($scope, $rootScope, $routeParams, $location, $mdDialog, $cookies, $timeout, $mdSidenav, ErrorInfoModel, QuizService) {

    $scope.quiz = {
        name: '',
        keywords: '',
        selectedItem: undefined
    };

    $scope.items = ['Scienze', 'Informatica', 'Storia'];

    $scope.getSelectedText = function() {
        if ($scope.quiz.selectedItem !== undefined) {
            return $scope.quiz.selectedItem;
        } else {
            if($routeParams.lang === 'it')
                return "Seleziona un argomento";
            else
                return "Selected an argument";
        }
    };

    $scope.createQMLQuestion = function() {
        $location.path('/'+$routeParams.lang+'/QML');
    }

    $scope.createQuestionnaire = function(quiz) {
        QuizService.createQuestionnaire(quiz.name, quiz.keywords, quiz.selectedItem, $routeParams.lang)
            .then(function (result) {
                if (result) {
                    $scope.error = new ErrorInfoModel();
                    alert = $mdDialog.alert()
                        .title("Inserimento avvenuto con successo")
                        .content("Il questionario è stato creato!")
                        .ok('Ok');
                    $mdDialog
                        .show(alert)
                        .finally(function () {
                            alert = undefined;
                        });
                    $location.path('/' + $routeParams.lang + '/home');
                }
            }, function (err) {
                $scope.error = new ErrorInfoModel();
                alert = $mdDialog.alert()
                    .title("Errore")
                    .content("La richiesta di creazione questionario non è andata a buon fine")
                    .ok('Ok');
                $mdDialog
                    .show(alert)
                    .finally(function () {
                        alert = undefined;
                    });
            });
    }
}
