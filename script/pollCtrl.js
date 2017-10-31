app.controller("pollCtrl", function ($scope, $window, $http, $location){
	
	$scope.questions = "";
	$scope.curNum = 0;
	$scope.curInd = 0;
	$scope.curQuestion = "";
	$scope.curType = 0;
	$scope.questionCount = 0;
	$scope.answer = null;
	
	$http.get("php/getQuestions.php").then(function(response) {
		
		if (response.data.code == 0) {
			$scope.questions = response.data.questions;
			$scope.curNum = $scope.questions[$scope.curInd].num
			$scope.curQuestion = $scope.questions[$scope.curInd].question;
			$scope.curType = $scope.questions[$scope.curInd].type;
			$scope.questionCount = $scope.questions.length;
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
		}
	};
	
	$scope.sendAnswer = function() {
		
		var data = {
			'answer' : $scope.answer,
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