/**
 * Radio
 *
 * @constructor
 */
function Radio() {
	this._events = {};
}
Radio.prototype = {};

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