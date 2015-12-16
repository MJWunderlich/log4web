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
