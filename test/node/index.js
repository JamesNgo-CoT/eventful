const { methods, propertyDescriptors } = require('../../index.js');

let callback1, callback2;

console.log('### 1 ###');

const obj1 = { ...methods }.initialize();
obj1.on('test', callback1 = (...args) => void console.log('1 - TEST 1', ...args));
obj1.on('test', (...args) => void console.log('1 - TEST 2', ...args));
obj1.on('test', (...args) => void console.log('1 - TEST 3', ...args));
obj1.trigger('test', 1, 2, 3);
obj1.trigger('test', 4, 5);
obj1.off('test', callback1);
obj1.trigger('test', true);

console.log('### 2 ###');

const obj2 = Object.defineProperties({}, propertyDescriptors).initialize();
obj2.on('test', callback1 = (...args) => void console.log('2 - TEST 1', ...args));
obj2.on('test', (...args) => void console.log('2 - TEST 2', ...args));
obj2.on('test', (...args) => void console.log('2 - TEST 3', ...args));
obj2.trigger('test', 1, 2, 3);
obj2.trigger('test', 4, 5);
obj2.off('test', callback1);
obj2.trigger('test', true);

console.log('### 3 ###');

obj1.listenTo(obj2, 'test', callback2 = (...args) => void console.log('1 - TEST 4', ...args));
obj1.listenTo(obj2, 'test', (...args) => void console.log('1 - TEST 5', ...args));
obj2.trigger('test', false);

console.log('### 4 ###');

obj1.stopListeningTo(obj2, 'test', callback2);
obj2.trigger('test', 'string');
