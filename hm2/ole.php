<?php
if(strcasecmp($_SERVER['REQUEST_METHOD'], 'GET') == 0) {
    $conn = mysqli_connect("dbserver.in.cs.ucy.ac.cy", "student","gtNgMF8pZyZq6l53") or die("Could not connect: " .
mysqli_error($conn));
mysqli_select_db($conn , "epl425") or die ("db will not open" . mysqli_error($conn));
$query = "SELECT timestamp,address,region,city FROM requests WHERE username='cefsta01'" ;
$result = mysqli_query($conn, $query) or die("Invalid query");

$num = mysqli_num_rows($result);
for($i=0; $i<$num; $i++) {
$row = mysqli_fetch_row($result);
//echo $row[0] . " " . $row[1] . " " . $row[2] . " " . $row[3] . " ". "<br/>";
$myObj->timestamp[$i] = $row[0];
			$myObj->address[$i] = $row[1];
			$myObj->region[$i] = $row[2];
			$myObj->city[$i] = $row[3];
}
$json=json_encode($myObj);

			echo $json;
mysqli_close($conn);
}
?>
