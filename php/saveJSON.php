<?php
$responseBody = file_get_contents('php://input');
$json = json_decode($responseBody);

//If you need return data
echo json_encode($json);


//Save in json file
if($json){
    $fp = fopen('results_.json', 'w');
    fwrite($fp, json_encode($json));
    fclose($fp);
}
?>