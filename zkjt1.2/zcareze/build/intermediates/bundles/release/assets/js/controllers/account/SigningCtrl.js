define([], function(){
	'use strict';

	function controller($scope, $rootScope, $state, $ionicSlideBoxDelegate, $initModelView,$API) {
		
		//签约数据
        $scope.getSign = function(){
			$API.ResidentContractService.getRsdtContractDetailByResidentId({
				rsdtContractOverviewId:$rootScope.user.id
			}).then(function (reslut) {
				if(reslut.code==1){
					$scope.sign=reslut;
				}
			 console.log(reslut)
			}).fail(function (error) {
				console.log(error.message);
			})
		}
		
	    $scope.$model=$initModelView.init($scope,{
            class: "mini"
        });
		
		$scope.$on('$ionicView.enter', function(){
			$scope.getSign();
		});

		$scope.$on("$ionicView.beforeLeave", function(event, data){

		});
	}
	controller.$inject = ['$scope', '$rootScope', '$state', '$ionicSlideBoxDelegate', '$initModelView','$API'];

	ZcarezeApp.registerController('SigningCtrl', controller);
})