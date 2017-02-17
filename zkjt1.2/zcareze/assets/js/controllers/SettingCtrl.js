(function (ZcarezeApp){
  ZcarezeApp.config(["$sceProvider", "$httpProvider", "$logProvider", "$stateProvider", "$urlRouterProvider", function($sceProvider,$httpProvider,$logProvider,$stateProvider,$urlRouterProvider) {

    $stateProvider
      // 居民列表
      .state('app.model-setting', {
          views:{
              'modelView':{
                  templateUrl: "view/settings/settings.html",
                  controller: "SettingsCtrl",
                  resolve: {
                    deps: ZcarezeApp.loadControllerJs('js/controllers/settings/SettingsCtrl.js')
                  }
              }
          }
      })
  }])
})(ZcarezeApp)