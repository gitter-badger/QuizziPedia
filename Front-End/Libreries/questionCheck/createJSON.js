/**
 * Created by break_000 on 12/05/2016.
 */

createJSON = function(corpo, res, tipologia){
    var campiComuni = "\"makeWith\" : \"QML\",\"language\" : " + "it" + ",";
    var jsonKey;
    if(corpo.hasOwnProperty('keywords')){
        jsonKey = "\"keywords\" : [ ";
        count = 0;
        for(key in corpo.keywords){
            count++;
        }
        i = 1;
        for(key in corpo.keywords){
            if(i == count){
                jsonKey = jsonKey + "\"" + key.getElementsByName('keywords') + "\"";
            }
            else{
                jsonKey = jsonKey + "\"" + key.getElementsByName('keywords') + "\" ,";
            }
            i++;
        }
        jsonKey = jsonKey + "],";
    }
    var jsonStatistic = "\"level\" : 500, \"totalAnswers\" : 0, \"correctAnswers\" : 0})"

    if(tipologia == "veroFalso") {
        var jsonString = createJsonVF(corpo, res);
    }
    else if(tipologia ==  "rispostaMultipla"){
        var jsonString = createJSONrispostaMultipla(corpo);
    }
    else if(tipologia == "ordinamentoStringhe"){
        var jsonString = createJSONordinamentoStringhe(corpo);
    }
    else if(tipologia == "collegamentoElementi"){
        var jsonString = createJSONcollegamentoElementi(corpo);
    }
    else if(tipologia == "ordinamentoImmagini"){
        var jsonString = createJSONordinamentoImmagini(corpo);
    }
    else if(tipologia == "areaCliccabile"){
        var jsonStirng = createJSONareaCliccabile(corpo);
    }
    else if(tipologia == "riempimentoSpaziVuoti"){
        var jsonString = createJSONriepimentoSpaziVuoti(corpo);
    }
    else if(tipologia == "custom"){
        var jsonString = createJSONcustom(corpo);
    }

    jsonString = campiComuni + jsonString +  jsonStatistic;
    console.log("jsonString: " + jsonString);
}

createJsonVF = function(corpo, res){
    var jsonString = "\"question\":[{\"type\" : \"veroFalso\"" + ",";
    if(corpo.hasOwnProperty('image')){
        jsonString =  jsonString + "\"image\" : " + corpo.image + ",";
    }
    jsonString = jsonString + "\"answers\" : [{\"text\" :" + corpo.answers.text + ",";
    jsonString = jsonString + "\"isItRight : \"" + "\"" + corpo.answers.isItRight + "\"" + "}]}],";
    return jsonString;
}

createJSONrispostaMultipla = function(corpo){
    var jsonString = "\"question\":[{\"type\" : \"rispostaMultipla\"" + ",";
    if(corpo.hasOwnProperty('image')){
        jsonString = jsonString + "\"image\" : " + "\"" + corpo.url + "\",";
    }
    if(corpo.hasOwnProperty('questionText')) {
        jsonString = jsonString + "\"questionText\" : " + "\"" +  corpo.questionText + "\",";
    }
    jsonString = jsonString + "\"answers\" : [{";
    count = 0;
    for(key in corpo.keywords){
        count++;
    }
    var i = 1;
    for(key in corpo.answer){
        if(key.hasOwnProperty('text')){
            jsonString = jsonString + "\"text\" : " + "\"" + key.getElementsByName('text') + "\",";
        }
        if(key.hasOwnProperty('url')){
            jsonString = jsonString + "\"url\" :" + "\"" + key.getElementsByName('url') + "\",";
        }
        if(key.hasOwnProperty('isItRight')){
            jsonString = jsonString + "\"isItRight\" : " + "\"" +  key.getElementsByName('isItRight') + "\"";
        }
        if(i == count) {
            jsonString = jsonString + "}";
        }
        else{
            jsonString = jsonString + "},";
        }
        i++;
    }
    jsonString = jsonString + "],}]";
    return jsonString;
}

createJSONordinamentoStringhe = function(corpo){
    var jsonString = "\"question\" : [{ \"type\" : \"ordinamentoStringhe\" ,";
    if(corpo.hasOwnProperty('questionText')){
        jsonString = jsonString + "\"questionText\" : " + "\"" +corpo.questionText + "\",";
    }
    if(corpo.hasOwnProperty('image')){
        jsonString = jsonString + "\"image\" : " + "\"" +corpo.image + "\",";
    }
    jsonString = jsonString + "\"answers\" : [{"
    var count = 0;
    for(key in corpo.answer){
        count++;
    }
    var i = 1;
    for(key in corpo.answer){
        jsonString = jsonString + "\"text\" : " + "\"" + key.getElementsByName('text') + "\",";
        jsonString = jsonString + "\"position\" : " + "\"" + key.getElementsByName('position') + "\"";
        if(i == count){
            jsonString = jsonString + "}]";
        }
        else{
            jsonString = jsonString + "},";
        }
        i++;
    }
    return jsonString;
}

