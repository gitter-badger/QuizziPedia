/*******************************************************************************
 * Name: QuizziPedia::Front-End::QML::questionCheck::ordinamentoStringhe;
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
 * Id: ordinamentoStringhe_20160427
 * Update data: 27-04-2016;
 * Description: Inseriti messaggi d'errore specifici
 * Autore: Matteo Gnoato.
 * -------------------------------------------------------------------------------
 * Id: ordinamentoStringhe_20160427
 * Update data: 27-04-2016;
 * Description: Risolto bug nella lettura dei campi obbligatori
 * Autore: Matteo Gnoato.
 *-------------------------------------------------------------------------------
 * Id: ordinamentoStringhe_20160427
 * Update data: 27-04-2016;
 * Description: Creata funzione ordinamentoStringhe
 * Autore: Matteo Gnoato.
 *-------------------------------------------------------------------------------
 ********************************************************************************/


ordinamentoStringhe = function(corpo,res, $mdDialog){
    var campiObbligatori = false;
    var campiFacoltativi = true;

    // controllo campi obbligatori
    if(corpo.hasOwnProperty('questionText')) {
        if (corpo.hasOwnProperty('answer')) {
            var obbligatorieAnswer = ["text", "position"];
            for(var k = 0; k < corpo.answer.length ; k++){
                if(corpo.answer[k].hasOwnProperty(obbligatorieAnswer[0])){
                    if(corpo.answer[k].hasOwnProperty(obbligatorieAnswer[1])){
                        campiObbligatori = true;
                    }
                    else{
                        alert = $mdDialog.alert()
                            .title("Errore: campi obbligatori mancanti")
                            .content("campo 'position' non trovato, prego inserire un campo \"position\" valido")
                            .ok('Ok');
                        $mdDialog
                            .show(alert)
                            .finally(function () {
                                alert = undefined;
                            });
                        return false;
                    }
                }
                else{
                    alert = $mdDialog.alert()
                        .title("Errore: campi obbligatori mancanti")
                        .content("campo 'text' non trovato, prego inserire un campo \"text\" valido")
                        .ok('Ok');
                    $mdDialog
                        .show(alert)
                        .finally(function () {
                            alert = undefined;
                        });
                    return false;
                }
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
    } else{
        alert = $mdDialog.alert()
            .title("Errore: campi obbligatori mancanti")
            .content("campo 'questionText' non trovato, prego inserire un campo \"questionText\" valido")
            .ok('Ok');
        $mdDialog
            .show(alert)
            .finally(function () {
                alert = undefined;
            });
        return false;
    }
    // controllo campi facoltativi
    var facoltativiString = ["type","questionText","answer" ,"url", "keywords", "topic", "image"];
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
