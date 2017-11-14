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
	$scope.choiceAnswer = null;
	$scope.multichoiceAnswer = null;
	$scope.oldAnswers = null;
	$scope.choices = {Hauki: false, Ahven: false, Kuha: false, };
	
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
						case 4:
							$scope.choiceAnswer = $scope.oldAnswers[i].answer;
							break;
						case 5:
							$scope.multichoiceAnswer = $scope.oldAnswers[i].answer;
							break;	
						
						default:
							alert("error with answers!");
					}
					i = $scope.oldAnswers.length;
				}
			}
		}
	};
    



	
	$http.get("php/getQuestions.php").then(function(response) {
		
		if (response.data.code == 0) {
			$scope.questions = response.data.questions;
			$scope.curNum = $scope.questions[$scope.curInd].num
			$scope.curQuestion = $scope.questions[$scope.curInd].question;
			$scope.curType = $scope.questions[$scope.curInd].type;
			$scope.questionCount = $scope.questions.length;
			
			if (response.data.answers != null) {
				alert("Olet jo vastannut tähän kyselyyn, voit halutessasi muuttaa vastauksiasi.");
				$scope.oldAnswers = response.data.answers;
				setOldAnswer();
			}
		} else {
			$location.path("/");
		}
		
	});
	
	$scope.changeQuestion = function(num) {
		var length = $scope.questions.length
		
		var newIndex = $scope.curInd + num;
		
		if (newIndex < length && newIndex >= 0) {
			$scope.curInd = newIndex;
			$scope.curNum = $scope.questions[$scope.curInd].num;
			$scope.curQuestion = $scope.questions[$scope.curInd].question;
			$scope.curType = $scope.questions[$scope.curInd].type;
			
			setOldAnswer();
		}
	};
	
	$scope.sendAnswer = function(answer) {
		var data = {
			'answer' : answer,
			'num' : $scope.curNum
		};
		
		$http.post("php/setAnswer.php", data).then(function(response) {
			if (response.data.code == 0) {
				// Next question
				if ($scope.curInd < $scope.questionCount - 1) {
					$scope.changeQuestion(1);
					
				// Poll has ended
				} else {
					alert("Kiitos vastauksista! Kysely on päättynyt");
					$location.path("/");
				}
				
				$scope.answer = null;
			} else {
				alert("Virhe tallennuksessa! Yritä uudelleen...");
			}
		});
	};
});