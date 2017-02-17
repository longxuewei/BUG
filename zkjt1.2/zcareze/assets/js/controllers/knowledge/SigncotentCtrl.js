define([], function(){
	'use strict';

	function controller($scope, $rootScope, $state, $ionicSlideBoxDelegate, $modelView, $timeout, $API) {

	
		$scope.$on('$ionicView.enter', function(){
			if($scope.isBack){
				$scope.isBack = false;
				return;
			}
		});

		$scope.$on("$ionicView.beforeLeave", function(event, data){

		});
	
	}
	controller.$inject = ['$scope', '$rootScope', '$state', '$ionicSlideBoxDelegate', '$modelView', '$timeout', '$API'];

	ZcarezeApp.registerController('SigncotentCtrl', controller);
})