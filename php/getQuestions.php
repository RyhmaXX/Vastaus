<?php
	
	session_start();
	
	header("Content-type: text/html; charset=UTF-8");
	
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
	
	function getChoices($conn, $num, $pollid) {
		
		$query = $conn->prepare("SELECT num, name
								FROM choice
								WHERE question_poll_id = ? AND question_question_num = ?");
		
		$query->bind_param("ii", $pollid, $num);
		$query->execute();
		
		$result = $query->get_result();
		
		$extras = [];
		
		while ($row = $result->fetch_assoc()) {
			$num = $row["num"];
			$name = $row["name"];
			
			$extra = array(
				"num" => $num,
				"name" => $name
			);
			
			array_push($extras, $extra);
		}
		
		return $extras;
	}
	function getMatrixRows($conn, $id) {
		
		$query = $conn->prepare("SELECT num, title
								FROM qm_row
								WHERE qm_id = ?
								ORDER BY num");
		
		$query->bind_param("i", $id);
		$query->execute();
		
		$result = $query->get_result();
		
		$rows = [];
		
		while ($row = $result->fetch_assoc()) {
			$num = $row["num"];
			$title = $row["title"];
			
			$r = array(
				"num" => $num,
				"title" => $title
			);
			
			array_push($rows, $r);
		}
		
		return $rows;
	}
	
	function getMatrixColumns($conn, $id) {
		
		$query = $conn->prepare("SELECT num, title, type
								FROM qm_column
								WHERE qm_id = ?
								ORDER BY num");
		
		$query->bind_param("i", $id);
		$query->execute();
		
		$result = $query->get_result();
		
		$columns = [];
		
		while ($row = $result->fetch_assoc()) {
			$num = $row["num"];
			$title = $row["title"];
			$type = $row["type"];
			
			$col = array(
				"num" => $num,
				"title" => $title,
				"type" => $type
			);
			
			array_push($columns, $col);
		}
		
		return $columns;
	}
	
	function getMatrix($conn, $num, $pollid) {
		
		$query = $conn->prepare("SELECT id, header
								FROM question_matrix
								WHERE poll_id = ? AND question_num = ?");
		
		$query->bind_param("ii", $pollid, $num);
		$query->execute();
		
		$result = $query->get_result();
		
		$row = $result->fetch_assoc();
		
		$id = $row["id"];
		$header = $row["header"];
		
		$rows = getMatrixRows($conn, $id);
		$columns = getMatrixColumns($conn, $id);
		
		$matrix = array(
			"header" => $header,
			"rows" => $rows,
			"columns" => $columns
		);
		
		return $matrix;
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
					
					if ($type > 99 && $type < 200) {
						$extra = getChoices($conn, $num, $poll);
					} else if ($type > 199) {
						$extra = getMatrix($conn, $num, $poll);
					} else {
						$extra = null;
					}
					$q = array(
						"num" => $num,
						"question" => $question,
						"type" => $type,
						"extra" => $extra
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