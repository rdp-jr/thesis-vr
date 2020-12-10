/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global NAF */

var EasyRtcAdapter = function () {
  function EasyRtcAdapter(easyrtc) {
    _classCallCheck(this, EasyRtcAdapter);

    this.easyrtc = easyrtc || window.easyrtc;
    this.app = "default";
    this.room = "default";

    this.audioStreams = {};
    this.pendingAudioRequest = {};

    this.serverTimeRequests = 0;
    this.timeOffsets = [];
    this.avgTimeOffset = 0;
  }

  _createClass(EasyRtcAdapter, [{
    key: "setServerUrl",
    value: function setServerUrl(url) {
      this.easyrtc.setSocketUrl(url);
    }
  }, {
    key: "setApp",
    value: function setApp(appName) {
      this.app = appName;
    }
  }, {
    key: "setRoom",
    value: function setRoom(roomName) {
      this.room = roomName;
      this.easyrtc.joinRoom(roomName, null);
    }

    // options: { datachannel: bool, audio: bool }

  }, {
    key: "setWebRtcOptions",
    value: function setWebRtcOptions(options) {
      // this.easyrtc.enableDebug(true);
      this.easyrtc.enableDataChannels(options.datachannel);

      this.easyrtc.enableVideo(false);
      this.easyrtc.enableAudio(options.audio);

      this.easyrtc.enableVideoReceive(false);
      this.easyrtc.enableAudioReceive(true);
    }
  }, {
    key: "setServerConnectListeners",
    value: function setServerConnectListeners(successListener, failureListener) {
      this.connectSuccess = successListener;
      this.connectFailure = failureListener;
    }
  }, {
    key: "setRoomOccupantListener",
    value: function setRoomOccupantListener(occupantListener) {
      this.easyrtc.setRoomOccupantListener(function (roomName, occupants, primary) {
        occupantListener(occupants);
      });
    }
  }, {
    key: "setDataChannelListeners",
    value: function setDataChannelListeners(openListener, closedListener, messageListener) {
      this.easyrtc.setDataChannelOpenListener(openListener);
      this.easyrtc.setDataChannelCloseListener(closedListener);
      this.easyrtc.setPeerListener(messageListener);
    }
  }, {
    key: "updateTimeOffset",
    value: function updateTimeOffset() {
      var _this = this;

      var clientSentTime = Date.now() + this.avgTimeOffset;

      return fetch(document.location.href, { method: "HEAD", cache: "no-cache" }).then(function (res) {
        var precision = 1000;
        var serverReceivedTime = new Date(res.headers.get("Date")).getTime() + precision / 2;
        var clientReceivedTime = Date.now();
        var serverTime = serverReceivedTime + (clientReceivedTime - clientSentTime) / 2;
        var timeOffset = serverTime - clientReceivedTime;

        _this.serverTimeRequests++;

        if (_this.serverTimeRequests <= 10) {
          _this.timeOffsets.push(timeOffset);
        } else {
          _this.timeOffsets[_this.serverTimeRequests % 10] = timeOffset;
        }

        _this.avgTimeOffset = _this.timeOffsets.reduce(function (acc, offset) {
          return acc += offset;
        }, 0) / _this.timeOffsets.length;

        if (_this.serverTimeRequests > 10) {
          setTimeout(function () {
            return _this.updateTimeOffset();
          }, 5 * 60 * 1000); // Sync clock every 5 minutes.
        } else {
          _this.updateTimeOffset();
        }
      });
    }
  }, {
    key: "connect",
    value: function connect() {
      var _this2 = this;

      Promise.all([this.updateTimeOffset(), new Promise(function (resolve, reject) {
        _this2._connect(_this2.easyrtc.audioEnabled, resolve, reject);
      })]).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            _ = _ref2[0],
            clientId = _ref2[1];

        _this2._storeAudioStream(_this2.easyrtc.myEasyrtcid, _this2.easyrtc.getLocalStream());

        _this2._myRoomJoinTime = _this2._getRoomJoinTime(clientId);
        _this2.connectSuccess(clientId);
      }).catch(this.connectFailure);
    }
  }, {
    key: "shouldStartConnectionTo",
    value: function shouldStartConnectionTo(client) {
      return this._myRoomJoinTime <= client.roomJoinTime;
    }
  }, {
    key: "startStreamConnection",
    value: function startStreamConnection(clientId) {
      this.easyrtc.call(clientId, function (caller, media) {
        if (media === "datachannel") {
          NAF.log.write("Successfully started datachannel to ", caller);
        }
      }, function (errorCode, errorText) {
        NAF.log.error(errorCode, errorText);
      }, function (wasAccepted) {
        // console.log("was accepted=" + wasAccepted);
      });
    }
  }, {
    key: "closeStreamConnection",
    value: function closeStreamConnection(clientId) {
      // Handled by easyrtc
    }
  }, {
    key: "sendData",
    value: function sendData(clientId, dataType, data) {
      // send via webrtc otherwise fallback to websockets
      this.easyrtc.sendData(clientId, dataType, data);
    }
  }, {
    key: "sendDataGuaranteed",
    value: function sendDataGuaranteed(clientId, dataType, data) {
      this.easyrtc.sendDataWS(clientId, dataType, data);
    }
  }, {
    key: "broadcastData",
    value: function broadcastData(dataType, data) {
      var roomOccupants = this.easyrtc.getRoomOccupantsAsMap(this.room);

      // Iterate over the keys of the easyrtc room occupants map.
      // getRoomOccupantsAsArray uses Object.keys which allocates memory.
      for (var roomOccupant in roomOccupants) {
        if (roomOccupants[roomOccupant] && roomOccupant !== this.easyrtc.myEasyrtcid) {
          // send via webrtc otherwise fallback to websockets
          this.easyrtc.sendData(roomOccupant, dataType, data);
        }
      }
    }
  }, {
    key: "broadcastDataGuaranteed",
    value: function broadcastDataGuaranteed(dataType, data) {
      var destination = { targetRoom: this.room };
      this.easyrtc.sendDataWS(destination, dataType, data);
    }
  }, {
    key: "getConnectStatus",
    value: function getConnectStatus(clientId) {
      var status = this.easyrtc.getConnectStatus(clientId);

      if (status == this.easyrtc.IS_CONNECTED) {
        return NAF.adapters.IS_CONNECTED;
      } else if (status == this.easyrtc.NOT_CONNECTED) {
        return NAF.adapters.NOT_CONNECTED;
      } else {
        return NAF.adapters.CONNECTING;
      }
    }
  }, {
    key: "getMediaStream",
    value: function getMediaStream(clientId) {
      var that = this;
      if (this.audioStreams[clientId]) {
        NAF.log.write("Already had audio for " + clientId);
        return Promise.resolve(this.audioStreams[clientId]);
      } else {
        NAF.log.write("Waiting on audio for " + clientId);
        return new Promise(function (resolve) {
          that.pendingAudioRequest[clientId] = resolve;
        });
      }
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      this.easyrtc.disconnect();
    }

    /**
     * Privates
     */

  }, {
    key: "_storeAudioStream",
    value: function _storeAudioStream(easyrtcid, stream) {
      this.audioStreams[easyrtcid] = stream;
      if (this.pendingAudioRequest[easyrtcid]) {
        NAF.log.write("got pending audio for " + easyrtcid);
        this.pendingAudioRequest[easyrtcid](stream);
        delete this.pendingAudioRequest[easyrtcid](stream);
      }
    }
  }, {
    key: "_connect",
    value: function _connect(audioEnabled, connectSuccess, connectFailure) {
      var that = this;

      this.easyrtc.setStreamAcceptor(this._storeAudioStream.bind(this));

      this.easyrtc.setOnStreamClosed(function (easyrtcid) {
        delete that.audioStreams[easyrtcid];
      });

      if (audioEnabled) {
        this.easyrtc.initMediaSource(function () {
          that.easyrtc.connect(that.app, connectSuccess, connectFailure);
        }, function (errorCode, errmesg) {
          NAF.log.error(errorCode, errmesg);
        });
      } else {
        that.easyrtc.connect(that.app, connectSuccess, connectFailure);
      }
    }
  }, {
    key: "_getRoomJoinTime",
    value: function _getRoomJoinTime(clientId) {
      var myRoomId = NAF.room;
      var joinTime = this.easyrtc.getRoomOccupantsAsMap(myRoomId)[clientId].roomJoinTime;
      return joinTime;
    }
  }, {
    key: "getServerTime",
    value: function getServerTime() {
      return Date.now() + this.avgTimeOffset;
    }
  }]);

  return EasyRtcAdapter;
}();

