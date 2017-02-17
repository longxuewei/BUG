define([], function() {
	'use strict';

	function controller($scope, $rootScope, $state, $dictionary, $timeout, $API, $initModelView, $filter, $ionicLoading, user) {

		$scope.init = false;		      

		/**
		 * 绑定设备时选择框
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-21T13:28:53+0800
		 * @return {[type]}                 [description]
		 */
		$scope.bindNewDevice = function() {
			$scope.newDeviceModel = $rootScope.confirm({
				title: "选择绑定的设备",
				templateUrl: "view/settings/dialog/selectbinddevice.html",
				cssClass: "modelview",
				scope: $scope
			}, "custom");
		}
		$scope.CloseBindNewDevice = function() {
			$scope.newDeviceModel.close();
		}

		/**
		 * 初始化可用设备信息
		 * @type {Array}
		 */
		$scope.meterListBL = [];
		$scope.meterListZGB = [];
		$scope.queryMeterList = function() {
			$dictionary.queryTable("meter_list", function(data) {
				$scope.$apply(function() {
					$scope.meterListZGB = $filter('filter')(data, {
						signal_kind: 2
					});
					$scope.meterListBL = $filter('filter')(data, {
						signal_kind: 1
					});
				})
			});
		}

		/**
		 * 绑定设备等待上传数据
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-21T13:31:11+0800
		 * @param  {[type]}                 meter [description]
		 * @return {[type]}                       [description]
		 */
		$scope.wantBindDevice = null;
		$scope.isWantBindDevice = false;
		$scope.scanningDevice = false;
		$scope.bindDeviceType = null;

		$scope.bindDevice = function(meter, type) {
			var params = {
				"deviceType": "",
				"macAddress": "",
				"connectMode": ""
			};
			params.connectMode = type;
			params.deviceType = meter.signal_flag;
			$scope.bindDeviceType = type;
			$scope.wantBindDevice = meter;
			$scope.scanningDevice = true;
			if(type == "ZGB"){
				$scope.openWaitMoniterModel();
			}else if(type == "BLE"){
				/**
				 * meterCode
				 * @type {[type]}
				 */
				params.deviceType = meter.code;

				$scope.bluetoothModel = $rootScope.confirm({
					title: "选择附近蓝牙设备",
					templateUrl: "view/settings/dialog/bluetooth.html",
					cssClass: "modelview mini",
					scope: $scope
				}, "custom");
			}
			$scope.bindDeviceParams = JSON.stringify(params);
			$scope.onBindingStart($scope.bindDeviceParams);
		}
		$scope.onBindingStart = function(bindDeviceParams){
			try{
				$scope.isWantBindDevice = ZcarezeApp.Native.java('onBindingStart', bindDeviceParams, "SettingPresenter");
				console.log('启动设备监听成功');
			}catch(e){
				console.log('启动设备监听失败');
			}
		}

		/**
		 * 停止扫描
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-26T16:16:35+0800
		 * @param  {[type]}                 ){			$scope.monitorData [description]
		 * @return {[type]}                                          [description]
		 */
		ZcarezeApp.AddJsAPI('onScanningOver', function(){
			$scope.scanningDevice = false;
			$ionicLoading.hide();
		});


		/**
		 * 设备检测结果回调
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-21T16:10:17+0800
		 * @param  {[type]}                 data [description]
		 * @return {[type]}                      [description]
		 */
		$scope.monitorData = null;
		$scope.isMonitorDataCallDone = false;
		$scope.monitorDataCallDone = function(result) {
			console.log(result);
			if (!$scope.isWantBindDevice) {
				return;
			}
			$scope.isWantBindDevice = false;
			$scope.isMonitorDataCallFail = false;
			if (result) {
				$scope.monitorData = result.data;
				$scope.isMonitorDataCallDone = true;
				console.log('数据解析成功' + $scope.isMonitorDataCallDone);
			}
		}
		ZcarezeApp.AddJsAPI('onAnalysisDone', $scope.monitorDataCallDone);

		/**
		 * 数据解析失败
		 * @创建人员   杨英俊
		 * @创建时间   2016-12-01T15:39:54+0800
		 * @param  {[type]}                 error [description]
		 * @return {[type]}                       [description]
		 */
		$scope.isMonitorDataCallFail = false;
		$scope.monitorDataCallFail = function(message) {
			$ionicLoading.hide();
			if (!$scope.isWantBindDevice) {
				return;
			}
			$scope.isMonitorDataCallFail = true;
			console.log('数据解析失败');
		}
		ZcarezeApp.AddJsAPI('onAnalysisFail', $scope.monitorDataCallFail);

		/**
		 * 关闭 取消 绑定
		 * @创建人员 杨英俊
		 * @创建时间 2016-12-01T15:41:21+0800
		 */
		
		$scope.CloseBindDeviceModel = function() {
			ZcarezeApp.Native.java('onUnBindDevice', null, "SettingPresenter");
			ZcarezeApp.Native.java('stopScan', null, "SettingPresenter");
			$scope.monitorData = null;
			$scope.wantBindDevice = null;
			$scope.bindDeviceParams = null;
			$scope.isWantBindDevice = false;
			$scope.isMonitorDataCallDone = false;
			$scope.isMonitorDataCallFail = false;
			$scope.connectDeviceState = false;
			$scope.onPrepareFail = false;
			$scope.bluetoothDevice = [];
			$scope.bluetoothModel && $scope.bluetoothModel.close();
			$scope.bindDeviceModel && $scope.bindDeviceModel.close();
			$scope.bluetoothModel = null;
			$scope.bindDeviceModel = null;
			$rootScope.popup.show = true;
			$rootScope.loading.show = true;
			$scope.scanningDevice = false;
			$ionicLoading.hide();
		}

		/**
		 * 接收搜索到的蓝牙设备
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-21T15:28:00+0800
		 * @param  {[type]}                 devices [description]
		 * @return {[type]}                         [description]
		 */
		$scope.searched = false;
		$scope.bluetoothDevice = [];
		$scope.bluetoothSearch = function(devices) {
			$scope.searched = true;
			var repetition = false;
			for (var i = 0; i < $scope.bluetoothDevice.length; i++) {
				if(devices.data.macAddress == $scope.bluetoothDevice[i].macAddress){
					repetition = true;
					$scope.bluetoothDevice[i] = devices.data;
				}
			}
			if(!repetition){
				$scope.bluetoothDevice.push(devices.data);
			}
		}
		ZcarezeApp.AddJsAPI('onBTDeviceList', $scope.bluetoothSearch);

		/**
		 * 重新搜索蓝牙设备列表
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-21T15:29:19+0800
		 * @param  {[type]}                 devices [description]
		 * @return {[type]}                         [description]
		 */
		$scope.refreshBluetooth = function() {
			$scope.bluetoothDevice = [];
			$scope.bluetooth = null;
			$scope.searched = false;
			$scope.scanningDevice = true;
			$scope.onBindingStart($scope.bindDeviceParams);
		}

		/**
		 * 选中蓝牙设备
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-21T15:28:38+0800
		 * @param  {[type]}                 device [description]
		 * @return {[type]}                        [description]
		 */
		$scope.bluetooth = null;
		$scope.selectBluetooth = function(device) {
			$scope.bluetooth = device;
		}

		/**
		 * 连接设备
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-21T15:57:52+0800
		 * @return {[type]}                 [description]
		 */
		$scope.connectDeviceState = false;
		$scope.connectDevice = function() {
			$rootScope.loading.forbid = true;
			$ionicLoading.show({
				template: '<ion-spinner icon="spiral"></ion-spinner><div class="text-center">连接中</div>'
			}).then(function() {
				$scope.connectDeviceState = true;
				ZcarezeApp.Native.java('connectDevice', [$scope.bluetooth.macAddress, $scope.wantBindDevice.code], "SettingPresenter");
			});
		}

		/**
		 * 监听到蓝牙被关闭，取消当前任何操作，并且从新开启蓝牙
		 * @创建人员   杨英俊
		 * @创建时间   2016-12-23T17:57:30+0800
		 * @return {[type]}                 [description]
		 */
		$scope.bleOffLine = function(){
			$rootScope.alert({
                title: '提示!',
                template: '蓝牙已关闭，请选择开启蓝牙后再尝试绑定。',
                buttons:[
	                {
	                    text:"开启蓝牙",
	                    type: 'button-calm',
	                    onTap:function (e) {
	                    	$scope.CloseBindDeviceModel();
	    					ZcarezeApp.Native.java('openBLE', null, "SettingPresenter");
	                    }
	                }
                ]
            });
		}
		ZcarezeApp.AddJsAPI('onBleOffLine', $scope.bleOffLine);

		/**
		 * 打开 设备检测页面
		 * @创建人员   杨英俊
		 * @创建时间   2016-12-01T17:01:37+0800
		 * @return {[type]}                 [description]
		 */
		$scope.openWaitMoniterModel = function(){
			$scope.monitorData = null;
			$scope.bindDeviceModel = $rootScope.confirm({
				title: "等待上传数据",
				templateUrl: "view/settings/dialog/binddevice.html",
				cssClass: "modelview header-none ",
				scope: $scope
			}, "custom");
		}

		/**
		 * 连接蓝牙设备成功
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-26T15:29:21+0800
		 * @return {[type]}                 [description]
		 */
		$scope.onBTOnLine = function(){
			$rootScope.loading.forbid = false;
			$ionicLoading.hide();
			// $scope.bindDevice($scope.bluetooth, 'BLE');
			$scope.openWaitMoniterModel();
			console.log('连接蓝牙设备成功');
		}
		ZcarezeApp.AddJsAPI('onBTOnLine', $scope.onBTOnLine);

		/**
		 * 连接蓝牙设备失败
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-26T15:32:14+0800
		 * @return {[type]}                 [description]
		 */
		$scope.onBTOffLine = function(message){
			if($scope.isMonitorDataCallDone || !$scope.wantBindDevice){
				return;
			}
			$rootScope.loading.forbid = false;
			$ionicLoading.hide();
			$scope.bindDeviceModel && $scope.bindDeviceModel.close();
			$rootScope.alert({
                title: '提示!',
                template: '连接设备“'+$scope.bluetooth.bleName+'”失败，请重新选择设备。',
                buttons:[
	                  {
	                    text:"重新选择",
	                    type: 'button-calm',
	                    onTap:function (e) {
	    					$scope.refreshBluetooth();
	                    }
	                  }
                ]
            });
            console.log('连接蓝牙设备失败');
		}
		ZcarezeApp.AddJsAPI('onBTOffLine', $scope.onBTOffLine);

		/**
		 * 确定绑定数据
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-21T18:37:54+0800
		 * @param  {[type]}                 meter [description]
		 * @param  {[type]}                 type  [description]
		 * @return {[type]}                       [description]
		 */
		$scope.onPrepareFail = true;
		$scope.affirmBind = function() {
			if (ZcarezeApp.Native.java('bindDevice', JSON.stringify({
				"macAddress": $scope.bindDeviceType == 'ZGB' ? $scope.monitorData.deviceMac : $scope.bluetooth.macAddress,
				"connectMode": $scope.bindDeviceType == 'ZGB' ? 2 : 1,
				"deviceType": $scope.wantBindDevice.code
			}), "SettingPresenter")) {
				$dictionary.meterSuiteId($scope.wantBindDevice.code, function(datas){
					$scope.$apply(function(){
						for (var i = datas.length - 1; i >= 0; i--) {
							$rootScope.devices[$rootScope.deviceBaseInfo[datas[i].suiteId].index].isBinded = 1;
						}
						$rootScope.initDevices();
						$scope.getBindDevices();
					})
				});
				$scope.onPrepareFail = true;
				$scope.CloseBindNewDevice();
				$scope.CloseBindDeviceModel();
			} else {
				$scope.onPrepareFail = false;
			}
		}

		/**
		 * 取消绑定
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-21T18:43:25+0800
		 * @return {[type]}                 [description]
		 */
		$scope.cancelBind = function() {
			$scope.CloseBindDeviceModel();
		}

		$scope.bindDevices = [];
		$scope.getBindDevices = function() {
			$rootScope.getConnetedDevice(function(){
				$dictionary.querySQL("SELECT * FROM meter_list as ml WHERE ml.code in ('" +$rootScope.bindedMeterCodes.join("','") +"')", 
				function(data) {
					$scope.$apply(function(){
						$scope.bindDevices = data;
					})
				}, function(result) {
					if (result.code == 5) {
						self.createMonitorTable(function() {
							callback && callback([]);
						});
					}
				});
			});
		}

		var EasterEggTime = null;
		$scope.EasterEggNum = 0;
		$scope.EasterEgg = function(){
			if(EasterEggTime){
				$scope.EasterEggNum++;
				if($scope.EasterEggNum >= 3){
					$rootScope.$minialert.show('连续点击9次（'+$scope.EasterEggNum+'）, 退出主屏幕', false, true, 3000);
				}
				if($scope.EasterEggNum > 9){
					$scope.EasterEggNum = 0;
					$rootScope.$minialert.close();
					EasterEggTime && $timeout.cancel(EasterEggTime);
					EasterEggTime = null;
					ZcarezeApp.Native.java("goBack", null);
				}
				return;
			}else{
				EasterEggTime = $timeout(function(){
					$scope.EasterEggNum = 0;
					EasterEggTime = null;
					$rootScope.$minialert.close();
				}, 3000);
			}
		}

		$scope.$model = $initModelView.init($scope, {
			class: "mini"
		});

		$scope.$on('$ionicView.enter', function() {
			if (!$scope.init) {
				$scope.init = true;
				$scope.queryMeterList();
				$scope.getBindDevices();
			}
		});

		$scope.$on("$ionicView.beforeLeave", function(event, data) {

		});

	}
	controller.$inject = ['$scope', '$rootScope', '$state', '$dictionary', '$timeout', '$API', '$initModelView', '$filter', '$ionicLoading'];

	ZcarezeApp.registerController('SettingsCtrl', controller);
})