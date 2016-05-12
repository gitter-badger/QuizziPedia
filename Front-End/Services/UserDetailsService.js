/*******************************************************************************
 * Name: QuizziPedia::Front-End::Services::UserDetailsService;
 * Description: questa classe permette di gestire il recupero dei dati utente.
 * Relations with other classes:
 * +
 * Creation data: 12-05-2016
 * Author: Alberto Ferrara
 ********************************************************************************
 * Updates history
 *-------------------------------------------------------------------------------
 * ID: QuestionsService_12052016
 * Update data: 12-05-2016
 * Description: Creato il file.
 * Autore: Alberto Ferrara
 *-------------------------------------------------------------------------------
 *******************************************************************************/

app.factory('UserDetailsService', UserDetailsService);

UserDetailsService.$inject = ['$http', '$cookies', '$q'];

function UserDetailsService($http, $cookies, $q) {
    var methods = {
        getUserDetails: getUserDetails

    };
    return methods;

    function getUserDetails(username, lang) {
        var deferred = $q.defer();
        $http.get('/api/' + lang + '/userdetails/' + username)
            .then(function (data) {
                deferred.resolve(data);
            }, function (error) {
                deferred.reject(error);
            });
        return deferred.promise;

    }
}