define([], function(){
	'use strict';

	function controller($scope, $CLIENT, $rootScope, $state, $ionicSlideBoxDelegate, $initModelView, $timeout, $API) {

		$scope.weixinQrcodeUrl = "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=";

		$scope.ticket = "";

		$scope.isLoading = true;

		$scope.isInit = false;

		$scope.$model=$initModelView.init($scope,{
            class: "mini"
        });

		$scope.refreshQRcode = function(){
			$scope.isLoading = true;
			$CLIENT.qrcode({
				residentId: $rootScope.user.id
			}).success(function(reslut){
				if(reslut.code == 1){
					$scope.ticket = reslut.data;
				}
				$timeout(function(){
					$scope.isLoading = false;
				},100);
			}).error(function(){
				$timeout(function(){
					$scope.isLoading = false;
				},100);
			})
		}

		$scope.$on('$ionicView.enter', function(){
			if(!$scope.isInit){
				$scope.isInit = true;
				$scope.refreshQRcode();
			}
		});

		$scope.$on("$ionicView.beforeLeave", function(event, data){

		});
	}
	controller.$inject = ['$scope', '$CLIENT', '$rootScope', '$state', '$ionicSlideBoxDelegate', '$initModelView', '$timeout', '$API'];

	ZcarezeApp.registerController('QrcodeCtrl', controller);
})