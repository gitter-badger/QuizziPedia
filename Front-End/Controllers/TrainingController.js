/*******************************************************************************
* Name: QuizziPedia::Front-End::Controllers::TrainingController;
* Description: controller che gestisce la modalità allenamento;
* Creation data: 01-05-2016;
* Author: Matteo Granzotto;
* License: MIT.
********************************************************************************
* Updates history
* -------------------------------------------------------------------------------
* ID: TrainingController_20160526;
* Update data: 26-05-2016;
* Description: Aggiornato controller
* Author: Franco Berton.
*-------------------------------------------------------------------------------
* ID: TrainingController_20160505;
* Update data: 05-05-2016;
* Description: Inseriti i metodi checkIfICouldGoOn(), createFilterFor(),
* loadTopics(), graphResultAfterFinishedATraining();
* Author: Matteo Granzotto.
*-------------------------------------------------------------------------------
* ID: TrainingController_20160504;
* Update data: 04-05-2016;
* Description: Inseriti i metodi newQuestion(), updateSelectedTopic(), querySearch()
* , transformKey(), loadKeywords() e goBackToSetUp();
* Author: Matteo Granzotto.
*-------------------------------------------------------------------------------
* ID: TrainingController_20160503;
* Update data: 03-05-2016;
* Description: Inseriti i metodi starTraining(), setInfiniteQuestion() e
* resetTraining();
* Author: Matteo Granzotto.
*-------------------------------------------------------------------------------
* ID: TrainingController_20160503;
* Update data: 01-05-2016;
* Description: Creata la classe;
* Author: Matteo Granzotto.
*-------------------------------------------------------------------------------
*******************************************************************************/

app.controller('TrainingController', TrainingController);

