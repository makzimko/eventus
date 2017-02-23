describe('Eventus', function() {
	var Eventus = require('../eventus');
	var obj_1, obj_1_1, obj_1_2, obj_1_1_1;

	beforeEach(function() {
		obj_1 = new Eventus();
		obj_1_1 = obj_1.createChild('obj_1_1');
		obj_1_2 = obj_1.createChild('obj_1_2');
		obj_1_1_1 = obj_1_1.createChild('obj_1_1_1');
	});

	describe('should create', function() {
		it('2 children elements', function() {
			expect(obj_1._child.length).toEqual(2);
		});

		it('deep children elements', function() {
			expect(obj_1.obj_1_1._child.length).toEqual(1);
		});
	});

	describe('should have links to', function() {
		it('child elements', function() {
			expect(obj_1.obj_1_1).toEqual(obj_1_1);
		});

		it('deeper child element', function() {
			expect(obj_1.obj_1_1.obj_1_1_1).toEqual(obj_1_1_1);
		});

		it('parent element', function() {
			expect(obj_1_1_1._parent).toEqual(obj_1_1);
		})
	});

	describe('should remove child element', function() {
		it('by name', function() {
			obj_1.removeChild('obj_1_2');
			expect(obj_1.obj_1_2).toBeUndefined();
		});

		it('by object', function() {
			obj_1.removeChild(obj_1_1);
			expect(obj_1.obj_1_1).toBeUndefined();
		})
	});

	it('should have unique names for child elements', function() {
		function addElementWithSameName(){
			obj_1.createChild('obj_1_2');
		}
		expect(addElementWithSameName).toThrow();
	});

	it('should requires name for child element', function() {
		function addElementWithoutName() {
			obj_1.createChild();
		}
		expect(addElementWithoutName).toThrow();
	});

	describe('should trigger event when', function() {
		var spy_1, spy_2, child;
		beforeEach(function() {
			spy_1 = jasmine.createSpy();
			spy_2 = jasmine.createSpy();
			obj_1.on('child:add', spy_1);
			obj_1.on('child:remove', spy_2);
			child = obj_1.createChild('child');
		});

		it('child added', function() {
			expect(spy_1).toHaveBeenCalledWith('child', child);
		});

		it('child removed', function() {
			obj_1.removeChild('child');
			expect(spy_2).toHaveBeenCalledWith('child', child);
		});
	});

});