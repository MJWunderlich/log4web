/**
 * Log4JS JavaScript Library v0.0.1
 * http://mjwunderlich.com/proj/log4js/
 *
 * Log4JS is a logging library for JavaScript inspired by the excellent Log4J library.
 *
 * As many loggers as necessary can be setup, each categorized by domain. Domains use dot-notation so
 * that hierarchies can be formed. In the application, simply request a logger by domain name, and
 * a direct match OR a direct ancestor of that domain will be utilized.
 *
 * Adapters do the actual logging, and as many Adapters as necessary can be added to each
 * logger. There are adapters to output logs to the console, the DOM, AJAX, and others can be
 * written and plugged in.
 *
 * Copyright (c) 2015 Mario J. Wunderlich
 * Released under the MIT license
 */

/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Mario J. Wunderlich
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function (globals, window, document, $) {

  'use strict';

  // ****** GLOBALS ****** //

  var slice = [].slice;

  // ****** HELPERS ****** //

  function isArray(mixed) {
    return Object.prototype.toString.call(mixed) == '[object Array]';
  }

  function isMethodSupported(object, methodName) {
    return typeof object[methodName] == 'function';
  }

  function format(fmt /*,  ... */) {
    var args = slice.call(arguments, 1);
    return fmt.replace(/{(\d+)}/g, function (match, number) {
      let local = args.slice(0), n = +number;

      while (local.length) {
        let item = local[0], itemIsArray = isArray(item);
        if (itemIsArray && item.length <= n) {
          n -= item.length;
          local.shift();
        }
        else if (!itemIsArray && n) {
          n--;
          local.shift();
        }
        else {
          local = itemIsArray ? item[n] : item;
          break;
        }
      }

      return !isArray(local) ? local : match;
    });
  }

  // ****** MEAT & POTATOES ****** //

  var Log4JSRegistry = function() {
    this._instancesTable = {};
    this._instances = [];
  };
  Log4JSRegistry.prototype = {
    find: function(domain, fullMatchOnly) {
      var items, instance;

      domain = domain || 'null';
      items  = domain.split('.');

      while (items.length) {
        domain = items.join('.');
        instance = this._instancesTable[domain];
        if (instance)
          return instance;
        if (fullMatchOnly)
          return false;
        items.pop();
      }

      return false;
    },

    add: function(instance) {
      if (!!this.find(instance.domain, true)) {
        throw new Error(format('Log4JS instance with domain \'{0}\' already registered', instance.domain));
      }
      this._instancesTable[ instance.domain ] = instance;
    },

    remove: function(domain) {
      if (!this.find(domain, true)) {
        throw new Error(format('Log4JS instance with domain \'{0}\' not registered', domain));
      }
      delete this._instancesTable[domain];
    }
  };

  /**
   * Class Log4JSConsoleAdapter
   *
   */
  var Log4JSConsoleAdapter = function () {
    this._engine = console;
  };
  Log4JSConsoleAdapter.prototype = {
    get engine() {
      return this._engine;
    },

    _defaultOutput: function (type, message, additionalData) {

    },

    write: function (type, message, additionalData) {
      if (isMethodSupported(this.engine, type)) {
        var method = this.engine[type];
        method.call(this.engine, message);
      }
      else {
        this._defaultOutput.apply(this, arguments);
      }
    }
  };

  /**
   * Class Log4JSAjaxAdapter
   *
   * @param url
   * @param method
   * @param credentials
   * @param fieldName
   * @constructor
   */
  var Log4JSAjaxAdapter = function (url, method, credentials, fieldName) {
    // TODO: validate it's a valid URL
    this._url = url;
    this._method = method || 'get';
    this._credentials = credentials || false;
    this._fieldNames = {
      message: fieldName || 'message'
    };
  };
  Log4JSAjaxAdapter.prototype = {
    get url() {
      return this._url;
    },

    get method() {
      return this._method;
    },

    get credential() {
      return this._credentials;
    },

    get fieldNames() {
      return this._fieldNames;
    },

    getFieldName: function (which) {
      return this.fieldNames[which];
    },

    write: function (type, message, additionalData) {
      var data = {};
      data[this.getFieldName('message')] = message;
      if (additionalData) {
        for (var key in additionalData) {
          var fieldName = this.getFieldName(key) || key;
          data[fieldName] = additionalData[key];
        }
      }
      $.ajax({
        url: this.url,
        type: this.method,
        data: data,
        success: function (response) {

        },
        error: function (xhr, status, error) {

        }
      });
    }
  };

  /**
   * Class Log4JSHtmlAdapter
   *
   * @param options a map of options to configure the HTML adapter, options are:
   *                - target: target DOM element to append to
   *                - template: HTML template, can be a DOM selector or an actual HTML fragment
   *                - messageEl: DOM element within the template where to write the message
   *
   * @constructor
   */
  var Log4JSHtmlAdapter = function (options) {
    options = options || {};
    this._target = options.target || false;
    this._template = options.template || false;
    this._messageEl = options.messageEl || false;
  };
  Log4JSHtmlAdapter.prototype = {
    write: function (type, message) {
      var sel = $(this._template);
      var template = $($.parseHTML(sel.length ? sel.text() : this._template));
      $(this._messageEl, template).html( message );
      template.appendTo($(this._target));
    }
  };

  var Log4JSInstance = function(domain) {
    this._domain = domain;
    this._instance = Log4JS.getLogger(domain);
    this._muted = 0;
  };
  Log4JSInstance.prototype = {
    get domain() {
      return this._domain;
    },

    get muted() {
      return this._muted;
    },

    get instance() {
      return this._instance || Log4JS.getLogger(domain);
    },

    mute: function() {
      this._muted ++;
    },

    unmute: function() {
      this._muted --;
    },

    log: function (fmt) {
      if (this.muted) return;
      this.instance.log.apply(this.instance, arguments);
    },

    info: function (fmt) {
      if (this.muted) return;
      this.instance.log.apply(this.instance, arguments);
    },

    warn: function (fmt) {
      if (this.muted) return;
      this.instance.log.apply(this.instance, arguments);
    },

    error: function (fmt) {
      if (this.muted) return;
      this.instance.log.apply(this.instance, arguments);
    }
  };

  /**
   * Class Log4JS
   * @constructor
   */
  var Log4JS = function (domain, adapters) {
    this._domain = domain ? domain.toLowerCase() : 'null';
    this._adapters = [];
    this._version = {
      get major() {
        return '0'
      },
      get minor() {
        return '0'
      },
      get revision() {
        return '0'
      }
    };

    if (adapters && isArray(adapters)) {
      this.registerAdapters(adapters);
    }
  };

  Log4JS.prototype = {
    get version() {
      return this._version.major + '.' + this._version.minor + '.' + this._version.revision;
    },

    get domain() {
      return this._domain || 'null';
    },

    get adapters() {
      return [].concat( this._adapters );
    },

    registerAdapter: function(adapter) {
      if (typeof adapter != 'object' || typeof adapter.write != 'function') {
        throw new Error('Invalid Log4JS adapter');
      }
      this._adapters.push( adapter );
    },

    registerAdapters: function(adapterArray) {
      for (var i = 0; i < adapterArray.length; i++) {
        var adapter = adapterArray[i];
        this.registerAdapter(adapter);
      }
    },

    _write: function (type, fmt /* ... */) {
      var message = format.apply(null, slice.call(arguments, 1));
      message = format('[{0}]: {1}', (new Date()).toLocaleString(), message);
      for (var i = 0; i < this._adapters.length; i++) {
        var obj = this._adapters[i];
        obj.write(type, message);
      }
    },

    log: function (fmt) {
      this._write.apply(this, ['log'].concat(slice.call(arguments, 0)));
    },

    info: function (fmt) {
      this._write.apply(this, ['info'].concat(slice.call(arguments, 0)));
    },

    warn: function (fmt) {
      this._write.apply(this, ['warn'].concat(slice.call(arguments, 0)));
    },

    error: function (fmt) {
      this._write.apply(this, ['error'].concat(slice.call(arguments, 0)));
    }
  };

  var log4JSLoggerRegistry = new Log4JSRegistry();

  /**
   * getInstance
   *
   * Returns the current registered Log4JS instance. If none is registered, a new instance is
   * created.
   *
   * @static
   * @returns {*}
   */
  Log4JS.getLogger = function(domain) {
    domain = domain || 'null';
    var instance = log4JSLoggerRegistry.find(domain);
    if (!instance && domain == 'null') {
      instance = new Log4JS(domain);
      log4JSLoggerRegistry.add(instance);
    }
    return instance;
  };


  Log4JS.newLogger = function(domain, adapters) {
    var instance = log4JSLoggerRegistry.find(domain, true);
    if (!instance) {
      instance = new Log4JS(domain);
      log4JSLoggerRegistry.add(instance);
    }

    adapters && instance.registerAdapters(adapters);
    return instance;
  };

  Log4JS.load = function(json) {
    var key, item;
    for (key in json) {
      item = json[key];
      Log4JS.newLogger(key, item.adapters);
    }
  };

  // ****** EXPORTS ******* //

  globals.Log4JS = Log4JS;
  globals.Log4JSInstance = Log4JSInstance;
  globals.Log4JSConsoleAdapter = Log4JSConsoleAdapter;
  globals.Log4JSAjaxAdapter = Log4JSAjaxAdapter;
  globals.Log4JSHtmlAdapter = Log4JSHtmlAdapter;

})(window, window, document, jQuery);
