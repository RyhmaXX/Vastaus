app.controller("loginCtrl", function ($scope, $window, $http){
	
	$http.get("php/logout.php");
	
	$scope.id = "";
	$scope.virhe = true;
	
	$scope.kirjaudu = function() {

		var data = {
			'id' : $scope.id
		};

		$http.post("php/auth.php", data).then(function(response){
			if (response.data.code == 0){
				$window.location.href = "#/poll";
			}
			else if (response.data.code == 2)
			{
				$scope.error = "Kysely ei ole auki!";
				$scope.virhe = false;
			}
			else
			{
				$scope.error = "Virheellinen kirjautuminen!";
				$scope.virhe = false;
			}
	});
	
	};
	
});
 
