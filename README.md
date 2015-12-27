# Log4JS2

##### Log4JS2 is a logging library for JavaScript inspired by the excellent Log4J library.

__Adapters__
    
Adapters (`Log4JSAdapter`) do the actual logging, and as many Adapters as necessary can be added to each
Logger. There are adapters to output logs to the console, the DOM, AJAX, and others are being implemented.
In fact, you can write your own custom Adapters and plug them in!
    
__Loggers__
    
Loggers (`Log4JSLogger`) contain a collection of Adapters. They are registered using a domain name (string) that uses
dot-notation so that hierarchies can be formed. As many loggers as necessary can be setup, each with it's own set of
adapters and properties. In the application, simply request a logger by domain name, and (if registered) a Logger will
be found that is a direct match OR a direct ancestor of that domain name.

__Logger Domains__

Loggers are registered using domain names, which are just strings that use simple dot-notation to express
hierarches. _For example,_ if a Logger is registered using domain `example`, then searching by `example.foo.bar`
and `example.fizz.buzz` will both yield the Logger `example`.
    
If in the future another Logger is registered using domain `example.foo`, then searching for `example.foo.bar` will
yield the Logger `example.foo` because it's a _closer_ match.

This allows applications to organize Loggers in a hierarchical and clear manner.

__Logger Instances__

Instances (`Log4JSInstance`) are the main logging interface used by your application. Instances are created using a
domain name and they will output logs to the Logger identified by that domain. Simple, clean, efficient. A typical example:
````
var instance = new Log4JSInstance("example.foo.bar");
instance.log("Hello world!");
````
 
 Create as many instances as necessary, attached to as many Loggers.
    
__Layouts__ _(new)_
    
Layouts are optional, and when used, they tell Adapters how to format their output. Layouts can be used with any Adapter -- whether appending HTML to the DOM, writing text to Console, or sending JSON objects through AJAX.

There are 2 types of Layoouts: `Log4JSLayout` and `Log4JSJSONLayout` and each one has a special way of specifying their formats.

`Log4JSLayout` is a simple text layout, that uses a simple string format. For example: `"This is a message '{message}' with log type {type} created at {date}"` will cause an Adapter to output "This is a message 'foo bar' with log type 'info' created at 2015-12-27 14:37:00"

`Log4JSJSONLayout` is a json layout, that uses a JS object for it's format. For example, the following json format:
```
var format = {
  what: '{message'},
  type: '{type}',
  when: '{date}'
};
```
will be used to output the following json:
```
{
  what: 'foo bar',
  type: 'info',
  when: '2015-12-27 14:37:00'
}
```
    
    
### A Logger to output to Console

The following logger will only output to console.

__Setup:__

````
Log4JS.newLogger('ui', [
    new Log4JSConsoleAdapter(),
]);
````

__In application:__

````
// This instance will use the 'ui' logger, since it's the closest match
var instance = new Log4JSInstance('ui.for.my.usecase');
...
instance.info('Interface updated');
````

### A Logger to output to DOM

The following Logger will output to the DOM, appending each log message to the specified element using the given template.
It will also output logs to the Browser console.

__Setup:__

````
Log4JS.newLogger('ui.dom', [
    // This adapter will append messages to the DOM
    new Log4JSHtmlAdapter({template: '#element-to-use-as-template', target: '#element-to-append-to', messageEl: '.message-element'}),
    
    // Also output to the console just for good measure :)
    new Log4JSConsoleAdapter()
]);
````

__In application:__

````
// This instance will use the 'ui.dom' logger, since it's the closest match
var instance = new Log4JSInstance('ui.dom.notifications');
...
instance.info('Image has uploaded successfully');
````

### Formatting log messages

Messages use the following format: `"this {0} and that {1} and this also {2}"`, values passed in as regular arguments.

__Example__

````
var instance = new Log4JSInstance('ui');
instance.log("this {0} and that {1} and this also {2}", "THIS", "THAT", "THIS ALSO");
````

### Setting up Loggers using JSON

A JSON object can be used to setup loggers for your application. This JSON can be placed in a configuration file to separate configuration from your application.

__Configuring Log4JS with JSON__

Use the `Log4JS.load()` method to load from JSON data.

__JSON Format__

````
Log4JS.load({
    'domain.name.for.logger' : {
        level: 'error',
        adapters: [
            new Log4JSAjaxAdapter( ... ),
            new Log4JSConsoleAdapter()
        ]
    },

    'domain.name.for.another.logger' : {
        level: 'info',
        adapters: [
            new Log4JSConsoleAdapter()
        ]
    }
});
````

### Muting output

Both Loggers and Instances can be muted (and un-muted) to enable/disable logging output. This gives the application the ability to dynamically turn logging on/off.

__Mute a Logger__

When a logger is muted, all instances that use that logger will also be muted.

````
var logger = Log4JS.getLogger('domain.for.logger');
...
logger && logger.mute();
````

__Mute an Instance__

When an instance is muted, only logs from that instance will be muted.

````
var instance = new Log4JSInstance('domain.for.logger');
...
instance.mute();
````
