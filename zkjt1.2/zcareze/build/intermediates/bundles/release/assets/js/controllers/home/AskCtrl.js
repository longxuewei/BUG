define([], function(){
	'use strict';

	function controller($scope, $rootScope, $state,$timeout,$API,$stateParams,$ionicPopup) {
		var userId = Math.MD5($rootScope.user.id).toString();
		$rootScope.Md5userId=userId;
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
		
		
		//获取问题
		
		$scope.question=[];  // 问题库
		$scope.questionIndex=0; //问题索引
		$scope.surveyQuestions=[]; // 问题
		$scope.lastGrade=false;// 判断是否显示 答题完成 显示评分
		$scope.factors=[];//评分因子
		$scope.auto=true; //勾选是否进入下一题  默认勾选
		// 获取测评问题 及 选项
		$scope.selectQuestiones=function (index,askLocalId) {
			if(localStorage.getItem(askLocalId.id+userId+'answer')){
				$scope.surveyQuestions = JSON.parse(localStorage.getItem(askLocalId.id+userId+'answer'));
				$scope.lastGrade=JSON.parse(localStorage.getItem(askLocalId.id+userId+'grade'));
				$scope.questionLen=$scope.surveyQuestions.length;
				for(var i=0;i<$scope.surveyQuestions.length;i++){
					if($scope.surveyQuestions[i].qaOptions==null){
						$scope.questionIndex=i;
						
						return $scope.question=$scope.surveyQuestions[$scope.questionIndex];
					}
					if($scope.surveyQuestions[$scope.surveyQuestions.length-1].qaOptions!=null || $scope.lastGrade){
						$scope.questionIndex=$scope.surveyQuestions.length-1;
						
						if($scope.lastGrade){
							$scope.gradeSurvey();
						}
						return $scope.question=$scope.surveyQuestions[$scope.questionIndex];
					}
				}
			}else {
			
				$API.HealthOrderService.getEvaluationQaList({
					evaId:askLocalId.id,
				}).then(function (result) {
					if(result.code==1){
						$scope.surveyQuestions=result.evaQaLists;
						$scope.question=$scope.surveyQuestions[$scope.questionIndex];
						$scope.questionLen=$scope.surveyQuestions.length;
						if(!result.evaQaLists.length){
							 var confirmPopup = $ionicPopup.confirm({
				               title: '温馨提醒',
				               template: '当前问卷没有题?',
				               cssClass:'med_del_confirm',
				               buttons: [
				               { text: '确定' ,type:'isConfirm',onTap:function(e){
				               	if (!$rootScope.back('app.home-PsychologicalEval')) {
				               		e.preventDefault();
				               	}
				               	$rootScope.back('app.home-PsychologicalEval');
				               }}
				               ]
				
				             });
						}
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
		$scope.changeAnswer=function (item,askLocalId) {
			$scope.surveyQuestions[$scope.questionIndex].qaOptions=item;
			var answers=JSON.stringify($scope.surveyQuestions);
			localStorage.setItem(askLocalId.id+userId+'answer',answers);
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
		$scope.gradeSurvey=function (askLocalId) {
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

				$API.HealthOrderService.confirmEvaluationScore({
				    rsdtEvaScoreParam:{
				        orderId:askLocalId.id,
				        lists: $scope.Uanswer
				    }
				}).then(function (reslut) {
				    if(reslut.code==1){

				        $scope.doctorEnding=reslut.doctorEnding;
				        $scope.factors=reslut.lists;
				        $rootScope.AskFactors=reslut.lists;
				        $scope.lastGrade=true;
						localStorage.setItem(askLocalId.id+userId+'grade',$scope.lastGrade);
						$state.go('app.home-PsychologicalEval-ask-code');
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
		
		/**
		 *--------------------------------------------
		 * 执行登记
		 **/
		
			  $scope.showConfirm = function() {
             var confirmPopup = $ionicPopup.confirm({
               title: '温馨提醒',
               template: '确定要放弃测评吗?',
               cssClass:'med_del_confirm',
               buttons: [
               { text: '确定' ,type:'isConfirm',onTap:function(e){
               	if (!$rootScope.back('app.home-PsychologicalEval')) {
               		$rootScope.back('app.home-PsychologicalEval');
               	}else{
               		e.preventDefault();
               		
               	}
               	
               }},
               {text: '继续答题',type:'isCancle'}
               ]

             });

           };
	
		
		
		$scope.$on('$ionicView.enter', function(){

			 $scope.askLocalId=$rootScope.psyToAskData;
			 $scope.selectQuestiones($rootScope.psyToAskIndex,$scope.askLocalId); 
		});
      
		$scope.$on("$ionicView.beforeLeave", function(event, data){
	         $scope.questionIndex=0;
	         //$scope.askLocalId=$rootScope.psyToAskData;
		});
	
	}
	controller.$inject = ['$scope', '$rootScope', '$state','$timeout','$API','$stateParams','$ionicPopup'];

	ZcarezeApp.registerController('AskCtrl', controller);
})