(function (ZcarezeApp){
  ZcarezeApp.config(["$sceProvider", "$httpProvider", "$logProvider", "$stateProvider", "$urlRouterProvider", function($sceProvider,$httpProvider,$logProvider,$stateProvider,$urlRouterProvider,$http) {
     
    $stateProvider
      .state('app.knowledge',{
          views:{
              'knowledge-view':{
                  templateUrl:"view/knowledge/knowledge.html",
                  controller:"KnowledgeCtrl",
                  resolve:{
                      deps:ZcarezeApp.loadControllerJs('js/controllers/knowledge/KnowledgeCtrl.js')
                  }
              }
          }
      })
      
      .state('app.knowledge-info',{
      	 params:{dataInfo:null},
          views:{
              'knowledge-view':{
                  templateUrl:"view/knowledge/knowledgepage.html",
                  controller:"KnowledgepageCtrl",
                  resolve:{
                      deps:ZcarezeApp.loadControllerJs('js/controllers/knowledge/KnowledgepageCtrl.js')
                  }
              }
          }
      })
      ;
      
  }]);

})(ZcarezeApp)