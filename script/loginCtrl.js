app.controller("loginCtrl", function ($scope, $window, $http){
	
	$scope.id = "";
	$scope.virhe = true;
	
	$scope.kirjaudu = function() {

		var data = {
			'id' : $scope.id
		};

		$http.post("php/login.php", data).then(function(response){
			if (response.data.code == 0){
				$window.location.href = "#/pollStart";
			}
			else{
				$scope.error = "Virheellinen kirjautuminen!";
				$scope.virhe = false;
			}			
	});
	
	};
	
});
 
