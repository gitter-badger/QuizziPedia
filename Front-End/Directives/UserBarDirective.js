/*******************************************************************************
* Name: QuizziPedia::Front-End::Directives::UserBarDirective;
* Description: directive contenente il componente che permette di effettuare
* il redirect alla pagina di visualizzazione profilo. Permette di effettuare
* il redirect alla pagina di visualizzazione profilo;
* Creation data: 27-04-2016;
* Author: Matteo Granzotto;
* License: MIT.
********************************************************************************
* Updates history
*-------------------------------------------------------------------------------
* ID: UserBarDirective_20160427;
* Update data: 27-04-2016;
* Description: Creata la classe e scritto il file js;
* Author: Matteo Granzotto.
*-------------------------------------------------------------------------------
*******************************************************************************/

app.directive('userBarDirective', userBarDirective);

function userBarDirective() {
  var directive = {
    restrict: 'E',
    templateUrl: 'Directives/UserBarDirective.html'
  };
  return directive;
}
