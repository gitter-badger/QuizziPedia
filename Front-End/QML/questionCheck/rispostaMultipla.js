/*******************************************************************************
 * Name: QuizziPedia::Front-End::QML::questionCheck::rispostaMultipla;
 * Description: questo file contiene la funzione che permette la validazione
 * del testo scritto in QML per la tipologia specifica
 * Creation data: 27-04-2016;
 * Author: Matteo Gnoato.
 ********************************************************************************
 * Updates history
 * -------------------------------------------------------------------------------
 * Update data: 28-04-2016;
 * Description: Inseriti messaggi d'errore specifici
 * Autore: Matteo Gnoato.
 * -------------------------------------------------------------------------------
 *  * Update data: 28-04-2016;
 * Description: Risolto bug nella lettura dei campi obbligatori
 * Autore: Matteo Gnoato.
 *-------------------------------------------------------------------------------
 * Update data: 28-04-2016;
 * Description: Creata funzione rispostaMultipla
 * Autore: Matteo Gnoato.
 *-------------------------------------------------------------------------------
 ********************************************************************************/


rispostaMultipla = function(corpo,res){
    var campiObbligatori = false;
    var campiFacoltativi = true;

    // controllo campi obbligatori
    if(corpo.hasOwnProperty('questionText')) {
        if (corpo.hasOwnProperty('answer')) {
            var obbligatorieAnswer = ["text", "isItRight"];
            var keywordAnswer = ["text", "isItRight", "url"];
            for(var k = 0; k < corpo.answer.length ; k++){
                if(corpo.answer[k].hasOwnProperty(obbligatorieAnswer[0])){
                    if(corpo.answer[k].hasOwnProperty(obbligatorieAnswer[1])){
                        if(corpo.answer[k].isItRight == "true" || corpo.answer[k].isItRight == "false"){
                            // se arrivo qua i campi obbligatori ci sono tutti
                            campiObbligatori = true;
                            // devo controllare però i campi facoltativi di ogni answer
                            for(g in corpo.answer[k]) { // per ogni oggetto nell'array answer in posizione k
                                var giusto = false; // se questa diventa true la keyword è giusta
                                for (var j = 0; j < keywordAnswer.length; j++) { // per ogni keyword possibile
                                    if (g == keywordAnswer[j]) {
                                        giusto = true;
                                    }
                                }
                                // controllo la variabile giusto
                                if(!giusto){
                                    // se arrivo qua la keyword non ha riscontrato un match con le parole target
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
                                    break;
                                }
                            }
                        }
                        else{
                            alert = $mdDialog.alert()
                                .title("Errore generico")
                                .content("valore di \"isItRight\ non valido, prego inserire \"true\" o \"false\"")
                                .ok('Ok');
                            $mdDialog
                                .show(alert)
                                .finally(function () {
                                    alert = undefined;
                                });
                        }
                    }
                    else{
                        alert = $mdDialog.alert()
                            .title("Errore: campi obbligatori mancanti")
                            .content("campo 'isItRight' non trovato, prego inserire un campo \"isItRight\" valido")
                            .ok('Ok');
                        $mdDialog
                            .show(alert)
                            .finally(function () {
                                alert = undefined;
                            });
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
                    console.log("campo text mancante");
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
    var facoltativiString = ["type","answer","questionText","url", "keywords", "topic"];
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
            break;
        }
    }
    if(campiFacoltativi && campiObbligatori){
        return true;
    }
    else{
        return false;
    }
}