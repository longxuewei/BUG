define([], function(){
	'use strict';

	function controller($scope, $rootScope, $state, $ionicSlideBoxDelegate, $modelView, $timeout, $API, $ionicModal, $ionicScrollDelegate, $ionicPopup) {

		$scope.isInit = false;

		$scope.weekdays = ['日','一','二','三','四','五','六'];

		$scope.residentSchedule = [];

		$scope.orderTask = {};

		$scope.taskListScroll = $ionicScrollDelegate.$getByHandle('taskListScroll');

		$scope.residentId={}; // 居民信息
		$scope.startDate = moment().format('YYYY-MM-DD');

		$scope.ctoday = angular.copy($scope.startDate);

		/**
		 * 打开任务提示弹出弹框
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-14T11:54:02+0800
		 * @return {[type]}                 [description]
		 */
		$scope.chooesItem={}; // 选择的事物
		$scope.detailTask={}; //事物详情
		$scope.herbRecipeBody=[];
		$scope.voiced={};//  语音指导
		$scope.media = {};
		$scope.openCalendarModel = function(type, task){
			var model = {
					title: "提示",
					templateUrl: "view/home/dialog/calendardialog.html",
					cssClass: "dialog mini",
					scope: $scope
				};
			if(task.orderType==-2){
				type=task.kind;
				switch(type){
					case 1:
						model.title= "西药处方",
							model.templateUrl = 'view/home/dialog/foremedcdialog.html'
						break;
					case 2:
						model.title= "中药处方",
						model.templateUrl = 'view/home/dialog/tranamedcdialog.html'
						break;
					case 3:
						model.title= "监测方案",
						model.templateUrl = 'view/home/dialog/monitordialog.html'
					break;
					case 4:
						model.title= "干预处置",
						model.templateUrl = 'view/home/dialog/disposedialog.html'
						break;
					case 5:
						model.title= "健康指导",
						model.templateUrl = 'view/home/dialog/healthdialog.html'
					break;
					case 6:
						model.title= "语音指导",
						model.templateUrl = 'view/home/dialog/voicedialog.html'
					break;
					case 7:
						model.title= "健康测评",
							model.templateUrl = 'view/home/dialog/evaluationdialog.html'
						break;
				}
			}else {
				switch(type){
					case 1:
						model.title= "用药提示",
							model.templateUrl = "view/home/dialog/calendardialog.html";
						break;
					case 2:
						model.title= "中药处方",
							model.templateUrl = 'view/home/dialog/tranamedcdialog.html'
						break;
					case 3:
						model.title= "监测提示",
							model.templateUrl = "view/home/dialog/monitorhintdialog.html";
						break;
					case 4:
						model.title= "干预处置",
							model.templateUrl = 'view/home/dialog/disposedialog.html'
						break;
					case 7:
						model.title= "健康测评",
							model.templateUrl = 'view/home/dialog/evaluationdialog.html'
						break;
				}
			}

			$scope.calendarModel = $rootScope.confirm(model, "custom");
		}

		/**
		 * [getTaskDetail description]
		 * @创建人员   杨英俊
		 * @创建时间   2016-12-28T11:32:53+0800
		 * @return {[type]}                 [description]
		 */
		$scope.getTaskDetail = function(type, task){
			$scope.chooesItem=task;
			$API.ResidentHealthService.getRsdtOrderTaskDetail({
				orderType:$scope.chooesItem.orderType,
				orderId:$scope.chooesItem.valueId,
				seqNo:$scope.chooesItem.seqNo,
				taskId:$scope.chooesItem.orderTaskId
			}).then(function (reslut) {
				if(reslut.code==1){
					$scope.detailTask=reslut;
					if(task.orderType==-2 && task.kind==6){
						$scope.voiced=reslut.orderListAudioGuidance;
						$scope.voiced.url=reslut.orderListAudioGuidance.audioUrl;
					}
					if(task.orderType!=-2){
						$scope.herbRecipeBody=reslut.one.herbRecipeBody ? reslut.one.herbRecipeBody.split(';') : [];
					}
					$scope.openCalendarModel(type, task);
				}
			}).fail(function (error) {
				console.log(error.message);
			})
		}


		$scope.closeCalendarModel = function(){
			$scope.calendarModel && $scope.calendarModel.close();
			$scope.calendarModel = null;
			if($scope.media){
				$scope.media.stop && $scope.media.stop();
				$scope.media = null;
			}
		}
		/**
		 * 选择时间
		 */
		$scope.chooesDate=function (date) {
			$scope.scheduleHandle.toDay=date;
			$scope.startDate=date;
			$scope.selectResidentTask();
		}
		
		/**
		 * 查询居民每日事物
		 */
		$scope.selectResidentTask=function (handler) { 
			$scope.orderTask=[];
			// $scope.allDayLongTask = [];
			// $timeout(function(){
			$scope.taskListScroll.scrollTop(true);
			$API.ResidentHealthService.getOrderHealthByDate({
				residentId:$rootScope.user.id,
				date:$scope.startDate
			}).then(function (reslut) {
				if(reslut.code==1){
					$scope.orderTask=JSON.parse(reslut.data);
					$scope.allDayLongTask = $scope.orderTask['全天'] || [];
					delete $scope.orderTask['全天'];
					$rootScope.loading.show = true;
				}
				handler && handler();
			}).fail(function (error) {
				console.log(error.message);
				handler && handler();
			});
			// }, 100);
		}

		/**
		 * 查询健康问题列表
		 */
		$scope.pageNow=0;
		$scope.pageSize=20;
		$scope.healthAnswer=[];
		$scope.getRsdtProblem=function (handler) {
			$API.ResidentHealthService.getRsdtProblemListNotClosedByResidentId({
				residentId:$rootScope.user.id,
				pageNow:$scope.pageNow,
				pageSize:$scope.pageSize
			}).then(function (reslut) {
				if(reslut.code==1){
					$scope.healthAnswer=reslut.lists;
				}
				handler && handler();
			}).fail(function (error) {
				console.log(error.message);
				handler && handler();
			})
		}
		/**
		 * 查询居民健康目标范围
		 */
		$scope.problemRange=[];
		$scope.getResidentItems=function (handler) {
			$API.ResidentService.getResidentItemsByRsId({
				residentId:$rootScope.user.id
			}).then(function (reslut) {
				if(reslut.code==1){
					$scope.problemRange=reslut.lists;
				}
				handler && handler();
			}).fail(function (error) {
				console.log(error.message);
				handler && handler();
			})
		}
		/**-----------------------------------------------------------------------
		 * 开始测评
		 */
		$scope.startTest=function () {
			$scope.closeCalendarModel();
			$scope.selectQuestiones();

		}
		/**
		 * 关闭测评
		 */
		$scope.closeevaluationAlert=function () {
			$scope.evaluationAlert && $scope.evaluationAlert.close();
			$scope.evaluationAlert = null;
			$scope.lastGrade=false;
		}
		function modelvaluation() {
			var model = {
				title: "提示",
				templateUrl: "view/home/dialog/calendardialog.html",
				cssClass: "dialog mini",
				scope: $scope
			};
			model.title= "问卷测评",
				model.templateUrl = 'view/home/dialog/surveyReport.html'
			$scope.evaluationAlert = $rootScope.confirm(model, "custom");
		}
		//获取问题
		$scope.question=[];  // 问题库
		$scope.questionIndex=0; //问题索引
		$scope.surveyQuestions=[]; // 问题
		$scope.lastGrade=false;// 判断是否显示 答题完成 显示评分
		$scope.factors=[];//评分因子
		$scope.auto=true; //勾选是否进入下一题  默认勾选
		// 获取测评问题 及 选项
		$scope.selectQuestiones=function () {
			if(localStorage.getItem($scope.chooesItem.valueId+'answer')){
				$scope.surveyQuestions = JSON.parse(localStorage.getItem($scope.chooesItem.valueId+'answer'));
				$scope.lastGrade=JSON.parse(localStorage.getItem($scope.chooesItem.valueId+'grade'));
				for(var i=0;i<$scope.surveyQuestions.length;i++){
					if($scope.surveyQuestions[i].qaOptions==null){
						$scope.questionIndex=i;
						modelvaluation();
						return $scope.question=$scope.surveyQuestions[$scope.questionIndex];
					}
					if($scope.surveyQuestions[$scope.surveyQuestions.length-1].qaOptions!=null || $scope.lastGrade){
						$scope.questionIndex=$scope.surveyQuestions.length-1;
						modelvaluation();
						if($scope.lastGrade){
							$scope.gradeSurvey();
						}
						return $scope.question=$scope.surveyQuestions[$scope.questionIndex];
					}
				}
			}else {
				$API.HealthOrderService.getOrdEvaluation({
					orderId:$scope.chooesItem.valueId
				}).then(function (result) {
					if(result.code==1){
						$scope.surveyQuestions=result.evaQaLists;
						$scope.question=$scope.surveyQuestions[$scope.questionIndex]
						var model = {
							title: "提示",
							templateUrl: "view/home/dialog/calendardialog.html",
							cssClass: "dialog mini",
							scope: $scope
						};
						model.title= "问卷测评",
							model.templateUrl = 'view/home/dialog/surveyReport.html'
						$scope.evaluationAlert = $rootScope.confirm(model, "custom");
					}
				}).fail(function (error) {
					console.log(error.message);
				})
			}
		}
		/***
		 * 是否自动进行下一题
		 */
		$scope.accredit=function () {
			$scope.auto=!$scope.auto;
		}
		/***
		 * 选择答案
		 * @param item
		 * @param index
		 */
		$scope.Uanswer=[];
		$scope.changeAnswer=function (item) {
			$scope.surveyQuestions[$scope.questionIndex].qaOptions=item;
			var answers=JSON.stringify($scope.surveyQuestions);
			localStorage.setItem($scope.chooesItem.valueId+'answer',answers);
			$timeout(function () {
				if($scope.auto){
					$scope.nextQuestion();
				}
			},300)
		}
		/***
		 * 返回上一题
		 */
		$scope.backQuestion=function () {
			if($scope.questionIndex==0){
				return;
			}
			$scope.questionIndex=--$scope.questionIndex;
			$scope.question=$scope.surveyQuestions[$scope.questionIndex];
		}
		/***
		 * 下一题
		 */
		$scope.nextQuestion=function () {
			if($scope.question.qaOptions==null){
				$rootScope.alert({
					title:"提示",
					template:"当前问题未选择答案"
				})
				return;
			}else {
				if($scope.questionIndex==$scope.surveyQuestions.length-1){
					return;
				}
				$scope.questionIndex=++$scope.questionIndex;
				$scope.question=$scope.surveyQuestions[$scope.questionIndex];
			}

		}
		/***
		 * 评分
		 */
		$scope.notQuestion=[];
		$scope.gradeSurvey=function () {
			$scope.Uanswer=[];
			$scope.notQuestion=[];
			if($scope.questionIndex==$scope.surveyQuestions.length-1){
				for (var i=0;i<$scope.surveyQuestions.length;i++){
					if($scope.surveyQuestions[i].qaOptions==null){
						$scope.notQuestion.push(i+1);
						$scope.notQuestion.join('、');
					}else{
						$scope.Uanswer.push({
							qaId:$scope.surveyQuestions[i].qaOptions.qaId,
							qaOptionSeq:$scope.surveyQuestions[i].qaOptions.seqNo
						})
					}
				}
			}
			if($scope.Uanswer.length==$scope.surveyQuestions.length){
				// $state.go('app.questionnaire-grade',{
				// 	orderId:$scope.order,
				// 	Uanswer:$scope.Uanswer
				// })
				$API.HealthOrderService.confirmOrdEvaluation({
				    rsdtEvaScoreParam:{
				        orderId:$scope.chooesItem.valueId,
				        lists: $scope.Uanswer
				    }
				}).then(function (reslut) {
				    if(reslut.code==1){

				        $scope.doctorEnding=reslut.doctorEnding;
				        $scope.factors=reslut.lists;
				        $scope.lastGrade=true;
						localStorage.setItem($scope.chooesItem.valueId+'grade',$scope.lastGrade);
				    }
				}).fail(function (error) {
				    console.log(error.message);
				})
			}else {
				$rootScope.alert({
					title:"提示",
					template:"您第"+ $scope.notQuestion+"题未问答，不能进行评分"
				})
			}
		}
		/***
		 * 提交
		 */
		$scope.submitSurvey=function () {
			$API.HealthOrderService.commitEvaluation({
				orderId:$scope.chooesItem.valueId,
				evaId:$scope.factors[0].evaId,
				conclusion:""
			}).then(function (reslut) {
				if(reslut.code==1){
					localStorage.removeItem($scope.chooesItem.valueId+'answer');
					localStorage.removeItem($scope.chooesItem.valueId+'grade');
					$scope.lastGrade=false;
					$scope.closeevaluationAlert();
				}
			}).fail(function (error) {
				console.log(error.message);
			})
		}
		/**
		 *--------------------------------------------
		 * 执行登记
		 **/
		$scope.account={};
		$scope.execute=function () {
			$ionicPopup.alert({
				title:"提示",
				template:'<label class="item item-input"><input type="text" ng-model="account.reason" placeholder="执行说明" /></label>',
				scope: $scope,
				buttons:[
					{
						text:"取消"
					},
					{
						text:"执行",
						type:'button-positive',
						onTap: function(e) {
							$API.HealthOrderService.confirmOrderByExecutionStart({
								orderId:$scope.chooesItem.valueId,
								comment:$scope.account.reason,
								taskId:$scope.chooesItem.orderTaskId,
								cycleNo:$scope.chooesItem.cycleNo,
								timeNo:$scope.chooesItem.timeNo
							}).then(function (result) {
								if(result.code==1){
									$rootScope.alert({
										title:"提示",
										template:"本条记录登记成功"
									})
									$scope.account.reason="";
									$scope.closeCalendarModel();
								}
							}).fail(function (error) {
								console.log(error.message)
							})
						}
					}
				]
			})
		}
		/**
		 * 刷新计划任务
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-14T12:03:42+0800
		 * @param  {[type]}                 task [description]
		 * @return {[type]}                      [description]
		 */
		$scope.refreshTask = function(task){

		}

		/**
		 * 任务提醒
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-14T12:04:46+0800
		 * @param  {[type]}                 task [description]
		 * @return {[type]}                      [description]
		 */
		$scope.taskRemind = function(task){

		}

		/**
		 * 计算周天
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-14T12:00:39+0800
		 * @param  {[type]}                 startDay [description]
		 * @param  {Boolean}                isBack   [description]
		 * @return {[type]}                          [description]
		 */
		function weekSilde(startDay, isBack){
			var tostart = startDay || moment().startOf('week');
			var week = [];
			for (var i = 0; i < 7; i++) {
				var temp = angular.copy(tostart);
				week.push(temp.add(i, 'days').format('YYYY-MM-DD'));
			}
			$scope.residentSchedule[isBack?"unshift":"push"](week);
        }

        weekSilde();
		/**
         * 日期切换
         * @创建人员   杨英俊
         * @创建时间   2016-11-02T15:03:41+0800
         * @param  {[type]}                 index [description]
         * @return {[type]}                       [description]
         */
		$scope.scheduleHandle = {
			index: 0,
			toDay: moment().format('YYYY-MM-DD'),
			move: function(index){

			},
			slide: function(index){
				this.index = index;
			},
			previous: function(){
				if(this.index-1 < 0){
					var temp = moment($scope.residentSchedule[this.index][0]);
					weekSilde(temp.subtract(1,'weeks'), true);
					this.index=0;
				}else{
					this.index--;
				}
			},
			next: function(){
				if(this.index+1 >= $scope.residentSchedule.length){
					var temp = moment($scope.residentSchedule[this.index][0]);
					weekSilde(temp.add(1,'weeks'));
				}
				this.index++;
			}
		};

		$scope.scheduleData = 0;
		$scope.datePrevious = function(){
			$scope.scheduleHandle.previous();
		}
		$scope.dateNext = function(){
			$scope.scheduleHandle.next(); 
		}

		/**
		 * 下拉刷新
		 * @创建人员   杨英俊
		 * @创建时间   2016-11-14T12:00:12+0800
		 * @param  {[type]}                 type [description]
		 * @return {[type]}                      [description]
		 */
        $scope.doRefresh = function(type) {
            $rootScope.loading.show = false;
			if(type==1){
				$scope.selectResidentTask(function(){
					$scope.$broadcast('scroll.refreshComplete');
				})
			}
           if(type==2){
			   $scope.getResidentItems(function () {
				   $scope.$broadcast('scroll.refreshComplete');
			   });
			   $scope.getRsdtProblem(function () {
				   $scope.$broadcast('scroll.refreshComplete');
			   })
		   }
        };

		$scope.$on('$ionicView.enter', function(){
			if($scope.residentId != $rootScope.user.id){
				$scope.isInit = false;
				$scope.startDate=moment().format('YYYY-MM-DD');
			}
			if(!$scope.isInit){
				$scope.selectResidentTask();
				$scope.getResidentItems();
				$scope.getRsdtProblem();
				$scope.isInit = true;
			}
			$scope.residentId = angular.copy($rootScope.user.id);
		});

		$scope.$on("$ionicView.beforeLeave", function(event, data){

		});
	
	}
	controller.$inject = ['$scope', '$rootScope', '$state', '$ionicSlideBoxDelegate', '$modelView', '$timeout', '$API', '$ionicModal', '$ionicScrollDelegate', '$ionicPopup'];

	ZcarezeApp.registerController('CalendarCtrl', controller);
})