NAF.adapters.register("easyrtc", EasyRtcAdapter);

module.exports = EasyRtcAdapter;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYmI0NjMyMWJhYmVjNjdkZThhOTUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbIkVhc3lSdGNBZGFwdGVyIiwiZWFzeXJ0YyIsIndpbmRvdyIsImFwcCIsInJvb20iLCJhdWRpb1N0cmVhbXMiLCJwZW5kaW5nQXVkaW9SZXF1ZXN0Iiwic2VydmVyVGltZVJlcXVlc3RzIiwidGltZU9mZnNldHMiLCJhdmdUaW1lT2Zmc2V0IiwidXJsIiwic2V0U29ja2V0VXJsIiwiYXBwTmFtZSIsInJvb21OYW1lIiwiam9pblJvb20iLCJvcHRpb25zIiwiZW5hYmxlRGF0YUNoYW5uZWxzIiwiZGF0YWNoYW5uZWwiLCJlbmFibGVWaWRlbyIsImVuYWJsZUF1ZGlvIiwiYXVkaW8iLCJlbmFibGVWaWRlb1JlY2VpdmUiLCJlbmFibGVBdWRpb1JlY2VpdmUiLCJzdWNjZXNzTGlzdGVuZXIiLCJmYWlsdXJlTGlzdGVuZXIiLCJjb25uZWN0U3VjY2VzcyIsImNvbm5lY3RGYWlsdXJlIiwib2NjdXBhbnRMaXN0ZW5lciIsInNldFJvb21PY2N1cGFudExpc3RlbmVyIiwib2NjdXBhbnRzIiwicHJpbWFyeSIsIm9wZW5MaXN0ZW5lciIsImNsb3NlZExpc3RlbmVyIiwibWVzc2FnZUxpc3RlbmVyIiwic2V0RGF0YUNoYW5uZWxPcGVuTGlzdGVuZXIiLCJzZXREYXRhQ2hhbm5lbENsb3NlTGlzdGVuZXIiLCJzZXRQZWVyTGlzdGVuZXIiLCJjbGllbnRTZW50VGltZSIsIkRhdGUiLCJub3ciLCJmZXRjaCIsImRvY3VtZW50IiwibG9jYXRpb24iLCJocmVmIiwibWV0aG9kIiwiY2FjaGUiLCJ0aGVuIiwicHJlY2lzaW9uIiwic2VydmVyUmVjZWl2ZWRUaW1lIiwicmVzIiwiaGVhZGVycyIsImdldCIsImdldFRpbWUiLCJjbGllbnRSZWNlaXZlZFRpbWUiLCJzZXJ2ZXJUaW1lIiwidGltZU9mZnNldCIsInB1c2giLCJyZWR1Y2UiLCJhY2MiLCJvZmZzZXQiLCJsZW5ndGgiLCJzZXRUaW1lb3V0IiwidXBkYXRlVGltZU9mZnNldCIsIlByb21pc2UiLCJhbGwiLCJyZXNvbHZlIiwicmVqZWN0IiwiX2Nvbm5lY3QiLCJhdWRpb0VuYWJsZWQiLCJfIiwiY2xpZW50SWQiLCJfc3RvcmVBdWRpb1N0cmVhbSIsIm15RWFzeXJ0Y2lkIiwiZ2V0TG9jYWxTdHJlYW0iLCJfbXlSb29tSm9pblRpbWUiLCJfZ2V0Um9vbUpvaW5UaW1lIiwiY2F0Y2giLCJjbGllbnQiLCJyb29tSm9pblRpbWUiLCJjYWxsIiwiY2FsbGVyIiwibWVkaWEiLCJOQUYiLCJsb2ciLCJ3cml0ZSIsImVycm9yQ29kZSIsImVycm9yVGV4dCIsImVycm9yIiwid2FzQWNjZXB0ZWQiLCJkYXRhVHlwZSIsImRhdGEiLCJzZW5kRGF0YSIsInNlbmREYXRhV1MiLCJyb29tT2NjdXBhbnRzIiwiZ2V0Um9vbU9jY3VwYW50c0FzTWFwIiwicm9vbU9jY3VwYW50IiwiZGVzdGluYXRpb24iLCJ0YXJnZXRSb29tIiwic3RhdHVzIiwiZ2V0Q29ubmVjdFN0YXR1cyIsIklTX0NPTk5FQ1RFRCIsImFkYXB0ZXJzIiwiTk9UX0NPTk5FQ1RFRCIsIkNPTk5FQ1RJTkciLCJ0aGF0IiwiZGlzY29ubmVjdCIsImVhc3lydGNpZCIsInN0cmVhbSIsInNldFN0cmVhbUFjY2VwdG9yIiwiYmluZCIsInNldE9uU3RyZWFtQ2xvc2VkIiwiaW5pdE1lZGlhU291cmNlIiwiY29ubmVjdCIsImVycm1lc2ciLCJteVJvb21JZCIsImpvaW5UaW1lIiwicmVnaXN0ZXIiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7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O0FBQ0xULGFBQUt2RyxPQUFMLENBQWErRyxPQUFiLENBQXFCUixLQUFLckcsR0FBMUIsRUFBK0JzQixjQUEvQixFQUErQ0MsY0FBL0M7QUFDRDtBQUNGOzs7cUNBRWdCNEMsUSxFQUFVO0FBQ3pCLFVBQUk0QyxXQUFXaEMsSUFBSTlFLElBQW5CO0FBQ0EsVUFBSStHLFdBQVcsS0FBS2xILE9BQUwsQ0FBYTZGLHFCQUFiLENBQW1Db0IsUUFBbkMsRUFBNkM1QyxRQUE3QyxFQUNaUSxZQURIO0FBRUEsYUFBT3FDLFFBQVA7QUFDRDs7O29DQUVlO0FBQ2QsYUFBTzdFLEtBQUtDLEdBQUwsS0FBYSxLQUFLOUIsYUFBekI7QUFDRDs7Ozs7O0FBR0h5RSxJQUFJbUIsUUFBSixDQUFhZSxRQUFiLENBQXNCLFNBQXRCLEVBQWlDcEgsY0FBakM7O0FBRUFxSCxPQUFPQyxPQUFQLEdBQWlCdEgsY0FBakIsQyIsImZpbGUiOiJuYWYtZWFzeXJ0Yy1hZGFwdGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYmI0NjMyMWJhYmVjNjdkZThhOTUiLCIvKiBnbG9iYWwgTkFGICovXHJcblxyXG5jbGFzcyBFYXN5UnRjQWRhcHRlciB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGVhc3lydGMpIHtcclxuICAgIHRoaXMuZWFzeXJ0YyA9IGVhc3lydGMgfHwgd2luZG93LmVhc3lydGM7XHJcbiAgICB0aGlzLmFwcCA9IFwiZGVmYXVsdFwiO1xyXG4gICAgdGhpcy5yb29tID0gXCJkZWZhdWx0XCI7XHJcblxyXG4gICAgdGhpcy5hdWRpb1N0cmVhbXMgPSB7fTtcclxuICAgIHRoaXMucGVuZGluZ0F1ZGlvUmVxdWVzdCA9IHt9O1xyXG5cclxuICAgIHRoaXMuc2VydmVyVGltZVJlcXVlc3RzID0gMDtcclxuICAgIHRoaXMudGltZU9mZnNldHMgPSBbXTtcclxuICAgIHRoaXMuYXZnVGltZU9mZnNldCA9IDA7XHJcbiAgfVxyXG5cclxuICBzZXRTZXJ2ZXJVcmwodXJsKSB7XHJcbiAgICB0aGlzLmVhc3lydGMuc2V0U29ja2V0VXJsKHVybCk7XHJcbiAgfVxyXG5cclxuICBzZXRBcHAoYXBwTmFtZSkge1xyXG4gICAgdGhpcy5hcHAgPSBhcHBOYW1lO1xyXG4gIH1cclxuXHJcbiAgc2V0Um9vbShyb29tTmFtZSkge1xyXG4gICAgdGhpcy5yb29tID0gcm9vbU5hbWU7XHJcbiAgICB0aGlzLmVhc3lydGMuam9pblJvb20ocm9vbU5hbWUsIG51bGwpO1xyXG4gIH1cclxuXHJcbiAgLy8gb3B0aW9uczogeyBkYXRhY2hhbm5lbDogYm9vbCwgYXVkaW86IGJvb2wgfVxyXG4gIHNldFdlYlJ0Y09wdGlvbnMob3B0aW9ucykge1xyXG4gICAgLy8gdGhpcy5lYXN5cnRjLmVuYWJsZURlYnVnKHRydWUpO1xyXG4gICAgdGhpcy5lYXN5cnRjLmVuYWJsZURhdGFDaGFubmVscyhvcHRpb25zLmRhdGFjaGFubmVsKTtcclxuXHJcbiAgICB0aGlzLmVhc3lydGMuZW5hYmxlVmlkZW8oZmFsc2UpO1xyXG4gICAgdGhpcy5lYXN5cnRjLmVuYWJsZUF1ZGlvKG9wdGlvbnMuYXVkaW8pO1xyXG5cclxuICAgIHRoaXMuZWFzeXJ0Yy5lbmFibGVWaWRlb1JlY2VpdmUoZmFsc2UpO1xyXG4gICAgdGhpcy5lYXN5cnRjLmVuYWJsZUF1ZGlvUmVjZWl2ZSh0cnVlKTtcclxuICB9XHJcblxyXG4gIHNldFNlcnZlckNvbm5lY3RMaXN0ZW5lcnMoc3VjY2Vzc0xpc3RlbmVyLCBmYWlsdXJlTGlzdGVuZXIpIHtcclxuICAgIHRoaXMuY29ubmVjdFN1Y2Nlc3MgPSBzdWNjZXNzTGlzdGVuZXI7XHJcbiAgICB0aGlzLmNvbm5lY3RGYWlsdXJlID0gZmFpbHVyZUxpc3RlbmVyO1xyXG4gIH1cclxuXHJcbiAgc2V0Um9vbU9jY3VwYW50TGlzdGVuZXIob2NjdXBhbnRMaXN0ZW5lcikge1xyXG4gICAgdGhpcy5lYXN5cnRjLnNldFJvb21PY2N1cGFudExpc3RlbmVyKGZ1bmN0aW9uKFxyXG4gICAgICByb29tTmFtZSxcclxuICAgICAgb2NjdXBhbnRzLFxyXG4gICAgICBwcmltYXJ5XHJcbiAgICApIHtcclxuICAgICAgb2NjdXBhbnRMaXN0ZW5lcihvY2N1cGFudHMpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZXREYXRhQ2hhbm5lbExpc3RlbmVycyhvcGVuTGlzdGVuZXIsIGNsb3NlZExpc3RlbmVyLCBtZXNzYWdlTGlzdGVuZXIpIHtcclxuICAgIHRoaXMuZWFzeXJ0Yy5zZXREYXRhQ2hhbm5lbE9wZW5MaXN0ZW5lcihvcGVuTGlzdGVuZXIpO1xyXG4gICAgdGhpcy5lYXN5cnRjLnNldERhdGFDaGFubmVsQ2xvc2VMaXN0ZW5lcihjbG9zZWRMaXN0ZW5lcik7XHJcbiAgICB0aGlzLmVhc3lydGMuc2V0UGVlckxpc3RlbmVyKG1lc3NhZ2VMaXN0ZW5lcik7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVUaW1lT2Zmc2V0KCkge1xyXG4gICAgY29uc3QgY2xpZW50U2VudFRpbWUgPSBEYXRlLm5vdygpICsgdGhpcy5hdmdUaW1lT2Zmc2V0O1xyXG5cclxuICAgIHJldHVybiBmZXRjaChkb2N1bWVudC5sb2NhdGlvbi5ocmVmLCB7IG1ldGhvZDogXCJIRUFEXCIsIGNhY2hlOiBcIm5vLWNhY2hlXCIgfSlcclxuICAgICAgLnRoZW4ocmVzID0+IHtcclxuICAgICAgICB2YXIgcHJlY2lzaW9uID0gMTAwMDtcclxuICAgICAgICB2YXIgc2VydmVyUmVjZWl2ZWRUaW1lID0gbmV3IERhdGUocmVzLmhlYWRlcnMuZ2V0KFwiRGF0ZVwiKSkuZ2V0VGltZSgpICsgKHByZWNpc2lvbiAvIDIpO1xyXG4gICAgICAgIHZhciBjbGllbnRSZWNlaXZlZFRpbWUgPSBEYXRlLm5vdygpO1xyXG4gICAgICAgIHZhciBzZXJ2ZXJUaW1lID0gc2VydmVyUmVjZWl2ZWRUaW1lICsgKChjbGllbnRSZWNlaXZlZFRpbWUgLSBjbGllbnRTZW50VGltZSkgLyAyKTtcclxuICAgICAgICB2YXIgdGltZU9mZnNldCA9IHNlcnZlclRpbWUgLSBjbGllbnRSZWNlaXZlZFRpbWU7XHJcblxyXG4gICAgICAgIHRoaXMuc2VydmVyVGltZVJlcXVlc3RzKys7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnNlcnZlclRpbWVSZXF1ZXN0cyA8PSAxMCkge1xyXG4gICAgICAgICAgdGhpcy50aW1lT2Zmc2V0cy5wdXNoKHRpbWVPZmZzZXQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnRpbWVPZmZzZXRzW3RoaXMuc2VydmVyVGltZVJlcXVlc3RzICUgMTBdID0gdGltZU9mZnNldDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYXZnVGltZU9mZnNldCA9IHRoaXMudGltZU9mZnNldHMucmVkdWNlKChhY2MsIG9mZnNldCkgPT4gYWNjICs9IG9mZnNldCwgMCkgLyB0aGlzLnRpbWVPZmZzZXRzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc2VydmVyVGltZVJlcXVlc3RzID4gMTApIHtcclxuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy51cGRhdGVUaW1lT2Zmc2V0KCksIDUgKiA2MCAqIDEwMDApOyAvLyBTeW5jIGNsb2NrIGV2ZXJ5IDUgbWludXRlcy5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy51cGRhdGVUaW1lT2Zmc2V0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIGNvbm5lY3QoKSB7XHJcbiAgICBQcm9taXNlLmFsbChbXHJcbiAgICAgIHRoaXMudXBkYXRlVGltZU9mZnNldCgpLFxyXG4gICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgdGhpcy5fY29ubmVjdCh0aGlzLmVhc3lydGMuYXVkaW9FbmFibGVkLCByZXNvbHZlLCByZWplY3QpO1xyXG4gICAgICB9KVxyXG4gICAgXSkudGhlbigoW18sIGNsaWVudElkXSkgPT4ge1xyXG4gICAgICB0aGlzLl9zdG9yZUF1ZGlvU3RyZWFtKFxyXG4gICAgICAgIHRoaXMuZWFzeXJ0Yy5teUVhc3lydGNpZCxcclxuICAgICAgICB0aGlzLmVhc3lydGMuZ2V0TG9jYWxTdHJlYW0oKVxyXG4gICAgICApO1xyXG5cclxuICAgICAgdGhpcy5fbXlSb29tSm9pblRpbWUgPSB0aGlzLl9nZXRSb29tSm9pblRpbWUoY2xpZW50SWQpO1xyXG4gICAgICB0aGlzLmNvbm5lY3RTdWNjZXNzKGNsaWVudElkKTtcclxuICAgIH0pLmNhdGNoKHRoaXMuY29ubmVjdEZhaWx1cmUpO1xyXG4gIH1cclxuXHJcbiAgc2hvdWxkU3RhcnRDb25uZWN0aW9uVG8oY2xpZW50KSB7XHJcbiAgICByZXR1cm4gdGhpcy5fbXlSb29tSm9pblRpbWUgPD0gY2xpZW50LnJvb21Kb2luVGltZTtcclxuICB9XHJcblxyXG4gIHN0YXJ0U3RyZWFtQ29ubmVjdGlvbihjbGllbnRJZCkge1xyXG4gICAgdGhpcy5lYXN5cnRjLmNhbGwoXHJcbiAgICAgIGNsaWVudElkLFxyXG4gICAgICBmdW5jdGlvbihjYWxsZXIsIG1lZGlhKSB7XHJcbiAgICAgICAgaWYgKG1lZGlhID09PSBcImRhdGFjaGFubmVsXCIpIHtcclxuICAgICAgICAgIE5BRi5sb2cud3JpdGUoXCJTdWNjZXNzZnVsbHkgc3RhcnRlZCBkYXRhY2hhbm5lbCB0byBcIiwgY2FsbGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGZ1bmN0aW9uKGVycm9yQ29kZSwgZXJyb3JUZXh0KSB7XHJcbiAgICAgICAgTkFGLmxvZy5lcnJvcihlcnJvckNvZGUsIGVycm9yVGV4dCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGZ1bmN0aW9uKHdhc0FjY2VwdGVkKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJ3YXMgYWNjZXB0ZWQ9XCIgKyB3YXNBY2NlcHRlZCk7XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBjbG9zZVN0cmVhbUNvbm5lY3Rpb24oY2xpZW50SWQpIHtcclxuICAgIC8vIEhhbmRsZWQgYnkgZWFzeXJ0Y1xyXG4gIH1cclxuXHJcbiAgc2VuZERhdGEoY2xpZW50SWQsIGRhdGFUeXBlLCBkYXRhKSB7XHJcbiAgICAvLyBzZW5kIHZpYSB3ZWJydGMgb3RoZXJ3aXNlIGZhbGxiYWNrIHRvIHdlYnNvY2tldHNcclxuICAgIHRoaXMuZWFzeXJ0Yy5zZW5kRGF0YShjbGllbnRJZCwgZGF0YVR5cGUsIGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgc2VuZERhdGFHdWFyYW50ZWVkKGNsaWVudElkLCBkYXRhVHlwZSwgZGF0YSkge1xyXG4gICAgdGhpcy5lYXN5cnRjLnNlbmREYXRhV1MoY2xpZW50SWQsIGRhdGFUeXBlLCBkYXRhKTtcclxuICB9XHJcblxyXG4gIGJyb2FkY2FzdERhdGEoZGF0YVR5cGUsIGRhdGEpIHtcclxuICAgIHZhciByb29tT2NjdXBhbnRzID0gdGhpcy5lYXN5cnRjLmdldFJvb21PY2N1cGFudHNBc01hcCh0aGlzLnJvb20pO1xyXG5cclxuICAgIC8vIEl0ZXJhdGUgb3ZlciB0aGUga2V5cyBvZiB0aGUgZWFzeXJ0YyByb29tIG9jY3VwYW50cyBtYXAuXHJcbiAgICAvLyBnZXRSb29tT2NjdXBhbnRzQXNBcnJheSB1c2VzIE9iamVjdC5rZXlzIHdoaWNoIGFsbG9jYXRlcyBtZW1vcnkuXHJcbiAgICBmb3IgKHZhciByb29tT2NjdXBhbnQgaW4gcm9vbU9jY3VwYW50cykge1xyXG4gICAgICBpZiAoXHJcbiAgICAgICAgcm9vbU9jY3VwYW50c1tyb29tT2NjdXBhbnRdICYmXHJcbiAgICAgICAgcm9vbU9jY3VwYW50ICE9PSB0aGlzLmVhc3lydGMubXlFYXN5cnRjaWRcclxuICAgICAgKSB7XHJcbiAgICAgICAgLy8gc2VuZCB2aWEgd2VicnRjIG90aGVyd2lzZSBmYWxsYmFjayB0byB3ZWJzb2NrZXRzXHJcbiAgICAgICAgdGhpcy5lYXN5cnRjLnNlbmREYXRhKHJvb21PY2N1cGFudCwgZGF0YVR5cGUsIGRhdGEpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBicm9hZGNhc3REYXRhR3VhcmFudGVlZChkYXRhVHlwZSwgZGF0YSkge1xyXG4gICAgdmFyIGRlc3RpbmF0aW9uID0geyB0YXJnZXRSb29tOiB0aGlzLnJvb20gfTtcclxuICAgIHRoaXMuZWFzeXJ0Yy5zZW5kRGF0YVdTKGRlc3RpbmF0aW9uLCBkYXRhVHlwZSwgZGF0YSk7XHJcbiAgfVxyXG5cclxuICBnZXRDb25uZWN0U3RhdHVzKGNsaWVudElkKSB7XHJcbiAgICB2YXIgc3RhdHVzID0gdGhpcy5lYXN5cnRjLmdldENvbm5lY3RTdGF0dXMoY2xpZW50SWQpO1xyXG5cclxuICAgIGlmIChzdGF0dXMgPT0gdGhpcy5lYXN5cnRjLklTX0NPTk5FQ1RFRCkge1xyXG4gICAgICByZXR1cm4gTkFGLmFkYXB0ZXJzLklTX0NPTk5FQ1RFRDtcclxuICAgIH0gZWxzZSBpZiAoc3RhdHVzID09IHRoaXMuZWFzeXJ0Yy5OT1RfQ09OTkVDVEVEKSB7XHJcbiAgICAgIHJldHVybiBOQUYuYWRhcHRlcnMuTk9UX0NPTk5FQ1RFRDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBOQUYuYWRhcHRlcnMuQ09OTkVDVElORztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldE1lZGlhU3RyZWFtKGNsaWVudElkKSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICBpZiAodGhpcy5hdWRpb1N0cmVhbXNbY2xpZW50SWRdKSB7XHJcbiAgICAgIE5BRi5sb2cud3JpdGUoXCJBbHJlYWR5IGhhZCBhdWRpbyBmb3IgXCIgKyBjbGllbnRJZCk7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5hdWRpb1N0cmVhbXNbY2xpZW50SWRdKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIE5BRi5sb2cud3JpdGUoXCJXYWl0aW5nIG9uIGF1ZGlvIGZvciBcIiArIGNsaWVudElkKTtcclxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcclxuICAgICAgICB0aGF0LnBlbmRpbmdBdWRpb1JlcXVlc3RbY2xpZW50SWRdID0gcmVzb2x2ZTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkaXNjb25uZWN0KCkge1xyXG4gICAgdGhpcy5lYXN5cnRjLmRpc2Nvbm5lY3QoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFByaXZhdGVzXHJcbiAgICovXHJcblxyXG4gIF9zdG9yZUF1ZGlvU3RyZWFtKGVhc3lydGNpZCwgc3RyZWFtKSB7XHJcbiAgICB0aGlzLmF1ZGlvU3RyZWFtc1tlYXN5cnRjaWRdID0gc3RyZWFtO1xyXG4gICAgaWYgKHRoaXMucGVuZGluZ0F1ZGlvUmVxdWVzdFtlYXN5cnRjaWRdKSB7XHJcbiAgICAgIE5BRi5sb2cud3JpdGUoXCJnb3QgcGVuZGluZyBhdWRpbyBmb3IgXCIgKyBlYXN5cnRjaWQpO1xyXG4gICAgICB0aGlzLnBlbmRpbmdBdWRpb1JlcXVlc3RbZWFzeXJ0Y2lkXShzdHJlYW0pO1xyXG4gICAgICBkZWxldGUgdGhpcy5wZW5kaW5nQXVkaW9SZXF1ZXN0W2Vhc3lydGNpZF0oc3RyZWFtKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIF9jb25uZWN0KGF1ZGlvRW5hYmxlZCwgY29ubmVjdFN1Y2Nlc3MsIGNvbm5lY3RGYWlsdXJlKSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgdGhpcy5lYXN5cnRjLnNldFN0cmVhbUFjY2VwdG9yKHRoaXMuX3N0b3JlQXVkaW9TdHJlYW0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgdGhpcy5lYXN5cnRjLnNldE9uU3RyZWFtQ2xvc2VkKGZ1bmN0aW9uKGVhc3lydGNpZCkge1xyXG4gICAgICBkZWxldGUgdGhhdC5hdWRpb1N0cmVhbXNbZWFzeXJ0Y2lkXTtcclxuICAgIH0pO1xyXG5cclxuICAgIGlmIChhdWRpb0VuYWJsZWQpIHtcclxuICAgICAgdGhpcy5lYXN5cnRjLmluaXRNZWRpYVNvdXJjZShcclxuICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHRoYXQuZWFzeXJ0Yy5jb25uZWN0KHRoYXQuYXBwLCBjb25uZWN0U3VjY2VzcywgY29ubmVjdEZhaWx1cmUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZnVuY3Rpb24oZXJyb3JDb2RlLCBlcnJtZXNnKSB7XHJcbiAgICAgICAgICBOQUYubG9nLmVycm9yKGVycm9yQ29kZSwgZXJybWVzZyk7XHJcbiAgICAgICAgfVxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhhdC5lYXN5cnRjLmNvbm5lY3QodGhhdC5hcHAsIGNvbm5lY3RTdWNjZXNzLCBjb25uZWN0RmFpbHVyZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfZ2V0Um9vbUpvaW5UaW1lKGNsaWVudElkKSB7XHJcbiAgICB2YXIgbXlSb29tSWQgPSBOQUYucm9vbTtcclxuICAgIHZhciBqb2luVGltZSA9IHRoaXMuZWFzeXJ0Yy5nZXRSb29tT2NjdXBhbnRzQXNNYXAobXlSb29tSWQpW2NsaWVudElkXVxyXG4gICAgICAucm9vbUpvaW5UaW1lO1xyXG4gICAgcmV0dXJuIGpvaW5UaW1lO1xyXG4gIH1cclxuXHJcbiAgZ2V0U2VydmVyVGltZSgpIHtcclxuICAgIHJldHVybiBEYXRlLm5vdygpICsgdGhpcy5hdmdUaW1lT2Zmc2V0O1xyXG4gIH1cclxufVxyXG5cclxuTkFGLmFkYXB0ZXJzLnJlZ2lzdGVyKFwiZWFzeXJ0Y1wiLCBFYXN5UnRjQWRhcHRlcik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVhc3lSdGNBZGFwdGVyO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VSb290IjoiIn0=