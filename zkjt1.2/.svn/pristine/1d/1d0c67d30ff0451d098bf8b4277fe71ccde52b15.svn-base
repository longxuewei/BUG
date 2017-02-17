define([], function(){
	'use strict';

	function controller($scope, $rootScope, $state,$dictionary,$stateParams) {

		$scope.homeMenu = function(state,data,index){
			state && $state.go(state);
			$rootScope.psyToAskData=data;
			$rootScope.psyToAskIndex=index;
		}
		$stateParams.askItemData={}
		/*
		 * 心理指导测评表数据
		 * 
		 */
		$scope.askTable=function (){
		            $dictionary.querySQL(
		                ("SELECT "+
		                ['name','comment','id'].join(',')+
		                " FROM "+"evaluation_list as evaluationList"),
		                function (data) {
		                   $scope.$apply(function () {
		                        $scope.askTableList=data;
		                       
		                    });
		                });
		         }

		
		//下拉刷新
		$scope.doRefresh = function(type) {
			$rootScope.loading.show = false;
			$timeout(function() {
				$scope.$broadcast('scroll.refreshComplete');
			}, 200);
		};

		$scope.$on('$ionicView.enter', function(){
			$scope.askTable();
			if($scope.isBack){
				$scope.isBack = false;
				return;
			}
			//$scope.resident=$rootScope.user;
		});

		$scope.$on("$ionicView.beforeLeave", function(event, data){

		});
	
	}
	controller.$inject = ['$scope', '$rootScope', '$state','$dictionary','$stateParams'];

	ZcarezeApp.registerController('PsychologicalEvalCtrl', controller);
})