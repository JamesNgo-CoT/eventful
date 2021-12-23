const jsTester = require('js-tester');

const { propertyDescriptors, factory, Class: Eventful } = require('../../index.js');

Promise.resolve()
	.then(jsTester('PROPERTY DESCRIPTOR', () => Object.defineProperties({}, propertyDescriptors).initialize())
		.test('Has "on" method', (eventful) => typeof eventful.on === 'function')
		.test('Has "off" method', (eventful) => typeof eventful.off === 'function')
		.test('Has "trigger" method', (eventful) => typeof eventful.trigger === 'function')
		.test('Has "listenTo" method', (eventful) => typeof eventful.listenTo === 'function')
		.test('Has "stopListeningTo" method', (eventful) => typeof eventful.stopListeningTo === 'function')
		.promise)
	.then(jsTester('FACTORY', () => factory().initialize())
		.test('Has "on" method', (eventful) => typeof eventful.on === 'function')
		.test('Has "off" method', (eventful) => typeof eventful.off === 'function')
		.test('Has "trigger" method', (eventful) => typeof eventful.trigger === 'function')
		.test('Has "listenTo" method', (eventful) => typeof eventful.listenTo === 'function')
		.test('Has "stopListeningTo" method', (eventful) => typeof eventful.stopListeningTo === 'function')
		.promise)
	.then(jsTester('CLASS', () => new Eventful())
		.test('Has "on" method', (eventful) => typeof eventful.on === 'function')
		.test('Has "off" method', (eventful) => typeof eventful.off === 'function')
		.test('Has "trigger" method', (eventful) => typeof eventful.trigger === 'function')
		.test('Has "listenTo" method', (eventful) => typeof eventful.listenTo === 'function')
		.test('Has "stopListeningTo" method', (eventful) => typeof eventful.stopListeningTo === 'function')
		.promise)
	.then((data) => void console.log(JSON.stringify(data, null, 2)), (error) => void console.error(error));

// function addMethodTests(tester) {
// 	return tester
// 		.test('Has "on" method', ({ eventful }) => {
// 			return typeof eventful.on === 'function';
// 		})
// 		.test('Has "off" method', ({ eventful }) => {
// 			return typeof eventful.off === 'function';
// 		})
// 		.test('Has "trigger" method', ({ eventful }) => {
// 			return typeof eventful.trigger === 'function';
// 		})
// 		.test('Has "listenTo" method', ({ eventful }) => {
// 			return typeof eventful.listenTo === 'function';
// 		})
// 		.test('Has "stopListeningTo" method', ({ eventful }) => {
// 			return typeof eventful.stopListeningTo === 'function';
// 		});
// }

// Promise.resolve()
// 	.then(
// 		addMethodTests(jsTester('USE PROPERTY DESCRIPTORS', (value) => {
// 			value.eventful = Object.defineProperties({}, propertyDescriptors);
// 		})).func()
// 	)
// 	.then(
// 		(jsTester('CALL "ON" EVENT', (value) => {
// 			value.on('eventName', (...args) => {
// 				console.log('EVENT NAME', ...args);
// 			});
// 		})).func()
// 	)
// 	.then(
// 		addMethodTests(jsTester('USE FACTORY', () => {
// 			return factory();
// 		})).func()
// 	)
// 	.then(
// 		addMethodTests(jsTester('USE CLASS', () => {
// 			return new Class();
// 		})).func()
// 	)
// 	.then((value) => {
// 		console.log('VALUE', value);
// 	}, (error) => {
// 		console.error('ERROR', error);
// 	});


