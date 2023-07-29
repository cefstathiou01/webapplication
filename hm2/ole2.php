<?php
    $conn = mysqli_connect("dbserver.in.cs.ucy.ac.cy", "student","gtNgMF8pZyZq6l53") or die("Could not connect: " .
	mysqli_error($conn));
	mysqli_select_db($conn , "epl425") or die ("db will not open" . mysqli_error($conn));
$conn -> set_charset("utf8");
$username="cefsta01";
$t=time();
if(isset($_SERVER["CONTENT_TYPE"])) {
	$contentType = $_SERVER["CONTENT_TYPE"];
	$contentType = explode("; ", $contentType)[0];
	}
	else{
	$contentType = "";
	}
		if(strcasecmp($contentType, "application/json") == 0) {
			$j = trim(file_get_contents("php://input"));
			$d = json_decode($j);
			$time=time();
			echo $username;
			$address = $d->address ;
			$region = $d->region;
			$city = $d->city;
			
		
		$sql = "INSERT INTO requests (username,timestamp,address,region,city) VALUES ('".$username."','".$time."','".$address."','". $region."','".$city."')";
		$result = $conn->query($sql);
		if ($result) {
			echo "201 Created";
		}
		else{
			echo "500 Server Error";
		}
		}else{
			echo "400 Bad Request";
		}
mysqli_close($conn);

?>


