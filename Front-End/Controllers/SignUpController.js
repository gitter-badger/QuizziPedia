/*******************************************************************************
* Name: QuizziPedia::Front-End::Views::SingUpController
* Description:
* Relations with other classes:
* + SignUpView
* + AuthService
* Creation data: 27-04-2016
* Author: Simone Magagna
********************************************************************************
* Updates history
*-------------------------------------------------------------------------------
* ID: SingUpController_20160427
* Update data: 27-04-2016
* Description: creazione
* Author: Simone Magagna
*-------------------------------------------------------------------------------
*******************************************************************************/
app.controller('SignUpController', SignUpController);

SignUpController.$inject = ['$scope','$timeout','$mdSidenav', '$mdDialog', '$location', '$routeParams', 'MenuBarModel', 'AuthService'];

function SignUpController ($scope, $rootScope, $routeParams, AuthService, $location, $mdDialog, $cookies, UserDetailsModel, ErrorInfoModel) {
        $scope.user = {
            nome: '',
            cognome: '',
            email: '',
            username: '',
            password: ''
        };

        $scope.logIn = function() {
            $scope.$location.path("/"+$routeParams.lang+"/login")
        }

        $scope.signUp = function (user) {
            var result = AuthService.signup(user.username, user.password, usre.email, user.nome, user.cognome);
            return result
                .then(function(data){
                    return new UserDetailsModel(data.name, data.surname, data.username, data.email, data.password);
                })
                .catch(function(response){
                    console.error('Gists error', response.status, response.data);
                    return new ErrorInfoModel("3", "La registrazione non è andata a buon fine", "Registrazione non " +
                        "effettuata");
                })
        }
    }