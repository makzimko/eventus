/**
 * Radio
 *
 * @param {object} options
 * @constructor
 */
function Radio(options) {
	options = options || {};
	// get new unique ID for object
	this._cid = ++ arguments.callee.prototype.counter;
	this._events = {};
	this._listening = {};

	this._parent = null;
	this._child = [];

	var attrs = Object.keys(options);
	for (i = 0; i < attrs.length; i++) {
		var key = attrs[i];
		this[key] = options[key];
	}

}
Radio.prototype = {
	counter: 0
};

/**
 * Add event listener
 * @param {string} name - event name
 * @param {function} callback - function to call on this event
 */
Radio.prototype.on = function(name, callback) {
	this._events[name] = this._events[name] || [];
	this._events[name].push(callback);
};

/**
 * Add one time listener
 * @param {string} name - event name
 * @param {function} callback - function to call on this event
 */
Radio.prototype.once = function(name, callback) {
	var self = this;
	this.on(name, function once(data) {
		callback.call(self, data);
		self.off(name, once);
	});
};

/**
 * Remove event listener
 * @param {string} name - event name
 * @param {function} callback - function to remove
 */
Radio.prototype.off = function(name, callback) {
	if (name) {
		if (this._events[name]) {
			if (callback) {
				var index = this._events[name].indexOf(callback);
				if (index >= 0) {
					this._events[name].splice(index, 1);
				}
				if (this._events[name].length === 0) {
					this._events[name] = undefined;
				}
			} else {
				this._events[name] = undefined;
			}
		}
	} else {
		this._events = {};
	}
};

/**
 * Trigger each listener for event
 * @param name
 * @param data
 */
Radio.prototype.trigger = function(name, data) {
	var listeners = this._events[name];
	if (listeners) {
		for (i = 0; i < listeners.length; i++) {
			listeners[i].call(this, data);
		}
	}
};

/**
 * Create child element
 * @param {string} name
 * @param {object} options
 * @returns {Radio}
 */
Radio.prototype.createChild = function(name, options) {
	if (!name) { throw new Error('Argument name is required'); }
	if (this[name]) { throw new Error('Child element with name ' + name + ' already exists'); }

	var newObj = new Radio(options);
	newObj._parent = this;

	this._child.push({
		name: name,
		instance: newObj
	});
	this[name] = newObj;

	this.trigger('child:add', name, newObj);
	return newObj;
};

/**
 * Remove child element
 * @param element
 */
Radio.prototype.removeChild = function(element) {
	var option = typeof element == 'string' ? 'name' : 'instance';
	for (i = 0; i < this._child.length; i++) {
		if (this._child[i][option] == element) {
			var obj = this._child[i];
			delete this[obj.name];
			this._child.splice(i, 1);

			this.trigger('child:remove', obj.name, obj.instance);
			obj.destroy();
		}
	}
};

/**
 * Destroy object
 */
Radio.prototype.destroy = function() {
	if (this._child.length) {
		for (i = 0; i < this._child.length; i++) {
			this.removeChild(this._child[i].name);
		}
	}
	this.trigger('destroy');
	this.off();
};

Radio.prototype.constructor = Radio;
// public
module.exports = Radio;