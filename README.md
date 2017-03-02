# Eventus [![Build Status](https://api.travis-ci.org/makzimko/eventus.svg?branch=master)](https://api.travis-ci.org/makzimko/eventus.svg?branch=tests)
Eventful object that can everything.
It's a simple and rapid realization of Pub-Sub, Mediator & Observer patterns.

## How to use it

### Constructor

You can create instance of Eventus using its constructor.
```javascript
var Eventus = require('eventus');
var foo = new Eventus();
```
Also you can pass `options` object that will extend simple Eventus object and after taht you can use it as object properties (methods).
After creating `init` event will be triggered.
```javascript
var bar = new Eventus({
	baz: 'qux'
});
```
### Event listening
Each Eventus object has amount of built-in events and may has own custom events.
Events can be defined on options and by using `.on()` and `.once()` methods as well.
```javascript
var foo = new Eventus({
    events: {
        bar: console.log
    }
});

foo.trigger('bar', 'Hello World!');
// output in console: Hello World!

foo.on('baz', console.log);
foo.trigget('baz', 'Hello again');
// output in console: Hello again

```
For one-time listener you can use `.once()` instead of `.on()`.

To remove listener use `.off()` method. It can accept different set of arguments.
```javascript
var foo = new Eventus();
foo.on('bar', console.log);

// remove specified listener
foo.off('bar', console.log);

// remove all listener for specified event
foo.off('bar');

// remove all listeners for all event
foo.off();
```

### Event triggering
For triggering event of object just use `.trigger()` method. Method accepts at least 1 parameter - event name, all other parameters is data that will be passed for listeners;
```javascript
var foo = new Eventus();
foo.on('bar', console.log);
foo.trigger('bar', 'Hello', 'World');
// output in console: Hello World
```

### Child elements
Each Eventus object can has child elements. For creating and removing children use `.createChild()` and `.removeChild()` methods.
`.addChild()` accepts two parameters: name (alias for child element in parent object) and options (will be passed as options of child element to it's constructor). After adding child element event `child:add` will be triggered on parent object.
```javascript
var foo = new Eventus();
foo.createChild('bar');
foo.createChild('baz', { some: 'option' });

// each child element is available by alias in parent element
console.log(foo.baz.some);
// output in console: option
```

Each child element can has it's own deep child element
```javascript
foo.bar.createChild('qux');
```

For deleting child element you can use both name of object and it's instance. After deleting child element event `destroy` will be triggered on removed object and `child:remove` will be triggered on parent object.
```javascript
var foo = new Eventus();
var bar = foo.createChild('bar');
var baz = foo.createChild('baz');

// remove element using name
foo.removeChild('bar');

// remove element using instance
foo.removeChild(baz);
```

### Destroying object
You can simply destroy object by using `.destroy()` method. This will remove all listeners from object and triggers `destroy` event.

### Broadcasting & emitting events
For passing events to parent elements use `.emit()` method, for children - `.broadcast()` method. Arguments are the same as for triggering events.
```javascript
var foo = new Eventus();
var bar = foo.createChild('bar');
var baz = bar.createChild('baz');

// this will trigger 'qux' event on bar & baz
foo.broadcast('qux', { some: 'options' });

// this will trigger 'bat' event on foo & bar
baz.emit('bat', { some: 'options'});
```
## List of Eventus modules

[Full list of modules](modules/)

* [Observer](modules/observer.md)
* [Radio](modules/radio.md)

## License
Eventus is published under the [MIT License](https://opensource.org/licenses/MIT).