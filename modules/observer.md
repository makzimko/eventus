# Eventus / Observer
Observer is user to listen to events of other object.

Documentation of Eventus is [here](../README.md).
List of modules is [here](README.md)

## How to use it
Observer extends Eventus prototype and adds two methods to it: `.listen()` and `.unlisten()`.

### Listen to object
This method allows you to listen events of other Eventus object. As arguments you need to pass listened object, event name and listener callback.
Callback listener will be triggered with first argument equal to listened object and other arguments - event data.
```javascript
var foo = new Eventus();
var bar = new Eventus();

foo.listen(bar, 'baz', console.log);
bar.trigger('baz', 'Hello World!');
// output in console: 'bar', Hello World!
```

### Unlisten object
This method allow you to remove listening from other object. As arguments you need to pass listened object, event name and listened callback.
Arguments `event` and `callback` is not required, method works similar to method `.off()`.
```javascript
var foo = new Eventus();
var bar = new Eventus();

foo.listen(bar, 'baz', console.log);

// unlisten specified listener
foo.unlisten(bar, 'baz', console.log);

// unlisten specified event
foo.unlisten(bar, 'baz');

// unlisten all events of object
foo.unlisten(bar);
```

## License
Eventus is published under the [MIT License](https://opensource.org/licenses/MIT).