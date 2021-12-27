const jsTester = require('js-tester');

const { propertyDescriptors, factory, Class: Eventful } = require('../../index.js');

function commonTests() {
	return (data) => Promise.resolve(data)
		.then(jsTester('INITIAL', () => void 0)
			.test('Check "_id" property', ({ eventful }) => {
				console.log(eventful._id);
				return eventful._id && typeof eventful._id === 'string';
			})
			.test('Check "_events" property', ({ eventful }) => {
				console.log(eventful._events);
				return eventful._events && typeof eventful._events === 'object';
			})
			.test('Check "_listeningTo" property', ({ eventful }) => {
				console.log(eventful._listeningTo);
				return eventful._listeningTo && typeof eventful._listeningTo === 'object';
			})
			.test('Check "initialize" method', ({ eventful }) => {
				console.log(eventful.initialize);
				return typeof eventful.initialize === 'function';
			})
			.test('Check "on" method', ({ eventful }) => {
				console.log(eventful.on);
				return typeof eventful.on === 'function';
			})
			.test('Check "off" method', ({ eventful }) => {
				console.log(eventful.off);
				return typeof eventful.off === 'function';
			})
			.test('Check "trigger" method', ({ eventful }) => {
				console.log(eventful.trigger);
				return typeof eventful.trigger === 'function';
			})
			.test('Check "listenTo" method', ({ eventful }) => {
				console.log(eventful.listenTo);
				return typeof eventful.listenTo === 'function';
			})
			.test('Check "stopListeningTo" method', ({ eventful }) => {
				console.log(eventful.stopListeningTo);
				return typeof eventful.stopListeningTo === 'function';
			})
			.test('Check "terminate" method', ({ eventful }) => {
				console.log(eventful.terminate);
				return typeof eventful.terminate === 'function';
			})
			.promise)
		.then(jsTester('"ON" METHOD - A', (data) => {
			const { eventful } = data;
			data.handlerA = () => void console.log('TEST A');
			eventful.on('test', data.handlerA);
		})
			.test('Has "_events" item', ({ eventful }) => {
				console.log('TEST EVENT', eventful._events.test);
				return eventful._events.test.length === 1;
			}).promise)
		.then(jsTester('"ON" METHOD - B', (data) => {
			const { eventful } = data;
			data.handlerB = () => void console.log('TEST B');
			eventful.on('test', () => void console.log('TEST'));
		})
			.test('Has "_events" item', ({ eventful }) => {
				console.log('TEST EVENT', eventful._events.test);
				return eventful._events.test.length === 2;
			}).promise);
}

Promise.resolve()
	.then(jsTester('PROPERTY DESCRIPTOR', () => {
		return {
			eventful: Object.defineProperties({}, propertyDescriptors).initialize()
		};
	}).promise)
	.then(commonTests())

	.then(jsTester('FACTORY', () => {
		return {
			eventful: factory()
		};
	}).promise)
	.then(commonTests())

	.then(jsTester('CLASS', () => {
		return {
			eventful: new Eventful()
		};
	}).promise)
	.then(commonTests());
	// .then((data) => void console.log(JSON.stringify(data, null, 2)), (error) => void console.error(error));
