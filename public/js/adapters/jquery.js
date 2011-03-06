/*
* BridgeJS jQuery Adapter
*/

jQuery.extend(Bridge, (function($j) {
  var _toString = window.Object.prototype.toString,
      _slice = window.Array.prototype.slice;

  function emptyFunction() { }
  function K(K) { return K; }

  function byId(content) {
    return (Object.isString(content)) ? $j.find('#' + content)[0] : content;
  }

  function bySelector(selector) {
    return $j.find(selector);
  }

  function $(element) {
    if (element.constructor && element.constructor == NodeWrapper) {
      return element;
    }
    var NW = new NodeWrapper(element);
    return NW.source && NW;
  }

  function $$(selector) {
    return new NodeListWrapper(selector);
  }

  var Element = function(tagName, attributes) {
    attributes = attributes || {};
    return $(document.createElement(tagName)).writeAttribute(attributes);
  };

  var _Object = window.Object,
  Object = $j.extend((function() {
    function isString(object) {
      return _toString.call(object) == "[object String]";
    }

    function isUndefined(object) {
      return typeof object === "undefined";
    }

    function isNumber(object) {
      return _toString.call(object) == "[object Number]";
    }

    function isElement(object) {
      return !!(object && object.nodeType == 1);
    }

    function keys(object) {
      var keys = [];
      for (var property in object) {
        if (object.hasOwnProperty(property)) keys.push(property);
      }
      return keys;
    }

    return {
      isArray: $j.isArray,
      isFunction: $j.isFunction,
      isNumber: isNumber,
      isString: isString,
      isUndefined: isUndefined,
      isElement: isElement,
      keys: _Object.keys || keys
    };
  })(), Bridge.Shared.Object);


  var Function = $j.extend({
    argumentNames: function(fn) {
      var names = fn.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
        .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
        .replace(/\s+/g, '').split(',');
      return names.length == 1 && !names[0] ? [] : names;
    }
  }, Bridge.Shared.Function);

  var Event = {
    observe: function(element, eventName, handler) {
    element = $(element);
      $j(element.source).bind(eventName, handler);
    },
    stopObserving: function(element, eventName, handler) {
      element = $(element);
      $j(element.source).unbind(eventName, handler);
    },
    findElement: function(event, selector) {
      var element = event.target;
      if (!selector) return element;
      return $j(element).closest(selector)[0];
    },
    stop: function(event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopped = true;
    },

    pointer: function(event) {
      return {
        x: event.pageX,
        y: event.pageY
      };
    },

    pointerX: function(event) {
      return event.pageX;
    },

    pointerY: function(event) {
      return event.pageY;
    }
  };


  // helper for offsets
  function _returnOffset(l, t) {
    var result = [l, t];
    result.left = l;
    result.top = t;
    return result;
  }

  function NodeWrapper(element) {
    this.source = byId(element);
  }
  Object.extend(NodeWrapper.prototype, {
    // Classnames
    addClassName: function(className) {
      $j(this.source).addClass(className);
      return this;
    },
    removeClassName: function(className) {
      $j(this.source).removeClass(className);
      return this;
    },

    // Dimensions and positions
    getWidth: function() {
      return $j(this.source).outerWidth();
    },
    getHeight: function() {
      return $j(this.source).outerHeight();
    },
    getDimensions: function() {
      return {
        width: this.getWidth(this.source),
        height: this.getHeight(this.source)
      };
    },

    cumulativeOffset: function() {
      var position = $j(this.source).offset(),
          so = this.cumulativeScrollOffset(),
          vs = Viewport.getScrollOffsets();

      // add scroll offsets to work like Prototype
      position.left += so.left - vs.left;
      position.top += so.top - vs.top;

      return _returnOffset(position.left, position.top);
    },

    cumulativeScrollOffset: function() {
      var element = this.source,
          valueT = 0, valueL = 0;
      do {
        valueT += element.scrollTop || 0;
        valueL += element.scrollLeft || 0;
        element = element.parentNode;
      } while (element);
      return _returnOffset(valueL, valueT);
    },

    // DOM
    remove: function() {
      $j(this.source).remove();
    },

    insert: (function() {
      var _insertionTranslations = {
        bottom: 'append',
        top : 'prepend',
        after : 'after',
        before: 'before'
      };

      return function(content) {
          if (Object.isElement(content.source || content) || Object.isString(content)) {
          $j(this.source).append(content.source || content);
        }
        else {
          // we have an object
          for (var insertion in content) {
            $j(this.source)[_insertionTranslations[insertion]](
              content[insertion].source || content[insertion]
            );
          }
        }
        return this;
      };
    })(),

    // TODO: should strip script tags from strings and evaluate those
    // in global context after inserting the stripped content
    update: function(content) {
      $j(this.source).html(content.source || content);
      return this;
    },

    // TODO: Add attribute translations 'className' > 'class' etc.
    writeAttribute: function(object) {
      $j(this.source).attr(object);
      return this;
    },
// TODO: Same here
    setStyle: function(style) {
      $j(this.source).css(style);
      return this;
    },

    getStyle: function(propertyName) {
      return $j(this.source).css(propertyName);
    },

    show: function() {
      $j(this.source).show();
      return this;
    },
    hide: function() {
      $j(this.source).hide();
      return this;
    },

    match: function(selector) {
      return $j(this.source).is(selector);
    },

    // TODO: selector as int
    up: function(selector) {
      var element = selector ?
        $j(this.source).closest(selector)[0] :
        $j(this.source).parent()[0];
      return element;
    },
    // TODO: down, previous, next

    // Storage
    store: function(key, value) {
      $j.data(this.source, key, value);
      return this;
    },
    retrieve: function(key) {
      return $j.data(this.source, key);
    },
    eliminate: function(key) {
      this.store(key, null);
      return this;
    },

    // Events
    observe: function() {
      var args = [this.source].concat(_slice.call(arguments));
      Event.observe.apply(null, args);
      return this;
    },
    
    stopObserving: function() {
      var args = [this.source].concat(_slice.call(arguments));
      Event.stopObserving.apply(null, args);
      return this;
    }
  });


  function NodeListWrapper(selector) {
    var elements = bySelector(selector),
        source = [];
    Array.each(elements, function(element) {
      source.push(new NodeWrapper(element));
    });
    this.source = source;
  }
  Object.extend(NodeListWrapper.prototype, {
    invoke: function() {
      var args = _slice.call(arguments), fn = args.shift();
      Array._each(this.source, function(node) {
        node[fn].apply(node, args);
      });
      return this;
    },

    each: function(iterator, context) {
      var index = 0;
      Array._each(this.source, function(value) {
        iterator.call(context, value, index++);
      });
      return this;
    }
  });

  var Element = function(tagName, attributes) {
    attributes = attributes || {};
    return $(document.createElement(tagName)).writeAttribute(attributes);
  };

  var Viewport = {
    getWidth: function() { return $j(window).width(); },
    getHeight: function() { return $j(window).height(); },
    getDimensions: function() {
      return {
        width: this.getWidth(),
        height: this.getHeight()
      };
    },
    getScrollOffsets: function() {
      return {
        left: $j(window).scrollLeft(),
        top: $j(window).scrollTop()
      };
    }
  };

  var Array = $j.extend((function() {
    function detect(array, iterator, context) {
      var result;
      this.each(array, function(value, index) {
        if (iterator.call(context, value, index)) {
          result = value;
          throw Bridge.Shared['break'];
        }
      });
      return result;
    }

    function without(array) {
      var values = _slice.call(arguments, 1);
      return this.select(array, function(value) {
        return !Array.include(values, value);
      });
    }

    function findAll(array, iterator, context) {
      var results = [];
      this.each(array, function(value, index) {
        if (iterator.call(context, value, index))
          results.push(value);
      });
      return results;
    }

    function include(array, object) {
      return $j.inArray(object, array) > -1;
    }

    return {
      find: detect,
      detect: detect,
      findAll: findAll,
      select: findAll,
      without: without,
      include: include,
      member: include
    };
  })(), Bridge.Shared.Array);

  // TODO: add missing features
  var Ajax = {};
  Ajax.Request = function(url) {
    this.options = Object.extend({
      onComplete: emptyFunction,
      onSuccess: emptyFunction,
      onException: emptyFunction,
      method: 'post',
      parameters: ''
    }, arguments[1] || {});

    jQuery.ajax({
      url: url,
      data: this.options.parameters,
      type: this.options.method,
      complete: Bridge.Shared.Function.bind(function(xhr) {
        if (Object.isFunction(this.options.onComplete))
          this.options.onComplete(xhr);
      }, this),
      success: Bridge.Shared.Function.bind(function(xhr) {
        if (Object.isFunction(this.options.onSuccess))
          this.options.onSuccess(xhr);
      }, this),
      error: Bridge.Shared.Function.bind(function(xhr, textStatus, errorThrown) {
        if (Object.isFunction(this.options.onException))
          this.options.onException(xhr, errorThrown);
      }, this)
    });
  };

  // domloaded
  function domloaded(fn) {
    $j(document).ready(fn);
  }

  return {
    Ajax: Ajax,
    Array: Array,
    each: Array.each,
    _each: Array._each,
    Element: Element,
    Event: Event,
    Function: Function,
    Object: Object,
    domloaded: domloaded,
    $: $,
    $$: $$,
    emptyFunction: emptyFunction,
    K: K,
    String: Bridge.Shared.String,
    Viewport: Viewport
  };
})(jQuery));