TrainingController.$inject = ['$scope', '$rootScope', '$timeout', '$mdDialog', '$location', '$routeParams', 'ErrorInfoModel', 'UserDetailsModel', 'TrainingModeModel', 'QuestionsService','ngMeta'];
function TrainingController ($scope, $rootScope, $timeout,  $mdDialog, $location, $routeParams, ErrorInfoModel, UserDetailsModel, TrainingModeModel, QuestionsService, ngMeta ) {

  /*Private variables*/
  var keepOnMind = 0;

  /*Public variables on Scope*/
  $scope.traininIsFinished = false;
  $scope.trainingIsLoaded = false;
  $timeout(function() {
    $scope.trainingIsLoaded = true;
  }, 500);
  $scope.iQ = false;
  $scope.questionNumberOnTraining = 1;
  $scope.numberOfQuestionsOnTraining = {
    num: 1
  };
  $scope.selectedTopicOnMind = "";
  $scope.readonly = false;
  $scope.selectedItem = null;
  $scope.searchText = null;
  loadTopics(function(data) {
    $scope.topics = data;
  });
  $scope.autocompleteDemoRequireMatch = true;
  $scope.selectedKeywords = [];
  $scope.problemWithTopic = false;
  $scope.stopToGoBack = false;
  $scope.temporaryLevel = 500;

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
      ngMeta.setTitle($rootScope.listOfKeys.training);
      ngMeta.setTag('description',$rootScope.listOfKeys.trainingDescription);
  }


  /*Functions on scope*/

  /*Function to start the training*/
  $scope.starTraining = starTraining;
  function starTraining (argument, keywords, restart) {
    $scope.stopToGoBack = true;
    if($scope.selectedTopicOnMind != ""){
      if($scope.iQ) {
        $scope.numberOfQuestionsOnTraining = {
          num: 0
        };
      }
      var level;
      if($rootScope.userLogged != undefined) {
        level = $rootScope.userLogged.getLevelByTopic(argument);
      }
      else {
        level = $scope.temporaryLevel;
      }
      $scope.training = new TrainingModeModel(argument, keywords, $scope.numberOfQuestionsOnTraining.num);
      $scope.training.setRightAnswer(0);
      $rootScope.$emit("loadNewQuestion", {
        language  : $routeParams.lang,
        topic: $scope.training.getArgument(),
        keywords : $scope.training.getKeywords(),
        level  : level,
        alreadyAnswered : [] }, $scope.questionNumberOnTraining, restart
      );
      window.onbeforeunload = function(event) {
          return $rootScope.listOfKeys.areYouSureToLeaveTheTraining;
      };
    }
    else {
      $scope.problemWithTopic = true;
    }
  };

  /*Function to set infinite question*/
  $scope.setInfiniteQuestion = setInfiniteQuestion;
  function setInfiniteQuestion(infiniteQuestion) {
    $scope.iQ=infiniteQuestion;
    if(infiniteQuestion) {
      keepOnMind = $scope.numberOfQuestionsOnTraining.num;
      $scope.numberOfQuestionsOnTraining.num = 0;
    }
    else {
      $scope.numberOfQuestionsOnTraining.num = keepOnMind;
    }
  }

  /*Function to restart the training*/
  $scope.resetTraining = resetTraining;
  function resetTraining() {
    var arg = $scope.training.getArgument(),
    keys =  $scope.training.getKeywords(),
    nums = $scope.training.getNumberOfQuestions();
    delete $scope.training;
    delete $scope.question;
    $scope.questionNumberOnTraining = 1;
    $scope.traininIsFinished = false;
    $scope.starTraining(arg, keys, true);
  }

  /*Function to get the new question*/
  $scope.newQuestion= newQuestion;
  function newQuestion() {

    alert = $mdDialog.confirm()
        .title($rootScope.listOfKeys.attention)
        .content($rootScope.listOfKeys.areYouSureToGoOn)
        .ok($rootScope.listOfKeys.yesGoOn)
        .cancel($rootScope.listOfKeys.dontGoOn);
    $mdDialog
        .show( alert )
        .then(function() {
          checkIfICouldGoOn();
        });
  };

  /*Function that stores the topic choose*/
  $scope.updateSelectedTopic= updateSelectedTopic;
  function updateSelectedTopic(topic) {
    $scope.selectedTopicOnMind = topic;
    if(topic != undefined && topic != "") {
      $scope.problemWithTopic = false;
    }
  };

  /* Search for keywords */
  $scope.querySearch = querySearch;
  function querySearch (query) {
    var results = query ? $scope.keywords.filter(createFilterFor(query)) : [];
    return results;
  }

  /*Return the proper object when the append is called*/
  $scope.transformKey = transformKey;
  function transformKey(key) {
    // If it is an object, it's already a known key
    if (angular.isObject(key)) {
      return key;
    }
    // Otherwise, create a new one, only in autocompleteDemoRequireMatch = false;
    return { name: key, type: $rootScope.listOfKeys.newOne }
  }

  /*Function that download the keywords of a determinate topic*/
  $scope.loadKeywords = loadKeywords;
  function loadKeywords (topic) {
    if(topic != undefined) {
      var keys;
      QuestionsService
        .getKeywords($routeParams.lang, topic)
        .then(function(result){
            keys = result.data;
            delete $scope.keywords;
            $scope.keywords = result.data;
            $scope.selectedKeywords = [];
            delete $chip;
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

  /*Function to go back to the set up page*/
  $scope.goBackToSetUp = goBackToSetUp;
  function goBackToSetUp() {
    delete $scope.training;
    $scope.questionNumberOnTraining = 1;
    $scope.traininIsFinished = false;
    $location.path("/"+$routeParams.lang+"/training");
    window.onbeforeunload = null;
    $scope.numberOfQuestionsOnTraining = {
      num: 1
    };
    $scope.iQ = false;
    $scope.selectedTopicOnMind = "";
    $scope.problemWithTopic = false;
    delete $scope.keywords;
    $scope.selectedKeywords = [];
    delete $chip;
  }


  /*Function to finish the training*/
  $scope.endTraining = endTraining;
  function endTraining() {
    alert = $mdDialog.confirm()
        .title($rootScope.listOfKeys.buttonEndTrainingLang)
        .content($rootScope.listOfKeys.endOfTheTrainingAreYouSure)
        .ok("Ok")
        .cancel($rootScope.listOfKeys.dontDoIt);
    $mdDialog
        .show( alert )
        .finally(function() {
            alert = undefined;
        })
        .then(function() {
          var level;
          if($rootScope.userLogged != undefined) {
            level = $rootScope.userLogged.getLevelByTopic($scope.training.getArgument());
          }
          else {
            level = $scope.temporaryLevel;
          }
          $rootScope.$emit("checkAnswerEvent", $scope.training.getArgument(), level);
          $scope.stopToGoBack = false;
          graphResultAfterFinishedATraining();
          $scope.traininIsFinished = true;
          window.onbeforeunload = null;
        });
  }

  /*RootScope functions*/

  /*Event to not allow the use of back button*/
  $scope.$on('$locationChangeStart', function (event, next, current) {
          if ($scope.stopToGoBack && !confirm($rootScope.listOfKeys.doYouWannaGoBakLang)) {
              event.preventDefault();
          }
  });

  /*Event to save the current question in the TrainingModeModel*/
  var saveTheQuestion = $rootScope.$on("saveTheQuestion", function(event, question) {
      $scope.training.addQuestion(question);
  });
  $scope.$on('$destroy', saveTheQuestion);

  /*Event to save the current question in the TrainingModeModel*/
  var updateTemporaryLevel = $rootScope.$on("updateTemporaryLevel", function(event, levelT) {
      $scope.temporaryLevel = levelT;
  });
  $scope.$on('$destroy', updateTemporaryLevel);

  /*Event to go back to the set up training*/
  var backToTheSetUpTraining = $rootScope.$on("backToTheSetUpTraining", function(event, args) {
      $scope.stopToGoBack = false;
      graphResultAfterFinishedATraining();
      $scope.traininIsFinished = true;
      window.onbeforeunload = null;
  });
  $scope.$on('$destroy', backToTheSetUpTraining);

  /*Event to add results*/
  var addResult = $rootScope.$on("addResult", function(event, id, args) {
      $scope.training.addResult(args)
  });
  $scope.$on('$destroy', addResult);

  /*Private functions*/

  /*Function that checks if yuo could go on or the trainging is over*/
  function checkIfICouldGoOn() {
    var arryOfQuestionsAlreadyAnswered= [];
    $scope.training.getQuestions().forEach(
      function (elem) {
        arryOfQuestionsAlreadyAnswered.push(elem.getId());
      }
    );
    var level;
    if($rootScope.userLogged != undefined) {
      level = $rootScope.userLogged.getLevelByTopic($scope.training.getArgument());
    }
    else {
      level = $scope.temporaryLevel;
    }
    if($scope.training.getNumberOfQuestions() == 0 || $scope.questionNumberOnTraining+1 <= $scope.training.getNumberOfQuestions() )
    {
      $rootScope.$emit("loadNewQuestion", {
        language  : $routeParams.lang,
        topic: $scope.training.getArgument(),
        keywords : $scope.training.getKeywords(),
        level  : level,
        alreadyAnswered : arryOfQuestionsAlreadyAnswered
      }, $scope.questionNumberOnTrainingend, false
      );
      $(".scrollable").scrollTop(0,0);
    }
    else {
      $rootScope.$emit("checkAnswerEvent", $scope.training.getArgument(), level);
      $scope.stopToGoBack = false;
      graphResultAfterFinishedATraining();
      $scope.traininIsFinished = true;
      window.onbeforeunload = null;
    }
    $scope.questionNumberOnTraining++;
  }

  /*Create filter function for a query string*/
  function createFilterFor(query) {
    var lowercaseQuery = angular.lowercase(query);
    return function (elem) {
      if(angular.lowercase(elem).indexOf(lowercaseQuery)>=0)
        return elem;
    };
  }

  /*Function that download the the topics*/
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

  function graphResultAfterFinishedATraining(){
    $scope.myChartDataDoughnut = [
          {
              value: $scope.training.getResult(),
              color: "#86FC72",
              label: $rootScope.listOfKeys.questionsRight
          },
          {
              value : $scope.training.getNumberOfQuestionsAnswered() - $scope.training.getResult(),
              color : "#F7464A",
              label: $rootScope.listOfKeys.questionsWrong
          }
      ];
      $scope.myChartOptionsDoughnut = {
          egmentShowStroke : false,
          animateScale : true
      };
  }

};
