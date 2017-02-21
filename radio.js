/**
 * Radio
 *
 * @constructor
 */
function Radio() {
	// get new unique ID for object
	this._cid = ++ arguments.callee.prototype.counter;
	this._events = {};
	this._listening = {};
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

Radio.prototype.constructor = Radio;
// public
module.exports = Radio;