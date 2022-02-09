"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/* global IdSequence */
var Eventful = function () {
  var _IdSequence = IdSequence,
      nextId = _IdSequence.next;
  var methods = {
    initialize: function initialize() {
      this._id = nextId('eventful-');
      this._events = {};
      this._listeningTo = {};
      return this;
    },
    terminate: function terminate() {
      this.off();
      this.stopListeningTo();
    },
    on: function on(event, callback, owner) {
      if (!this._events[event]) {
        this._events[event] = [];
      }

      this._events[event].push({
        callback: callback,
        owner: owner
      });

      if (owner) {
        if (!owner._listeningTo[this._id]) {
          owner._listeningTo[this._id] = {};
        }

        if (!owner._listeningTo[this._id][event]) {
          owner._listeningTo[this._id][event] = [];
        }

        owner._listeningTo[this._id][event].push({
          other: this,
          callback: callback
        });
      }

      return this;
    },
    off: function off(event, callback, owner) {
      var _this = this;

      var process = function process(event) {
        var array1 = _this._events[event];
        var index1 = 0;

        while (index1 < array1.length) {
          var item1 = array1[index1];

          if ((callback == null || item1.callback === callback) && (owner == null || item1.owner === owner)) {
            array1.splice(index1, 1);

            if (owner && owner._listeningTo[_this._id] && owner._listeningTo[_this._id][event]) {
              var array2 = owner._listeningTo[_this._id][event];
              var index2 = 0;

              while (index2 < array2.length) {
                var item2 = array2[index2];

                if (item2.other === _this && item2.callback === callback) {
                  array2.splice(index2, 1);

                  if (event && callback) {
                    break;
                  }

                  continue;
                }

                index2++;
              }
            }

            if (event && callback) {
              break;
            }

            continue;
          }

          index1++;
        }

        if (_this._events[event].length === 0) {
          delete _this._events[event];
        }
      };

      if (event) {
        if (this._events[event]) {
          process(event);
        }
      } else {
        for (var key in this._events) {
          process(key);
        }
      }

      return this;
    },
    trigger: function trigger(event) {
      if (this._events[event]) {
        var array = _toConsumableArray(this._events[event]);

        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        for (var index = 0, length = array.length; index < length; index++) {
          var _item$callback;

          var item = array[index];

          (_item$callback = item.callback).call.apply(_item$callback, [this].concat(args));
        }
      }

      return this;
    },
    listenTo: function listenTo(other, event, callback) {
      other.on(event, callback, this);
      return this;
    },
    stopListeningTo: function stopListeningTo(other, event, callback) {
      var _this2 = this;

      var process2 = function process2(id, event) {
        var array = _this2._listeningTo[id][event];

        for (var index = 0, length = array.length; index < length; index++) {
          var item = array[index];
          item.other.off(event, callback, _this2);
        }
      };

      var process1 = function process1(id) {
        var listentingTo = _this2._listeningTo[id];

        if (event) {
          if (listentingTo[event]) {
            process2(id, event);
          }
        } else {
          for (var key in listentingTo) {
            process2(id, key);
          }
        }
      };

      if (other) {
        if (this._listeningTo[other._id]) {
          process1(other._id);
        }
      } else {
        for (var key in this._listeningTo) {
          process1(key);
        }
      }

      return this;
    }
  };
  var propertyDescriptors = {
    _id: {
      writable: true
    },
    _events: {
      writable: true
    },
    _listeningTo: {
      writable: true
    },
    initialize: {
      enumerable: true,
      value: methods.initialize
    },
    terminate: {
      enumerable: true,
      value: methods.terminate
    },
    on: {
      enumerable: true,
      value: methods.on
    },
    off: {
      enumerable: true,
      value: methods.off
    },
    trigger: {
      enumerable: true,
      value: methods.trigger
    },
    listenTo: {
      enumerable: true,
      value: methods.listenTo
    },
    stopListeningTo: {
      enumerable: true,
      value: methods.stopListeningTo
    }
  };
  var targetMethods = Object.assign({}, methods, {
    initialize: function initialize() {
      var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this;
      methods.initialize.call(this);
      this._target = target;
      this._listeners = {};
      return this;
    },
    on: function on(event, callback, owner) {
      var _this3 = this;

      methods.on.call(this, event, callback, owner);

      if (!this._listeners[event]) {
        this._listeners[event] = function () {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          return void _this3.trigger.apply(_this3, [event].concat(args));
        };

        this._target.addEventListener(event, this._listeners[event]);
      }

      return this;
    },
    off: function off(event, callback, owner) {
      var _this4 = this;

      methods.off.call(this, event, callback, owner);

      var process = function process(event) {
        _this4._target.removeEventListener(event, _this4._listeners[event]);

        _this4._listeners[event] = null;
      };

      if (event) {
        if (this._listeners[event] && (!this._events[event] || this._events[event].length === 0)) {
          process(event);
        }
      } else {
        for (var key in this._listeners) {
          if (!this._events[event] || this._events[event].length === 0) {
            process(key);
          }
        }
      }

      return this;
    }
  });
  var targetPropertyDescriptors = Object.assign({}, propertyDescriptors, {
    _target: {
      writable: true
    },
    _listeners: {
      writable: true
    },
    initialize: {
      enumerable: true,
      value: targetMethods.initialize
    },
    on: {
      enumerable: true,
      value: targetMethods.on
    },
    off: {
      enumerable: true,
      value: targetMethods.off
    }
  });
  return {
    methods: methods,
    propertyDescriptors: propertyDescriptors,
    targetMethods: targetMethods,
    targetPropertyDescriptors: targetPropertyDescriptors
  };
}();
/* exported Eventful */