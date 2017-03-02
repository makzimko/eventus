describe('Eventus', function() {
	var Eventus = require('../eventus');
	var obj_1, obj_2;

	beforeEach(function(){
		obj_1 = new Eventus();
		obj_2 = new Eventus({
			sayHello: function() {
				return 'Hello World!';
			}
		});
	});

	it('should create instance of Radio', function() {
		expect(obj_1 instanceof Eventus).toBe(true);
	});

	it('should create instance of Radio', function() {
		expect(obj_2 instanceof Eventus).toBe(true);
	});

	it('should have unique cid', function() {
		expect(obj_1._cid).not.toEqual(obj_2._cid);
	});

	it('should have extended options', function() {
		var result = obj_2.sayHello();
		expect(result).toEqual('Hello World!');
	});

	it('should block specific methods', function() {
		var obj_3 = new Eventus({
			_block: ['trigger']
		});
		expect(obj_3.trigger).toThrow();
	})
});