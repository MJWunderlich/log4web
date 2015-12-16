# Log4JS

##### Log4JS is a logging library for JavaScript inspired by the excellent Log4J library.

Log4JS is a logging library for JavaScript inspired by the excellent Log4J library.
As many loggers as necessary can be setup, each categorized by domain. Domains use dot-notation so
that hierarchies can be formed. In the application, simply request a logger by domain name, and
a direct match OR a direct ancestor of that domain will be utilized.
    
    
Adapters do the actual logging, and as many Adapters as necessary can be added to each
logger. There are adapters to output logs to the console, the DOM, AJAX, and others can be
written and plugged in.
    
    
Copyright (c) 2015 Mario J. Wunderlich
Released under the MIT license

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
Log4JS.newLogger('ui.notify', [
    new Log4JSHtmlAdapter({template: '#element-to-use-as-template', target: '#element-to-append-to', messageEl: '.message-element'}),
    new Log4JSConsoleAdapter()
]);
````

__In application:__

````
// This instance will use the 'ui.notify' logger, since it's the closest match
var instance = new Log4JSInstance('ui.notify.dom');
...
instance.info('Image has uploaded successfully');
````

### Formatting log messages

Messages use the following format: `"this {0} and that {1} and this also {2}"`, values passed in as regular arguments.

__Example__

````
Log4JS.newLogger('ui.notify', [
    new Log4JSConsoleAdapter()
]);

...

var instance = new Log4JSInstance('ui.notify.formatted.text.example');
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

Both Loggers and Instances can be muted so that logs stop being output. This is useful to dynamically control log output.

__Mute a Logger__

When a logger is muted, all instances that use that logger will also be muted.

````
var logger = Log4JS.getLogger('domain.for.logger');
logger && logger.mute();
````

__Mute an Instance__

When an instance is muted, only logs from that instance will be muted.

````
var instance = new Log4JSInstance('domain.for.logger');
instance.mute();
````
