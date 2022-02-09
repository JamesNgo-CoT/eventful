/* @if TARGET="NODEJS" */
const { next: nextId } = require('id-sequence');
/* @endif */
/* @if TARGET="BROWSER_ES6_MODULE" **
import { next as nextId } from './id-sequence.min.js';
/* @endif */
/* @if TARGET="BROWSER_ES5" || TARGET="BROWSER_ES6" **
/* global IdSequence */
/* @endif */
/* @if TARGET="BROWSER_ES5" || TARGET="BROWSER_ES6" **

const Eventful = (() => {
const { next: nextId } = IdSequence;
/* @endif */

const methods = {
	initialize() {
		this._id = nextId('eventful-');
		this._events = {};
		this._listeningTo = {};
		return this;
	},
	terminate() {
		this.off();
		this.stopListeningTo();
	},
	on(event, callback, owner) {
		if (!this._events[event]) {
			this._events[event] = [];
		}
		this._events[event].push({ callback, owner });
		if (owner) {
			if (!owner._listeningTo[this._id]) {
				owner._listeningTo[this._id] = {};
			}
			if (!owner._listeningTo[this._id][event]) {
				owner._listeningTo[this._id][event] = [];
			}
			owner._listeningTo[this._id][event].push({ other: this, callback });
		}
		return this;
	},
	off(event, callback, owner) {
		const process = (event) => {
			const array1 = this._events[event];
			let index1 = 0;
			while (index1 < array1.length) {
				const item1 = array1[index1];
				if ((callback == null || item1.callback === callback)
					&& (owner == null || item1.owner === owner)) {
					array1.splice(index1, 1);
					if (owner && owner._listeningTo[this._id] && owner._listeningTo[this._id][event]) {
						const array2 = owner._listeningTo[this._id][event];
						let index2 = 0;
						while (index2 < array2.length) {
							const item2 = array2[index2];
							if (item2.other === this && item2.callback === callback) {
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
			if (this._events[event].length === 0) {
				delete this._events[event];
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
	},
	trigger(event, ...args) {
		if (this._events[event]) {
			const array = [...this._events[event]];
			for (let index = 0, length = array.length; index < length; index++) {
				const item = array[index];
				item.callback.call(this, ...args);
			}
		}
		return this;
	},
	listenTo(other, event, callback) {
		other.on(event, callback, this);
		return this;
	},
	stopListeningTo(other, event, callback) {
		const process2 = (id, event) => {
			const array = [...this._listeningTo[id][event]];
			for (let index = 0, length = array.length; index < length; index++) {
				const item = array[index];
				item.other.off(event, callback, this);
			}
		};
		const process1 = (id) => {
			const listentingTo = this._listeningTo[id];
			if (event) {
				if (listentingTo[event]) {
					process2(id, event);
				}
			} else {
				for (const key in listentingTo) {
					process2(id, key);
				}
			}
		};
		if (other) {
			if (this._listeningTo[other._id]) {
				process1(other._id);
			}
		} else {
			for (const key in this._listeningTo) {
				process1(key);
			}
		}
		return this;
	}
};

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

/* @if TARGET="NODEJS" */
module.exports = { methods, propertyDescriptors };
/* @endif */
/* @if TARGET="BROWSER_ES5" || TARGET="BROWSER_ES6" || TARGET="BROWSER_ES6_MODULE" **
const targetMethods = Object.assign({}, methods, {
	initialize(target = this) {
		methods.initialize.call(this);
		this._target = target;
		this._listeners = {};
		return this;
	},
	on(event, callback, owner) {
		methods.on.call(this, event, callback, owner);
		if (!this._listeners[event]) {
			this._listeners[event] = (...args) => void this.trigger(event, ...args);
			this._target.addEventListener(event, this._listeners[event]);
		}
		return this;
	},
	off(event, callback, owner) {
		methods.off.call(this, event, callback, owner);
		const process = (event) => {
			this._target.removeEventListener(event, this._listeners[event]);
			this._listeners[event] = null;
		};
		if (event) {
			if (this._listeners[event] && (!this._events[event] || this._events[event].length === 0)) {
				process(event);
			}
		} else {
			for (const key in this._listeners) {
				if (!this._events[event] || this._events[event].length === 0) {
					process(key);
				}
			}
		}
		return this;
	}
});

const targetPropertyDescriptors = Object.assign({}, propertyDescriptors, {
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
/* @endif */

/* @if TARGET="BROWSER_ES6_MODULE" **
export { methods, propertyDescriptors, targetMethods, targetPropertyDescriptors };
/* @endif */
/* @if TARGET="BROWSER_ES5" || TARGET="BROWSER_ES6" **
return { methods, propertyDescriptors, targetMethods, targetPropertyDescriptors };
})();

/* exported Eventful */
/* @endif */
