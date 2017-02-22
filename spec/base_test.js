describe('Radio', function() {
	var Radio = require('../radio');
	var radio_1, radio_2;

	beforeEach(function(){
		radio_1 = new Radio();
		radio_2 = new Radio({
			sayHello: function() {
				return 'Hello World!';
			}
		});
	});

	it('should create instance of Radio', function() {
		expect(radio_1 instanceof Radio).toBe(true);
	});

	it('should create instance of Radio', function() {
		expect(radio_2 instanceof Radio).toBe(true);
	});

	it('should have unique cid', function() {
		expect(radio_1._cid).not.toEqual(radio_2._cid);
	});

	it('should have extended options', function() {
		var result = radio_2.sayHello();
		expect(result).toEqual('Hello World!');
	});
});