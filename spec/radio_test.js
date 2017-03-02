describe('Radio', function() {
	var Eventus = require('../eventus');
	require('../modules/observer')(Eventus);
	require('../modules/radio')(Eventus);

	var obj_1,
		channel,
		spy_1;

	it('should exists', function() {
		expect(Eventus.Radio).toBeDefined();
	});

	it('shoulb be instance of Evetus', function() {
		expect(Eventus.Radio instanceof Eventus).toEqual(true);
	});

	describe('should add method', function() {
		it('subscribe', function() {
			expect(Eventus.prototype.subscribe).toBeDefined();
		});
		it('unsubscribe', function() {
			expect(Eventus.prototype.subscribe).toBeDefined();
		});
	});

	describe('should create channel', function() {
		it('from itself', function() {
			channel = Eventus.Radio.channel('bar');
			expect(channel).toEqual(Eventus.Radio['bar']);
		});

		it('from Eventus instance', function() {
			obj_1 = new Eventus();
			obj_1.subscribe('bar', Function);
			expect(Eventus.Radio['bar']).toBeDefined();
		});
	});

	describe('should be', function() {
		beforeEach(function() {
			channel = Eventus.Radio.channel('baz');
			obj_1 = new Eventus();
			obj_1.subscribe('baz', Function);
		});

		it('able to be subscribed', function() {
			expect(obj_1._listening[channel._cid]).toBeDefined();
		});

		it('able to be unsubscribe', function() {
			obj_1.unsubscribe('baz');
			expect(obj_1._listening[channel._cid]).toBeUndefined();
		});
	});

	describe('Channel', function() {
		beforeEach(function() {
			channel = Eventus.Radio.channel('qux');
			spy = jasmine.createSpy();
		});

		it('should create reply', function() {
			Eventus.Radio.qux.reply('bat', spy);
			expect(Eventus.Radio.qux._replies['bat']).toBeDefined();
		});

		it('should create unique reply', function() {
			Eventus.Radio.qux.reply('xyz', spy);
			function addReplyWithSameName() {
				Eventus.Radio.qux.reply('xyz', Function);
			}
			expect(addReplyWithSameName).toThrow();
		});

		it('reply to request', function() {
			channel.reply('pug', spy);
			channel.request('pug');
			expect(spy).toHaveBeenCalled();
		});
	});

});