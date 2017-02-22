describe('Radio', function() {
	var Radio = require('../radio');
	var radio_1,
		radio_1_1, radio_1_1_1, radio_1_1_2,
		radio_1_2, radio_1_2_1;
	var spy_1,
		spy_1_1, spy_1_1_1, spy_1_1_2,
		spy_1_2, spy_1_2_1;

	beforeEach(function() {
		radio_1 = new Radio();
		spy_1 = jasmine.createSpy('spy_1');
		radio_1.on('event', spy_1);

		radio_1_1 = radio_1.createChild('radio_1_1');
		spy_1_1 = jasmine.createSpy('spy_1_1');
		radio_1_1.on('event', spy_1_1);

		radio_1_1_1 = radio_1_1.createChild('radio_1_1_1');
		spy_1_1_1 = jasmine.createSpy('spy_1_1_1');
		radio_1_1_1.on('event', spy_1_1_1);

		radio_1_1_2 = radio_1_1.createChild('radio_1_1_2');
		spy_1_1_2 = jasmine.createSpy('spy_1_1_2');
		radio_1_1_2.on('event', spy_1_1_2);

		radio_1_2 = radio_1.createChild('radio_1_2');
		spy_1_2 = jasmine.createSpy('spy_1_2');
		radio_1_2.on('event', spy_1_2);

		radio_1_2_1 = radio_1_2.createChild('radio_1_2_1');
		spy_1_2_1 = jasmine.createSpy('spy_1_2_1');
		radio_1_2_1.on('event', spy_1_2_1);
	});

	describe('should emit event to parent', function() {
		beforeEach(function() {
			radio_1_1.emit('event');
		});

		it('radio_1', function() {
			expect(spy_1).toHaveBeenCalled();
		});

		describe('but not to', function() {
			it('itself', function() {
				expect(spy_1_1).not.toHaveBeenCalled();
			});

			it('sibling radio_1_2', function() {
				expect(spy_1_2).not.toHaveBeenCalled();
			});

			describe('child', function() {
				it('radio_1_1_1', function() {
					expect(spy_1_1_1).not.toHaveBeenCalled();
				});
				it('radio_1_1_2', function() {
					expect(spy_1_1_2).not.toHaveBeenCalled();
				});
			});

			it('to others', function() {
				expect(spy_1_2_1).not.toHaveBeenCalled();
			});
		})
	});

	describe('should deep emit event to all parents', function() {
		beforeEach(function() {
			radio_1_1_1.emit('event');
		});

		it('radio_1_1', function() {
			expect(spy_1_1).toHaveBeenCalled();
		});

		it('radio_1', function(){
			expect(spy_1).toHaveBeenCalled();
		});

		describe('but not to', function() {
			it('itself', function() {
				expect(spy_1_1_1).not.toHaveBeenCalled();
			});

			it('sibling', function() {
				expect(spy_1_1_2).not.toHaveBeenCalled();
			});

			describe('others', function() {
				it('radio_1_2', function() {
					expect(spy_1_2).not.toHaveBeenCalled();
				});

				it('radio_1_2_1', function() {
					expect(spy_1_2_1).not.toHaveBeenCalled();
				});
			});
		});
	});

	describe('should broadcats event to child', function() {
		beforeEach(function() {
			radio_1_1.broadcast('event');
		});

		it('radio_1_1_1', function() {
			expect(spy_1_1_1).toHaveBeenCalled();
		});
		it('radio_1_1_2', function() {
			expect(spy_1_1_2).toHaveBeenCalled();
		});

		describe('but not to', function() {
			it('itself', function(){
				expect(spy_1_1).not.toHaveBeenCalled();
			});

			it('sibling', function(){
				expect(spy_1_2).not.toHaveBeenCalled();
			});

			it('parent', function() {
				expect(spy_1).not.toHaveBeenCalled();
			})
		})
	});

	describe('should deep broadcast to child', function() {
		beforeEach(function() {
			radio_1.broadcast('event');
		});

		it('radio_1_1_1', function() {
			expect(spy_1_1_1).toHaveBeenCalled();
		});

		it('radio_1_1_2', function() {
			expect(spy_1_1_2).toHaveBeenCalled();
		});

		it('radio_1_2_1', function() {
			expect(spy_1_2_1).toHaveBeenCalled();
		});

		it('but not to itself', function() {
			expect(spy_1).not.toHaveBeenCalled();
		});
	});
});