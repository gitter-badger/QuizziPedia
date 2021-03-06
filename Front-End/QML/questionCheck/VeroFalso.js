/*******************************************************************************
 * Name: QuizziPedia::Front-End::QML::questionCheck::VeroFalso;
 * Description: questo file contiene la funzione che permette la validazione
 * del testo scritto in QML per la tipologia specifica
 * Creation data: 27-04-2016;
 * Author: Matteo Gnoato.
 ********************************************************************************
* Updates history
* -------------------------------------------------------------------------------
* Update data: 13-06-2016;
* Description: Corretto vari bugs;
* Author: Matteo Granzotto.
 * -------------------------------------------------------------------------------
 * Id: VeroFalso_20160427
 * Update data: 27-04-2016;
 * Description: Inseriti messaggi d'errore specifici
 * Autore: Matteo Gnoato.
 * -------------------------------------------------------------------------------
 * Id: VeroFalso_20160427
 * Update data: 27-04-2016;
 * Description: Risolto bug nella lettura dei campi obbligatori
 * Autore: Matteo Gnoato.
 *-------------------------------------------------------------------------------
 * Id: VeroFalso_20160427
 * Update data: 27-04-2016;
 * Description: Creata funzione veroFalso
 * Autore: Matteo Gnoato.
 *-------------------------------------------------------------------------------
 ********************************************************************************/


veroFalso = function(corpo,res, $mdDialog){
    var campiObbligatori = false;
    var campiFacoltativi = true;

            // controllo campi obbligatori
            if(corpo.hasOwnProperty('answer')){
                if(corpo.answer[0].hasOwnProperty('text') && corpo.answer[0].hasOwnProperty("isItRight")){
                    if(corpo.answer[0].isItRight == "false" || corpo.answer[0].isItRight == "true"){
                        campiObbligatori = true;
                    }
                    else{
                        alert = $mdDialog.alert()
                            .title("Errore generico")
                            .content("campo 'isItRight' non valido, prego inserire \"true\" o \"false\"")
                            .ok('Ok');
                        $mdDialog
                            .show(alert)
                            .finally(function () {
                                alert = undefined;
                            });
                        campiObbligatori = false;
                        return false;
                    }
                }
                else{
                    alert = $mdDialog.alert()
                        .title("Errore: campi obbligatori mancanti")
                        .content("campo 'text' o 'isItRight' non trovato, prego inserire un campo \"text\" o \"isItRight\" valido")
                        .ok('Ok');
                    $mdDialog
                        .show(alert)
                        .finally(function () {
                            alert = undefined;
                        });
                    campiObbligatori = false;
                    return false;
                }
            }
            else {
                alert = $mdDialog.alert()
                    .title("Errore: campi obbligatori mancanti")
                    .content("campo 'answer' non trovato, prego inserire un campo \"answer\" valido")
                    .ok('Ok');
                $mdDialog
                    .show(alert)
                    .finally(function () {
                        alert = undefined;
                    });
                return false;
                }
            // controllo campi
            var facoltativiString = ["type","answer","image", "keywords", "topic"];
            var key;
            for(key in corpo) {
                var giusto = false;
                for (var j = 0; j < facoltativiString.length; j++) {
                    if (key == facoltativiString[j]) {
                        giusto = true;
                    }
                }
                if (!giusto) {
                    alert = $mdDialog.alert()
                        .title("Errore generico")
                        .content("inseriti campi sconosciuti")
                        .ok('Ok');
                    $mdDialog
                        .show(alert)
                        .finally(function () {
                            alert = undefined;
                        });
                    campiFacoltativi = false;
                    return false;
                }
            }
            if(campiFacoltativi && campiObbligatori){
                return true;
            }
            else{
                return false;
            }
}
