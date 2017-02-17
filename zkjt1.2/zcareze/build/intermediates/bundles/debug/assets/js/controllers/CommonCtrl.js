(function (ZcarezeApp){
  ZcarezeApp.config(["$sceProvider", "$httpProvider", "$logProvider", "$stateProvider", "$urlRouterProvider", function($sceProvider,$httpProvider,$logProvider,$stateProvider,$urlRouterProvider) {

    // $stateProvider
    //   // 居民列表
    //   .state('app.common-model-residents', {
    //       views:{
    //           'modelView':{
    //               templateUrl: "view/modelview/common/residents.html",
    //               controller: "ResidentsModelCtrl",
    //               resolve: {
    //                 deps: ZcarezeApp.loadControllerJs('js/controllers/model/common/ResidentsModelCtrl.js')
    //               }
    //           }
    //       }
    //   })
  }])
})(ZcarezeApp)