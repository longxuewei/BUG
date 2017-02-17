define([],function(){
    'use strict';
    function controller($scope, $rootScope, $state, $timeout, $ionicPopover, $ionicPopup, $location, $API, $User, $ionicLoading, $ionicHistory, $CLIENT) {
        var currentService = sessionStorage.getItem('ClientService') || ZcarezeApp.ClientService.server_address || "";

        $scope.user = {};
        $scope.remember = false;
        $scope.tabindex = 0;
        $scope.app = {
            serviceAddr : currentService
        }

        $scope.countdowntimer = 0;
        $scope.isactivate = true;
        $scope.remaining = 0;

        $scope.activateText = null;

        $scope.countdowncall = function(time){
            $scope.remaining = time;
            if($scope.remaining == 0){
                $scope.countdowntimer = 0;
                $scope.remaining = 0;
            }
        }

        $scope.switchbtn = function(btn){
            if(btn){
                $scope.user.disabled = false;
            }
            $scope.user.clerkactivate = false;
            $scope.isactivate = btn;
            $scope.activateText = null;
        }

        /**
         * 选择服务器
         * @创建人员   杨英俊
         * @创建时间   2016-10-17T17:22:59+0800
         * @return {[type]}                 [description]
         */
        $scope.selectorService = function(){
            ZcarezeApp.ClientService  = angular.extend(ZcarezeApp.ClientService,{
                server_address: $scope.app.serviceAddr,
                client_address: $scope.app.serviceAddr
            });
            $scope.user.cloudId = '';
            $scope.countdowntimer = 0;
            $scope.remaining = 0;
        }

        /**
         * 职员登陆未激活，输入验证码
         * @创建人员   杨英俊
         * @创建时间   2016-10-17T17:22:02+0800
         * @param  {[type]}                 user [description]
         * @return {[type]}                      [description]
         */ 
        $scope.activateAccount = function(type){
            if(!(/\d{6}/.test($scope.user.verification))){
                $ionicPopup.alert({
                    title: '提示!',
                    template: '输入验证的验证有无，请输入6位有效数字。'
                });
                return false;
            }
            var params = {};
            if($scope.activateText){
                params = {
                    mobile: $scope.user.username,
                    smsNum: $scope.user.verification
                }
            }else{
                params = {
                    mobile: $scope.user.username,
                    password: $scope.user.password,
                    smsNum: $scope.user.verification
                }
            }
            $rootScope.isLogout = false;
            $API.CoreService[$scope.activateText ? 'loginVerificationCode':'activeAccountHolder'](params).then(function(result){
                $scope.getVeriLoadding = false;
                if(result.code == 2){
                    $scope.openCloudList(result.accountHolders, 1);
                }else if(result.code == 1){
                    $scope.loginSuccess(result);
                }else if(result.code == 10){
                    $ionicPopup.alert({
                        title: '提示!',
                        template: result.message + '<br/>' + '是否立即登录。',
                        buttons:[
                          {
                            text:"取消",
                            onTap:function (e) {
                                $scope.switchbtn(true);
                            }
                          },
                          {
                            text:"立即登录",
                            type: 'button-balanced',
                            onTap:function (e) {
                                $scope.login($scope.user);
                            }
                          }
                        ]
                    });
                }else{
                    $ionicPopup.alert({
                        title: '提示!',
                        template: result.message + '<br/>' + result.errorCode
                    });
                }
            }).fail(function(){
                $scope.getVeriLoadding = false;
            })
        }

        var vercode = "";
        $scope.getVeriLoadding = false;
        $scope.getVerification = function(user){
            if(!(/^1(3|4|5|7|8)\d{9}$/.test($scope.user.username))){
                $ionicPopup.alert({
                    title: '提示!',
                    template: '手机号不能为空'
                });
                return false;
            }
            $scope.getVeriLoadding = true;
            $CLIENT.achievesms({
                    purpose: "reg",
                    mobile: $scope.user.username
            }).success(function(result){
                $timeout(function(){
                    $scope.getVeriLoadding = false;
                }, 1000);
                if(result.code == 1){
                    $scope.countdowntimer = 60;
                }else{
                    $ionicPopup.alert({
                        title: '提示!',
                        template: result.message + '<br/>' + result.errorCode
                    });
                }
            }).error(function(){
                $scope.getVeriLoadding = false;
                $ionicPopup.alert({
                    title: '提示!',
                    template: '获取验证码失败，请重试。'
                });
            })
        }

        /**
         * 登陆多区域云，选择区域云
         * @创建人员   杨英俊
         * @创建时间   2016-10-17T17:22:37+0800
         * @return {[type]}                 [description]
         */
        $scope.activeCloud = {};
        $scope.activeCloudId = null;
        $scope.selectCloud = function(cloud, type){
            $scope.activeCloud = cloud;
            type == 1 ? 
            $API.CoreService.verifyCloud({
                cloudId: cloud.cloudId
            }).then(function(result){
                if(result.code == 1){
                    $scope.loginSuccess(result);
                }else{
                    $ionicPopup.alert({
                        title: '失败!',
                        template: '区域激活失败！' + result.message
                    });
                }
                $scope.alertCloud.close();
            }).fail(function(){
                $scope.alertCloud.close();
            }): 
            $API.CoreService.loginVerifyCloud({
                cloudId: cloud.cloudId
            }).then(function(result){
                if(result.code == -2){
                    $ionicPopup.alert({
                        title: '提示!',
                        template: '所选区域“'+ cloud.cloudName +'”职员未激活！',
                        buttons:[
                          {
                            text:"取消"
                          },
                          {
                            text:"立即激活",
                            type: 'button-assertive',
                            onTap:function (e) {
                                $scope.switchbtn(false);
                                $scope.user.clerkactivate = true;
                                $scope.activateText = '激活区域';
                            }
                          }
                        ]
                    });
                }else{
                    $scope.loginSuccess(result);
                }
                $scope.alertCloud.close();
            }).fail(function(){
                $scope.loginSuccess(result);
            });
        }
        $scope.openCloudList = function(accountHolders, type){
            $scope.accountHolders = accountHolders;
            $scope.alertCloud = $ionicPopup.alert({
                title: '选择区域云',
                scope: $scope,
                template: (function(){
                    return  '<div class="list">' +
                                '<div class="item" ng-click="selectCloud(accountHolder, '+ type +')" ng-repeat="accountHolder in accountHolders">' +
                                    '{{accountHolder.cloudName}}' +
                                '</div>' +
                            '</div>';
                })(),
                buttons:[
                      {
                        text:"取消登录"
                      }
                    ]
            });
        }

        $scope.login = function (user) {
            if(!user.username || !user.password){
                $ionicPopup.alert({
                    title: '提示!',
                    template: '用户名和密码不能为空'
                });
                return false;
            }

            if($scope.remember){
                localStorage.setItem('username', user.username);
                localStorage.setItem('password', user.password);
            }

            $rootScope.isLogout = false;
            var loginParams = angular.copy(ZcarezeApp.ClientService.appinfo);

            loginParams = angular.extend({
                "mobile": "","password": "","cloudId": "",
                "appKey": "","clientVersion": "","clientOS": "",
                "identity": "resident"
            },loginParams,{
                mobile: user.username,
                password: user.password,
                cloudId: user.cloudId || ''
            })
            $API.CoreService.login(loginParams).then(function(result){
                if(result.code == 1){
                    $scope.loginSuccess(result);
                }else if(result.code == -1){
                    $ionicPopup.alert({
                        title: '提示!',
                        template: result.message,
                        buttons:[
                          {
                            text:"取消"
                          },
                          {
                            text:"立即激活",
                            type: 'button-assertive',
                            onTap:function (e) {
                                $scope.user.disabled = true;
                                $scope.switchbtn(false);
                            }
                          }
                        ]
                    });
                }else if(result.code == -2){
                    $ionicPopup.alert({
                        title: '提示!',
                        template: result.message,
                        buttons:[
                          {
                            text:"取消"
                          },
                          {
                            text:"立即激活",
                            type: 'button-assertive',
                            onTap:function (e) {
                                $scope.user.disabled = true;
                                $scope.switchbtn(false);
                            }
                          }
                        ]
                    });
                }else if(result.code == 2){
                    $scope.openCloudList(result.accountHolders, 0);
                }else{
                    user.password = null;
                    localStorage.removeItem('username');
                    localStorage.removeItem('password');
                }
                $ionicLoading.hide();
                $rootScope.loading.show = true;
            }).fail(function(data){
                $ionicLoading.hide();
                $rootScope.loading.show = true;
            })
        };

        /**
         * 登录成功进入主页
         * @创建人员   杨英俊
         * @创建时间   2016-10-17T17:26:21+0800
         * @param  {[type]}                 data [description]
         * @return {[type]}                      [description]
         */
        $scope.loginSuccess = function(data){

            $scope.activeCloudId = $scope.activeCloud.cloudId;

            data.one.ttsToken = "24.2c668b62f5829dc4036c698bcf2cb0af.2592000.1485411540.282335-8322273";
            data.one.activeCloudId = $scope.activeCloudId || $scope.user.cloudId || '';
            $User.setUser(data.residentList);
            $rootScope.user = data.residentList;
            $rootScope.one = data.one;
            sessionStorage.setItem('user', angular.toJson(data.residentList));
            sessionStorage.setItem('one', angular.toJson(data.one));
            sessionStorage.setItem('ClientService', $scope.app.serviceAddr);
            localStorage.setItem($rootScope.user.id + 'CloudId', data.cloudId)
            !$scope.remember && document.body.classList.remove('view-loading');
            $rootScope.popup.show = true;
            $ionicLoading.hide();
            if(currentService !== $scope.app.serviceAddr){
                $ionicHistory.clearCache();
                $ionicLoading.show({
                    template: '<ion-spinner icon="spiral"></ion-spinner><div class="text-center">正在切换服务器</div>'
                });
                $timeout(function(){
                    $state.go('app.home', {}, {
                        reload: false
                    });
                }, 800);
                return;
            }else{
                $state.go('app.home', {}, {
                    reload: true
                });
            }
        }

        $scope.rememberFn = function(){
            $scope.remember = !$scope.remember;
        }

        $scope.$watch('remember', function(){
            if($scope.remember == false || $scope.remember ==  'false'){
                localStorage.removeItem('remember');
            }else{
                $scope.user.username && $scope.user.password && localStorage.setItem('remember', $scope.remember);
            }
        });

        if(localStorage.getItem('username')){
            $scope.user.username = localStorage.getItem('username');
            $scope.user.password = localStorage.getItem('password');
            if(localStorage.getItem($scope.user.username + 'CloudId') == 'undefined' || !localStorage.getItem($scope.user.username + 'CloudId')){
                localStorage.removeItem($scope.user.username + 'CloudId');
            }else{
               $scope.user.cloudId = localStorage.getItem($scope.user.username + 'CloudId'); 
            }
        }
        if(localStorage.getItem('remember')){
            $scope.remember = localStorage.getItem('remember');
        }

        $scope.showAlert = function(msg) {
            var alertPopup = $ionicPopup.alert({
                title: '错误提示',
                template: msg
            });
        };
        $scope.tabindexFocus = function(event){
            document.querySelector("#username").blur();
            document.querySelector("#password").blur();
        };

        $scope.$on('$ionicView.enter', function(){
            if($rootScope.isLogout){
                $scope.user.password = "";
                $ionicHistory.clearHistory();
            }
        });
    }

    controller.$inject = ['$scope', '$rootScope', '$state', '$timeout', '$ionicPopover', '$ionicPopup', '$location', '$API', '$User', '$ionicLoading', '$ionicHistory', '$CLIENT'];
    ZcarezeApp.registerController('LoginCtrl', controller);
})