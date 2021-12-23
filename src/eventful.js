const Eventful = (() => {
	let idCounter = 0;
	const propertyDescriptors = {
		_id: {
			writable: true
		},

		_events: {
			writable: true,
		},

		_listeningTo: {
			writable: true,
		},

		initialize: {
			enumerable: true,
			value() {
				this._id = `eventful${idCounter++}`;
				this._events = {};
				this._listeningTo = {};

				return this;
			}
		},

		on: {
			enumerable: true,
			value(event, handler, owner) {
				if (!this._events[event]) {
					this._events[event] = [];
				}

				const item = { handler };

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
			value(event, handler, owner) {
				const process = (key) => {
					let index = 0;
					while (index < this._events[key].length) {
						const { handler: thisHandler, owner: thisOwner } = this._events[key][index];
						if ((!handler || handler === thisHandler) && (!owner || owner === thisOwner)) {
							if (thisOwner && thisOwner._listeningTo && thisOwner._listeningTo[this._id]) {
								const handlerIndex = thisOwner._listeningTo[this._id].handlers.indexOf(thisHandler);
								if (handlerIndex !== -1) {
									thisOwner._listeningTo[this._id].handlers.splice(handlerIndex, 1);
									if (thisOwner._listeningTo[this._id].handlers.length === 0) {
										delete thisOwner._listeningTo[this._id];
									}
								}
							}

							this._events[key].splice(index, 1);

							if (event && handler) {
								break;
							}
						} else {
							index++;
						}
					}

					if (this._events[key].length === 0) {
						delete this._events[key];
					}
				};

				if (event) {
					if (this._events[event]) {
						process(event);
					}
				} else {
					for (const key in this._events) {
						process(key);
					}
				}

				return this;
			}
		},

		trigger: {
			enumerable: true,
			value(event, ...args) {
				if (this._events[event]) {
					const handlers = [...this._events[event].map(({ handler }) => handler)];
					for (let index = 0, length = handlers.length; index < length; index++) {
						const handler = handlers[index];
						const returnValue = handler.call(this, ...args);
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
			value(other, event, handler) {
				other.on(event, handler, this);

				return this;
			}
		},

		stopListeningTo: {
			enumerable: true,
			value(other, event, handler) {
				const process = (key) => {
					const { ref } = this._listeningTo[key];
					ref.off(event, handler, this);
				};

				if (other) {
					if (this._listeningTo[other._id]) {
						process(other._id);
					}
				} else {
					for (const key in this._listeningTo) {
						process(key);
					}
				}

				return this;
			}
		},

		terminate: {
			enumerable: true,
			value() {
				this.off();
				this.stopListeningTo();
			}
		}
	};

	function factory(obj = {}) {
		return Object.defineProperties(obj, propertyDescriptors)
			.initialize();
	}

	const Class = class {
		constructor() {
			this.initialize();
		}
	};
	Object.defineProperties(Class.prototype, propertyDescriptors);

	/* @if TARGET="NODEJS" **
	return {
		propertyDescriptors,
		factory,
		Class
	};
	/* @endif */
	/* @if TARGET="BROWSER" */
	const domPropertyDescriptors = Object.assign({}, propertyDescriptors, {
		_listeners: {
			writable: true
		},

		initialize: {
			enumerable: true,
			value() {
				propertyDescriptors.initialize.value.call(this);
				this._listeners = {};
			}
		},

		on: {
			value(event, handler, owner) {
				propertyDescriptors.on.value.call(this, event, handler, owner);

				if (!this._listeners[event]) {
					this.addEventListener(event, this._listeners[event] = (...args) => {
						this.trigger(event, ...args);
					});
				}

				return this;
			}
		},

		off: {
			value(event, handler, owner) {
				const events = [];
				if (event) {
					if (this._events[event]) {
						events.push(event);
					}
				} else {
					for (const key in this._events) {
						events.push(key);
					}
				}

				propertyDescriptors.off.value.call(this, event, handler, owner);

				for (let index = 0, length = events.length; index < length; index++) {
					const event = events[index];
					if (this._listeners[event] && !this._events[event]) {
						this.removeEventListener(event, this._listeners[event]);
						delete this._listeners[event];
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

		return Object.defineProperties(dom, domPropertyDescriptors)
			.initialize();
	}

	return {
		propertyDescriptors,
		factory,
		Class,
		domPropertyDescriptors,
		domFactory
	};
	/* @endif */
})();

/* @if MODULE="COMMONJS" */
module.exports = Eventful;
/* @endif */
/* @if MODULE!="ES6" **
/* exported Eventful */
/* @endif */
/* @if TARGET="BROWSER" && MODULE="ES6" **
export const {
	propertyDescriptors,
	factory,
	Class,
	domPropertyDescriptors,
	domFactory
} = Eventful;
/* @endif */
