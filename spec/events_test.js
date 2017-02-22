describe('Eventus', function() {
	var Eventus = require('../eventus');
	var obj;
	var handlers = {
		eventCallback: function() {
			console.log('executed');
		}
	};

	beforeEach(function() {
		obj = new Eventus();
	});

	describe('should trigger', function() {
		it('events', function() {
			var spy = jasmine.createSpy();
			obj.on('event', spy);
			obj.trigger('event');
			obj.trigger('event');
			expect(spy).toHaveBeenCalledTimes(2);
		});

		it('event one time', function() {
			var spy = jasmine.createSpy();
			obj.once('event', spy);
			obj.trigger('event');
			obj.trigger('event');
			expect(spy).toHaveBeenCalledTimes(1);
		});

		it('event with specified options', function() {
			var spy = jasmine.createSpy();
			obj.on('event', spy);
			obj.trigger('event', 123);
			expect(spy).toHaveBeenCalledWith(123);
		});

		it('on destroy', function() {
			var spy = jasmine.createSpy();
			obj.on('destroy', spy);
			obj.destroy();
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('should remove event handlers', function() {
		var spy1, spy2, spy3;

		beforeEach(function() {
			spy1 = jasmine.createSpy('spy1');
			spy2 = jasmine.createSpy('spy2');
			spy3 = jasmine.createSpy('apy3');
			obj.on('event', spy1);
			obj.on('event', spy2);
			obj.on('other:event', spy3);
		});

		describe('for specified callback', function() {
			beforeEach(function(){
				obj.off('event', spy1);
				obj.trigger('event');
				obj.trigger('other:event');
			});

			it('spy1', function() {
				expect(spy1).not.toHaveBeenCalled();
			});

			it('but not to others', function() {
				expect(spy2).toHaveBeenCalled();
			});

			it('but not to others', function() {
				expect(spy3).toHaveBeenCalled();
			});
		});

		describe('for specified event', function() {
			beforeEach(function() {
				obj.off('event');
				obj.trigger('event');
				obj.trigger('other:event');
			});
			it('spy1', function() {
				expect(spy1).not.toHaveBeenCalled();
			});
			it('spy2', function() {
				expect(spy2).not.toHaveBeenCalled();
			});
			it('but not to others', function() {
				expect(spy3).toHaveBeenCalled();
			});
		});

		describe('for all events', function() {
			beforeEach(function() {
				obj.off();
				obj.trigger('event');
				obj.trigger('other:event');
			});

			it('spy1', function() {
				expect(spy1).not.toHaveBeenCalled();
			});

			it('spy2', function() {
				expect(spy2).not.toHaveBeenCalled();
			});

			it('spy3', function() {
				expect(spy3).not.toHaveBeenCalled();
			});
		});

		it('on destroy', function() {
			obj.destroy();
			expect(obj._events).toEqual({});
		});
	})

});