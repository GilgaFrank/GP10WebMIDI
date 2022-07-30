<?php
//header('Content-type: application/json');
$mysqli = new mysqli("localhost","root","e539464","mysql");

if ($mysqli -> connect_errno) {
  echo "Failed to connect to MySQL: " . $mysqli -> connect_error;
  exit();
}

$myArray = array();
$result = $mysqli->query("SELECT FLOOR(RAND()*100) AS PC0, FLOOR(RAND()*100) AS PC1, FLOOR(RAND()*100) AS PC2 ;");
while($row = $result->fetch_assoc()) {
    $myArray[] = $row;
}
echo json_encode($myArray);

?>