function init(Eventus) {
	Eventus.prototype.listen = listen;
	Eventus.prototype.unlisten = unlisten;
	Eventus.prototype._destroyListening = _destroyListening;
	Eventus.prototype._emitterDestroyer = _emitterDestroyer;
}

/**
 * Listen to event in another object
 * @param {Eventus} obj - object to listen
 * @param {string} name - event name
 * @param {function} callback - function to call on event
 * @memberof Eventus
 */
var listen = function(obj, name, callback) {
	if (!obj || !obj.on) return;
	var self = this;

	var listeners;
	if (this._listening[obj._cid]) {
		listeners = this._listening[obj._cid];
	} else {
		listeners = {
			'destroy': [],
			_obj: obj
		};
		listeners['destroy'].push({
			callback: this._emitterDestroyer.bind(this, obj._cid),
			original: this._emitterDestroyer.bind(this, obj._cid)
		});
		obj.on('destroy', listeners['destroy'][0].callback);
	}
	listeners[name] = listeners[name] || [];

	function listen() {
		var data = Array.prototype.slice.call(arguments);
		data.unshift(obj);
		callback.apply(this, data);
	}

	obj.on(name, listen);

	listeners[name].push({
		callback: listen,
		original: callback
	});

	this._listening[obj._cid] = listeners;

	bindDestroyer(this);
};

/**
 * Remove listener from another object
 * @param {Eventus} obj - object to listen
 * @param name - event name
 * @param callback - function to remove
 * @memberof Eventus
 */
var unlisten = function(obj, name, callback) {
	if (!obj || !obj.off) return;
	var listeners = this._listening[obj._cid] || {};
	listeners[name] = listeners[name] || [];

	if (name && callback) {
		var index = -1;
		for (i = 0; i < listeners[name].length; i++) {
			if (listeners[name][i].original == callback) {
				index = i;
			}
		}

		obj.off(name, listeners[name][index].callback);

		if (index >= 0) {
			listeners[name].splice(index, 1);
		}
		if (listeners[name].length === 0) {
			listeners[name] = undefined;
		}
	} else if (name) {
		var events = Object.keys(listeners[name]);
		for (i = 0; i < events.length; i++) {
			obj.off(name, listeners[name][events[i]].callback);
		}
		listeners[name] = undefined;
	} else {
		var events = Object.keys(listeners);
		for (i = 0; i < events.length; i++) {
			for (j = 0; j < listeners[events[i]].length; j++) {
				obj.off(events[i], listeners[events[i]][j].callback);
			}
		}
		listeners = undefined;
	}
	this._listening[obj._cid] = listeners;
};

/**
 * Bind event to destroy listenings
 * @param {Eventus} obj
 * @private
 */
function bindDestroyer(obj) {
	var events = obj._events['destroy'] || [];
	for (var i = 0; i < events.length; i++) {
		if (events[i] == _destroyListenings) {
			return;
		}
	}
	obj.on('destroy', obj._destroyListening);
}

var _emitterDestroyer = function(cid) {
	this._listening[cid] = undefined;
};

/**
 * Remove listening when object destroyed
 * @memberof Eventus
 * @private
 */
var _destroyListening = function() {
	var listening = this._listening;
	var objects = Object.keys(listening);
	for (var i = 0; i < objects.length; i++) {
		this.unlisten(listening[objects[i]]._obj);
	}
};

module.exports = init;