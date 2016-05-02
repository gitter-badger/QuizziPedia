/*******************************************************************************
* Name: QuizziPedia::Front-End::Controllers::MenuBarController;
* Description: questa classe permette di gestire il menù fisso per ogni pagina;
* Fornisce le funzionalità per aggiornare, a seconda della pagina, il contenuto
* del menù;
* Relations with other classes:
* + AuthService;
* + MenuBarModel.
* Creation data: 27-04-2016;
* Author: Matteo Granzotto;
* License: MIT.
********************************************************************************
* Updates history
*-------------------------------------------------------------------------------
* ID: MenuBarController_20160427;
* Update data: 27-04-2016;
* Description: Creata la classe;
* Author: Matteo Granzotto.
*-------------------------------------------------------------------------------
*******************************************************************************/

app.controller('MenuBarController',MenuBarController);

MenuBarController.$inject = ['$scope', '$rootScope', '$timeout','$mdSidenav', '$mdDialog', '$location', '$routeParams', 'MenuBarModel', 'ErrorInfoModel', 'AuthService', 'UserDetailsModel'];
function MenuBarController ($scope, $rootScope, $timeout, $mdSidenav, $mdDialog, $location,$routeParams, MenuBarModel, ErrorInfoModel, AuthService, UserDetailsModel) {

  /* Scope variables and function*/

  $rootScope.userLogged = new UserDetailsModel("Alberto", "Ferrara", "albertoferrara92@gmail.com", "path", "aferrara", "stats" , "500", "pro", "01");


  if($rootScope.userLogged != undefined) {
    $rootScope.directivesChoose= MenuBarModel.getDirectives(location, $rootScope.userLogged.getPrivilege());
  }

  $scope.logIn = function () {
    $location.path('/'+$routeParams.lang+'/login');
  };
  $scope.signUp = function () {
    $location.path('/'+$routeParams.lang+'/signup');
  };
  $scope.goToUserPage = function () {
    $location.path('/'+$routeParams.lang+'/'); // da completare
  };
  $scope.goToUserManagementPage = function () {
    $location.path('/'+$routeParams.lang+'/'); // da completare
  };
  $scope.goToQuestionsManagementPage = function () {
    $location.path('/'+$routeParams.lang+'/'); // da completare
  };
  $scope.goToQuizManagementPage = function () {
    $location.path('/'+$routeParams.lang+'/'); // da completare
  };
  $scope.logOut = function () {
    // In futuro...
    //AuthService.logout($rootScope.userLogged.getUsername());
    $rootScope.userLogged = new UserDetailsModel("", "", "", "", "", "" , "", "", "");
    $rootScope.directivesChoose= MenuBarModel.getDirectives(location, $rootScope.userLogged.getPrivilege());
    $location.path('/'+$routeParams.lang+'/home');
  };
  /*Variable for animations*/
  $scope.toggleLeft = buildDelayedToggler('left');
  $scope.toggleRight = buildToggler('right');
  $scope.isOpenRight = function(){
    return $mdSidenav('right').isOpen();
  };

  /*Auxiliary functions for menubar*/
  function debounce(func, wait, context) {
    var timer;
    return function debounced() {
      var context = $scope,
          args = Array.prototype.slice.call(arguments);
      $timeout.cancel(timer);
      timer = $timeout(function() {
        timer = undefined;
        func.apply(context, args);
      }, wait || 10);
    };
  }
  function buildDelayedToggler(navID) {
    return debounce(function() {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav(navID)
        .toggle();
    }, 200);
  }
  function buildToggler(navID) {
    return function() {
      $mdSidenav(navID)
        .toggle();
    }
  }
}