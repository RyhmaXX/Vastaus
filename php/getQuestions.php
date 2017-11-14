<?php
	
	session_start();
	
	include("db.inc");
	
	function getAnswers($conn) {
		
		$poll = $_SESSION["poll"];
		$user = $_SESSION["user"];
		
		$query = $conn->prepare("SELECT answer, question_id
								FROM answer
								WHERE question_poll_id = ? AND user_id = ?
								ORDER BY question_id");
		$query->bind_param("ii", $poll, $user);
		$query->execute();
		
		$result = $query->get_result();
		
		if (mysqli_num_rows($result) > 0) {
		
			$answers = [];
					
			while ($row = $result->fetch_assoc()) {
				$ans = json_decode($row["answer"]);
				$question_num = $row["question_id"];
				$type = $row["type"];
				
				$a = array(
					"answer" => $ans,
					"question" => $question_num,
				);
				
				array_push($answers, $a);
			}
		} else {
			$answers = null;
		}
		return $answers;
	}
	
	try {
		
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
				$resp["answers"] = getAnswers($conn);
				
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