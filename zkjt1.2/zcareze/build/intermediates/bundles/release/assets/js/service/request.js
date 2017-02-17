(function(){var n=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9','+','/'];var o=function(a){var c=new Array();while(a>0){var b=a%2;a=Math.floor(a/2);c.push(b)}c.reverse();return c};var q=function(a){var c=0;var p=0;for(var i=a.length-1;i>=0;--i){var b=a[i];if(b==1){c+=Math.pow(2,p)}++p}return c};var r=function(c,a){var b=(8-(c+1))+((c-1)*6);var d=a.length;var e=b-d;while(--e>=0){a.unshift(0)}var f=[];var g=c;while(--g>=0){f.push(1)}f.push(0);var i=0,len=8-(c+1);for(;i<len;++i){f.push(a[i])}for(var j=0;j<c-1;++j){f.push(1);f.push(0);var h=6;while(--h>=0){f.push(a[i++])}}return f};var s={encoder:function(a){var b=[];var c=[];for(var i=0,len=a.length;i<len;++i){var d=a.charCodeAt(i);var e=o(d);if(d<0x80){var f=8-e.length;while(--f>=0){e.unshift(0)}c=c.concat(e)}else if(d>=0x80&&d<=0x7FF){c=c.concat(r(2,e))}else if(d>=0x800&&d<=0xFFFF){c=c.concat(r(3,e))}else if(d>=0x10000&&d<=0x1FFFFF){c=c.concat(r(4,e))}else if(d>=0x200000&&d<=0x3FFFFFF){c=c.concat(r(5,e))}else if(d>=4000000&&d<=0x7FFFFFFF){c=c.concat(r(6,e))}}var g=0;for(var i=0,len=c.length;i<len;i+=6){var h=(i+6)-len;if(h==2){g=2}else if(h==4){g=4}var j=g;while(--j>=0){c.push(0)}b.push(q(c.slice(i,i+6)))}var k='';for(var i=0,len=b.length;i<len;++i){k+=n[b[i]]}for(var i=0,len=g/2;i<len;++i){k+='='}return k},decoder:function(a){var b=a.length;var d=0;if(a.charAt(b-1)=='='){if(a.charAt(b-2)=='='){d=4;a=a.substring(0,b-2)}else{d=2;a=a.substring(0,b-1)}}var e=[];for(var i=0,len=a.length;i<len;++i){var c=a.charAt(i);for(var j=0,size=n.length;j<size;++j){if(c==n[j]){var f=o(j);var g=f.length;if(6-g>0){for(var k=6-g;k>0;--k){f.unshift(0)}}e=e.concat(f);break}}}if(d>0){e=e.slice(0,e.length-d)}var h=[];var l=[];for(var i=0,len=e.length;i<len;){if(e[i]==0){h=h.concat(q(e.slice(i,i+8)));i+=8}else{var m=0;while(i<len){if(e[i]==1){++m}else{break}++i}l=l.concat(e.slice(i+1,i+8-m));i+=8-m;while(m>1){l=l.concat(e.slice(i+2,i+8));i+=8;--m}h=h.concat(q(l));l=[]}}return h}};window.BASE64=s})();
(function(W){
    var versions = "";

    var promise = function(handler, params, _self){
        this.httpConfig = {};
        this.result = [];
        this.error = [];
        this.http = handler.call(this,params, this.httpConfig, _self);
    };
    promise.prototype.execute = function(directive, params){
        for (var i in this[directive]) {
            this[directive][i](params);
        }
    }
    promise.prototype.then = function(handler){
        this.result.push(handler);
        return this;
    }
    promise.prototype.fail = function(handler){
        this.error.push(handler);
        return this;
    }
    var util = function(){ }

    util.prototype.verify = function(main, minor){
        return true;
        var self = this;

        var _arguments = main;

        var keys = Object.getOwnPropertyNames(minor);

        main = _arguments;

        if(main.length == 1){
            main = main[0]
        }else{
            if(keys.length != 0){
                this.error(1, _arguments, main, minor);
            }
            return true;
        }

        if(keys.length == 1 && minor[keys[0]].type == 'String'){

        }

        if(keys.length == 1 && minor[keys[0]].type == 'Class'){
            this.verify();
        }

        if(typeof main == 'object'){
            this.getVerifyErrorMsg('',_arguments.callee.toString().match(/\(([^)]*)\)/g)[0].replace(/\(|\)/g,'').split(','), minor, main)
        }
        //main[0].callee.toString().match(/\(([^)]*)\)/g)[0]

        return true;
    }

    util.prototype.sameLength = function(){
    }


    util.prototype.param= function(data, template){


        return this.verify(this.paramsimple(data), template.param);
    }

    util.prototype.paramsimple = function(data){
        /* 简化参数 */
        return data[0];
    }

    util.prototype.result= function(data, resultTmpl){
        return this.verify(data, resultTmpl);
    }
    util.prototype.ErrorMsg = '';
    util.prototype.error = function(type, _arguments, data, minor){
        var msg = '';
        switch(type){
            case 0:
                msg += '\n注意：参数不完整！\nparams┓\n';
            break;
            case 1:
                msg += '注意：参数类型不正确！\n';
            break;
        }
        msg += this.ErrorMsg;
        // throw msg+'\n';
    }

    util.prototype.getVerifyErrorMsg = function(params, minor, data, noblank){
        for (var i = 0; i < params.length; i++) {
            var temp = minor['arg'+i] || minor[params[i]];

            temp.type = temp.type.replace(/Class/g,'object').replace(/List/g, 'array');
            
            if(temp.type == 'Class'){
                var dmdata =  data[params[i]] || {};
                var minodm = dominData[minor['arg'+i].name];
                var minordmkeys = Object.getOwnPropertyNames(minodm);
                
                if(!this.getVerifyErrorMsg(minordmkeys, minodm, dmdata)){
                    return false;
                }
            }
            if(temp.type == "List"){
                var dmdata = data[params[i]] || {};
                var minodm = temp.param;
                var minordmkeys = Object.getOwnPropertyNames(temp.param);
                if(!this.getVerifyErrorMsg(minordmkeys, minodm, dmdata, true)){
                    return false;
                }
            }

            if(data[params[i]] && typeof data[params[i]] == temp.type.toLocaleLowerCase()){
                continue; 
            }else{
                return false;
            }
        }
        return true;
    }

    util.prototype.uid = function(str) {
        var hash = 0, i, chr, len;
        if (str.length === 0) return hash;
        for (i = 0, len = str.length; i < len; i++) {
          chr   = str.charCodeAt(i);
          hash  = ((hash << 5) - hash) + chr;
          hash |= 0;
        }
        return '$'+Math.abs(hash);
    }

    util["\x70\x72\x6f\x74\x6f\x74\x79\x70\x65"]["\x64\x65\x63\x6f\x64\x65\x72"]=function(wyMXp1){return wyMXp1["\x73\x70\x6c\x69\x74"]('')["\x72\x65\x76\x65\x72\x73\x65"]()["\x6a\x6f\x69\x6e"]('')["\x72\x65\x70\x6c\x61\x63\x65"](/=/g,'')+'\x3d\x3d'};
    util["\x70\x72\x6f\x74\x6f\x74\x79\x70\x65"]["\x65\x6e\x63\x6f\x64\x65\x72"]=function(FRXGyj2){return FRXGyj2["\x73\x70\x6c\x69\x74"]('')["\x72\x65\x76\x65\x72\x73\x65"]()["\x6a\x6f\x69\x6e"]('')["\x72\x65\x70\x6c\x61\x63\x65"](/=/g,'')+'\x3d\x3d'};
    
    util.prototype.formatData = function(data, version, package, labels){
        data = this.paramsimple(data);
        var datakeys = Object.getOwnPropertyNames(data);
        var simpledata = {};
        for (var i in datakeys) {
            simpledata['par' + i] = data[datakeys[i]];
        }
        data = simpledata;     

        var datatmpl = {
            'service': package + '.' + labels[0] + '.' + labels[1],
            'version': version,
            'sign_type': 'MD5'
        }

        var signtmpl = [
            'service='+ datatmpl.service,
            'version='+ datatmpl.version
        ];

        var sign = '';

        //'sign_type: "MD5"',

        signtmpl.push('data='+ JSON.stringify(data));
        sign = Math.MD5(signtmpl.join('&'));
        data = this.encoder(BASE64.encoder(JSON.stringify(data)));
        
        datatmpl['sign'] = sign.toString();
        datatmpl['data'] = data;
        return datatmpl;
    }
    util.prototype.promise = function(ProxyEvent, params){
        var _self = this;
        return new promise(ProxyEvent, params, _self);
    }

    var UTIL = new util();


    var baseService = {
            services: {},
            util: UTIL,
            http: function(data){}
        }

    /**
     * interface
     * 
     * */
    function interface(params, service, label, package){
        var invoke = null;
        var interuuid = this.util.uid(label);
        var servuuid = this.util.uid((service = service.replace(/Interfactory/, 'Service')));
        this.package = package;
        this.label = [servuuid, interuuid],
        this.param(params) && (invoke = this.service(this.util.formatData(params, this.versions, this.package, [service, label])).then(this.then).fail(this.fail),
            this.services[interuuid] = invoke, invoke['$key'] = interuuid);

        return invoke;
    }

    interface.prototype = baseService;
 
    interface.prototype.param = function(){
        //返回值 boolean
        return this.util.param(arguments, paramData[this.label[0]][this.label[1]])
    };

    interface.prototype.result = function(data){
        if(data.code == 0){
            return false;
        }
        //返回值 boolean
        return this.util.result(data, dominData[paramData[this.label[0]][this.label[1]].result.name]);
    };

    interface.prototype.then = function(data){
        //自定义处理
    };

    interface.prototype.fail = function(error){
        //自定义处理
    }

    interface.prototype.service = function(data){
        return this.interface = this.util.promise.call(this, this.http, data);
    }
    interface.prototype.util = UTIL;


    function interfaceFactory(params, service, label, package){
        return new interface(params, service, label, package);
    }

    

    // 设置代码
    
    var dominData = {"BaseResult":{"code":{"type":"Integer"},"lists":{"param":{},"type":"List"},"one":{"param":{},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"void":{},"ArticleFavoriteLogVOResult":{"code":{"type":"Integer"},"lists":{"param":{"summary":{"type":"String"},"giverId":{"type":"String"},"praiseFlag":{"type":"Integer"},"address":{"type":"String"},"original":{"type":"Integer"},"declare":{"type":"String"},"giveTime":{"type":"Date"},"giverName":{"type":"String"},"praiseCount":{"type":"Integer"},"favoriteFlag":{"type":"Integer"},"readFlag":{"type":"Integer"},"label":{"type":"String"},"title":{"type":"String"},"readCount":{"type":"Integer"},"content":{"type":"String"},"sourceUrl":{"type":"String"},"openScope":{"type":"Integer"},"auditorId":{"type":"String"},"top":{"type":"Integer"},"commitTime":{"type":"Date"},"auditTime":{"type":"Date"},"sourceLab":{"type":"String"},"id":{"type":"String"},"auditorName":{"type":"String"}},"type":"List"},"one":{"param":{"summary":{"type":"String"},"giverId":{"type":"String"},"praiseFlag":{"type":"Integer"},"address":{"type":"String"},"original":{"type":"Integer"},"declare":{"type":"String"},"giveTime":{"type":"Date"},"giverName":{"type":"String"},"praiseCount":{"type":"Integer"},"favoriteFlag":{"type":"Integer"},"readFlag":{"type":"Integer"},"label":{"type":"String"},"title":{"type":"String"},"readCount":{"type":"Integer"},"content":{"type":"String"},"sourceUrl":{"type":"String"},"openScope":{"type":"Integer"},"auditorId":{"type":"String"},"top":{"type":"Integer"},"commitTime":{"type":"Date"},"auditTime":{"type":"Date"},"sourceLab":{"type":"String"},"id":{"type":"String"},"auditorName":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"ArticleInBoardResult":{"code":{"type":"Integer"},"lists":{"param":{"top":{"type":"Integer"},"articleId":{"type":"String"},"boardCode":{"type":"String"},"boardName":{"type":"String"}},"type":"List"},"one":{"param":{"top":{"type":"Integer"},"articleId":{"type":"String"},"boardCode":{"type":"String"},"boardName":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"AccountTopicResult":{"code":{"type":"Integer"},"lists":{"param":{"accountId":{"type":"String"},"topicId":{"type":"String"},"boardCode":{"type":"String"}},"type":"List"},"one":{"param":{"accountId":{"type":"String"},"topicId":{"type":"String"},"boardCode":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"ArticleTopics":{"accountId":{"type":"String"},"code":{"type":"String"},"name":{"type":"String"},"articleId":{"type":"String"},"comment":{"type":"String"},"id":{"type":"String"}},"String[]":{},"ClientVersionResult":{"code":{"type":"Integer"},"lists":{"param":{"sequence":{"type":"Integer"},"createTime":{"type":"Date"},"cloudId":{"type":"String"},"downloadUrl":{"type":"String"},"description":{"type":"String"},"appKey":{"type":"String"},"id":{"type":"String"},"type":{"type":"Integer"},"version":{"type":"String"},"isDel":{"type":"Integer"},"status":{"type":"Integer"}},"type":"List"},"one":{"param":{"sequence":{"type":"Integer"},"createTime":{"type":"Date"},"cloudId":{"type":"String"},"downloadUrl":{"type":"String"},"description":{"type":"String"},"appKey":{"type":"String"},"id":{"type":"String"},"type":{"type":"Integer"},"version":{"type":"String"},"isDel":{"type":"Integer"},"status":{"type":"Integer"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"ArticleListResult":{"code":{"type":"Integer"},"lists":{"param":{"summary":{"type":"String"},"giverId":{"type":"String"},"praiseFlag":{"type":"Integer"},"address":{"type":"String"},"original":{"type":"Integer"},"declare":{"type":"String"},"giveTime":{"type":"Date"},"giverName":{"type":"String"},"praiseCount":{"type":"Integer"},"favoriteFlag":{"type":"Integer"},"readFlag":{"type":"Integer"},"title":{"type":"String"},"readCount":{"type":"Integer"},"content":{"type":"String"},"sourceUrl":{"type":"String"},"openScope":{"type":"Integer"},"auditorId":{"type":"String"},"top":{"type":"Integer"},"auditTime":{"type":"Date"},"sourceLab":{"type":"String"},"id":{"type":"String"},"auditorName":{"type":"String"}},"type":"List"},"one":{"param":{"summary":{"type":"String"},"giverId":{"type":"String"},"praiseFlag":{"type":"Integer"},"address":{"type":"String"},"original":{"type":"Integer"},"declare":{"type":"String"},"giveTime":{"type":"Date"},"giverName":{"type":"String"},"praiseCount":{"type":"Integer"},"favoriteFlag":{"type":"Integer"},"readFlag":{"type":"Integer"},"title":{"type":"String"},"readCount":{"type":"Integer"},"content":{"type":"String"},"sourceUrl":{"type":"String"},"openScope":{"type":"Integer"},"auditorId":{"type":"String"},"top":{"type":"Integer"},"auditTime":{"type":"Date"},"sourceLab":{"type":"String"},"id":{"type":"String"},"auditorName":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"Result":{"code":{"type":"Integer"},"errorCode":{"type":"String"},"message":{"type":"String"}},"CloudListResult":{"code":{"type":"Integer"},"lists":{"param":{"sourceId":{"type":"String"},"password":{"type":"String"},"dataSourceUrl":{"type":"String"},"createTime":{"type":"Date"},"driverClassName":{"type":"String"},"comment":{"type":"String"},"id":{"type":"String"},"title":{"type":"String"},"type":{"type":"Integer"},"userName":{"type":"String"},"config":{"type":"String"}},"type":"List"},"one":{"param":{"sourceId":{"type":"String"},"password":{"type":"String"},"dataSourceUrl":{"type":"String"},"createTime":{"type":"Date"},"driverClassName":{"type":"String"},"comment":{"type":"String"},"id":{"type":"String"},"title":{"type":"String"},"type":{"type":"Integer"},"userName":{"type":"String"},"config":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"AppKeyParam":{"code":{"type":"Integer"},"createTime":{"type":"Date"},"name":{"type":"String"},"description":{"type":"String"},"appKey":{"type":"String"},"id":{"type":"String"},"type":{"type":"Integer"},"logoUrl":{"type":"String"},"status":{"type":"Integer"}},"AccountManagesResult":{"code":{"type":"Integer"},"lists":{"param":{"actor":{"type":"String"},"accountId":{"type":"String"},"action":{"type":"Integer"},"actTime":{"type":"Date"},"comment":{"type":"String"},"id":{"type":"String"}},"type":"List"},"one":{"param":{"actor":{"type":"String"},"accountId":{"type":"String"},"action":{"type":"Integer"},"actTime":{"type":"Date"},"comment":{"type":"String"},"id":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"HandicapHistory":{"code":{"type":"String"},"name":{"type":"String"},"adscript":{"type":"String"},"fixed":{"type":"Integer"},"comment":{"type":"String"},"shortCode":{"type":"String"}},"MonitorSuites":{"seqNo":{"type":"Integer"},"divTimes":{"type":"String"},"name":{"type":"String"},"metered":{"type":"Integer"},"comment":{"type":"String"},"divParts":{"type":"String"},"divStatus":{"type":"String"},"id":{"type":"String"}},"FamilyHistory":{"code":{"type":"String"},"name":{"type":"String"},"adscript":{"type":"String"},"fixed":{"type":"Integer"},"comment":{"type":"String"},"shortCode":{"type":"String"}},"ExposeHistory":{"code":{"type":"String"},"name":{"type":"String"},"adscript":{"type":"String"},"fixed":{"type":"Integer"},"comment":{"type":"String"},"shortCode":{"type":"String"}},"ClientVersionParam":{"sequence":{"type":"Integer"},"createTime":{"type":"Date"},"description":{"type":"String"},"appKey":{"type":"String"},"id":{"type":"String"},"type":{"type":"Integer"},"version":{"type":"String"},"isDel":{"type":"Integer"},"status":{"type":"Integer"}},"MeterList":{"code":{"type":"String"},"name":{"type":"String"},"producer":{"type":"String"},"comment":{"type":"String"},"signalFlag":{"type":"String"},"signalKind":{"type":"Integer"}},"MonitorSuitesResult":{"code":{"type":"Integer"},"lists":{"param":{"seqNo":{"type":"Integer"},"divTimes":{"type":"String"},"name":{"type":"String"},"metered":{"type":"Integer"},"comment":{"type":"String"},"divParts":{"type":"String"},"divStatus":{"type":"String"},"id":{"type":"String"}},"type":"List"},"one":{"param":{"seqNo":{"type":"Integer"},"divTimes":{"type":"String"},"name":{"type":"String"},"metered":{"type":"Integer"},"comment":{"type":"String"},"divParts":{"type":"String"},"divStatus":{"type":"String"},"id":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"MonitorSuiteItemsResult":{"code":{"type":"Integer"},"lists":{"param":{"itemId":{"type":"String"},"suiteId":{"type":"String"},"itemName":{"type":"String"},"seqNo":{"type":"Integer"}},"type":"List"},"one":{"param":{"itemId":{"type":"String"},"suiteId":{"type":"String"},"itemName":{"type":"String"},"seqNo":{"type":"Integer"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"ArticleReadLogVOResult":{"code":{"type":"Integer"},"lists":{"param":{"praiseFlag":{"type":"Integer"},"photoUrl":{"type":"String"},"password":{"type":"String"},"regTime":{"type":"Date"},"readFlag":{"type":"Integer"},"mobile":{"type":"String"},"nickname":{"type":"String"},"regMode":{"type":"Integer"},"regSource":{"type":"String"},"id":{"type":"String"},"status":{"type":"Integer"}},"type":"List"},"one":{"param":{"praiseFlag":{"type":"Integer"},"photoUrl":{"type":"String"},"password":{"type":"String"},"regTime":{"type":"Date"},"readFlag":{"type":"Integer"},"mobile":{"type":"String"},"nickname":{"type":"String"},"regMode":{"type":"Integer"},"regSource":{"type":"String"},"id":{"type":"String"},"status":{"type":"Integer"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"MeterModes":{"modeName":{"type":"String"},"suiteId":{"type":"String"},"seqNo":{"type":"Integer"},"signalMark":{"type":"String"},"title":{"type":"String"},"diagram":{"type":"String"},"modeCode":{"type":"String"},"attention":{"type":"String"},"meterCode":{"type":"String"},"comment":{"type":"String"},"diagramUrl":{"type":"String"},"abbr":{"type":"String"},"operation":{"type":"String"}},"ArticleTopicsResult":{"code":{"type":"Integer"},"lists":{"param":{"accountId":{"type":"String"},"code":{"type":"String"},"name":{"type":"String"},"articleId":{"type":"String"},"comment":{"type":"String"},"id":{"type":"String"}},"type":"List"},"one":{"param":{"accountId":{"type":"String"},"code":{"type":"String"},"name":{"type":"String"},"articleId":{"type":"String"},"comment":{"type":"String"},"id":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"MonitorCautionsResult":{"code":{"type":"Integer"},"lists":{"param":{"falseWord":{"type":"String"},"itemId":{"type":"String"},"stepNo":{"type":"Integer"},"falseGoto":{"type":"Integer"},"trueWord":{"type":"String"},"verdict":{"type":"String"},"trueGoto":{"type":"Integer"}},"type":"List"},"one":{"param":{"falseWord":{"type":"String"},"itemId":{"type":"String"},"stepNo":{"type":"Integer"},"falseGoto":{"type":"Integer"},"trueWord":{"type":"String"},"verdict":{"type":"String"},"trueGoto":{"type":"Integer"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"MonitorSuiteItems":{"itemId":{"type":"String"},"suiteId":{"type":"String"},"itemName":{"type":"String"},"seqNo":{"type":"Integer"}},"ArticleReadLogResult":{"code":{"type":"Integer"},"lists":{"param":{"accountId":{"type":"String"},"praiseFlag":{"type":"Integer"},"readFlag":{"type":"Integer"},"articleId":{"type":"String"}},"type":"List"},"one":{"param":{"accountId":{"type":"String"},"praiseFlag":{"type":"Integer"},"readFlag":{"type":"Integer"},"articleId":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"ArticleReadLog":{"accountId":{"type":"String"},"praiseFlag":{"type":"Integer"},"readFlag":{"type":"Integer"},"articleId":{"type":"String"}},"AccountAuthensResult":{"code":{"type":"Integer"},"lists":{"param":{"requestTime":{"type":"Date"},"accountId":{"type":"String"},"purpose":{"type":"Integer"},"commitTime":{"type":"Date"},"mobile":{"type":"String"},"id":{"type":"String"},"authenCode":{"type":"String"}},"type":"List"},"one":{"param":{"requestTime":{"type":"Date"},"accountId":{"type":"String"},"purpose":{"type":"Integer"},"commitTime":{"type":"Date"},"mobile":{"type":"String"},"id":{"type":"String"},"authenCode":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"AccountManages":{"actor":{"type":"String"},"accountId":{"type":"String"},"action":{"type":"Integer"},"actTime":{"type":"Date"},"comment":{"type":"String"},"id":{"type":"String"}},"ArticleBoardsResult":{"code":{"type":"Integer"},"lists":{"param":{"code":{"type":"String"},"name":{"type":"String"},"articleId":{"type":"String"},"fixed":{"type":"Integer"},"comment":{"type":"String"},"shortCode":{"type":"String"}},"type":"List"},"one":{"param":{"code":{"type":"String"},"name":{"type":"String"},"articleId":{"type":"String"},"fixed":{"type":"Integer"},"comment":{"type":"String"},"shortCode":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"WechatTempListResult":{"code":{"type":"Integer"},"lists":{"param":{"note":{"type":"String"},"suiteId":{"type":"String"},"name":{"type":"String"},"id":{"type":"String"},"allCount":{"type":"Integer"},"suiteName":{"type":"String"}},"type":"List"},"one":{"param":{"note":{"type":"String"},"suiteId":{"type":"String"},"name":{"type":"String"},"id":{"type":"String"},"allCount":{"type":"Integer"},"suiteName":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"ArticleList":{"summary":{"type":"String"},"giverId":{"type":"String"},"praiseFlag":{"type":"Integer"},"address":{"type":"String"},"original":{"type":"Integer"},"declare":{"type":"String"},"giveTime":{"type":"Date"},"giverName":{"type":"String"},"praiseCount":{"type":"Integer"},"favoriteFlag":{"type":"Integer"},"readFlag":{"type":"Integer"},"title":{"type":"String"},"readCount":{"type":"Integer"},"content":{"type":"String"},"sourceUrl":{"type":"String"},"openScope":{"type":"Integer"},"auditorId":{"type":"String"},"top":{"type":"Integer"},"auditTime":{"type":"Date"},"sourceLab":{"type":"String"},"id":{"type":"String"},"auditorName":{"type":"String"}},"AccountResult":{"code":{"type":"Integer"},"lists":{"param":{"photoUrl":{"type":"String"},"password":{"type":"String"},"regTime":{"type":"Date"},"mobile":{"type":"String"},"nickname":{"type":"String"},"regMode":{"type":"Integer"},"regSource":{"type":"String"},"id":{"type":"String"},"status":{"type":"Integer"}},"type":"List"},"accountHolders":{"param":{"accountId":{"type":"String"},"cloudName":{"type":"String"},"cloudId":{"type":"String"},"residentId":{"type":"String"},"staffId":{"type":"String"},"status":{"type":"Integer"}},"type":"List"},"cloudId":{"type":"String"},"one":{"param":{"photoUrl":{"type":"String"},"password":{"type":"String"},"regTime":{"type":"Date"},"mobile":{"type":"String"},"nickname":{"type":"String"},"regMode":{"type":"Integer"},"regSource":{"type":"String"},"id":{"type":"String"},"status":{"type":"Integer"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"WechatTempElement":{"itemId":{"type":"String"},"itemName":{"type":"String"},"kind":{"type":"Integer"},"tempId":{"type":"String"},"keyWord":{"type":"String"}},"ArticleInBoard":{"top":{"type":"Integer"},"articleId":{"type":"String"},"boardCode":{"type":"String"},"boardName":{"type":"String"}},"ClientVersion":{"sequence":{"type":"Integer"},"createTime":{"type":"Date"},"cloudId":{"type":"String"},"downloadUrl":{"type":"String"},"description":{"type":"String"},"appKey":{"type":"String"},"id":{"type":"String"},"type":{"type":"Integer"},"version":{"type":"String"},"isDel":{"type":"Integer"},"status":{"type":"Integer"}},"AccountList":{"photoUrl":{"type":"String"},"password":{"type":"String"},"regTime":{"type":"Date"},"mobile":{"type":"String"},"nickname":{"type":"String"},"regMode":{"type":"Integer"},"regSource":{"type":"String"},"id":{"type":"String"},"status":{"type":"Integer"}},"PmhKind":{"code":{"type":"String"},"name":{"type":"String"},"fixed":{"type":"Integer"},"comment":{"type":"String"},"shortCode":{"type":"String"}},"MonitorReferences":{"divSeason":{"type":"String"},"seqNo":{"type":"Integer"},"divPart":{"type":"String"},"meterName":{"type":"String"},"divStatus":{"type":"String"},"divAge":{"type":"String"},"pretreat":{"type":"String"},"itemId":{"type":"String"},"divSex":{"type":"String"},"subtitle":{"type":"String"},"meterCode":{"type":"String"},"validText":{"type":"String"},"divTime":{"type":"String"}},"JobClass":{"code":{"type":"String"},"name":{"type":"String"},"fixed":{"type":"Integer"},"comment":{"type":"String"},"shortCode":{"type":"String"}},"MeterModesResult":{"code":{"type":"Integer"},"lists":{"param":{"modeName":{"type":"String"},"suiteId":{"type":"String"},"seqNo":{"type":"Integer"},"signalMark":{"type":"String"},"title":{"type":"String"},"diagram":{"type":"String"},"modeCode":{"type":"String"},"attention":{"type":"String"},"meterCode":{"type":"String"},"comment":{"type":"String"},"diagramUrl":{"type":"String"},"abbr":{"type":"String"},"operation":{"type":"String"}},"type":"List"},"one":{"param":{"modeName":{"type":"String"},"suiteId":{"type":"String"},"seqNo":{"type":"Integer"},"signalMark":{"type":"String"},"title":{"type":"String"},"diagram":{"type":"String"},"modeCode":{"type":"String"},"attention":{"type":"String"},"meterCode":{"type":"String"},"comment":{"type":"String"},"diagramUrl":{"type":"String"},"abbr":{"type":"String"},"operation":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"AppKey":{"code":{"type":"Integer"},"createTime":{"type":"Date"},"name":{"type":"String"},"description":{"type":"String"},"appKey":{"type":"String"},"id":{"type":"String"},"type":{"type":"Integer"},"logoUrl":{"type":"String"},"status":{"type":"Integer"}},"MonitorReferencesResult":{"code":{"type":"Integer"},"lists":{"param":{"divSeason":{"type":"String"},"seqNo":{"type":"Integer"},"divPart":{"type":"String"},"meterName":{"type":"String"},"divStatus":{"type":"String"},"divAge":{"type":"String"},"pretreat":{"type":"String"},"itemId":{"type":"String"},"divSex":{"type":"String"},"subtitle":{"type":"String"},"meterCode":{"type":"String"},"validText":{"type":"String"},"divTime":{"type":"String"}},"type":"List"},"one":{"param":{"divSeason":{"type":"String"},"seqNo":{"type":"Integer"},"divPart":{"type":"String"},"meterName":{"type":"String"},"divStatus":{"type":"String"},"divAge":{"type":"String"},"pretreat":{"type":"String"},"itemId":{"type":"String"},"divSex":{"type":"String"},"subtitle":{"type":"String"},"meterCode":{"type":"String"},"validText":{"type":"String"},"divTime":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"CloudList":{"sourceId":{"type":"String"},"password":{"type":"String"},"dataSourceUrl":{"type":"String"},"createTime":{"type":"Date"},"driverClassName":{"type":"String"},"comment":{"type":"String"},"id":{"type":"String"},"title":{"type":"String"},"type":{"type":"Integer"},"userName":{"type":"String"},"config":{"type":"String"}},"WechatAccountResult":{"code":{"type":"Integer"},"lists":{"param":{"wechatOpenId":{"type":"String"},"accountTtile":{"type":"String"},"wechatHeadimgurl":{"type":"String"},"wechatProvince":{"type":"String"},"relatedTime":{"type":"Date"},"wechatRemark":{"type":"String"},"accountId":{"type":"String"},"wechatSex":{"type":"Integer"},"wechatLanguage":{"type":"String"},"wechatNickname":{"type":"String"},"wechatCity":{"type":"String"},"wechatUnionid":{"type":"String"},"wechatCountry":{"type":"String"}},"type":"List"},"one":{"param":{"wechatOpenId":{"type":"String"},"accountTtile":{"type":"String"},"wechatHeadimgurl":{"type":"String"},"wechatProvince":{"type":"String"},"relatedTime":{"type":"Date"},"wechatRemark":{"type":"String"},"accountId":{"type":"String"},"wechatSex":{"type":"Integer"},"wechatLanguage":{"type":"String"},"wechatNickname":{"type":"String"},"wechatCity":{"type":"String"},"wechatUnionid":{"type":"String"},"wechatCountry":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"AccountHolder":{"accountId":{"type":"String"},"cloudName":{"type":"String"},"cloudId":{"type":"String"},"residentId":{"type":"String"},"staffId":{"type":"String"},"status":{"type":"Integer"}},"WechatAccount":{"wechatOpenId":{"type":"String"},"accountTtile":{"type":"String"},"wechatHeadimgurl":{"type":"String"},"wechatProvince":{"type":"String"},"relatedTime":{"type":"Date"},"wechatRemark":{"type":"String"},"accountId":{"type":"String"},"wechatSex":{"type":"Integer"},"wechatLanguage":{"type":"String"},"wechatNickname":{"type":"String"},"wechatCity":{"type":"String"},"wechatUnionid":{"type":"String"},"wechatCountry":{"type":"String"}},"ArticleFavoriteLog":{"accountId":{"type":"String"},"commitTime":{"type":"Date"},"articleId":{"type":"String"},"label":{"type":"String"}},"AppKeyResult":{"code":{"type":"Integer"},"lists":{"param":{"code":{"type":"Integer"},"createTime":{"type":"Date"},"name":{"type":"String"},"description":{"type":"String"},"appKey":{"type":"String"},"id":{"type":"String"},"type":{"type":"Integer"},"logoUrl":{"type":"String"},"status":{"type":"Integer"}},"type":"List"},"one":{"param":{"code":{"type":"Integer"},"createTime":{"type":"Date"},"name":{"type":"String"},"description":{"type":"String"},"appKey":{"type":"String"},"id":{"type":"String"},"type":{"type":"Integer"},"logoUrl":{"type":"String"},"status":{"type":"Integer"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"MonitorCautions":{"falseWord":{"type":"String"},"itemId":{"type":"String"},"stepNo":{"type":"Integer"},"falseGoto":{"type":"Integer"},"trueWord":{"type":"String"},"verdict":{"type":"String"},"trueGoto":{"type":"Integer"}},"WechatTempElementResult":{"code":{"type":"Integer"},"lists":{"param":{"itemId":{"type":"String"},"itemName":{"type":"String"},"kind":{"type":"Integer"},"tempId":{"type":"String"},"keyWord":{"type":"String"}},"type":"List"},"one":{"param":{"itemId":{"type":"String"},"itemName":{"type":"String"},"kind":{"type":"Integer"},"tempId":{"type":"String"},"keyWord":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"MonitorItems":{"defResult":{"type":"String"},"eName":{"type":"String"},"seqNo":{"type":"Integer"},"refSeqNo":{"type":"Integer"},"mayChart":{"type":"Integer"},"special":{"type":"String"},"unit":{"type":"String"},"cName":{"type":"String"},"valueType":{"type":"Integer"},"valueList":{"type":"String"},"comment":{"type":"String"},"exempt":{"type":"Integer"},"id":{"type":"String"},"abbr":{"type":"String"}},"WechatTempList":{"note":{"type":"String"},"suiteId":{"type":"String"},"name":{"type":"String"},"id":{"type":"String"},"allCount":{"type":"Integer"},"suiteName":{"type":"String"}},"ArticleDiscussLogResult":{"code":{"type":"Integer"},"lists":{"param":{"accountId":{"type":"String"},"commitTime":{"type":"Date"},"articleId":{"type":"String"},"nickname":{"type":"String"},"id":{"type":"String"},"content":{"type":"String"}},"type":"List"},"one":{"param":{"accountId":{"type":"String"},"commitTime":{"type":"Date"},"articleId":{"type":"String"},"nickname":{"type":"String"},"id":{"type":"String"},"content":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"MeterListResult":{"code":{"type":"Integer"},"lists":{"param":{"code":{"type":"String"},"name":{"type":"String"},"producer":{"type":"String"},"comment":{"type":"String"},"signalFlag":{"type":"String"},"signalKind":{"type":"Integer"}},"type":"List"},"one":{"param":{"code":{"type":"String"},"name":{"type":"String"},"producer":{"type":"String"},"comment":{"type":"String"},"signalFlag":{"type":"String"},"signalKind":{"type":"Integer"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"ArticleFavoriteLogResult":{"code":{"type":"Integer"},"lists":{"param":{"accountId":{"type":"String"},"commitTime":{"type":"Date"},"articleId":{"type":"String"},"label":{"type":"String"}},"type":"List"},"one":{"param":{"accountId":{"type":"String"},"commitTime":{"type":"Date"},"articleId":{"type":"String"},"label":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"ArticleDiscussLog":{"accountId":{"type":"String"},"commitTime":{"type":"Date"},"articleId":{"type":"String"},"nickname":{"type":"String"},"id":{"type":"String"},"content":{"type":"String"}},"AccountAuthens":{"requestTime":{"type":"Date"},"accountId":{"type":"String"},"purpose":{"type":"Integer"},"commitTime":{"type":"Date"},"mobile":{"type":"String"},"id":{"type":"String"},"authenCode":{"type":"String"}},"MonitorItemsResult":{"code":{"type":"Integer"},"lists":{"param":{"defResult":{"type":"String"},"eName":{"type":"String"},"seqNo":{"type":"Integer"},"refSeqNo":{"type":"Integer"},"mayChart":{"type":"Integer"},"special":{"type":"String"},"unit":{"type":"String"},"cName":{"type":"String"},"valueType":{"type":"Integer"},"valueList":{"type":"String"},"comment":{"type":"String"},"exempt":{"type":"Integer"},"id":{"type":"String"},"abbr":{"type":"String"}},"type":"List"},"one":{"param":{"defResult":{"type":"String"},"eName":{"type":"String"},"seqNo":{"type":"Integer"},"refSeqNo":{"type":"Integer"},"mayChart":{"type":"Integer"},"special":{"type":"String"},"unit":{"type":"String"},"cName":{"type":"String"},"valueType":{"type":"Integer"},"valueList":{"type":"String"},"comment":{"type":"String"},"exempt":{"type":"Integer"},"id":{"type":"String"},"abbr":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"RangeEnum[]":{},"ServiceListVO":{"serviceTermsList":{"param":{"mode":{"type":"Integer"},"planCount":{"type":"Integer"},"seqNo":{"type":"Integer"},"comment":{"type":"String"},"id":{"type":"String"},"serviceId":{"type":"String"},"title":{"type":"String"}},"type":"List"},"code":{"type":"String"},"months":{"type":"Integer"},"name":{"type":"String"},"comment":{"type":"String"},"id":{"type":"String"},"basic":{"type":"Integer"},"content":{"type":"String"}},"Dictionary":{"general":{"type":"Integer"},"name":{"type":"String"},"tableCode":{"type":"String"},"lastEditTime":{"type":"Date"},"type":{"type":"Integer"},"isSync":{"type":"Integer"},"tableStructure":{"param":{"dataType":{"type":"String"},"columnSize":{"type":"Integer"},"nullAble":{"type":"Integer"},"remarks":{"type":"String"},"key":{"type":"Integer"},"columnName":{"type":"String"}},"type":"List"}},"EvaQaListVO":{"factorId":{"type":"String"},"seqCode":{"type":"String"},"evaQaOptions":{"param":{"score":{"type":"Integer"},"seqNo":{"type":"Integer"},"positive":{"type":"Integer"},"title":{"type":"String"},"qaId":{"type":"String"}},"type":"List"},"evaName":{"type":"String"},"factorName":{"type":"String"},"diffSex":{"type":"Integer"},"id":{"type":"String"},"evaId":{"type":"String"},"content":{"type":"String"}},"FrequencyList":{"code":{"type":"String"},"eName":{"type":"String"},"kind":{"type":"String"},"cName":{"type":"String"},"cycleLength":{"type":"Integer"},"freqTimes":{"type":"Integer"},"cycleUnit":{"type":"String"},"abbr":{"type":"String"},"datePoints":{"type":"String"},"timePoints":{"type":"String"}},"BaseDictionaryParam":{"lists":{"param":{"tableCode":{"type":"String"}},"type":"List"}},"BaseDictionaryDataResult":{"code":{"type":"Integer"},"lists":{"param":{"name":{"type":"String"},"rowData":{"param":"Map","type":"List"},"tableCode":{"type":"String"}},"type":"List"},"one":{"param":{"name":{"type":"String"},"rowData":{"param":"Map","type":"List"},"tableCode":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"DictionaryDataParam":{"lists":{"param":{"fieldName":{"type":"String"},"fieldValue":{"type":"String"},"relation":{"type":"String"}},"type":"List"},"orderDirection":{"type":"String"},"orderField":{"type":"String"}},"Integer":{"BYTES":{"type":"Integer"},"SIZE":{"type":"Integer"},"MAX_VALUE":{"type":"Integer"},"MIN_VALUE":{"type":"Integer"},"TYPE":"Class","value":{"type":"Integer"}},"TimeDivisions":{"minDatum":{"type":"Integer"},"maxDatum":{"type":"Integer"},"name":{"type":"String"},"maxOffset":{"type":"Integer"},"minOffset":{"type":"Integer"}},"List":{},"Class":{"ENUM":{"type":"Integer"},"classRedefinedCount":{"type":"Integer"},"initted":{"type":"Boolean"},"useCaches":{"type":"Boolean"},"ANNOTATION":{"type":"Integer"},"name":{"type":"String"},"SYNTHETIC":{"type":"Integer"},"newInstanceCallerCache":"Class"},"Object":{},"DictionaryResult":{"code":{"type":"Integer"},"lists":{"param":{"general":{"type":"Integer"},"name":{"type":"String"},"tableCode":{"type":"String"},"lastEditTime":{"type":"Date"},"type":{"type":"Integer"},"isSync":{"type":"Integer"},"tableStructure":{"param":{"dataType":{"type":"String"},"columnSize":{"type":"Integer"},"nullAble":{"type":"Integer"},"remarks":{"type":"String"},"key":{"type":"Integer"},"columnName":{"type":"String"}},"type":"List"}},"type":"List"},"one":{"param":{"general":{"type":"Integer"},"name":{"type":"String"},"tableCode":{"type":"String"},"lastEditTime":{"type":"Date"},"type":{"type":"Integer"},"isSync":{"type":"Integer"},"tableStructure":{"param":{"dataType":{"type":"String"},"columnSize":{"type":"Integer"},"nullAble":{"type":"Integer"},"remarks":{"type":"String"},"key":{"type":"Integer"},"columnName":{"type":"String"}},"type":"List"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"OptionList":{"code":{"type":"String"},"meaning":{"type":"String"},"kind":{"type":"String"},"setValue":{"type":"String"},"name":{"type":"String"},"defValue":{"type":"String"}},"AliyunOSSResult":{"code":{"type":"Integer"},"lists":{"param":{"accessid":{"type":"String"},"bucketKey":{"type":"String"},"signature":{"type":"String"},"expire":{"type":"String"},"host":{"type":"String"},"policy":{"type":"String"}},"type":"List"},"one":{"param":{"accessid":{"type":"String"},"bucketKey":{"type":"String"},"signature":{"type":"String"},"expire":{"type":"String"},"host":{"type":"String"},"policy":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"InterveneOrderResult":{"code":{"type":"Integer"},"ordMonitorSuiteList":{"param":{"suiteId":{"type":"String"},"seqNo":{"type":"Integer"},"method":{"type":"Integer"},"orderId":{"type":"String"},"cycleLength":{"type":"Integer"},"freqTimes":{"type":"Integer"},"cycleUnit":{"type":"String"},"datePoints":{"type":"String"},"suiteName":{"type":"String"},"timePoints":{"type":"String"}},"type":"List"},"lists":{"param":{"auditGrade":{"type":"String"},"todayPlan":{"type":"Integer"},"giveTime":{"type":"Date"},"giverName":{"type":"String"},"kind":{"type":"Integer"},"planTime":{"type":"Date"},"adscript":{"type":"String"},"residentId":{"type":"String"},"id":{"type":"String"},"content":{"type":"String"},"status":{"type":"Integer"}},"type":"List"},"ordAudioList":{"param":{"seconds":{"type":"Integer"},"audioUrl":{"type":"String"},"seqNo":{"type":"Integer"},"orderId":{"type":"String"},"audioId":{"type":"String"},"content":{"type":"String"}},"type":"List"},"one":{"param":{"auditGrade":{"type":"String"},"todayPlan":{"type":"Integer"},"giveTime":{"type":"Date"},"giverName":{"type":"String"},"kind":{"type":"Integer"},"planTime":{"type":"Date"},"adscript":{"type":"String"},"residentId":{"type":"String"},"id":{"type":"String"},"content":{"type":"String"},"status":{"type":"Integer"}},"type":"Class"},"errorCode":{"type":"String"},"ordMedRecipeBodyList":{"param":{"usageUnit":{"type":"String"},"packRatio":{"type":"Integer"},"wayName":{"type":"String"},"seqNo":{"type":"Integer"},"orderId":{"type":"String"},"advice":{"type":"String"},"medId":{"type":"String"},"wayCode":{"type":"String"},"packages":{"type":"Integer"},"spec":{"type":"String"},"feqName":{"type":"String"},"freqCode":{"type":"String"},"name":{"type":"String"},"dispenseUnit":{"type":"String"},"producer":{"type":"String"},"doseUnit":{"type":"String"}},"type":"List"},"message":{"type":"String"},"ordHerbRecipeBodyList":{"param":{"doses":{"type":"Integer"},"seqNo":{"type":"Integer"},"orderId":{"type":"String"},"advice":{"type":"String"},"medId":{"type":"String"},"name":{"type":"String"},"doseUnit":{"type":"String"}},"type":"List"}},"OrdMedRecipeBodyParam":{"lists":{"param":{"usageUnit":{"type":"String"},"packRatio":{"type":"Integer"},"wayName":{"type":"String"},"seqNo":{"type":"Integer"},"orderId":{"type":"String"},"advice":{"type":"String"},"medId":{"type":"String"},"wayCode":{"type":"String"},"packages":{"type":"Integer"},"spec":{"type":"String"},"feqName":{"type":"String"},"freqCode":{"type":"String"},"name":{"type":"String"},"dispenseUnit":{"type":"String"},"producer":{"type":"String"},"doseUnit":{"type":"String"}},"type":"List"}},"OrdHerbRecipeBodyParam":{"lists":{"param":{"doses":{"type":"Integer"},"seqNo":{"type":"Integer"},"orderId":{"type":"String"},"advice":{"type":"String"},"medId":{"type":"String"},"name":{"type":"String"},"doseUnit":{"type":"String"}},"type":"List"}},"RsdtEvaScoreResult":{"code":{"type":"Integer"},"orderId":{"type":"String"},"lists":{"param":{"factorId":{"type":"String"},"factorCode":{"type":"String"},"method":{"type":"Integer"},"meaning":{"type":"String"},"factorName":{"type":"String"},"rawScore":{"type":"Integer"},"positive":{"type":"Integer"},"id":{"type":"String"},"evaId":{"type":"String"}},"type":"List"},"one":{"param":{"factorId":{"type":"String"},"factorCode":{"type":"String"},"method":{"type":"Integer"},"meaning":{"type":"String"},"factorName":{"type":"String"},"rawScore":{"type":"Integer"},"positive":{"type":"Integer"},"id":{"type":"String"},"evaId":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"},"doctorEnding":{"type":"Integer"}},"OrdEvaluation":{"taskTopic":{"type":"String"},"actRoleFlag":{"type":"Integer"},"orderId":{"type":"String"},"actPlaceFlag":{"type":"Integer"},"evaId":{"type":"String"}},"RsdtEvaScoreParam":{"orderId":{"type":"String"},"lists":{"param":{"qaOptionSeq":{"type":"Integer"},"qaId":{"type":"String"}},"type":"List"}},"OrderListResult":{"code":{"type":"Integer"},"lists":{"param":{"code":{"type":"Integer"},"ordMonitorSuiteList":{"param":{"suiteId":{"type":"String"},"seqNo":{"type":"Integer"},"method":{"type":"Integer"},"orderId":{"type":"String"},"cycleLength":{"type":"Integer"},"freqTimes":{"type":"Integer"},"cycleUnit":{"type":"String"},"datePoints":{"type":"String"},"suiteName":{"type":"String"},"timePoints":{"type":"String"}},"type":"List"},"lists":{"param":{"auditGrade":{"type":"String"},"todayPlan":{"type":"Integer"},"giveTime":{"type":"Date"},"giverName":{"type":"String"},"kind":{"type":"Integer"},"planTime":{"type":"Date"},"adscript":{"type":"String"},"residentId":{"type":"String"},"id":{"type":"String"},"content":{"type":"String"},"status":{"type":"Integer"}},"type":"List"},"ordAudioList":{"param":{"seconds":{"type":"Integer"},"audioUrl":{"type":"String"},"seqNo":{"type":"Integer"},"orderId":{"type":"String"},"audioId":{"type":"String"},"content":{"type":"String"}},"type":"List"},"one":{"param":{"auditGrade":{"type":"String"},"todayPlan":{"type":"Integer"},"giveTime":{"type":"Date"},"giverName":{"type":"String"},"kind":{"type":"Integer"},"planTime":{"type":"Date"},"adscript":{"type":"String"},"residentId":{"type":"String"},"id":{"type":"String"},"content":{"type":"String"},"status":{"type":"Integer"}},"type":"Class"},"errorCode":{"type":"String"},"ordMedRecipeBodyList":{"param":{"usageUnit":{"type":"String"},"packRatio":{"type":"Integer"},"wayName":{"type":"String"},"seqNo":{"type":"Integer"},"orderId":{"type":"String"},"advice":{"type":"String"},"medId":{"type":"String"},"wayCode":{"type":"String"},"packages":{"type":"Integer"},"spec":{"type":"String"},"feqName":{"type":"String"},"freqCode":{"type":"String"},"name":{"type":"String"},"dispenseUnit":{"type":"String"},"producer":{"type":"String"},"doseUnit":{"type":"String"}},"type":"List"},"message":{"type":"String"},"ordHerbRecipeBodyList":{"param":{"doses":{"type":"Integer"},"seqNo":{"type":"Integer"},"orderId":{"type":"String"},"advice":{"type":"String"},"medId":{"type":"String"},"name":{"type":"String"},"doseUnit":{"type":"String"}},"type":"List"}},"type":"List"},"one":{"param":{"code":{"type":"Integer"},"ordMonitorSuiteList":{"param":{"suiteId":{"type":"String"},"seqNo":{"type":"Integer"},"method":{"type":"Integer"},"orderId":{"type":"String"},"cycleLength":{"type":"Integer"},"freqTimes":{"type":"Integer"},"cycleUnit":{"type":"String"},"datePoints":{"type":"String"},"suiteName":{"type":"String"},"timePoints":{"type":"String"}},"type":"List"},"lists":{"param":{"auditGrade":{"type":"String"},"todayPlan":{"type":"Integer"},"giveTime":{"type":"Date"},"giverName":{"type":"String"},"kind":{"type":"Integer"},"planTime":{"type":"Date"},"adscript":{"type":"String"},"residentId":{"type":"String"},"id":{"type":"String"},"content":{"type":"String"},"status":{"type":"Integer"}},"type":"List"},"ordAudioList":{"param":{"seconds":{"type":"Integer"},"audioUrl":{"type":"String"},"seqNo":{"type":"Integer"},"orderId":{"type":"String"},"audioId":{"type":"String"},"content":{"type":"String"}},"type":"List"},"one":{"param":{"auditGrade":{"type":"String"},"todayPlan":{"type":"Integer"},"giveTime":{"type":"Date"},"giverName":{"type":"String"},"kind":{"type":"Integer"},"planTime":{"type":"Date"},"adscript":{"type":"String"},"residentId":{"type":"String"},"id":{"type":"String"},"content":{"type":"String"},"status":{"type":"Integer"}},"type":"Class"},"errorCode":{"type":"String"},"ordMedRecipeBodyList":{"param":{"usageUnit":{"type":"String"},"packRatio":{"type":"Integer"},"wayName":{"type":"String"},"seqNo":{"type":"Integer"},"orderId":{"type":"String"},"advice":{"type":"String"},"medId":{"type":"String"},"wayCode":{"type":"String"},"packages":{"type":"Integer"},"spec":{"type":"String"},"feqName":{"type":"String"},"freqCode":{"type":"String"},"name":{"type":"String"},"dispenseUnit":{"type":"String"},"producer":{"type":"String"},"doseUnit":{"type":"String"}},"type":"List"},"message":{"type":"String"},"ordHerbRecipeBodyList":{"param":{"doses":{"type":"Integer"},"seqNo":{"type":"Integer"},"orderId":{"type":"String"},"advice":{"type":"String"},"medId":{"type":"String"},"name":{"type":"String"},"doseUnit":{"type":"String"}},"type":"List"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"MedicinePersonalResult":{"code":{"type":"Integer"},"lists":{"param":{"medId":{"type":"String"},"submitDate":{"type":"Date"},"staffId":{"type":"String"}},"type":"List"},"one":{"param":{"medId":{"type":"String"},"submitDate":{"type":"Date"},"staffId":{"type":"String"}},"type":"Class"},"count":{"type":"Integer"},"errorCode":{"type":"String"},"message":{"type":"String"}},"InterveneOrderVO":{"auditGrade":{"type":"String"},"todayPlan":{"type":"Integer"},"giveTime":{"type":"Date"},"giverName":{"type":"String"},"kind":{"type":"Integer"},"planTime":{"type":"Date"},"adscript":{"type":"String"},"residentId":{"type":"String"},"id":{"type":"String"},"content":{"type":"String"},"status":{"type":"Integer"}},"OrdHerbRecipeHead":{"decoctCode":{"type":"String"},"volumeValue":{"type":"Integer"},"perUnit":{"type":"String"},"wayName":{"type":"String"},"suites":{"type":"Integer"},"orderId":{"type":"String"},"decoctName":{"type":"String"},"volumeUnit":{"type":"String"},"wayCode":{"type":"String"},"adscript":{"type":"String"},"feqName":{"type":"String"},"freqCode":{"type":"String"},"perDay":{"type":"Integer"},"perValue":{"type":"Integer"}},"OrdAudioParam":{"lists":{"param":{"seconds":{"type":"Integer"},"audioUrl":{"type":"String"},"seqNo":{"type":"Integer"},"orderId":{"type":"String"},"audioId":{"type":"String"},"content":{"type":"String"}},"type":"List"}},"EvaluationListParam":{"kind":{"type":"Integer"},"specDate":{"type":"Date"},"module":{"type":"Integer"},"pageSize":{"type":"Integer"},"pageNow":{"type":"Integer"}},"MedRecipeListResult":{"code":{"type":"Integer"},"lists":{"param":{"common":{"type":"Integer"},"seqNo":{"type":"Integer"},"name":{"type":"String"},"submitDate":{"type":"Date"},"comment":{"type":"String"},"id":{"type":"String"},"abbr":{"type":"String"},"staffId":{"type":"String"},"medRecipeDetails":{"param":{"seqNo":{"type":"Integer"},"freqCode":{"type":"String"},"advice":{"type":"String"},"medId":{"type":"String"},"wayCode":{"type":"String"},"packages":{"type":"Integer"},"recipeId":{"type":"String"}},"type":"List"},"labels":{"type":"String"}},"type":"List"},"one":{"param":{"common":{"type":"Integer"},"seqNo":{"type":"Integer"},"name":{"type":"String"},"submitDate":{"type":"Date"},"comment":{"type":"String"},"id":{"type":"String"},"abbr":{"type":"String"},"staffId":{"type":"String"},"medRecipeDetails":{"param":{"seqNo":{"type":"Integer"},"freqCode":{"type":"String"},"advice":{"type":"String"},"medId":{"type":"String"},"wayCode":{"type":"String"},"packages":{"type":"Integer"},"recipeId":{"type":"String"}},"type":"List"},"labels":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"OrderTaskList":{"taskTopic":{"type":"String"},"seqNo":{"type":"Integer"},"orderId":{"type":"String"},"orderKind":{"type":"Integer"},"actPlaceFlag":{"type":"Integer"},"aheadMin":{"type":"Integer"},"cycleLength":{"type":"Integer"},"freqTimes":{"type":"Integer"},"genTime":{"type":"Date"},"timePoints":{"type":"String"},"stopAlarm":{"type":"Integer"},"taskType":{"type":"String"},"unit":{"type":"String"},"actRoleFlag":{"type":"Integer"},"residentId":{"type":"String"},"splitDate":{"type":"Date"},"beginTime":{"type":"Date"},"endTime":{"type":"Date"},"cycleUnit":{"type":"String"},"id":{"type":"String"},"datePoints":{"type":"String"}},"EvaluationListReuslt":{"evaQaLists":{"param":{"factorId":{"type":"String"},"seqCode":{"type":"String"},"evaQaOptions":{"param":{"score":{"type":"Integer"},"seqNo":{"type":"Integer"},"positive":{"type":"Integer"},"title":{"type":"String"},"qaId":{"type":"String"}},"type":"List"},"diffSex":{"type":"Integer"},"id":{"type":"String"},"evaId":{"type":"String"},"content":{"type":"String"}},"type":"List"},"code":{"type":"Integer"},"qaCount":{"type":"Integer"},"lists":{"param":{"mode":{"type":"Integer"},"taskType":{"type":"String"},"code":{"type":"String"},"actRoleFlag":{"type":"Integer"},"actPlaceFlag":{"type":"Integer"},"name":{"type":"String"},"comment":{"type":"String"},"id":{"type":"String"},"abbr":{"type":"String"},"doctorEnding":{"type":"Integer"},"dutyGrade":{"type":"String"},"labels":{"type":"String"}},"type":"List"},"one":{"param":{"mode":{"type":"Integer"},"taskType":{"type":"String"},"code":{"type":"String"},"actRoleFlag":{"type":"Integer"},"actPlaceFlag":{"type":"Integer"},"name":{"type":"String"},"comment":{"type":"String"},"id":{"type":"String"},"abbr":{"type":"String"},"doctorEnding":{"type":"Integer"},"dutyGrade":{"type":"String"},"labels":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"},"factors":{"param":{"hash":{"type":"Integer"}},"type":"List"}},"OrdMedRecipeBodyResult":{"code":{"type":"Integer"},"lists":{"param":{"usageUnit":{"type":"String"},"packRatio":{"type":"Integer"},"wayName":{"type":"String"},"seqNo":{"type":"Integer"},"orderId":{"type":"String"},"advice":{"type":"String"},"medId":{"type":"String"},"wayCode":{"type":"String"},"packages":{"type":"Integer"},"spec":{"type":"String"},"feqName":{"type":"String"},"freqCode":{"type":"String"},"name":{"type":"String"},"dispenseUnit":{"type":"String"},"producer":{"type":"String"},"doseUnit":{"type":"String"}},"type":"List"},"one":{"param":{"usageUnit":{"type":"String"},"packRatio":{"type":"Integer"},"wayName":{"type":"String"},"seqNo":{"type":"Integer"},"orderId":{"type":"String"},"advice":{"type":"String"},"medId":{"type":"String"},"wayCode":{"type":"String"},"packages":{"type":"Integer"},"spec":{"type":"String"},"feqName":{"type":"String"},"freqCode":{"type":"String"},"name":{"type":"String"},"dispenseUnit":{"type":"String"},"producer":{"type":"String"},"doseUnit":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"RsdtMedicateListParam":{"planTime":{"type":"Date"},"lists":{"param":{"unit":{"type":"String"},"timeNo":{"type":"Integer"},"reactions":{"type":"String"},"medicineName":{"type":"String"},"taskId":{"type":"String"},"cycleNo":{"type":"Integer"},"useMedicate":{"type":"Integer"}},"type":"List"}},"OrdTreatment":{"unit":{"type":"String"},"actRoleFlag":{"type":"Integer"},"orderId":{"type":"String"},"freqCode":{"type":"String"},"perCount":{"type":"Integer"},"actPlaceFlag":{"type":"Integer"},"treatmentId":{"type":"String"},"feqName":{"type":"String"}},"OrdGuidance":{"guidanceId":{"type":"String"},"orderId":{"type":"String"},"content":{"type":"String"}},"RsdtOrdMedRecipeParam":{"medName":{"type":"String"},"unit":{"type":"String"},"wayName":{"type":"String"},"freqCode":{"type":"String"},"freqName":{"type":"String"},"wayCode":{"type":"String"},"beginTime":{"type":"Date"}},"RsdtReferralListParam":{"timeNo":{"type":"Integer"},"orderId":{"type":"String"},"referralId":{"type":"String"},"gotoOrgName":{"type":"String"},"gotoDate":{"type":"Date"},"gotoOrgId":{"type":"String"},"gotoSubject":{"type":"String"},"cycleNo":{"type":"Integer"},"referralKind":{"type":"Integer"},"leaveHospital":{"type":"Integer"},"autoGetDoc":{"type":"Integer"},"backDate":{"type":"Date"},"backCode":{"type":"String"},"residentId":{"type":"String"},"comment":{"type":"String"},"reassess":{"type":"Integer"},"taskId":{"type":"String"}},"OrdReferral":{"referralKind":{"type":"Integer"},"actRoleFlag":{"type":"Integer"},"orderId":{"type":"String"},"referralId":{"type":"String"},"planOrgName":{"type":"String"},"registCode":{"type":"String"},"planOrgId":{"type":"String"},"planSubject":{"type":"String"}},"MedRecipeList":{"common":{"type":"Integer"},"seqNo":{"type":"Integer"},"name":{"type":"String"},"submitDate":{"type":"Date"},"comment":{"type":"String"},"id":{"type":"String"},"abbr":{"type":"String"},"staffId":{"type":"String"},"medRecipeDetails":{"param":{"seqNo":{"type":"Integer"},"freqCode":{"type":"String"},"advice":{"type":"String"},"medId":{"type":"String"},"wayCode":{"type":"String"},"packages":{"type":"Integer"},"recipeId":{"type":"String"}},"type":"List"},"labels":{"type":"String"}},"OrdMonitorSuiteParam":{"lists":{"param":{"suiteId":{"type":"String"},"seqNo":{"type":"Integer"},"method":{"type":"Integer"},"orderId":{"type":"String"},"cycleLength":{"type":"Integer"},"freqTimes":{"type":"Integer"},"cycleUnit":{"type":"String"},"datePoints":{"type":"String"},"suiteName":{"type":"String"},"timePoints":{"type":"String"}},"type":"List"},"schemeId":{"type":"String"}},"StaffListResult":{"code":{"type":"Integer"},"serviceLists":{"param":{"code":{"type":"String"},"months":{"type":"Integer"},"name":{"type":"String"},"comment":{"type":"String"},"id":{"type":"String"},"basic":{"type":"Integer"},"content":{"type":"String"}},"type":"List"},"lists":{"param":{"birthday":{"type":"Date"},"orgName":{"type":"String"},"gender":{"type":"String"},"classCodes":{"param":{"hash":{"type":"Integer"}},"type":"List"},"orgId":{"type":"String"},"photoUrl":{"type":"String"},"speciality":{"type":"String"},"phone":{"type":"String"},"name":{"type":"String"},"comment":{"type":"String"},"gradeCode":{"type":"String"},"id":{"type":"String"},"abbr":{"type":"String"},"introduction":{"type":"String"},"orgDNames":{"param":{"hash":{"type":"Integer"}},"type":"List"}},"type":"List"},"one":{"param":{"birthday":{"type":"Date"},"orgName":{"type":"String"},"gender":{"type":"String"},"classCodes":{"param":{"hash":{"type":"Integer"}},"type":"List"},"orgId":{"type":"String"},"photoUrl":{"type":"String"},"speciality":{"type":"String"},"phone":{"type":"String"},"name":{"type":"String"},"comment":{"type":"String"},"gradeCode":{"type":"String"},"id":{"type":"String"},"abbr":{"type":"String"},"introduction":{"type":"String"},"orgDNames":{"param":{"hash":{"type":"Integer"}},"type":"List"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"StaffClassParam":{"classCode":{"type":"String"},"oldCode":{"type":"String"},"comment":{"type":"String"},"priority":{"type":"Integer"},"staffId":{"type":"String"}},"OrgListResult":{"code":{"type":"Integer"},"lists":{"param":{"code":{"type":"String"},"address":{"type":"String"},"kind":{"type":"String"},"island":{"type":"Integer"},"name":{"type":"String"},"comment":{"type":"String"},"gradeCode":{"type":"String"},"position":{"type":"String"},"id":{"type":"String"},"abbr":{"type":"String"},"parentId":{"type":"String"}},"type":"List"},"one":{"param":{"code":{"type":"String"},"address":{"type":"String"},"kind":{"type":"String"},"island":{"type":"Integer"},"name":{"type":"String"},"comment":{"type":"String"},"gradeCode":{"type":"String"},"position":{"type":"String"},"id":{"type":"String"},"abbr":{"type":"String"},"parentId":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"OrgList":{"code":{"type":"String"},"address":{"type":"String"},"kind":{"type":"String"},"island":{"type":"Integer"},"name":{"type":"String"},"comment":{"type":"String"},"gradeCode":{"type":"String"},"position":{"type":"String"},"id":{"type":"String"},"abbr":{"type":"String"},"parentId":{"type":"String"}},"CommunityList":{"code":{"type":"String"},"address":{"type":"String"},"orgName":{"type":"String"},"phone":{"type":"String"},"kind":{"type":"Integer"},"name":{"type":"String"},"id":{"type":"String"},"abbr":{"type":"String"},"parentId":{"type":"String"},"linkman":{"type":"String"},"orgId":{"type":"String"}},"TeamTrustIsland":{"landName":{"type":"String"},"teamId":{"type":"String"},"trustDate":{"type":"Date"},"islandId":{"type":"String"}},"StaffListParam":{"birthday":{"type":"Date"},"photoUrl":{"type":"String"},"speciality":{"type":"String"},"gender":{"type":"String"},"name":{"type":"String"},"comment":{"type":"String"},"id":{"type":"String"},"gradeCode":{"type":"String"},"abbr":{"type":"String"},"priority":{"type":"Integer"},"introduction":{"type":"String"},"orgId":{"type":"String"}},"CommunityListResult":{"code":{"type":"Integer"},"lists":{"param":{"code":{"type":"String"},"address":{"type":"String"},"orgName":{"type":"String"},"phone":{"type":"String"},"kind":{"type":"Integer"},"name":{"type":"String"},"id":{"type":"String"},"abbr":{"type":"String"},"parentId":{"type":"String"},"linkman":{"type":"String"},"orgId":{"type":"String"}},"type":"List"},"one":{"param":{"code":{"type":"String"},"address":{"type":"String"},"orgName":{"type":"String"},"phone":{"type":"String"},"kind":{"type":"Integer"},"name":{"type":"String"},"id":{"type":"String"},"abbr":{"type":"String"},"parentId":{"type":"String"},"linkman":{"type":"String"},"orgId":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"StaffList":{"birthday":{"type":"Date"},"orgName":{"type":"String"},"gender":{"type":"String"},"classCodes":{"param":{"hash":{"type":"Integer"}},"type":"List"},"orgId":{"type":"String"},"photoUrl":{"type":"String"},"speciality":{"type":"String"},"phone":{"type":"String"},"name":{"type":"String"},"comment":{"type":"String"},"gradeCode":{"type":"String"},"id":{"type":"String"},"abbr":{"type":"String"},"introduction":{"type":"String"},"orgDNames":{"param":{"hash":{"type":"Integer"}},"type":"List"}},"StaffClassResult":{"code":{"type":"Integer"},"lists":{"param":{"classCode":{"type":"String"},"codeName":{"type":"String"},"comment":{"type":"String"},"id":{"type":"String"},"priority":{"type":"Integer"},"staffId":{"type":"String"}},"type":"List"},"one":{"param":{"classCode":{"type":"String"},"codeName":{"type":"String"},"comment":{"type":"String"},"id":{"type":"String"},"priority":{"type":"Integer"},"staffId":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"OrgListParam":{"code":{"type":"String"},"address":{"type":"String"},"kind":{"type":"String"},"island":{"type":"Integer"},"name":{"type":"String"},"comment":{"type":"String"},"id":{"type":"String"},"gradeCode":{"type":"String"},"position":{"type":"String"},"abbr":{"type":"String"},"parentId":{"type":"String"}},"OrgMemberParam":{"lists":{"param":{"comment":{"type":"String"},"priority":{"type":"Integer"},"orgId":{"type":"String"},"staffId":{"type":"String"}},"type":"List"}},"RsdtContractServiceParam":{"amount":{"type":"Integer"},"comment":{"type":"String"},"serviceId":{"type":"String"},"effectiveDate":{"type":"Date"}},"RsdtContractOverviewResult":{"code":{"type":"Integer"},"lists":{"param":{"teamName":{"type":"String"},"birthday":{"type":"Date"},"address":{"type":"String"},"gender":{"type":"String"},"deadlineDate":{"type":"Date"},"idCardNo":{"type":"String"},"islandId":{"type":"String"},"islandName":{"type":"String"},"phone":{"type":"String"},"residentName":{"type":"String"},"teamId":{"type":"String"},"terminalDate":{"type":"Date"},"residentId":{"type":"String"},"id":{"type":"String"},"effectiveDate":{"type":"Date"}},"type":"List"},"one":{"param":{"teamName":{"type":"String"},"birthday":{"type":"Date"},"address":{"type":"String"},"gender":{"type":"String"},"deadlineDate":{"type":"Date"},"idCardNo":{"type":"String"},"islandId":{"type":"String"},"islandName":{"type":"String"},"phone":{"type":"String"},"residentName":{"type":"String"},"teamId":{"type":"String"},"terminalDate":{"type":"Date"},"residentId":{"type":"String"},"id":{"type":"String"},"effectiveDate":{"type":"Date"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"Integer[]":{},"RsdtContractListResult":{"code":{"type":"Integer"},"rsdtContractChangeList":{"param":{"editorName":{"type":"String"},"editorId":{"type":"String"},"process":{"type":"Integer"},"orgName":{"type":"String"},"contractId":{"type":"String"},"terminalDate":{"type":"Date"},"comment":{"type":"String"},"editTime":{"type":"Date"},"id":{"type":"String"},"primaryId":{"type":"String"},"orgId":{"type":"String"}},"type":"List"},"lists":{"param":{"editorName":{"type":"String"},"teamName":{"type":"String"},"editorId":{"type":"String"},"amount":{"type":"Integer"},"deadlineDate":{"type":"Date"},"acceptTime":{"type":"Date"},"constractType":{"type":"Integer"},"editTime":{"type":"Date"},"primaryId":{"type":"String"},"serviceName":{"type":"String"},"editSiteId":{"type":"String"},"doctorName":{"type":"String"},"doctorId":{"type":"String"},"teamId":{"type":"String"},"terminalDate":{"type":"Date"},"residentId":{"type":"String"},"comment":{"type":"String"},"id":{"type":"String"},"serviceId":{"type":"String"},"serviceMonths":{"type":"Integer"},"basic":{"type":"Integer"},"effectiveDate":{"type":"Date"}},"type":"List"},"one":{"param":{"editorName":{"type":"String"},"teamName":{"type":"String"},"editorId":{"type":"String"},"amount":{"type":"Integer"},"deadlineDate":{"type":"Date"},"acceptTime":{"type":"Date"},"constractType":{"type":"Integer"},"editTime":{"type":"Date"},"primaryId":{"type":"String"},"serviceName":{"type":"String"},"editSiteId":{"type":"String"},"doctorName":{"type":"String"},"doctorId":{"type":"String"},"teamId":{"type":"String"},"terminalDate":{"type":"Date"},"residentId":{"type":"String"},"comment":{"type":"String"},"id":{"type":"String"},"serviceId":{"type":"String"},"serviceMonths":{"type":"Integer"},"basic":{"type":"Integer"},"effectiveDate":{"type":"Date"}},"type":"Class"},"errorCode":{"type":"String"},"rcstResultList":{"param":{"editorName":{"type":"String"},"amount":{"type":"Integer"},"islandName":{"type":"String"},"doctorId":{"type":"String"},"deadlineDate":{"type":"Date"},"rsdtServiceTermsList":{"param":{"mode":{"type":"Integer"},"lastTime":{"type":"Date"},"planCount":{"type":"Integer"},"seqNo":{"type":"Integer"},"doneCount":{"type":"Integer"},"contractId":{"type":"String"},"comment":{"type":"String"},"id":{"type":"String"},"title":{"type":"String"}},"type":"List"},"contractId":{"type":"String"},"constractType":{"type":"Integer"},"serviceName":{"type":"String"},"serviceMonths":{"type":"Integer"},"basic":{"type":"Integer"},"effectiveDate":{"type":"Date"}},"type":"List"},"message":{"type":"String"}},"RsdtContractDetailResult":{"rsdtContractServiceTermsList":{"param":{"editorName":{"type":"String"},"amount":{"type":"Integer"},"islandName":{"type":"String"},"doctorId":{"type":"String"},"deadlineDate":{"type":"Date"},"rsdtServiceTermsList":{"param":{"mode":{"type":"Integer"},"lastTime":{"type":"Date"},"planCount":{"type":"Integer"},"seqNo":{"type":"Integer"},"doneCount":{"type":"Integer"},"contractId":{"type":"String"},"comment":{"type":"String"},"id":{"type":"String"},"title":{"type":"String"}},"type":"List"},"contractId":{"type":"String"},"constractType":{"type":"Integer"},"serviceName":{"type":"String"},"serviceMonths":{"type":"Integer"},"basic":{"type":"Integer"},"effectiveDate":{"type":"Date"}},"type":"List"},"code":{"type":"Integer"},"orgMembersResultList":{"param":{"gradeName":{"type":"String"},"orgName":{"type":"String"},"jobClassName":{"type":"String"},"staffName":{"type":"String"},"staffId":{"type":"String"}},"type":"List"},"errorCode":{"type":"String"},"doctorTeamName":{"type":"String"},"message":{"type":"String"},"serviceNames":{"type":"String"}},"RsdtContractChange":{"editorName":{"type":"String"},"editorId":{"type":"String"},"process":{"type":"Integer"},"orgName":{"type":"String"},"contractId":{"type":"String"},"terminalDate":{"type":"Date"},"comment":{"type":"String"},"editTime":{"type":"Date"},"id":{"type":"String"},"primaryId":{"type":"String"},"orgId":{"type":"String"}},"ServiceListResult":{"code":{"type":"Integer"},"lists":{"param":{"code":{"type":"String"},"months":{"type":"Integer"},"name":{"type":"String"},"comment":{"type":"String"},"id":{"type":"String"},"basic":{"type":"Integer"},"content":{"type":"String"}},"type":"List"},"one":{"param":{"code":{"type":"String"},"months":{"type":"Integer"},"name":{"type":"String"},"comment":{"type":"String"},"id":{"type":"String"},"basic":{"type":"Integer"},"content":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"},"serviceListBySlave":{"param":{"code":{"type":"String"},"months":{"type":"Integer"},"name":{"type":"String"},"comment":{"type":"String"},"id":{"type":"String"},"basic":{"type":"Integer"},"content":{"type":"String"}},"type":"List"}},"RsdtContractParam":{"drTeamId":{"type":"String"},"residentId":{"type":"String"},"comment":{"type":"String"},"islandId":{"type":"String"},"editSiteId":{"type":"String"}},"ResidentOverviewResult":{"rsdtProblemList":{"param":{"adscript":{"type":"String"},"editTime":{"type":"Date"},"problemName":{"type":"String"},"dealGrade":{"type":"Integer"}},"type":"List"},"code":{"type":"Integer"},"lists":{"param":{"teamName":{"type":"String"},"birthday":{"type":"Date"},"address":{"type":"String"},"islandName":{"type":"String"},"gender":{"type":"String"},"phone":{"type":"String"},"residentName":{"type":"String"},"idCardNo":{"type":"String"},"teamId":{"type":"String"},"remarkName":{"type":"String"},"residentId":{"type":"String"},"primaryId":{"type":"String"}},"type":"List"},"one":{"param":{"teamName":{"type":"String"},"birthday":{"type":"Date"},"address":{"type":"String"},"islandName":{"type":"String"},"gender":{"type":"String"},"phone":{"type":"String"},"residentName":{"type":"String"},"idCardNo":{"type":"String"},"teamId":{"type":"String"},"remarkName":{"type":"String"},"residentId":{"type":"String"},"primaryId":{"type":"String"}},"type":"Class"},"rsdtContractList":{"param":{"deadlineDate":{"type":"Date"},"rsdtServiceTermsList":{"param":{"mode":{"type":"Integer"},"lastTime":{"type":"Date"},"planCount":{"type":"Integer"},"seqNo":{"type":"Integer"},"doneCount":{"type":"Integer"},"contractId":{"type":"String"},"rsdtServiceAppointList":{"param":{"editorName":{"type":"String"},"assignerName":{"type":"String"},"seqNo":{"type":"Integer"},"workTitle":{"type":"String"},"editTime":{"type":"Date"},"title":{"type":"String"},"allCount":{"type":"Integer"},"workTime":{"type":"Date"},"workId":{"type":"String"},"termId":{"type":"String"},"workDoctor":{"type":"String"},"finishCount":{"type":"Integer"},"perfectFlag":{"type":"Integer"},"id":{"type":"String"},"assignTime":{"type":"Date"}},"type":"List"},"comment":{"type":"String"},"rsdtServiceOrderList":{"param":{"assignerName":{"type":"String"},"seqNo":{"type":"Integer"},"orderId":{"type":"String"},"kind":{"type":"Integer"},"actPlaceFlag":{"type":"Integer"},"content":{"type":"String"},"feqName":{"type":"String"},"termId":{"type":"String"},"actRoleFlag":{"type":"Integer"},"freqCode":{"type":"String"},"planTime":{"type":"Date"},"id":{"type":"String"},"assignTime":{"type":"Date"},"status":{"type":"Integer"}},"type":"List"},"id":{"type":"String"},"title":{"type":"String"}},"type":"List"},"contractId":{"type":"String"},"serviceName":{"type":"String"},"effectiveDate":{"type":"Date"}},"type":"List"},"errorCode":{"type":"String"},"message":{"type":"String"},"newestProblemDate":{"type":"Date"}},"RsdtContractStatisticsResult":{"upperAwayFocus":{"type":"String"},"code":{"type":"Integer"},"todayContract":{"type":"String"},"lowerTrendFocus":{"type":"String"},"upperTrendFocus":{"type":"String"},"errorCode":{"type":"String"},"focusFactorsMsg":{"type":"String"},"message":{"type":"String"},"weekDeadline":{"type":"String"},"focusFactorsRsdt":{"type":"String"},"weekContract":{"type":"String"},"lowerAwayFocus":{"type":"String"},"totalContract":{"type":"String"},"todayDeadline":{"type":"String"},"waitCheckContract":{"type":"String"}},"RsdtContractResult":{"code":{"type":"Integer"},"lists":{"param":{"birthday":{"type":"Date"},"colorName":{"type":"String"},"color":{"type":"String"},"gender":{"type":"String"},"phone":{"type":"String"},"residentName":{"type":"String"},"teamId":{"type":"String"},"colorCode":{"type":"String"},"residentId":{"type":"String"},"primaryId":{"type":"String"}},"type":"List"},"one":{"param":{"birthday":{"type":"Date"},"colorName":{"type":"String"},"color":{"type":"String"},"gender":{"type":"String"},"phone":{"type":"String"},"residentName":{"type":"String"},"teamId":{"type":"String"},"colorCode":{"type":"String"},"residentId":{"type":"String"},"primaryId":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"RsdtAssessProblemResult":{"code":{"type":"Integer"},"lists":{"param":{"editorName":{"type":"String"},"editorId":{"type":"String"},"evidence":{"type":"String"},"changeType":{"type":"String"},"batch":{"type":"Integer"},"adscript":{"type":"String"},"oldPriority":{"type":"Integer"},"editTime":{"type":"Date"},"problemName":{"type":"String"},"priority":{"type":"Integer"},"residentId":{"type":"String"},"id":{"type":"String"},"problemId":{"type":"String"},"dealGrade":{"type":"Integer"},"assessId":{"type":"String"}},"type":"List"},"one":{"param":{"editorName":{"type":"String"},"editorId":{"type":"String"},"evidence":{"type":"String"},"changeType":{"type":"String"},"batch":{"type":"Integer"},"adscript":{"type":"String"},"oldPriority":{"type":"Integer"},"editTime":{"type":"Date"},"problemName":{"type":"String"},"priority":{"type":"Integer"},"residentId":{"type":"String"},"id":{"type":"String"},"problemId":{"type":"String"},"dealGrade":{"type":"Integer"},"assessId":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"RsdtMonitorDetailParam":{"lists":{"param":{"itemType":{"type":"Integer"},"reviewerId":{"type":"String"},"selStatus":{"type":"String"},"arrow":{"type":"Integer"},"itemUnit":{"type":"String"},"itemName":{"type":"String"},"reviewerName":{"type":"String"},"trendLimit":{"type":"Integer"},"selTime":{"type":"String"},"validText":{"type":"String"},"id":{"type":"String"},"awayLimit":{"type":"Integer"},"caution":{"type":"String"},"trendArrow":{"type":"Integer"},"awayArrow":{"type":"Integer"},"monitorId":{"type":"String"},"method":{"type":"Integer"},"rawResult":{"type":"String"},"acceptTime":{"type":"Date"},"isSelect":{"type":"Boolean"},"selPart":{"type":"String"},"itemId":{"type":"String"},"awayCount":{"type":"Integer"},"subtitle":{"type":"String"},"reviewTime":{"type":"Date"},"trendCount":{"type":"Integer"}},"type":"List"}},"ResidentOrderTaskResult":{"code":{"type":"Integer"},"ordMonitorSuiteList":{"param":{"suiteId":{"type":"String"},"seqNo":{"type":"Integer"},"method":{"type":"Integer"},"orderId":{"type":"String"},"cycleLength":{"type":"Integer"},"freqTimes":{"type":"Integer"},"cycleUnit":{"type":"String"},"datePoints":{"type":"String"},"suiteName":{"type":"String"},"timePoints":{"type":"String"}},"type":"List"},"kind":{"type":"Integer"},"lists":{"param":{"taskTopic":{"type":"String"},"wayName":{"type":"String"},"seqNo":{"type":"Integer"},"orderId":{"type":"String"},"advice":{"type":"String"},"cycleLength":{"type":"Integer"},"genTime":{"type":"Date"},"spec":{"type":"String"},"feqName":{"type":"String"},"timePoints":{"type":"String"},"stopAlarm":{"type":"Integer"},"taskType":{"type":"String"},"herbRecipeBody":{"type":"String"},"beginTime":{"type":"Date"},"id":{"type":"String"},"perDay":{"type":"Integer"},"usageUnit":{"type":"String"},"suiteId":{"type":"String"},"giverName":{"type":"String"},"suites":{"type":"Integer"},"method":{"type":"Integer"},"orderKind":{"type":"Integer"},"actPlaceFlag":{"type":"Integer"},"aheadMin":{"type":"Integer"},"freqTimes":{"type":"Integer"},"unit":{"type":"String"},"actRoleFlag":{"type":"Integer"},"objectName":{"type":"String"},"producer":{"type":"String"},"residentId":{"type":"String"},"splitDate":{"type":"Date"},"endTime":{"type":"Date"},"cycleUnit":{"type":"String"},"datePoints":{"type":"String"}},"type":"List"},"one":{"param":{"taskTopic":{"type":"String"},"wayName":{"type":"String"},"seqNo":{"type":"Integer"},"orderId":{"type":"String"},"advice":{"type":"String"},"cycleLength":{"type":"Integer"},"genTime":{"type":"Date"},"spec":{"type":"String"},"feqName":{"type":"String"},"timePoints":{"type":"String"},"stopAlarm":{"type":"Integer"},"taskType":{"type":"String"},"herbRecipeBody":{"type":"String"},"beginTime":{"type":"Date"},"id":{"type":"String"},"perDay":{"type":"Integer"},"usageUnit":{"type":"String"},"suiteId":{"type":"String"},"giverName":{"type":"String"},"suites":{"type":"Integer"},"method":{"type":"Integer"},"orderKind":{"type":"Integer"},"actPlaceFlag":{"type":"Integer"},"aheadMin":{"type":"Integer"},"freqTimes":{"type":"Integer"},"unit":{"type":"String"},"actRoleFlag":{"type":"Integer"},"objectName":{"type":"String"},"producer":{"type":"String"},"residentId":{"type":"String"},"splitDate":{"type":"Date"},"endTime":{"type":"Date"},"cycleUnit":{"type":"String"},"datePoints":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"ordMedRecipeBodyList":{"param":{"usageUnit":{"type":"String"},"packRatio":{"type":"Integer"},"wayName":{"type":"String"},"seqNo":{"type":"Integer"},"orderId":{"type":"String"},"advice":{"type":"String"},"medId":{"type":"String"},"wayCode":{"type":"String"},"packages":{"type":"Integer"},"spec":{"type":"String"},"feqName":{"type":"String"},"freqCode":{"type":"String"},"name":{"type":"String"},"dispenseUnit":{"type":"String"},"producer":{"type":"String"},"doseUnit":{"type":"String"}},"type":"List"},"message":{"type":"String"},"ordHerbRecipeBodyList":{"param":{"doses":{"type":"Integer"},"seqNo":{"type":"Integer"},"orderId":{"type":"String"},"advice":{"type":"String"},"medId":{"type":"String"},"name":{"type":"String"},"doseUnit":{"type":"String"}},"type":"List"}},"RsdtMonitorList":{"suiteId":{"type":"String"},"method":{"type":"Integer"},"selStatus":{"type":"String"},"acceptTime":{"type":"Date"},"reporter":{"type":"String"},"uploadTime":{"type":"Date"},"selPart":{"type":"String"},"deleteTime":{"type":"Date"},"selTime":{"type":"String"},"detailList":{"param":{"itemType":{"type":"Integer"},"reviewerId":{"type":"String"},"selStatus":{"type":"String"},"arrow":{"type":"Integer"},"itemUnit":{"type":"String"},"itemName":{"type":"String"},"reviewerName":{"type":"String"},"trendLimit":{"type":"Integer"},"selTime":{"type":"String"},"validText":{"type":"String"},"id":{"type":"String"},"awayLimit":{"type":"Integer"},"caution":{"type":"String"},"trendArrow":{"type":"Integer"},"awayArrow":{"type":"Integer"},"monitorId":{"type":"String"},"method":{"type":"Integer"},"rawResult":{"type":"String"},"acceptTime":{"type":"Date"},"isSelect":{"type":"Boolean"},"selPart":{"type":"String"},"itemId":{"type":"String"},"awayCount":{"type":"Integer"},"subtitle":{"type":"String"},"reviewTime":{"type":"Date"},"trendCount":{"type":"Integer"}},"type":"List"},"residentId":{"type":"String"},"meterCode":{"type":"String"},"id":{"type":"String"},"staffId":{"type":"String"},"taskId":{"type":"String"}},"JSONResult":{"code":{"type":"Integer"},"data":{"type":"String"},"errorCode":{"type":"String"},"message":{"type":"String"}},"RsdtMonitorDetailResult":{"code":{"type":"Integer"},"lists":{"param":{"itemType":{"type":"Integer"},"reviewerId":{"type":"String"},"selStatus":{"type":"String"},"arrow":{"type":"Integer"},"itemUnit":{"type":"String"},"itemName":{"type":"String"},"reviewerName":{"type":"String"},"trendLimit":{"type":"Integer"},"selTime":{"type":"String"},"validText":{"type":"String"},"id":{"type":"String"},"awayLimit":{"type":"Integer"},"caution":{"type":"String"},"trendArrow":{"type":"Integer"},"awayArrow":{"type":"Integer"},"monitorId":{"type":"String"},"method":{"type":"Integer"},"rawResult":{"type":"String"},"acceptTime":{"type":"Date"},"isSelect":{"type":"Boolean"},"selPart":{"type":"String"},"itemId":{"type":"String"},"awayCount":{"type":"Integer"},"subtitle":{"type":"String"},"reviewTime":{"type":"Date"},"trendCount":{"type":"Integer"}},"type":"List"},"one":{"param":{"itemType":{"type":"Integer"},"reviewerId":{"type":"String"},"selStatus":{"type":"String"},"arrow":{"type":"Integer"},"itemUnit":{"type":"String"},"itemName":{"type":"String"},"reviewerName":{"type":"String"},"trendLimit":{"type":"Integer"},"selTime":{"type":"String"},"validText":{"type":"String"},"id":{"type":"String"},"awayLimit":{"type":"Integer"},"caution":{"type":"String"},"trendArrow":{"type":"Integer"},"awayArrow":{"type":"Integer"},"monitorId":{"type":"String"},"method":{"type":"Integer"},"rawResult":{"type":"String"},"acceptTime":{"type":"Date"},"isSelect":{"type":"Boolean"},"selPart":{"type":"String"},"itemId":{"type":"String"},"awayCount":{"type":"Integer"},"subtitle":{"type":"String"},"reviewTime":{"type":"Date"},"trendCount":{"type":"Integer"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"FocusMonitorResidentVOResult":{"code":{"type":"Integer"},"lists":{"param":{"birthday":{"type":"Date"},"gender":{"type":"String"},"phone":{"type":"String"},"residentName":{"type":"String"},"itemsVOs":{"param":{"lastTime":{"type":"Date"},"itemId":{"type":"String"},"awayArrow":{"type":"Integer"},"itemName":{"type":"String"},"awayCount":{"type":"Integer"},"rawResult":{"type":"String"},"itemUnit":{"type":"String"},"trendLimit":{"type":"Integer"},"awayLimit":{"type":"Integer"},"trendArrow":{"type":"Integer"},"trendCount":{"type":"Integer"}},"type":"List"},"teamId":{"type":"String"},"isReview":{"type":"Integer"},"colorCode":{"type":"String"},"residentId":{"type":"String"},"primaryId":{"type":"String"},"age":{"type":"Integer"}},"type":"List"},"one":{"param":{"birthday":{"type":"Date"},"gender":{"type":"String"},"phone":{"type":"String"},"residentName":{"type":"String"},"itemsVOs":{"param":{"lastTime":{"type":"Date"},"itemId":{"type":"String"},"awayArrow":{"type":"Integer"},"itemName":{"type":"String"},"awayCount":{"type":"Integer"},"rawResult":{"type":"String"},"itemUnit":{"type":"String"},"trendLimit":{"type":"Integer"},"awayLimit":{"type":"Integer"},"trendArrow":{"type":"Integer"},"trendCount":{"type":"Integer"}},"type":"List"},"teamId":{"type":"String"},"isReview":{"type":"Integer"},"colorCode":{"type":"String"},"residentId":{"type":"String"},"primaryId":{"type":"String"},"age":{"type":"Integer"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"RsdtAssessList":{"assessorName":{"type":"String"},"eventId":{"type":"String"},"giverId":{"type":"String"},"giveTime":{"type":"Date"},"giverName":{"type":"String"},"reportId":{"type":"String"},"cause":{"type":"Integer"},"termFrom":{"type":"Date"},"termTo":{"type":"Date"},"assessTime":{"type":"Date"},"assessorId":{"type":"String"},"residentId":{"type":"String"},"id":{"type":"String"},"status":{"type":"Integer"}},"RsdtMonitorCountVOResult":{"code":{"type":"Integer"},"lists":{"param":{"flatCount":{"type":"Integer"},"minResult":{"type":"String"},"maxResult":{"type":"String"},"normalCount":{"type":"Integer"},"highCount":{"type":"Integer"},"totalCount":{"type":"Integer"}},"type":"List"},"one":{"param":{"flatCount":{"type":"Integer"},"minResult":{"type":"String"},"maxResult":{"type":"String"},"normalCount":{"type":"Integer"},"highCount":{"type":"Integer"},"totalCount":{"type":"Integer"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"RsdtMonitorListParam":{"lists":{"param":{"suiteId":{"type":"String"},"method":{"type":"Integer"},"selStatus":{"type":"String"},"acceptTime":{"type":"Date"},"reporter":{"type":"String"},"uploadTime":{"type":"Date"},"selPart":{"type":"String"},"deleteTime":{"type":"Date"},"selTime":{"type":"String"},"detailList":{"param":{"itemType":{"type":"Integer"},"reviewerId":{"type":"String"},"selStatus":{"type":"String"},"arrow":{"type":"Integer"},"itemUnit":{"type":"String"},"itemName":{"type":"String"},"reviewerName":{"type":"String"},"trendLimit":{"type":"Integer"},"selTime":{"type":"String"},"validText":{"type":"String"},"id":{"type":"String"},"awayLimit":{"type":"Integer"},"caution":{"type":"String"},"trendArrow":{"type":"Integer"},"awayArrow":{"type":"Integer"},"monitorId":{"type":"String"},"method":{"type":"Integer"},"rawResult":{"type":"String"},"acceptTime":{"type":"Date"},"isSelect":{"type":"Boolean"},"selPart":{"type":"String"},"itemId":{"type":"String"},"awayCount":{"type":"Integer"},"subtitle":{"type":"String"},"reviewTime":{"type":"Date"},"trendCount":{"type":"Integer"}},"type":"List"},"residentId":{"type":"String"},"meterCode":{"type":"String"},"id":{"type":"String"},"staffId":{"type":"String"},"taskId":{"type":"String"}},"type":"List"}},"RsdtMonitorDetailMapVOResult":{"code":{"type":"Integer"},"errorCode":{"type":"String"},"message":{"type":"String"}},"RsdtAssessProblem":{"editorName":{"type":"String"},"editorId":{"type":"String"},"evidence":{"type":"String"},"changeType":{"type":"String"},"batch":{"type":"Integer"},"adscript":{"type":"String"},"oldPriority":{"type":"Integer"},"editTime":{"type":"Date"},"problemName":{"type":"String"},"priority":{"type":"Integer"},"residentId":{"type":"String"},"id":{"type":"String"},"problemId":{"type":"String"},"dealGrade":{"type":"Integer"},"assessId":{"type":"String"}},"RsdtMonitorListResult":{"code":{"type":"Integer"},"lists":{"param":{"suiteId":{"type":"String"},"method":{"type":"Integer"},"selStatus":{"type":"String"},"acceptTime":{"type":"Date"},"reporter":{"type":"String"},"uploadTime":{"type":"Date"},"selPart":{"type":"String"},"deleteTime":{"type":"Date"},"selTime":{"type":"String"},"detailList":{"param":{"itemType":{"type":"Integer"},"reviewerId":{"type":"String"},"selStatus":{"type":"String"},"arrow":{"type":"Integer"},"itemUnit":{"type":"String"},"itemName":{"type":"String"},"reviewerName":{"type":"String"},"trendLimit":{"type":"Integer"},"selTime":{"type":"String"},"validText":{"type":"String"},"id":{"type":"String"},"awayLimit":{"type":"Integer"},"caution":{"type":"String"},"trendArrow":{"type":"Integer"},"awayArrow":{"type":"Integer"},"monitorId":{"type":"String"},"method":{"type":"Integer"},"rawResult":{"type":"String"},"acceptTime":{"type":"Date"},"isSelect":{"type":"Boolean"},"selPart":{"type":"String"},"itemId":{"type":"String"},"awayCount":{"type":"Integer"},"subtitle":{"type":"String"},"reviewTime":{"type":"Date"},"trendCount":{"type":"Integer"}},"type":"List"},"residentId":{"type":"String"},"meterCode":{"type":"String"},"id":{"type":"String"},"staffId":{"type":"String"},"taskId":{"type":"String"}},"type":"List"},"one":{"param":{"suiteId":{"type":"String"},"method":{"type":"Integer"},"selStatus":{"type":"String"},"acceptTime":{"type":"Date"},"reporter":{"type":"String"},"uploadTime":{"type":"Date"},"selPart":{"type":"String"},"deleteTime":{"type":"Date"},"selTime":{"type":"String"},"detailList":{"param":{"itemType":{"type":"Integer"},"reviewerId":{"type":"String"},"selStatus":{"type":"String"},"arrow":{"type":"Integer"},"itemUnit":{"type":"String"},"itemName":{"type":"String"},"reviewerName":{"type":"String"},"trendLimit":{"type":"Integer"},"selTime":{"type":"String"},"validText":{"type":"String"},"id":{"type":"String"},"awayLimit":{"type":"Integer"},"caution":{"type":"String"},"trendArrow":{"type":"Integer"},"awayArrow":{"type":"Integer"},"monitorId":{"type":"String"},"method":{"type":"Integer"},"rawResult":{"type":"String"},"acceptTime":{"type":"Date"},"isSelect":{"type":"Boolean"},"selPart":{"type":"String"},"itemId":{"type":"String"},"awayCount":{"type":"Integer"},"subtitle":{"type":"String"},"reviewTime":{"type":"Date"},"trendCount":{"type":"Integer"}},"type":"List"},"residentId":{"type":"String"},"meterCode":{"type":"String"},"id":{"type":"String"},"staffId":{"type":"String"},"taskId":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"RsdtProblemListResult":{"rsdtAssessLists":{"param":{"assessorName":{"type":"String"},"eventId":{"type":"String"},"giverId":{"type":"String"},"giveTime":{"type":"Date"},"giverName":{"type":"String"},"reportId":{"type":"String"},"cause":{"type":"Integer"},"termFrom":{"type":"Date"},"termTo":{"type":"Date"},"assessTime":{"type":"Date"},"assessorId":{"type":"String"},"residentId":{"type":"String"},"id":{"type":"String"},"status":{"type":"Integer"}},"type":"List"},"code":{"type":"Integer"},"lists":{"param":{"editorName":{"type":"String"},"editorId":{"type":"String"},"evidence":{"type":"String"},"adscript":{"type":"String"},"batch":{"type":"Integer"},"residentId":{"type":"String"},"editTime":{"type":"Date"},"problemName":{"type":"String"},"problemId":{"type":"String"},"priority":{"type":"Integer"},"dealGrade":{"type":"Integer"},"assessId":{"type":"String"}},"type":"List"},"one":{"param":{"editorName":{"type":"String"},"editorId":{"type":"String"},"evidence":{"type":"String"},"adscript":{"type":"String"},"batch":{"type":"Integer"},"residentId":{"type":"String"},"editTime":{"type":"Date"},"problemName":{"type":"String"},"problemId":{"type":"String"},"priority":{"type":"Integer"},"dealGrade":{"type":"Integer"},"assessId":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"ResidentFocusItemsParam":{"seqNo":{"type":"Integer"},"lists":{"param":{"special":{"type":"String"},"itemId":{"type":"String"},"valueId":{"type":"String"},"seqNo":{"type":"Integer"},"subTitle":{"type":"String"},"trendLimit":{"type":"Integer"},"awayLimit":{"type":"Integer"}},"type":"List"},"residentId":{"type":"String"},"style":{"type":"Integer"},"onlyDoctor":{"type":"Integer"}},"ResidentHabitsParam":{"lists":{"param":{"ring":{"type":"Integer"},"pointKind":{"type":"Integer"},"residentId":{"type":"String"},"pointTime":{"type":"Date"}},"type":"List"}},"ResidentHabitsResult":{"code":{"type":"Integer"},"lists":{"param":{"ring":{"type":"Integer"},"pointKind":{"type":"Integer"},"residentId":{"type":"String"},"pointTime":{"type":"Date"}},"type":"List"},"one":{"param":{"ring":{"type":"Integer"},"pointKind":{"type":"Integer"},"residentId":{"type":"String"},"pointTime":{"type":"Date"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"ResidentAllergyResult":{"code":{"type":"Integer"},"lists":{"param":{"pharmic":{"type":"Integer"},"editorName":{"type":"String"},"editorId":{"type":"String"},"kindCode":{"type":"String"},"adscript":{"type":"String"},"residentId":{"type":"String"},"editTime":{"type":"Date"},"id":{"type":"String"},"content":{"type":"String"}},"type":"List"},"one":{"param":{"pharmic":{"type":"Integer"},"editorName":{"type":"String"},"editorId":{"type":"String"},"kindCode":{"type":"String"},"adscript":{"type":"String"},"residentId":{"type":"String"},"editTime":{"type":"Date"},"id":{"type":"String"},"content":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"ResidentFocusItemsResult":{"code":{"type":"Integer"},"lists":{"param":{"itemId":{"type":"String"},"itemName":{"type":"String"},"itemType":{"type":"Integer"},"seqNo":{"type":"Integer"},"itemUnit":{"type":"String"},"residentId":{"type":"String"},"style":{"type":"Integer"},"id":{"type":"String"},"onlyDoctor":{"type":"Integer"}},"type":"List"},"one":{"param":{"itemId":{"type":"String"},"itemName":{"type":"String"},"itemType":{"type":"Integer"},"seqNo":{"type":"Integer"},"itemUnit":{"type":"String"},"residentId":{"type":"String"},"style":{"type":"Integer"},"id":{"type":"String"},"onlyDoctor":{"type":"Integer"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"FamilyList":{"headName":{"type":"String"},"townName":{"type":"String"},"address":{"type":"String"},"headPhone":{"type":"String"},"townAddress":{"type":"String"},"id":{"type":"String"},"communityId":{"type":"String"}},"ResidentFocusValueResult":{"code":{"type":"Integer"},"seqNo":{"type":"Integer"},"lists":{"param":{"lastTime":{"type":"Date"},"awayArrow":{"type":"Integer"},"seqNo":{"type":"Integer"},"rawResult":{"type":"String"},"itemUnit":{"type":"String"},"detailId":{"type":"String"},"onlyDoctor":{"type":"Integer"},"itemId":{"type":"String"},"itemName":{"type":"String"},"awayCount":{"type":"Integer"},"subtitle":{"type":"String"},"trendLimit":{"type":"Integer"},"residentId":{"type":"String"},"validText":{"type":"String"},"style":{"type":"Integer"},"id":{"type":"String"},"awayLimit":{"type":"Integer"},"trendArrow":{"type":"Integer"},"reviewTime":{"type":"Date"},"trendCount":{"type":"Integer"}},"type":"List"},"one":{"param":{"lastTime":{"type":"Date"},"awayArrow":{"type":"Integer"},"seqNo":{"type":"Integer"},"rawResult":{"type":"String"},"itemUnit":{"type":"String"},"detailId":{"type":"String"},"onlyDoctor":{"type":"Integer"},"itemId":{"type":"String"},"itemName":{"type":"String"},"awayCount":{"type":"Integer"},"subtitle":{"type":"String"},"trendLimit":{"type":"Integer"},"residentId":{"type":"String"},"validText":{"type":"String"},"style":{"type":"Integer"},"id":{"type":"String"},"awayLimit":{"type":"Integer"},"trendArrow":{"type":"Integer"},"reviewTime":{"type":"Date"},"trendCount":{"type":"Integer"}},"type":"Class"},"errorCode":{"type":"String"},"style":{"type":"Integer"},"message":{"type":"String"},"onlyDoctor":{"type":"Integer"}},"ResidentListParam":{},"ResidentListResult":{"code":{"type":"Integer"},"exposurehistorys":{"param":{"editorName":{"type":"String"},"editorId":{"type":"String"},"kindCode":{"type":"String"},"seqNo":{"type":"Integer"},"adscript":{"type":"String"},"editTime":{"type":"Date"},"occurDate":{"type":"Date"},"recordName":{"type":"String"},"kindName":{"type":"String"},"residentId":{"type":"String"},"kindAdscript":{"type":"String"},"recordCode":{"type":"String"},"id":{"type":"String"}},"type":"List"},"lists":{"param":{"birthday":{"type":"Date"},"stayKind":{"type":"Integer"},"linkPhone":{"type":"String"},"education":{"type":"String"},"occupation":{"type":"String"},"payModes":{"type":"String"},"gender":{"type":"String"},"idCardNo":{"type":"String"},"isHead":{"type":"Boolean"},"minority":{"type":"String"},"existAccount":{"type":"Boolean"},"orgId":{"type":"String"},"archiveNo":{"type":"String"},"commitTime":{"type":"Date"},"lockTime":{"type":"Date"},"townAddress":{"type":"String"},"id":{"type":"String"},"abbr":{"type":"String"},"relationship":{"type":"String"},"communityId":{"type":"String"},"archiveAddress":{"type":"String"},"aboBlood":{"type":"String"},"workUnit":{"type":"String"},"address":{"type":"String"},"linkman":{"type":"String"},"familyId":{"type":"String"},"phone":{"type":"String"},"openGrade":{"type":"Integer"},"rhBlood":{"type":"String"},"name":{"type":"String"},"archiveStatus":{"type":"Integer"},"maritalStatus":{"type":"String"},"status":{"type":"Integer"}},"type":"List"},"one":{"param":{"birthday":{"type":"Date"},"stayKind":{"type":"Integer"},"linkPhone":{"type":"String"},"education":{"type":"String"},"occupation":{"type":"String"},"payModes":{"type":"String"},"gender":{"type":"String"},"idCardNo":{"type":"String"},"isHead":{"type":"Boolean"},"minority":{"type":"String"},"existAccount":{"type":"Boolean"},"orgId":{"type":"String"},"archiveNo":{"type":"String"},"commitTime":{"type":"Date"},"lockTime":{"type":"Date"},"townAddress":{"type":"String"},"id":{"type":"String"},"abbr":{"type":"String"},"relationship":{"type":"String"},"communityId":{"type":"String"},"archiveAddress":{"type":"String"},"aboBlood":{"type":"String"},"workUnit":{"type":"String"},"address":{"type":"String"},"linkman":{"type":"String"},"familyId":{"type":"String"},"phone":{"type":"String"},"openGrade":{"type":"Integer"},"rhBlood":{"type":"String"},"name":{"type":"String"},"archiveStatus":{"type":"Integer"},"maritalStatus":{"type":"String"},"status":{"type":"Integer"}},"type":"Class"},"errorCode":{"type":"String"},"geneticDiseases":{"param":{"editorName":{"type":"String"},"editorId":{"type":"String"},"kindCode":{"type":"String"},"seqNo":{"type":"Integer"},"adscript":{"type":"String"},"editTime":{"type":"Date"},"occurDate":{"type":"Date"},"recordName":{"type":"String"},"kindName":{"type":"String"},"residentId":{"type":"String"},"kindAdscript":{"type":"String"},"recordCode":{"type":"String"},"id":{"type":"String"}},"type":"List"},"residentAllergyDomains":{"param":{"pharmic":{"type":"Integer"},"editorName":{"type":"String"},"editorId":{"type":"String"},"kindCode":{"type":"String"},"adscript":{"type":"String"},"residentId":{"type":"String"},"editTime":{"type":"Date"},"id":{"type":"String"},"content":{"type":"String"}},"type":"List"},"familyHistorys":{"param":{"editorName":{"type":"String"},"editorId":{"type":"String"},"kindCode":{"type":"String"},"seqNo":{"type":"Integer"},"adscript":{"type":"String"},"editTime":{"type":"Date"},"occurDate":{"type":"Date"},"recordName":{"type":"String"},"kindName":{"type":"String"},"residentId":{"type":"String"},"kindAdscript":{"type":"String"},"recordCode":{"type":"String"},"id":{"type":"String"}},"type":"List"},"message":{"type":"String"},"residentPmhDomains":{"param":{"editorName":{"type":"String"},"editorId":{"type":"String"},"kindCode":{"type":"String"},"seqNo":{"type":"Integer"},"adscript":{"type":"String"},"editTime":{"type":"Date"},"occurDate":{"type":"Date"},"recordName":{"type":"String"},"kindName":{"type":"String"},"residentId":{"type":"String"},"kindAdscript":{"type":"String"},"recordCode":{"type":"String"},"id":{"type":"String"}},"type":"List"},"disabilitys":{"param":{"editorName":{"type":"String"},"editorId":{"type":"String"},"kindCode":{"type":"String"},"seqNo":{"type":"Integer"},"adscript":{"type":"String"},"editTime":{"type":"Date"},"occurDate":{"type":"Date"},"recordName":{"type":"String"},"kindName":{"type":"String"},"residentId":{"type":"String"},"kindAdscript":{"type":"String"},"recordCode":{"type":"String"},"id":{"type":"String"}},"type":"List"}},"ResidentPmhResult":{"code":{"type":"Integer"},"lists":{"param":{"editorName":{"type":"String"},"editorId":{"type":"String"},"kindCode":{"type":"String"},"seqNo":{"type":"Integer"},"adscript":{"type":"String"},"editTime":{"type":"Date"},"occurDate":{"type":"Date"},"recordName":{"type":"String"},"kindName":{"type":"String"},"residentId":{"type":"String"},"kindAdscript":{"type":"String"},"recordCode":{"type":"String"},"id":{"type":"String"}},"type":"List"},"one":{"param":{"editorName":{"type":"String"},"editorId":{"type":"String"},"kindCode":{"type":"String"},"seqNo":{"type":"Integer"},"adscript":{"type":"String"},"editTime":{"type":"Date"},"occurDate":{"type":"Date"},"recordName":{"type":"String"},"kindName":{"type":"String"},"residentId":{"type":"String"},"kindAdscript":{"type":"String"},"recordCode":{"type":"String"},"id":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"FamilyListResult":{"code":{"type":"Integer"},"lists":{"param":{"headName":{"type":"String"},"townName":{"type":"String"},"address":{"type":"String"},"headPhone":{"type":"String"},"townAddress":{"type":"String"},"id":{"type":"String"},"communityId":{"type":"String"}},"type":"List"},"one":{"param":{"headName":{"type":"String"},"townName":{"type":"String"},"address":{"type":"String"},"headPhone":{"type":"String"},"townAddress":{"type":"String"},"id":{"type":"String"},"communityId":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"ResidentAllergyParam":{"lists":{"param":{"pharmic":{"type":"Integer"},"editorName":{"type":"String"},"editorId":{"type":"String"},"kindCode":{"type":"String"},"adscript":{"type":"String"},"residentId":{"type":"String"},"editTime":{"type":"Date"},"id":{"type":"String"},"content":{"type":"String"}},"type":"List"}},"ResidentPmhParam":{"lists":{"param":{"editorName":{"type":"String"},"editorId":{"type":"String"},"kindCode":{"type":"String"},"seqNo":{"type":"Integer"},"adscript":{"type":"String"},"editTime":{"type":"Date"},"occurDate":{"type":"Date"},"recordName":{"type":"String"},"kindName":{"type":"String"},"residentId":{"type":"String"},"kindAdscript":{"type":"String"},"recordCode":{"type":"String"},"id":{"type":"String"}},"type":"List"}},"ResidentList":{"birthday":{"type":"Date"},"stayKind":{"type":"Integer"},"linkPhone":{"type":"String"},"education":{"type":"String"},"occupation":{"type":"String"},"payModes":{"type":"String"},"gender":{"type":"String"},"idCardNo":{"type":"String"},"isHead":{"type":"Boolean"},"minority":{"type":"String"},"existAccount":{"type":"Boolean"},"orgId":{"type":"String"},"archiveNo":{"type":"String"},"commitTime":{"type":"Date"},"lockTime":{"type":"Date"},"townAddress":{"type":"String"},"id":{"type":"String"},"abbr":{"type":"String"},"relationship":{"type":"String"},"communityId":{"type":"String"},"archiveAddress":{"type":"String"},"aboBlood":{"type":"String"},"workUnit":{"type":"String"},"address":{"type":"String"},"linkman":{"type":"String"},"familyId":{"type":"String"},"phone":{"type":"String"},"openGrade":{"type":"Integer"},"rhBlood":{"type":"String"},"name":{"type":"String"},"archiveStatus":{"type":"Integer"},"maritalStatus":{"type":"String"},"status":{"type":"Integer"}},"ResidentFocusVOResult":{"code":{"type":"Integer"},"lists":{"param":{"special":{"type":"String"},"itemId":{"type":"String"},"itemName":{"type":"String"},"focusValueVOs":{"param":{"isDoctor":{"type":"Boolean"},"subtitle":{"type":"String"},"validText":{"type":"String"},"id":{"type":"String"}},"type":"List"},"itemUnit":{"type":"String"},"id":{"type":"String"}},"type":"List"},"one":{"param":{"special":{"type":"String"},"itemId":{"type":"String"},"itemName":{"type":"String"},"focusValueVOs":{"param":{"isDoctor":{"type":"Boolean"},"subtitle":{"type":"String"},"validText":{"type":"String"},"id":{"type":"String"}},"type":"List"},"itemUnit":{"type":"String"},"id":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"Map":{},"StaffWorkListResult":{"code":{"type":"Integer"},"lists":{"param":{"isCarryIOC":{"type":"Boolean"},"seqNo":{"type":"Integer"},"repeatDays":{"type":"String"},"lastsMin":{"type":"Integer"},"endDate":{"type":"Date"},"title":{"type":"String"},"allCount":{"type":"Integer"},"fromDate":{"type":"Date"},"regLimits":{"type":"Integer"},"submitTime":{"type":"Date"},"repeatText":{"type":"String"},"isSubscribeIOC":{"type":"Boolean"},"rsdtServiceAppoints":{"param":{"editorName":{"type":"String"},"assignerName":{"type":"String"},"seqNo":{"type":"Integer"},"workTitle":{"type":"String"},"editTime":{"type":"Date"},"title":{"type":"String"},"allCount":{"type":"Integer"},"workTime":{"type":"Date"},"workId":{"type":"String"},"termId":{"type":"String"},"workDoctor":{"type":"String"},"finishCount":{"type":"Integer"},"perfectFlag":{"type":"Integer"},"id":{"type":"String"},"assignTime":{"type":"Date"}},"type":"List"},"repeatSpan":{"type":"Integer"},"comment":{"type":"String"},"startTime":{"type":"Date"},"id":{"type":"String"},"privyPlan":{"type":"Integer"},"staffId":{"type":"String"}},"type":"List"},"one":{"param":{"isCarryIOC":{"type":"Boolean"},"seqNo":{"type":"Integer"},"repeatDays":{"type":"String"},"lastsMin":{"type":"Integer"},"endDate":{"type":"Date"},"title":{"type":"String"},"allCount":{"type":"Integer"},"fromDate":{"type":"Date"},"regLimits":{"type":"Integer"},"submitTime":{"type":"Date"},"repeatText":{"type":"String"},"isSubscribeIOC":{"type":"Boolean"},"rsdtServiceAppoints":{"param":{"editorName":{"type":"String"},"assignerName":{"type":"String"},"seqNo":{"type":"Integer"},"workTitle":{"type":"String"},"editTime":{"type":"Date"},"title":{"type":"String"},"allCount":{"type":"Integer"},"workTime":{"type":"Date"},"workId":{"type":"String"},"termId":{"type":"String"},"workDoctor":{"type":"String"},"finishCount":{"type":"Integer"},"perfectFlag":{"type":"Integer"},"id":{"type":"String"},"assignTime":{"type":"Date"}},"type":"List"},"repeatSpan":{"type":"Integer"},"comment":{"type":"String"},"startTime":{"type":"Date"},"id":{"type":"String"},"privyPlan":{"type":"Integer"},"staffId":{"type":"String"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"RsdtServiceAppointVOResult":{"code":{"type":"Integer"},"lists":{"param":{"birthday":{"type":"Date"},"gender":{"type":"String"},"primaryId":{"type":"String"},"title":{"type":"String"},"workTime":{"type":"Date"},"workId":{"type":"String"},"termId":{"type":"String"},"phone":{"type":"String"},"residentName":{"type":"String"},"residentId":{"type":"String"},"colorCode":{"type":"String"},"id":{"type":"String"},"perfectFlag":{"type":"Integer"}},"type":"List"},"one":{"param":{"birthday":{"type":"Date"},"gender":{"type":"String"},"primaryId":{"type":"String"},"title":{"type":"String"},"workTime":{"type":"Date"},"workId":{"type":"String"},"termId":{"type":"String"},"phone":{"type":"String"},"residentName":{"type":"String"},"residentId":{"type":"String"},"colorCode":{"type":"String"},"id":{"type":"String"},"perfectFlag":{"type":"Integer"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"RsdtServiceAppointParam":{"termId":{"type":"String"},"id":{"type":"String"},"workTime":{"type":"Date"},"workId":{"type":"String"}},"DoctorHomePageStatisticsResult":{"code":{"type":"Integer"},"errorCode":{"type":"String"},"message":{"type":"String"}},"DoctorFocusResidents":{"suggester":{"type":"String"},"orderAudit":{"type":"Integer"},"doctorId":{"type":"String"},"residentId":{"type":"String"},"remarkName":{"type":"String"},"colorCode":{"type":"String"},"comment":{"type":"String"},"suggestTime":{"type":"Date"},"gradeCode":{"type":"String"},"remarkAbbr":{"type":"String"}},"StaffListWorkVOResult":{"code":{"type":"Integer"},"lists":{"param":{"birthday":{"type":"Date"},"orgName":{"type":"String"},"gender":{"type":"String"},"classCodes":{"param":{"hash":{"type":"Integer"}},"type":"List"},"orgId":{"type":"String"},"staffWorkLists":{"param":{"isCarryIOC":{"type":"Boolean"},"seqNo":{"type":"Integer"},"repeatDays":{"type":"String"},"lastsMin":{"type":"Integer"},"endDate":{"type":"Date"},"title":{"type":"String"},"allCount":{"type":"Integer"},"fromDate":{"type":"Date"},"regLimits":{"type":"Integer"},"submitTime":{"type":"Date"},"repeatText":{"type":"String"},"isSubscribeIOC":{"type":"Boolean"},"rsdtServiceAppoints":{"param":{"editorName":{"type":"String"},"assignerName":{"type":"String"},"seqNo":{"type":"Integer"},"workTitle":{"type":"String"},"editTime":{"type":"Date"},"title":{"type":"String"},"allCount":{"type":"Integer"},"workTime":{"type":"Date"},"workId":{"type":"String"},"termId":{"type":"String"},"workDoctor":{"type":"String"},"finishCount":{"type":"Integer"},"perfectFlag":{"type":"Integer"},"id":{"type":"String"},"assignTime":{"type":"Date"}},"type":"List"},"repeatSpan":{"type":"Integer"},"comment":{"type":"String"},"startTime":{"type":"Date"},"id":{"type":"String"},"privyPlan":{"type":"Integer"},"staffId":{"type":"String"}},"type":"List"},"photoUrl":{"type":"String"},"speciality":{"type":"String"},"phone":{"type":"String"},"name":{"type":"String"},"comment":{"type":"String"},"gradeCode":{"type":"String"},"id":{"type":"String"},"abbr":{"type":"String"},"introduction":{"type":"String"},"orgDNames":{"param":{"hash":{"type":"Integer"}},"type":"List"}},"type":"List"},"one":{"param":{"birthday":{"type":"Date"},"orgName":{"type":"String"},"gender":{"type":"String"},"classCodes":{"param":{"hash":{"type":"Integer"}},"type":"List"},"orgId":{"type":"String"},"staffWorkLists":{"param":{"isCarryIOC":{"type":"Boolean"},"seqNo":{"type":"Integer"},"repeatDays":{"type":"String"},"lastsMin":{"type":"Integer"},"endDate":{"type":"Date"},"title":{"type":"String"},"allCount":{"type":"Integer"},"fromDate":{"type":"Date"},"regLimits":{"type":"Integer"},"submitTime":{"type":"Date"},"repeatText":{"type":"String"},"isSubscribeIOC":{"type":"Boolean"},"rsdtServiceAppoints":{"param":{"editorName":{"type":"String"},"assignerName":{"type":"String"},"seqNo":{"type":"Integer"},"workTitle":{"type":"String"},"editTime":{"type":"Date"},"title":{"type":"String"},"allCount":{"type":"Integer"},"workTime":{"type":"Date"},"workId":{"type":"String"},"termId":{"type":"String"},"workDoctor":{"type":"String"},"finishCount":{"type":"Integer"},"perfectFlag":{"type":"Integer"},"id":{"type":"String"},"assignTime":{"type":"Date"}},"type":"List"},"repeatSpan":{"type":"Integer"},"comment":{"type":"String"},"startTime":{"type":"Date"},"id":{"type":"String"},"privyPlan":{"type":"Integer"},"staffId":{"type":"String"}},"type":"List"},"photoUrl":{"type":"String"},"speciality":{"type":"String"},"phone":{"type":"String"},"name":{"type":"String"},"comment":{"type":"String"},"gradeCode":{"type":"String"},"id":{"type":"String"},"abbr":{"type":"String"},"introduction":{"type":"String"},"orgDNames":{"param":{"hash":{"type":"Integer"}},"type":"List"}},"type":"Class"},"errorCode":{"type":"String"},"message":{"type":"String"}},"StaffWorkList":{"isCarryIOC":{"type":"Boolean"},"seqNo":{"type":"Integer"},"repeatDays":{"type":"String"},"lastsMin":{"type":"Integer"},"endDate":{"type":"Date"},"title":{"type":"String"},"allCount":{"type":"Integer"},"fromDate":{"type":"Date"},"regLimits":{"type":"Integer"},"submitTime":{"type":"Date"},"repeatText":{"type":"String"},"isSubscribeIOC":{"type":"Boolean"},"rsdtServiceAppoints":{"param":{"editorName":{"type":"String"},"assignerName":{"type":"String"},"seqNo":{"type":"Integer"},"workTitle":{"type":"String"},"editTime":{"type":"Date"},"title":{"type":"String"},"allCount":{"type":"Integer"},"workTime":{"type":"Date"},"workId":{"type":"String"},"termId":{"type":"String"},"workDoctor":{"type":"String"},"finishCount":{"type":"Integer"},"perfectFlag":{"type":"Integer"},"id":{"type":"String"},"assignTime":{"type":"Date"}},"type":"List"},"repeatSpan":{"type":"Integer"},"comment":{"type":"String"},"startTime":{"type":"Date"},"id":{"type":"String"},"privyPlan":{"type":"Integer"},"staffId":{"type":"String"}}};
    var paramData = {"$107576219":{"$3135262":{"result":{"name":"void","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"Integer"}}},"$1867169789":{"result":{"name":"void","type":"Class"},"param":{"arg0":{"name":"BaseResult","type":"Class"}}}},"$1082173962":{"$135120909":{"result":{"name":"ArticleTopicsResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1052242615":{"result":{"name":"ArticleFavoriteLogVOResult","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$195714224":{"result":{"name":"MonitorSuiteItemsResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$247264442":{"result":{"name":"ClientVersionResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$354820654":{"result":{"name":"AccountList","type":"Class"},"param":{"arg0":{"type":"String"}}},"$671705601":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"MonitorSuiteItems","type":"Class"}}},"$506698297":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"MonitorItems","type":"Class"}}},"$893483599":{"result":{"name":"ArticleFavoriteLogResult","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$1881409580":{"result":{"name":"MonitorReferencesResult","type":"Class"},"param":{"arg3":{"type":"String"},"arg2":{"type":"String"},"arg5":{"type":"String"},"arg4":{"type":"String"},"arg1":{"type":"String"},"arg0":{"type":"String"},"arg6":{"type":"String"}}},"$560726371":{"result":{"name":"WechatTempListResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1005664739":{"result":{"name":"Result","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$254110514":{"result":{"name":"WechatTempListResult","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$1539417047":{"result":{"name":"Result","type":"Class"},"param":{"arg2":{"type":"String"},"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$1641078217":{"result":{"name":"WechatTempList","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"Integer"}}},"$656630585":{"result":{"name":"ArticleDiscussLogResult","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$136525369":{"result":{"name":"ArticleDiscussLogResult","type":"Class"},"param":{"arg0":{"name":"ArticleDiscussLog","type":"Class"}}},"$497836465":{"result":{"name":"MonitorReferencesResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$191829617":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"ArticleFavoriteLog","type":"Class"}}},"$1991374481":{"result":{"name":"MonitorCautionsResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$404236350":{"result":{"name":"AccountManagesResult","type":"Class"},"param":{"arg0":{"name":"AccountManages","type":"Class"}}},"$2138605661":{"result":{"name":"AccountResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1296088424":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"MonitorReferences","type":"Class"}}},"$1361399811":{"result":{"name":"MonitorSuitesResult","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$1256946115":{"result":{"name":"WechatAccountResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$280037017":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"ArticleTopics","type":"Class"}}},"$1991470232":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"WechatTempElement","type":"Class"}}},"$1138772943":{"result":{"name":"AccountResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$1213499003":{"result":{"name":"AccountResult","type":"Class"},"param":{"arg2":{"type":"String"},"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$313698434":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"WechatTempList","type":"Class"}}},"$1311640095":{"result":{"name":"AccountTopicResult","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$1988822455":{"result":{"name":"MonitorReferencesResult","type":"Class"},"param":{"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$590528528":{"result":{"name":"AccountList","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1883980662":{"result":{"name":"MonitorReferences","type":"Class"},"param":{"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$1737548752":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"ArticleTopics","type":"Class"}}},"$1926742167":{"result":{"name":"AppKey","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1333962436":{"result":{"name":"Result","type":"Class"},"param":{"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$675794689":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"MonitorCautions","type":"Class"}}},"$1052921483":{"result":{"name":"ArticleTopicsResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$1986010154":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1077892981":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"MonitorSuites","type":"Class"}}},"$103149417":{"result":{"name":"AccountResult","type":"Class"},"param":{"arg3":{"type":"String"},"arg2":{"type":"String"},"arg5":{"type":"String"},"arg4":{"type":"String"},"arg1":{"type":"String"},"arg0":{"type":"String"},"arg6":{"type":"String"}}},"$1494537818":{"result":{"name":"ArticleInBoardResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1919492391":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"WechatTempList","type":"Class"}}},"$241557814":{"result":{"name":"PmhKind","type":"Class"},"param":{"arg0":{"type":"String"}}},"$708737900":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"ClientVersion","type":"Class"}}},"$427450921":{"result":{"name":"ClientVersionResult","type":"Class"},"param":{"arg0":{"name":"ClientVersionParam","type":"Class"}}},"$1225039702":{"result":{"name":"ArticleDiscussLogResult","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$23687988":{"result":{"name":"WechatTempElementResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$914117411":{"result":{"name":"AccountResult","type":"Class"},"param":{"arg3":{"type":"String"},"arg2":{"type":"String"},"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$751418793":{"result":{"name":"Result","type":"Class"},"param":{"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$518253441":{"result":{"name":"AppKeyResult","type":"Class"},"param":{"arg0":{"name":"AppKeyParam","type":"Class"}}},"$724451145":{"result":{"name":"ClientVersionResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1999849818":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"type":"String"}}},"$393877521":{"result":{"name":"Result","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$359982362":{"result":{"name":"AccountResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1974351556":{"result":{"name":"AccountResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$948021999":{"result":{"name":"MeterListResult","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$497926365":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"MeterList","type":"Class"}}},"$215697322":{"result":{"name":"AccountResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1859802541":{"result":{"name":"ArticleListResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1787379711":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"AccountList","type":"Class"}}},"$2102416168":{"result":{"name":"AccountResult","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$1871652600":{"result":{"name":"ArticleInBoardResult","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$18777446":{"result":{"name":"AppKeyResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$660423970":{"result":{"name":"MeterModesResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1794719096":{"result":{"name":"ArticleTopicsResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1420597032":{"result":{"name":"AppKeyResult","type":"Class"},"param":{"arg0":{"name":"AppKeyParam","type":"Class"}}},"$1500457963":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"String[]","type":"Class"}}},"$1735197676":{"result":{"name":"WechatAccount","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1449711585":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1542224486":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"ArticleInBoard","type":"Class"}}},"$352331915":{"result":{"name":"JobClass","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1641656916":{"result":{"name":"CloudListResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1614783155":{"result":{"name":"MonitorItemsResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1337568052":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"type":"String"}}},"$564286254":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"CloudList","type":"Class"}}},"$2004707058":{"result":{"name":"Result","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"name":"String[]","type":"Class"}}},"$1934180316":{"result":{"name":"ArticleDiscussLogResult","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$1439151955":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"ArticleList","type":"Class"}}},"$1172166472":{"result":{"name":"Result","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$263648787":{"result":{"name":"AccountResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1761997219":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"type":"String"}}},"$266312825":{"result":{"name":"HandicapHistory","type":"Class"},"param":{"arg0":{"type":"String"}}},"$2133546884":{"result":{"name":"ClientVersionResult","type":"Class"},"param":{"arg1":{"type":"Integer"},"arg0":{"type":"Integer"}}},"$368800343":{"result":{"name":"AccountManagesResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1430209170":{"result":{"name":"MeterListResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$592176869":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"type":"String"}}},"$517778292":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1061345526":{"result":{"name":"AccountResult","type":"Class"},"param":{"arg3":{"type":"String"},"arg2":{"type":"String"},"arg4":{"type":"String"},"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$1759562580":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"MonitorSuites","type":"Class"}}},"$1700560617":{"result":{"name":"MonitorCautionsResult","type":"Class"},"param":{"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$1704470063":{"result":{"name":"MeterModesResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$224557781":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"ArticleReadLog","type":"Class"}}},"$1465124590":{"result":{"name":"MonitorItemsResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1009958281":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"CloudList","type":"Class"}}},"$1152327188":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"ArticleInBoard","type":"Class"}}},"$209456321":{"result":{"name":"WechatTempElementResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$1662665895":{"result":{"name":"AccountList","type":"Class"},"param":{"arg0":{"type":"String"}}},"$2128717661":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"ClientVersion","type":"Class"}}},"$435990083":{"result":{"name":"CloudListResult","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$1899588999":{"result":{"name":"Result","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"name":"String[]","type":"Class"}}},"$1388356479":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"ArticleDiscussLog","type":"Class"}}},"$1064338864":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"MonitorItems","type":"Class"}}},"$1027560190":{"result":{"name":"ArticleListResult","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$1150010185":{"result":{"name":"ArticleReadLogResult","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$1886014890":{"result":{"name":"AccountAuthens","type":"Class"},"param":{"arg2":{"type":"String"},"arg1":{"type":"String"},"arg0":{"type":"Integer"}}},"$1243655909":{"result":{"name":"FamilyHistory","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1961568046":{"result":{"name":"MonitorSuitesResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1743064367":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"MeterModes","type":"Class"}}},"$774619644":{"result":{"name":"ArticleTopicsResult","type":"Class"},"param":{}},"$1835305398":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"ArticleList","type":"Class"}}},"$142212269":{"result":{"name":"ArticleBoardsResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$730915404":{"result":{"name":"AccountResult","type":"Class"},"param":{"arg3":{"type":"String"},"arg2":{"type":"Integer"},"arg4":{"type":"String"},"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$1185233528":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"MonitorCautions","type":"Class"}}},"$1671088965":{"result":{"name":"ExposeHistory","type":"Class"},"param":{"arg0":{"type":"String"}}},"$2072826221":{"result":{"name":"AccountHolder","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$236837884":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"type":"String"}}},"$339116248":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1465408442":{"result":{"name":"MonitorItemsResult","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$2047017697":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"WechatTempElement","type":"Class"}}},"$1949366483":{"result":{"name":"AccountResult","type":"Class"},"param":{"arg2":{"type":"String"},"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$994962600":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"MeterModes","type":"Class"}}},"$1143586240":{"result":{"name":"ClientVersionResult","type":"Class"},"param":{"arg0":{"name":"ClientVersionParam","type":"Class"}}},"$2044992270":{"result":{"name":"AccountResult","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$177720702":{"result":{"name":"ArticleListResult","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$318727954":{"result":{"name":"ArticleReadLogVOResult","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$1240540959":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"MonitorReferences","type":"Class"}}},"$463947601":{"result":{"name":"MonitorItems","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1984629949":{"result":{"name":"AccountAuthensResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1962674693":{"result":{"name":"AccountResult","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$1849073867":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1732876213":{"result":{"name":"AccountHolder","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1076318170":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"MeterList","type":"Class"}}},"$1395806156":{"result":{"name":"ClientVersion","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$785883177":{"result":{"name":"Result","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}}},"$2107835300":{"$823812830":{"result":{"name":"RangeEnum[]","type":"Class"},"param":{}}},"$1402528178":{"$54383933":{"result":{"name":"Result","type":"Class"},"param":{"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$710622297":{"result":{"name":"BaseDictionaryDataResult","type":"Class"},"param":{"arg0":{"name":"BaseDictionaryParam","type":"Class"}}},"$771367161":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"FrequencyList","type":"Class"}}},"$1495051289":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1809416928":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$1893621205":{"result":{"name":"Result","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$1726693351":{"result":{"name":"Result","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$1729576216":{"result":{"name":"BaseDictionaryDataResult","type":"Class"},"param":{"arg3":{"type":"Integer"},"arg2":{"type":"Integer"},"arg1":{"name":"DictionaryDataParam","type":"Class"},"arg0":{"type":"String"}}},"$1346759765":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$747236888":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg3":{"type":"Integer"},"arg2":{"type":"Integer"},"arg1":{"name":"DictionaryDataParam","type":"Class"},"arg0":{"type":"String"}}},"$1035721640":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1424547313":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg0":{"name":"List","type":"Class"}}},"$143339415":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$1878532837":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$2134085296":{"result":{"name":"Result","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$183470321":{"result":{"name":"DictionaryResult","type":"Class"},"param":{"arg0":{"name":"BaseDictionaryParam","type":"Class"}}},"$1502930612":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"type":"String"}}},"$793733870":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$182884687":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$1311042061":{"result":{"name":"Result","type":"Class"},"param":{"arg1":{"type":"Integer"},"arg0":{"name":"Dictionary","type":"Class"}}},"$1609456711":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg3":{"type":"Integer"},"arg2":{"name":"DictionaryDataParam","type":"Class"},"arg4":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$93327673":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1743459653":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg3":{"type":"Integer"},"arg2":{"type":"Integer"},"arg1":{"type":"String"},"arg0":{"type":"Integer"}}},"$2069687534":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg3":{"type":"Integer"},"arg2":{"type":"Integer"},"arg1":{"type":"String"},"arg0":{"type":"Integer"}}},"$1660578253":{"result":{"name":"Result","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"Integer"}}},"$292203486":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg1":{"name":"DictionaryDataParam","type":"Class"},"arg0":{"type":"String"}}},"$902314738":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$1283211847":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$92490047":{"result":{"name":"DictionaryResult","type":"Class"},"param":{"arg3":{"type":"Integer"},"arg2":{"type":"Integer"},"arg4":{"type":"Integer"},"arg1":{"type":"String"},"arg0":{"type":"Integer"}}},"$2015003432":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$716797703":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$1774479360":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"ServiceListVO","type":"Class"}}},"$1548640773":{"result":{"name":"Result","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$416703643":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"type":"String"}}},"$212565991":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg3":{"type":"Integer"},"arg2":{"type":"Integer"},"arg1":{"name":"DictionaryDataParam","type":"Class"},"arg0":{"type":"String"}}},"$1502655808":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg3":{"type":"Integer"},"arg2":{"type":"Integer"},"arg1":{"name":"DictionaryDataParam","type":"Class"},"arg0":{"type":"String"}}},"$355396734":{"result":{"name":"TimeDivisions","type":"Class"},"param":{"arg0":{"type":"String"}}},"$660031374":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$2047418579":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$93836493":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg3":{"type":"Integer"},"arg2":{"type":"Integer"},"arg1":{"name":"DictionaryDataParam","type":"Class"},"arg0":{"type":"String"}}},"$885061660":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$1072388663":{"result":{"name":"Result","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$1991513936":{"result":{"name":"OptionList","type":"Class"},"param":{"arg0":{"type":"String"}}},"$502036742":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$2066088400":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"FrequencyList","type":"Class"}}},"$1563508187":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg3":{"type":"Integer"},"arg2":{"type":"Integer"},"arg1":{"name":"DictionaryDataParam","type":"Class"},"arg0":{"type":"String"}}},"$1393255905":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$964150427":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$64990002":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$1027810867":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$2117515203":{"result":{"name":"Result","type":"Class"},"param":{"arg3":{"name":"DictionaryDataParam","type":"Class"},"arg2":{"type":"Integer"},"arg1":{"type":"String"},"arg0":{"type":"Integer"}}},"$337839702":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$963543195":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"EvaQaListVO","type":"Class"}}},"$1815667648":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$1386063456":{"result":{"name":"Object","type":"Class"},"param":{"arg3":{"type":"String"},"arg2":{"type":"String"},"arg1":{"type":"String"},"arg0":{"name":"Class","type":"Class"}}},"$2091127258":{"result":{"name":"Result","type":"Class"},"param":{"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$168331896":{"result":{"name":"Integer","type":"Class"},"param":{}}},"$355578246":{"$771964874":{"result":{"name":"AliyunOSSResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$127300446":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"type":"String"}}}},"$1874332707":{"$1752867070":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$516124230":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$1801108573":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg3":{"type":"Integer"},"arg2":{"type":"Date"},"arg4":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"Integer"}}},"$1391692794":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$2051019978":{"result":{"name":"OrdMedRecipeBodyResult","type":"Class"},"param":{"arg3":{"type":"Integer"},"arg2":{"type":"Integer"},"arg1":{"type":"String"},"arg0":{"type":"Integer"}}},"$876622803":{"result":{"name":"Result","type":"Class"},"param":{"arg2":{"type":"String"},"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$1433572328":{"result":{"name":"Result","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$979480308":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg0":{"name":"EvaluationListParam","type":"Class"}}},"$1594316561":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg3":{"type":"Integer"},"arg2":{"type":"Integer"},"arg1":{"type":"Date"},"arg0":{"type":"Integer"}}},"$1153109283":{"result":{"name":"InterveneOrderResult","type":"Class"},"param":{"arg1":{"name":"OrdTreatment","type":"Class"},"arg0":{"name":"InterveneOrderVO","type":"Class"}}},"$380559540":{"result":{"name":"Result","type":"Class"},"param":{"arg3":{"type":"Integer"},"arg2":{"type":"Integer"},"arg4":{"type":"String"},"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$71326173":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$596281898":{"result":{"name":"InterveneOrderResult","type":"Class"},"param":{"arg1":{"name":"OrdMonitorSuiteParam","type":"Class"},"arg0":{"name":"InterveneOrderVO","type":"Class"}}},"$1252881029":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg0":{"name":"RsdtReferralListParam","type":"Class"}}},"$1376735652":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg3":{"type":"String"},"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$86177807":{"result":{"name":"InterveneOrderResult","type":"Class"},"param":{"arg1":{"name":"OrdEvaluation","type":"Class"},"arg0":{"name":"InterveneOrderVO","type":"Class"}}},"$1709290189":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg1":{"type":"Date"},"arg0":{"type":"Date"}}},"$1827461593":{"result":{"name":"Result","type":"Class"},"param":{"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$374706659":{"result":{"name":"RsdtEvaScoreResult","type":"Class"},"param":{"arg0":{"name":"RsdtEvaScoreParam","type":"Class"}}},"$1292496318":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$1296157304":{"result":{"name":"MedicinePersonalResult","type":"Class"},"param":{"arg0":{"name":"String[]","type":"Class"}}},"$75091016":{"result":{"name":"OrderListResult","type":"Class"},"param":{"arg3":{"type":"Integer"},"arg2":{"type":"String"},"arg4":{"type":"Integer"},"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$101554483":{"result":{"name":"InterveneOrderResult","type":"Class"},"param":{"arg1":{"name":"OrdMonitorSuiteParam","type":"Class"},"arg0":{"name":"InterveneOrderVO","type":"Class"}}},"$310856249":{"result":{"name":"InterveneOrderResult","type":"Class"},"param":{"arg2":{"name":"OrdHerbRecipeBodyParam","type":"Class"},"arg1":{"name":"OrdHerbRecipeHead","type":"Class"},"arg0":{"name":"InterveneOrderVO","type":"Class"}}},"$686821199":{"result":{"name":"MedicinePersonalResult","type":"Class"},"param":{"arg1":{"type":"Integer"},"arg0":{"type":"Integer"}}},"$1351475278":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg3":{"type":"Integer"},"arg2":{"type":"Date"},"arg4":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"Integer"}}},"$1821290057":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1540225928":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg0":{"name":"RsdtMedicateListParam","type":"Class"}}},"$1506904348":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"String[]","type":"Class"}}},"$407186186":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1001492195":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg0":{"name":"RsdtReferralListParam","type":"Class"}}},"$1563279871":{"result":{"name":"InterveneOrderResult","type":"Class"},"param":{"arg1":{"name":"OrdAudioParam","type":"Class"},"arg0":{"name":"InterveneOrderVO","type":"Class"}}},"$1778194986":{"result":{"name":"RsdtEvaScoreResult","type":"Class"},"param":{"arg0":{"name":"RsdtEvaScoreParam","type":"Class"}}},"$1442826920":{"result":{"name":"InterveneOrderResult","type":"Class"},"param":{"arg1":{"name":"OrdEvaluation","type":"Class"},"arg0":{"name":"InterveneOrderVO","type":"Class"}}},"$1755244871":{"result":{"name":"EvaluationListReuslt","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1479566570":{"result":{"name":"InterveneOrderResult","type":"Class"},"param":{"arg2":{"type":"String"},"arg1":{"name":"OrdAudioParam","type":"Class"},"arg0":{"name":"InterveneOrderVO","type":"Class"}}},"$508377879":{"result":{"name":"MedRecipeListResult","type":"Class"},"param":{"arg0":{"name":"MedRecipeList","type":"Class"}}},"$520359904":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg0":{"name":"RsdtOrdMedRecipeParam","type":"Class"}}},"$1907004662":{"result":{"name":"OrderTaskList","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1527710289":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg3":{"name":"OrdReferral","type":"Class"},"arg2":{"type":"String"},"arg1":{"type":"Date"},"arg0":{"type":"String"}}},"$404862913":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$997467792":{"result":{"name":"InterveneOrderResult","type":"Class"},"param":{"arg2":{"name":"OrdHerbRecipeBodyParam","type":"Class"},"arg1":{"name":"OrdHerbRecipeHead","type":"Class"},"arg0":{"name":"InterveneOrderVO","type":"Class"}}},"$1063884684":{"result":{"name":"InterveneOrderResult","type":"Class"},"param":{"arg1":{"name":"OrdTreatment","type":"Class"},"arg0":{"name":"InterveneOrderVO","type":"Class"}}},"$431660383":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1748755924":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg2":{"type":"String"},"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$1286675801":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$1896711783":{"result":{"name":"InterveneOrderResult","type":"Class"},"param":{"arg1":{"name":"OrdMedRecipeBodyParam","type":"Class"},"arg0":{"name":"InterveneOrderVO","type":"Class"}}},"$664900941":{"result":{"name":"InterveneOrderResult","type":"Class"},"param":{"arg1":{"name":"OrdGuidance","type":"Class"},"arg0":{"name":"InterveneOrderVO","type":"Class"}}},"$189573280":{"result":{"name":"EvaluationListReuslt","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1387956693":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$1256334738":{"result":{"name":"InterveneOrderResult","type":"Class"},"param":{"arg1":{"name":"OrdReferral","type":"Class"},"arg0":{"name":"InterveneOrderVO","type":"Class"}}},"$298678464":{"result":{"name":"BaseResult","type":"Class"},"param":{}},"$783437121":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"type":"String"}}},"$523475396":{"result":{"name":"InterveneOrderResult","type":"Class"},"param":{"arg1":{"name":"OrdGuidance","type":"Class"},"arg0":{"name":"InterveneOrderVO","type":"Class"}}},"$870297128":{"result":{"name":"OrdMedRecipeBodyResult","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"Integer"}}},"$76971247":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg3":{"type":"Integer"},"arg2":{"type":"String"},"arg4":{"type":"Integer"},"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$534551713":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg2":{"type":"Date"},"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$1114909193":{"result":{"name":"InterveneOrderResult","type":"Class"},"param":{"arg1":{"name":"OrdReferral","type":"Class"},"arg0":{"name":"InterveneOrderVO","type":"Class"}}},"$53392464":{"result":{"name":"InterveneOrderResult","type":"Class"},"param":{"arg1":{"name":"OrdMedRecipeBodyParam","type":"Class"},"arg0":{"name":"InterveneOrderVO","type":"Class"}}},"$1460785903":{"result":{"name":"InterveneOrderResult","type":"Class"},"param":{"arg0":{"type":"String"}}}},"$238601041":{"$352318720":{"result":{"name":"StaffListResult","type":"Class"},"param":{}},"$1360762905":{"result":{"name":"CommunityListResult","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$317891062":{"result":{"name":"CommunityList","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1618150328":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"CommunityList","type":"Class"}}},"$1017848803":{"result":{"name":"CommunityListResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$860206926":{"result":{"name":"OrgList","type":"Class"},"param":{"arg0":{"type":"String"}}},"$254837241":{"result":{"name":"StaffClassResult","type":"Class"},"param":{"arg0":{"name":"StaffClassParam","type":"Class"}}},"$1622671410":{"result":{"name":"Result","type":"Class"},"param":{}},"$1476779401":{"result":{"name":"OrgListResult","type":"Class"},"param":{}},"$1620183776":{"result":{"name":"OrgListResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$354635437":{"result":{"name":"Result","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$1309370844":{"result":{"name":"OrgList","type":"Class"},"param":{"arg0":{"type":"String"}}},"$677964856":{"result":{"name":"OrgListResult","type":"Class"},"param":{"arg0":{"name":"OrgListParam","type":"Class"}}},"$774394617":{"result":{"name":"BaseResult","type":"Class"},"param":{}},"$1922845328":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"StaffList","type":"Class"}}},"$364594928":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1283414889":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$653668512":{"result":{"name":"StaffList","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1799350504":{"result":{"name":"StaffListResult","type":"Class"},"param":{"arg2":{"type":"String"},"arg1":{"type":"Integer"},"arg0":{"type":"Integer"}}},"$592886658":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$31759292":{"result":{"name":"StaffListResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$759445342":{"result":{"name":"OrgListResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1049668428":{"result":{"name":"StaffListResult","type":"Class"},"param":{"arg0":{"name":"StaffListParam","type":"Class"}}},"$1286059389":{"result":{"name":"StaffClassResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$43905793":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"CommunityList","type":"Class"}}},"$1811777570":{"result":{"name":"StaffClassResult","type":"Class"},"param":{"arg0":{"name":"StaffClassParam","type":"Class"}}},"$239713128":{"result":{"name":"OrgListResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1671054333":{"result":{"name":"StaffListResult","type":"Class"},"param":{"arg0":{"name":"StaffListParam","type":"Class"}}},"$1280495162":{"result":{"name":"OrgListResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$703142337":{"result":{"name":"OrgListResult","type":"Class"},"param":{"arg0":{"name":"OrgListParam","type":"Class"}}},"$1940179661":{"result":{"name":"StaffListResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$2047802150":{"result":{"name":"StaffListResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$409812423":{"result":{"name":"StaffListResult","type":"Class"},"param":{"arg0":{"name":"OrgMemberParam","type":"Class"}}},"$945131771":{"result":{"name":"StaffListResult","type":"Class"},"param":{"arg3":{"type":"String"},"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$732156877":{"result":{"name":"OrgListResult","type":"Class"},"param":{}},"$436402929":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"TeamTrustIsland","type":"Class"}}},"$1716530669":{"result":{"name":"StaffListResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$335269509":{"result":{"name":"OrgListResult","type":"Class"},"param":{}},"$1756798730":{"result":{"name":"StaffClassResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1324954566":{"result":{"name":"CommunityListResult","type":"Class"},"param":{"arg0":{"type":"String"}}}},"$805745229":{"$324904765":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$1537048895":{"result":{"name":"RsdtContractResult","type":"Class"},"param":{"arg3":{"type":"Integer"},"arg2":{"type":"Integer"},"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$1036582219":{"result":{"name":"ServiceListResult","type":"Class"},"param":{}},"$1923576004":{"result":{"name":"RsdtContractStatisticsResult","type":"Class"},"param":{}},"$345099193":{"result":{"name":"ResidentOverviewResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$83209503":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg3":{"type":"Integer"},"arg2":{"type":"Date"},"arg4":{"type":"Integer"},"arg1":{"type":"Date"},"arg0":{"type":"Integer"}}},"$372718843":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$206231429":{"result":{"name":"Result","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$698308657":{"result":{"name":"RsdtContractOverviewResult","type":"Class"},"param":{"arg3":{"name":"String[]","type":"Class"},"arg2":{"name":"Integer[]","type":"Class"},"arg5":{"type":"Integer"},"arg4":{"name":"String[]","type":"Class"},"arg1":{"type":"String"},"arg0":{"type":"Integer"},"arg6":{"type":"Integer"}}},"$870919421":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg1":{"name":"RsdtContractServiceParam","type":"Class"},"arg0":{"type":"String"}}},"$831673384":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg2":{"type":"String"},"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$1611409145":{"result":{"name":"Result","type":"Class"},"param":{"arg1":{"type":"Date"},"arg0":{"type":"String"}}},"$2143145260":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"RsdtContractChange","type":"Class"}}},"$640927020":{"result":{"name":"Result","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$1765036046":{"result":{"name":"RsdtContractListResult","type":"Class"},"param":{"arg0":{"name":"RsdtContractParam","type":"Class"}}},"$1096054862":{"result":{"name":"RsdtContractListResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1916976665":{"result":{"name":"RsdtContractDetailResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$699000210":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1226927002":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$2083513780":{"result":{"name":"RsdtContractDetailResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$2110570193":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$14821341":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"type":"String"}}}},"$1200451287":{"$645357016":{"result":{"name":"RsdtMonitorDetailMapVOResult","type":"Class"},"param":{"arg1":{"name":"RsdtMonitorDetailParam","type":"Class"},"arg0":{"name":"RsdtMonitorList","type":"Class"}}},"$1333700349":{"result":{"name":"Result","type":"Class"},"param":{"arg1":{"name":"String[]","type":"Class"},"arg0":{"type":"String"}}},"$1599018893":{"result":{"name":"RsdtMonitorListResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$347586229":{"result":{"name":"RsdtProblemListResult","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$866891241":{"result":{"name":"JSONResult","type":"Class"},"param":{"arg3":{"type":"Integer"},"arg2":{"type":"Integer"},"arg1":{"name":"String[]","type":"Class"},"arg0":{"type":"String"}}},"$943522777":{"result":{"name":"JSONResult","type":"Class"},"param":{"arg1":{"type":"Date"},"arg0":{"type":"String"}}},"$1540967965":{"result":{"name":"ResidentOrderTaskResult","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"String"},"arg0":{"type":"Integer"}}},"$321588430":{"result":{"name":"RsdtMonitorDetailResult","type":"Class"},"param":{"arg3":{"type":"Date"},"arg2":{"type":"Date"},"arg5":{"type":"Integer"},"arg4":{"type":"Integer"},"arg1":{"name":"String[]","type":"Class"},"arg0":{"type":"String"}}},"$1177389253":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"type":"String"}}},"$2103748461":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"RsdtAssessProblem","type":"Class"}}},"$823768178":{"result":{"name":"Result","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$292223238":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1969152370":{"result":{"name":"RsdtMonitorCountVOResult","type":"Class"},"param":{"arg3":{"type":"Date"},"arg2":{"type":"Date"},"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$619396763":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg2":{"type":"String"},"arg1":{"type":"Date"},"arg0":{"type":"Date"}}},"$486069548":{"result":{"name":"RsdtAssessProblemResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$971420848":{"result":{"name":"RsdtMonitorDetailMapVOResult","type":"Class"},"param":{"arg0":{"name":"RsdtMonitorListParam","type":"Class"}}},"$1717681366":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"RsdtAssessList","type":"Class"}}},"$2088793370":{"result":{"name":"RsdtMonitorDetailResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$627820561":{"result":{"name":"Result","type":"Class"},"param":{"arg1":{"name":"String[]","type":"Class"},"arg0":{"type":"String"}}},"$1102490509":{"result":{"name":"RsdtAssessProblemResult","type":"Class"},"param":{"arg0":{"name":"RsdtAssessProblem","type":"Class"}}},"$669632915":{"result":{"name":"JSONResult","type":"Class"},"param":{"arg3":{"type":"Date"},"arg2":{"type":"Date"},"arg5":{"type":"Integer"},"arg4":{"type":"Integer"},"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$53532044":{"result":{"name":"JSONResult","type":"Class"},"param":{"arg3":{"type":"Integer"},"arg2":{"type":"Integer"},"arg1":{"name":"String[]","type":"Class"},"arg0":{"type":"String"}}},"$1818549561":{"result":{"name":"RsdtProblemListResult","type":"Class"},"param":{"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$1292334586":{"result":{"name":"FocusMonitorResidentVOResult","type":"Class"},"param":{"arg1":{"type":"Integer"},"arg0":{"type":"Integer"}}}},"$1555902245":{"$500753944":{"result":{"name":"FamilyListResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$1144241971":{"result":{"name":"ResidentAllergyResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"name":"ResidentAllergyParam","type":"Class"}}},"$2145249556":{"result":{"name":"JSONResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$916441619":{"result":{"name":"ResidentPmhResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"name":"ResidentPmhParam","type":"Class"}}},"$596228228":{"result":{"name":"ResidentListResult","type":"Class"},"param":{"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$614905131":{"result":{"name":"ResidentListResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$2101906054":{"result":{"name":"ResidentListResult","type":"Class"},"param":{"arg0":{"name":"ResidentList","type":"Class"}}},"$2083334882":{"result":{"name":"ResidentFocusItemsResult","type":"Class"},"param":{"arg0":{"name":"ResidentFocusItemsParam","type":"Class"}}},"$2030251667":{"result":{"name":"ResidentFocusVOResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1657692891":{"result":{"name":"ResidentListResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1095649944":{"result":{"name":"ResidentListResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$2058737261":{"result":{"name":"Result","type":"Class"},"param":{"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$1100668164":{"result":{"name":"FamilyListResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1314839684":{"result":{"name":"ResidentListResult","type":"Class"},"param":{"arg3":{"type":"Integer"},"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$1314716102":{"result":{"name":"ResidentListResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1542581357":{"result":{"name":"ResidentFocusValueResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$2023686657":{"result":{"name":"ResidentListResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$537744339":{"result":{"name":"void","type":"Class"},"param":{"arg3":{"name":"Map","type":"Class"},"arg2":{"type":"String"},"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$1388429153":{"result":{"name":"void","type":"Class"},"param":{"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$130890160":{"result":{"name":"ResidentPmhResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"name":"ResidentPmhParam","type":"Class"}}},"$2088712349":{"result":{"name":"FamilyListResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"name":"FamilyList","type":"Class"}}},"$1526809891":{"result":{"name":"ResidentFocusValueResult","type":"Class"},"param":{}},"$1826896902":{"result":{"name":"Result","type":"Class"},"param":{"arg2":{"type":"String"},"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$1314555832":{"result":{"name":"ResidentList","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1261418956":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"ResidentHabitsParam","type":"Class"}}},"$148571580":{"result":{"name":"FamilyList","type":"Class"},"param":{"arg0":{"type":"String"}}},"$718133221":{"result":{"name":"ResidentHabitsResult","type":"Class"},"param":{}},"$489660999":{"result":{"name":"ResidentFocusItemsResult","type":"Class"},"param":{"arg0":{"name":"ResidentFocusItemsParam","type":"Class"}}},"$632679136":{"result":{"name":"ResidentListResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1563945180":{"result":{"name":"ResidentListResult","type":"Class"},"param":{"arg3":{"type":"Integer"},"arg2":{"type":"Integer"},"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$1321404143":{"result":{"name":"ResidentListResult","type":"Class"},"param":{"arg0":{"name":"ResidentList","type":"Class"}}},"$2104224772":{"result":{"name":"RsdtMonitorDetailMapVOResult","type":"Class"},"param":{"arg1":{"name":"String[]","type":"Class"},"arg0":{"type":"String"}}},"$1004179499":{"result":{"name":"ResidentListResult","type":"Class"},"param":{"arg0":{"name":"ResidentListParam","type":"Class"}}},"$1609015445":{"result":{"name":"ResidentListResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1569727139":{"result":{"name":"ResidentFocusItemsResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$482158796":{"result":{"name":"FamilyListResult","type":"Class"},"param":{"arg2":{"type":"String"},"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$1501712443":{"result":{"name":"ResidentPmhResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"name":"ResidentPmhParam","type":"Class"}}},"$1806279057":{"result":{"name":"JSONResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$2077453096":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1663136924":{"result":{"name":"ResidentListResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1612577376":{"result":{"name":"ResidentPmhResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"name":"ResidentPmhParam","type":"Class"}}}},"$695864363":{"$1231547207":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"DoctorFocusResidents","type":"Class"}}},"$896128680":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1892895986":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg2":{"type":"String"},"arg1":{"type":"Date"},"arg0":{"type":"String"}}},"$569804209":{"result":{"name":"StaffListWorkVOResult","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1953146637":{"result":{"name":"Result","type":"Class"},"param":{"arg1":{"type":"Integer"},"arg0":{"type":"String"}}},"$1972499258":{"result":{"name":"DoctorHomePageStatisticsResult","type":"Class"},"param":{}},"$373159320":{"result":{"name":"StaffWorkListResult","type":"Class"},"param":{"arg0":{"type":"Date"}}},"$936640153":{"result":{"name":"StaffWorkListResult","type":"Class"},"param":{"arg1":{"type":"Integer"},"arg0":{"type":"Integer"}}},"$677967812":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1163259458":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg0":{"name":"RsdtServiceAppointParam","type":"Class"}}},"$2077222908":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"type":"String"}}},"$846158747":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"StaffWorkList","type":"Class"}}},"$1892082322":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg1":{"type":"Integer"},"arg0":{"type":"Integer"}}},"$497096089":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"type":"String"}}},"$1133553035":{"result":{"name":"BaseResult","type":"Class"},"param":{"arg1":{"type":"String"},"arg0":{"type":"String"}}},"$2114945009":{"result":{"name":"RsdtServiceAppointVOResult","type":"Class"},"param":{"arg3":{"type":"Integer"},"arg2":{"type":"String"},"arg4":{"type":"Integer"},"arg1":{"type":"Date"},"arg0":{"type":"Date"}}},"$1991296814":{"result":{"name":"Result","type":"Class"},"param":{"arg0":{"name":"StaffWorkList","type":"Class"}}},"$1530775875":{"result":{"name":"RsdtServiceAppointVOResult","type":"Class"},"param":{"arg3":{"type":"Integer"},"arg2":{"type":"String"},"arg4":{"type":"Integer"},"arg1":{"type":"Date"},"arg0":{"type":"Date"}}}}};


  function CoreInterfactory(){

      var package = "com.zcareze.core.service";

	
	/**
	 * <p>标题：bindArmarium</p>
	 * <p>说明：绑定设备</p>
	 * @param armariumId 设备ID
	 * @param setCode 设备系列
	 * @param batch 批号
	 * @param workMode 工作模式
	 * @param armariumFittings 配件
	 * @param position 当前定位
	 * @return <p>data=>code  用户是否激活成功(1为成功)</p>
	 * @throws MessageException 
	 */

  this.bindArmarium = function(armariumId,setCode,batch,workMode,position,armariumFittingsParam){

    return interfaceFactory(arguments, this.constructor.name, "bindArmarium", package);

  };

	/**
	 * <p>标题：getArmariumAndFittings</p>
	 * <p>说明：根据设备ID获取设备信息和配件</p>
	 * @param armariumId 设备ID
	 * @return 
	 * 	<p>one 							设备清单(ArmariumListDomain)</p>
	 * 	<p>armariumFittingsDomainsList		设备配件(List<ArmariumFittingsDomain>)</p>
	 * @throws MessageException 
	 */

  this.getArmariumAndFittings = function(armariumId){

    return interfaceFactory(arguments, this.constructor.name, "getArmariumAndFittings", package);

  };

	
	/**
	 * <p>标题：loginVerificationCode</p>
	 * <p>说明：职员登陆未激活，输入验证码</p>
	 * @param mobile 获取验证码手机号
	 * @param smsNum 验证码
	 * @return
	 */

  this.login = function(mobile,password,cloudId,appKey,clientVersion,clientOS,identity){

    return interfaceFactory(arguments, this.constructor.name, "login", package);

  };


	/**
	 * <p>标题：loginVerifyCloud</p>
	 * <p>说明：登陆多区域云，选择区域云</p>
	 * @param cloudId
	 * @return
	 */

  this.loginVerifyCloud = function(cloudId){

    return interfaceFactory(arguments, this.constructor.name, "loginVerifyCloud", package);

  };

  this.loginVerificationCode = function(mobile,smsNum){

    return interfaceFactory(arguments, this.constructor.name, "loginVerificationCode", package);

  };

	
	/**
	 * <p>标题：activeAccountList</p>
	 * <p>说明：激活账户操作</p>
	 * @param mobile	手机号码
	 * @param password	密码
	 * @param sms_num	验证码
	 * @return data=>code  用户是否激活成功(1为成功)
	 * @throws MessageException
	 * 
	 */

  this.activeAccountList = function(mobile,password,smsNum){

    return interfaceFactory(arguments, this.constructor.name, "activeAccountList", package);

  };

	
	/**
	 * <p>标题：activeAccountHolder</p>
	 * <p>说明：职员激活账户</p>
	 * @param mobile 手机号
	 * @param password 密码
	 * @param smsNum 验证码
	 * @return
	 */

  this.activeAccountHolder = function(mobile,password,smsNum){

    return interfaceFactory(arguments, this.constructor.name, "activeAccountHolder", package);

  };

	
	/**
	 * <p>标题：verifyCloud</p>
	 * <p>说明：职员激活多区域情况，选择区域</p>
	 * @param cloudId
	 * @return
	 */

  this.verifyCloud = function(cloudId){

    return interfaceFactory(arguments, this.constructor.name, "verifyCloud", package);

  };

	
	/**
	 * <p>标题：addAccountManages</p>
	 * <p>说明：添加账户管理记录</p>
	 * @param accountManages
	 */

  this.addAccount = function(mobile,nickname,regMode,residentId,smsNum){

    return interfaceFactory(arguments, this.constructor.name, "addAccount", package);

  };

	
	/**
	 * <p>标题：addAccountByStaff</p>
	 * <p>说明：绑定职员账户</p>
	 * @param mobile // 手机号
	 * @param nickname // 昵称 默认传职员名称
	 * @param staffId // 职员ID
	 * @return
	 */

  this.addAccountByStaff = function(mobile,nickname,staffId,photoUrl){

    return interfaceFactory(arguments, this.constructor.name, "addAccountByStaff", package);

  };

	
	/**
	 * <p>标题：cancelBindAccount</p>
	 * <p>说明：取消绑定</p>
	 * @param staffId 居民ID
	 * @return
	 */

  this.cancelBindAccount = function(staffId){

    return interfaceFactory(arguments, this.constructor.name, "cancelBindAccount", package);

  };

	/**
	 * <p>标题：changeAccoutName</p>
	 * <p>说明：修改账户昵称</p>
	 * @param name			账户昵称
	 * @return
	 * @throws MessageException
	 */

  this.changeAccoutName = function(name){

    return interfaceFactory(arguments, this.constructor.name, "changeAccoutName", package);

  };

	
	/**
	 * <p>标题：changeAccountPhotoUrl</p>
	 * <p>说明：修改账户头像，用户自行修改</p>
	 * @param photoUrl
	 * @return
	 */

  this.changeAccountPhotoUrl = function(photoUrl){

    return interfaceFactory(arguments, this.constructor.name, "changeAccountPhotoUrl", package);

  };

  this.changeAccountPhotoUrlByAccountId = function(photoUrl,accountId,staffId){

    return interfaceFactory(arguments, this.constructor.name, "changeAccountPhotoUrlByAccountId", package);

  };


	/**
	 * <p>标题：changeAccoutPassword</p>
	 * <p>说明：修改账户密码</p>
	 * @param password		新密码
	 * @param smsNum		验证码
	 * @return
	 * @throws MessageException
	 */

  this.changeAccoutPassword = function(password,smsNum){

    return interfaceFactory(arguments, this.constructor.name, "changeAccoutPassword", package);

  };

	
	/**
	 * <p>标题：changeAccount</p>
	 * <p>说明：切换账户</p>
	 * @param residentId 居民ID
	 * @return 203  账户未激活，需先激活
	 * 		   206 居民档案未开放
	 */

  this.changeAccount = function(residentId){

    return interfaceFactory(arguments, this.constructor.name, "changeAccount", package);

  };

  this.reLogin = function(mobile,password,cloudId,identity,residentId){

    return interfaceFactory(arguments, this.constructor.name, "reLogin", package);

  };

  this.addAccountAuthens = function(purpose,mobile,authenCode){

    return interfaceFactory(arguments, this.constructor.name, "addAccountAuthens", package);

  };

  this.getAccountListByMobile = function(mobile){

    return interfaceFactory(arguments, this.constructor.name, "getAccountListByMobile", package);

  };

	
	/**
	 * <p>标题：getAccountHolderByAccount</p>
	 * <p>说明：根据账户和密码返回账户持有人信息</p>
	 * @param mobile 用户名
	 * @param password 密码
	 * @return
	 * @throws MessageException 
	 */

  this.getAccountHolderByAccount = function(mobile,password){

    return interfaceFactory(arguments, this.constructor.name, "getAccountHolderByAccount", package);

  };

  this.findAccountByStaffId = function(staffId){

    return interfaceFactory(arguments, this.constructor.name, "findAccountByStaffId", package);

  };

  this.getAccounHoldeByResidentId = function(residentId){

    return interfaceFactory(arguments, this.constructor.name, "getAccounHoldeByResidentId", package);

  };

	/**
	 * <p>标题：findExposeHistoryByCode</p>
	 * <p>说明：根据code查询字典表ExposeHistory</p>
	 * @param recordCode
	 * @return
	 * @throws MessageException
	 */

  this.findExposeHistoryByCode = function(recordCode){

    return interfaceFactory(arguments, this.constructor.name, "findExposeHistoryByCode", package);

  };

	/**
	 * <p>标题：findPmhKindByCode</p>
	 * <p>说明：根据code查询字典表PmhKind</p>
	 * @param code
	 * @return
	 * @throws MessageException
	 */

  this.findPmhKindByCode = function(code){

    return interfaceFactory(arguments, this.constructor.name, "findPmhKindByCode", package);

  };

	/**
	 * <p>标题：findFamilyHistoryByCode</p>
	 * <p>说明：根据code查询字典表FamilyHistory</p>
	 * @param recordCode
	 * @return
	 * @throws MessageException
	 */

  this.findFamilyHistoryByCode = function(recordCode){

    return interfaceFactory(arguments, this.constructor.name, "findFamilyHistoryByCode", package);

  };

	/**
	 * <p>标题：findHandicapHistoryByCode</p>
	 * <p>说明：根据code查询字典表HandicapHistory</p>
	 * @param recordCode
	 * @return
	 * @throws MessageException
	 */

  this.findHandicapHistoryByCode = function(recordCode){

    return interfaceFactory(arguments, this.constructor.name, "findHandicapHistoryByCode", package);

  };


	/**
	 * <p>标题：getMonitorItemsBySpecial</p>
	 * <p>说明：根据指标特殊性查询指标</p>
	 * @param special 多个逗号隔开
	 * @return
	 */

  this.getMonitorItemsBySpecial = function(special){

    return interfaceFactory(arguments, this.constructor.name, "getMonitorItemsBySpecial", package);

  };

  this.getMonitorItemsNotFocuByQue = function(items,divAge,divSex){

    return interfaceFactory(arguments, this.constructor.name, "getMonitorItemsNotFocuByQue", package);

  };

	
	/**
	 * <p>标题：findMonitorItemsById</p>
	 * <p>说明：根据指标ID获取检测指标项</p>
	 * @param id			检测指标项目ID
	 * @return
	 * @throws MessageException
	 */

  this.findMonitorItemsById = function(id){

    return interfaceFactory(arguments, this.constructor.name, "findMonitorItemsById", package);

  };

	
	/**
	 * <p>标题：getAgeDivisionsByAge</p>
	 * <p>说明：根据年龄查询年龄段</p>
	 * @param age
	 * @return
	 */

  this.getAgeDivisionsByAge = function(age){

    return interfaceFactory(arguments, this.constructor.name, "getAgeDivisionsByAge", package);

  };


	/**
	 * <p>标题：getMonitorReferencesByItemId</p>
	 * <p>说明：根据指标项目ID查询参考值设置</p>
	 * @param itemId
	 * @return
	 */

  this.getMonitorReference = function(itemId,divSex,divAge){

    return interfaceFactory(arguments, this.constructor.name, "getMonitorReference", package);

  };


	/**
	 * <p>标题：getAccountListById</p>
	 * <p>说明：根据主键查询当前账户信息</p>
	 * @param accountId
	 */

  this.getAccountListById = function(accountId){

    return interfaceFactory(arguments, this.constructor.name, "getAccountListById", package);

  };

	
	/**
	 * <p>标题：getJobClassByCode</p>
	 * <p>说明：根据工作种类码查询工作种类</p>
	 * @param code
	 * @return
	 */

  this.getJobClassByCode = function(code){

    return interfaceFactory(arguments, this.constructor.name, "getJobClassByCode", package);

  };

  this.getMonitorItemByiIdSeqNo = function(itemId,seqNo){

    return interfaceFactory(arguments, this.constructor.name, "getMonitorItemByiIdSeqNo", package);

  };

	/**
	 * <p>标题：getAppKeyByAppkey</p>
	 * <p>说明：根据appkey查询app信息</p>
	 * @param appKey
	 * @return
	 */

  this.getAppKeyByAppkey = function(appKey){

    return interfaceFactory(arguments, this.constructor.name, "getAppKeyByAppkey", package);

  };

  this.getClientVersionByAppkey = function(cloudId,appKey,type){

    return interfaceFactory(arguments, this.constructor.name, "getClientVersionByAppkey", package);

  };

	/**
	 * <p>标题：addWechatResident</p>
	 * <p>说明：添加居民绑定微信</p>
	 * @param residentId
	 * @param openId
	 */

  this.addWechatResident = function(wechatAccount){

    return interfaceFactory(arguments, this.constructor.name, "addWechatResident", package);

  };

	/**
	 * <p>标题：findWechatResidentByRId</p>
	 * <p>说明：根据用户ID查询绑定微信</p>
	 * @param residentId
	 * @return
	 */

  this.findWechatResidentByRId = function(isSelf,residentId){

    return interfaceFactory(arguments, this.constructor.name, "findWechatResidentByRId", package);

  };

	/**
	 * <p>标题：findTemplateBySuiteId</p>
	 * <p>说明：根据监测组ID查询模板</p>
	 * @param suiteId
	 * @return
	 */

  this.findTemplateBySuiteId = function(king,suiteId){

    return interfaceFactory(arguments, this.constructor.name, "findTemplateBySuiteId", package);

  };

  this.findWechatElementByTempId = function(tempId){

    return interfaceFactory(arguments, this.constructor.name, "findWechatElementByTempId", package);

  };

	/**
	 * <p>标题：addAppKey</p>
	 * <p>说明：添加app信息</p>
	 * @param appKeyParam
	 * @return
	 */

  this.addAppKey = function(appKeyParam){

    return interfaceFactory(arguments, this.constructor.name, "addAppKey", package);

  };

	
	/**
	 * <p>标题：getAppKeyById</p>
	 * <p>说明：根据id获取appkey信息</p>
	 * @param id
	 * @return  
	 */

  this.getAppKeyById = function(id){

    return interfaceFactory(arguments, this.constructor.name, "getAppKeyById", package);

  };

	
	/**
	 * <p>标题：editAppKey</p>
	 * <p>说明：修改appkey信息</p>
	 * @param appKeyParam
	 * @return
	 */

  this.editAppKey = function(appKeyParam){

    return interfaceFactory(arguments, this.constructor.name, "editAppKey", package);

  };

	
	/**
	 * <p>标题：addClentVersion</p>
	 * <p>说明：添加版本</p>
	 * @param versionParam
	 * @return
	 */

  this.addClentVersion = function(versionParam){

    return interfaceFactory(arguments, this.constructor.name, "addClentVersion", package);

  };

	
	/**
	 * <p>标题：getClientVersionById</p>
	 * <p>说明：根据ID获得版本</p>
	 * @param id
	 * @return
	 */

  this.getClientVersionById = function(id){

    return interfaceFactory(arguments, this.constructor.name, "getClientVersionById", package);

  };

	
	/**
	 * <p>标题：editClentVersion</p>
	 * <p>说明：修改版本</p>
	 * @param versionParam
	 * @return
	 */

  this.editClentVersion = function(versionParam){

    return interfaceFactory(arguments, this.constructor.name, "editClentVersion", package);

  };

	
	/**
	 * <p>标题：findAccountList</p>
	 * <p>说明：列表查询账户</p>
	 * @param mobile
	 * @param pageNow
	 * @param pageSize
	 * @return
	 */

  this.findAccountList = function(mobile,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "findAccountList", package);

  };

	
	/**
	 * <p>标题：findWechatAccountByAccountId</p>
	 * <p>说明：根据账户ID查询关注账户的微信</p>
	 * @param accountId
	 * @return
	 */

  this.findWechatAccountByAccountId = function(accountId){

    return interfaceFactory(arguments, this.constructor.name, "findWechatAccountByAccountId", package);

  };

  this.addAccountManages = function(accountManages){

    return interfaceFactory(arguments, this.constructor.name, "addAccountManages", package);

  };

	
	/**
	 * <p>标题：findAccountManagesByAccountId</p>
	 * <p>说明：根据账户ID查询账户管理记录</p>
	 * @param accountId
	 * @return
	 */

  this.findAccountManagesByAccountId = function(accountId){

    return interfaceFactory(arguments, this.constructor.name, "findAccountManagesByAccountId", package);

  };

	/**
	 * <p>标题：findAccountAuthensByAccountId</p>
	 * <p>说明：根据账户ID查询账户验证记录</p>
	 * @param accountId
	 * @return
	 */

  this.findAccountAuthensByAccountId = function(accountId){

    return interfaceFactory(arguments, this.constructor.name, "findAccountAuthensByAccountId", package);

  };

	/**
	 * <p>标题：editAccountList</p>
	 * <p>说明：更新账户信息</p>
	 * @param accountList
	 * @return
	 */

  this.editAccountList = function(accountList){

    return interfaceFactory(arguments, this.constructor.name, "editAccountList", package);

  };

	/**
	 * <p>标题：getAccountResultById</p>
	 * <p>说明：获取账户信息</p>
	 * @param accountId
	 * @return
	 */

  this.getAccountResultById = function(accountId){

    return interfaceFactory(arguments, this.constructor.name, "getAccountResultById", package);

  };

	/**
	 * <p>标题：getArticleList</p>
	 * <p>说明：根据名称分页查询文章清单.</p>
	 * @param title
	 * @param pageNow
	 * @param pageSize
	 * @return
	 */

  this.getArticleList = function(title,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getArticleList", package);

  };

	/**
	 * <p>标题：addArticleList</p>
	 * <p>说明：添加文章</p>
	 * @param articleList
	 * @return
	 */

  this.addArticleList = function(articleList){

    return interfaceFactory(arguments, this.constructor.name, "addArticleList", package);

  };

	/**
	 * <p>标题：editArticleList</p>
	 * <p>说明：更新文章</p>
	 * @param articleList
	 * @return
	 */

  this.editArticleList = function(articleList){

    return interfaceFactory(arguments, this.constructor.name, "editArticleList", package);

  };

	/**
	 * <p>标题：findArticleListById</p>
	 * <p>说明：根据主键查询文章详情</p>
	 * @param articleId
	 * @return
	 */

  this.findArticleListById = function(articleId){

    return interfaceFactory(arguments, this.constructor.name, "findArticleListById", package);

  };

	/**
	 * <p>标题：checkArticleList</p>
	 * <p>说明：审核当前文章</p>
	 * @param articleId
	 * @return
	 */

  this.checkArticleList = function(articleId){

    return interfaceFactory(arguments, this.constructor.name, "checkArticleList", package);

  };

	/**
	 * <p>标题：delArticleListById</p>
	 * <p>说明：删除当前文章</p>
	 * @param articleId
	 * @return
	 */

  this.delArticleListById = function(articleId){

    return interfaceFactory(arguments, this.constructor.name, "delArticleListById", package);

  };

	/**
	 * <p>标题：getArticleTopics</p>
	 * <p>说明：获取主题分类</p>
	 * @param topicId
	 * @return
	 */

  this.getArticleTopics = function(){

    return interfaceFactory(arguments, this.constructor.name, "getArticleTopics", package);

  };

	/**
	 * <p>标题：findArticleTopicsById</p>
	 * <p>说明：根据主键获取主题分类</p>
	 * @param topicId
	 * @return
	 */

  this.findArticleTopicsById = function(topicId){

    return interfaceFactory(arguments, this.constructor.name, "findArticleTopicsById", package);

  };

	/**
	 * <p>标题：addArticleTopics</p>
	 * <p>说明：添加主题分类</p>
	 * @param articleTopics
	 * @return
	 */

  this.addArticleTopics = function(articleTopics){

    return interfaceFactory(arguments, this.constructor.name, "addArticleTopics", package);

  };

	/**
	 * <p>标题：editArticleTopics</p>
	 * <p>说明：编辑主题分类</p>
	 * @param articleTopics
	 * @return
	 */

  this.editArticleTopics = function(articleTopics){

    return interfaceFactory(arguments, this.constructor.name, "editArticleTopics", package);

  };

	/**
	 * <p>标题：delArticleTopicsById</p>
	 * <p>说明：删除主题分类</p>
	 * @param topicId
	 * @return
	 */

  this.delArticleTopicsById = function(topicId){

    return interfaceFactory(arguments, this.constructor.name, "delArticleTopicsById", package);

  };


	/**
	 * <p>标题：getArticleTopicByArtId</p>
	 * <p>说明：获取文章主题,如果文章设置了该主题,则返回文章ID</p>
	 * @param articleId
	 * @return
	 */

  this.getArticleTopicByArtId = function(articleId){

    return interfaceFactory(arguments, this.constructor.name, "getArticleTopicByArtId", package);

  };


	/**
	 * <p>标题：getAccountTopics</p>
	 * <p>说明：获取当前主题的订阅账户</p>
	 * @param topId
	 * @param i
	 * @param numPerPage
	 * @return
	 */

  this.getAccountTopics = function(topId,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getAccountTopics", package);

  };



	/**
	 * <p>标题：getArticleReadLog</p>
	 * <p>说明：获取文章阅读记录</p>
	 * @param articleId
	 * @param pageNow
	 * @param pageSize
	 * @return
	 */

  this.getArticleReadLog = function(articleId,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getArticleReadLog", package);

  };

	/**
	 * <p>标题：getArticleFavoriteLogByAccountId</p>
	 * <p>说明：获取个人收藏记录列表</p>
	 * @param accountId		账户ID 可以不传入
	 * @param pageNow	当前页码(从0开始)
	 * @param pageSize	页码大小
	 * @return
	 */

  this.getArticleFavoriteLog = function(articleId,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getArticleFavoriteLog", package);

  };

	/**
	 * <p>标题：getArticleDiscussLogByArticleId</p>
	 * <p>说明：获取文章评论记录列表</p>
	 * @param articleId		文章ID(必传)
	 * @param pageNow	当前页码(从0开始)
	 * @param pageSize	页码大小
	 * @return
	 */

  this.getArticleDiscussLog = function(articleId,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getArticleDiscussLog", package);

  };

	/**
	 * <p>标题：addArticleInBoard</p>
	 * <p>说明：添加文章刊发版面</p>
	 * @param articleInBoard
	 * @return
	 */

  this.addArticleInBoard = function(articleInBoard){

    return interfaceFactory(arguments, this.constructor.name, "addArticleInBoard", package);

  };

	/**
	 * <p>标题：saveboxArticleToTopics</p>
	 * <p>说明：保存文章归属主题</p>
	 * @param topicIds 主题ID支持多个
	 * @param articleId 文章ID
	 * @return
	 */

  this.saveboxArticleToTopics = function(topicIds,articleId){

    return interfaceFactory(arguments, this.constructor.name, "saveboxArticleToTopics", package);

  };

	/**
	 * <p>标题：findArticleInBoardByCode</p>
	 * <p>说明：根据版面码查询文章刊发版面</p>
	 * @param code
	 * @return
	 */

  this.findArticleInBoardByCode = function(code,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "findArticleInBoardByCode", package);

  };

	/**
	 * 
	 * <p>标题：findAccountTopicByCode</p>
	 * <p>说明：根据版面码查询个人订阅主题</p>
	 * @param code
	 * @param pageNow
	 * @param pageSize
	 * @return
	 */

  this.findAccountTopicByCode = function(code,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "findAccountTopicByCode", package);

  };

	/**
	 * <p>标题：findArticleReadLogByArticleId</p>
	 * <p>说明：根据文章ID查询个人阅读记录</p>
	 * @param articleId
	 * @param pageNow
	 * @param pageSize
	 * @return
	 */

  this.findArticleReadLogByArticleId = function(articleId,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "findArticleReadLogByArticleId", package);

  };

	/**
	 * <p>标题：findArticleFavoriteLogByArticleId</p>
	 * <p>说明：根据文章ID查询个人收藏记录</p>
	 * @param articleId
	 * @param pageNow
	 * @param pageSize
	 * @return
	 */

  this.findArticleFavoriteLogByArticleId = function(articleId,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "findArticleFavoriteLogByArticleId", package);

  };

	/**
	 * <p>标题：findArticleDiscussLogByArticleId</p>
	 * <p>说明：根据文章ID查询文章评论记录</p>
	 * @param articleId
	 * @param pageNow
	 * @param pageSize
	 * @return
	 */

  this.findArticleDiscussLogByArticleId = function(articleId,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "findArticleDiscussLogByArticleId", package);

  };


	/**
	 * <p>标题：getMonitorItemsList</p>
	 * <p>说明：查询监测指标项目列表</p>
	 * @param itemName
	 * @param pageNow
	 * @param pageSize
	 */

  this.getMonitorItemsList = function(itemName,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getMonitorItemsList", package);

  };


	/**
	 * <p>标题：getMonitorItemsById</p>
	 * <p>说明：根据主键查询监测指标项目</p>
	 * @param id
	 * @return
	 */

  this.getMonitorItemsById = function(id){

    return interfaceFactory(arguments, this.constructor.name, "getMonitorItemsById", package);

  };


	/**
	 * <p>标题：addMonitorItems</p>
	 * <p>说明：添加监测指标项目</p>
	 * @param monitorItems
	 * @return
	 */

  this.addMonitorItems = function(monitorItems){

    return interfaceFactory(arguments, this.constructor.name, "addMonitorItems", package);

  };


	/**
	 * <p>标题：editMonitorItems</p>
	 * <p>说明：编辑监测指标项目</p>
	 * @param monitorItems
	 * @return
	 */

  this.editMonitorItems = function(monitorItems){

    return interfaceFactory(arguments, this.constructor.name, "editMonitorItems", package);

  };

	
	/**
	 * <p>标题：delMonitorItemsById</p>
	 * <p>说明：删除监测指标项目</p>
	 * @param id
	 * @return
	 */

  this.delMonitorItemsById = function(id){

    return interfaceFactory(arguments, this.constructor.name, "delMonitorItemsById", package);

  };

  this.getMonitorReferencesByItemId = function(itemId){

    return interfaceFactory(arguments, this.constructor.name, "getMonitorReferencesByItemId", package);

  };


	/**
	 * <p>标题：findMonitorReferencesByItemIdAndSeqNo</p>
	 * <p>说明：根据监测指标项目ID与序号查询指标详情</p>
	 * @param itemId
	 * @param seqNo
	 * @return
	 */

  this.findMonitorReferencesByItemIdAndSeqNo = function(itemId,seqNo){

    return interfaceFactory(arguments, this.constructor.name, "findMonitorReferencesByItemIdAndSeqNo", package);

  };


	/**
	 * <p>标题：findMonitorReferencesBySeach</p>
	 * <p>说明：查询指标值是否存在已经录入的条件</p>
	 * @param itemId		监测指标项目
	 * @param divSex		性别
	 * @param divAge		年龄段
	 * @param divPart		部位
	 * @param divSeason		时节
	 * @param divTime		时点
	 * @param divStatus		状态
	 * @return
	 */

  this.findMonitorReferencesBySeach = function(itemId,divSex,divAge,divPart,divSeason,divTime,divStatus){

    return interfaceFactory(arguments, this.constructor.name, "findMonitorReferencesBySeach", package);

  };


	/**
	 * <p>标题：addMonitorReferences</p>
	 * <p>说明：添加指标参考值</p>
	 * @param monitorReferences
	 * @return
	 */

  this.addMonitorReferences = function(monitorReferences){

    return interfaceFactory(arguments, this.constructor.name, "addMonitorReferences", package);

  };

	/**
	 * <p>标题：editMonitorReferences</p>
	 * <p>说明：编辑指标参考值</p>
	 * @param monitorReferences
	 * @return
	 */

  this.editMonitorReferences = function(monitorReferences){

    return interfaceFactory(arguments, this.constructor.name, "editMonitorReferences", package);

  };

	/**
	 * <p>标题：delMonitorReference</p>
	 * <p>说明：删除指标参考值</p>
	 * @param itemId
	 * @param stepNo
	 * @return
	 */

  this.delMonitorReference = function(itemId,stepNo){

    return interfaceFactory(arguments, this.constructor.name, "delMonitorReference", package);

  };

	/**
	 * <p>标题：getMonitorCautionsByItemId</p>
	 * <p>说明：查询监测项目提示语</p>
	 * @param itemId
	 * @return
	 */

  this.getMonitorCautionsByItemId = function(itemId){

    return interfaceFactory(arguments, this.constructor.name, "getMonitorCautionsByItemId", package);

  };


	/**
	 * <p>标题：findMonitorCautions</p>
	 * <p>说明：根据监测项目ID.步骤号查询提示语</p>
	 * @param itemId
	 * @param stepNo
	 * @return
	 */

  this.findMonitorCautions = function(itemId,stepNo){

    return interfaceFactory(arguments, this.constructor.name, "findMonitorCautions", package);

  };


	/**
	 * <p>标题：editMonitorCautions</p>
	 * <p>说明：编辑提示语</p>
	 * @param monitorCautions
	 * @return
	 */

  this.editMonitorCautions = function(monitorCautions){

    return interfaceFactory(arguments, this.constructor.name, "editMonitorCautions", package);

  };


	/**
	 * <p>标题：addMonitorCautions</p>
	 * <p>说明：添加编辑提示语</p>
	 * @param monitorCautions
	 * @return
	 */

  this.addMonitorCautions = function(monitorCautions){

    return interfaceFactory(arguments, this.constructor.name, "addMonitorCautions", package);

  };


	/**
	 * <p>标题：delMonitorCautions</p>
	 * <p>说明：删除编辑提示语</p>
	 * @param itemId
	 * @param stepNo
	 * @return
	 */

  this.delMonitorCautions = function(itemId,stepNo){

    return interfaceFactory(arguments, this.constructor.name, "delMonitorCautions", package);

  };


	/**
	 * <p>标题：getMonitorSuitesList</p>
	 * <p>说明：查询监测执行组列表</p>
	 * @param name
	 * @param pageNow
	 * @param pageSize
	 * @return
	 */

  this.getMonitorSuitesList = function(name,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getMonitorSuitesList", package);

  };


	/**
	 * <p>标题：addMonitorSuites</p>
	 * <p>说明：添加监测执行组</p>
	 * @param monitorSuites
	 * @return
	 */

  this.addMonitorSuites = function(monitorSuites){

    return interfaceFactory(arguments, this.constructor.name, "addMonitorSuites", package);

  };


	/**
	 * <p>标题：findMonitorSuitesById</p>
	 * <p>说明：根据主键查询监测执行组</p>
	 * @param id
	 * @return
	 */

  this.findMonitorSuitesById = function(id){

    return interfaceFactory(arguments, this.constructor.name, "findMonitorSuitesById", package);

  };


	/**
	 * <p>标题：editMonitorSuites</p>
	 * <p>说明：编辑监测执行组</p>
	 * @param monitorSuites
	 * @return
	 */

  this.editMonitorSuites = function(monitorSuites){

    return interfaceFactory(arguments, this.constructor.name, "editMonitorSuites", package);

  };


	/**
	 * <p>标题：delMonitorSuites</p>
	 * <p>说明：删除监测执行组</p>
	 * @param id
	 * @return
	 */

  this.delMonitorSuites = function(id){

    return interfaceFactory(arguments, this.constructor.name, "delMonitorSuites", package);

  };


	/**
	 * <p>标题：getMonitorSuiteItemsBySuiteId</p>
	 * <p>说明：根据检测组ID获取检测组指标</p>
	 * @param suiteId
	 * @return
	 */

  this.getMonitorSuiteItemsBySuiteId = function(suiteId){

    return interfaceFactory(arguments, this.constructor.name, "getMonitorSuiteItemsBySuiteId", package);

  };


	/**
	 * <p>标题：getMonitorItemsByNotSuiteId</p>
	 * <p>说明：根据监测组ID查询当前检测组没有选择的指标</p>
	 * @param suiteId
	 * @return
	 */

  this.getMonitorItemsByNotSuiteId = function(suiteId){

    return interfaceFactory(arguments, this.constructor.name, "getMonitorItemsByNotSuiteId", package);

  };


	/**
	 * <p>标题：addMonitorSuiteItems</p>
	 * <p>说明：添加检测组指标</p>
	 * @param monitorSuiteItems
	 * @return
	 */

  this.addMonitorSuiteItems = function(monitorSuiteItems){

    return interfaceFactory(arguments, this.constructor.name, "addMonitorSuiteItems", package);

  };


	/**
	 * <p>标题：delMonitorSuiteItems</p>
	 * <p>说明：删除检测组指标</p>
	 * @param suiteId
	 * @param itemId
	 * @return
	 */

  this.delMonitorSuiteItems = function(suiteId,itemId){

    return interfaceFactory(arguments, this.constructor.name, "delMonitorSuiteItems", package);

  };


	/**
	 * <p>标题：getMeterList</p>
	 * <p>说明：查看监测仪器管理列表</p>
	 * @param name
	 * @param pageNow
	 * @param pageSize
	 * @return
	 */

  this.getMeterList = function(name,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getMeterList", package);

  };


	/**
	 * <p>标题：addMeterList</p>
	 * <p>说明：添加监测仪器管理</p>
	 * @param meterList
	 * @return
	 */

  this.addMeterList = function(meterList){

    return interfaceFactory(arguments, this.constructor.name, "addMeterList", package);

  };


	/**
	 * <p>标题：editMeterList</p>
	 * <p>说明：编辑监测仪器管理</p>
	 * @param meterList
	 * @return
	 */

  this.editMeterList = function(meterList){

    return interfaceFactory(arguments, this.constructor.name, "editMeterList", package);

  };


	/**
	 * <p>标题：delMeterList</p>
	 * <p>说明：删除编辑监测仪器管理</p>
	 * @param code
	 * @return
	 */

  this.delMeterList = function(code){

    return interfaceFactory(arguments, this.constructor.name, "delMeterList", package);

  };


	/**
	 * <p>标题：findMeterListByCode</p>
	 * <p>说明：根据编码查询监测仪器管理</p>
	 * @param code
	 * @return
	 */

  this.findMeterListByCode = function(code){

    return interfaceFactory(arguments, this.constructor.name, "findMeterListByCode", package);

  };


	/**
	 * <p>标题：getMeterModesByMeterCode</p>
	 * <p>说明：根据仪器吗获取机器运行模式</p>
	 * @param meterCode
	 * @return
	 */

  this.getMeterModesByMeterCode = function(meterCode){

    return interfaceFactory(arguments, this.constructor.name, "getMeterModesByMeterCode", package);

  };


	/**
	 * <p>标题：addMeterModes</p>
	 * <p>说明：添加仪器运行模式</p>
	 * @param meterModes
	 * @return
	 */

  this.addMeterModes = function(meterModes){

    return interfaceFactory(arguments, this.constructor.name, "addMeterModes", package);

  };


	/**
	 * <p>标题：findMeterModesByCodes</p>
	 * <p>说明：根据仪器编码与模式编码查询仪器运行模式</p>
	 * @param meterCode
	 * @param modeCode
	 * @return
	 */

  this.findMeterModesByCodes = function(meterCode,modeCode){

    return interfaceFactory(arguments, this.constructor.name, "findMeterModesByCodes", package);

  };


	/**
	 * <p>标题：editMeterModes</p>
	 * <p>说明：编辑仪器运行模式</p>
	 * @param meterModes
	 * @return
	 */

  this.editMeterModes = function(meterModes){

    return interfaceFactory(arguments, this.constructor.name, "editMeterModes", package);

  };


	/**
	 * <p>标题：delMeterModesByCodes</p>
	 * <p>说明：删除仪器运行模式</p>
	 * @param meterCode
	 * @param modeCode
	 * @return
	 */

  this.delMeterModesByCodes = function(meterCode,modeCode){

    return interfaceFactory(arguments, this.constructor.name, "delMeterModesByCodes", package);

  };


	/**
	 * <p>标题：editCloudList</p>
	 * <p>说明：编辑区域云</p>
	 * @param cloudList
	 * @return
	 */

  this.editCloudList = function(cloudList){

    return interfaceFactory(arguments, this.constructor.name, "editCloudList", package);

  };


	/**
	 * <p>标题：findCloudListById</p>
	 * <p>说明：根据主键查询区域云详情</p>
	 * @param id
	 * @return
	 */

  this.findCloudListById = function(id){

    return interfaceFactory(arguments, this.constructor.name, "findCloudListById", package);

  };


	/**
	 * <p>标题：addCloudList</p>
	 * <p>说明：添加区域云</p>
	 * @param cloudList
	 * @return
	 */

  this.addCloudList = function(cloudList){

    return interfaceFactory(arguments, this.constructor.name, "addCloudList", package);

  };


	/**
	 * <p>标题：getCloudList</p>
	 * <p>说明：云区域管理列表</p>
	 * @param title
	 * @param pageNow
	 * @param pageSize
	 * @return
	 */

  this.getCloudList = function(title,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getCloudList", package);

  };


	/**
	 * <p>标题：delWechatTempListById</p>
	 * <p>说明：删除微信模板</p>
	 * @param id
	 * @return
	 */

  this.delWechatTempListById = function(id){

    return interfaceFactory(arguments, this.constructor.name, "delWechatTempListById", package);

  };


	/**
	 * <p>标题：editWechatTempList</p>
	 * <p>说明：编辑微信模板</p>
	 * @param wechatTempList
	 * @return
	 */

  this.editWechatTempList = function(wechatTempList){

    return interfaceFactory(arguments, this.constructor.name, "editWechatTempList", package);

  };


	/**
	 * <p>标题：findWechatTempListById</p>
	 * <p>说明：根据主键查询微信模板</p>
	 * @param id
	 * @return
	 */

  this.findWechatTempListById = function(id){

    return interfaceFactory(arguments, this.constructor.name, "findWechatTempListById", package);

  };


	/**
	 * <p>标题：addWechatTempList</p>
	 * <p>说明：添加微信模板</p>
	 * @param wechatTempList
	 * @return
	 */

  this.addWechatTempList = function(wechatTempList){

    return interfaceFactory(arguments, this.constructor.name, "addWechatTempList", package);

  };


	/**
	 * <p>标题：getWechatTempList</p>
	 * <p>说明：微信模板列表</p>
	 * @param name
	 * @param pageNow
	 * @param pageSize
	 * @return
	 */

  this.getWechatTempList = function(name,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getWechatTempList", package);

  };

  this.getWechatTempElement = function(tempId){

    return interfaceFactory(arguments, this.constructor.name, "getWechatTempElement", package);

  };


	/**
	 * <p>标题：addWechatTempElement</p>
	 * <p>说明：添加微信模板元素</p>
	 * @param wechatTempElement
	 * @return
	 */

  this.addWechatTempElement = function(wechatTempElement){

    return interfaceFactory(arguments, this.constructor.name, "addWechatTempElement", package);

  };


	/**
	 * <p>标题：findWechatTempElementByKey</p>
	 * <p>说明：根据主键查询微信模板元素</p>
	 * @param tempId
	 * @param keyWord
	 * @return
	 */

  this.findWechatTempElementByKey = function(tempId,keyWord){

    return interfaceFactory(arguments, this.constructor.name, "findWechatTempElementByKey", package);

  };


	/**
	 * <p>标题：editWechatTempElement</p>
	 * <p>说明：编辑微信模板元素</p>
	 * @param wechatTempElement
	 * @return
	 */

  this.editWechatTempElement = function(wechatTempElement){

    return interfaceFactory(arguments, this.constructor.name, "editWechatTempElement", package);

  };


	/**
	 * <p>标题：delWechatTempElementByKey</p>
	 * <p>说明：删除微信元素模板</p>
	 * @param tempId
	 * @param keyWord
	 * @return
	 */

  this.delWechatTempElementByKey = function(tempId,keyWord){

    return interfaceFactory(arguments, this.constructor.name, "delWechatTempElementByKey", package);

  };


	/**
	 * <p>标题：getArticleBoardsByArticleId</p>
	 * <p>说明：获取文章版面并返回当前文章是否已经在版面上</p>
	 * @param articleId
	 * @return
	 */

  this.getArticleBoardsByArticleId = function(articleId){

    return interfaceFactory(arguments, this.constructor.name, "getArticleBoardsByArticleId", package);

  };

	
	/**
	 * <p>标题：getArticleInBoardByArtId</p>
	 * <p>说明：获取文章已经刊发版面</p>
	 * @param articleId
	 * @return
	 */

  this.getArticleInBoardByArtId = function(articleId){

    return interfaceFactory(arguments, this.constructor.name, "getArticleInBoardByArtId", package);

  };

	
	/**
	 * <p>标题：upArticleInBoard</p>
	 * <p>说明：更新文章刊发版面</p>
	 * @param articleInBoard
	 * @return
	 */

  this.upArticleInBoard = function(articleInBoard){

    return interfaceFactory(arguments, this.constructor.name, "upArticleInBoard", package);

  };


	/**
	 * <p>标题：getClientVersions</p>
	 * <p>说明：查看版本管理</p>
	 * @param pageNow
	 * @param pageSize
	 * @return
	 */

  this.getClientVersions = function(pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getClientVersions", package);

  };


	/**
	 * <p>标题：addClientVersion</p>
	 * <p>说明：添加版本管理</p>
	 * @param clientVersion
	 * @return
	 */

  this.addClientVersion = function(clientVersion){

    return interfaceFactory(arguments, this.constructor.name, "addClientVersion", package);

  };


	/**
	 * <p>标题：findClientVersionById</p>
	 * <p>说明：根据版本ID查询版本详情</p>
	 * @param id
	 * @return
	 */

  this.findClientVersionById = function(id){

    return interfaceFactory(arguments, this.constructor.name, "findClientVersionById", package);

  };


	/**
	 * <p>标题：editClientVersion</p>
	 * <p>说明：编辑版本</p>
	 * @param clientVersion
	 * @return
	 */

  this.editClientVersion = function(clientVersion){

    return interfaceFactory(arguments, this.constructor.name, "editClientVersion", package);

  };


	/**
	 * <p>标题：delClientVersionById</p>
	 * <p>说明：删除版本</p>
	 * @param id
	 * @return
	 */

  this.delClientVersionById = function(id){

    return interfaceFactory(arguments, this.constructor.name, "delClientVersionById", package);

  };

  this.getArticleListByBoardCode = function(boardCode,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getArticleListByBoardCode", package);

  };

	/**
	 * <p>标题：saveArticleReadLog</p>
	 * <p>说明：保存个人阅读记录标记</p>
	 * @param articleReadLog .articleId=>文章ID;readFlag,praiseFlag只能接受1个参数</br>
	 * articleReadLog .readFlag=>阅读的时候传入1 其他不传入</br>
	 * articleReadLog .praiseFlag=>点赞的时候传入1 其他不传入
	 * @return
	 */

  this.saveArticleReadLog = function(articleReadLog){

    return interfaceFactory(arguments, this.constructor.name, "saveArticleReadLog", package);

  };

  this.getArticleFavoriteLogByAccountId = function(accountId,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getArticleFavoriteLogByAccountId", package);

  };

	/**
	 * <p>标题：saveArticleFavoriteLog</p>
	 * <p>说明：保存个人收藏记录</p>
	 * @param articleFavoriteLog	=>.账户ID不需要传入. 默认获取当前账户的ID, 必须传入文章ID.提交时间不传入,默认服务器当前时间,收藏标签 选传参数</br>
	 *	如果传入之前已经保存过得记录.请传入之前的收藏标签.否则清空收藏标签.</br>
	 * @return
	 */

  this.saveArticleFavoriteLog = function(articleFavoriteLog){

    return interfaceFactory(arguments, this.constructor.name, "saveArticleFavoriteLog", package);

  };

	/**
	 * <p>标题：delArticleFavoriteLogByKey</p>
	 * <p>说明：删除个人收藏记录,注意:!!不传入文章ID默认删除当前账户的所有收藏ID</p>
	 * @param articleIds []		个人收藏的文章ID(可以传入多个)
	 * @return
	 */

  this.delArticleFavoriteLogByKey = function(articleIds){

    return interfaceFactory(arguments, this.constructor.name, "delArticleFavoriteLogByKey", package);

  };

  this.getArticleDiscussLogByArticleId = function(articleId,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getArticleDiscussLogByArticleId", package);

  };

	/**
	 * <p>标题：addArticleDiscussLog</p>
	 * <p>说明：添加文章评论记录</p>
	 * @param articleDiscussLog 添加文章评论时,必须传入文章ID与评论内容.
	 * @return one 当前评论
	 */

  this.addArticleDiscussLog = function(articleDiscussLog){

    return interfaceFactory(arguments, this.constructor.name, "addArticleDiscussLog", package);

  };

	/**
	 * <p>标题：delArticleDiscussLogById</p>
	 * <p>说明：删除文章评论记录</p>
	 * 该接口预留多个删除方式:</br>
	 * 1.根据主键ID(id) 删除,只传入评论ID即可.(提供后台管理员可以通过ID删除单挑的评论记录)</br>
	 * 2.根据文章ID(articleId) 删除,只传入文章ID,删除文章下当前账号的的所有评论</br>
	 * 3.根据账户ID 删除,不传入参数,直接删除当前账号的所有评论</br>
	 * @param articleDiscussLog
	 * @return
	 */

  this.delArticleDiscussLogById = function(articleDiscussLog){

    return interfaceFactory(arguments, this.constructor.name, "delArticleDiscussLogById", package);

  };

	/**
	 * <p>标题：getAccountTopicByAccountIdAndBoardCode</p>
	 * <p>说明：获取个人主题订阅信息</p>
	 * @param accountId	账户ID 前段可以不传入(默认当前账户),后台传入账户ID,查看账户订阅信息
	 * @param boardCode		版面码(不能为空)
	 * @return	返回list数据.其中账户ID accountId存在,表示当前账户订阅该主题
	 */

  this.getAccountTopicByAccountIdAndBoardCode = function(accountId,boardCode){

    return interfaceFactory(arguments, this.constructor.name, "getAccountTopicByAccountIdAndBoardCode", package);

  };

	/**
	 * <p>标题：saveAccountTopicByAccountId</p>
	 * <p>说明：保存个人主题订阅信息</p>
	 * @param topicIds		[]主题ID,可以传入多个,不出入则删除当前账户当前版面码下的主题
	 * @param boardCode		版面码(不能为空)
	 * @return
	 */

  this.saveAccountTopicByAccountId = function(topicIds,boardCode){

    return interfaceFactory(arguments, this.constructor.name, "saveAccountTopicByAccountId", package);

  };

  this.getWechatAccountBySelf = function(openId){

    return interfaceFactory(arguments, this.constructor.name, "getWechatAccountBySelf", package);

  };

  }


  function ExternalAPIInterfactory(){

      var package = "com.zcareze.core.service";

  this.getOssObjectPolicy = function(bucketKey){

    return interfaceFactory(arguments, this.constructor.name, "getOssObjectPolicy", package);

  };

  }


  function BaseDictionaryInterfactory(){

      var package = "com.zcareze.regional.service";

  this.getDictionaryTableDataByTableCodeAndVersion = function(dictionaryParamList){

    return interfaceFactory(arguments, this.constructor.name, "getDictionaryTableDataByTableCodeAndVersion", package);

  };

  this.getServiceListByGetType = function(objectId,basic,getType){

    return interfaceFactory(arguments, this.constructor.name, "getServiceListByGetType", package);

  };

  this.findOptionListByCode = function(code){

    return interfaceFactory(arguments, this.constructor.name, "findOptionListByCode", package);

  };

  this.findOptionValueByA01 = function(){

    return interfaceFactory(arguments, this.constructor.name, "findOptionValueByA01", package);

  };

  this.getDictionaryTableDataByTableCode = function(classz,tableCode){

    return interfaceFactory(arguments, this.constructor.name, "getDictionaryTableDataByTableCode", package);

  };

  this.getDictionaryTableDataByTableCodeAndKey = function(classz,tableCode,keyName,keyValue){

    return interfaceFactory(arguments, this.constructor.name, "getDictionaryTableDataByTableCodeAndKey", package);

  };

  this.getDictionaryDataByTableCodeAndPage = function(tableCode,ddParam,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getDictionaryDataByTableCodeAndPage", package);

  };

  this.getOptionListByTableCode = function(tableCode,ddParam,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getOptionListByTableCode", package);

  };

  this.getHealthProblemListByTableCode = function(tableCode,ddParam,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getHealthProblemListByTableCode", package);

  };

  this.saveServiceListData = function(serviceListVO){

    return interfaceFactory(arguments, this.constructor.name, "saveServiceListData", package);

  };

  this.getServiceListByTableCode = function(tableCode,getType,ddParam,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getServiceListByTableCode", package);

  };

  this.getMedicineUsagesByTableCode = function(tableCode,ddParam){

    return interfaceFactory(arguments, this.constructor.name, "getMedicineUsagesByTableCode", package);

  };

  this.getFrequencyListByKind = function(kindList){

    return interfaceFactory(arguments, this.constructor.name, "getFrequencyListByKind", package);

  };

  this.getMedicineListVOById = function(id){

    return interfaceFactory(arguments, this.constructor.name, "getMedicineListVOById", package);

  };

  this.getMedicineListVOByKind = function(kind,searchKey,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getMedicineListVOByKind", package);

  };

  this.getDictionaryTableInfoByType = function(type,searchKey,general,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getDictionaryTableInfoByType", package);

  };

  this.getDictionaryTableStructure = function(dictionaryParamList){

    return interfaceFactory(arguments, this.constructor.name, "getDictionaryTableStructure", package);

  };

  this.saveDictionaryData = function(type,tableCode,getType,ddParam){

    return interfaceFactory(arguments, this.constructor.name, "saveDictionaryData", package);

  };

  this.saveDictionary = function(dictionary,saveType){

    return interfaceFactory(arguments, this.constructor.name, "saveDictionary", package);

  };

  this.getMedRecipeListVOBySearchKey = function(common,searchKey,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getMedRecipeListVOBySearchKey", package);

  };

  this.getMedRecipeListVOById = function(recipeId){

    return interfaceFactory(arguments, this.constructor.name, "getMedRecipeListVOById", package);

  };

  this.getMedRecipeDetailByRecipeIdAndMedId = function(recipeId,medId){

    return interfaceFactory(arguments, this.constructor.name, "getMedRecipeDetailByRecipeIdAndMedId", package);

  };

  this.delMedRecipeDetailByRecipeIdAndMedId = function(recipeId,medId){

    return interfaceFactory(arguments, this.constructor.name, "delMedRecipeDetailByRecipeIdAndMedId", package);

  };

  this.getHerbRecipeListVOBySearchKey = function(searchKey,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getHerbRecipeListVOBySearchKey", package);

  };

  this.getHerbRecipeListVOById = function(recipeId){

    return interfaceFactory(arguments, this.constructor.name, "getHerbRecipeListVOById", package);

  };

  this.getHerbRecipeDetailByRecipeIdAndMedId = function(recipeId,medId){

    return interfaceFactory(arguments, this.constructor.name, "getHerbRecipeDetailByRecipeIdAndMedId", package);

  };

  this.delHerbRecipeDetailByRecipeIdAndMedId = function(recipeId,medId){

    return interfaceFactory(arguments, this.constructor.name, "delHerbRecipeDetailByRecipeIdAndMedId", package);

  };

  this.getTreatmentListVOBySearchKey = function(searchKey,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getTreatmentListVOBySearchKey", package);

  };

  this.getTreatmentListVOById = function(treatmentListId){

    return interfaceFactory(arguments, this.constructor.name, "getTreatmentListVOById", package);

  };

  this.getGuidanceListByTableCode = function(tableCode,ddParam,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getGuidanceListByTableCode", package);

  };

  this.getReferralListByTableCode = function(tableCode,ddParam,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getReferralListByTableCode", package);

  };

  this.getMonitorSchemeListVOBySearchKey = function(searchKey,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getMonitorSchemeListVOBySearchKey", package);

  };

  this.getMonitorSchemeListVOById = function(schemeId){

    return interfaceFactory(arguments, this.constructor.name, "getMonitorSchemeListVOById", package);

  };

  this.getMonitorSchemeDetailByKey = function(schemeId,seqNo){

    return interfaceFactory(arguments, this.constructor.name, "getMonitorSchemeDetailByKey", package);

  };

  this.delMonitorSchemeDetailByKey = function(schemeId,seqNo){

    return interfaceFactory(arguments, this.constructor.name, "delMonitorSchemeDetailByKey", package);

  };

  this.getEvaluationListVOBySearchKey = function(searchKey,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getEvaluationListVOBySearchKey", package);

  };

  this.getEvaluationListVOById = function(evaId){

    return interfaceFactory(arguments, this.constructor.name, "getEvaluationListVOById", package);

  };

  this.getEvaQaFactorsVOByEvaId = function(evaId){

    return interfaceFactory(arguments, this.constructor.name, "getEvaQaFactorsVOByEvaId", package);

  };

  this.getEvaQaFactorsVOByEvaIdAndFactorId = function(evaId,factorId){

    return interfaceFactory(arguments, this.constructor.name, "getEvaQaFactorsVOByEvaIdAndFactorId", package);

  };

  this.delEvaQaFactorsVOByEvaIdAndFactorId = function(evaId,factorId){

    return interfaceFactory(arguments, this.constructor.name, "delEvaQaFactorsVOByEvaIdAndFactorId", package);

  };

  this.getEvaQaListVOByEvaIdAndFactorId = function(evaId,factorId){

    return interfaceFactory(arguments, this.constructor.name, "getEvaQaListVOByEvaIdAndFactorId", package);

  };

  this.getEvaQaListVOById = function(pid){

    return interfaceFactory(arguments, this.constructor.name, "getEvaQaListVOById", package);

  };

  this.delEvaQaListById = function(pid){

    return interfaceFactory(arguments, this.constructor.name, "delEvaQaListById", package);

  };

  this.getEvaQaOptionsByQaId = function(qaId){

    return interfaceFactory(arguments, this.constructor.name, "getEvaQaOptionsByQaId", package);

  };

  this.saveEvaQaOptions = function(evaQaListVO){

    return interfaceFactory(arguments, this.constructor.name, "saveEvaQaOptions", package);

  };

  this.getEvaFactorListBySearchKey = function(searchKey,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getEvaFactorListBySearchKey", package);

  };

  this.getEvaFactorListById = function(pid){

    return interfaceFactory(arguments, this.constructor.name, "getEvaFactorListById", package);

  };

  this.getEvaFactorGradeVOByFactorId = function(factorId){

    return interfaceFactory(arguments, this.constructor.name, "getEvaFactorGradeVOByFactorId", package);

  };

  this.getEvaFactorGradeVOByFactorIdAndSeqNo = function(factorId,seqNo){

    return interfaceFactory(arguments, this.constructor.name, "getEvaFactorGradeVOByFactorIdAndSeqNo", package);

  };

  this.delEvaFactorGradeVOByFactorIdAndSeqNo = function(factorId,seqNo){

    return interfaceFactory(arguments, this.constructor.name, "delEvaFactorGradeVOByFactorIdAndSeqNo", package);

  };


	/**
	 * <p>
	 * 标题：findTimeDivisionsByName
	 * </p>
	 * <p>
	 * 说明：根据时点名称获取时点划分
	 * </p>
	 * 
	 * @param name
	 */

  this.findTimeDivisionsByName = function(name){

    return interfaceFactory(arguments, this.constructor.name, "findTimeDivisionsByName", package);

  };

  this.delLabelListByKindAndTitle = function(kind,title){

    return interfaceFactory(arguments, this.constructor.name, "delLabelListByKindAndTitle", package);

  };

  this.refreshDictionaryCach = function(tableCode){

    return interfaceFactory(arguments, this.constructor.name, "refreshDictionaryCach", package);

  };

  this.addTeamService = function(teamId,serviceId,basic){

    return interfaceFactory(arguments, this.constructor.name, "addTeamService", package);

  };

  this.delTeamServiceByKey = function(teamId,serviceId){

    return interfaceFactory(arguments, this.constructor.name, "delTeamServiceByKey", package);

  };

  this.getFrequencyListByTableCode = function(tableCode,ddParam,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getFrequencyListByTableCode", package);

  };

  this.addFrequencyList = function(entity){

    return interfaceFactory(arguments, this.constructor.name, "addFrequencyList", package);

  };

  this.editFrequencyList = function(entity){

    return interfaceFactory(arguments, this.constructor.name, "editFrequencyList", package);

  };

  }


  function ExternalAPIInterfactory(){

      var package = "com.zcareze.regional.service";

  this.getOssObjectPolicy = function(bucketKey){

    return interfaceFactory(arguments, this.constructor.name, "getOssObjectPolicy", package);

  };

  this.delAliyunOssAudioByKey = function(fileKey){

    return interfaceFactory(arguments, this.constructor.name, "delAliyunOssAudioByKey", package);

  };

  }


  function HealthOrderInterfactory(){

      var package = "com.zcareze.regional.service";

  this.getOrderListByResidentId = function(residentId,searchKind,searchStatus,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getOrderListByResidentId", package);

  };

  this.getInterveneOrderResultById = function(orderId){

    return interfaceFactory(arguments, this.constructor.name, "getInterveneOrderResultById", package);

  };

  this.addOrderListAndOrdMedRecipeBody = function(interveneOrderVO,ordMedRecipeBodyParam){

    return interfaceFactory(arguments, this.constructor.name, "addOrderListAndOrdMedRecipeBody", package);

  };

  this.addOrderListAndOrdHerbRecipeHead = function(interveneOrderVO,ordHerbRecipeHead,ordHerbRecipeBodyParam){

    return interfaceFactory(arguments, this.constructor.name, "addOrderListAndOrdHerbRecipeHead", package);

  };

  this.addOrderListAndOrdMonitorSuite = function(interveneOrderVO,ordMonitorSuiteParam){

    return interfaceFactory(arguments, this.constructor.name, "addOrderListAndOrdMonitorSuite", package);

  };

  this.addOrderListAndOrdTreatment = function(interveneOrderVO,ordTreatment){

    return interfaceFactory(arguments, this.constructor.name, "addOrderListAndOrdTreatment", package);

  };

  this.addOrderListAndOrdGuidance = function(interveneOrderVO,ordGuidance){

    return interfaceFactory(arguments, this.constructor.name, "addOrderListAndOrdGuidance", package);

  };

  this.addOrderListAndOrdAudio = function(interveneOrderVO,ordAudioParam){

    return interfaceFactory(arguments, this.constructor.name, "addOrderListAndOrdAudio", package);

  };

  this.addOrderListAndOrdEvaluation = function(interveneOrderVO,ordEvaluation){

    return interfaceFactory(arguments, this.constructor.name, "addOrderListAndOrdEvaluation", package);

  };

  this.addOrderListAndOrdReferral = function(interveneOrderVO,ordReferral){

    return interfaceFactory(arguments, this.constructor.name, "addOrderListAndOrdReferral", package);

  };

  this.editOrderListAndOrdMedRecipeBody = function(interveneOrderVO,ordMedRecipeBodyParam){

    return interfaceFactory(arguments, this.constructor.name, "editOrderListAndOrdMedRecipeBody", package);

  };

  this.editOrderListAndOrdHerbRecipeHead = function(interveneOrderVO,ordHerbRecipeHead,ordHerbRecipeBodyParam){

    return interfaceFactory(arguments, this.constructor.name, "editOrderListAndOrdHerbRecipeHead", package);

  };

  this.editOrderListAndOrdMonitorSuite = function(interveneOrderVO,ordMonitorSuiteParam){

    return interfaceFactory(arguments, this.constructor.name, "editOrderListAndOrdMonitorSuite", package);

  };

  this.editOrderListAndOrdTreatment = function(interveneOrderVO,ordTreatment){

    return interfaceFactory(arguments, this.constructor.name, "editOrderListAndOrdTreatment", package);

  };

  this.editOrderListAndOrdGuidance = function(interveneOrderVO,ordGuidance){

    return interfaceFactory(arguments, this.constructor.name, "editOrderListAndOrdGuidance", package);

  };

  this.editOrderListAndOrdAudio = function(interveneOrderVO,ordAudioParam,delKeys){

    return interfaceFactory(arguments, this.constructor.name, "editOrderListAndOrdAudio", package);

  };

  this.editOrderListAndOrdEvaluation = function(interveneOrderVO,ordEvaluation){

    return interfaceFactory(arguments, this.constructor.name, "editOrderListAndOrdEvaluation", package);

  };

  this.editOrderListAndOrdReferral = function(interveneOrderVO,ordReferral){

    return interfaceFactory(arguments, this.constructor.name, "editOrderListAndOrdReferral", package);

  };

  this.confirmOrderBySubmit = function(orderId){

    return interfaceFactory(arguments, this.constructor.name, "confirmOrderBySubmit", package);

  };


	/**
	 * <p>
	 * 标题：getEvaluationQaList
	 * </p>
	 * <p>
	 * 说明：居民自测根据测评ID获取测评选项
	 * </p>
	 * 
	 * @param evaId
	 *            测评ID 只支持居民端使用
	 * @return
	 */

  this.getEvaluationQaList = function(evaId){

    return interfaceFactory(arguments, this.constructor.name, "getEvaluationQaList", package);

  };


	/**
	 * <p>
	 * 标题：getOrdEvaluation
	 * </p>
	 * <p>
	 * 说明：根据指令ID获取测评任务
	 * </p>
	 * 
	 * @param orderId
	 */

  this.getOrdEvaluation = function(orderId){

    return interfaceFactory(arguments, this.constructor.name, "getOrdEvaluation", package);

  };


	/**
	 * <p>
	 * 标题：confirmOrdEvaluation
	 * </p>
	 * <p>
	 * 说明：计算测评评分
	 * </p>
	 * 
	 * @param orderId
	 *            指令ID
	 * @param evaQaAnsVOs
	 *            问题和答案
	 */

  this.confirmOrdEvaluation = function(rsdtEvaScoreParam){

    return interfaceFactory(arguments, this.constructor.name, "confirmOrdEvaluation", package);

  };


	/**
	 * <p>
	 * 标题：confirmEvaluationScore
	 * </p>
	 * <p>
	 * 说明：居民自测计算测评评分
	 * </p>
	 * 
	 * @param orderId
	 *            居民自己单独测不需要任务ID,修改为测评ID
	 * @param evaQaAnsVOs
	 *            问题和答案
	 * @return
	 */

  this.confirmEvaluationScore = function(rsdtEvaScoreParam){

    return interfaceFactory(arguments, this.constructor.name, "confirmEvaluationScore", package);

  };


	/**
	 * <p>
	 * 标题：commitEvaluation
	 * </p>
	 * <p>
	 * 说明：提交测评
	 * </p>
	 * 
	 * @param orderId
	 *            指令ID
	 * @param evaId
	 *            测评记录ID
	 * @param conclusion
	 *            有综合结论（医生提交比填）
	 */

  this.commitEvaluation = function(orderId,evaId,conclusion){

    return interfaceFactory(arguments, this.constructor.name, "commitEvaluation", package);

  };


	/**
	 * <p>
	 * 标题：getEvaluationConclus
	 * </p>
	 * <p>
	 * 说明：根据记录ID查询测评详情
	 * </p>
	 * 
	 * @param 居民测评记录Id
	 */

  this.getEvaluationConclus = function(evaLuaId){

    return interfaceFactory(arguments, this.constructor.name, "getEvaluationConclus", package);

  };


	/**
	 * <p>
	 * 标题：commitEvaConclusion
	 * </p>
	 * <p>
	 * 说明：提交测评记录综合结论
	 * </p>
	 * 
	 * @param orderId
	 * @param conclusion
	 */

  this.commitEvaConclusion = function(orderId,conclusion){

    return interfaceFactory(arguments, this.constructor.name, "commitEvaConclusion", package);

  };

  this.confirmOrderByAuditPass = function(orderId,reason){

    return interfaceFactory(arguments, this.constructor.name, "confirmOrderByAuditPass", package);

  };

  this.confirmOrderByAuditReturn = function(orderId,reason){

    return interfaceFactory(arguments, this.constructor.name, "confirmOrderByAuditReturn", package);

  };

  this.confirmOrderByPlanPass = function(orderId,reason,planTime){

    return interfaceFactory(arguments, this.constructor.name, "confirmOrderByPlanPass", package);

  };

  this.confirmOrderByPlanReturn = function(orderId,reason){

    return interfaceFactory(arguments, this.constructor.name, "confirmOrderByPlanReturn", package);

  };

  this.confirmOrderByExecutionStart = function(orderId,comment,taskId,cycleNo,timeNo){

    return interfaceFactory(arguments, this.constructor.name, "confirmOrderByExecutionStart", package);

  };

  this.confirmOrderByExecutionStop = function(orderId,reason){

    return interfaceFactory(arguments, this.constructor.name, "confirmOrderByExecutionStop", package);

  };

  this.confirmOrderByCancel = function(orderId,reason){

    return interfaceFactory(arguments, this.constructor.name, "confirmOrderByCancel", package);

  };

  this.confirmOrderByComplete = function(orderId,reason){

    return interfaceFactory(arguments, this.constructor.name, "confirmOrderByComplete", package);

  };

  this.delOrderList = function(orderId){

    return interfaceFactory(arguments, this.constructor.name, "delOrderList", package);

  };

  this.confirmOrdTreatmentByExecutionCancel = function(taskId,cycleNo,timeNo,reason){

    return interfaceFactory(arguments, this.constructor.name, "confirmOrdTreatmentByExecutionCancel", package);

  };

  this.confirmOrdReferralByPlanPass = function(orderId,planTime,reason,ordReferral){

    return interfaceFactory(arguments, this.constructor.name, "confirmOrdReferralByPlanPass", package);

  };


	/**
	 * <p>
	 * 标题：saveOrderTask
	 * </p>
	 * <p>
	 * 说明：根据指令ID生成指令任务
	 * </p>
	 * 
	 * @param orderId
	 *            指令ID
	 */

  this.saveOrderTask = function(orderId){

    return interfaceFactory(arguments, this.constructor.name, "saveOrderTask", package);

  };


	/**
	 * <p>
	 * 标题：getDoctorEvaluationListByDate
	 * </p>
	 * <p>
	 * 说明：获取医生测评
	 * </p>
	 * 
	 * @param specDate
	 *            yyyy-MM-dd
	 * @param kind
	 *            (获取类型)：0所有，1未执行，2已完成
	 * @param module
	 *            （获取模块）0需测评问卷列表，1需终评问卷列表
	 */

  this.getDoctorEvaluationListByDate = function(evaluationListParam){

    return interfaceFactory(arguments, this.constructor.name, "getDoctorEvaluationListByDate", package);

  };


	/**
	 * <p>
	 * 标题：produceOrderByResidentId
	 * </p>
	 * <p>
	 * 说明：根据居民ID生成居民给定日期任务
	 * </p>
	 * 
	 * @param residentId
	 *            居民ID
	 * @param date
	 *            给定日期
	 */

  this.produceOrderByResidentId = function(residentId,date){

    return interfaceFactory(arguments, this.constructor.name, "produceOrderByResidentId", package);

  };


	/**
	 * <p>
	 * 标题：selectOrderByResidentIdAndDate
	 * </p>
	 * <p>
	 * 说明：根据居民ID和日期，查询日期任务
	 * </p>
	 * 
	 * @param residentId
	 *            居民ID
	 * @param date
	 *            给定日期
	 */

  this.selectOrderByResidentIdAndDate = function(residentId,date){

    return interfaceFactory(arguments, this.constructor.name, "selectOrderByResidentIdAndDate", package);

  };


	/**
	 * <p>
	 * 标题：productDocotorOrderByResidentId
	 * </p>
	 * <p>
	 * 说明：生成医生给定日期任务 -- 暂时只处理3.4.7
	 * </p>
	 * 
	 * @param residentId
	 * @param date
	 */

  this.productDocotorOrderByResidentId = function(date){

    return interfaceFactory(arguments, this.constructor.name, "productDocotorOrderByResidentId", package);

  };

  this.getOrdMedRecipeBodyByMonth = function(month,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getOrdMedRecipeBodyByMonth", package);

  };

  this.addMedicinePersonalsByMonthAndPageTotal = function(month,pageTotal){

    return interfaceFactory(arguments, this.constructor.name, "addMedicinePersonalsByMonthAndPageTotal", package);

  };

  this.getOrdMedRecipeBodyByMonthAndResidentId = function(month,residentId,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getOrdMedRecipeBodyByMonthAndResidentId", package);

  };

  this.delMedicinePersonalByIds = function(ids){

    return interfaceFactory(arguments, this.constructor.name, "delMedicinePersonalByIds", package);

  };

  this.addMedicinePersonals = function(lists){

    return interfaceFactory(arguments, this.constructor.name, "addMedicinePersonals", package);

  };

  this.addMedRecipeList = function(medRecipeList){

    return interfaceFactory(arguments, this.constructor.name, "addMedRecipeList", package);

  };


	/**
	 * <p>
	 * 标题：delMedRecipeListById
	 * </p>
	 * <p>
	 * 说明：删除医生常用处方清单
	 * </p>
	 * 
	 * @param id
	 *            处方ID
	 * @return Result</br>
	 *         data=>code 是否添加(1为成功)
	 * @throws MessageException
	 */

  this.delMedRecipeListById = function(id){

    return interfaceFactory(arguments, this.constructor.name, "delMedRecipeListById", package);

  };


	/**
	 * <p>
	 * 标题：getResidentTaskByIdAndTime
	 * </p>
	 * <p>
	 * 说明：获得居民每日任务
	 * </p>
	 * 
	 * @param residentId
	 *            居民ID
	 * @param date
	 *            时间
	 */

  this.getResidentTaskByIdAndTime = function(residentId,date){

    return interfaceFactory(arguments, this.constructor.name, "getResidentTaskByIdAndTime", package);

  };

  this.chengeOrderTask = function(taskId,minutes){

    return interfaceFactory(arguments, this.constructor.name, "chengeOrderTask", package);

  };

  this.getOrderListByResidentIdAndContractId = function(residentId,contractId,termId){

    return interfaceFactory(arguments, this.constructor.name, "getOrderListByResidentIdAndContractId", package);

  };

  this.getDoctorExamOrderListByDate = function(getModule,getType,getDate,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getDoctorExamOrderListByDate", package);

  };

  this.getDoctorOrdTreatmentByDate = function(getType,getDate,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getDoctorOrdTreatmentByDate", package);

  };

  this.getDoctorOrdReferralDetail = function(orderId){

    return interfaceFactory(arguments, this.constructor.name, "getDoctorOrdReferralDetail", package);

  };

  this.addResidentPersonalMedication = function(rsdtOrdMedRecipeParam){

    return interfaceFactory(arguments, this.constructor.name, "addResidentPersonalMedication", package);

  };

  this.getRsdtMedicineChestListByResidentId = function(){

    return interfaceFactory(arguments, this.constructor.name, "getRsdtMedicineChestListByResidentId", package);

  };

  this.delResidentPersonalMedication = function(taskId){

    return interfaceFactory(arguments, this.constructor.name, "delResidentPersonalMedication", package);

  };

  this.getRsdtMedicateListByResidentId = function(startDate,endDate){

    return interfaceFactory(arguments, this.constructor.name, "getRsdtMedicateListByResidentId", package);

  };

  this.saveRsdtMedicateList = function(rsdtMedicateListParam){

    return interfaceFactory(arguments, this.constructor.name, "saveRsdtMedicateList", package);

  };

  this.getDoctorOrdReferralByDate = function(getModule,getType,getDate,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getDoctorOrdReferralByDate", package);

  };

  this.confirmOrdReferralByExecution = function(rsdtReferralListParam){

    return interfaceFactory(arguments, this.constructor.name, "confirmOrdReferralByExecution", package);

  };

  this.confirmOrdReferralByByLeaveHospital = function(rsdtReferralListParam){

    return interfaceFactory(arguments, this.constructor.name, "confirmOrdReferralByByLeaveHospital", package);

  };

  this.cancelOrdReferralExecution = function(referralId,taskId,cycleNo,timeNo,reason){

    return interfaceFactory(arguments, this.constructor.name, "cancelOrdReferralExecution", package);

  };

  }


  function OrgInterfactory(){

      var package = "com.zcareze.regional.service";

  this.getTownList = function(seach){

    return interfaceFactory(arguments, this.constructor.name, "getTownList", package);

  };

	
	/**
	 * <p>标题：getDoctorOrgListByStaffId</p>
	 * <p>说明：根据职员ID查询所属医生团队</p>
	 * @return
	 */

  this.getDoctorOrgListByStaffId = function(){

    return interfaceFactory(arguments, this.constructor.name, "getDoctorOrgListByStaffId", package);

  };

	
	/**
	 * <p>标题：getDoctorOrgList</p>
	 * <p>说明：查询职员所在机构的医生团队</p>
	 * @param staffId 可不传，默认取session
	 * @return
	 * @throws MessageException 
	 */

  this.getDoctorOrgList = function(){

    return interfaceFactory(arguments, this.constructor.name, "getDoctorOrgList", package);

  };

	
	/**
	 * <p>标题：getHelhLand</p>
	 * <p>说明：获取健康岛</p>
	 * @param selectType 选择类型（1：家庭居委会健康岛--family、2：签约医生团队健康岛--doctor、3：其他健康岛--other）
	 * @param value 传递值
	 * 			注：1、当类型为家庭时，值为居民ID
	 * 			   2、当类型为医生团队，值为空
	 * 			   3、当值为其他时，值为搜索条件
	 * @return lists[{
	 * 	id,ID
		code, 编码
		name,名称
		comment,//说明
		address,//地址
	 * }]
	 * @throws MessageException 
	 */

  this.getHelhLand = function(selectType,value){

    return interfaceFactory(arguments, this.constructor.name, "getHelhLand", package);

  };

	
	/**
	 * <p>标题：getotherLand</p>
	 * <p>说明：获取外部健康岛</p>
	 * @return
	 */

  this.getotherLand = function(){

    return interfaceFactory(arguments, this.constructor.name, "getotherLand", package);

  };

  this.getStaffListByOrgId = function(){

    return interfaceFactory(arguments, this.constructor.name, "getStaffListByOrgId", package);

  };

	
	/**
	 * <p>标题：getSignOrgListIsLandByStaffId</p>
	 * <p>说明：根据职员ID获取签约点</p>
	 * @param staffId
	 * @return
	 */

  this.getSignOrgListIsLandByStaffId = function(orgListId){

    return interfaceFactory(arguments, this.constructor.name, "getSignOrgListIsLandByStaffId", package);

  };

	/**
	 * <p>标题：getStaffListByStaffId</p>
	 * <p>说明：医生个人资料详情</p>
	 * @param staffId	可以不传入
	 * @return
	 * @throws MessageException
	 */

  this.getStaffListByStaffId = function(staffId){

    return interfaceFactory(arguments, this.constructor.name, "getStaffListByStaffId", package);

  };

	/**
	 * <p>标题：editStaffListByStaffId</p>
	 * <p>说明：编辑医生个人资料(当前修改只支持照片,简介,专长.一次传一个信息)</p>
	 * @param staffList
	 * @return
	 * @throws MessageException
	 */

  this.editStaffListByStaffId = function(staffList){

    return interfaceFactory(arguments, this.constructor.name, "editStaffListByStaffId", package);

  };

	/**
	 * <p>标题：getStaffListByTeamAndTeamId</p>
	 * <p>说明：根据当前医生团队ID获取医生团队成员</p>
	 * @param teamId	医生团队ID
	 * lists 为当前团队下所有医生的简介(包括所属机构orgName)</br>
	 * serviceLists 为当前团队的所有服务</br>
	 * @return
	 * @throws MessageException
	 */

  this.getStaffListByTeamAndTeamId = function(teamId){

    return interfaceFactory(arguments, this.constructor.name, "getStaffListByTeamAndTeamId", package);

  };

	
	/**
	 * <p>标题：seHealhByCloudAndStaffId</p>
	 * <p>说明：根据职员ID和区域云ID查询该只是是否拥有健康助理身份</p>
	 * @param staffId 职员ID
	 * @param cloudId 区域云ID
	 * @return 不是健康助理身份就是医生身份
	 * @throws MessageException 
	 */

  this.seHealhByCloudAndStaffId = function(staffId,cloudId){

    return interfaceFactory(arguments, this.constructor.name, "seHealhByCloudAndStaffId", package);

  };

	
	/**
	 * <p>标题：seOrgById</p>
	 * <p>说明：根据组织ID查询组织</p>
	 * @param id 组织ID
	 * @return
	 * @throws MessageException 
	 */

  this.seOrgById = function(id){

    return interfaceFactory(arguments, this.constructor.name, "seOrgById", package);

  };

  this.getDoctorOrgLists = function(isLands){

    return interfaceFactory(arguments, this.constructor.name, "getDoctorOrgLists", package);

  };

	
	/**
	 * <p>标题：seOrgByStaffId</p>
	 * <p>说明：根据职员ID查询所属组织</p>
	 * @param staffId 可不传，默认从session取
	 * @return
	 * @throws MessageException 
	 */

  this.seOrgByStaffId = function(staffId){

    return interfaceFactory(arguments, this.constructor.name, "seOrgByStaffId", package);

  };

	
	/**
	 * <p>标题：seStaffById</p>
	 * <p>说明：根据职员ID查询职员信息</p>
	 * @param staffId 可不传，默认从session取
	 * @return
	 * @throws MessageException 
	 */

  this.seStaffById = function(staffId){

    return interfaceFactory(arguments, this.constructor.name, "seStaffById", package);

  };

	
	/**
	 * <p>标题：getStaffListByTeamId</p>
	 * <p>说明：获取医生团队下面的医生</p>
	 * @return
	 */

  this.getStaffListByTeamId = function(teamId){

    return interfaceFactory(arguments, this.constructor.name, "getStaffListByTeamId", package);

  };

	
	/**
	 * <p>标题：seTownById</p>
	 * <p>说明：根据街道乡镇ID获取街道乡镇</p>
	 * @param townId
	 * @return
	 * @throws MessageException 
	 */

  this.seTownById = function(townId){

    return interfaceFactory(arguments, this.constructor.name, "seTownById", package);

  };

	
	/**
	 * <p>标题：seOrgListAndIsland</p>
	 * <p>说明：获取职员所属组织的健康岛</p>
	 * @return
	 * @throws MessageException 
	 */

  this.seOrgListAndIsland = function(){

    return interfaceFactory(arguments, this.constructor.name, "seOrgListAndIsland", package);

  };

	
	/**
	 * <p>标题：seOrgMemberByorgId</p>
	 * <p>说明：根据组织ID获取组织下的成员</p>
	 * @param orgId 组织ID
	 * @return
	 */

  this.seOrgMemberByorgId = function(orgId){

    return interfaceFactory(arguments, this.constructor.name, "seOrgMemberByorgId", package);

  };

  this.getOrgListAndIslandByCloudId = function(){

    return interfaceFactory(arguments, this.constructor.name, "getOrgListAndIslandByCloudId", package);

  };

  this.getOrgListByParentIdAndPage = function(parentId,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getOrgListByParentIdAndPage", package);

  };

	
	/**
	 * <p>标题：addOrgList</p>
	 * <p>说明：后台添加组织机构</p>
	 * @param orgListParam
	 * @return
	 */

  this.addOrgList = function(orgListParam){

    return interfaceFactory(arguments, this.constructor.name, "addOrgList", package);

  };

	
	/**
	 * <p>标题：editOrgList</p>
	 * <p>说明：根据组织机构ID修改组织机构</p>
	 * @param orgListParam
	 * @return
	 */

  this.editOrgList = function(orgListParam){

    return interfaceFactory(arguments, this.constructor.name, "editOrgList", package);

  };

	
	/**
	 * <p>标题：getOrgListById</p>
	 * <p>说明：根据组织ID组织</p>
	 * @param orgId
	 * @return
	 */

  this.getOrgListById = function(orgId){

    return interfaceFactory(arguments, this.constructor.name, "getOrgListById", package);

  };

	
	/**
	 * <p>标题：getOrgListByParentId</p>
	 * <p>说明：根据父级ID查询组织目录</p>
	 * 1、获取第一级parentId 为空
	 * @return
	 */

  this.getOrgListByParentId = function(parnetId){

    return interfaceFactory(arguments, this.constructor.name, "getOrgListByParentId", package);

  };

	
	/**
	 * <p>标题：addStaffList</p>
	 * <p>说明：添加组织成员(包含成员所属组织)</p>
	 * @param staffListParam
	 * @return
	 */

  this.addStaffList = function(staffListParam){

    return interfaceFactory(arguments, this.constructor.name, "addStaffList", package);

  };

	
	/**
	 * <p>标题：getStaffListById</p>
	 * <p>说明：根据职员ID获取职员</p>
	 * @param staffId
	 * @return
	 */

  this.getStaffListById = function(staffId){

    return interfaceFactory(arguments, this.constructor.name, "getStaffListById", package);

  };

	
	/**
	 * <p>标题：editStaffList</p>
	 * <p>说明：修改组织成员</p>
	 * @param staffListParam
	 * @return
	 */

  this.editStaffList = function(staffListParam){

    return interfaceFactory(arguments, this.constructor.name, "editStaffList", package);

  };

	
	/**
	 * <p>标题：getStaffListBgByOrgId</p>
	 * <p>说明：根据组织ID查询该组织下面的成员</p>
	 * @param orgId
	 * @return
	 */

  this.getStaffListBgByOrgId = function(orgId,pageNow,pageSize,search){

    return interfaceFactory(arguments, this.constructor.name, "getStaffListBgByOrgId", package);

  };

	
	/**
	 * <p>标题：getStaffClassByStaffId</p>
	 * <p>说明：根据成员ID获取工作种类</p>
	 * @param staffId
	 * @return
	 */

  this.getStaffClassByStaffId = function(staffId){

    return interfaceFactory(arguments, this.constructor.name, "getStaffClassByStaffId", package);

  };

	
	/**
	 * <p>标题：addStaffClass</p>
	 * <p>说明：添加职员工作种类</p>
	 * @param staffClassParam
	 * @return
	 */

  this.addStaffClass = function(staffClassParam){

    return interfaceFactory(arguments, this.constructor.name, "addStaffClass", package);

  };

	
	/**
	 * <p>标题：editStaffClass</p>
	 * <p>说明：编辑职员工作种类</p>
	 * @param staffClassParam
	 * @return
	 */

  this.editStaffClass = function(staffClassParam){

    return interfaceFactory(arguments, this.constructor.name, "editStaffClass", package);

  };

	
	/**
	 * <p>标题：getStaffList</p>
	 * <p>说明：获取职员列表支持搜索</p>
	 * @param pageNow 当前页码 起始值为0
	 * @param pageSize 页面大小
	 * @param sreach 搜索条件（支持名称，简码）
	 * @return
	 */

  this.getStaffList = function(pageNow,pageSize,sreach){

    return interfaceFactory(arguments, this.constructor.name, "getStaffList", package);

  };

	
	/**
	 * <p>标题：deleteStaffClass</p>
	 * <p>说明：删除职员工作种类</p>
	 * @param staffId
	 * @param classCode
	 * @return
	 */

  this.deleteStaffClass = function(staffId,classCode){

    return interfaceFactory(arguments, this.constructor.name, "deleteStaffClass", package);

  };

	
	/**
	 * <p>标题：deleteOrgMember</p>
	 * <p>说明：删除组织成员</p>
	 * @param orgId
	 * @param staffId
	 * @return
	 */

  this.deleteOrgMember = function(orgId,staffId){

    return interfaceFactory(arguments, this.constructor.name, "deleteOrgMember", package);

  };

	
	/**
	 * <p>标题：addStaffMember</p>
	 * <p>说明：添加部门或者机构职员</p>
	 * @return
	 */

  this.addStaffMember = function(memberParam){

    return interfaceFactory(arguments, this.constructor.name, "addStaffMember", package);

  };

  this.addTeamTrustIsland = function(teamTrustIsland){

    return interfaceFactory(arguments, this.constructor.name, "addTeamTrustIsland", package);

  };

  this.delTeamTrustIslandByTeamIdAndIslandId = function(teamId,islandId){

    return interfaceFactory(arguments, this.constructor.name, "delTeamTrustIslandByTeamIdAndIslandId", package);

  };

  this.getTeamTrustIslandByTeamId = function(teamId){

    return interfaceFactory(arguments, this.constructor.name, "getTeamTrustIslandByTeamId", package);

  };

	/**
	 * <p>标题：refreshCacheByCloudId</p>
	 * <p>说明：刷新区域缓存</p>
	 */

  this.refreshCacheByCloudId = function(){

    return interfaceFactory(arguments, this.constructor.name, "refreshCacheByCloudId", package);

  };

	/**
	 * <p>标题：getCommunityListByParentIdAndPage</p>
	 * <p>说明：获取社区目录</p>
	 * @param parentId
	 * @param pageNow
	 * @param pageSize
	 * @return
	 */

  this.getCommunityListByParentIdAndPage = function(parentId,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getCommunityListByParentIdAndPage", package);

  };


	/**
	 * <p>标题：getCommunityListById</p>
	 * <p>说明：根据主键获取社区目录</p>
	 * @param communityId
	 * @return
	 */

  this.getCommunityListById = function(communityId){

    return interfaceFactory(arguments, this.constructor.name, "getCommunityListById", package);

  };


	/**
	 * <p>标题：addCommunity</p>
	 * <p>说明：添加社区目录</p>
	 * @param community
	 * @return
	 */

  this.addCommunity = function(community){

    return interfaceFactory(arguments, this.constructor.name, "addCommunity", package);

  };


	/**
	 * <p>标题：editCommunity</p>
	 * <p>说明：编辑社区目录</p>
	 * @param community
	 * @return
	 */

  this.editCommunity = function(community){

    return interfaceFactory(arguments, this.constructor.name, "editCommunity", package);

  };


	/**
	 * <p>标题：delCommunityById</p>
	 * <p>说明：删除当前社区目录</p>
	 * @param communityId
	 * @return
	 */

  this.delCommunityById = function(communityId){

    return interfaceFactory(arguments, this.constructor.name, "delCommunityById", package);

  };

  }


  function ResidentContractInterfactory(){

      var package = "com.zcareze.regional.service";

  this.getResidentContractOverviewList = function(rangeNo,seach,contractStatus,signScope,experts,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getResidentContractOverviewList", package);

  };

  this.getContractServiceList = function(){

    return interfaceFactory(arguments, this.constructor.name, "getContractServiceList", package);

  };

  this.getResidentContractServiceDetail = function(rsdtContractOverviewId){

    return interfaceFactory(arguments, this.constructor.name, "getResidentContractServiceDetail", package);

  };

  this.addResidentContractService = function(rsdtContractParam){

    return interfaceFactory(arguments, this.constructor.name, "addResidentContractService", package);

  };

  this.addResidentContractBySlave = function(primaryId,contractServiceParam){

    return interfaceFactory(arguments, this.constructor.name, "addResidentContractBySlave", package);

  };

  this.addResidentContractByMasterContinue = function(primaryId,amount){

    return interfaceFactory(arguments, this.constructor.name, "addResidentContractByMasterContinue", package);

  };

  this.confirmResidentContractByDoctor = function(rsdtContractListId,doctorMobile,doctorPassword){

    return interfaceFactory(arguments, this.constructor.name, "confirmResidentContractByDoctor", package);

  };

  this.delResidentContractByDoctor = function(rsdtContractListId){

    return interfaceFactory(arguments, this.constructor.name, "delResidentContractByDoctor", package);

  };

  this.cancelResidentContractByDoctor = function(rsdtContractListId){

    return interfaceFactory(arguments, this.constructor.name, "cancelResidentContractByDoctor", package);

  };

  this.addRsdtContractChange = function(rsdtDoctorChangeDomain){

    return interfaceFactory(arguments, this.constructor.name, "addRsdtContractChange", package);

  };

  this.checkAddBaseContractService = function(residentId,effectiveDate){

    return interfaceFactory(arguments, this.constructor.name, "checkAddBaseContractService", package);

  };

  this.editRsdtContractTask = function(rsdtContractTaskParam){

    return interfaceFactory(arguments, this.constructor.name, "editRsdtContractTask", package);

  };

  this.getRsdtContractOverviewListByTeamId = function(teamId,searchKey,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getRsdtContractOverviewListByTeamId", package);

  };

  this.getRsdtContractDetailByContractOverviewId = function(rsdtContractOverviewId){

    return interfaceFactory(arguments, this.constructor.name, "getRsdtContractDetailByContractOverviewId", package);

  };


	/**
	 * <p>
	 * 标题：changeContractOverview
	 * </p>
	 * <p>
	 * 说明：授权外部健康岛
	 * </p>
	 * 
	 * @param contractId
	 *            合同ID
	 * @param islandid
	 *            更改后的健康岛ID
	 * @return Result data=>code 是否添加(1为成功)
	 * @throws MessageException
	 */

  this.changeContractOverview = function(contractId,islandid){

    return interfaceFactory(arguments, this.constructor.name, "changeContractOverview", package);

  };

  this.getRsdtContractDetailByResidentId = function(residentId){

    return interfaceFactory(arguments, this.constructor.name, "getRsdtContractDetailByResidentId", package);

  };

  this.getRsdtContractStatistics = function(){

    return interfaceFactory(arguments, this.constructor.name, "getRsdtContractStatistics", package);

  };

  this.getContractRsdtListByTeamIdAndDate = function(getType,startDate,endDate,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getContractRsdtListByTeamIdAndDate", package);

  };

  this.getResidentOverviewByPrimaryId = function(primaryId){

    return interfaceFactory(arguments, this.constructor.name, "getResidentOverviewByPrimaryId", package);

  };

  this.getRsdtContractAndChangeListByPrimaryId = function(primaryId){

    return interfaceFactory(arguments, this.constructor.name, "getRsdtContractAndChangeListByPrimaryId", package);

  };

  this.getRsdtContractServiceTaskByContractId = function(contractId){

    return interfaceFactory(arguments, this.constructor.name, "getRsdtContractServiceTaskByContractId", package);

  };

  this.getRsdtContractAppointServiceByResidentId = function(residentId,contractId){

    return interfaceFactory(arguments, this.constructor.name, "getRsdtContractAppointServiceByResidentId", package);

  };

	/**
	 * <p>
	 * 标题：cancelIslandAuthority
	 * </p>
	 * <p>
	 * 说明：收回健康岛授权
	 * </p>
	 * 
	 * @param primaryId
	 *            主合同ID（居民签约概况ID）
	 * @param comment
	 *            收回健康岛说明.可选参数
	 * @return
	 * @throws MessageException
	 */

  this.cancelIslandAuthority = function(primaryId,comment){

    return interfaceFactory(arguments, this.constructor.name, "cancelIslandAuthority", package);

  };

  }


  function ResidentHealthInterfactory(){

      var package = "com.zcareze.regional.service";

  this.addRsdtMonitor = function(rsdtMonitor,rsdtMonitorDetailParam){

    return interfaceFactory(arguments, this.constructor.name, "addRsdtMonitor", package);

  };

  this.addBatchRsdtMonitor = function(rsdtMonitorListParam){

    return interfaceFactory(arguments, this.constructor.name, "addBatchRsdtMonitor", package);

  };

  this.getBatchRsdtMonitor = function(startDate,endDate,suiteId){

    return interfaceFactory(arguments, this.constructor.name, "getBatchRsdtMonitor", package);

  };


	/**
	 * <p>
	 * 标题：checkResidentFocusValue
	 * </p>
	 * <p>
	 * 说明：审视重点关注指标
	 * </p>
	 * 
	 * @param residentId
	 * @param itemId
	 */

  this.checkResidentFocusValue = function(residentId,itemIds){

    return interfaceFactory(arguments, this.constructor.name, "checkResidentFocusValue", package);

  };


	/**
	 * <p>
	 * 标题：cancelResidentFocusValue
	 * </p>
	 * <p>
	 * 说明：取消审视重点关注指标
	 * </p>
	 * 
	 * @param residentId
	 * @param itemIds
	 */

  this.cancelResidentFocusValue = function(residentId,itemIds){

    return interfaceFactory(arguments, this.constructor.name, "cancelResidentFocusValue", package);

  };


	/**
	 * <p>
	 * 标题：getRsdtMonitorListByResidentId
	 * </p>
	 * <p>
	 * 说明：根据居民ID获取居民监测记录
	 * </p>
	 * 
	 * @param residentId
	 *            居民ID
	 * @return RsdtMonitorListResult lists 居民监测记录列表
	 */

  this.getRsdtMonitorListByResidentId = function(residentId){

    return interfaceFactory(arguments, this.constructor.name, "getRsdtMonitorListByResidentId", package);

  };

	/**
	 * <p>标题：addRsdtAssess</p>
	 * <p>说明：添加健康评估记录</p>
	 * @param assessList	(residentId=>居民ID必传,termFrom=>开始日期必传,截止日期=>选传,默认开始日期+1天)
	 * @return
	 */

  this.addRsdtAssess = function(assessList){

    return interfaceFactory(arguments, this.constructor.name, "addRsdtAssess", package);

  };

	/**
	 * <p>标题：saveRsdtAssessProblem</p>
	 * <p>说明：保存健康问题评估</p>
	 * @param assessProblem(必传参数:assessId=>健康评估记录ID,problemName=>健康问题名称;adscript=>补充说明;dealGrade=>等级。)<br>
	 * 选传参数:priority=>顺序传入当前选择的健康问题的顺序号,为空表示调整的最后一位<br>
	 * 修改时必传参数:id=>当前健康问题评估的ID;evidence=>变更依据
	 * @return
	 */

  this.saveRsdtAssessProblem = function(assessProblem){

    return interfaceFactory(arguments, this.constructor.name, "saveRsdtAssessProblem", package);

  };

	/**
	 * <p>标题：confirmRsdtAssessByComplete</p>
	 * <p>说明：健康评估-完成</p>
	 * @param assessId		健康评估ID
	 * @return
	 */

  this.confirmRsdtAssessByComplete = function(assessId){

    return interfaceFactory(arguments, this.constructor.name, "confirmRsdtAssessByComplete", package);

  };

	/**
	 * <p>标题：confirmRsdtAssessByCancel</p>
	 * <p>说明：健康评估-取消</p>
	 * @param assessId		健康评估ID
	 * @return
	 */

  this.confirmRsdtAssessByCancel = function(assessId){

    return interfaceFactory(arguments, this.constructor.name, "confirmRsdtAssessByCancel", package);

  };

	/**
	 * <p>标题：getRsdtAssessProblem</p>
	 * <p>说明：获取最近的分批号健康问题评估</p>
	 * @param assessId		健康评估ID(传入评估ID,表示获取当前评估的健康评估问题)->两个参数必须传入一个
	 * @param residentId	居民ID(传入居民ID表示查看当前居民最新的健康评估问题)
	 * @return
	 */

  this.getRsdtAssessProblem = function(assessId,residentId){

    return interfaceFactory(arguments, this.constructor.name, "getRsdtAssessProblem", package);

  };

	/**
	 * <p>标题：addRsdtProblem</p>
	 * <p>说明：保存补充健康问题</p>
	 * @param assessProblem (必传参数:assessId=>健康评估记录ID,problemName=>健康问题名称;adscript=>补充说明;dealGrade=>等级。)<br>
	 * 选传参数:priority=>顺序传入当前选择的健康问题的顺序号,为空表示调整的最后一位<br>
	 * 修改时必传参数:id=>当前健康问题评估的ID;evidence=>变更依据
	 * @return
	 */

  this.addRsdtProblem = function(assessProblem){

    return interfaceFactory(arguments, this.constructor.name, "addRsdtProblem", package);

  };

	/**
	 * <p>标题：getHealthManageByResidentId</p>
	 * <p>说明：获取健康管理列表</p>
	 * @param residentId	居民ID
	 * @param pageNow 		当前页码(0开始)
	 * @param pageSize 		页码大小(每页展示总条数)
	 * @return
	 */

  this.getHealthManageByResidentId = function(residentId,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getHealthManageByResidentId", package);

  };

	/**
	 * <p>
	 * 标题：getRsdtProblemListNotClosedByResidentId
	 * </p>
	 * <p>
	 * 说明：根据居民ID获取当前健康问题列表
	 * </p>
	 * 
	 * @param residentId
	 *            居民ID
	 * @param pageNow
	 *            当前页码 从0开始
	 * @param pageSize
	 *            分页大小
	 * @return RsdtProblemListResult</br>
	 *         lists 当前健康问题列表
	 */

  this.getRsdtProblemListNotClosedByResidentId = function(residentId,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getRsdtProblemListNotClosedByResidentId", package);

  };

	/**
	 * <p>标题：closeRsdtAssessProblem</p>
	 * <p>说明：关闭当前健康评估问题</p>
	 * @param assessProblemId	评估问题ID
	 * @param evidence			变更依据
	 * @return
	 */

  this.closeRsdtAssessProblem = function(assessProblemId,evidence){

    return interfaceFactory(arguments, this.constructor.name, "closeRsdtAssessProblem", package);

  };

  this.getOrderHealthByDate = function(residentId,date){

    return interfaceFactory(arguments, this.constructor.name, "getOrderHealthByDate", package);

  };


	/**
	 * <p>
	 * 标题：getOrderValueByDate
	 * </p>
	 * <p>
	 * 说明：获取居民指定日期的健康指导,语音指导的健康事物,并重新组装对象
	 * </p>
	 * 
	 * @param residentId
	 *            居民ID
	 * @param date
	 *            指定日期
	 * @return
	 * @throws MessageException
	 */

  this.getOrderValueByDate = function(residentId,date){

    return interfaceFactory(arguments, this.constructor.name, "getOrderValueByDate", package);

  };


	/**
	 * <p>
	 * 标题：getRsdtMonitorDetailByResidentIdAndItemIdGroupByAcceptTime
	 * </p>
	 * <p>
	 * 说明：根据日期分组获取当前居民指标项目的检测详情(监测详细记录)
	 * </p>
	 * 
	 * @param residentId
	 *            居民ID
	 * @param itemId[]
	 *            指标项目ID(血压时传入两个ID)
	 * @param pageNow
	 *            当前页码(从0开始)
	 * @param pageSize
	 *            页码大小
	 * @return
	 * @throws MessageException
	 */

  this.getRsdtMonitorDetailByResidentId = function(residentId){

    return interfaceFactory(arguments, this.constructor.name, "getRsdtMonitorDetailByResidentId", package);

  };

  this.getRsdtMonitorDetailByResidentIdAndItemId = function(residentId,itemId,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getRsdtMonitorDetailByResidentIdAndItemId", package);

  };


	/**
	 * <p>
	 * 标题：getRsdtMonitorDetailJSONByResidentIdAndItemId
	 * </p>
	 * <p>
	 * 说明：查询居民指标项目的检测详情(数据表左右滑动)
	 * </p>
	 * 
	 * @param residentId
	 *            居民ID
	 * @param itemId[]
	 *            指标项目ID(血压时传入两个ID)
	 * @param pageNow
	 *            当前页码(从0开始)
	 * @param pageSize
	 *            页码大小
	 * @return
	 * @throws MessageException
	 */

  this.getRsdtMonitorDetailJSONByResidentIdAndItemId = function(residentId,itemId,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getRsdtMonitorDetailJSONByResidentIdAndItemId", package);

  };

  this.getRsdtMonitorDetailByResidentIdAndItemIdGroupByAcceptTime = function(residentId,itemId,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getRsdtMonitorDetailByResidentIdAndItemIdGroupByAcceptTime", package);

  };

  this.getRsdtMonitorDetailByResidentIdAndItemIdAndTimes = function(residentId,itemIds,beginDate,endDate,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getRsdtMonitorDetailByResidentIdAndItemIdAndTimes", package);

  };


	/**
	 * <p>
	 * 标题：countRsdtMonitorByResIdAndItemIdAndAccTime
	 * </p>
	 * <p>
	 * 说明：统计 共检测次数 正常次数,偏高次数,偏低次数,最高值,最低值
	 * </p>
	 * 
	 * @param residentId
	 *            居民ID
	 * @param itemId
	 *            指标项目ID
	 * @param beginDate
	 *            指定开始日期(开始日期可以不传入)
	 * @param endDate
	 *            指定结束日期(结束日期可以不传入)
	 * @return
	 * @throws MessageException
	 */

  this.countRsdtMonitorByResIdAndItemIdAndAccTime = function(residentId,itemId,beginDate,endDate){

    return interfaceFactory(arguments, this.constructor.name, "countRsdtMonitorByResIdAndItemIdAndAccTime", package);

  };


	/**
	 * <p>
	 * 标题：getRsdtMonitorDetailJSONByResIdAndItemId
	 * </p>
	 * <p>
	 * 说明：查询居民指标项目的检测详情(数据表左右滑动)
	 * </p>
	 * 
	 * @param residentId
	 *            居民ID
	 * @param itemId[]
	 *            指标项目ID(血压时传入两个ID)
	 * @param beginDate
	 *            指定开始日期(开始日期可以不传入)
	 * @param endDate
	 *            指定结束日期(结束日期可以不传入)
	 * @param pageNow
	 *            当前页码(从0开始)
	 * @param pageSize
	 *            页码大小
	 * @return
	 * @throws MessageException
	 */

  this.getRsdtMonitorDetailJSONByResIdAndItemId = function(residentId,itemId,beginDate,endDate,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getRsdtMonitorDetailJSONByResIdAndItemId", package);

  };

  this.getRsdtOrderTaskDetail = function(orderType,orderId,seqNo){

    return interfaceFactory(arguments, this.constructor.name, "getRsdtOrderTaskDetail", package);

  };


	/**
	 * <p>
	 * 标题：getFocusMonitorResidentList
	 * </p>
	 * <p>
	 * 说明：获取重点监测审查居民列表
	 * </p>
	 * 
	 * @param pageNow
	 *            当前页码
	 * @param pageSize
	 *            页码大小
	 * @return
	 * @throws MessageException
	 */

  this.getFocusMonitorResidentList = function(pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getFocusMonitorResidentList", package);

  };

  }


  function ResidentInterfactory(){

      var package = "com.zcareze.regional.service";

	/**
	 * <p>标题：getOrgResidentList</p>
	 * <p>说明：查询居民信息</p>
	 * @param seach		查询关键字
	 * @param status	档案状态(0-注册;1-正常;2-封锁)
	 * @param pageNow	当前页码(从0开始)
	 * @param pageSize	页码大小
	 * @return ResidentListResult
	 * 	<p>lists		组织机构居民信息(List => ResidentListDomain)可能为空</p>
	 * @throws MessageException 
	 */

  this.getOrgResidentList = function(seach,status,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getOrgResidentList", package);

  };

	/**
	 * <p>标题：getResidentDetailsNotFamily</p>
	 * <p>说明：获取居民详情(居大夫)</p>
	 * @param id	居民详情ID
	 * @return
	 * 	<p>one						居民详细信息(ResidentListDomain)</p>
	 * 	<p>familyListDomain			居民家庭详细信息(FamilyListDomain)</p>
	 * 	<p>residentAllergyDomains	居民过敏史(List[ResidentAllergyDomain])</p>
	 *  <p>exposurehistorys	    	暴露史(List[ResidentPmhDomain])</p>
	 * 	<p>residentPmhDomains		居民既往史(List[ResidentPmhDomain])</p>
	 *  <p>familyHistorys			家族史(List[ResidentPmhDomain])</p>
	 *  <p>geneticDiseases			遗传病史(List[ResidentPmhDomain])</p>
	 *  <p>disabilitys 				残疾情况(List[ResidentPmhDomain])</p>
	 * @throws MessageException 
	 */

  this.getResidentDetails = function(id){

    return interfaceFactory(arguments, this.constructor.name, "getResidentDetails", package);

  };

	
	/**
	 * <p>标题：addResidentFocusItems</p>
	 * <p>说明：添加居民重点关注指标</p>
	 * @param residentFocusItemsParam
	 */

  this.addResident = function(residentListDomain){

    return interfaceFactory(arguments, this.constructor.name, "addResident", package);

  };

	/**
	 * <p>标题：addResidentFamily</p>
	 * <p>说明：添加户主信息</p>
	 * @param residentListParam
	 * 	<p>familyListDomain			家庭详情 (新建家庭必须传入居委会ID,家庭地址[FamilyListDomain])</p>
	 * 	<p>residentListDomain		居民个人资料信息(ResidentListDomain)</p>
	 * @return data=>code  是否添加(1为成功)
	 * @throws MessageException 
	 */

  this.addResidentFamily = function(residentListParam){

    return interfaceFactory(arguments, this.constructor.name, "addResidentFamily", package);

  };

	
	/**
	 * <p>标题：editResidentFocusItems</p>
	 * <p>说明：修改居民重点关注指标</p>
	 * @param residentFocusItemsParam
	 * @return
	 */

  this.editResident = function(residentListDomain){

    return interfaceFactory(arguments, this.constructor.name, "editResident", package);

  };

	/**
	 * <p>标题：editPayType</p>
	 * <p>说明：更新医疗付款方式</p>
	 * @param residentId			当前用户的档案ID
	 * @param payModes				付款方式:多项合并分号分隔存储
	 * @return data=>code  是否添加(1为成功)
	 * @throws MessageException 
	 */

  this.editPayType = function(residentId,payModes){

    return interfaceFactory(arguments, this.constructor.name, "editPayType", package);

  };

	/**
	 * <p>标题：changeResidentOpenGrade</p>
	 * <p>说明：更改档案开放度</p>
	 * @param residentId			当前用户的档案ID
	 * @param openGrade				开放度:0-不开放;1-家庭内开放
	 * @return data=>code  是否成功(1为成功)
	 */

  this.changeResident = function(residentId){

    return interfaceFactory(arguments, this.constructor.name, "changeResident", package);

  };

	/**
	 * <p>标题：getFamilyList</p>
	 * <p>说明：根据居委会ID获取家庭信息</p>
	 * @param districtId			居委会ID
	 * @param seach					搜索内容(户主名字) 可选参数
	 * @return
	 * 		  <p>lists					家庭信息(List[FamilyListDomain])</p>
	 * @throws MessageException 
	 */

  this.getFamilyList = function(districtId,seach){

    return interfaceFactory(arguments, this.constructor.name, "getFamilyList", package);

  };


	/**
	 * <p>标题：saveResidentAllergs</p>
	 * <p>说明：保存居民过敏史</p>
	 * @param residentAllergyParam
	 *  <p>lists					居民过敏史(List[kindCode--过敏源code , content--说明 ,  pharmic--是否是药物, id--修改时的主键ID, 添加不传入])</p>
	 * @param residentId			当前居民ID
	 * @return data=>code  是否添加成功(1为成功)
	 * @throws MessageException 
	 */

  this.saveResidentAllergs = function(residentAllergyParam,residentId){

    return interfaceFactory(arguments, this.constructor.name, "saveResidentAllergs", package);

  };

	
	/**
	 * <p>标题：saveExposureHistory</p>
	 * <p>说明：保存暴露史</p>
	 * @param residentPmhParam
	 *  <p>lists					居民暴露史(List[recordCode--内容码 ,adscript--补充文本 ,id--修改时的主键ID,添加不传入])</p>
	 * @param residentId			当前居民ID
	 * @return data=>code  是否添加成功(1为成功)
	 * @throws MessageException
	 */

  this.saveExposureHistory = function(residentPmhParam,residentId){

    return interfaceFactory(arguments, this.constructor.name, "saveExposureHistory", package);

  };

	
	/**
	 * <p>标题：savePreviousHistory</p>
	 * <p>说明：保存既往史[疾病史,手术史,外伤史,输血史]</p>
	 * @param residentPmhParam
	 *  <p>lists					居民既往史(List[kindCode--字典表中的分类,输入上面四种类型的code来源于字典表pmh_kind, occurDate--发生日期, recordName--名称, adscript--补充文本, id--修改时的主键ID,添加不传入])</p>
	 * @param residentId			当前居民ID
	 * @return data=>code  是否添加成功(1为成功)
	 * @throws MessageException
	 */

  this.savePreviousHistory = function(residentPmhParam,residentId){

    return interfaceFactory(arguments, this.constructor.name, "savePreviousHistory", package);

  };

	/**
	 * <p>标题：saveFamilyHistory</p>
	 * <p>说明：保存家族史接口[家族史,遗传史]</p>
	 *  <p>lists					家族史(List[ResidentPmhDomain] </p>
	 *  家族史
	 *  <p>[kindCode--字典表中的分类,输入上面两种类型的code来源于字典表pmh_kind, kindAdscript--家族史记录时;需要补充记录的父亲;母亲;兄弟姐妹;子女, recordCode--家族病code, adscript--补充文本, id--修改时的主键ID,添加不传入)</p>
	 *
	 *  遗传史
	 *  <p>[kindCode--字典表中的分类,输入上面两种类型的code来源于字典表pmh_kind, recordName--遗传病史, id--修改时的主键ID,添加不传入)</p>
	 * @param residentId			当前居民ID
	 * @return data=>code  是否添加成功(1为成功)
	 * @throws MessageException
	 */

  this.saveFamilyHistory = function(residentPmhParam,residentId){

    return interfaceFactory(arguments, this.constructor.name, "saveFamilyHistory", package);

  };

	
	/**
	 * <p>标题：saveDisabilitySituation</p>
	 * <p>说明：保存残疾情况</p>
	 * @param residentPmhParam
	 *  <p>lists					居民残疾情况(List[recordCode--内容码, adscript--补充文本, id--修改时的主键ID,添加不传入])</p>
	 * @param residentId			当前居民ID
	 * @return data=>code  是否添加成功(1为成功)
	 * @throws MessageException
	 */

  this.saveDisabilitySituation = function(residentPmhParam,residentId){

    return interfaceFactory(arguments, this.constructor.name, "saveDisabilitySituation", package);

  };

	
	/**
	 * <p>标题：changeRaisingFamily</p>
	 * <p>说明：独立成家-把用户单独成立为一个家庭(注:当前用户为之前家庭的户主的时候不能独立成家,需先更改之前用户的户主)</p>
	 * @param familyListDomain		家庭信息(FamilyListDomain)新建家庭必须传入居委会ID,设备数量,家庭地址
	 * @param residentId			当前用户档案ID
	 * @return data=>code  是否成功(1为成功)
	 * @throws MessageException 
	 */

  this.changeRaisingFamily = function(familyListDomain,residentId){

    return interfaceFactory(arguments, this.constructor.name, "changeRaisingFamily", package);

  };

	/**
	 * <p>标题：changeFamily</p>
	 * <p>说明：更改用户家庭</p>
	 * @param familyId				更改后家庭ID
	 * @param residentId			当前用户档案ID
	 * @param relationship			与户主关系
	 * @return data=>code  是否成功(1为成功)
	 * @throws MessageException 
	 */

  this.changeFamily = function(familyId,residentId,relationship){

    return interfaceFactory(arguments, this.constructor.name, "changeFamily", package);

  };

	/**
	 * <p>标题：changeHouseholder</p>
	 * <p>说明：重设户主</p>
	 * @param residentId			当前用户的档案ID
	 * @return data=>code  是否成功(1为成功)
	 * @throws MessageException 
	 */

  this.changeHouseholder = function(residentId){

    return interfaceFactory(arguments, this.constructor.name, "changeHouseholder", package);

  };

  this.changeResidentOpenGrade = function(residentId,openGrade){

    return interfaceFactory(arguments, this.constructor.name, "changeResidentOpenGrade", package);

  };

	/**
	 * <p>标题：changeUnlockResident</p>
	 * <p>说明：封锁解封接口</p>
	 * @param id			档案主键ID
	 * @param isseal		封锁=>2,解封=>1
	 * @return
	 * @throws MessageException 
	 */

  this.changeUnlockResident = function(id,isseal){

    return interfaceFactory(arguments, this.constructor.name, "changeUnlockResident", package);

  };

	/**
	 * <p>标题：getNoHouseholder</p>
	 * <p>说明：查询当前家庭非户主的成员</p>
	 * @param familyId					家庭ID
	 * @return
	 * 	<p>lists		组织机构居民信息(List => ResidentListDomain)可能为空</p>
	 * @throws MessageException
	 */

  this.getNoHouseholder = function(familyId){

    return interfaceFactory(arguments, this.constructor.name, "getNoHouseholder", package);

  };

	/**
	 * <p>标题：delResidentListById</p>
	 * <p>说明：根据主键删除用户档案</p>
	 * @param id			档案主键ID
	 * @return data=>code  是否成功(1为成功)
	 * @throws MessageException 
	 */

  this.delResidentListById = function(residentId){

    return interfaceFactory(arguments, this.constructor.name, "delResidentListById", package);

  };

  this.getResidentHead = function(residentId){

    return interfaceFactory(arguments, this.constructor.name, "getResidentHead", package);

  };

	/**
	 * <p>标题：getResidentList</p>
	 * <p>说明：查询居民信息</p>
	 * @param seach		查询关键字
	 * @param status	档案状态(0-注册;1-正常;2-封锁)
	 * @param pageNow	当前页码(从0开始)
	 * @param pageSize	页码大小
	 * @return ResidentListResult
	 * 	<p>lists		组织机构居民信息(List => ResidentListDomain)可能为空</p>
	 * @throws MessageException 
	 */

  this.getResidentList = function(seach,status,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getResidentList", package);

  };

	/**
	 * <p>标题：getFamilyByResidentId</p>
	 * <p>说明：根据居民ID 获取家庭信息</p>
	 * @param residentId			居民ID
	 * @return
	 * @throws MessageException 
	 */

  this.getFamilyByResidentId = function(residentId){

    return interfaceFactory(arguments, this.constructor.name, "getFamilyByResidentId", package);

  };

  this.getResidentDetailsNotFamily = function(id){

    return interfaceFactory(arguments, this.constructor.name, "getResidentDetailsNotFamily", package);

  };

  this.getResidentById = function(id){

    return interfaceFactory(arguments, this.constructor.name, "getResidentById", package);

  };

	/**
	 * <p>标题：getResidentFocusItemsProperty</p>
	 * <p>说明：获取居民的重点关注指标</p>
	 * @return</br>
	 * <p>lists						重点关注指标</p>
	 * @throws MessageException
	 */

  this.getResidentFocusItemsProperty = function(){

    return interfaceFactory(arguments, this.constructor.name, "getResidentFocusItemsProperty", package);

  };

  this.addResidentFocusItems = function(residentFocusItemsParam){

    return interfaceFactory(arguments, this.constructor.name, "addResidentFocusItems", package);

  };

  this.editResidentFocusItems = function(residentFocusItemsParam){

    return interfaceFactory(arguments, this.constructor.name, "editResidentFocusItems", package);

  };

	
	/**
	 * <p>标题：getMonitorItemsByResId</p>
	 * <p>说明：获取可添加居民重点关注指标</p>
	 * @param residentId
	 * @return
	 */

  this.getMonitorItemsByResId = function(residentId){

    return interfaceFactory(arguments, this.constructor.name, "getMonitorItemsByResId", package);

  };

	
	/**
	 * <p>标题：getResidentFocusItemByResidItemId</p>
	 * <p>说明：根据居民ID和指标项ID获取重点关注数据</p>
	 * @param residentId
	 * @param itemId
	 */

  this.getResidentFocusItemByResidItemId = function(residentId,itemId){

    return interfaceFactory(arguments, this.constructor.name, "getResidentFocusItemByResidItemId", package);

  };

  this.delResidentFocusItems = function(residentId,itemId){

    return interfaceFactory(arguments, this.constructor.name, "delResidentFocusItems", package);

  };

	/**
	 * <p>标题：getResidentHabitsByResidentId</p>
	 * <p>说明：获取居民生活习惯</p>
	 * @param residentId		居民ID
	 * @return
	 * @throws MessageException
	 */

  this.getResidentHabitsByResidentId = function(residentId){

    return interfaceFactory(arguments, this.constructor.name, "getResidentHabitsByResidentId", package);

  };

  this.getResidentHabits = function(){

    return interfaceFactory(arguments, this.constructor.name, "getResidentHabits", package);

  };

	/**
	 * <p>标题：saveResidentHabits</p>
	 * <p>说明：保存居民生活习惯(居民段接口)</p>
	 * @param residentHabitsParam</br>
	 * 		lists				居民生活习惯
	 * @return data=>code  是否成功(1为成功)
	 * @throws MessageException
	 */

  this.saveResidentHabits = function(residentHabitsParam){

    return interfaceFactory(arguments, this.constructor.name, "saveResidentHabits", package);

  };

  this.getResidentFocusByResidentId = function(residentId){

    return interfaceFactory(arguments, this.constructor.name, "getResidentFocusByResidentId", package);

  };

  this.getResidentListByFamilyIdAndNotResidentId = function(familyId,residentId){

    return interfaceFactory(arguments, this.constructor.name, "getResidentListByFamilyIdAndNotResidentId", package);

  };

	/**
	 * <p>标题：saveResidentFocusStatureAndWeight</p>
	 * <p>说明：保存身高体重为重点关注指标</p>
	 * @param stature		身高
	 * @param weight		体重
	 * @param residentId	居民ID
	 * @return
	 * @throws MessageException
	 */

  this.saveResidentFocusStatureAndWeight = function(stature,weight,residentId){

    return interfaceFactory(arguments, this.constructor.name, "saveResidentFocusStatureAndWeight", package);

  };

  this.getResidentFocusByResidentIdAndItemId = function(residentId,itemId){

    return interfaceFactory(arguments, this.constructor.name, "getResidentFocusByResidentIdAndItemId", package);

  };

	
	/**
	 * <p>标题：editRsdtFocusFactorByRsdtIdAndFactId</p>
	 * <p>说明：根据居民ID和测评因子ID修改据居民重点测评</p>
	 * @param residentId
	 * @param factorId
	 * @param rawScore
	 * @param convertScore
	 * @param evaFactorGrade
	 
	@Deprecated
	@InterfaceRange(values = RangeEnum.INSIDE)
	public void editRsdtFocusFactorByRsdtIdAndFactId(String residentId, String factorId, Integer rawScore,
			BigDecimal convertScore, EvaFactorGrade evaFactorGrade);*/

  this.editRsdtFocusFactorByRsdtIdAndFactId = function(residentId,factorId,rawScore,convertScore,evaFactorGrade){

    return interfaceFactory(arguments, this.constructor.name, "editRsdtFocusFactorByRsdtIdAndFactId", package);

  };

  this.getResidentItemsByRsId = function(residentId){

    return interfaceFactory(arguments, this.constructor.name, "getResidentItemsByRsId", package);

  };

	
	/**
	 * <p>标题：getResidentMonitorBysuiteIdRsId</p>
	 * <p>说明：根据居民ID与检测组ID查询每个当前检测组中每个指标最后测量结果值并返回异常数据</p>
	 * @param residentId		居民id
	 * @param suiteIds			所有监测组ID
	 * @return
	 * 		Map<String, RsdtMonitorDetailListVO> map = result.getMap();<br/>
	 * 		返回以执行组ID为map=>key,RsdtMonitorDetailListVO具体内容请查看VO
	 * @throws MessageException
	 */

  this.getResidentMonitorBysuiteIdRsId = function(residentId,suiteIds){

    return interfaceFactory(arguments, this.constructor.name, "getResidentMonitorBysuiteIdRsId", package);

  };

  this.checkAndUpdateResidentManageStatus = function(residentId,process){

    return interfaceFactory(arguments, this.constructor.name, "checkAndUpdateResidentManageStatus", package);

  };

  }


  function StaffInterfactory(){

      var package = "com.zcareze.regional.service";

	/**
	 * <p>
	 * 标题：getDoctorTeamWorkTask
	 * </p>
	 * <p>
	 * 说明：首页的每日事物区，包括“常规工作安排、居民干预执行任务”
	 * </p>
	 * 
	 * @param date
	 *            传入指定日期年月日(yyyy-MM-dd)
	 * @return
	 * @throws MessageException
	 */

  this.getDoctorTeamWorkTask = function(date){

    return interfaceFactory(arguments, this.constructor.name, "getDoctorTeamWorkTask", package);

  };


	/**
	 * <p>
	 * 标题：getDoctorTeamServiceResidentList
	 * </p>
	 * <p>
	 * 说明：获取医生常规工作安排预约居民清单(医生端每日工作安排)
	 * </p>
	 * 
	 * @param beginDate
	 *            开始时间(yyyy-MM-dd)
	 * @param endDate
	 *            结束时间(yyyy-MM-dd)
	 * @param termId
	 *            居民服务预约ID
	 * @param pageNow
	 *            当前页码(从0开始)
	 * @param pageSize
	 *            页码大小
	 * @return
	 * @throws MessageException
	 */

  this.getDoctorTeamServiceResidentList = function(beginDate,endDate,termId,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getDoctorTeamServiceResidentList", package);

  };


	/**
	 * <p>
	 * 标题：getDoctorWorkServiceResidentList
	 * </p>
	 * <p>
	 * 说明：获取医生常规工作安排预约居民清单(医生端个人中心工作安排)
	 * </p>
	 * 
	 * @param beginDate
	 *            开始时间(yyyy-MM-dd)
	 * @param endDate
	 *            结束时间(yyyy-MM-dd)
	 * @param workId
	 *            工作安排ID
	 * @param pageNow
	 *            当前页码(从0开始)
	 * @param pageSize
	 *            页码大小
	 * @return
	 * @throws MessageException
	 */

  this.getDoctorWorkServiceResidentList = function(beginDate,endDate,workId,pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getDoctorWorkServiceResidentList", package);

  };


	/**
	 * <p>标题：saveDoctorFocusResidents</p>
	 * <p>说明：保存医生关注居民接口</p>
	 * 
	 * @param doctorFocusResidents
	 * @return
	 * @throws MessageException
	 */

  this.saveDoctorFocusResidents = function(doctorFocusResidents){

    return interfaceFactory(arguments, this.constructor.name, "saveDoctorFocusResidents", package);

  };


	/**
	 * <p>
	 * 标题：cancelDoctorFocusResidents
	 * </p>
	 * <p>
	 * 说明：取消医生对居民的关注
	 * </p>
	 * 
	 * @param residentId
	 *            居民ID
	 * @return
	 * @throws MessageException
	 */

  this.cancelDoctorFocusResidents = function(residentId){

    return interfaceFactory(arguments, this.constructor.name, "cancelDoctorFocusResidents", package);

  };


	/**
	 * <p>
	 * 标题：addStaffWorkList
	 * </p>
	 * <p>
	 * 说明：添加医生个人工作安排
	 * </p>
	 * 
	 * @param staffWorkList
	 * @return
	 * @throws MessageException
	 */

  this.addStaffWorkList = function(staffWorkList){

    return interfaceFactory(arguments, this.constructor.name, "addStaffWorkList", package);

  };


	/**
	 * <p>
	 * 标题：editStaffWorkList
	 * </p>
	 * <p>
	 * 说明：编辑医生个人工作安排
	 * </p>
	 * 
	 * @param staffWorkList
	 * @return
	 * @throws MessageException
	 */

  this.editStaffWorkList = function(staffWorkList){

    return interfaceFactory(arguments, this.constructor.name, "editStaffWorkList", package);

  };


	/**
	 * <p>
	 * 标题：delStaffWorkList
	 * </p>
	 * <p>
	 * 说明：删除医生个人工作安排
	 * </p>
	 * 
	 * @param workId
	 *            医生个人工作安排ID
	 * @return
	 * @throws MessageException
	 */

  this.delStaffWorkList = function(workId){

    return interfaceFactory(arguments, this.constructor.name, "delStaffWorkList", package);

  };

  this.addRsdtServiceAppoint = function(rsaParam){

    return interfaceFactory(arguments, this.constructor.name, "addRsdtServiceAppoint", package);

  };

  this.addRsdtServiceAppointByComplete = function(termId,workTime,workTitle){

    return interfaceFactory(arguments, this.constructor.name, "addRsdtServiceAppointByComplete", package);

  };

  this.delRsdtServiceAppoint = function(rsdtServiceAppointId){

    return interfaceFactory(arguments, this.constructor.name, "delRsdtServiceAppoint", package);

  };

  this.changeRsdtServiceAppoint = function(rsdtServiceAppointId,perfectFlag){

    return interfaceFactory(arguments, this.constructor.name, "changeRsdtServiceAppoint", package);

  };

  this.addRsdtServiceOrder = function(termId,orderId){

    return interfaceFactory(arguments, this.constructor.name, "addRsdtServiceOrder", package);

  };

  this.delRsdtServiceOrderById = function(rsdtServiceOrderId){

    return interfaceFactory(arguments, this.constructor.name, "delRsdtServiceOrderById", package);

  };


	/**
	 * <p>
	 * 标题：getStaffWorkList
	 * </p>
	 * <p>
	 * 说明：获取医生个人工作安排列表
	 * </p>
	 * 
	 * @param pageNow
	 *            当前页码(从0开始)
	 * @param pageSize
	 *            页码大小
	 * @return
	 * @throws MessageException
	 */

  this.getStaffWorkList = function(pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getStaffWorkList", package);

  };


	/**
	 * <p>
	 * 标题：getTeamMemberStaffWorkListByTeamId
	 * </p>
	 * <p>
	 * 说明：获取当前团队的所有有工作安排的医生以及医生的工作安排
	 * </p>
	 * 
	 * @param teamId
	 *            医生团队ID
	 * @return
	 * @throws MessageException
	 */

  this.getTeamMemberStaffWorkListByTeamId = function(teamId){

    return interfaceFactory(arguments, this.constructor.name, "getTeamMemberStaffWorkListByTeamId", package);

  };

  this.getDoctorHomePageStatistics = function(){

    return interfaceFactory(arguments, this.constructor.name, "getDoctorHomePageStatistics", package);

  };

	
	/**
	 * <p>标题：getOrdReferralHandleList</p>
	 * <p>说明：分页获取医生端转诊转检处理列表</p>
	 * @return
	 */

  this.getOrdReferralHandleList = function(pageNow,pageSize){

    return interfaceFactory(arguments, this.constructor.name, "getOrdReferralHandleList", package);

  };

  }

function API(APICONFIG){

    versions = (APICONFIG && APICONFIG.versions) || "";


/**
 *                       
 * @Filename CoreService.java
 *
 * @Description 
 *
 * @Version 1.0
 *
 * @Author lveliu
 *
 * @Email lveliugy@gmail.com
 *       
 * @History
 *<li>Author: lveliu</li>
 *<li>Date: 2016年8月10日</li>
 *<li>Version: 1.0</li>
 *<li>Content: create</li>
 *
 */

  this.CoreService = new CoreInterfactory();


	/**
	 * 获取阿里云对象存储OSS的签名策略
	 * 
	 * @param bucketKey
	 *            空间名的KEY。audio:语音库;photo:头像库;attachment:附件库
	 *            <p>
	 *            如果传空，则全部获取；多个则用逗号分隔。
	 * @return AliyunOSSResult 存于lists对象返回
	 * @throws MessageException
	 * @author chenrj by 2016年9月26日 下午12:48:52
	 */

  this.ExternalAPIService = new ExternalAPIInterfactory();


	/**
	 * 获得字典表数据：根据字典表英文名和版本号（注意：如果传了版本号，则要小于服务器缓存里的版本号才返回）
	 * 
	 * @param dictionaryParamList
	 *            客户端需要同步到本地数据库的基础字典、基础编码的数据表参数列表
	 * @return BaseDictionaryDataResult 基础字典数据返回值。用于客户端同步本地数据库用
	 * @throws MessageException
	 * @author chenrj by 2016年8月11日 下午4:35:01
	 */

  this.BaseDictionaryService = new BaseDictionaryInterfactory();


	/**
	 * 获取阿里云对象存储OSS的签名策略
	 * 
	 * @param bucketKey
	 *            空间名的KEY。audio:语音库;photo:图片库;att:附件库
	 *            <p>
	 *            如果传空，则全部获取；多个则用逗号分隔。
	 * @return AliyunOSSResult 存于lists对象返回
	 * @throws MessageException
	 * @author chenrj by 2016年9月26日 下午12:48:52
	 */

  this.ExternalAPIService = new ExternalAPIInterfactory();


	/**
	 * 获取居民干预指令目录列表：根据居民ID
	 * 
	 * @param residentId
	 *            居民ID
	 * @param searchKind
	 *            筛选：干预指令种类，只有不限传空；多个用逗号串起，如1,2,4
	 * @param searchStatus
	 *            筛选：干预指令状态，只有不限传空；多个用逗号串起，如1,2,4
	 * @param pageNow
	 *            当前页码。从0开始
	 * @param pageSize
	 *            每页条目
	 * @return OrderListResult 获取干预指令列表返回值。OrderListResult.lists
	 * @author chenrj by 2016年8月24日 下午7:09:23
	 */

  this.HealthOrderService = new HealthOrderInterfactory();


/**
 *                       
 * @Filename OrgService.java
 *
 * @Description 
 *
 * @Version 1.0
 *
 * @Author lveliu
 *
 * @Email lveliugy@gmail.com
 *       
 * @History
 *<li>Author: lveliu</li>
 *<li>Date: 2016年8月2日</li>
 *<li>Version: 1.0</li>
 *<li>Content: create</li>
 *
 */

  this.OrgService = new OrgInterfactory();


	/**
	 * 获取居民签约概要列表
	 * 
	 * @param rangeNo
	 *            范围。1：本健康岛的签约；2：本单位的签约
	 * @param seach
	 *            搜索关键字
	 * @param contractStatus
	 *            合同状态(Integer[])<br/>
	 *            (1,表示待确认合同;2,表示有效合同;3,表示已过期合同;4,表示已终止合同;参数为空时表示所有合同状态)
	 * @param signScope
	 *            助签范围(String[])=>参数为空表示最大范围
	 * @param experts
	 *            医生团队(String[])=>参数为空表示当前可以操作的所有医生团队
	 * @param pageNow
	 *            当前页码
	 * @param pageSize
	 *            每页条目
	 * @return RsdtContractOverviewResult 居民签约概况数据列表返回值
	 * @throws MessageException
	 * @author chenrj by 2016年8月3日 下午4:39:01
	 */

  this.ResidentContractService = new ResidentContractInterfactory();


	/**
	 * 添加居民监测记录
	 * 
	 * @param rsdtMonitor
	 *            居民监测记录。主表rsdt_monitor_list
	 * @param rsdtMonitorDetailParam
	 *            居民监测数据。从表 rsdt_monitor_detail
	 * @return Map<String, RsdtMonitorDetailListVO> map = result.getMap();<br/>
	 *         返回以执行组ID为map=>key,RsdtMonitorDetailListVO具体内容请查看VO
	 * @author chenrj by 2016年7月30日 下午2:44:37
	 */

  this.ResidentHealthService = new ResidentHealthInterfactory();

/**
 *                       
 * @Filename ResidentService.java
 *
 * @Description 
 *
 * @Version 1.0
 *
 * @Author zjh
 *
 * @Email zhao1426845646@gmail.com
 *       
 * @History
 *<li>Author: zhaojinghao</li>
 *<li>Date: 2016年7月27日</li>
 *<li>Version: 1.0</li>
 *<li>Content: create</li>
 *
 */

  this.ResidentService = new ResidentInterfactory();


/**
 * 
 * @Filename StaffService.java
 *
 * @Description
 *
 * @Version 1.0
 *
 * @Author zjh
 *
 * @Email zhao1426845646@gmail.com
 * 
 * @History
 *          <li>Author: zhaojinghao</li>
 *          <li>Date: 2016年10月26日</li>
 *          <li>Version: 1.0</li>
 *          <li>Content: create</li>
 *
 */

  this.StaffService = new StaffInterfactory();

}


    angular && angular.module('Services', [])
    .constant('ServicesConfig', {
        versions: 'v1_0',
        server_address: 'http://192.168.0.124:8080/'
    }).
    factory('API', ['ServicesConfig',
        function( ServicesConfig) {

            var _ServicesConfig = ServicesConfig;
            var setHttp = function(handler, APICONFIG){
                interface.prototype.http = handler;
                interface.prototype.versions = _ServicesConfig.versions;
                return new API(APICONFIG);
            }
            
            return new (function(){
                            // interface.util.config()
                            this.config = _ServicesConfig;
                            this.setHttp = setHttp;
                        })();
        }
    ]);

})(window, BASE64);