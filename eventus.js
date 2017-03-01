/**
 * Eventus
 *
 * @param {object} options
 * @constructor
 */
function Eventus(options) {
	options = options || {};
	// get new unique ID for object
	this._cid = ++ arguments.callee.prototype.counter;
	this._events = {};
	this._listening = {};

	this._parent = null;
	this._child = [];

	assignOptions(this, options);

	this.trigger('init', options);
}
Eventus.prototype = {
	counter: 0
};

/**
 * Assign options to object
 * @param {Eventus} obj
 * @param {object} options
 * @private
 */
function assignOptions(obj, options) {
	var attrs = Object.keys(options);
	for (var i = 0; i < attrs.length; i++) {
		var key = attrs[i];

		switch (key) {
			case 'events':
				var events = Object.keys(options[key]);
				for (var j = 0; j < events.length; j++) {
					obj.on(events[j], options[key][events[j]]);
				}
				break;
			default:
				obj[key] = options[key];
		}
	}
}

/**
 * Add event listener
 * @param {string} name - event name
 * @param {function} callback - function to call on this event
 */
Eventus.prototype.on = function(name, callback) {
	this._events[name] = this._events[name] || [];
	this._events[name].push(callback);
};

/**
 * Add one time listener
 * @param {string} name - event name
 * @param {function} callback - function to call on this event
 */
Eventus.prototype.once = function(name, callback) {
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
Eventus.prototype.off = function(name, callback) {
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
Eventus.prototype.trigger = function(name, data) {
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
 * @returns {Eventus}
 */
Eventus.prototype.createChild = function(name, options) {
	if (!name) { throw new Error('Argument name is required'); }
	if (this[name]) { throw new Error('Child element with name ' + name + ' already exists'); }

	var newObj = new Eventus(options);
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
 * @param {string|Eventus} element
 */
Eventus.prototype.removeChild = function(element) {
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
Eventus.prototype.destroy = function() {
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
Eventus.prototype.emit = function(name, data, beginner) {
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
Eventus.prototype.broadcast = function(name, data, beginner) {
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

Eventus.prototype.constructor = Eventus;
// public
module.exports = Eventus;
