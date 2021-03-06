define([], function(){
	'use strict';

	// window.Swiper = Swiper;

	function controller($scope, $rootScope, $state, $ionicScrollDelegate, $modelView, $timeout, $API, $dictionary, $filter, $text2voice) {

		$rootScope.homeInit = false;

		$scope.deviceCardWidth = 0;

		$scope.currentDevice = {};

		$scope.monitoringScroll = $ionicScrollDelegate.$getByHandle('monitoringScroll');

		$scope.initDevice = function(){
			$dictionary.querySQL(
				("SELECT "+
					['m.id','m.c_name as name','m.comment',
					'm.unit','m.abbr','m.value_type',
					'm.over_min','m.over_max',
					'm.value_list','m.def_result',
					'm.exempt','m.special','m.axis_min',
					'm.axis_max','m.may_chart','i.seq_no',
					'i.suite_id','i.item_id'].join(',')+
					" FROM "+
					"monitor_items m "+
					"LEFT JOIN "+
					"(SELECT item_id,suite_id,seq_no FROM monitor_suite_items WHERE suite_id in ('"+$rootScope.suiteIds.join("','")+"')) i "+
					"on m.id = i.item_id "),
				function (data) {
	                $scope.$apply(function () {
	                	for (var i = 0, len = $rootScope.devices.length; i < len; i++) {
	                		var items = $filter('filter')(data, {suite_id:$rootScope.devices[i].suiteId||""});
	                		if(items.length){
	                			$rootScope.devices[i].items = items;
	                		}
	                	}
	                });
	            });
			$dictionary.querySQL(
				("SELECT "+
					['id as suiteId', 'metered'].join(',')+
					" FROM monitor_suites"),
				function (data) {
					$rootScope.getConnetedDevice(function(){
						$scope.$apply(function () {
		                	for (var i = 0, len = $rootScope.devices.length; i < len; i++) {
		                		var items = $filter('filter')(data, {suiteId:$rootScope.devices[i].suiteId||""});
		                		if(items.length){
		                			$rootScope.devices[i].metered = items[0].metered;
		                		}
		                	}
		                });
					});
	            });
		}


		$scope.getPageData = function(isOnline){
			if(isOnline){
				var suiteIds = [];
				for (var i = 0; i < $rootScope.devices.length; i++) {
					suiteIds.push($rootScope.devices[i].suiteId);
				}
				$rootScope.loading.show = false;
				$API.ResidentService.getResidentMonitorBysuiteIdRsId({
					residentId: $rootScope.user.id,
					suiteIds: suiteIds
				}).then(function(result){
					if(result.code == 1){
						for (var i = 0; i < $rootScope.devices.length; i++) {
							if(result.map[$rootScope.devices[i].suiteId]){
								$rootScope.devices[i].orderTaskSplit=result.map[$rootScope.devices[i].suiteId].orderTaskSplit;
								$rootScope.devices[i].rsdtMonitorDetails=result.map[$rootScope.devices[i].suiteId].rsdtMonitorDetails;
							}
						}
					}
				}).fail(function(){

				});
			}else{
				for (var i = 0; i < $rootScope.devices.length; i++) {
					$rootScope.devices[i].orderTaskSplit=null;
					$rootScope.devices[i].rsdtMonitorDetails=[];
				}
			}
		}
		$rootScope.ListenNetWork($scope.getPageData);

		/**
		 * 获取本地 离线检测数据，递归调用上传
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-30T11:22:29+0800
		 * @return {[type]}                 [description]
		 */
	    $scope.synchronizationMoniterData = function(isOnline, length){
	      if(isOnline){
	      	// isOnline && $scope.addMonitorDatas();
	      	$dictionary.offLineMonitorData(length||30, function(data){
	      		
	      		for (var i = 0; i < data.length; i++) {
	      			data[i].rsdtMonitor = angular.fromJson(data[i].rsdtMonitor);
	      		}
	      		$scope.addMonitorDatas(data, function(){
	      			if(data.length == 30){
	      				$scope.synchronizationMoniterData(true);
	      			}
	      		}, function(){

	      		}, true);
	      	}, function(){
	      		console.log('查询离线检测数据出错！');
	      	});
	      }
	    }
	    $rootScope.ListenNetWork($scope.synchronizationMoniterData);
	    
	    /**
	     * 向服务器添加数据
	     * @创建人员  杨英俊
	     * @创建时间  2016-11-30T11:34:20+0800
	     * @param {[type]}                 monitorDatas [description]
	     * @param {[type]}                 handler      [description]
	     */
	    $scope.addMonitorDatas = function(monitorDatas, handler, error, multiterm){
	    	var monitorData = [];
	    	for (var i = 0; i < monitorDatas.length; i++) {
	    		monitorData.push(monitorDatas[i].rsdtMonitor);
	    	}
	    	console.log(monitorData);
	    	monitorData.length && 
	    	($rootScope.loading.forbid = true) && 
	    	$API.ResidentHealthService.addBatchRsdtMonitor({
				rsdtMonitorListParam:{
					lists: monitorData 
				}
			}).then(function(result){
				$rootScope.loading.forbid = true
				if(result.code == 1){
					if(!multiterm){
						handler && handler(result);
					}
					$dictionary.updateMonitorData(monitorDatas, function(){
						if(multiterm){
							handler && handler(result);
						}
					});
				}
			}).fail(function(){
				$rootScope.loading.forbid = true
				error && error();
			});
	    }

		/**
		 * 打开仪器操作说明框
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-21T17:48:20+0800
		 * @param  {[type]}                 item [description]
		 * @return {[type]}                      [description]
		 */
		$scope.currentDevice = null;
		$scope.openDeviceModel = function(item){
			$scope.currentDevice = item;

			!$scope.currentDevice.modeinfo ? 
			$dictionary.querySQL(
				("SELECT "+
					['suite_id as suiteId','mm.meter_code as meterCode','title','abbr','operation','attention','diagram'].join(',')+
					" FROM meter_modes mm WHERE suite_id='"+$scope.currentDevice.suiteId+"'"),
				function (data) {
					$scope.$apply(function () {
						if(data.length){
							$scope.currentDevice.modeinfo = data[0];
	                		$scope.attentionModel();
						}else{
							$rootScope.confirm({
								title: "提示",
								template: "<div class='text-center'>未查询到相关监测模式。</div>",
								cssClass: "alert",
								scope: $scope,
								buttons: [
					                {
					                  	text: '关闭'
					                }
					            ]
							});
						}
	                });
	        }):
			$scope.attentionModel();
		}
		$scope.attentionModel = function(){
			$scope.devicerModel = $rootScope.confirm({
                title: $scope.currentDevice.modeinfo.title,
                templateUrl: 'view/home/modeldevice.html',
                cssClass: $scope.currentDevice.color,
                scope: $scope
            }, "custom");
		}
		$scope.closeDeviceModel = function(){
			$scope.devicerModel.close();
			$scope.voiceClose();
		}
		
		/**
		 * 移动到当前检测指标的窗口
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-23T14:18:53+0800
		 * @param  {[type]}                 device [description]
		 * @return {[type]}                 [description]
		 */
		$scope.moveDeviceCard = function(device){
			var index = $rootScope.deviceBaseInfo[device].index, 
				moveval = index * ($scope.deviceCardWidth+15), 
				left = moveval - ($scope.monitoringScroll.getScrollPosition()).left - 15;
			
				if(left <= ($scope.deviceCardWidth+15)*2 && left > 0){
				}else{
					if((left - ($scope.deviceCardWidth+15)*2) < $scope.deviceCardWidth && left > 0){
						moveval = moveval - ($scope.deviceCardWidth+15)*2;
					}
					$scope.monitoringScroll.scrollTo(moveval, 0 , true);
				}
		}

		/**
		 * 20秒后自动保存
		 * @创建人员   杨英俊
		 * @创建时间   2016-12-27T16:33:17+0800
		 * @return {[type]}                 [description]
		 */
		$scope.count = $rootScope.autoSaveMonitorDataTime;
		var timeout = null;
		$scope.timedCount = function() {
			$scope.count--;
			if($scope.count == 0 && $scope.monitorData){
				$timeout.cancel(timeout);
				$scope.saveMonitorData();
				$scope.count = 20;
			}
	        timeout = $timeout($scope.timedCount, 1000);
	    }
	    $scope.timedCountRestart = function(){
	    	timeout && $timeout.cancel(timeout) && (timeout = null, $scope.count = 20);
	    	$scope.timedCount();
	    }
	    $scope.timedCountClose = function(){
	    	timeout && $timeout.cancel(timeout) && (timeout = null, $scope.count = 20);
	    }

		
		/**
		 * 检测数据框
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-21T17:48:53+0800
		 * @param  {[type]}                 monitorData [description]
		 * @return {[type]}                             [description]
		 */
		$scope.monitorModel = null;
		$scope.openMonitorModel = function(monitorData, isHandle){

			/**
			 * 能否打开监测框
			 * @创建人员   杨英俊
			 * @创建时间   2017-01-10T10:07:25+0800
			 * @param  {[type]}  [description]
			 * @return {[type]}  [description]
			 */
			if(!$rootScope.allowMonitor){
				return;
			}

			/**
			 * 移动色块位置
			 */
			$scope.moveDeviceCard(monitorData.data.suiteId);

			/**
			 * 判断当前监测组是否已经被打开，如果打开就不在打开，如果是新的检测组结果，就重新打开
			 * @创建人员   杨英俊
			 * @创建时间   2017-01-10T10:08:00+0800
			 * @param  {[type]} [description]
			 * @return {[type]} [description]
			 */
			if($scope.monitorData && monitorData.data.suiteId != $scope.monitorData.suiteId){
				$scope.closeMonitorModel();
				$scope.timedCountClose();
				$scope.isSaveBtnDisabled = true;
				console.log('打开窗口')
			}else{
				if($scope.monitorData){
					$scope.monitorData = monitorData.data;
					$scope.isSaveBtnDisabled = false;
					$scope.timedCountRestart();
					return;
				}
			}
			$scope.monitorData = monitorData.data;
			$timeout(function(){
				if(!isHandle){
					$scope.monitorModel = $rootScope.confirm({
		                title: $scope.monitorData.title,
		                templateUrl: 'view/home/modelmonitor.html',
		                cssClass: $rootScope.deviceBaseInfo[$scope.monitorData.suiteId].color,
		                scope: $scope
		            }, "custom");

					/**
					 * 语音播放
					 * @创建人员   杨英俊
					 * @创建时间   2017-02-16T19:19:46+0800
					 * @param  {[type]}                 300   [description]
					 * @return {[type]}                       [description]
					 */
		            $timeout(function(){
		            	$text2voice.speak({
							texts: [monitorData.hint]
						});	
		            }, 300);
				}
	            $timeout(function(){
	            	$scope.isSaveBtnDisabled = false;
	        		!$scope.isHandimport && $scope.timedCountRestart();
	            }, 250);
			}, 250);
		}

		/**
		 * 关闭监测弹出框
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-15T14:31:20+0800
		 * @return {[type]}                 [description]
		 */
		$scope.closeMonitorModel = function(){
			$scope.monitorModel && $scope.monitorModel.close();
		    $scope.isSaveBtnDisabled = true;
			$scope.timedCountClose();
			// $timeout(function(){
				$scope.handInDeviceModel = {};
				$scope.monitorModel = null;
				$scope.monitorData = null;
				$scope.isHandimport = false;
			// },50);
		}

		/**
		 * 保存检测数据
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-23T10:59:51+0800
		 * @return {[type]}                 [description]
		 */
		$scope.isSaveBtnDisabled = true;
		$scope.saveMonitorData = function(){

			$scope.timedCountClose();

			var insertData = [];
			var acceptTime = moment().format('YYYY-MM-DD HH:mm:ss');
			var monitorId = Math.MD5(moment().format('x')+$rootScope.user.id).toString();

			var lastMonitorData = {
	                "residentId": $rootScope.user.id,
	                "suiteId": $scope.monitorData.suiteId,
	                "monitorData": $scope.monitorData,
	                "acceptTime": acceptTime,
				};
			var insertDataItem = {
					"data":[]
				};

			for (var i = 0; i < $scope.monitorData.rsdtMonitorList.detailList.length; i++) {
				var item = $scope.monitorData.values[i];
				var detail = $scope.monitorData.rsdtMonitorList.detailList[i];
				insertDataItem.data.push({
					"monitorId": monitorId,
	                "residentId": $rootScope.user.id,
	                "suiteId": $scope.monitorData.suiteId,
	                "value": item.value,
	                "reference": detail.validText||"",
	                "remark": "",
	                "unit": detail.itemUnit,
	                "hint": detail.caution,
	                "arrow": detail.arrow||0,
	                "name": detail.itemName,
	                "part": $scope.monitorData.currentParts||"",
	                "seqNo": "",
	                "source": $scope.isHandimport ? 2 : 1,
	                "subtitle": $scope.monitorData.title,
	                "deviceMac": $scope.monitorData.deviceMac,
	                "meterCode": $scope.monitorData.deviceType,
	                "acceptTime": acceptTime
				});
			}

	        insertDataItem.monitor = {
	        	"monitorId": monitorId,
				"residentId": $rootScope.user.id,
				"acceptTime": acceptTime,
	        	"rsdtMonitor": $scope.monitorData.rsdtMonitorList
	        };
			insertData.push(insertDataItem);

			// $dictionary.dropTable('rsdt_monitor_list', function(){
			// $dictionary.dropTable('wait_upload_monitor_data', function(){
			
			$dictionary.insertMonitorData(insertData, function(){
				localStorage.setItem(Math.MD5($rootScope.user.id + 
					$scope.monitorData.suiteId).toString(),
				JSON.stringify(lastMonitorData));
				var index = $rootScope.deviceBaseInfo[$scope.monitorData.suiteId].index;
					$rootScope.devices[index].values = lastMonitorData.monitorData.values;
					$rootScope.devices[index].acceptTime = lastMonitorData.acceptTime;
				$rootScope.network && $scope.addMonitorDatas([insertDataItem.monitor], function(result){
					if(result.map){
						$rootScope.devices[index].orderTaskSplit = result.map[lastMonitorData.suiteId].orderTaskSplit;
						$rootScope.devices[index].rsdtMonitorDetails = result.map[lastMonitorData.suiteId].rsdtMonitorDetails;
					}
				})
				$scope.closeMonitorModel();
			}, function(error){
				$scope.insertMonitorModel = $rootScope.confirm({
					title: "错误",
					template: "<div class='text-center'>存储失败，请尝试重新保存。</div>",
					cssClass: "alert",
					scope: $scope,
					buttons: [
		                {
		                  	text: '关闭'
		                }
		            ]
				});
			});
			// });
			// });
		}


		/**
		 * 选择部位
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-15T14:31:53+0800
		 * @param  {[type]}                 item [description]
		 * @return {[type]}                      [description]
		 */
		$scope.selectTimes = function(item){
			var monitorData = angular.copy($scope.monitorData), result = {}, part = $scope.monitorData.currentParts+'';
			monitorData.rsdtMonitorList = null;
			monitorData.currentParts = item;
			$scope.monitorData.currentParts = item;
			try{
				result = ZcarezeApp.Native.java("onPartChanged", JSON.stringify(angular.copy(monitorData)));
				$scope.timedCountRestart();
				if(result && result.data){
					$scope.monitorData = result.data;
				}else{
					$scope.monitorData.currentParts = part;
				}
			}catch(e){
				$scope.monitorData.currentParts = part;
			}
		}

		/**
		 * 进入监测详情页面
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-15T14:43:17+0800
		 * @param  {[type]}                 device [description]
		 * @param  {[type]}                 event  [description]
		 * @return {[type]}                        [description]
		 */
		$rootScope.recordDevice = null;
		$scope.monitorRecord = function(device, event){
			$rootScope.recordDevice = device;
			$state.go("app.home-monitorrecord");
		}

		/**
		 * 手动输入 监测数据
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-18T16:47:00+0800
		 * @return {[type]}                 [description]
		 */
		// //收缩压
		// $scope.sbpList = [];
		// for (var i = 50; i <= 230; i++) {
		// 	$scope.sbpList.push(i);
		// }
		// //舒张压
		// $scope.dbpList = [];
		// for (var i = 30; i <= 120; i++) {
		// 	$scope.dbpList.push(i);
		// }

		// var swiperOption = {
		// 	        effect: 'coverflow',
		// 	        direction: 'vertical',
		// 	        grabCursor: true,
		// 	        centeredSlides: true,
		// 	        slidesPerView: 'auto',
		// 	        initialSlide: 1, //初始化位置
		// 	        touchRatio: 2,
		// 	        coverflow: {
		// 			  rotate: 0,
		// 			  stretch: 0,
		// 			  depth: 200,
		// 			  modifier: 2,
		// 			  slideShadows : false
		// 			}
		// 	    };
		$scope.handInDeviceModel = {};
		$scope.isHandimport = false;
		$scope.handimport = function(device){
			$scope.handInDevice = null;
			
			$scope.handInDevice = device;
			// $scope.handimportModel = $rootScope.confirm({
			// 	templateUrl: "view/home/handimport.html",
			// 	cssClass: "header-none " + ,
			// 	scope: $scope
			// }, "custom");
			$scope.isHandimport = true;
			$scope.monitorModel = $rootScope.confirm({
                title: '手动输入',
                templateUrl: 'view/home/modelmonitor.html',
                cssClass: device.color,
                scope: $scope
            }, "custom");

			// $timeout(function(){
			// 	var sbpSwiper = new Swiper('#sbpSwiper', swiperOption);
			// 	var dbpSwiper = new Swiper('#dbpSwiper', swiperOption);
			//  	// swiper.on('sliderMove', function (swiper) {
			//  	//    console.log(swiper);
			// 	// });
			// }, 10);
		}
		$scope.handimportBtn = function(isSave){
			if(isSave){
				var result = ZcarezeApp.Native.java("inputMonitorData", angular.toJson({
					monitorData: $scope.handInDeviceModel,
					suiteId: $scope.handInDevice.suiteId,
					monitorPart: ""
				}));
				$scope.openMonitorModel({data:result}, true);
			}else{
				$scope.closeMonitorModel();
			}
		}

		/**
		 * 分解句子
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-29T13:48:54+0800
		 * @return {[type]}                 [description]
		 */
		$scope.getSent = function(text){
			return text.split(/\n/g);
		}

		/**
		 * 朗读内容
		 * @创建人员   杨英俊
		 * @创建时间   2016-12-27T14:59:19+0800
		 * @param  {[type]}                 monitor [description]
		 * @return {[type]}                         [description]
		 */
		$scope.voice = null;
		$scope.loadingVoice = false; 
		$scope.text2voice = function(monitor){
			var texts = [];
			if(monitor.operation){
				texts.push('操作说明');
				var  operations = $scope.getSent(monitor.operation);
				for (var i = 0; i < operations.length; i++) {
					texts.push(operations[i]);
				}
			}
			if(monitor.attention){
				texts.push('注意事项');
				var  attentions = $scope.getSent(monitor.attention);
				for (var i = 0; i < attentions.length; i++) {
					texts.push(attentions[i]);
				}
			}
			$text2voice.speak({
				texts: texts
			});
		}
		$scope.voiceClose = function(){
			$scope.voice && $scope.voice.close();
			$scope.voice = null;
		}

		// $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
		//   $scope.slider = data.slider;
		// });

		/**
		 * 首页底部菜单
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-15T14:42:57+0800
		 * @param  {[type]}                 state [description]
		 * @return {[type]}                       [description]
		 */
		$scope.homeMenu = function(state){
			state && $state.go(state);
		}

		/**
		 * 绑定设备检测事件
		 */
		ZcarezeApp.AddJsAPI('DeviceMonitor', $scope.openMonitorModel);

		$scope.$on('$ionicView.enter', function(){

			if(!$rootScope.updateApp && !$rootScope.initDictionary && !$rootScope.loaddingDictionary){
				$rootScope.$dictionary();
			}

			$rootScope.monitorRecordDevice = null;
			$rootScope.allowMonitor = true;
			if(!$rootScope.homeInit){
				$rootScope.homeInit = true;
				$scope.initDevice();
				$scope.getPageData(true);
			}
			$timeout(function(){
				$scope.deviceCardWidth = document.getElementsByClassName('monitor-item')[0].offsetWidth;
				$scope.synchronizationMoniterData(true);
			},100);
		});

		$scope.$on("$ionicView.beforeLeave", function(event, data){
			$text2voice.stop();
		});
	
	}
	controller.$inject = ['$scope', '$rootScope', '$state', '$ionicScrollDelegate', '$modelView', '$timeout', '$API', '$dictionary', '$filter', '$text2voice'];

	ZcarezeApp.registerController('HomeCtrl', controller);
})