(function (ZcarezeApp){

    var Utils = {
      surface: document.createElement('surface'),
      transform: "transform",
      whichTransitionEvent: function (){
          var t,
           transforms = {
             'transform': 'transform',
             'OTransform': '-o-transform',
             'MozTransform': '-moz-transform',
             'WebkitTransform': '-webkit-transform'
           }
           for(t in transforms){
               if( this.surface.style[t] !== undefined ){
                   return transforms[t];
               }
           }
      },
      init: function(){
        this.transform = this.whichTransitionEvent();
      }
    }

    Utils.init();

  	/**
     *基础用户模块
     *提供：
     *  权限
     *  回话记录
     *  注销
     *  锁定
     *功能
     */
  	ZcarezeApp
      .service('User',['$state' , '$rootScope', '$ionicHistory', '$ionicPopup', '$ionicLoading', function($state, $rootScope, $ionicHistory, $ionicPopup, $ionicLoading) {

      var user = function(){
        this.user = {};
        this.clean = function(){
          sessionStorage.clear();
          $rootScope.$User = null;
          $rootScope.isLogout = true;
          // $rootScope.modelView && $rootScope.modelView.close && $rootScope.modelView.close();
          $rootScope.activeResident = null;
        }
      };
      user.prototype.exit = function(reLogin){
          this.clean();
          $ionicLoading.show({
              template: '<ion-spinner icon="spiral"></ion-spinner><div class="text-center">验证用户信息...</div>'
          });
          reLogin && ZcarezeApp.Native.java("reLogin", null, null, function(){
            $ionicLoading.hide();
          });
      };
      user.prototype.lock = function(){};
      user.prototype.setUser = function(info){
        this.user = info;
      };
      user.prototype.getUser = function(){
        return this.user;
      }

      ZcarezeApp.AddJsAPI('onLoginSuccess', function(){
        $rootScope.homeInit = false;
        $rootScope.getDevicesInfo();
        $rootScope.initDevices();
        $ionicLoading.hide();
      });

      ZcarezeApp.AddJsAPI('onLoginFail', function(){
        u.clean();
        $ionicLoading.hide();
        $ionicPopup.alert({
            title:"提示",
            template:'<div class="text-center">用户信息过期，请重新登录。</div>',
            buttons:[
              {
                text:"登录",
                type: 'button-assertive',
                onTap:function (e) {
                  ZcarezeApp.Native.java("logout");
                }
              }
            ]
          });
      });

      var u = new user();

      $rootScope.logout = function(data, type){
        if(type){
          $state.go('login',{},{
            reload: true
          });
          ZcarezeApp.Native.java("logout");
          return;
        }
        if(data && data.code == 6){
          $ionicPopup.alert({
            title:"登录失败",
            template:'<div class="text-center">'+ data.message +'</div>',
            buttons:[
              {
                text:"关闭"
              }
            ]
          });
        }else{
          $ionicPopup.alert({
            title:"注销登录",
            template:'<div class="text-center">是否立刻注销登录并且清空当前账户密码？</div>',
            buttons:[
              {
                text:"取消"
              },
              {
                text:"注销",
                type: 'button-assertive',
                onTap:function (e) {
                  $state.go('login',{},{
                    reload: true
                  });
                  ZcarezeApp.Native.java("logout");
                }
              }
            ]
          });
        }
      };
      return u;
    }])
    /**
     * 对所以service和controller开发的用户信息
     * 注入后可获取用户信息
     * @param  {[type]} User             [description]
     * @param  {[type]} $http            [description]
     * @param  {[type]} $q               [description]
     * @param  {[type]} $ionicLoading){                      return {                           getUser: function(){              return User.getUser();                        } [description]
     * @param  {[type]} setUser:         function(info){                  User.setUser(info);                            }      }                         }] [description]
     * @return {[type]}                  [description]
     */
    .factory('$User', ['User', '$http', '$q', '$ionicLoading', function(User ,$http, $q, $ionicLoading){
      return {
        getUser: function(){
          return User.getUser();
        },
        setUser: function(info){
          User.setUser(info);
        }
      }
    }])
    /**
     *  年龄过滤器
     */
    .filter('agedate',['$filter',function () {
            return function (data) {
                var a = moment(data).fromNow().split(' ')[0];
                if(a == "a"){
                  return "1";
                }else{
                  return a;
                }
            }
        }
    ])
    .filter('int',['$filter',function () {
            return function (data) {
              if(data){
                return +data
              }
              return 0;
            }
        }
    ])
    .filter('timediff',['$filter',function ($filter) {
        return function (data) {
                var t = new Date(data) ,
                    c = new Date(),
                    d = c.getTime() - t.getTime();

                d = Math.floor(d*0.001);
                if(d <= 59){
                    return '刚刚'
                }
                d = Math.floor(d/60);
                if(d <= 59){
                    return d + '分钟前'
                }
                d = Math.floor(d/60);
                if(d <= 23){
                    return d + '小时前'
                }
                d = Math.floor(d/24);
                if(d <= 29){
                    return d + '天前'
                }

                return $filter('date')(data,'YYYY-MM-DD');
            }
        }
    ])
    .filter('expireDate',['$filter',function ($filter) {
        return function (data) {
            var t = new Date(data) ,//到期时间
                c = new Date(), // 当前时间
                e=c.setDate(c.getDate()+7);
                d = c.getTime() - t.getTime();
            var week=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
            var expirDate=t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate();
            var nowDate=c.getFullYear() + "-" + (c.getMonth() + 1) + "-" + c.getDate();
            if(expirDate==nowDate){
                return '今天到期'
            }else if(t.getFullYear()==c.getFullYear()){
                if((t.getMonth() + 1)==(c.getMonth() + 1)){
                    if(2>t.getDate()-c.getDate() && t.getDate()-c.getDate>0){
                        return '明天到期'
                    }else if(2>c.getDate()-t.getDate() && t.getDate()-c.getDate>0){
                        return '昨天到期'
                    }else if(c < t && t < e){
                        return week[t.getDay()];
                    }else {
                        return $filter('date')(data,'YYYY-MM-DD');
                    }
                }
            }else {
                return $filter('date')(data,'YYYY-MM-DD');
            }

        }
    }
    ])
    .filter('date',['$filter',function () {
            return function (data, format) {
              if(format){
                format = format.replace(/yyyy/g,'YYYY').replace(/dd/g,'DD');
                if(/DDDD/g.test(format)){
                  format = format.replace(/DDDD/g,'dddd')
                }
              }
              return !data ? "" : moment(data).format(format);
            }
        }
    ])
    .filter("highlight", function($sce, $log){
        var fn = function(text, search){
            $log.info("text: " + text);
            $log.info("search: " + search);

            if (!search) {
                return $sce.trustAsHtml(text);
            }
            // text = encodeURI(text);
            // search = encodeURI(search);

            var regex = new RegExp(search, 'gi')
            var result = text ? text.replace(regex, '<red>$&</red>') : '';
            // result = decodeURI(result);
            // $log.info("result: " + result );
            return $sce.trustAsHtml(result);
        };
        return fn;
    })
    .directive('onlineAble',['$rootScope',  function($rootScope){
        return {
            restrict: 'A',
            link: function(scope, elem, attr) {
              $rootScope.$watch('network', function(){
                if($rootScope.network){
                  elem.removeAttr('disabled');
                }else{
                  elem.attr('disabled', 'disabled');
                }
              });
            }
        };
    }])
    .directive('onlineShow',["$rootScope", "$animate", "$compile", function($rootScope, a, b) {
        return {
            restrict: 'A',
            link: function(scope, elem, attr) {
              $rootScope.$watch('network', function(){
                if($rootScope.network){
                  elem.removeClass('ng-hide');
                }else{
                  elem.addClass('ng-hide');
                }
              });
            }
        }
    }])
    /**
     * [将整形转为 空字符串]
     * @param  {[type]} $filter
     * @return {[type]}             [description]
     */
    .directive('intNull',['$filter', function($filter){
        return {
            require: 'ngModel',
            link: function(scope, elem, attr, ngModelCtrl) {
                ngModelCtrl.$formatters.push(function(modelValue){
                    if(modelValue) {
                        return modelValue ? modelValue : "";
                    }
                });

                ngModelCtrl.$parsers.push(function(value){
                    if(!value) {
                        return "";
                    }else{
                      return value;
                    }
                });
            }
        };
    }])
    .directive('intStr',['$filter', function($filter){
        return {
            require: 'ngModel',
            link: function(scope, elem, attr, ngModelCtrl) {
                ngModelCtrl.$formatters.push(function(modelValue){
                    if(modelValue) {
                      return modelValue+"";
                    }else{
                      return modelValue+"";
                    }
                });

                ngModelCtrl.$parsers.push(function(value){
                    if(!value) {
                        return "";
                    }else{
                      return value+"";
                    }
                });
            }
        };
    }])
    .directive('strInt',['$filter', function($filter){
        return {
            require: 'ngModel',
            link: function(scope, elem, attr, ngModelCtrl) {
                ngModelCtrl.$formatters.push(function(modelValue){
                    if(modelValue) {
                      return +modelValue;
                    }else{
                      return modelValue;
                    }
                });

                ngModelCtrl.$parsers.push(function(value){
                    if(!value) {
                        return value;
                    }else{
                      return +value;
                    }
                });
            }
        };
    }])
    .directive('dateMax',['$rootScope', function($rootScope){
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function(scope, elem, attr, ngModelCtrl) {
                var max = moment($rootScope.activeResident.deadlineDate).add(+attr.addmax || 0, 'days');
                var maxdate = max.format(attr.dateMin || 'YYYY-MM-DD');
                !attr.max && elem.attr('max', max.format(attr.dateMax || 'YYYY-MM-DD'));
                ngModelCtrl.$parsers.push(function(value){
                    if(value) {
                      return max < moment(value) ? maxdate : value
                    }else{
                      return value;
                    }
                });
                ngModelCtrl.$formatters.push(function(value){
                    if(value) {
                      return max < moment(value) ? maxdate : value
                    }else{
                      return value;
                    }
                });
            }
        };
    }])
    .directive('dateMin',['$rootScope', function($rootScope){
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function(scope, elem, attr, ngModelCtrl) {
                var min = !attr.dynamicMin && moment(attr.min||new Date()).add(+attr.addmin || 0, 'days');
                var mindate = min.format(attr.dateMin || 'YYYY-MM-DD');
                !attr.min && elem.attr('min', min.format(attr.dateMin || 'YYYY-MM-DD'));
                attr.dynamicMin && scope.$watch(attr.dynamicMin, function(newval, oldval){
                  min = moment(newval).add(+attr.addmin || 0, 'days');
                })
                ngModelCtrl.$parsers.push(function(value){
                    if(value) {
                      return min > moment(value) ? (attr.defaultMin || mindate) : value
                    }else{
                      return attr.defaultMin || attr.min || value;
                    }
                });
                ngModelCtrl.$formatters.push(function(value){
                    if(value) {
                      return min > moment(value) ? (attr.defaultMin || mindate) : value
                    }else{
                      return attr.defaultMin || attr.min || value;
                    }
                });
            }
        };
    }])
    /**
     * [时间格式]
     * @param  {[type]} $filter
     * @return {[type]}             [description]
     */
    .directive('formatDate',['$filter', function($filter){
        return {
            require: 'ngModel',
            link: function(scope, elem, attr, ngModelCtrl) {
                ngModelCtrl.$formatters.push(function(modelValue){
                    if(modelValue) {
                        return new Date(modelValue);
                    }else{
                      return "";
                    }
                });

                ngModelCtrl.$parsers.push(function(value){
                    if(value) {
                      if(attr.formatDate == 'time'){
                        return value;
                      }else{
                        return moment(value).format(attr.formatDate || 'YYYY-MM-DD');
                      }
                    }else{
                      return "";
                    }
                });
            }
        };
    }])
    .directive('select',['$filter', function($filter){
        return {
            require: '?ngModel',
            restrict: 'E',
            link: function(scope, elem, attr, ngModelCtrl) {
                if(attr.selectData){
                  scope.$watch(attr.selectData, function(newval, oldval){
                    if(newval instanceof Array){
                      for (var i = 0, len = newval.length; i < len; i++) {
                        if(typeof newval[i] == 'object'){
                          if(newval[i][attr.selectVal||"value"] == ngModelCtrl.$modelValue){
                            return;
                          }
                        }else{
                          if(newval[i] == ngModelCtrl.$modelValue){
                            return;
                          }
                        }
                      }
                    }
                    ngModelCtrl.$setViewValue(elem[0].length ? (elem[0][0].value || "") : "");
                  })
                }
                if(ngModelCtrl){
                  ngModelCtrl.$formatters.push(function(value){
                    if(!value){
                      return elem[0].length ? (elem[0][0].value || "") : "";
                    }
                    return value;
                  });
                  ngModelCtrl.$parsers.push(function(value){
                      if(attr.selectData && scope[attr.selectData] && scope[attr.selectData] instanceof Array){
                        for (var i = 0, len = scope[attr.selectData].length; i < len; i++) {
                          if(typeof scope[attr.selectData][i] == 'object'){
                            if(scope[attr.selectData][i][attr.selectVal] == value){
                              return value;
                            }
                          }else{
                            if(scope[attr.selectData][i] == value){
                              return value;
                            }
                          }
                        }
                        return scope[attr.selectData][0] || "";
                      }else{
                        for (var i = 0, len = elem[0].length; i < len; i++) {
                          if(elem[0][i].value == value){
                            return value;
                          }
                        }
                        return elem[0].length ? (elem[0][0].value || "") : "";
                      }
                      return value;
                  });
                }
            }
        };
    }])
    .directive('iframe', function(){
        return {
            restrict: 'E',
            link: function(scope, elem, attr, ngModelCtrl) {
                elem.bind('load',function () {
                    var headHtml = elem[0].contentWindow.document.head.innerHTML;
                    var style="<style>*{transition: all .15s;-webkit-user-select:none; -moz-user-select:none; -ms-user-select:none; user-select:none;}</style>"
                    elem[0].contentWindow.document.head.innerHTML = headHtml + style;

                    var deptImg = elem[0].contentWindow.document.getElementsByTagName("img");
                    for(var j=0;j<deptImg.length;j++){
                        var tmpImg=deptImg[j];
                        if(tmpImg.className==""){
                            tmpImg.style.width="60%";
                            tmpImg.style.height="auto";
                        }
                    }
                    var deptA = elem[0].contentWindow.document.getElementsByTagName("a");
                    for(var j=0;j<deptA.length;j++){
                        var depta = deptA[j];
                        depta.removeAttribute('href');
                        depta.removeAttribute('target');
                        depta.setAttribute('disabled', true);
                    }

                    var deptStyle = elem[0].contentWindow.document.querySelectorAll('[style*="font-size"]');
                    for(var j=0;j<deptStyle.length;j++){
                        var fongDom = deptStyle[j];
                        var fongSize = +fongDom.style.fontSize.replace(/px|PX/g,'');
                        fongDom.style.fontSize = fongSize+2+'px';
                    }
                    elem[0].contentWindow.document.body.style.fontSize = '18px';
                });
            }
        };
    })
    .directive("ngTouchstart", [function () {
        return function (scope, elem, attrs) {
            elem.bind("touchstart mousedown", function (e) {
                elem.addClass('ng-touch');
                scope.$apply(function(){
                  scope[attrs["ngTouchstart"].replace(/\(|\)/g,'')].apply(e, angular.element(elem));
                });
            });
        }
    }])
    .directive("ngTouchend", [function () {
        return function (scope, elem, attrs) {
            elem.bind("touchend mouseup mouseover touchcancel", function (e) {
                elem.removeClass('ng-touch');
                scope.$apply(function(){
                  scope[attrs["ngTouchend"].replace(/\(|\)/g,'')].apply(e, angular.element(elem));
                });
            });
        }
    }])
    .directive("ngTouchmove", [function () {
        return function (scope, elem, attrs) {
            elem.bind("touchmove", function (e) {
                scope.$apply(function(){
                  scope[attrs["ngTouchmove"].replace(/\(|\)/g,'')].apply(e, angular.element(elem));
                });
            });
        }
    }])
    .directive("scrollY", [function () {
        return function (scope, elem, attrs) {
            var isStart = false;
            var start = {x:0,y:0};
            var direction = attrs.direction || 1;//1-y  0-x
            var isBreak = false;
            var verify = false;
            var body = angular.element(document.body);
            var parent = elem.parent()[0];
            parent.style.overflow='auto';
            elem.bind("touchstart mousedown", function (e) {
                isStart = true;
                start.x = e.offsetX;
                start.y = e.offsetY;
            });
            elem.bind("touchmove mousemove", function (e) {
              if(isStart){
                if(direction == 1 && !isBreak){
                  if(verify){
                    var diff = e.offsetY - start.y;
                    parent.scrollTop = parent.scrollTop + (diff > 0 ? (diff - 10) : (diff + 10));
                    console.log(parent.scrollTop);
                    e.stopPropagation();
                    return;
                  }
                  if(!verify && Math.abs(e.offsetX - start.x) > 10){
                    isBreak = true;
                    verify = false;
                  }
                  if(!isBreak && Math.abs(e.offsetY - start.y) > 10){
                    verify = true;
                  }
                }
                if(direction == 0 && !isBreak && Math.abs(e.offsetY - start.y) > 10){ 
                  isBreak = true;
                }
              }
            });
            body.bind("touchend mouseup", function (e) {
                isStart = false;
                start = {x:0,y:0};
                isBreak = false;
                verify = false;
            });
        }
    }])

    .directive('onRecord',[function(){
        return {
            restrict: 'AE',
            link: function(scope, elem, attr) {
                var media = document.createElement("audio"),
                    isPlay = false, self = this, source,
                    playUrl = 0;
                    sourceUrl = [];
                media.autoplay = false;
                if(attr.media){
                  if(scope[attr.media]){
                    scope[attr.media].stop = (function(){
                      playUrl = 0;
                      stop();
                    }).bind(self);
                    scope[attr.media].audio = media;
                  }
                }

                function setSource(){
                  source = document.createElement("source");
                  source.src = sourceUrl[playUrl];
                  media.src = sourceUrl[playUrl];
                  for(var i = 0; i < media.childNodes.length; i++) { 
                    media.removeChild(media.childNodes[i]);
                  }
                  playUrl++;
                  media.appendChild(source);
                }

                scope.$watch(attr.onRecord + '.url', function(){
                  sourceUrl = scope[attr.onRecord].url.split(';');
                  // for (var i = 0; i < urls.length; i++) {
                  setSource();
                  // }
                });

                media.ondurationchange = function(length){
                    scope.$apply(function(){
                        scope[attr.onRecord].seconds = media.duration||10;
                    })
                };

                angular.element(media).on('playing', function(){
                    elem.removeClass('loadding');
                    elem.addClass('play');
                    isPlay = true;
                });

                angular.element(media).on('pause', function(){
                    if(playUrl && sourceUrl.length > playUrl){
                      setSource();
                      media.play();
                      return;
                    }
                    elem.removeClass('play');
                    elem.removeClass('loadding');
                    isPlay = false;
                    scope.$apply(function(){
                        scope[attr.onRecord].play = false;
                    })
                });

                function stop(){
                  media && media.pause();
                }

                elem.on('click', function(){
                    if(!isPlay && !scope[attr.onRecord].error && scope[attr.onRecord].seconds){
                        elem.addClass('loadding');
                        media.play();
                        scope.$apply(function(){
                            scope[attr.onRecord].play = true;
                        })
                    }else{
                        scope.$apply(function(){
                            scope[attr.onRecord].play = false;
                        })
                        playUrl = 0;
                        source.url = sourceUrl[playUrl];
                        media.pause();
                    }
                })
            }
        };
    }])
    .directive('countDown',['$filter', '$interval', function($filter, $interval){
        return {
            restrict: 'A',
            link: function(scope, elem, attr) {
                scope.countdownstart = false;
                function timer(time){
                  scope.n = angular.copy(time);
                  var time = $interval(function () {
                      scope.n--;
                      scope[attr.handler] && scope[attr.handler](scope.n);
                      if (scope.n == 0)
                      {
                          scope.countdownstart = false;
                          $interval.cancel(time);
                      }
                  },1000);
                }
                scope.$watch(attr.countDown, function(newval, oldval){
                  if(!newval || newval == 0 || scope.countdownstart){
                    return;
                  }
                  scope.countdownstart = true;
                  timer(+newval);
                })
            }
        };
    }])
    .factory('$text2voice', ['$rootScope', '$User',
      function($rootScope, $User) {
        var user = $User.getUser();
        var TTS = function(){
          this.textArray = [];
        };
        TTS.prototype = {
          speak: function(textArray){
            this.textArray = textArray;
            ZcarezeApp.Native.java("speak", JSON.stringify(this.textArray));
          },
          stop: function(){
            this.textArray = [];
            ZcarezeApp.Native.java("onSpeakStop", null);
          }
        };
      return new TTS();
    }]);
    /**
     * 接口配置
     */
    ZcarezeApp
        .factory('$API', ['API', '$http', '$rootScope', '$ionicLoading', '$state', 'User', '$timeout', '$ionicPopup', '$cookieStore', function(API, $http, $rootScope, $ionicLoading, $state, User, $timeout, $ionicPopup, $cookieStore){

            var _$http = $http;
            var _$ionicLoading = $ionicLoading;
            var _$ionicPopup = $ionicPopup;
            var _defaultConfig = {
                timeout: 20000,
                withCredentials: true
            };
            $rootScope.loading = {
                autoHide: true,
                show: true,
                over: true
            };
            $rootScope.popup = {
                show: true
            };

            return  API.setHttp(function(indata, _opt, _promise){
                var self = this;

                var _config = angular.extend({}, _defaultConfig, _opt);

                API.config = angular.extend({}, API.config, ZcarezeApp.ClientService);
                // 模拟http请求
                !$rootScope.loading.forbid && $rootScope.loading.show && _$ionicLoading.show({
                    template: $rootScope.loading.template || '<ion-spinner icon="spiral"></ion-spinner>'
                });
                $rootScope.loading.template = '';
                $cookieStore;
                $rootScope.loading.over = false;
                return _$http.post(API.config.server_address + '/' + API.config.ServiceVersions,
                    indata, _config || {})
                    .success(function(data, status, headers, config){
                        !$rootScope.loading.forbid && $rootScope.loading.autoHide && $ionicLoading.hide();
                        $rootScope.loading.show = true;
                        $rootScope.loading.over = true;
                        if(data.code == 9){
                            User && User.exit(true);
                            $rootScope.loading.autoHide = true;
                            // $timeout(function(){
                            //   _$ionicLoading.hide();
                            // }, 100);
                        }
                        if(_promise.result(data)){
                            $timeout(function(){
                                self.execute('result', data);
                            }, 150);
                        }else{
                            $timeout(function(){
                                self.execute('error', data || {});
                            }, 150);
                            !$rootScope.loading.forbid && $rootScope.popup.show && $rootScope.alert({
                                title: '请求错误!',
                                template: data.message,
                                cssClass: 'error-type',
                                buttons: [
                                    {
                                      text: '关闭',
                                      type: 'button-energized'
                                    }
                                  ]
                            });
                        }
                        $rootScope.popup.show = true;
                    })
                    .error(function(data, status){
                        !$rootScope.loading.forbid && $ionicLoading.hide();
                        if(status == -1){
                            !$rootScope.loading.forbid && $rootScope.popup.show && $rootScope.alert({
                                title: '连接异常',
                                template: '服务器未能及时响应，请检查设备网络或通知管理员！',
                                cssClass: 'error-type',
                                buttons: [
                                  {
                                    text: '关闭',
                                    type: 'button-energized'
                                  }
                                ]
                            });
                        }
                        $rootScope.popup.show = true;
                        $rootScope.loading.show = true;
                        $rootScope.loading.over = true;
                        $rootScope.loading.autoHide = true;
                        self.execute('error', data || {});
                    });
            }, API.config);
        }])
        .factory('$CLIENT', ['$http', '$rootScope', '$ionicLoading', function($http, $rootScope, $ionicLoading){

            var httprequst = function(url, data){

                return $http({
                    method: 'POST',
                    url: ZcarezeApp.ClientService.client_address + url,
                    params: {
                      data: data
                    },
                    timeout: 10000,
                });
            }

            var client = function(){};
            client.prototype.load = function(data){
                return httprequst('/client/startup/load', data || {});
            };
            client.prototype.achievesms = function(data){
                return httprequst('/client/message/achievesms', data || {});
            };
            client.prototype.qrcode = function(data){
                return httprequst('/wechat/produce/qrcode', data || {});
            };
            return  new client();
        }]);

    /**
     * 创建modelView服务
     */
    
    /**
     * options={
     *  class: "",
     *  offShadeClick: true//false
     * }
     */
    ZcarezeApp
      .service('modelView',['$rootScope', '$animateCss', function($rootScope, $animateCss) {

        function modelView(){
          var options = {}, cstateName = "";
          this.modelViews = {};
          this.modelStates = [];
          this.rootScope = {};
          this.isOpen = false;
          this.offEvent = false;
          this.transform = Utils.transform;
          this.setOption = function(opt){
            options = opt || {};
          }
          this.getOption = function(){
            return options || {};
          }
          this.setStateName = function(state){
            cstateName = state || "";
          }
          this.getStateName = function(){
            return cstateName || "";
          }
          this.clear = function(num, clearall){
            var states = Object.getOwnPropertyNames(this.modelViews),
                len = num ? num : states.length;
            if(clearall){
              var key = Object.getOwnPropertyNames(this.modelViews);
              for (var i = key.length-1; i >= 0; i--) {
                options = this.modelViews[key[i]].options;
                delete this.modelViews[key[i]];
              }
              for (var i = this.modelStates.length-1; i >= 0; i--) {
                this.modelStates.splice(this.modelStates[i], 1);
              }
            }
            for (var i = 0; i < len; i++) {
              if(!this.modelStates.length){
                return;
              }
              var state = this.modelStates.shift();
              options = this.modelViews[state].options;
              delete this.modelViews[state];
            }
            // for (var i = (len-1); i >= 0 ; i--) {
            //   options = this.modelViews[this.modelStates[i]].options;
            //   delete this.modelViews[this.modelStates[i]];
            //   this.modelStates.splice(this.modelStates[i], 1);
            // }
          }
        }
        modelView.prototype = {
          setDom: function(){
            this.view = document.querySelector('[name="modelView"]') || "";
            this.shade = document.querySelector('#view-modelView-shade') || "";
            this.panel = document.querySelector('#view-modelView-panel-shade') || "";
            this.body = document.querySelector('body');
          }
        }

        modelView.prototype.animate = function(from, to, duration, handler){
          var _this = this,_from = {},_to = {};

          _from[_this.transform] = from,
          _to[_this.transform] = to;

          $animateCss(_this.viewDom, {
              easing: 'ease-out',
              from: _from,
              to: _to,
              duration: duration || 0.25
          }).start().done(function(){
            typeof handler == "function" && handler();
          });
        }
        modelView.prototype.hide = function(handler){
          var _this = this, curopt = _this.getOption();
          this.shade.classList.add('ng-hide');
          this.panel.classList.add('ng-hide');
          this.body.classList.remove('open-model');
          this.isOpen && this.animate('translate3d(0 ,0 , 0)', 
            (this.view.classList.toString()).split(' ').indexOf("popup") > -1 ?
            'translate3d(0 ,110% , 0)':
            'translate3d(-110% ,0 , 0)'
            , 0.25, function(){
            handler && handler();
            if(curopt.class){
               _this.viewDom.removeClass(curopt.class);
               _this.setOption({});
            }
          });
        }
        modelView.prototype.clearHistory = function(num, clearall){
          this.clear(num, clearall);
        }
        modelView.prototype.show = function(){
          var _this = this, curopt = _this.getOption();
          this.shade.classList.remove('ng-hide');
          this.panel.classList.remove('ng-hide');
          this.body.classList.add('open-model');
          if(this.modelViews[this.crstate].options.class){

            this.viewDom.addClass(this.modelViews[this.crstate].options.class);
          }
          !this.isOpen && this.animate(
            (this.view.classList.toString()).split(' ').indexOf("popup") > -1 ?
            'translate3d(0 ,110% , 0)' :
            'translate3d(-110% ,0 , 0)', 
            'translate3d(0 ,0 , 0)', null);
          this.isOpen = true;
        }
        modelView.prototype.init = function(rootScope){
          this.rootScope = rootScope;
          
          this.rootScope.modelView = {
            visibility: false,
            close: this.close
          }
          this.setDom();
          this.viewDom = angular.element(this.view);
        }
        return new modelView();
    }])
    .factory('rootModelView', ['$rootScope', '$state', 'modelView', 
      function($rootScope, $state, modelView) {
      return modelView;
    }])
    .factory('$modelView', ['$rootScope', '$state', 'modelView',
      function($rootScope, $state, modelView) {

        function modelViewFactory(){}
        modelViewFactory.prototype = modelView;
        modelViewFactory.prototype.go = function(to, params, opt, isPopup){
          var _this = this;
          !isPopup ? 
          _this.view.classList.remove('popup'):
          _this.view.classList.add('popup');
          _this.toState = to;
          _this.setStateName(to);
          _this.offEvent = false;
          _this.modelViews[_this.toState] = {
            params: params
          };
          if(_this.modelStates.indexOf(_this.toState)>-1){
            _this.modelStates.splice(_this.modelStates.indexOf(_this.toState), 1);
          }
          _this.modelStates.unshift(_this.toState);
          $state.go(to, params, opt);
          return {
            callback: function(handler, scope){
              _this.modelViews[_this.toState].handler = handler,
              _this.modelViews[_this.toState].scope = scope;
            }
          }
        }
        modelViewFactory.prototype.popup = function(to, params, opt){
          return this.go(to, params, opt, true);
        }
      return new modelViewFactory();
    }])
    .factory('$initModelView', ['$rootScope', '$state', 'modelView',  '$ionicHistory',
      function($rootScope, $state, modelView, $ionicHistory) {
        var options = {
          transition: true
        }
        function initModelFactory(){
          this.init = function(scope, opt){
            var _this = this;
            angular.extend(options, opt);
            _this.transition = options.transition;
            _this.crstate = _this.getStateName();
            if(!_this.modelViews[_this.crstate])
              return;
            _this.setOption(opt);
            _this.modelViews[_this.crstate].options = opt;
            _this.show();
            scope.$on('$ionicView.enter', function(event, state){
              _this.crstate = state.stateName;
              if(!_this.modelViews[_this.crstate])
                return;
              _this.setOption(opt);
              _this.modelViews[_this.crstate].options = _this.getOption();
              _this.modelViews[_this.crstate].modelScope = event.currentScope;
              _this.offEvent = _this.modelViews[_this.crstate].options.offShadeClick;
              _this.show();
            });
            // scope.$on('$ionicView.enter', function(event, state){
              // _this.crstate = state.stateName;
              
            // });
            !scope.modelView ? (scope.modelView = {}) : !0;
            scope.modelView.back = _this.back.bind(_this);
            scope.modelView.close = _this.close.bind(_this);
            return {
              getParams: function(){
                return _this.modelViews[_this.crstate].params || null;
              }
            };
          }
        }
        initModelFactory.prototype = modelView;
        initModelFactory.prototype.over = function(){
          var _this = this;
          this.hide(function(){
            _this.view.attributes.style && _this.view.attributes.removeNamedItem('style');
          });
          this.isOpen = false;
        }
        initModelFactory.prototype.back = function(data, backNum, isClose){
          var _this = this;
       
          if(this.modelViews.hasOwnProperty(this.crstate)){ 
            var backViewId = $ionicHistory.currentView().backViewId, prvState = backViewId ? $ionicHistory.getViewById(backViewId).stateName : null,
                modelState = isClose ? this.modelStates[this.modelStates.length-1] : (function(backNum){
                  if(!backNum || backNum == 1){
                    return _this.modelStates[0];
                  }else if(_this.modelStates.length >= backNum){
                    return _this.modelStates[backNum-1];
                  }else{
                    return _this.modelStates[_this.modelStates.length - 1];
                  }
                })(backNum);
            this.modelViews[modelState].handler &&
            this.modelViews[modelState].handler.call(this.modelViews[modelState].scope, data);

            if(!/model/.test(prvState)){
              this.clearHistory();
              this.over();
            }
            if(isClose){
              this.clearHistory(backNum, isClose);
              this.over();
            }else{
              if(this.modelViews[this.crstate]){
                this.clearHistory(backNum || 1);
              }
            }
            this.offEvent = this.getOption().offShadeClick
            $ionicHistory.goBack((!backNum ? -1 : (backNum < 0 ? backNum : (-1 * backNum))));
          }
        }
        initModelFactory.prototype.close = function(data, isShade){
          if(isShade && this.offEvent){
            return;
          }
          var backNum = Object.getOwnPropertyNames(this.modelViews);
          this.back(data, backNum.length, true);
        }
      return new initModelFactory();
    }])
    .factory('$minialert', ['$rootScope', '$state', '$timeout', '$animateCss',
      function($rootScope, $state, $timeout, $animateCss) {
        $rootScope.minialert = {
          show: false,
          showicon: false,
          content: "",
          autohide: false,
        }
        function minialert(){
          this.view = angular.element(document.querySelector('#minialert'));
        }
        minialert.prototype.show = function(content, showicon, autohide, time){
          var self = this;
          $rootScope.minialert.content = content;
          $rootScope.minialert.show = true;
          $rootScope.minialert.showicon = showicon;
          if(!self.autohide && autohide){
            self.autohide = autohide;
            $timeout(function(){
              var animater = $animateCss(self.view, {
                  easing: 'ease-out',
                  from: {opacity: 0.6},
                  to: {opacity: 0},
                  duration: 0.35
              });
              animater.start().done(function(){
                self.close();
                $timeout(function(){
                  self.view.removeAttr('style');
                  self.autohide = false;
                },1);
              });
            },time || 300);
          }
        }
        minialert.prototype.close = function(content, showicon){
        	
          $rootScope.minialert.show = false;
          $rootScope.minialert.content = "";
          $rootScope.minialert.showicon = showicon;
        }
      return new minialert();
    }]);

    /**
     * 列表滑动事件
     */
    ZcarezeApp
    .directive('zListLeft', ['$timeout', '$ionicListDelegate',
      function($timeout, $ionicListDelegate) {
        return {
          restrict: 'A',
          link: function(scope, element, attrs) {
            ionic.EventController.onGesture("release", function(event){
              var transform = event.currentTarget.parentElement.style[Utils.transform];
              var vals = [];
              if(event.gesture.direction != 'right'){
                event.currentTarget.classList.remove('z-open-left');
                $timeout(function(){
                  $ionicListDelegate.canSwipeItems(true);
                }, 100);
                return;
              }
              if(transform && (vals = transform.match(/\((.*)/g)) && vals.length){
                 var trx = vals[0].replace(/\(|\)/g,'').split(',');
                 var a = trx[0] ? trx[0].replace(/px/,'') : '0';
                 if(+a == 0){
                    event.currentTarget.classList.add('z-open-left');
                    $ionicListDelegate.canSwipeItems(false);
                 }
              }
              
            }, element[0])
          }
        }
      }
    ])
    .directive('zListOff', ['$timeout', '$ionicListDelegate',
      function($timeout, $ionicListDelegate) {
        return {
          restrict: 'A',
          link: function(scope, element, attrs) {
            ionic.EventController.onGesture("touch", function(event){
              if(/button/g.test(event.target.className)){
                return;
              }
              var a  = null;
              if(a = document.querySelector('.z-open-left')){
                a.classList.remove('z-open-left');
                $timeout(function(){
                  $ionicListDelegate.canSwipeItems(true);
                }, 100);
              }
            }, element[0])
          }
        }
      }
    ]);
})(ZcarezeApp);
