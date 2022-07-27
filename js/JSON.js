export function getJSONResponse (programChangeNumber) {
    var JSONURL = "/php/JSONProgramChange.php?PC=" + programChangeNumber;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", JSONURL);

    xhr.setRequestHeader("Accept", "application/json");

    xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        console.log(xhr.status);
        console.log(xhr.responseText);
    }};

    xhr.send();

}