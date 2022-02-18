/* global Eventful */

const { wrap, implement } = Eventful;

function group(label, callback) {
	console.group(label);
	callback();
	console.groupEnd();
}

let obj1, obj2, callback1, callback2;

group('WRAP', () => {
	group('INITIALIZE', () => {
		obj1 = wrap({});
		obj2 = wrap({});
	});

	group('ON "TEST"', () => {
		obj1.on('test', callback1 = () => void (console.log('1 - TEST A')));
		obj1.on('test', () => void console.log('1 - TEST B'));
		obj2.listenTo(obj1, 'test', callback2 = () => void (console.log('2 - TEST A')));
		obj2.listenTo(obj1, 'test', () => void console.log('2 - TEST B'));
	});

	group('TRIGGER "TEST"', () => {
		obj1.trigger('test');
	});

	group('TRIGGER "TEST"', () => {
		obj1.trigger('test');
	});

	group('OFF "TEST"', () => {
		obj1.off('test', callback1);
		obj2.stopListeningTo(obj1, 'test', callback2);
	});

	group('TRIGGER "TEST"', () => {
		obj1.trigger('test');
	});

	console.log('OBJ1', obj1);
	console.log('OBJ2', obj2);

	group('TERMINATE', () => {
		obj1.terminate();
		obj2.terminate();
	});

	group('TRIGGER "TEST"', () => {
		obj1.trigger('test');
	});
});

group('IMPLEMENT', () => {
	group('INITIALIZE', () => {
		obj1 = {};
		implement(obj1);

		obj2 = {};
		implement(obj2);
	});

	group('ON "TEST"', () => {
		obj1.on('test', callback1 = () => void (console.log('1 - TEST A')));
		obj1.on('test', () => void console.log('1 - TEST B'));
		obj2.listenTo(obj1, 'test', callback2 = () => void (console.log('2 - TEST A')));
		obj2.listenTo(obj1, 'test', () => void console.log('2 - TEST B'));
	});

	group('TRIGGER "TEST"', () => {
		obj1.trigger('test');
	});

	group('TRIGGER "TEST"', () => {
		obj1.trigger('test');
	});

	group('OFF "TEST"', () => {
		obj1.off('test', callback1);
		obj2.stopListeningTo(obj1, 'test', callback2);
	});

	group('TRIGGER "TEST"', () => {
		obj1.trigger('test');
	});

	console.log('OBJ1', obj1);
	console.log('OBJ2', obj2);

	group('TERMINATE', () => {
		obj1.terminate();
		obj2.terminate();
	});

	group('TRIGGER "TEST"', () => {
		obj1.trigger('test');
	});
});

group('EVENT TARGET WRAP', () => {
	group('INITIALIZE', () => {
		obj1 = wrap(document.createElement('div'));
		obj2 = wrap(document.createElement('div'));
	});

	group('ON "TEST"', () => {
		obj1.on('test', callback1 = () => void (console.log('1 - TEST A')));
		obj1.on('test', () => void console.log('1 - TEST B'));
		obj2.listenTo(obj1, 'test', callback2 = () => void (console.log('2 - TEST A')));
		obj2.listenTo(obj1, 'test', () => void console.log('2 - TEST B'));
	});

	group('TRIGGER "TEST"', () => {
		obj1.trigger('test');
	});

	group('TRIGGER "TEST"', () => {
		obj1.trigger('test');
	});

	group('OFF "TEST"', () => {
		obj1.off('test', callback1);
		obj2.stopListeningTo(obj1, 'test', callback2);
	});

	group('TRIGGER "TEST"', () => {
		obj1.trigger('test');
	});

	console.log('OBJ1', obj1);
	console.log('OBJ2', obj2);

	group('TERMINATE', () => {
		obj1.terminate();
		obj2.terminate();
	});

	group('TRIGGER "TEST"', () => {
		obj1.trigger('test');
	});
});

group('EVENT TARGET IMPLEMENT', () => {
	group('INITIALIZE', () => {
		obj1 = document.createElement('div');
		implement(obj1);

		obj2 = document.createElement('div');
		implement(obj2);
	});

	group('ON "TEST"', () => {
		obj1.on('test', callback1 = () => void (console.log('1 - TEST A')));
		obj1.on('test', () => void console.log('1 - TEST B'));
		obj2.listenTo(obj1, 'test', callback2 = () => void (console.log('2 - TEST A')));
		obj2.listenTo(obj1, 'test', () => void console.log('2 - TEST B'));
	});

	group('TRIGGER "TEST"', () => {
		obj1.trigger('test');
	});

	group('TRIGGER "TEST"', () => {
		obj1.trigger('test');
	});

	group('OFF "TEST"', () => {
		obj1.off('test', callback1);
		obj2.stopListeningTo(obj1, 'test', callback2);
	});

	group('TRIGGER "TEST"', () => {
		obj1.trigger('test');
	});

	console.log('OBJ1', obj1);
	console.log('OBJ2', obj2);

	group('TERMINATE', () => {
		obj1.terminate();
		obj2.terminate();
	});

	group('TRIGGER "TEST"', () => {
		obj1.trigger('test');
	});
});
