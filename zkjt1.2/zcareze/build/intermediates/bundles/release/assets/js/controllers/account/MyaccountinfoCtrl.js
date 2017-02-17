
define([], function(){
	'use strict';

	function controller($scope, $rootScope, $state, $ionicSlideBoxDelegate, $initModelView, $timeout, $API, $CLIENT) {
		$scope.$model=$initModelView.init($scope,{
            class: "mini"
        });

        $scope.changeUser = {};

        $scope.getVeriLoadding = false;
        $scope.countdowntimer = 0;
        $scope.remaining = 0;

		/**
		 * 关闭和开启与其他共享信息
		 * @创建人员   杨英俊
		 * @创建时间   2017-01-05T12:01:29+0800
		 * @param  {[type]}                 type [description]
		 * @return {[type]}                      [description]
		 */
        $scope.openGrade  = function(type){
        	$API.ResidentService.changeResidentOpenGrade({
        		residentId: $rootScope.user.id,
        		openGrade: type ? 0 : 1
        	}).then(function(result){
                if(result.code == 1){
                    $rootScope.user.openGrade = !type;
                }else{
                    $rootScope.user.openGrade = type;
                }
        	}).fail(function(){
        		$rootScope.user.openGrade = type;
        	});
        }

        /**
         * 修改密码窗口
         * @创建人员   杨英俊
         * @创建时间   2017-01-05T14:28:24+0800
         * @return {[type]}                 [description]
         */
        $scope.changePasswordModel = null;
        $scope.openPasswordModel = function(){
        	var model = {
					title: "修改密码",
					templateUrl: "view/account/dialog/password.html",
					scope: $scope,
					buttons:[
						{
							text: "取消",
                            onTap:function (e) {
                                $scope.changeUser = {};
                            }
						},
						{
							text: "确认",
                            type: 'button-balanced',
                            onTap:function (e) {
                            	e.stopPropagation();
                                $scope.servePassword();
                            }
						}
					]
				};
        	$scope.changePasswordModel = $rootScope.confirm(model);
        }

        /**
         * 保存密码
         * @创建人员   杨英俊
         * @创建时间   2017-01-05T14:35:18+0800
         * @return {[type]}                 [description]
         */
        $scope.servePassword = function(){
        	if(!$scope.changeUser.password){
        		$ionicPopup.alert({
                    title: '提示!',
                    template: '密码不能少于6位数'
                });
                return;
        	}
        	if(!$scope.changeUser.smsNum){
        		$ionicPopup.alert({
                    title: '提示!',
                    template: '请输入有效的4位数字验证码'
                });
                return;
        	}
        	$API.CoreService.changeAccoutPassword({
        		password:$scope.changeUser.password,
        		smsNum:$scope.changeUser.smsNum
        	}).then(function(result){
        		if(result.code == 1){
        			$scope.changePasswordModel.close();
        			$rootScope.alert({
	                    title: '提示!',
	                    template: '密码修改成功，请重新登录',
	                    buttons:[
							{
								text: "重新登录",
                            	type: 'button-balanced',
	                            onTap:function (e) {
	                            	$scope.getVeriLoadding = false;
							        $scope.countdowntimer = 0;
							        $scope.remaining = 0;
							        $scope.changeUser = {};
	                                $rootScope.logout(null, true);
	                            }
							}
						]
	                });
        		}else{
        			$rootScope.alert({
	                    title: '提示!',
	                    template: result.message,
	                    buttons:[
							{
								text: "关闭",
	                            onTap:function (e) {
	                            	$scope.openPasswordModel();
	                            }
							}
						]
	                });
        		}
        	}).fail(function(error){
        		
        	});
        }

        var vercode = "";
        $scope.getVeriLoadding = false;
        /**
         * 获取验证码
         * @创建人员   杨英俊
         * @创建时间   2017-01-05T14:35:31+0800
         * @param  {[type]}                 user [description]
         * @return {[type]}                      [description]
         */
        $scope.getVerification = function(){
        	if(!$scope.changeUser.password || $scope.remaining || $scope.getVeriLoadding){
        		return;
        	}
            $scope.getVeriLoadding = true;
            $CLIENT.achievesms({
                    purpose: "reg",
                    mobile: $rootScope.one.mobile
            }).success(function(result){
                $timeout(function(){
                    $scope.getVeriLoadding = false;
                }, 1000);
                if(result.code == 1){
                    $scope.countdowntimer = 60;
                }
            }).error(function(){
                $scope.getVeriLoadding = false;
                $rootScope.alert({
                    title: '提示!',
                    template: '获取验证码失败，请重试。'
                });
            })
        }

       	/**
       	 * 计时
       	 * @创建人员   杨英俊
       	 * @创建时间   2017-01-05T14:41:34+0800
       	 * @param  {[type]}                 time [description]
       	 * @return {[type]}                      [description]
       	 */
        $scope.countdowncall = function(time){
            $scope.remaining = time;
            if($scope.remaining == 0){
                $scope.countdowntimer = 0;
                $scope.remaining = 0;
            }
        }

        /**
         * 修改密码
         * @创建人员   杨英俊
         * @创建时间   2017-01-05T14:28:43+0800
         * @return {[type]}                 [description]
         */
        $scope.changePassword = function(){
        	var model = {
					title: "修改密码",
					templateUrl: "view/account/dialog/password.html",
					scope: $scope
				};
        	$rootScope.confirm(model);
        }
		
		$scope.$on('$ionicView.enter', function(){
			$rootScope.user.openGrade
		});

		$scope.$on("$ionicView.beforeLeave", function(event, data){

		});
	}
	controller.$inject = ['$scope', '$rootScope', '$state', '$ionicSlideBoxDelegate', '$initModelView', '$timeout', '$API', '$CLIENT'];

	ZcarezeApp.registerController('MyaccountinfoCtrl', controller);
})