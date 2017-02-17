define([], function() {
	'use strict';

	function controller($scope, $rootScope, $state, $timeout, $API, $stateParams, $sce, $ionicScrollDelegate) {

		$scope.visibility = false;
		/*
		 * 点赞
		 */
		$scope.dianzhan = function() {
			$API.CoreService.saveArticleReadLog({
				articleReadLog: {
					articleId: $rootScope.dataAritcle.id,
					praiseFlag: $rootScope.dataAritcle.praiseFlag == 1 ? 0 : 1 //点赞标记
				}
			}).then(function(result) {
				if (result.code == 1) {
					if ($rootScope.dataAritcle.praiseFlag == 1) {
						$rootScope.dataAritcle.praiseCount--;
						$rootScope.dataAritcle.praiseFlag = 0;
					} else {
						$rootScope.dataAritcle.praiseCount++;
						$rootScope.dataAritcle.praiseFlag = 1;
					}

					//点赞成功应该搞相应的样式区别一下
				}
			}).fail(function(error) {
				console.log(error.message);
			})
		}

		/*
		 * 阅读
		 */
		$scope.isRead = function() {
			if ($scope.dataAritcle.readFlag == 1) {
				return;
			} else {
				$API.CoreService.saveArticleReadLog({
					articleReadLog: {
						articleId: $rootScope.dataAritcle.id,
						readFlag: 1 //阅读标记
					}
				}).then(function(result) {
					if (result.code == 1) {
						$rootScope.dataAritcle.readCount++;
						$rootScope.dataAritcle.readFlag = 1; //点赞成功应该搞相应的样式区别一下
					}

				}).fail(function(error) {
					console.log(error.message);
				})
			}

		}


		$scope.getDiscussList = [];
		/*
		 * 获取文章评论记录列表
		 */
		$scope.getDiscuss = function(id) {
			$API.CoreService.getArticleDiscussLogByArticleId({
				articleId: id,
				pageNow: 0,
				pageSize: 10
			}).then(function(result) {
				if (result.code == 1) {
					$scope.getDiscussList = result.lists;
					console.log(result);
				}

			}).fail(function(error) {
				console.log(error.message);
			})
		}
		/*
		 * 添加文章评论记录
		 */
		
		$scope.info = {
			value: ''
		};
		$scope.addArticleDiscussLog = function(info) {
			if (info != "") {
				$API.CoreService.addArticleDiscussLog({
					articleDiscussLog: {
						articleId: $scope.dataAritcle.id,
						content: $scope.info.value,
						nickname: $scope.dataAritcle.nickname
					}
				}).then(function(result) {
					if (result.code == 1) {
						$scope.getDiscussList.push(result.one);
						$scope.info.value = '';
					}

				}).fail(function(error) {
					console.log(error.message);
				})
			}
			//评论过后没有触发检查
		}
		
		/*
		 * 删除文章评论
		 */
		$scope.delArticleDiscussLog = function(data) {
			$API.CoreService.delArticleDiscussLogById({
				articleDiscussLog: {
					id: data.id,

				}
			}).then(function(result) {
				if (result.code == 1) {
					$scope.addDiscussLogList = result;

					$scope.getDiscussList.splice($scope.getDiscussList.indexOf(data), 1);
				}

			}).fail(function(error) {
				console.log(error.message);
			})
		}


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


		//下拉刷新
		$scope.doRefresh = function(type) {
			$rootScope.loading.show = false;
			$timeout(function() {
				$scope.$broadcast('scroll.refreshComplete');
			}, 200);
		};

		//knowlegedpage
		//弹窗控制
		$scope.alertStatus = false;
		$scope.alertContrl = function() {
			$scope.alertStatus = !$scope.alertStatus;
		}
		//关闭弹窗


		$scope.alertClose = function() {
			$scope.alertStatus = false;
			return false;
		}

		var isload = false;

		$scope.$on('$ionicView.enter', function() {
			$scope.visibility = false;
			$scope.isRead(); //初始化阅读次数
			$scope.dataAritcle = $rootScope.dataAritcle;
			$scope.address = $sce.trustAsResourceUrl($scope.dataAritcle.address);
			if (!isload) {
				$scope.getDiscuss($scope.dataAritcle.id);
				isload = true;
			}
			if ($scope.isBack) {
				$scope.isBack = false;
				return;
			}
		});

		$scope.$on("$ionicView.beforeLeave", function(event, data) {
			$scope.visibility = true;
		});

	}
	controller.$inject = ['$scope', '$rootScope', '$state', '$timeout', '$API', '$stateParams', '$sce', '$ionicScrollDelegate'];

	ZcarezeApp.registerController('KnowledgepageCtrl', controller);
})