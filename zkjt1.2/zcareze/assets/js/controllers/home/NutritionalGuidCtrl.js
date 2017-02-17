define([], function(){
	'use strict';

	function controller($scope, $rootScope, $state) {
        
        	
		$scope.morning = {
			'main':[{'name':'蛋炒饭'},{'name':'牛肉饭'},{'name':'卤肉饭'},{'name':'番茄鸡蛋面'}],
			'mit':[{'name':'青椒肉丝'},{'name':'水煮牛肉'},{'name':'麻辣鱼'},{'name':'泥鳅'}],
			'cool':[{'name':'徐州凉皮'},{'name':'凉拌三丝'},{'name':'水煮牛肉'},{'name':'麻辣鱼'},{'name':'泥鳅'}]
		}
		
		$scope.afternoon = {
			'main':[{'name':'蛋炒饭'},{'name':'牛肉饭'},{'name':'卤肉饭'},{'name':'番茄鸡蛋面'}],
			'mit':[{'name':'青椒肉丝'},{'name':'水煮牛肉'},{'name':'麻辣鱼'},{'name':'泥鳅'}],
			'cool':[{'name':'徐州凉皮'},{'name':'凉拌三丝'},{'name':'水煮牛肉'},{'name':'麻辣鱼'},{'name':'泥鳅'}]
		}
		
		$scope.night = {
			'main':[{'name':'蛋炒饭'},{'name':'牛肉饭'},{'name':'卤肉饭'},{'name':'番茄鸡蛋面'}],
			'mit':[{'name':'青椒肉丝'},{'name':'水煮牛肉'},{'name':'麻辣鱼'},{'name':'泥鳅'}],
			'cool':[{'name':'徐州凉皮'},{'name':'凉拌三丝'},{'name':'水煮牛肉'},{'name':'麻辣鱼'},{'name':'泥鳅'}]
		}
//		
//		//换食物整体
//		$scope.isClick=true;
//		$scope.exertabs=function(len,len1,len2){
//			$scope.isClick=!$scope.isClick;
//			$scope.nutnowLen=$scope.items['data'+Math.ceil(Math.random()*len)];
//			$scope.nutnowLen2=$scope.items2['data'+Math.ceil(Math.random()*len1)];
//			$scope.nutnowLen3=$scope.items3['data'+Math.ceil(Math.random()*len2)];
//		}
		//换食物 单个
		$scope.changeFood=function (index){
			$scope.index=Math.floor(Math.random()*index)
		}
		$scope.changeFood1=function (index){
			$scope.index1=Math.floor(Math.random()*index)
		}
		$scope.changeFood2=function (index){
			$scope.index2=Math.floor(Math.random()*index)
		}
		$scope.changeFood3=function (index){
			$scope.index3=Math.floor(Math.random()*index)
		}
		$scope.changeFood4=function (index){
			$scope.index4=Math.floor(Math.random()*index)
		}
		$scope.changeFood5=function (index){
			$scope.index5=Math.floor(Math.random()*index)
		}
		$scope.changeFood6=function (index){
			$scope.index6=Math.floor(Math.random()*index)
		}
		$scope.changeFood7=function (index){
			$scope.index7=Math.floor(Math.random()*index)
		}
		$scope.changeFood8=function (index){
			$scope.index8=Math.floor(Math.random()*index)
		}
		function initChange(){
			$scope.changeFood($scope.morning.main.length);
			$scope.changeFood1($scope.morning.mit.length);
			$scope.changeFood2($scope.morning.cool.length);
			$scope.changeFood3($scope.afternoon.main.length);
			$scope.changeFood4($scope.afternoon.mit.length);
			$scope.changeFood5($scope.afternoon.cool.length);
			$scope.changeFood6($scope.night.main.length);
			$scope.changeFood7($scope.night.mit.length);
			$scope.changeFood8($scope.night.cool.length);	
		}
		$scope.isClick=false;
		$scope.changebtn=function(){
			$scope.isClick=!$scope.isClick;
		}

		$scope.$on('$ionicView.enter', function(){
		
			initChange();
			//$scope.exertabs(2,2,2);
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

	ZcarezeApp.registerController('NutritionalGuidCtrl', controller);
})