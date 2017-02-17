(function (ZcarezeApp, W){
    function baseOption(){
      return {
          tooltip: {
            trigger: 'axis',
            triggerOn: 'click',
            backgroundColor: 'rgba(0, 175, 240, 0.5)',
            extraCssText: 'box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.2)',
            axisPointer: {
              lineStyle:{
                  color: '#dedede',
                  type: 'dashed'
              }
            }
          },
          grid: {
            top: 5,
            left: 10,
            right: 10,
            bottom: 0,
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: [],
            axisLabel: { //坐标标签显示
              show: false
            },
            axisTick: { //坐标刻度显示
              length: 3,
              interval:0,
              inside: true //刻度向内
            },
            boundaryGap: true
          },
          yAxis: {
            type: 'value',
            axisLabel: { //坐标标签显示
              show: false
            },
            splitLine: {
              show: false
            },
            axisTick: { //坐标刻度显示
              length: 3,
              inside: true //刻度向内
            }
          },
          dataZoom: {
            show: false
          },
          series: []
        };
    }

    function getMackArea(yAxis, option){
      return {
                silent: true,
                data: [[{
                    yAxis: yAxis[0]
                }, {
                    yAxis: yAxis[1]
                }]],
                itemStyle:{
                  normal:{
                    color: option.color || "#33ce55",
                    opacity: option.opacity || 0.2
                  }
                }
            }
    }

    function getMackLine(name, yAxis, label, option){
      var defualt = {
            name: name,
            symbol: 'none',
            x: '42px',
            yAxis: yAxis,
            label: {
              normal: {
                position: 'start',
                formatter: label
              }
            },
            lineStyle:{
                normal: {
                  type:'dotted'
              }
            }
          };
      if(option && option.color){
        defualt.lineStyle.normal.color = option.color;
      }
      if(option && option.opacity != '' || option.opacity != undefined){
        defualt.lineStyle.normal.opacity = option.opacity;
      }
      return [defualt, {
              symbol: 'none',
              x: '98.5%',
              yAxis: yAxis
            }];
    }

    function getGraph(name, type, data, symbol, itemStyle){
      var defualt = {
          name: name, 
          type: type,
          data: data || seriesData,
          symbolSize: 4
      }
      if(itemStyle){
        defualt.lineStyle = {normal: {color: itemStyle}},
        defualt.itemStyle = {normal: {color: itemStyle}};
      }
      if(symbol){
        defualt.symbol = symbol;
      }
      return defualt;
    }



  	ZcarezeApp
    .directive('graphModel', ['$timeout', '$rootScope', '$API', '$filter', '$state',
    function($timeout, $rootScope, $API, $filter, $state) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                /**
                 * 打开视图
                 * @param  {[type]} index [description]
                 * @return {[type]}       [description]
                 * special
                 */
                var _this = this,
                    graph,
                    option = {},
                    itemId = scope[attrs.graphid]
                    graphData = scope[attrs.graphModel],
                    seriesData = [],
                    graphShade = element[0].nextElementSibling,
                    graphBox = angular.element(element[0].parentNode),

                    pageNow = 0,
                    pageSize = 30,

                    iniOption = function(){
                        graphDataLoading = false;
                        option = angular.extend({}, baseOption());
                    }

                scope.graphData = graphData;
                scope.leftover = false;
                scope.graphDataLoading = false;

                function move(direction){
                  var temp = option.dataZoom;
                  var _option = {
                    dataZoom:{
                      endValue: 0,
                      startValue: 0
                    }
                  }
                  if(direction == -1 ? (temp.endValue < seriesData.length-1) : (temp.startValue > 0)){
                    option.dataZoom.endValue = _option.dataZoom.endValue = temp.endValue + (-direction);
                    option.dataZoom.startValue = _option.dataZoom.startValue = temp.startValue + (-direction);
                  }else{
                    if(temp.startValue == 0){
                        scope.$apply(function(){
                          scope.graphDataLoading = true;
                        })
                        getGraphData(1);
                    }
                    return;
                  }
                  graph.setOption(_option);
                }

                var zrX = 0;
                var movelock = false;
                function touchmove(event){
                    console.log(event.zrX-zrX);
                    var difference = event.zrX - zrX;
                    if(Math.abs(difference) > 30){
                      movelock = true;
                      zrX = event.zrX;
                      difference < 0 ? move(-1) : move(1);
                    }
                    if(movelock){
                      event.stopPropagation();
                      event.preventDefault();
                    }
                }
                element.on('touchstart mousedown',function(event){
                    zrX = event.zrX;
                    element.on('touchmove mousemove', touchmove);
                });
                element.on('touchend touchcancel mouseout mouseup',function(event){
                    zrX = 0;
                    movelock = false;
                    element.off('touchmove mousemove', touchmove);
                });

                function initGraph() {
                    iniOption();
                    graph = W.echarts.init(element[0]);
                    graph && graph.clear && graph.clear();
                    graph.setOption(option);
                    getGraphData();
                }

                function refresh(){
                    graph && graph.clear && graph.clear();
                    getGraphData();
                }

                function overLoading(){
                }

                function initSetOption(data){
                    var series = [];
                    var graph = angular.copy(data);
                    switch(graph.special){
                      case '13':// 血糖
                        series.push(getGraph(graph.itemName, 'scatter', seriesData.map(function (item) {
                            return {
                              value: item.rawResult,
                              name: item.subtitle,
                              symbol: item.subtitle == '餐前' ? 'rect' : 'triangle',
                              symbolRotate: item.subtitle == '餐前' ? 90 : 0,
                              symbolSize: item.subtitle == '餐前' ? 6 : 8,
                              itemStyle: {
                                normal:{
                                    color: item.subtitle == '餐前' ? '#33ce55' : '#00AFF0'
                                 }
                              }
                            };
                        })));
                        option.grid.left = 20;
                        graph.aimMin = (graph.aimMin+"").split('/');
                        graph.aimMax = (graph.aimMax+"").split('/');
                        series[0].markLine = {
                          data: [
                                  getMackLine('餐后最大值', graph.aimMax[0], '餐前', {color: "#33ce55"}),
                                  getMackLine('餐前最大值', graph.aimMax[1], '餐后',  {color: "#00AFF0"}),
                                  getMackLine('目标最小值', graph.aimMin[0], '最低值',  {color: "#ff7f7f"})
                                ]
                        };
                      break;
                      case '11':// 血压
                        series.push(getGraph('收缩压', 'line', seriesData.map(function (item) {
                            return item.rawResult.split('/')[0];
                        }), 'rect', '#15b5f1'));

                        graph.aimMin = (graph.aimMin+"").split('/');
                        graph.aimMax = (graph.aimMax+"").split('/');

                        series[0].markArea = getMackArea([graph.aimMin[0], graph.aimMax[0]], {color: "#00AFF0"});
                        series[0].markLine = {
                          data: [
                                  getMackLine('目标值范围', ((+graph.aimMax[0]-graph.aimMin[0])/2)+graph.aimMin[0], '收缩压', {color: "#00AFF0", opacity: 0}),
                                  getMackLine('最高:'+graph.aimMax[0], +graph.aimMax[0], graph.aimMax[0], {color: "#00AFF0", opacity: 1}),
                                  getMackLine('最低:'+graph.aimMin[0], +graph.aimMin[0], graph.aimMin[0], {color: "#00AFF0", opacity: 1})
                                ]
                        };

                        series.push(getGraph('舒张压', 'line', seriesData.map(function (item) {
                            return item.rawResult.split('/')[1];
                        }), 'circle', '#2D4AD1'));
                        series[1].markArea = getMackArea([graph.aimMin[1], graph.aimMax[1]], {color: "#33ce55"});
                        series[1].markLine = {
                          data: [
                                  getMackLine('目标值范围', ((+graph.aimMax[1]-graph.aimMin[1])/2)+graph.aimMin[1], '舒张压', {color: "#33ce55", opacity: 0}),
                                  getMackLine('最高:'+graph.aimMax[1], +graph.aimMax[1], graph.aimMax[1], {color: "#33ce55", opacity: 1}),
                                  getMackLine('最低:'+graph.aimMin[1], +graph.aimMin[1], graph.aimMin[1], {color: "#33ce55", opacity: 1})
                                ]
                        };
                      break;
                      default:
                        series.push(getGraph(graph.itemName, 'line', seriesData.map(function (item) {
                            return item.rawResult;
                        }), 'circle', '#15b5f1'));
                        series[0].markLine = {
                          data: [
                                  getMackLine('目标值范围', ((graph.aimMax-graph.aimMin)/2)+graph.aimMin, graph.itemName, {color: "#00AFF0"})
                                ]
                        };
                      break;
                    }
                    option.yAxis.max = graph.axisMax,
                    option.yAxis.min = graph.axisMin;
                    option.series = series;
                    return option;
                }

                /**
                 * 获取到图形数据
                 * @type {Boolean}
                 */
                var getGraphData = function(type, handle) {
                    type == 0 && graph.showLoading();
                    $rootScope.loading.show = false;

                    console.log(scope.graphData);
                    $API.ResidentHealthService.getRsdtMonitorDetailJSONByResidentIdAndItemId({
                        residentId: scope.graphData.residentId,
                        itemId: scope.graphData.itemId.split(','),
                        pageNow: type ? pageNow+1 : pageNow,
                        pageSize: pageSize
                    }).then(function(result) {
                        graph.hideLoading();
                        if (result.code == 1 && result.data) {
                            var tempData = angular.fromJson(result.data);
                            if(type){
                              var dataZoom = option.dataZoom;
                              if(tempData.length){
                                for (var i = 0; i < tempData.length; i++) {
                                  seriesData.unshift(tempData[i]);
                                }
                                option.dataZoom.endValue = dataZoom.endValue+tempData.length-2;
                                option.dataZoom.startValue = dataZoom.startValue+tempData.length-2;
                              }else{
                                scope.leftover = true;
                                return true;
                              }
                              scope.graphDataLoading = false;
                            }else{
                              seriesData = [];
                              for (var i = 0; i < tempData.length; i++) {
                                  seriesData.unshift(tempData[i]);
                              }
                              option.dataZoom.endValue = seriesData.length - 1;
                              option.dataZoom.startValue = seriesData.length > 10 ? (seriesData.length - 10) :  0;
                            }

                            option = initSetOption(scope.graphData);
                            setTimeout(function() {
                              graph.setOption(option);
                            }, 100);
                            console.log(seriesData);
                        }else{
                          !result.data && (scope.leftover = true);
                        }
                        handle && handle();
                        $timeout(function() {
                            scope.graphDataLoading = false;
                            graph.hideLoading();
                            overLoading();
                        },1000);
                    }).fail(function() {
                        handle && handle();
                        $timeout(function() {
                            graphDataLoading = false;
                            graph.hideLoading();
                            overLoading();
                        },1000);
                    });
                }
                scope.$parent.graphArray.push({
                  reload: refresh.bind(this)
                });
                initGraph();
            }
        }
    }]);
})(ZcarezeApp, window);