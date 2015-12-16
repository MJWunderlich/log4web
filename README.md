# Log4JS
###### A (hopefully) useful logging utility for JavaScript inspired by Log4J


Log4JS is a logging library for JavaScript inspired by the excellent Log4J library.
As many loggers as necessary can be setup, each categorized by domain. Domains use dot-notation so
that hierarchies can be formed. In the application, simply request a logger by domain name, and
a direct match OR a direct ancestor of that domain will be utilized.
    
    
Adapters do the actual logging, and as many Adapters as necessary can be added to each
logger. There are adapters to output logs to the console, the DOM, AJAX, and others can be
written and plugged in.
    
    
Copyright (c) 2015 Mario J. Wunderlich
Released under the MIT license

## A Logger to output to Console

The following logger will only output to console.

__Setup:__

````
Log4JS.newLogger('ui', [
    new Log4JSConsoleAdapter(),
]);
````

__In application:__

````
// This will return the 'ui' logger, since it's the closest match
var instance = Log4JS.getInstance('ui.for.my.usecase');
...
instance.info('Interface updated');
````

## A Logger to output to DOM

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
// This will return the 'ui.notify' logger, since it's the closest match
var instance = Log4JS.getInstance('ui.notify.dom');
...
instance.info('Image has uploaded successfully');
````

## Formatting log messages

Messages use the following format: `"this {0} and that {1} and this also {2}"`, values passed in as regular arguments.

__Example__

````
Log4JS.newLogger('ui.notify', [
    new Log4JSConsoleAdapter()
]);

...

var instance = Log4JS.getLogger('ui.notify.formatted.text.example');
instance.log("this {0} and that {1} and this also {2}", "THIS", "THAT", "THIS ALSO");
````
