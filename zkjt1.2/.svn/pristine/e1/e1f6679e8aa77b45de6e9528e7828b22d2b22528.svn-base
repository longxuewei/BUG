(function (ZcarezeApp, require){
  // 配置加载模块
  ZcarezeApp
  .constant('FileServerConfig', {
    server: 'http://zcareze-audio-test.oss-cn-hangzhou.aliyuncs.com',
    bucket: 'zcareze-audio-test'// bucket: 'zcareze-audio'
  })
  .provider('SetClientService', function(){
    this.$get = function(){
      return {
        initClientService: function(){
          ZcarezeApp.ClientService = angular.extend(ZcarezeApp.ClientService, {
            server_address: sessionStorage.getItem('ClientService') || ZcarezeApp.ClientService.server_address,
            client_address: sessionStorage.getItem('ClientService') || ZcarezeApp.ClientService.client_address,
            ServiceVersions: sessionStorage.getItem('ServiceVersions') || ZcarezeApp.ClientService.ServiceVersions,
            Dictionary: {
              versions: '1.0',
              dbName: (sessionStorage.getItem('ClientService') || ZcarezeApp.ClientService.server_address).replace(/:|\/|\.|/g, ''),
              dbDesc: '基础字典库',
              dbSize: 1024 * 1024
            }
          })
        }
      }
    }
  })
  .provider('zcarezeCSRF',[function(){
      var headerName = 'X-CSRFToken';
      var cookieName = 'csrftoken';
      var allowedMethods = ['GET'];

      this.setHeaderName = function(n) {
        headerName = n;
      }
      this.setCookieName = function(n) {
        cookieName = n;
      }
      this.setAllowedMethods = function(n) {
        allowedMethods = n;
      }
      this.$get = ['$cookies', function($cookies){
        return {
          'request': function(config) {
            if(allowedMethods.indexOf(config.method) === -1) {
              // do something on success
              config.headers[headerName] = $cookies[cookieName];
            }
            return config;
          }
        }
      }];
  }])
  
  .run(['$http', '$cookies', function($http, $cookies) {
    $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
  }])
  //AngularJS v1.3.x 兼容历史版本的控制器  异步controller
  .config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$locationProvider', '$ionicConfigProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $controllerProvider, $locationProvider, $ionicConfigProvider, $httpProvider) {
    // 依赖老版本的AngularJS的组件兼容
    $controllerProvider.allowGlobals();

    // $locationProvider.html5Mode(true);

    // 异步加载controller
    ZcarezeApp.registerController = $controllerProvider.register;
    ZcarezeApp.loadControllerJs = function (controller) {
      return function( $rootScope , $q){
        var def = $q.defer(), deps = [];
        angular.isArray(controller) ? (deps = controller) : deps.push(controller);

        require(deps, function() {
            $rootScope.$apply(function(){
              def.resolve();
            });
        });

        return def.promise;
      };
    };


    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
      /**
       * The workhorse; converts an object to x-www-form-urlencoded serialization.
       * @param {Object} obj
       * @return {String}
       */
      var param = function(obj) {
        var query = '';
        var name, value, fullSubName, subName, subValue, innerObj, i;

        for (name in obj) {
          value = obj[name];

          if (value instanceof Array) {
            for (i = 0; i < value.length; ++i) {
              subValue = value[i];
              fullSubName = name + '[' + i + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += param(innerObj) + '&';
            }
          } else if (value instanceof Object) {
            for (subName in value) {
              subValue = value[subName];
              fullSubName = name + '[' + subName + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += param(innerObj) + '&';
            }
          } else if (value !== undefined && value !== null) {
            query += encodeURIComponent(name) + '='
                + encodeURIComponent(value) + '&';
          }
        }

        return query.length ? query.substr(0, query.length - 1) : query;
      };

      return angular.isObject(data) && String(data) !== '[object File]'
          ? param(data)
          : data;
    }];


    var options = {
      views: {
        transition: 'android',
        swipeBackEnabled: true,
        maxCache: 5
      },
      navBar: {
        alignTitle: 'center',
        positionPrimaryButtons: 'right',
        positionSecondaryButtons: 'right'
      },
      backButton: false,
      form: {
        checkbox: 'square',
        toggle: 'small'
      },
      spinner: {
        icon: 'ios'
      },
      scrolling: {
        jsScrolling: true
      }
    }

    $ionicConfigProvider.setPlatformConfig('android', options);
    $ionicConfigProvider.setPlatformConfig('ios', options);

    $ionicConfigProvider.views.swipeBackEnabled(false);

    $ionicConfigProvider.views.forwardCache(true);

    $httpProvider.interceptors.push('zcarezeCSRF');
  }]);

  // configure moment relative time
  // moment.locale('zh', {
  //   relativeTime: {
  //     future: "in %s",
  //     past: "%s 前",
  //     s: "%d 秒",
  //     m: "1 分钟",
  //     mm: "%d 分钟",
  //     h: "一小时",
  //     hh: "%d 小时",
  //     d: "一天",
  //     dd: "%d 天",
  //     M: "一个月",
  //     MM: "%d 个月",
  //     y: "一年",
  //     yy: "%d 年"
  //   }
  // });

})(ZcarezeApp, require);