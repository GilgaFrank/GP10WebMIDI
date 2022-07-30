

export function getJSONResponse (programChangeNumber) {
    var JSONURL = "/php/JSONProgramChange.php?PC=" + programChangeNumber;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", JSONURL);

    xhr.setRequestHeader("Accept", "application/json");

    var jsonPCList;


    xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        //console.log(xhr.status);
        jsonPCList = JSON.parse(xhr.responseText);
        var objPCList = jsonPCList[0];
        //alert("jsonPCList: " + jsonPCList.toString());
        //alert("objPCList: " + objPCList.toString());
        //alert("objPCList.PC0: " + objPCList.PC0);
        //alert("objPCList.PC1: " + objPCList.PC1);
        //alert("objPCList.PC2: " + objPCList.PC2);
        return objPCList;
    }};

    xhr.send();

}