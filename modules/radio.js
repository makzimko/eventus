var _proto;

function init(Eventus) {
    _proto = Eventus.prototype;

    Eventus.Radio = new Eventus(RadioPrototype);

    Eventus.prototype.subscribe = subscribe;
    Eventus.prototype.unsubscribe = unsubscribe;
}

var ChannelPrototype = {
    _block: ['on', 'once', 'off', 'createChild', 'removeChild']
};

/**
 * Trigger event on channel
 * @param {string} name - event name
 * @param {object} data - event data
 * @public
 */
ChannelPrototype.trigger = function(name, data) {
    var listeners = this._events['radio'];
    var args = Array.prototype.slice.call(arguments);
    if (listeners) {
        for (var i = 0; i < listeners.length; i++) {
            listeners[i].apply(this, args);
        }
    }
};

ChannelPrototype.reply = function(name, callback) {
    this._replies = this._replies || {};

    if (this._replies[name]) {
        throw new Error('Reply with name ' + name + ' already exists');
    }

    this._replies[name] = callback;
};

ChannelPrototype.request = function(name) {
    var args = Array.prototype.splice.call(arguments, 1);
    var reply = this._replies && this._replies[name] || Function;
    return reply.apply(name, args);
};

var RadioPrototype = {
    _block: ['on', 'once', 'off', 'createChild', 'removeChild', 'trigger']
};

/**
 * Get channel by name or create it if needed
 * @param {string} name
 * @public
 * @memberof Eventus.Radio
 */
RadioPrototype.channel = function(name) {
    var channel = this[name];
    if (channel && channel instanceof this.constructor === false) {
        throw new Error('Cant get channel ' + name + '. Name is reserved');
    } else if (!channel) {
        this[name] = channel = _proto.createChild.call(this, name, ChannelPrototype);
    }
    return channel;
};

/**
 * Subscribe to radio channel
 * @param {string} channelName - channel name
 * @param {string} callback - callback to call on event
 * @public
 * @memberof Eventus
 */
var subscribe = function(channelName, callback) {
    var channel = this.constructor.Radio.channel(channelName);
    this.listen(channel, 'radio', callback);
};

/**
 * Unsubscribe from radio channel
 * @param {string} channelName - channel
 */
var unsubscribe = function(channelName) {
    var channel = this.constructor.Radio.channel(channelName);
    this.unlisten(channel);
};

module.exports = init;