# Eventus / Radio
Observer is user to listen to events of other object.

Documentation of Eventus is [here](../README.md).
List of modules is [here](README.md)

## How to use it
Eventus.Radio allows you to create global communication between all components.

### Creating channel
Radio channel is a singleton that allows objects to communicate with each other.
Channel can be create directly from Eventus.Radio and also it will be created while subscribing if channel not exists.

```javascript
// direct creating
var channel = Eventus.Radio.channel('foo');

// auto creating
var bar = new Eventus();
bar.subscribe('baz', console);
```

### Subscribe to channel
When subscribe to some channel you will receive all events triggered on it.
You can do it be `.subscribe()` method channel name and callback as arguments.
```javascript
var foo = new Eventus();
foo.subscribe('bar', console.log);

Eventus.Radio.bar.trigger('baz', { some: 'option' });
// output in console: 'baz', { some: 'option' }
```

### Unsubscribe from channel
To unsubscribe from channel just use `.unsubscribe()` method in your Eventus object and pass channel name as argument.
```javascript
var foo = new Eventus();
foo.subscribe('bar', console.log);

foo.unsubscribe('bar');
Eventus.Radio.bar.trigger('some', 'event');
// and nothing happens
```

### Request for some data
Each channel has `.request()` and `.reply()` methods that allows to create global requests for some data.
Notice that every reply should have unique name in scope of channel.

#### Register reply
```javascript
Eventus.Radio.channel('foo');
Eventus.Radio.foo.reply('bar', function(baz, qux) {
    return baz + qux;
});
```
#### Request for data
```javascript
var bar = Eventus.Radio.foo.request('bar', 1, 2);
/// bar = 3
```

## License
Eventus is published under the [MIT License](https://opensource.org/licenses/MIT).