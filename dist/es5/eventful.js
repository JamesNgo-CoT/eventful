"use strict";

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true;
		Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps);
	Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/* global IdSequence */
var Eventful = function() {
	var _IdSequence = IdSequence,
		nextId = _IdSequence.next;
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
			value: function initialize() {
				this._id = nextId('eventful');
				this._events = {};
				this._listeningTo = {};
				return this;
			}
		},
		on: {
			enumerable: true,
			value: function on(event, handler, owner) {
				if (!this._events[event]) {
					this._events[event] = [];
				}

				var item = {
					handler: handler
				};

				if (owner) {
					item.owner = owner;

					if (!owner._listeningTo[this._id]) {
						owner._listeningTo[this._id] = {
							ref: this,
							handlers: []
						};
					}

					owner._listeningTo[this._id].handlers.push(handler);
				}

				this._events[event].push(item);

				return this;
			}
		},
		off: {
			enumerable: true,
			value: function off(event, handler, owner) {
				var _this = this;

				var process = function process(key) {
					var index = 0;

					while (index < _this._events[key].length) {
						var _this$_events$key$ind = _this._events[key][index],
							thisHandler = _this$_events$key$ind.handler,
							thisOwner = _this$_events$key$ind.owner;

						if ((!handler || handler === thisHandler) && (!owner || owner === thisOwner)) {
							if (thisOwner && thisOwner._listeningTo && thisOwner._listeningTo[_this._id]) {
								var handlerIndex = thisOwner._listeningTo[_this._id].handlers.indexOf(thisHandler);

								if (handlerIndex !== -1) {
									thisOwner._listeningTo[_this._id].handlers.splice(handlerIndex, 1);

									if (thisOwner._listeningTo[_this._id].handlers.length === 0) {
										delete thisOwner._listeningTo[_this._id];
									}
								}
							}

							_this._events[key].splice(index, 1);

							if (event && handler) {
								break;
							}
						} else {
							index++;
						}
					}

					if (_this._events[key].length === 0) {
						delete _this._events[key];
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
			}
		},
		trigger: {
			enumerable: true,
			value: function trigger(event) {
				if (this._events[event]) {
					var handlers = _toConsumableArray(this._events[event].map(function(_ref) {
						var handler = _ref.handler;
						return handler;
					}));

					for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
						args[_key - 1] = arguments[_key];
					}

					for (var index = 0, length = handlers.length; index < length; index++) {
						var handler = handlers[index];
						var returnValue = handler.call.apply(handler, [this].concat(args));

						if (returnValue && returnValue.off) {
							this.off(event, handler);
						}
					}
				}

				return this;
			}
		},
		listenTo: {
			enumerable: true,
			value: function listenTo(other, event, handler) {
				other.on(event, handler, this);
				return this;
			}
		},
		stopListeningTo: {
			enumerable: true,
			value: function stopListeningTo(other, event, handler) {
				var _this2 = this;

				var process = function process(key) {
					var ref = _this2._listeningTo[key].ref;
					ref.off(event, handler, _this2);
				};

				if (other) {
					if (this._listeningTo[other._id]) {
						process(other._id);
					}
				} else {
					for (var key in this._listeningTo) {
						process(key);
					}
				}

				return this;
			}
		},
		terminate: {
			enumerable: true,
			value: function terminate() {
				this.off();
				this.stopListeningTo();
			}
		}
	};

	function factory() {
		var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		return Object.defineProperties(obj, propertyDescriptors).initialize();
	}

	var Eventful = /*#__PURE__*/ _createClass(function Eventful() {
		_classCallCheck(this, Eventful);

		this.initialize();
	});

	Object.defineProperties(Eventful.prototype, propertyDescriptors);
	var domPropertyDescriptors = Object.assign({}, propertyDescriptors, {
		_listeners: {
			writable: true
		},
		initialize: {
			enumerable: true,
			value: function value() {
				propertyDescriptors.initialize.value.call(this);
				this._listeners = {};
			}
		},
		on: {
			value: function value(event, handler, owner) {
				var _this3 = this;

				propertyDescriptors.on.value.call(this, event, handler, owner);

				if (!this._listeners[event]) {
					this.addEventListener(event, this._listeners[event] = function() {
						for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
							args[_key2] = arguments[_key2];
						}

						_this3.trigger.apply(_this3, [event].concat(args));
					});
				}

				return this;
			}
		},
		off: {
			value: function value(event, handler, owner) {
				var events = [];

				if (event) {
					if (this._events[event]) {
						events.push(event);
					}
				} else {
					for (var key in this._events) {
						events.push(key);
					}
				}

				propertyDescriptors.off.value.call(this, event, handler, owner);

				for (var index = 0, length = events.length; index < length; index++) {
					var _event = events[index];

					if (this._listeners[_event] && !this._events[_event]) {
						this.removeEventListener(_event, this._listeners[_event]);
						delete this._listeners[_event];
					}
				}

				return this;
			}
		}
	});

	function domFactory(dom) {
		if (typeof dom === 'string') {
			dom = document.getElementById(dom);
		}

		return Object.defineProperties(dom, domPropertyDescriptors).initialize();
	}

	return {
		propertyDescriptors: propertyDescriptors,
		factory: factory,
		Eventful: Eventful,
		domPropertyDescriptors: domPropertyDescriptors,
		domFactory: domFactory
	};
}();
/* exported Eventful */
