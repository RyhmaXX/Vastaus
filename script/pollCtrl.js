app.controller("pollCtrl", function ($scope, $window, $http, $location){
	
	$scope.questions = "";
	$scope.curNum = 0;
	$scope.curInd = 0;
	$scope.curQuestion = "";
	$scope.curType = 0;
	$scope.questionCount = 0;
	$scope.textAnswer = null;
	$scope.numAnswer = null;
	$scope.boolAnswer = null;
	$scope.choices = null;
	$scope.oldAnswers = null;
	$scope.radioChoice = null;
	$scope.matrix = null;
	$scope.matrixAnswer = null;
	
	$scope.inputTypes = [null, "number", "number", "text", "number"];
	
	var setOldAnswer = function() {
		if ($scope.oldAnswers != null) {
			for (var i = 0; i < $scope.oldAnswers.length; i++) {
				if ($scope.oldAnswers[i].question == $scope.curNum) {
					switch($scope.curType) {
						case 1:
							$scope.textAnswer = $scope.oldAnswers[i].answer;
							break;
						case 2:
							$scope.numAnswer = $scope.oldAnswers[i].answer;
							break;
						case 3:
							$scope.boolAnswer = $scope.oldAnswers[i].answer;
							break;
						case 100:
							$scope.radioChoice = $scope.oldAnswers[i].answer;
							break;
						case 101:
							$scope.choices = $scope.oldAnswers[i].answer;
							break;	
						case 201:
							$scope.matrixAnswer = $scope.oldAnswers[i].answer;
							break;
						default:
							alert("error with answers!");
					}
					i = $scope.oldAnswers.length;
				}
			}
		}
	};
	
	var setExtras = function() {
		if ($scope.curType > 99 && $scope.curType < 200) {
			// Choice
			
			var extra = $scope.questions[$scope.curInd].extra;
			
			if ($scope.curType == 100) {
				$scope.choices = extra;

			} else if ($scope.curType == 101){
				$scope.choices = {};
			
				for (var i = 0; i < extra.length; i++) {
					var name = extra[i].name;
					
					$scope.choices[name] = false;
				}
			}
			
		} else if ($scope.curType > 199) {
			// Matrix
			$scope.matrix = $scope.questions[$scope.curInd].extra;
			
			var rowCount = $scope.matrix.rows.length;
			var columnCount = $scope.matrix.columns.length;
			
			var rows = [];
			
			for (var i = 0; i < rowCount; i++) {
				
				var column = [];
				
				for (var j = 0; j < columnCount; j++) {
					column[j] = null;
				}
				
				rows[i] = column;
			}
			
			$scope.matrixAnswer = rows;
		}
		setOldAnswer();
	};
	
	var fetch = function() {	
		$http.get("php/getQuestions.php").then(function(response) {
			
			if (response.data.code == 0) {
				$scope.questions = response.data.questions;
				$scope.curNum = $scope.questions[$scope.curInd].num
				$scope.curQuestion = $scope.questions[$scope.curInd].question;
				$scope.curType = $scope.questions[$scope.curInd].type;
				$scope.questionCount = $scope.questions.length;
				
				if (response.data.answers != null) {
					$scope.oldAnswers = response.data.answers;
					setOldAnswer();
				}
				
				setExtras();
			} else {
				$location.path("/");
			}
			
		});
	};
	
	var fetchMatrixColumnTypes = function() {
		
		$http.get("php/getMatrixColumnTypes.php").then(function(response) {
			
			if (response.data.code == 0) {
				
				var types = response.data.types;
				
				var array = [];
				
				for (i = 0; i < types.length; i++) {
					array[types[i].id] = types[i].name;
				}
				
				$scope.matrixInputTypes = array;
			} else {
				alert("Matriisityyppejä ei saatu noudettua!");
			}
		});
	};
	
	$scope.changeQuestion = function(num) {
		
		fetch();
		
		var length = $scope.questions.length
		
		var newIndex = $scope.curInd + num;
		
		if (newIndex < length && newIndex >= 0) {
			$scope.curInd = newIndex;
			$scope.curNum = $scope.questions[$scope.curInd].num;
			$scope.curQuestion = $scope.questions[$scope.curInd].question;
			$scope.curType = $scope.questions[$scope.curInd].type;
			
			setExtras();
			
		}
	};
	
	$scope.sendAnswer = function(answer, num) {
		var data = {
			'answer' : answer,
			'num' : $scope.curNum
		};
		
		$http.post("php/setAnswer.php", data).then(function(response) {
			if (response.data.code == 0) {
				// Poll has ended
				if ($scope.curInd >= $scope.questionCount - 1 && num > 0) {
					alert("Kiitos vastauksista! Kysely on päättynyt");
					$location.path("/");
				
				// Next/Previous question
				} else {
					$scope.changeQuestion(num);
				}
				
			} else {
				alert("Virhe tallennuksessa! Yritä uudelleen...");
			}
		});
	};
	
	fetch();
	//fetchMatrixColumnTypes();
});