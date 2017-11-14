<?php

	session_start();
	session_unset();
	
	try {
		
		include("db.inc");
		
		$postdata = file_get_contents("php://input");
		$request = json_decode($postdata);

		$id = $request->id;
		
		list($user, $poll) = explode("-", $id);
		
		$resp = [];
		
		$query = $conn->prepare("SELECT user_id, poll_id
								FROM user_to_poll
								WHERE user_id = ? AND poll_id = ?");
		
		$query->bind_param("ii", $user, $poll);
		$query->execute();
		
		$result = $query->get_result();
		
		if (mysqli_num_rows($result) != 1) {
			$resp["code"] = 1;
		} else {
			
			$query = $conn->prepare("SELECT status, startdate, enddate
									FROM poll
									WHERE id=?");
			$query->bind_param("i", $poll);
			$query->execute();
			
			$result = $query->get_result();
			
			if (mysqli_num_rows($result) == 1) {
				
				$row = $result->fetch_assoc();
				
				$status = $row["status"];
				$start = $row["startdate"];
				$end = $row["enddate"];
				
				if ($status == 2) {
					
					$_SESSION["user"] = $user;
					$_SESSION["poll"] = $poll;
					$resp["code"] = 0;
					
				} else {
					// Not open
					$resp["code"] = 2;
				}
				
			} else {
				$resp["code"] = 1;
			}
		}
		
		
	} catch (Exception $e) {
		// Unknown php-error
		$resp = [];
		$resp["code"] = -1;
	}
	
	echo json_encode($resp);
?>