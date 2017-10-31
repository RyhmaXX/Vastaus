<?php
	
	session_start();
	
	try {
		
		include("db.inc");
		
		$resp = [];
		
		if (isset($_SESSION["user"]) && isset($_SESSION["poll"])) {
			
			$poll = $_SESSION["poll"];
			
			$query = $conn->prepare("SELECT question_num as num, question, question_types_id as type
									FROM question
									WHERE poll_id = ?
									ORDER BY num ASC");
			
			$query->bind_param("i", $poll);
			
			if ($query->execute()) {
				
				$result = $query->get_result();
				
				$questions = [];
				
				while ($row = $result->fetch_assoc()) {
					$num = $row["num"];
					$question = $row["question"];
					$type = $row["type"];
					
					$q = array(
						"num" => $num,
						"question" => $question,
						"type" => $type,
					);
					
					array_push($questions, $q);
				}
				
				$resp["code"] = 0;
				$resp["questions"] = $questions;
				
			} else {
				// SQL error
				$resp["code"] = 2;
			}
		} else {
			$resp["code"] = 1;
		}		
		
	} catch (Exception $e) {
		// Unknown php-error
		$resp = [];
		$resp["code"] = -1;
	}
	
	echo json_encode($resp);
	
?>