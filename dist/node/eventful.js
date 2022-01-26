const { next: nextId } = require('id-sequence');

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
		value: function off(event, handler, owner) {
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
		value: function trigger(event, ...args) {
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
		value: function listenTo(other, event, handler) {
			other.on(event, handler, this);

			return this;
		}
	},

	stopListeningTo: {
		enumerable: true,
		value: function stopListeningTo(other, event, handler) {
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
		value: function terminate() {
			this.off();
			this.stopListeningTo();
		}
	}
};

function factory(obj = {}) {
	return Object.defineProperties(obj, propertyDescriptors)
		.initialize();
}

const Eventful = class {
	constructor() {
		this.initialize();
	}
};
Object.defineProperties(Eventful.prototype, propertyDescriptors);

module.exports = { propertyDescriptors, factory, Eventful };
