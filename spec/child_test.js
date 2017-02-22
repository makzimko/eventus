describe('Radio', function() {
	var Radio = require('../radio');
	var radio_1, radio_1_1, radio_1_2, radio_1_1_1;

	beforeEach(function() {
		radio_1 = new Radio();
		radio_1_1 = radio_1.createChild('radio_1_1');
		radio_1_2 = radio_1.createChild('radio_1_2');
		radio_1_1_1 = radio_1_1.createChild('radio_1_1_1');
	});

	describe('should create', function() {
		it('2 children elements', function() {
			expect(radio_1._child.length).toEqual(2);
		});

		it('deep children elements', function() {
			expect(radio_1.radio_1_1._child.length).toEqual(1);
		});
	});

	describe('should have links to', function() {
		it('child elements', function() {
			expect(radio_1.radio_1_1).toEqual(radio_1_1);
		});

		it('deeper child element', function() {
			expect(radio_1.radio_1_1.radio_1_1_1).toEqual(radio_1_1_1);
		});

		it('parent element', function() {
			expect(radio_1_1_1._parent).toEqual(radio_1_1);
		})
	});

	describe('should remove child element', function() {
		it('by name', function() {
			radio_1.removeChild('radio_1_2');
			expect(radio_1.radio_1_2).toBeUndefined();
		});

		it('by object', function() {
			radio_1.removeChild(radio_1_1);
			expect(radio_1.radio_1_1).toBeUndefined();
		})
	});

	it('should have unique names for child elements', function() {
		function addElementWithSameName(){
			radio_1.createChild('radio_1_2');
		}
		expect(addElementWithSameName).toThrow();
	});

	it('should requires name for child element', function() {
		function addElementWithoutName() {
			radio_1.createChild();
		}
		expect(addElementWithoutName).toThrow();
	});

	describe('should trigger event when', function() {
		var spy_1, spy_2, child;
		beforeEach(function() {
			spy_1 = jasmine.createSpy();
			spy_2 = jasmine.createSpy();
			radio_1.on('child:add', spy_1);
			radio_1.on('child:remove', spy_2);
			child = radio_1.createChild('child');
		});

		it('child added', function() {
			expect(spy_1).toHaveBeenCalledWith('child', child);
		});

		it('child removed', function() {
			radio_1.removeChild('child');
			expect(spy_2).toHaveBeenCalledWith('child', child);
		});
	});

});