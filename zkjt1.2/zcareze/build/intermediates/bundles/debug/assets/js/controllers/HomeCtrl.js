(function (ZcarezeApp){
  ZcarezeApp.config(["$sceProvider", "$httpProvider", "$logProvider", "$stateProvider", "$urlRouterProvider", function($sceProvider,$httpProvider,$logProvider,$stateProvider,$urlRouterProvider) {

    var ictionaryTables = {}, dictionaryTableName = [];

    $stateProvider

      .state('app',{
          abstract: true,
          templateUrl:"view/frame.html",
          controller: "AppControler",
          resolve: {
              dictionaryTables: function($http) {
                  return dictionaryTableName.length ? dictionaryTables : $http.get("js/service/dictionary.json").success(function(data){
                    dictionaryTables = {data: data};
                    dictionaryTableName = Object.getOwnPropertyNames(data);
                  });
              }
          }
      })

      //登录
      .state('login',{
          templateUrl:"view/common/login.html",
          controller:"LoginCtrl",
          cache: false,
          resolve:{
              deps:ZcarezeApp.loadControllerJs('js/controllers/common/LoginCtrl.js')
          }
      })

      .state('app.home',{
          data:{
            allowMonitor: true
          },
          views:{
              'home-view':{
                  templateUrl:"view/home/index.html",
                  controller:"HomeCtrl",
                  resolve:{
                      deps:ZcarezeApp.loadControllerJs('js/controllers/home/HomeCtrl.js')
                  }
              }
          }
      })
      .state('app.home-calendar',{
          views:{
              'home-view':{
                  templateUrl:"view/home/calendar.html",
                  controller:"CalendarCtrl",
                  resolve:{
                      deps:ZcarezeApp.loadControllerJs('js/controllers/home/CalendarCtrl.js')
                  }
              }
          }
      })
      .state('app.home-monitorrecord',{
          params:{
            device:null
          },
          views:{
              'home-view':{
                  templateUrl:"view/home/monitorrecord.html",
                  controller:"MonitorRecordCtrl",
                  resolve:{
                      deps:ZcarezeApp.loadControllerJs('js/controllers/home/MonitorRecordCtrl.js')
                  }
              }
          }
      })
      .state('app.home-PsychologicalEval',{
          views:{
              'home-view':{
                  templateUrl:"view/home/psychologicaleval.html",
                  controller:"PsychologicalEvalCtrl",
                  resolve:{
                      deps:ZcarezeApp.loadControllerJs('js/controllers/home/PsychologicalEvalCtrl.js')
                  }
              }
          }
      })
      .state('app.home-ExerciseGuid',{
          views:{
              'home-view':{
                  templateUrl:"view/home/exerciseguid.html",
                  controller:"ExerciseGuidCtrl",
                  resolve:{
                      deps:ZcarezeApp.loadControllerJs('js/controllers/home/ExerciseGuidCtrl.js')
                  }
              }
          }
      })
      .state('app.home-NutritionalGuid',{
          views:{
              'home-view':{
                  templateUrl:"view/home/nutritionalguid.html",
                  controller:"NutritionalGuidCtrl",
                  resolve:{
                      deps:ZcarezeApp.loadControllerJs('js/controllers/home/NutritionalGuidCtrl.js')
                  }
              }
          }
      })
      .state('app.home-PsychologicalEval-ask',{
      
          views:{
              'home-view':{
                  templateUrl:"view/home/ask.html",
                  controller:"AskCtrl",
                  resolve:{
                      deps:ZcarezeApp.loadControllerJs('js/controllers/home/AskCtrl.js')
                  }
              }
          }
      })
      .state('app.home-PsychologicalEval-ask-code',{
          views:{
              'home-view':{
                  templateUrl:"view/home/dialog/askCode.html",
                  controller:"AskCodeCtrl",
                  resolve:{
                      deps:ZcarezeApp.loadControllerJs('js/controllers/home/AskCodeCtrl.js')
                  }
              }
          }
      })
      .state('app.home-medicineManage',{
          views:{
              'home-view':{
                  templateUrl:"view/home/medicineManage.html",//用药管理
                  controller:"MedicineManageCtrl",
                  resolve:{
                      deps:ZcarezeApp.loadControllerJs('js/controllers/home/MedicineManageCtrl.js')
                  }
              }
          }
      });
  }])
})(ZcarezeApp)