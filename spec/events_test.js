describe('Radio', function() {
	var Radio = require('../radio');
	var radio;
	var handlers = {
		eventCallback: function() {
			console.log('executed');
		}
	};

	beforeEach(function() {
		radio = new Radio();
	});

	describe('should trigger', function() {
		it('events', function() {
			var spy = jasmine.createSpy();
			radio.on('event', spy);
			radio.trigger('event');
			radio.trigger('event');
			expect(spy).toHaveBeenCalledTimes(2);
		});

		it('event one time', function() {
			var spy = jasmine.createSpy();
			radio.once('event', spy);
			radio.trigger('event');
			radio.trigger('event');
			expect(spy).toHaveBeenCalledTimes(1);
		});

		it('event with specified options', function() {
			var spy = jasmine.createSpy();
			radio.on('event', spy);
			radio.trigger('event', 123);
			expect(spy).toHaveBeenCalledWith(123);
		});

		it('on destroy', function() {
			var spy = jasmine.createSpy();
			radio.on('destroy', spy);
			radio.destroy();
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('should remove event handlers', function() {
		var spy1, spy2, spy3;

		beforeEach(function() {
			spy1 = jasmine.createSpy('spy1');
			spy2 = jasmine.createSpy('spy2');
			spy3 = jasmine.createSpy('apy3');
			radio.on('event', spy1);
			radio.on('event', spy2);
			radio.on('other:event', spy3);
		});

		describe('for specified callback', function() {
			beforeEach(function(){
				radio.off('event', spy1);
				radio.trigger('event');
				radio.trigger('other:event');
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
				radio.off('event');
				radio.trigger('event');
				radio.trigger('other:event');
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
				radio.off();
				radio.trigger('event');
				radio.trigger('other:event');
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
			radio.destroy();
			expect(radio._events).toEqual({});
		});
	})

});