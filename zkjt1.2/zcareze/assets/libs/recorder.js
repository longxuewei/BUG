!function(e) {
    if ("object" == typeof exports && "undefined" != typeof module)
        module.exports = e();
    else if ("function" == typeof define && define.amd)
        define([], e);
    else {
        var t;
        t = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this,
        t.OSS = e()
    }
}(function(){

    var global = window;

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var WORKER_ENABLED = !!(global === global.window && global.URL && global.Blob && global.Worker);

    var _createClass = (function() {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        return function(Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    })();

    var InlineWorker = (function () {
      function InlineWorker(func, self) {
        var _this = this;

        _classCallCheck(this, InlineWorker);

        if (WORKER_ENABLED) {
          var functionBody = func.toString().trim().match(/^function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*?)}$/)[1];
          var url = global.URL.createObjectURL(new global.Blob([functionBody], { type: "text/javascript" }));

          return new global.Worker(url);
        }

        this.self = self;
        this.self.postMessage = function (data) {
          setTimeout(function () {
            _this.onmessage({ data: data });
          }, 0);
        };

        setTimeout(function () {
          func.call(self);
        }, 0);
      }

      _createClass(InlineWorker, {
        postMessage: {
          value: function postMessage(data) {
            var _this = this;

            setTimeout(function () {
              _this.self.onmessage({ data: data });
            }, 0);
          }
        }
      });

      return InlineWorker;
    })();

    var _inlineWorker = InlineWorker;

    var _inlineWorker2 = _interopRequireDefault(_inlineWorker);

    var Recorder = (function () {
    
            function Recorder(source, cfg) {
                var _this = this;

                _classCallCheck(this, Recorder);

                this.config = {
                    bufferLen: 4096,
                    numChannels: 2,
                    sampleRate: 48000,
                    sampleBits: 16,
                    mimeType: 'audio/wav'
                };
                this.recording = false;
                this.callbacks = {
                    getBuffer: [],
                    exportWAV: []
                };

                Object.assign(this.config, cfg);
                this.context = source.context;
                this.node = (this.context.createScriptProcessor || this.context.createJavaScriptNode).call(this.context, this.config.bufferLen, this.config.numChannels, this.config.numChannels);

                this.node.onaudioprocess = function (e) {
                    if (!_this.recording) return;

                    var buffer = [];
                    for (var channel = 0; channel < _this.config.numChannels; channel++) {
                        buffer.push(e.inputBuffer.getChannelData(channel));
                    }
                    _this.worker.postMessage({
                        command: 'record',
                        buffer: buffer
                    });
                };

                source.connect(this.node);
                this.node.connect(this.context.destination); //this should not be necessary

                var self = {};
                // this.worker = new _inlineWorker2.default(function () {
                //     //Worker.js
                // }, self);
                this.worker = new Worker('libs/worker.js');

                this.worker.postMessage({
                    command: 'init',
                    config: {
                        sampleRate: this.context.sampleRate,
                        numChannels: this.config.numChannels,
                        sampleBits: this.config.sampleBits
                    }
                });

                this.worker.onmessage = function (e) {
                    var cb = _this.callbacks[e.data.command].pop();
                    if (typeof cb == 'function') {
                        cb(e.data.data);
                    }
                };
            }

            _createClass(Recorder, [{
                key: 'record',
                value: function record() {
                    this.recording = true;
                }
            }, {
                key: 'stop',
                value: function stop() {
                    this.recording = false;
                }
            }, {
                key: 'clear',
                value: function clear() {
                    this.worker.postMessage({ command: 'clear' });
                }
            }, {
                key: 'getBuffer',
                value: function getBuffer(cb) {
                    cb = cb || this.config.callback;
                    if (!cb) throw new Error('Callback not set');

                    this.callbacks.getBuffer.push(cb);

                    this.worker.postMessage({ command: 'getBuffer' });
                }
            }, {
                key: 'exportWAV',
                value: function exportWAV(cb, mimeType) {
                    mimeType = mimeType || this.config.mimeType;
                    cb = cb || this.config.callback;
                    if (!cb) throw new Error('Callback not set');

                    this.callbacks.exportWAV.push(cb);

                    this.worker.postMessage({
                        command: 'exportWAV',
                        type: mimeType
                    });
                }
            }, {
                key: 'baseB64',
                value: function baseB64(cb, mimeType) {
                    mimeType = mimeType || this.config.mimeType;
                    cb = cb || this.config.callback;
                    if (!cb) throw new Error('Callback not set');

                    this.callbacks.baseB64.push(cb);

                    this.worker.postMessage({
                        command: 'baseB64',
                        type: mimeType
                    });
                }
            }], [{
                key: 'forceDownload',
                value: function forceDownload(blob, filename) {
                    var url = (window.URL || window.webkitURL).createObjectURL(blob);
                    var link = window.document.createElement('a');
                    link.href = url;
                    link.download = filename || 'output.wav';
                    var click = document.createEvent("Event");
                    click.initEvent("click", true, true);
                    link.dispatchEvent(click);
                }
            }]);

            return Recorder;
        })();
    return window.Recorder = Recorder;
});