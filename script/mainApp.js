var app = angular.module("mainApp", ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "login.html",
		controller : "loginCtrl"
    });
});
