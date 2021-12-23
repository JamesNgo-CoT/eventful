const jsTester = require('js-tester');

const { propertyDescriptors, factory, Class: Eventful } = require('../../index.js');

function commonTests() {
	return (data) => Promise.resolve(data)
		.then(jsTester('INITIAL', () => { })
			.test('Has "on" method', ({ eventful }) => typeof eventful.on === 'function')
			.test('Has "off" method', ({ eventful }) => typeof eventful.off === 'function')
			.test('Has "trigger" method', ({ eventful }) => typeof eventful.trigger === 'function')
			.test('Has "listenTo" method', ({ eventful }) => typeof eventful.listenTo === 'function')
			.test('Has "stopListeningTo" method', ({ eventful }) => typeof eventful.stopListeningTo === 'function')
			.promise)
		.then(jsTester('"ON" METHOD - A', (data) => {
			const { eventful } = data;
			data.handlerA = () => void console.log('TEST A');
			eventful.on('test', data.handlerA);
		})
			.test('Has "_events" item', ({ eventful }) => {
				return eventful._events.test.length === 1;
			}).promise)
		.then(jsTester('"ON" METHOD - B', (data) => {
			const { eventful } = data;
			data.handlerB = () => void console.log('TEST B');
			eventful.on('test', () => void console.log('TEST'));
		})
			.test('Has "_events" item', ({ eventful }) => {
				return eventful._events.test.length === 2;
			}).promise);
}

Promise.resolve()
	.then(jsTester('PROPERTY DESCRIPTOR', () => ({
		eventful: Object.defineProperties({}, propertyDescriptors).initialize()
	})).promise)
	.then(commonTests())

	.then(jsTester('FACTORY', () => ({ eventful: factory() })).promise)
	.then(commonTests())

	.then(jsTester('CLASS', () => ({ eventful: new Eventful() })).promise)
	.then(commonTests());
	// .then((data) => void console.log(JSON.stringify(data, null, 2)), (error) => void console.error(error));
