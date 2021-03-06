/*******************************************************************************
* Name: QuizziPedia::Front-End::Controllers::MenuBarController;
* Description: questa classe permette di gestire il menù fisso per ogni pagina;
* Fornisce le funzionalità per aggiornare, a seconda della pagina, il contenuto
* del menù;
*
*
* Creation data: 27-04-2016;
* Author: Matteo Granzotto;
* License: MIT.
********************************************************************************
* Updates history
* -------------------------------------------------------------------------------
* ID: MenuBarController_20160526;
* Update data: 26-05-2016;
* Description: Aggiornato controller
* Author: Franco Berton.
*-------------------------------------------------------------------------------
* ID: MenuBarController_20160505;
* Update data: 05-05-2016;
* Description: Aggiunti i metodi goToUserPage(), goToUserManagementPage(),
* goToQuestionsManagementPage() e goToQuizManagementPage();
* Author: Alberto Ferrara.
*-------------------------------------------------------------------------------
* ID: MenuBarController_20160502;
* Update data: 02-05-2016;
* Description: Aggiunti i metodi buildDelayedToggler(), debounce() e
* backToHome();
* Author: Matteo Granzotto.
*-------------------------------------------------------------------------------
* ID: MenuBarController_20160425;
* Update data: 25-04-2016;
* Description: Creata la classe e i metodi logIn(), signUp(), logOut(),
* showListBottomSheet(), resetRefreshBlocking(), buildToggler();
* Author: Matteo Granzotto.
*-------------------------------------------------------------------------------
*******************************************************************************/

app.controller('MenuBarController',MenuBarController);

MenuBarController.$inject = ['$scope', '$rootScope', '$timeout','$mdSidenav', '$mdDialog', '$location', '$routeParams', 'MenuBarModel', 'ErrorInfoModel', 'AuthService', 'UserDetailsModel', '$mdBottomSheet', '$window'];
function MenuBarController ($scope, $rootScope, $timeout, $mdSidenav, $mdDialog, $location,$routeParams, MenuBarModel, ErrorInfoModel, AuthService, UserDetailsModel, $mdBottomSheet, $window) {

  /* Scope variables and function*/
  if($rootScope.userLogged != undefined) {
    $rootScope.directivesChoose= MenuBarModel.getDirectives(location, $rootScope.userLogged.getPrivilege());
  }
  else {
    $rootScope.directivesChoose= MenuBarModel.getDirectives(location, "");
  }

  $scope.logIn = function () {
    resetRefreshBlocking();
    if($routeParams.lang!=undefined) {
      $location.path('/'+$routeParams.lang+'/login');
    }
    else {
      $location.path('/it/login');
    }
    toggleOnlyOnMobile();
  };
  $scope.signUp = function () {
    resetRefreshBlocking();
    if($routeParams.lang!=undefined) {
      $location.path('/'+$routeParams.lang+'/signup');
    }
    else {
      $location.path('/it/signup');
    }
    toggleOnlyOnMobile();
  };
  $scope.goToUserPage = function () {
    resetRefreshBlocking();
    if($routeParams.lang!=undefined) {
      $location.path('/'+$routeParams.lang+'/userpage');
    }
    else {
      $location.path('/it/userpage');
    }
    toggleOnlyOnMobile();
  };
  $scope.goToUserManagementPage = function () {
    resetRefreshBlocking();
    if($routeParams.lang!=undefined) {
      $location.path('/'+$routeParams.lang+'/profilemanagement');
    }
    else {
      $location.path('/it/profilemanagement');
    }
    toggleOnlyOnMobile();
  };
  $scope.goToQuestionsManagementPage = function () {
    resetRefreshBlocking();
    if($routeParams.lang!=undefined) {
      $location.path('/'+$routeParams.lang+'/questions');
    }
    else {
      $location.path('/it/questions');
    }
    toggleOnlyOnMobile();
  };
  $scope.goToQuizManagementPage = function () {
    resetRefreshBlocking();
    if($routeParams.lang!=undefined) {
      $location.path('/'+$routeParams.lang+'/questionnairemanagement');
    }
    else {
      $location.path('/it/questionnairemanagement');
    }
    toggleOnlyOnMobile();
  };

  $scope.logOut = function () {
    alert = $mdDialog.confirm()
        .title($rootScope.listOfKeys.logOut)
        .content($rootScope.listOfKeys.areYouSure)
        .ok($rootScope.listOfKeys.yesLogoutMe)
        .cancel($rootScope.listOfKeys.dontLogoutMe);
    $mdDialog
        .show( alert )
        .finally(function() {
            alert = undefined;
        })
        .then(function() {
          AuthService.logout($rootScope.userLogged.getUsername());
          delete $rootScope.userLogged;
          $rootScope.directivesChoose= MenuBarModel.getDirectives(location,"");
          resetRefreshBlocking();
          if($routeParams.lang!=undefined) {
            $location.path('/'+$routeParams.lang+'/home');
          }
          else {
            $location.path('/it/home');
          }
          toggleOnlyOnMobile();
        });
  };

  $scope.backToHome = function () {
    resetRefreshBlocking();
    if($routeParams.lang!=undefined) {
      $location.path('/'+$rootScope.systemLang+'/home');
    }
    else {
      $location.path('/it/home');
    }
    toggleOnlyOnMobile();
  }

  $scope.showListBottomSheet = function() {
    $scope.alert = '';
    $mdBottomSheet.show({
      templateUrl: '../Directives/ChangeLangDirective.html',
      controller: "LangController"
    }).then(function(clickedItem) {
    });
  };

  function toggleOnlyOnMobile() {
    var screenWidth = $window.innerWidth;
    if (screenWidth < 960) {
      $scope.toggleLeft();
    }
  }


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

  function resetRefreshBlocking () {
    window.onbeforeunload = null;
  }
}
