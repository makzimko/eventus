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
	for (var i = 0; i < attrs.length; i++) {
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
 * @param name - event name
 * @param data - event data
 */
Radio.prototype.trigger = function(name, data) {
	var listeners = this._events[name];
	var args = Array.prototype.splice.call(arguments, 1);
	if (listeners) {
		for (var i = 0; i < listeners.length; i++) {
			listeners[i].apply(this, args);
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
 * @param {string|Radio} element
 */
Radio.prototype.removeChild = function(element) {
	var option = typeof element == 'string' ? 'name' : 'instance';
	for (var i = 0; i < this._child.length; i++) {
		if (this._child[i][option] == element) {
			var obj = this._child[i];
			delete this[obj.name];
			this._child.splice(i, 1);

			this.trigger('child:remove', obj.name, obj.instance);
			obj.instance.destroy();
		}
	}
};

/**
 * Destroy object
 */
Radio.prototype.destroy = function() {
	if (this._child.length) {
		for (var i = 0; i < this._child.length; i++) {
			this.removeChild(this._child[i].name);
		}
	}
	this.trigger('destroy');
	this.off();
};

/**
 * Emit event to all parents
 * @param {string} name - event name
 * @param {object} data - event data
 */
Radio.prototype.emit = function(name, data, beginner) {
	if (!beginner) {
		beginner = this;
	} else {
		this.trigger(name, data, beginner);
	}
	if (this._parent) {
		this._parent.emit(name, data, beginner);
	}
};

/**
 * Broadcast event to all children
 * @param name
 * @param data
 */
Radio.prototype.broadcast = function(name, data, beginner) {
	if (!beginner) {
		beginner = this;
	} else {
		this.trigger(name, data, beginner);
	}
	if (this._child.length) {
		for (var i = 0; i < this._child.length; i++) {
			this._child[i].instance.broadcast(name, data, beginner);
		}
	}
};

Radio.prototype.constructor = Radio;
// public
module.exports = Radio;
