/*******************************************************************************
 * Name: QuizziPedia::Front-End::Controllers::QuestionsManagementController;
 * Description: questa classe permette di gestire le domande utente;
 *
 *
 * Creation data: 04-05-2016;
 * Author: Alberto Ferrara;
 * License: MIT.
 ********************************************************************************
 * Updates history
 *-------------------------------------------------------------------------------
 * ID: LoginController_20160510
 * Update data: 10-05-2016
 * Description: Scritti i metodi per eseguire la gestione delle domande;
 * Author: Alberto Ferrara.
 *-------------------------------------------------------------------------------
 * ID: LoginController_20160504
 * Update data: 04-05-2016
 * Description: Creato il controller;
 * Author: Alberto Ferrara.
 *-------------------------------------------------------------------------------
 *******************************************************************************/

app.controller('QuestionsManagementController', QuestionsManagementController);

QuestionsManagementController.$inject = ['$scope', '$rootScope', '$routeParams', 'QuestionsService', '$location', '$mdDialog', 'ErrorInfoModel'];

function QuestionsManagementController($scope, $rootScope, $routeParams, QuestionsService, $location, $mdDialog, ErrorInfoModel){
    if($rootScope.userLogged != undefined){
        loadQuestions();
    }
    else{
        var ist = $rootScope.$on("userDownloaded", function(event, args) {
        if(args){
            loadQuestions();
        }
        })
        $scope.$on('$destroy', ist);
    }

    function loadQuestions(){
        var username = $rootScope.userLogged.getUsername();
        if(username){
            QuestionsService.getUsersQuestions($routeParams.lang)
                .then(function(result){
                    if(result.data != undefined) {
                        $scope.questions = result.data;
                    }
                } ,function (err){
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
        }
    };

    $scope.editQuestion = function (idQuestion) {
        $location.path('/'+$routeParams.lang+'/QML/' + idQuestion);
    };

    $scope.goToWizardCreation = function(){
        $location.path('/' + $routeParams.lang + '/wizard');
    }

    $scope.goToQMLCreation = function(){
        $location.path('/' + $routeParams.lang + '/QML');
    }

    $scope.uploadImage = function(image){
        QuestionsService.uploadImage(image)
            .success(function(uploadResponse){
            })
            .error(function(error){
            })
    };


}
