/*******************************************************************************
 * Name: QuizziPedia::Front-End::Services::LangService;
 * Description: questa classe permette di gestire la lingua nella quale si è
 * scelto di utilizzare l’applicazione. Fornisce delle funzionalità per
 * recuperare la giusta traduzione delle pagine;
 *
 *
 * Creation data: 27-04-2016;
 * Author: Matteo Granzotto.
 *******************************************************************************
* Updates history
* -------------------------------------------------------------------------------
* Update data: 13-06-2016;
* Description: Corretto vari bugs;
* Author: Matteo Granzotto.
 *------------------------------------------------------------------------------
 * ID: LangService_20160427;
 * Update data: 27-04-2016;
 * Description: Aggiunti i metodi getKeywords(), getSupportedLang e getSLang();
 * Autore: Matteo Granzotto.
 *------------------------------------------------------------------------------
 * ID: LangService_20160427;
 * Update data: 27-04-2016;
 * Description: Creato il file;
 * Autore: Matteo Granzotto.
 *------------------------------------------------------------------------------
 ******************************************************************************/

app.factory('LangService', LangService);

LangService.$inject = ['$http', '$q', 'ErrorInfoModel'];

function LangService($http, $q, ErrorInfoModel) {

  var methods = {
    getKeywords : getKeywords,
    getSupportedLang : getSupportedLang,
    getSlang : getSlang
  };
  return methods;

  function getKeywords(lang) {
    var deferred = $q.defer();
    $http.get('/api/' + lang)
     .success(function(data) {
          if(data[0]!=undefined) {
            deferred.resolve(data[0].variables);
          }
          else {
            if(data != undefined) {
              deferred.resolve(data.variables);
            }
          }
     }).error(function(msg, code) {
        deferred.reject(msg);
     });
    return deferred.promise;
  }

  function getSupportedLang() {
    var deferred = $q.defer();
    $http.get('/api/supported/lang/give/me')
     .success(function(data) {
          deferred.resolve(data);
     }).error(function(msg, code) {
        deferred.reject(msg);
     });
    return deferred.promise;
  }

  function getSlang(lang) {
    var deferred = $q.defer();
    $http.get('/api/supported/lang/give/me/'+lang)
     .success(function(data) {
          deferred.resolve(data);
     }).error(function(msg, code) {
        deferred.reject(msg);
     });
    return deferred.promise;
  }


}
