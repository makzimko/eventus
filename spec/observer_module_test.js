describe('Observer', function() {
	var Eventus = require('../eventus');
	require('../modules/observer')(Eventus);

	var obj_1, obj_2,
		spy;

	describe('should add method', function() {
		it('listen', function() {
			expect(Eventus.prototype.listen).toBeDefined();
		});

		it('unlisten', function() {
			expect(Eventus.prototype.unlisten).toBeDefined();
		});

		it('_destroyListening', function() {
			expect(Eventus.prototype._destroyListening).toBeDefined();
		});

		it('._emitterDestroyer', function() {
			expect(Eventus.prototype._emitterDestroyer).toBeDefined();
		});
	});

	describe('should', function() {
		beforeEach(function() {
			obj_1 = new Eventus();
			obj_2 = new Eventus();

			spy = jasmine.createSpy();

			obj_1.listen(obj_2, 'event', spy);
		});

		describe('create', function() {
			it('listening', function() {
				expect(obj_1._listening[obj_2._cid]).toBeDefined();
			});

			it('listener', function() {
				expect(obj_2._events['event']).toBeDefined();
			});
		});

		it('react on event', function() {
			obj_2.trigger('event', {some: 'option'});
			expect(spy).toHaveBeenCalledWith(obj_2, {some: 'option'});
		});

		describe('remove', function() {
			describe('specified listening', function() {
				beforeEach(function() {
					obj_1.unlisten(obj_2, 'event', spy);
				});

				it('from listener', function() {
					expect(obj_1._listening[obj_2._cid]['event']).toBeUndefined();
				});

				it('from emitter', function() {
					expect(obj_2._events['event']).toBeUndefined();
				});
			});

			describe('listening by event name', function() {
				beforeEach(function() {
					obj_1.unlisten(obj_2, 'event');
				});

				it('from listener', function() {
					expect(obj_1._listening[obj_2._cid]['event']).toBeUndefined();
				});

				it('from emitter', function() {
					expect(obj_2._events['event']).toBeUndefined();
				});
			});

			describe('listening of object', function() {
				beforeEach(function() {
					obj_1.unlisten(obj_2);
				});

				it('from listener', function() {
					expect(obj_1._listening[obj_2._cid]).toBeUndefined();
				});

				it('from emitter', function() {
					expect(obj_2._events['event']).toBeUndefined();
				});
			});

			describe('listening on destroy', function() {
				it('source', function() {
					obj_1.destroy();
					expect(obj_1._listening[obj_2._cid]).toBeUndefined();
				});

				it('emitter', function() {
					obj_2.destroy();
					expect(obj_1._listening[obj_2._cid]).toBeUndefined();
				});
			});

			describe('events on destroy', function() {
				it('source', function() {
					obj_1.destroy();
					expect(obj_2._events['event']).toBeUndefined();
				});

				it('emitter', function() {
					obj_2.destroy();
					expect(obj_2._events).toEqual({});
				});
			})
		});
	});
});