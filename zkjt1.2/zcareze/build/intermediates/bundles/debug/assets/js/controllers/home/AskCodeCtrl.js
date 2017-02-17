define([], function(){
	'use strict';

	function controller($scope,$rootScope,$state,$timeout,$API,$stateParams) {
		var id=$rootScope.psyToAskData.id;
		$scope.askCommitEvaluation = function(){
		            $API.HealthOrderService.commitEvaluation({
		            	orderId:'',
		            	evaId:$rootScope.AskFactors[0].evaId,
		            	conclusion:''
		            })
		            .fail(function (error) {
		                console.log(error.message);
		            })
		            .then(function (reslut) {
		                if(reslut.code==1){
		                localStorage.removeItem($rootScope.psyToAskData.id+$rootScope.Md5userId+'grade');
		                localStorage.removeItem($rootScope.psyToAskData.id+$rootScope.Md5userId+'answer');
		                $rootScope.back('app.home-PsychologicalEval');
		                }
		                else{
		                	console.log(reslut.code);
		                }
		            }) 
		        }
		
		$scope.$on('$ionicView.enter', function(){
			if($scope.isBack){
				$scope.isBack = false;
				return;
			}
			//$scope.resident=$rootScope.user;
		});

		$scope.$on("$ionicView.beforeLeave", function(event, data){
         
		});
	
	}
	controller.$inject = ['$scope','$rootScope','$state','$timeout','$API','$stateParams'];

	ZcarezeApp.registerController('AskCodeCtrl', controller);
})