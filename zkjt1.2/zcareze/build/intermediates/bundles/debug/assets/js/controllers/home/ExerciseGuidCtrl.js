define([], function(){
	'use strict';

	function controller($scope, $rootScope, $state) {
		
		$scope.exeData = {
			'data1': {
				'title':'快走',
				'time':'40',
				'fat':'260.96'
			},
			'data2': {
				'title':'快走',
				'time':'80',
				'fat':'俯卧撑'
			} 
		};
		
		$scope.exeData2 = {
			'data1': {
				'title':'乒乓球(室内)',
				'time':'40',
				'fat':'263.66'
			},
			'data2': {
				'title':'快走',
				'time':'20',
				'fat':'153.22'
			} 
		};
		
		$scope.exeData3 = {
			'data1': {
				'title':'篮球',
				'time':'10',
				'fat':'153.22'
			},
			'data2': {
				'title':'快走',
				'time':'20',
				'fat':'153.22'
			} 
		};
		
		$scope.exertabs=function(len,len1,len2){
			$scope.nowLen=$scope.exeData['data'+Math.ceil(Math.random()*len)];
			$scope.nowLen2=$scope.exeData2['data'+Math.ceil(Math.random()*len1)];
			$scope.nowLen3=$scope.exeData3['data'+Math.ceil(Math.random()*len2)];
			console.log($scope.nowLen)
		}
		$scope.$on('$ionicView.enter', function(){
			$scope.exertabs(2,2,2);
			if($scope.isBack){
				$scope.isBack = false;
				return;
			}
			//$scope.resident=$rootScope.user;
		});

		$scope.$on("$ionicView.beforeLeave", function(event, data){

		});
	
	}
	controller.$inject = ['$scope', '$rootScope', '$state'];

	ZcarezeApp.registerController('ExerciseGuidCtrl', controller);
})