createJSONcollegamentoElementi = function(corpo){
    var jsonString = "\"question\" : [{ \"type\" : \"collegamentoElementi\" ,";
    jsonString = jsonString + "\"questionText\" : " + "\"" + corpo.questionText + "\",";
    jsonString = jsonString + "\"answers\" : [{";
    var count = 0;
    for(key in corpo.answer){
        count++;
    }
    var i = 1;
    for(key in corpo.answer){
        if(key.hasOwnProperty('text1')){
            jsonString = jsonString + "\"text1\" : \"" + key.getElementsByName('text1') + "\" ,";
        }
        if(key.hasOwnProperty('text2')){
            jsonString = jsonString + "\"text2\" : \"" + key.getElementsByName('text2') + "\"";
        }
        if(key.hasOwnProperty('url1')){
            jsonString = jsonString + "\"url1\" : \"" + key.getElementsByName('url1') + "\" ,";
        }
        if(key.hasOwnProperty('url2')){
            jsonString = jsonString + "\"url2\" : \"" + key.getElementsByName('url2') + "\"";
        }
        if(i == count){
            jsonString = jsonString + "}]";
        }
        else{
            jsonString = jsonString + "},{";
        }
        i++;
    }
    return jsonString;
}

createJSONordinamentoImmagini = function(corpo){
    var jsonString = "\"question\" : [{ \"type\" : \"ordinamentoImmagini\" ,";
    jsonString = jsonString + "\"quesitonText\" : \"" + corpo.questionText + "\" ,";
    jsonString = jsonString + "\"answer\" : [{";
    var count = 0;
    for(key in corpo.answer){
        count++;
    }
    var i = 1;
    for(key in corpo.answer){
        jsonString = jsonString + "\"url\" \"" + key.getElementsByName('url') + "\" ,";
        jsonString = jsonString + "\"position\" \"" + key.getElementsByName('position') + "\"";
        if(i == count){
            jsonString = jsonString + "}]";
        }
        else{
            jsonString = jsonString + "},{";
        }
        i++;
    }
    return jsonString;

}

createJSONareaCliccabile = function(corpo){
    var jsonString = "\"question\" : [{ \"type\" : \"areaCliccabile\" ,";
    jsonString = jsonString + "\"quesitonText\" : \"" + corpo.questionText + "\" ,";
    jsonString = jsonString + "\"image\" : \"" + corpo.image + "\" ,";
    jsonString = jsonString + "\"answer\" : [{";
    var count = 0;
    for(key in corpo.answer){
        count++;
    }
    var i = 1;
    for(key in corpo.answer){
        jsonString = jsonString + "\"x\" : \"" + key.getElementsByName('x') + "\" ,";
        jsonString = jsonString + "\"y\" : \"" + key.getElementsByName('y') + "\"";
        if(key.hasOwnProperty('text')){
            jsonString = jsonString + ", \"text\" : \" " + key.hasOwnProperty('text') + "\" ,";
        }
        if(i == count){
            jsonString = jsonString + "}]";
        }
        else{
            jsonString = jsonString + "},{";
        }
        i++;
    }
    return jsonString;
}

createJSONriepimentoSpaziVuoti = function(corpo){
    var jsonString = "\"question\" : [{ \"type\" : \"spaziVuoti\" ,";
    jsonString = jsonString + "\"quesitonText\" : \"" + corpo.questionText + "\" ,";
    jsonString = jsonString + "\"answer\" : [{";
    var count = 0;
    for(key in corpo.answer){
        count++;
    }
    var i = 1;
    for(key in corpo.answer){
        jsonString = jsonString + "\"wordNumber\" : " + key.getElementsByName('parolaNumero') + "\"";
        if(i == count){
            jsonString = jsonString + "}]";
        }
        else{
            jsonString = jsonString + "},{";
        }
        i++;
    }
    return jsonString;
}

createJSONcustom = function(corpo){
    var jsonString;
    var count = 0;
    for(key in corpo.question){
        count++;
    }
    var i = 1;
    for(key in corpo.question){
        if(key.getElementsByName('type') == "veroFalso"){
            jsonString = jsonString + createJsonVF(corpo);
        }
        else if(key.getElementsByName('type') == "rispostaMultipla"){
            jsonString = jsonString + createJSONrispostaMultipla(corpo);
        }
        else if(key.getElementsByName('type') == "ordinamentoStringhe"){
            jsonString = jsonString + createJSONordinamentoStringhe(corpo);
        }
        else if(key.getElementsByName('type') == "collegamentoElementi"){
            jsonString = jsonString + createJSONcollegamentoElementi(corpo);
        }
        else if(key.getElementsByName('type') == "ordinamentoImmagini"){
            jsonString = jsonString + createJSONordinamentoImmagini(corpo);
        }
        else if(key.getElementsByName('type') == "areaCliccabile"){
            jsonString = jsonString + createJSONareaCliccabile(corpo);
        }
        else if(key.getElementsByName('type') == "spaziVuoti"){
            jsonString = jsonString + createJSONriepimentoSpaziVuoti(corpo);
        }
        if(i == count){
            jsonString = jsonString + "}]";
        }
        else{
            jsonString = jsonString + "},{";
        }
    }
    return jsonString;

}