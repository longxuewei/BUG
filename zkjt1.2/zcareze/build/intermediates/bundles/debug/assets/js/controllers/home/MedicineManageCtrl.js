define([], function() {
	'use strict';

	function controller($scope, $rootScope, $state, $ionicSlideBoxDelegate, $initModelView, $modelView, $timeout, $API, $dictionary, $ionicScrollDelegate, $ionicPopup, $filter) {


		/*
		 * 获取居民我的药箱数据列表
		 */
		var nowId = $rootScope.user.id;
		$scope.medNameList = [{
			usage: null
		}]
		$scope.getRsdtMedicineChestList = function(fn) {
			$API.HealthOrderService.getRsdtMedicineChestListByResidentId({
				//ResidentId:$rootScope.user.id
			}).then(function(result) {
				if (result.code == 1) {
					$scope.RsdtMedicineChestList = result.lists;
				}
				fn && fn();
			}).fail(function(error) {
				console.log(error.message);
				fn && fn();
			})
		}

		/*
		 * 添加居民个人用药
		 */
		$scope.changeWayCode = function() {
			for (var i = 0; i < $scope.eadData.length; i++) {
				if ($scope.eadData[i].code == $scope.med.wayCode) {
					$scope.med.wayCode = $scope.eadData[i].code;
					$scope.med.wayName = $scope.eadData[i].name;
					break;
				}
			}
		}

		/*
		 * 删除个人用药
		 */
		$scope.delResidentPersonalMedication = function(data) {

			var confirmPopup = $ionicPopup.confirm({
				title: '温馨提醒',
				template: '<div>确定要删除 <span class="red spd_auto">' + data.taskTopic + '</span>吗?</div>',
				buttons: [{
					text: '确定',
					type: 'button-assertive',
					onTap: function(e) {
						$API.HealthOrderService.delResidentPersonalMedication({
							taskId: data.taskId
								//ResidentId:$rootScope.user.id
						}).then(function(result) {
							if (result.code == 1) {
								$scope.onItemDelete(data);
							}
						}).fail(function(error) {
							console.log(error.message);
							return;
						})
					}
				}, {
					text: '取消',
					type: 'isCancle'
				}]

			});
		}
		/*
		 * 获取
		 */
		$scope.changeFreqcode = function() {
			for (var i = 0; i < $scope.useWayList.length; i++) {
				if ($scope.useWayList[i].code == $scope.med.freqCode) {
					$scope.med.freqCode = $scope.useWayList[i].code;
					$scope.med.freqName = $scope.useWayList[i].cName;
					break;
				}
			}
		}

		$scope.addResidentPersonalMedication = function(fn) {
			$API.HealthOrderService.addResidentPersonalMedication({
				rsdtOrdMedRecipeParam: {
					beginTime: $filter('date')($scope.med.beginTime, 'YYYY-MM-DD'),
					freqCode: $scope.med.freqCode,
					freqName: $scope.med.freqName,
					medName: $scope.seacher.value,
					perCount: $scope.med.perCount,
					unit: $scope.medNameList[0].usage,
					wayCode: $scope.med.wayCode,
					wayName: $scope.med.wayName
				}
				//ResidentId:$rootScope.user.id
			}).then(function(result) {
				if (result.code == 1) {
					$scope.getRsdtMedicineChestList();
					$scope.doRefresh();
				}

			}).fail(function(error) {
				console.log(error.message);
			})
			fn && fn();
		}

		var arrMedBook = [];
		//用药日记数据
		$scope.medbookChecked = function(data) {
			if (data.useMedicate == 0) {
				data.useMedicate = 1;
			} else {
				data.useMedicate = 0;
				data.reactions = '';
			}
			if (arrMedBook.indexOf(data) > -1) {
				arrMedBook.splice(arrMedBook.indexOf(data), 1);

			} else {
				data.medicineName = data.taskTopic;
				arrMedBook.push(data)
			}
		}

		/*
		 * 获取居民用药日记列表
		 */

		$scope.arrLazy = [];
		$scope.isloadStatus = false; //是否加载完成的状态
		$scope.isEnded = false; //是否没有更多数据的状态

		$scope.getRsdtMedicateList = function(startDate, endDate, handle) {
			$API.HealthOrderService.getRsdtMedicateListByResidentId({
				startDate: $filter('date')(startDate, 'YYYY-MM-DD'),
				endDate: $filter('date')(endDate, 'YYYY-MM-DD')
					//ResidentId:$rootScope.user.id
			}).then(function(result) {
				if (result.code == 1) {

					$scope.RsdtMedicateList = result.lists;
					if (handle) {
						if (result.lists.length) {
							$scope.arrLazy.push($scope.RsdtMedicateList);
						}
					} else {
						$scope.arrLazy = [];
						if (result.lists.length) {
							$scope.arrLazy.push($scope.RsdtMedicateList);
							$scope.arrLazy[0][0].checked = true;
						}

					}
					if (result.lists.length < 7) {
						$scope.hasmore = false;
					}

					$scope.isloadStatus = true;

				}
				handle && handle();
			}).fail(function(error) {
				handle && handle();
				console.log(error.message);
			})
		}

		/**
		 * 保存用药日记
		 * @创建人员   杨英俊
		 * @创建时间   2017-01-10T16:55:44+0800
		 * @param  {[type]}                 useMedbookData [description]
		 * @return {[type]}                                [description]
		 */
		$scope.saveRsdtMedicateList = function(useMedbookData, itemModleName) {

			var medDatas = []
			for (var i = 0; i < useMedbookData.rsdtMedicateList.length; i++) {
				var temp = useMedbookData.rsdtMedicateList[i];
				medDatas.push({
					cycleNo: temp.cycleNo,
					medicineName: temp.taskTopic,
					perCount: temp.perCount,
					reactions: temp.useMedicate ? (temp.reactions||"") : "",
					taskId: temp.taskId,
					timeNo: temp.timeNo,
					unit: temp.unit,
					useMedicate: temp.useMedicate
				})
			}

			$API.HealthOrderService.saveRsdtMedicateList({
				rsdtMedicateListParam: {
					planTime: moment(useMedbookData.planTime).format('YYYY-MM-DD'),
					lists: medDatas
				}
			}).then(function(result) {
				if (result.code == 1) {
					$scope.useMedbookDataBack.rsdtMedicateList = result.one.rsdtMedicateList;
					var useMedicates = 0;
					var reactions = 0;
					for(var i = result.one.rsdtMedicateList.length-1; i--; i >= 0){
						if(result.one.rsdtMedicateList[i].useMedicate){
							useMedicates++;
						}
						if(result.one.rsdtMedicateList[i].reactions){
							reactions++;
						}
					}
					$scope.useMedbookDataBack.completeCount = useMedicates;
					$scope.useMedbookDataBack.reactionCount = reactions;
					$scope[itemModleName].close();
				}
			}).fail(function(error) {
				console.log(error.message);
			})
		}


		//弹出框添加个人用药
		$scope.addSigngleMed = function() {
			var model = {
				title: "添加个人用药",
				templateUrl: "view/home/dialog/addSigngleMed.html",
				cssClass: "bg3 mini add_med_dialog custom",
				scope: $scope
			};

			$scope.closeAddSigngleMed = $rootScope.confirm(model, "custom");
		}

		//选着药物
		$scope.chorceMed = function() {
			var model = {
				title: "请选择药名",
				templateUrl: "view/home/dialog/chorceMed.html",
				cssClass: "bg3 mini add_med_dialog custom",
				scope: $scope
			};
			$scope.closeChorceMed = $rootScope.confirm(model, "custom");
		}


		//弹出框用药日记
		$scope.useMedbookDataBack = null;
		$scope.userMedBook = function(data) {

			var model = {
				title: "用药日记",
				templateUrl: "view/home/dialog/useMedBook.html",
				cssClass: "bg4",
				scope: $scope
			};
			$scope.useMedbookDataBack = data;
			$scope.useMedbookData = angular.copy(data);
			$scope.closeUseMedBook = $rootScope.confirm(model, "custom");
		}


		$scope.contentRize = function() {
			$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
		}

		$scope.onItemDelete = function(data) {

			$scope.RsdtMedicineChestList.splice($scope.RsdtMedicineChestList.indexOf(data), 1); //splice?
			$scope.doRefresh();

		};



		$scope.selectIndexs = [];
		$scope.selectItem = function(item) {
			var i = $scope.selectIndexs.indexOf(item.id);
			if (i > -1) {
				$scope.selectIndexs.splice(i, 1);
			} else {
				$scope.selectIndexs.push(item.id);
			}
		}
		$scope.isSelectView = function(item) {
			return $scope.selectIndexs[item.id] ? true : false;
		}

		var dataTime1 = new Date();
		var dataTime2 = new Date();
		dataTime2.setDate(dataTime2.getDate() - 6);
		$scope.startDate = dataTime2;
		$scope.endDate = dataTime1;
		$scope.hasmore = true;
		//下拉刷新
		$scope.doRefresh = function(type) {
			$rootScope.loading.show = false;
			//$scope.arrLazy=[];
			dataTime1 = new Date();
			$scope.endDate = dataTime1;
			dataTime2 = new Date();
			dataTime2.setDate(dataTime2.getDate() - 6);
			$scope.startDate = dataTime2;
			$scope.endDate = dataTime1;
			$scope.getRsdtMedicateList($scope.startDate, $scope.endDate);
			$scope.$broadcast('scroll.refreshComplete');

		};
		//药箱数据的下拉刷新
		$scope.doRefreshMedBook = function(type) {
			$rootScope.loading.show = false;

			$scope.getRsdtMedicineChestList(function() {
				//$scope.doRefreshMedBook();
				$scope.$broadcast('scroll.refreshComplete');
			})
		};

		//上拉加载更多
		$scope.hasmore = true;
		$scope.loadMore = function() {
			dataTime1.setDate($scope.endDate.getDate() - 7);
			dataTime2.setDate($scope.startDate.getDate() - 7);
			$scope.endDate = dataTime1;
			$scope.startDate = dataTime2;
			$scope.getRsdtMedicateList($scope.startDate, $scope.endDate, function() {
					$scope.$broadcast('scroll.infiniteScrollComplete');
				})
				//这里使用定时器是为了缓存一下加载过程，防止加载过快

		}

		$scope.items = [];

		$scope.medToggle = function(data) {
			data.checked = !data.checked;
		}

		//用法用量数据
		$scope.useWay = function() {
				$dictionary.querySQL(
					("SELECT c_name as cName,freList.kind kind,code FROM frequency_list as freList where freList.kind='1'"), //
					function(data) {
						$scope.$apply(function() {
							$scope.useWayList = data;
						});
					});
			}
			//服用方法
		$scope.eatWay = function() {
			$dictionary.querySQL(
				("SELECT name,code" + " FROM " + "med_way as medWay"), //name
				function(data) {
					$scope.$apply(function() {
						$scope.eadData = data;
						console.log(data);
					});
				});
		}


		/*
		 * 选择药品
		 */

		$scope.activeMed = {};
		$scope.chorcedMedName = function(data) {
			$scope.activeMed = data;
			$scope.seacher.value = data.name;

			$scope.contentRize();
		}

		//将选择的药名传到input框
		$scope.seacher = {
			value: ''
		};

		//根据条件进行数据库匹配
		$scope.serchSql = function() {
			$dictionary.querySQL(
				("SELECT " +
					['med.name as name', 'Id', 'code', 'med.usage_unit usage', 'producer', 'spec'].join(',') +
					" FROM " + "medicine_list as med where med.kind=1 and name LIKE '%" + $scope.seacher.value + "%' LIMIT 0,100"),
				function(data) {
					$scope.$apply(function() {
						$scope.medNameList = data;
					});
				},
				function() {
					console.log('error');
				});
		}

		$scope.med = {
				freqCode: "101",
				wayCode: "1",
				beginTime: new Date(),
				wayName: "口服",
				freqName: '每日一次',
				perCount: '1'
			}
			//用法用量数据

		$scope.closeItemChangeModel = function(itemModleName, isConfirm, medBookConfirmData) {
			if (itemModleName == 'closeChorceMed') {
				if (!isConfirm) {
					$scope.seacher.value = '';
				}
				$dictionary.querySQL(
					("SELECT " +
						['medicineUsages.med_id as medId', 'medicineUsages.way_code as wayCode',
							'medicineUsages.freq_code as freqCode', 'medWay.name', 'medWay.code',
							'freList.kind', 'freList.c_name as cName', 'freList.code'
						].join(',') +
						" FROM " +
						"medicine_usages as medicineUsages,med_way as medWay,frequency_list as freList" +
						" where medicineUsages.med_id= '" + $scope.activeMed.id + "' and medWay.code=wayCode=freList.code"), //$scope.activeMed.id
					function(data) {
						if (data.length > 0) {
							$scope.$apply(function() {
								$scope.medicineUsagesList = data;
								$scope.med.freqCode = freqCode;
								$scope.med.wayCode = wayCode;
								$scope.med.wayName = wayName;
								$scope.med.freqName = freqName;
								$scope.med.freqCode = freqCode;
							});
						}
						$scope.med = {
							freqCode: "",
							wayCode: "",
							beginTime: new Date(),
							wayName: "",
							freqName: '',
							perCount: '1'
						}
					},
					function(error) {
						//查询失败走的方法
					});

				$scope.serchSql($scope.seacher.value);
			}
			$scope[itemModleName].close();
			$scope.useMedbookDataBack = null;
		}

		//关闭弹框
		var staticValue = null;

		$scope.initMedName = function() {
			$dictionary.querySQL(
				("SELECT " +
					//,'producer','spec'
					['med2.name as name', 'Id', 'code', 'med2.usage_unit usage', 'producer', 'spec'].join(',') +
					" FROM " + "medicine_list as med2 where med2.kind=1 group by name LIMIT 0,100"),
				function(data) {
					$scope.$apply(function() {
						$scope.medNameList = data;
						staticValue = $scope.staticList = data;
					});
				});
		}

		$scope.usage = function() {
			$dictionary.querySQL(
				("SELECT distinct med2.usage_unit as usage,code" +
					//['med.name as name','med.usage_unit as usageUnit'].join(',')+
					" FROM " + "medicine_list as med2 where med2.kind=1"),
				function(data) {
					$scope.$apply(function() {
						$scope.medNameList2 = data;

					});
				});
		}
		/*
		 * 清空输入框的时候
		 */

		$scope.onchangeList = function() {
			$scope.medNameList = $scope.staticList; //怎么引用赋值?
		}

		$scope.clearInput = function(data) {
			if (!data) {
				$scope.useWay();
				$scope.eatWay();
				$scope.usage();

			}

		}
		var isLoad = false;
		$scope.$on('$ionicView.enter', function() {
			if (!isLoad || $rootScope.user.id != nowId) {
				$scope.getRsdtMedicateList($scope.startDate, $scope.endDate);
				$scope.doRefreshMedBook();
				$scope.useWay();
				$scope.eatWay();
				$scope.initMedName();
				$scope.usage();
				nowId = $rootScope.user.id
				isLoad = true;
			}
			if ($scope.isBack) {
				$scope.isBack = false;
				return;
			}
		});
		$scope.$on("$ionicView.beforeLeave", function(event, data) {

		});

	}
	controller.$inject = ['$scope', '$rootScope', '$state', '$ionicSlideBoxDelegate', '$initModelView', '$modelView', '$timeout', '$API', '$dictionary', '$ionicScrollDelegate', '$ionicPopup', '$filter'];

	ZcarezeApp.registerController('MedicineManageCtrl', controller);
})