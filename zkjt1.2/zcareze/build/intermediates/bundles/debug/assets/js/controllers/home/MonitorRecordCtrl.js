define(['libs/echarts.min.js'], function(echarts){
	'use strict';
	window.echarts = echarts;

	function controller($scope, $rootScope, $state, $stateParams, $modelView, $timeout, $API, $dictionary, $ionicLoading, $ionicScrollDelegate) {

		var source = {
				"1": "仪器监测", 
				"2": "手工监测", 
				"3": "机构监测"
			}


		$scope.device = null;
		$scope.isBack = false;

		$scope.pageNum = 0;
		$scope.pageSize = 30;

		$scope.ismore = true;

		$scope.monitorRecordScroll = $ionicScrollDelegate.$getByHandle('monitorRecordScroll');

		/**
		 * 查看本地检测记录
		 * @创建人员   杨英俊
		 * @创建时间   2017-01-09T13:41:23+0800
		 * @param  {[type]}                 handler [description]
		 * @return {[type]}                         [description]
		 */
		$scope.getMonitorDatas = function(handler){
			$scope.monitorDatas = [];
			$ionicLoading.show({
                template: '<ion-spinner icon="spiral"></ion-spinner>'
            }).then(function(){});
			$dictionary.queryMonitorData($scope.device.suiteId , $rootScope.user.id, $scope.pageNum, $scope.pageSize, function(data){
				$scope.$apply(function(){
					if(data.length){
						$scope.monitorDatas = data;
					}
					if(data.length < 30){
						$scope.ismore = false;
					}
					handler && handler();
					$ionicLoading.hide();
				})
			}, function(error){
				$scope.$apply(function(){
					handler && handler();
					$ionicLoading.hide();
				})
			});
		}

		$scope.syncCloudDataModle = function(){
			$rootScope.alert({
				title: "同步线上数据",
				template: "同步线上30天数据到本地数据库，同步之后本地数据会被覆盖。",
				scope: $scope,
				buttons: [
	                {
	                  	text: '取消'
	                },
	                {
	                    text: '立即同步',
	                    type: 'button-energized',
	                    onTap: function(e) {
	                    	$scope.syncCloudData();
	                    }
	                }
	            ]
			});
		}

		/**
		 * 同步线上30天检测记录
		 * @创建人员   杨英俊
		 * @创建时间   2017-01-09T14:18:32+0800
		 * @return {[type]}                 [description]
		 */
		$scope.syncCloudData = function(){
			$rootScope.loading.template = '<ion-spinner icon="spiral"></ion-spinner><div>同步检测数据</div>';
          	$rootScope.loading.autoHide = false;
			$API.ResidentHealthService.getBatchRsdtMonitor({
				startDate: moment().subtract(30, 'day').format('YYYY-MM-DD'),
				endDate:  moment().format('YYYY-MM-DD'),
				suiteId: $scope.device.suiteId
			}).then(function(result){
				if(result.code == 1){
					if(result.lists.length){
						$ionicLoading.show({
			                template: '<ion-spinner icon="ripple"></ion-spinner><div>解析数据...</div>'
			            });
						var MonitorData = [];
						for (var i = 0; i < result.lists.length; i++) {
							var item = result.lists[i];
							for (var j = 0; j < item.detailList.length; j++) {
								MonitorData.push({
									"monitorId": item.id,
									"residentId": item.residentId,
									"suiteId": item.suiteId,
									"value": item.detailList[j].rawResult,
									"reference": item.detailList[j].validText,
									"remark": "",
									"unit": item.detailList[j].itemUnit,
									"hint": item.detailList[j].caution,
									"arrow": item.detailList[j].arrow,
									"name": item.detailList[j].itemName,
									"part": item.selPart || item.selTime || "",
									"seqNo": j,
									"source": item.method,
									"subtitle": item.detailList[j].subtitle,
									"deviceMac": "",
									"meterCode": item.meterCode,
									"acceptTime": item.acceptTime
								});
							}
						}
						$dictionary.querySQL("DELETE FROM rsdt_monitor_list WHERE suiteId = '"+ 
							$scope.device.suiteId +
							"' AND residentId = '"+ 
							$rootScope.user.id +"'",
						function (data) {
			                $dictionary.insertMonitorData([{data: MonitorData}], function(data){
			                	$ionicLoading.hide();
			                	$scope.doRefresh();
			                },function(error){
			                	$ionicLoading.hide();
			                });
			            }, function(){
			            	$ionicLoading.hide();
			            });
					}else{
						$rootScope.alert({
							title: "提示",
							template: "您30天内未上传任何监测数据，如其他设备监测过请联网自动同步数据。",
							scope: $scope,
							buttons: [
				                {
				                  	text: '取消'
				                }
				            ]
						});
						$ionicLoading.hide();
					}
				}
				$rootScope.loading.autoHide = true;
			}).fail(function(){
				$rootScope.loading.autoHide = true;
			});
		}

		/**
		 * 日期切换
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-15T17:19:02+0800
		 * @return {[type]}                 [description]
		 */
		$scope.dateChange = function(){
			$scope.dateChangeModel = $rootScope.confirm({
				title: "日期设置",
				template: (
					'<div class="flex-r date-box">'+
						'<div class="flex1 flex-c content">'+
							'<ul class="list">'+
							    '<li class="item flex-r" ng-click="selectView(1)">'+
							       '<label class="checkbox">'+
							         '<input type="checkbox" ng-checked="selectViewType == 1">'+
							       '</label>'+
							       '<div class="flex-r title">'+
							       		'<span>自动：</span>'+
							       '</div>'+
							       '<div class="flex1 text flex-r">'+
							       		'<span class="line-clamp-2">向下滑动屏幕，可自动加载查看更早日期的监测记录。</span>'+
							       '</div>'+
							    '</li>'+
							    '<li class="item flex-r inputs" ng-click="selectView(2)">'+
							       '<label class="checkbox">'+
							         '<input type="checkbox" ng-checked="selectViewType == 2">'+
							       '</label>'+
							       '<div class="flex-r title">'+
							       		'<span>指定：</span>'+
							       '</div>'+
							       '<div class="flex1 flex-r">'+
							       		'<label class="item item-input">'+
										    '<input type="date" ng-disabled="selectViewType != 2">'+
										'</label>'+
							       		'<span class="flex1 text">至</span>'+
							       		'<label class="item item-input">'+
										    '<input type="date" ng-disabled="selectViewType != 2">'+
										'</label>'+
							       '</div>'+
							    '</li>'+
							'</ul>'+
							'<div class="button-bar">'+
							  	'<a class="button" ng-click="closeDateChangeModel()">取消</a>'+
							  	'<a class="button main-btn" ng-click="closeDateChangeModel(true)">确定</a>'+
							'</div>'+
						'</div>'+
					'</div>'
					),
				cssClass: "modelview right mini",
				scope: $scope
			}, "custom");
		}
		$scope.closeDateChangeModel = function(isConfirm){
			if(isConfirm){

			}
			$scope.dateChangeModel.close();
		}
		$scope.selectViewType = 1;
		$scope.selectView= function(type){
			$scope.selectViewType = type;
		}

		/**
		 * 项目切换
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-15T17:19:02+0800
		 * @return {[type]}                 [description]
		 */
		$scope.itemChange = function(){
			$scope.itemChangeModel = $rootScope.confirm({
				title: "项目选择",
				template: (
					'<div class="flex-r date-box">'+
						'<div class="flex1 flex-c content">'+
							'<div class="flex-r list flex-rw">'+
								'<li class="col-50 box item flex-r inputs" ng-repeat="monitor in monitorIndexs"	ng-click="selectItem(monitor)">'+
							       '<ion-checkbox class="flex1" ng-checked="isSelectView(monitor)">{{monitor.name}}</ion-checkbox>'+
							    '</li>'+
							'</div>'+
							'<div class="button-bar">'+
							  	'<a class="button" ng-click="closeItemChangeModel()">取消</a>'+
							  	'<a class="button main-btn" ng-click="closeItemChangeModel(true)">确定</a>'+
							'</div>'+
						'</div>'+
					'</div>'
					),
				cssClass: "modelview right mini",
				scope: $scope
			}, "custom");
		}
		$scope.closeItemChangeModel = function(isConfirm){
			if(isConfirm){
				
			}
			$scope.itemChangeModel.close();
		}
		$scope.selectIndexs = [];
		$scope.selectItem = function(item){
			var i = $scope.selectIndexs.indexOf(item.id);
			if(i > -1){
				$scope.selectIndexs.splice(i, 1);
			}else{
				$scope.selectIndexs.push(item.id);
			}
		}
		$scope.isSelectView = function(item){
			return $scope.selectIndexs[item.id] ? true : false;
		}

		/**
		 * [monitorIndexs description]
		 * @type {Array}
		 */
		$scope.monitorIndexs = [];
		$scope.getMonitorIndexs = function(){
			$dictionary.querySQL("select "+
                ["c_name as name","id",].join(',')
                +" from monitor_items",function (data) {
                $scope.$apply(function () {
                	// data = $filter('orderBy')(data, 'code');
                    $scope.monitorIndexs = data;
                })
            });
		}

		/**
		 * 图形视图
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-15T17:20:32+0800
		 * @return {[type]}                 [description]
		 */
		$scope.graphView = function(){
			$scope.graphViewModel = $rootScope.confirm({
				templateUrl: "view/home/dialog/graphstatistics.html",
				cssClass: "modelview header-none graphmodel",
				scope: $scope
			}, "custom");
		}

		$scope.closeGraphView = function(){
			$scope.graphViewModel.close();
		}

		$scope.graphArray = [];
		$scope.monitordata = {
			"awayArrow": 1,
			"rawResult": "100/100",
			"itemUnit": "mmHg",
			"aimMin": "90.00/60.00",
			"axisMin": 30.00,
			"special": "11",
			"itemId": "78f4c4e5555b11e6bbd8d017c2939671,78f4c462555b11e6bbd8d017c2939671",
			"itemName": "血压",
			"awayCount": 7,
			"subtitle": null,
			"isReview": false,
			"style": 2,
			"residentId": "1c7ec0bd0100486db921e42b37daea18",
			"validText": "90～120",
			"axisMax": 200.00,
			"trendArrow": 0,
			"aimMax": "120.00/80.00",
			"trendCount": 0
		};
		/**
		 * 下拉刷新
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-14T12:00:12+0800
		 * @param  {[type]}                 type [description]
		 * @return {[type]}                      [description]
		 */
        $scope.doRefresh = function(type) {
            $rootScope.loading.show = false;
            $scope.pageNum = 0;
			$scope.pageSize = 30;
			$scope.monitorRecordScroll.scrollTop(true);
            $scope.getMonitorDatas(function(){
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        $scope.loadMore = function(){
        	if(!$scope.ismore){
        		return;
        	}
        	$scope.pageNum++;
        	$scope.getMonitorDatas(function(){
                $scope.$broadcast('scroll.refreshComplete');
            }, true);
        }

		$scope.$on('$ionicView.enter', function(){
			if($scope.isBack){
				$scope.isBack = false;
				return;
			}

			if(!$scope.device||($scope.device.suiteId != $rootScope.recordDevice.suiteId)){
				$scope.device = angular.copy($rootScope.recordDevice);
				$scope.getMonitorDatas();
			}

			if($scope.monitorIndexs.length){
				for (var i = 0, len = $scope.monitorIndexs.length; i < len; i++) {
					$scope.monitorIndexs[i].checked = false;
				}
			}else{	
				$scope.getMonitorIndexs();
			}
		});

		$scope.$on("$ionicView.beforeLeave", function(event, data){

		});
	
	}
	controller.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$modelView', '$timeout', '$API', '$dictionary', '$ionicLoading', '$ionicScrollDelegate'];

	ZcarezeApp.registerController('MonitorRecordCtrl', controller);
})