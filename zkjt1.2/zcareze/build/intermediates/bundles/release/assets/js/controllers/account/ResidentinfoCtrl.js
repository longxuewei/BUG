define([], function(){
	'use strict';

	function controller($scope, $rootScope, $state, $ionicSlideBoxDelegate, $initModelView, $timeout, $API) {
        	
        var resident = $rootScope.user;

        //数据操作
        $scope.accoutdetail={};
        $scope.opendetail = function(type, task){
			//获取居民详情
			$API.ResidentService.getResidentDetails({
				id: $rootScope.user.id
			}).then(function (reslut) {
				if(reslut.code==1){
					$scope.accoutdetail=reslut;
				}
			}).fail(function (error) {
			})
		}
        
        var isAccoutdetail=false;
        
		$scope.$model=$initModelView.init($scope,{
            class: "mini"
        });
		
		$scope.$on('$ionicView.enter', function(){
			
			if (isAccoutdetail) {
				if(resident.id != $rootScope.user.id){
					resident = angular.copy($rootScope.user);
					$scope.opendetail();
				}
				return;
			} else{
				resident = angular.copy($rootScope.user);
				$scope.opendetail();
				isAccoutdetail=true;
			}
			
		});

		$scope.$on("$ionicView.beforeLeave", function(event, data){

		});
	}
	controller.$inject = ['$scope', '$rootScope', '$state', '$ionicSlideBoxDelegate', '$initModelView', '$timeout', '$API'];

	ZcarezeApp.registerController('ResidentinfoCtrl', controller);
})