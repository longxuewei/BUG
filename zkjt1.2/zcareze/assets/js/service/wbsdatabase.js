(function(ZcarezeApp) {
  /**
   * 公共 指令、 过滤器、 服务
   */
  ZcarezeApp
    .service('wbsdatabase', ['$rootScope', 'SetClientService', function($rootScope, SetClientService) {
      if ($rootScope.connect) {
        return $rootScope.connect;
      }
      function wbsdatabase() {
        var self = this, _scope = $rootScope,
          connect = null,
          createConnect = function(sql, where, success, fail){
            connect.transaction(function(tx) {
                tx.executeSql(
                sql, where || [],
                function(tx, data) {
                  var result = [];
                  for (var i = 0; i < data.rows.length; i++) {
                    result.push(data.rows.item(i));
                  }
                  success && success(result, tx);
                  console.log(sql + '---- over');
                },
                function(tx, error) {
                  fail && fail(error, tx);
                });
            });
          },
          execute = function(sql, where, success, fail) {
            try{
              if(connect){
                createConnect(sql, where, success, fail);
              }else{
                self.connect(function(){
                  createConnect(sql, where, success, fail);
                })
              }
              
            }catch(e){
              console && console.log && console.log(e);
            }
          },
          executemulti = function(sqlmap, success, fail) {
            connect.transaction(function(tx) {
              var errorData = [], successSql = 0, length = sqlmap.length;
              for (var i = sqlmap.length-1; i >= 0; i--) {
                var data = sqlmap.pop();
                tx.executeSql(
                data.sql, data.val || [],
                function(tx, result) {
                  successSql++;
                  if(!sqlmap.length && (successSql + errorData.length) == length){
                    if(!errorData.length){
                      success && success(result, tx);
                    }else{
                      fail && fail({code: 102}, errorData, tx);
                    }
                  }
                  _scope.$apply(function(){
                    _scope.disposeData++;
                  });
                  console.log(data.sql + '---- over');
                },
                function(tx, error) {
                  errorData.push(data);
                  if(!sqlmap.length){
                    fail && fail(error, tx, errorData);
                  }
                });
              }
            });
          },
          executeSync = function(sql, where, success, fail) {
            connect.transaction(function(tx) {
              tx.executeSql(
                sql, where || [],
                function(tx, data) {
                  var result = [];
                  for (var i = 0; i < data.rows.length; i++) {
                    result.push(data.rows.item(i));
                  }
                  success && success(result, tx);
                },
                function(tx, error) {
                  fail && fail(error, tx);
                });
            });
          },
          removeV = function(success, fail) {
            connect.transaction(function(tx) {
              tx.executeSql(
                "drop table version", [],
                function(tx, data) {
                  success && success(data, tx);
                },
                function(tx, error) {
                  fail && fail(error, tx);
                });
            });
          },
          drop = function(tableName, success, fail) {
            var isOk = false, isFail = false;
            connect.transaction(function(tx) {
              tx.executeSql(
                "drop table " + formatName2Db(tableName), [],
              function(tx, data) {
                success && success(data, tx);
              },
              function(tx, error) {
                if(error.code == 5){
                  isOk && success && success(error, tx);
                  isOk = true;
                }else{
                  isFail && fail && fail(error, tx);
                  isFail = true;
                }
              }),
              tx.executeSql(
                "updata version set version = -1", [tableName],
              function(tx, data) {
                success && success(data, tx);
              },
              function(tx, error) {
                if(error.code == 5){
                  isOk && success && success(error, tx);
                  isOk = true;
                }else{
                  isFail && fail && fail(error, tx);
                  isFail = true;
                }
              });

            });
          },
          formatName2Db = function(tableName){
            if(!tableName)
              return '';
            // if(/_/.test(tableName)){
            //   return tableName.replace(/([_]{1}.{1})/g, function(str, val, all) {
            //     return str.replace(/_/,'').toLocaleUpperCase();
            //   })
            // }else{
              return tableName.replace(/([A-Z])/g, function(str, val, all) {
                return '_'+str.toLocaleLowerCase();
              })
            // }
          },
          getVal = function(keys, dic) {
                    var a = [];
                    for (var j = 0; j < keys.length; j++) {
                      if(dic[keys[j]] && typeof dic[keys[j]] == 'object'){
                        a.push(JSON.stringify(dic[keys[j]]));
                      }else{
                        a.push(dic[keys[j]]);
                      }
                    }
                    return a;
                  },
          getInsertSql = function(tableName, keys){
             return ("insert into "+formatName2Db(tableName)+" (" + keys.join(',') + ") values(" + (function(fields) {
                                  var a = [];
                                  for (var j = 0; j < fields.length; j++) {
                                    a.push('?');
                                  }
                                  return a.join(',');
                                })(keys) + ")");
          };

        this.connect = function(){
          try{
            connect = openDatabase(ZcarezeApp.ClientService.Dictionary.dbName, 
              ZcarezeApp.ClientService.Dictionary.versions, 
              ZcarezeApp.ClientService.Dictionary.dbDesc, 
              ZcarezeApp.ClientService.Dictionary.dbSize, 
            function() {
              $rootScope.connect = connect;
            });
          }catch(e){
            
          }
        }

        this.disconnect = function(){
          $rootScope.connect = null;
        }

        this.dropTable = function(tableName, success, fail){
          drop(tableName, success, fail);
        }

        this.createTable = function(name, struarray, success, error) {
          connect.transaction(function(tx) {
            // tx.executeSql("drop table " + name);
            if(name instanceof Array){
              var num = 0;
              for (var i = name.length - 1; i >= 0; i--) {
                tx.executeSql("create table if not exists " + formatName2Db(name[i]) + " (" + struarray[i].join(",") + ")", [], function(){
                  num++;
                  if(num == name.length){
                    success && success();
                  }
                }, function(){
                  num++;
                  if(num == name.length){
                    error && error();
                  }
                });
              }
            }else{
              tx.executeSql("create table if not exists " + formatName2Db(name) + " (" + struarray.join(",") + ")", [], success, error);
            }
            
          });
        }

        this.queryTable = function(name, success, error) {
          execute("select * from " + formatName2Db(name), [], success, error);
        }

        this.clearMonitorData = function(resident, success, error){
          execute("DELETE FROM rsdt_monitor_list WHERE residentId = '" + resident + "'", [], success, function(result){
            if(result.code == 5){
              self.createMonitorTable(success, error);
            }else{
              error && error();
            }
          });
        }

        this.createMonitorTable = function(handler, error){
          this.createTable(["rsdt_monitor_list", "wait_upload_monitor_data"], [[
                          "monitorId",
                          "residentId",
                          "suiteId",
                          "value",
                          "reference",
                          "remark",
                          "unit",
                          "hint",
                          "arrow",
                          "name",
                          "part",
                          "seqNo",
                          "source",
                          "subtitle",
                          "deviceMac",
                          "meterCode",
                          "acceptTime"
                      ],
                      [
                          "monitorId",
                          "residentId",
                          "acceptTime",
                          "rsdtMonitor"
                      ]], handler, error);
        }

        this.insertMonitorData = function(datas, callback, error){
          var tableOk = true;

          var _datas = [];
          for (var i = 0; i < datas.length; i++) {
            var item = datas[i];
            for (var j = item.data.length - 1; j >= 0; j--) {
              var temp = item.data[j];
              keys = Object.getOwnPropertyNames(temp);
              _datas.push({
                sql: getInsertSql("rsdt_monitor_list", keys),
                val: getVal(keys, temp)
              });
            }

            if(item.monitor){
              monitorkeys = Object.getOwnPropertyNames(item.monitor);
              _datas.push({
                sql: getInsertSql("wait_upload_monitor_data", monitorkeys),
                val: getVal(monitorkeys, item.monitor)
              });
            }
          }

          executemulti(_datas, callback, function(result){
            if(result.code == 5){
              if(tableOk){
                tableOk = false;
                self.dropTable('rsdt_monitor_list', function(){
                  self.createMonitorTable(function(){
                    if(!tableOk){
                      self.insertMonitorData(datas, callback, error);
                    }
                  }, error);
                });
              }
            }else{
              error && error();
            }
          });
        }

        this.updateMonitorData = function(datas, success, error){
          var _datas = [];
          for (var i = 0; i < datas.length; i++) {
            _datas.push({
              sql: "DELETE FROM wait_upload_monitor_data WHERE monitorId = '" + datas[i].monitorId + "'",
            });
          }
          executemulti(_datas, success, error);
        }

        this.queryMonitorData = function(suiteid, resident, pageNum, pageSize, callback, error){
          this.querySQL("SELECT * FROM rsdt_monitor_list WHERE suiteId = '"+ suiteid +
            "' AND residentId = '" + resident + "' ORDER BY acceptTime DESC LIMIT "+(pageNum*pageSize)+" , "+(pageSize||30), callback, function(result){
            if(result.code == 5){
              self.createMonitorTable(function(){
                callback && callback([]);
              }, error);
            }else{
              error && error();
            }
          });
        }

        this.offLineMonitorData = function(length, callback, error){
          this.querySQL("SELECT * FROM wait_upload_monitor_data ORDER BY acceptTime DESC LIMIT 0, "+length, callback, function(result){
            if(result.code == 5){
              self.createMonitorTable(function(){
                callback && callback([]);
              }, error);
            }else{
              error && error();
            }
          });
        }

        this.meterSuiteId = function(meterCode, callback, error){
          this.querySQL("SELECT suite_id as suiteId FROM meter_modes WHERE meter_code = '" + meterCode +"'", callback, function(result){
            if(result.code == 5){
              self.createMonitorTable(function(){
                callback && callback([]);
              }, error);
            }else{
              error && error();
            }
          });
        }

        this.queryTableVersion = function(success, error) {
          execute("select tableCode, name, version from version", [], success, error);
        }

        this.resetTableVersion = function(name, struarray, success, error) {
          removeV(function(){
            self.createTable(name, struarray, success, error);
          });
        }

        this.query = function(tableName, colName, where, success, error) {
          var whereArray = [];
          var whereValue = [];

          var whereLable = '';
          if(typeof where == 'object' && !(where instanceof Array)){
            var keys = Object.getOwnPropertyNames(where);
            for (var i = 0; i < keys.length; i++) {
              if(typeof where[keys[i]] == 'object' && where[keys[i]].hasOwnProperty('like')){
                whereArray.push(keys[i] + 'like = '+ where[keys[i]].like);
              }else{
                whereArray.push(keys[i] + ' = ?');
                whereValue.push(where[keys[i]]);
              }
            }
            keys.length && (whereLable = ' and ');
          }else if(where instanceof Array){
            for (var i = 0; i < where.length; i++) {
              if(typeof where[i].value == 'object' && where[i].value.hasOwnProperty('like')){
                whereArray.push(where[i].name + 'like = ' + where[i].value.like);
              }else{
                whereArray.push(where[i].name + ' = ?');
                whereValue.push(where[i].value);
              }
            }
            where.length &&( whereLable = ' or ');
          }
          execute("select "+ 
            (colName.length ? colName.join(',') : '*') +
            " from " + formatName2Db(tableName) + (whereArray.length ? (' where ' + whereArray.join(whereLable)) : ''), whereValue || [], 
            success, error);
        }

        this.querySQL = function(sql, success, error) {
          execute(sql, [], success, error);
        }

        this.queryName = function(tableName, where, success, error){
          this.query(tableName, ['name'], where, function(data){
            if(data.length){
              success(data[0].name || '');
            }
          }, error)
        }

        this.updata = function(sql, val, success, error) {
          execute(sql, val || [], success, error);
        }

        this.delete = function(sql, where, success, error) {
          execute(sql, where || [], success, error);
        }

        this.insert = function(tableName, fields, val, success, error) {
          execute("insert into " + formatName2Db(tableName) + " (" + fields.join(',') + ") values(" + (function(fields) {
            var a = [];
            for (var j = 0; j < fields.length; j++) {
              a.push('?');
            }
            return a.join(',');
          })(fields) + ")", val || [], success, error);
        }

        this.inserts = function(tableName, datas, success, error) {
          var _datas = [];

          if(!datas.length){
            success && success();
          }

          for (var i = 0; i < datas.length; i++) {
            var keys = Object.getOwnPropertyNames(datas[i]);
            _datas.push({
              sql: getInsertSql(tableName, keys),
              val: getVal(keys, datas[i])
            });
          }

          executemulti(_datas, success, error);
        }

      }
      return new wbsdatabase();
    }])
    .factory('$dictionary', ['$rootScope', 'wbsdatabase', '$API', '$ionicLoading', '$ionicPopup', '$timeout',
      function($rootScope, wbsdatabase, $API, $ionicLoading, $ionicPopup, $timeout) {
        var _$ionicLoading = $ionicLoading, _scope = $rootScope, _$ionicPopup = $ionicPopup;
        var dictionary = function() {
          var _this = this;
          _this.tableCodes = [];
          _this.nativeTable = [];
          _this.versions = {};
          _this.isShowLoadding = true;
          _this.closeDataBase = function(){
            _this.tableCodes = [];
            _this.versions = {};
            _this.disconnect();
          }
        };
        dictionary.prototype = wbsdatabase;
        dictionary.prototype.getTable = function(tableName, success, error) {
          return this.queryTable(tableName, success, error);
        }
        dictionary.prototype.insertList = function(tableName, list, success, fail) {
          this.inserts(tableName, list, success, fail);
        }

        dictionary.prototype.updateTable = function(tablesData, success, fail){
          var _this = this, _tablesData = tablesData.concat(), tabledata = _tablesData.shift();
          _this.insertList(tabledata.tableCode, tabledata.rowData, 
            function(){
              _this.updata("UPDATE version SET version = ?, name = ? WHERE tableCode = ?", [tabledata.version, tabledata.name, tabledata.tableCode], function(){
                  _this.versions[tabledata.tableCode] = tabledata.version;
                  if(_tablesData.length){
                    _this.updateTables(_tablesData, success, fail, true);
                  }else{
                    success && success();
                  }
                }, function(error, tx){
                  if(!_tablesData.length){
                    fail && fail(error);
                  }
                })
            }, 
            function(error, errordata){
              if(error.code == 5){
                var keys = Object.getOwnPropertyNames(tabledata.rowData[0]);
                for (var i = 0; i < keys.length; i++) {
                  if(keys[i] == 'code'){
                      keys[i] = keys[i] + " PRIMARY KEY NOT NULL";
                  }
                }
                _this.createTable(tabledata.tableCode, keys, function(){
                  _this.updateTables(tablesData, success, fail);
                }, function(error){
                  if(!_tablesData.length){
                    fail && fail(error);
                  }
                });
              }
            })
        }

        dictionary.prototype.updateTables = function(tablesData, success, fail, isDrop){
          var _this = this;
          if(isDrop){
            _this.dropTable(tablesData[0].tableCode, function(){
              var keys = Object.getOwnPropertyNames(tablesData[0].rowData[0]);
              for (var i = 0; i < keys.length; i++) {
                if(keys[i] == 'code'){
                    keys[i] = keys[i] + " PRIMARY KEY NOT NULL";
                }
              }
              _this.createTable(tablesData[0].tableCode, keys, function(){
                  _this.updateTable(tablesData, success, fail);
                }, function(error){
                  if(!_tablesData.length){
                    fail && fail(error);
                  }
              });
              
            }, function(error){
              if(error){
                _this.updateTable(tablesData, success, fail);
              }
            })
          }else{
            _this.updateTable(tablesData, success, fail);
          }  
        }

        dictionary.prototype.synchronization = function(tableCodes, handler, offAlert) {
          var _this = this;
          $rootScope.loading.template = '<ion-spinner icon="spiral"></ion-spinner><div>资源同步中...</div>';
          $rootScope.popup.show = false;
          $rootScope.loading.autoHide = false;
          if (sessionStorage.getItem('version') == 'ok') {$rootScope.loading.show = false;}
          $API.BaseDictionaryService.getDictionaryTableDataByTableCodeAndVersion({
            dictionaryParamList: {
              lists: tableCodes || _this.tableCodes
            }
          }).then(function(data){
            if(data.lists && data.lists.length){
              sessionStorage.setItem('version', 'bad');
              _$ionicLoading.show({
                  template: '<ion-spinner icon="ripple"></ion-spinner><div>加载数据...</div>'
              });
              $rootScope.dataSize = 0;
              $rootScope.disposeData = 0;
              for (var i = 0; i < data.lists.length; i++) {
                $rootScope.dataSize += data.lists[i].rowData.length;
              }
              _$ionicLoading.show({
                  scope: $rootScope,
                  template: '<ion-spinner icon="ripple"></ion-spinner><div>解析数据...</div><div><small>{{dataSize}}&nbsp;/&nbsp;{{disposeData}}</small></div>'
              });
              _this.updateTables(data.lists,function(data){
                handler && handler(data);
                sessionStorage.setItem('version', 'ok');
                _$ionicLoading.hide();
                $rootScope.loading.autoHide = true;
                !offAlert && $rootScope.alert({
                    title: '更新完成',
                    template: '程序需要刷新，请尝试刷新程序，或者退出程序重新进入！',
                    scope: _scope,
                    cssClass: 'media-type',
                    buttons: [{
                        text: '关闭程序',
                        onTap: function(e,a,b) {
                          window.close();
                        }
                    },{
                        text: '<b>立即刷新</b>',
                        type: 'button-energized',
                        onTap: function(e,a,b) {
                          window.location && window.location.reload && window.location.reload();
                          e.preventDefault();
                        }
                    }]
                });
              }, function(error){
                handler && handler(error);
                _$ionicLoading.hide();
                $rootScope.loading.autoHide = true;
              }, true);
            }else{
              $timeout(function(){
                handler && handler(data);
                _$ionicLoading.hide();
                $rootScope.loading.autoHide = true;
              },200);
              sessionStorage.setItem('version', 'ok');
            }
          }).fail(function(error){
            _$ionicLoading.hide();
            if(error && error.code == 0){
              $rootScope.loading.autoHide = true;
              handler && handler(error);
              return;
            }
            _$ionicPopup.alert({
                  title: '初始化资源失败',
                  template: '字典表数据获取异常，请尝试重启程序再次获取数据！',
                  scope: _scope,
                  cssClass: 'media-type',
                  buttons: [{
                      text: '关闭程序',
                      onTap: function(e,a,b) {
                        window.close();
                      }
                  },{
                      text: '重启程序',
                      type: 'button-energized',
                      onTap: function(e,a,b) {
                        ZcarezeBase && ZcarezeBase.restart && ZcarezeBase.restart();
                        e.preventDefault();
                      }
                  }]
            });
            sessionStorage.setItem('version', 'bad');
            handler && handler(error);
          })
        }

        dictionary.prototype.setVersionItem = function(handler, insertList){
            var _this = this;
            _this.insertList("version" , insertList || _this.tableCodes, function(data){
              handler && handler(data);
            }, function(error){
              handler && handler(error);
            });
        }

        dictionary.prototype.resetVersion = function(handler) {
          var _this = this, versionLables = Object.getOwnPropertyNames(_this.versions)

          _this.resetTableVersion('version', [
              "tableCode",
              "name",
              "version"
          ], function(){
            $rootScope.loading.autoHide = false;
            _$ionicLoading.show({
                template: '<ion-spinner icon="spiral"></ion-spinner><div>初始化中</div>'
            });
            _this.setVersionItem(function(){
              _this.synchronization(null, function(){
                $rootScope.loading.autoHide = true;
                _$ionicLoading.hide();
                handler && handler();
              });
            })
          }, function(){
            _$ionicLoading.hide();
            handler && handler();
          })
        }

        dictionary.prototype.afreshSyncTable = function(tableName, handler) {
          this.synchronization(
            [{
              tableCode: tableName,
              version: -1,
            }], function(result){
              handler && handler(result);
            }, true);
        }

        dictionary.prototype.initVersion = function(handler) {
          var _this = this, versionLables = Object.getOwnPropertyNames(_this.versions)

          _this.createTable('version', [
              "tableCode",
              "name",
              "version"
            ], function(){
            _$ionicLoading.show({
                template: '<ion-spinner icon="spiral"></ion-spinner><div>初始化中</div>'
            });
            _this.setVersionItem(function(){
              _this.synchronization(null, function(){
                $rootScope.loading.autoHide = true;
                _$ionicLoading.hide();
                handler && handler();
              });
            })
          }, function(){
            _$ionicLoading.hide();
            $rootScope.alert({
                title: '本地数据错误!',
                template: '本地数据文件被破坏，程序无法正常运行！'
            });
            handler && handler();
          })
        }

        dictionary.prototype.startTable = function( versions, tableCodes, handler, isInit) {
          var _this = this;
          var _tableCodes = angular.copy(tableCodes);
          var keys = Object.getOwnPropertyNames(_tableCodes);
          var newTables = angular.extend({}, _tableCodes);
          var oldTables = [];
          var clreaOldTable;

          for (var i = 0; i < versions.length; i++) {
            var temp = _tableCodes[versions[i].tableCode];
            if(temp){
              _tableCodes[versions[i].tableCode].version = versions[i].version;
              if(temp.isTable && temp.version < versions[i].version){
                oldTables.push(versions[i].tableCode);
              }
              delete newTables[versions[i].tableCode];
            }else{
              oldTables.push(versions[i].tableCode);
            }
          }

          for (var i = 0; i < keys.length; i++) {
            if(_tableCodes[keys[i]].isTable){
              this.nativeTable.push(_tableCodes[keys[i]]);
              delete newTables[_tableCodes[keys[i]].tableCode];
            }else{
              this.tableCodes.push(_tableCodes[keys[i]]);
            }
          }

          for (var i = 0; i < this.tableCodes.length; i++) {
            this.versions[this.tableCodes[i].tableCode] = this.tableCodes[i].version;
          }

          if(oldTables.length){
            clreaOldTable = function(oldTables, handler){
              _$ionicLoading.show({
                template: '<ion-spinner icon="spiral"></ion-spinner><div>清除垃圾数据！</div>'
              });
              var table = oldTables.shift();
              _this.dropTable(table, function(){
                _this.delete("delete from version where tableCode = ?", [table], function(){
                  oldTables.length ? clreaOldTable(oldTables, handler) : (handler && handler());
                }, function(){
                  oldTables.length ? clreaOldTable(oldTables, handler) : (handler && handler());
                })
              })
            }
          }

          var newTablesKey = Object.getOwnPropertyNames(newTables);
          if(((versions.length && versions.length != keys.length) || newTablesKey.length) && !isInit){
            sessionStorage.removeItem('version');
            var newTableNames = Object.getOwnPropertyNames(newTables);
            var insertList = [];
            for (var i = 0; i < newTableNames.length; i++) {
              insertList.push(newTables[newTableNames[i]]);
            }
            _$ionicLoading.show({
                template: '<ion-spinner icon="spiral"></ion-spinner><div>更新基础数据！</div>'
            });
            this.setVersionItem(function(result){
              if(result && result.code == 5){
                _$ionicLoading.hide();
                _$ionicPopup.alert({
                    title: '错误!',
                    template: '基础数据更新失败，请重启程序，或者重新安装！',
                    buttons: [{
                      text: '关闭',
                      onTap: function(e) {
                        window.close();
                        e.preventDefault();
                      }
                    }]
                });
              }else{
                oldTables.length ?
                clreaOldTable(oldTables, handler):
                (handler && handler());
              }
            }, insertList)
          }else{
            oldTables.length ?
            clreaOldTable(oldTables, handler):
            (handler && handler());
          }
        }
        
        /**
         *  getDictionaryTableDataByTableCodeAndVersion
         * @param  {[type]} tableCodes [description]
         * @return {[type]}            [description]
         */
        dictionary.prototype.createConnect = function(){
          this.closeDataBase();
          this.connect();
        }

        dictionary.prototype.init = function(tableCodes, handler) {
          var _this = this;
          _this.queryTableVersion(function(data, tx){
            if(!data.length){
              _this.startTable([], tableCodes, function(){
                _this.resetVersion(handler);
              });
            }else{
              _this.startTable(data, tableCodes, function(){
                _this.synchronization(null,handler);
              });
            }
          }, function(error, tx){
            if(error.code == 5){
              _this.startTable([], tableCodes, function(){
                _this.initVersion(handler);
              }, true);
            }
          });
        }
        return new dictionary();
      }
    ])

    /**
     * [字典数据 过滤器]
     * @param  {[type]} $filter
     * @return {[type]}          [description]
     */
    .directive('wbs', ['$dictionary', '$timeout', function($dictionary, $timeout) {
      return {
        restrict: 'AE',
        require: '?ngModel',
        replace: true,
        scope:{},
        template: '<span class="text">{{value}}</span>',
        link: function(scope, $element, $attrs, $ngModel) {
          if (!$ngModel || !$attrs.dictionary) return;
          var where = {};
          scope.$watch(function() {
            return $ngModel.$viewValue;
          }, function(newVal) {
            if(!newVal){
              scope.value = $attrs.placeholder || '';
              return;
            }
            if($attrs.split){
              $attrs.where = $attrs.where || 'or';
              newVal = newVal.split($attrs.split);
              if($attrs.where == 'or'){
                where = [];
                for (var i = 0; i < newVal.length; i++) {
                  where.push({
                    name: $attrs.as || 'code',
                    value: newVal[i]
                  })
                }
              }
            }else{
              if($attrs.as){
                where[$attrs.as] = newVal;
              }else{
                where.code = newVal;
              }
            }
            
            $dictionary.query($attrs.dictionary, [$attrs.col || 'name'], where, function(data){
              if(data.length){
                scope.$apply(function(){
                  if($attrs.join){
                    var temp = [];
                    for (var i = 0; i < data.length; i++) {
                      temp.push(data[i][$attrs.col || 'name']);
                    }
                    scope.value = temp.join($attrs.join) || $attrs.placeholder || ""; 
                  }else{
                    scope.value = data[0][$attrs.col || 'name'] || $attrs.placeholder || ""; 
                  }
                })
              }else{
                scope.$apply(function(){
                  scope.value = $attrs.placeholder || ""; 
                })
              }
            }, function(error){
              console.log(error);
                scope.$apply(function(){
                  scope.value = 'wbs-error-'+ error.code; 
              })
            })
          });
        }
      };
    }]);
})(ZcarezeApp);