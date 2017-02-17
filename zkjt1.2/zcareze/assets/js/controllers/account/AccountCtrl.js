define([], function(){
	'use strict';

	function controller($scope, $rootScope, $state, $ionicLoading, $initModelView, $modelView, $timeout, $API) {

		$scope.init = false;

		/**
		 * 切换账户
		 * @创建人员   杨英俊
		 * @创建时间   2016-12-25T17:32:03+0800
		 * @param  {[type]}                 resident [description]
		 * @return {[type]}                            [description]
		 */
		$scope.changeResident = function(resident){
			if(+resident.openGrade){
				$rootScope.confirm({
		            title:"切换健康信息",
		            template:'<div class="text-center">切换到“'+resident.name+'”后,所以操作将对该成员有效。</div>',
		            buttons:[
		            	{
							text: "取消",
		            	},
						{	
							text: "切换账户",
							type: 'button-balanced',
							onTap: function(e) {
								if(resident.id){
						          $ionicLoading.show({
						              template: '<ion-spinner icon="spiral"></ion-spinner><div class="text-center">正在切换...</div>'
						          }).then(function(){
						              ZcarezeApp.Native.java("changeFamily", resident.id);
						          });
						        }
							}
						}
		            ]
		        });
			}else{
				$rootScope.confirm({
		            title:"提示",
		            template:'<div class="">“'+resident.name+'”用户并未开启信息共享,如需查看请注销当前登录后用“'+resident.name+'”的账号登录。</div>',
		            buttons:[
		            	{
							text: "取消",
		            	},
						{	
							text: "立即注销",
							type: 'button-assertive',
							onTap: function(e) {
								$rootScope.logout();
							}
						}
		            ]
		        });
			}
	    }

	    /** 
	     * 切换账户成功
	     * @创建人员   杨英俊
	     * @创建时间   2017-01-05T09:48:51+0800
	     * @param  {[type]}                 ){	                   	$scope.init [description]
	     * @param  {[type]}                 350);	                 }           [description]
	     * @return {[type]}                        [description]
	     */
	    ZcarezeApp.AddJsAPI('onChangeSuccess', function(){
	    	$scope.init = false;
	    	$rootScope.homeInit = false;
    		$rootScope.getDevicesInfo();
    		$rootScope.initDevices(function(){
    			$scope.openacoutModde();
    		});
    		$timeout(function(){
	    		$ionicLoading.hide();
    		}, 350);
	    });

	    /**
	     * 切换账户失败
	     * @创建人员   杨英俊
	     * @创建时间   2017-01-05T09:48:30+0800
	     * @param  {String}                 ){	                                                                             	$ionicLoading.hide();	    	$rootScope.confirm({	              title:"切换失败！",	                             template:'<div class [description]
	     * @param  {[type]}                 options.text:  "切换登录"             [description]
	     * @param  {[type]}                 options.type:  'button-assertive' [description]
	     * @param  {[type]}                 options.onTap: function(e)        {							$rootScope.logout();						}					}	                                                          ]	                       }); [description]
	     * @return {[type]}                                [description]
	     */
	    ZcarezeApp.AddJsAPI('onChangeFail', function(){
	    	$ionicLoading.hide();
	    	$rootScope.confirm({
	            title:"切换失败！",
	            template:'<div class="">切换用户时出错，请确保该账户已激活并且可用。或者是注销后直接登录该账户。</div>',
	            buttons:[
	            	{
						text: "关闭",
	            	},
					{
						text: "切换登录",
	            		type: 'button-assertive',
						onTap: function(e) {
							$rootScope.logout();
						}
					}
	            ]
	        });
	    });

        //调整
		$scope.stateUrl = function(state){
			$modelView.go(state).
			callback(function(data) {
				$scope.isBack = true;
			}, $scope);
		}
		
		//下拉刷新
        $scope.doRefresh = function(type) {
            $rootScope.loading.show = false;
            $scope.openacoutModde(function(){
            	$scope.$broadcast('scroll.refreshComplete');
            })
        };
       
        //查询非当前用户的家庭成员信息
        $scope.openacoutModde = function(handle){
			$API.ResidentService.getResidentListByFamilyIdAndNotResidentId({
				familyId:$rootScope.user.familyId,
				residentId:$rootScope.user.id
			}).then(function (reslut) {
				if(reslut.code==1){
					$scope.accoutfamily=reslut;
				}
				handle && handle();
			}).fail(function (error) {
				console.log(error.message);
				handle && handle();
			})	
		}
		$scope.$model = $initModelView.init($scope,{
            class: "mini"
        });
		
		
		$scope.$on('$ionicView.enter', function(){
			if ($scope.init) {
				return;
			} else{
				$scope.openacoutModde();
				$scope.init=true;
			}
		});

		$scope.$on("$ionicView.beforeLeave", function(event, data){

		});
	}
	controller.$inject = ['$scope', '$rootScope', '$state', '$ionicLoading', '$initModelView', '$modelView' ,'$timeout', '$API'];

	ZcarezeApp.registerController('AccountCtrl', controller);
})