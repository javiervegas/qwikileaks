// Shared by all adapters
// TODO: move duplicate stuff over to individual adapters to slim down this file
(function() {
var _slice = Array.prototype.slice,
    _toString = Object.prototype.toString;

Bridge.Shared = {
  'break': {},

  Array: {
    _each: function(array, iterator) {
      for (var i = 0, length = array.length; i < length; i++)
        iterator(array[i]);
    },

    each: function(array, iterator, context) {
      var index = 0;
      try {
        this._each(array, function(value) {
          iterator.call(context, value, index++);
        });
      } catch (e) {
        if (e != Bridge.Shared['break']) throw e;
      }
    }
  },

  Function: {
    bind: function(fn, object) {
      var args = _slice.call(arguments, 2);
      return function() {
        return fn.apply(object, args.concat(_slice.call(arguments)));
      };
    },

    bindAsEventListener: function(fn, object) {
      return function(event) {
        return fn.apply(object, [event || window.event].concat(_slice.call(arguments)));
      };
    },

    wrap: function(fn, wrapper) {
      var __fn = fn;
        return function() {
          var args = [Bridge.Shared.Function.bind(__fn, this)].concat(_slice.call(arguments));
          return wrapper.apply(this, args);
        };
    },

  curry: function(fn) {
      if (arguments.length === 1) return fn;
      var args = _slice.call(arguments, 1);
      return function() {
        return fn.apply(this, args.concat(_slice.call(arguments)));
      };
    },

    delay: function(fn, seconds) {
      var args = _slice.call(arguments, 2);
      return setTimeout(function(){
        return fn.apply(fn, args);
      }, seconds * 1000);
    },

    defer: function(fn) {
      return this.delay.apply(this, [fn, 0.01].concat(_slice.call(arguments, 1)));
    }
  },

  Object: {
  extend: function(destination, source) {
    for (var property in source)
    destination[property] = source[property];
    return destination;
  },
  
  clone: function(object) {
    return this.extend({}, object);
  },
    
  isBoolean: function(object) {
    return _toString.call(object) == "[object Boolean]";
  }
  },

  String: {
    capitalize: function(string) {
      return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
    },
          
    times: function(string, count) {
     return count < 1 ? '' : new Array(count + 1).join(string);
    },
      
    strip: function(string) {
      return string.replace(/^\s+/, '').replace(/\s+$/, '');
    }
  }
};
})();
