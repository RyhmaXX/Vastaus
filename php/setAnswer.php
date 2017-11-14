<?php
	
	session_start();
	
	try {
		
		include("db.inc");
		
		$resp = [];
		
		if (isset($_SESSION["user"]) && isset($_SESSION["poll"])) {
			
			$postdata = file_get_contents("php://input");
			$request = json_decode($postdata);
			
			$num = $request->num;
			$answer = json_encode($request->answer);
			$poll = $_SESSION["poll"];
			$user = $_SESSION["user"];
			
			$query = $conn->prepare("INSERT INTO answer (answer, user_id, question_poll_id, question_id)
									VALUES (?, ?, ?, ?)
									ON DUPLICATE KEY UPDATE
									answer = ?");
									
			$query->bind_param("siiis", $answer, $user, $poll, $num, $answer);
			
			if ($query->execute()) {
				// Success
				$resp["code"] = 0;
			} else {
				// Error
				//echo $conn->error;
				$resp["code"] = -2;
			}
			
		} else {
			// Not logged in
			$resp["code"] = 1;
		}
	} catch (Exception $e){
		$resp = [];
		$resp["code"] = -1;
	}
	
	echo json_encode($resp);
?>