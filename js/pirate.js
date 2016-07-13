---
# This crazy header is processed by Jekyll.
test: false
dataLayer:
  name: 'dataLayer'

pirate:
  jargon: "http://pirateglossary.com/types/phrases/page/5/"

---

/*  A framework for automating detection of data attributes on event handlers. */
(function(window, document, undefined){

  var config = {
    LISTEN_AUTO: true, // automatically attach all event handlers
    DATALAYER_NAME: '{{page.dataLayer.name}}', // configure alternate name if needed...

    LOGLEVEL: 20, // the default (current) level
    LOGGING: { // levels to evaluate against...
      CRITICAL: 10, // when something went disasterously wrong...
      WARNING: 20, // when something doesn't look right...
      LOG: 30, // basic status notifications (currently unused)
      INFO: 40, // fairly verbose for each event.
      DEBUG: 50 // super verbose for analysis.
    },

    EVENTS: { // Which events to detect at the appropriate scope
      BODY: ['click', 'dblclick', 'tap', 'drag', 'drop', 'scroll', 'mousedown', 'touchstart'],
      WINDOW: ['focus', 'blur', 'focusin', 'focusout', 'copy', 'cut', 'paste', 'select', 'popstate', 'hashchange']
    }
  };

  var exports = (window.pirate = window.pirate || {});
  var hasOwnProperty = Object.hasOwnProperty;
  var slice = Array.prototype.slice;
  var root = document.documentElement;
  var listeners = [];
  var interceptors = [];

  var RE_DATA_PREFIX = /^data-/;
  var RE_HYPHEN_NAME = /[a-z]-[a-z]/g;
  var RE_PATTERN_ALL = /.*/;

  // Instantiate the dataLayer if needed.
  window[config.DATALAYER_NAME] = window[config.DATALAYER_NAME] || [];

  exports.yellow = function(){
    config.LOGLEVEL = config.LOGGING.DEBUG;
  };

  function loglevel(level){
    return config.LOGLEVEL >= level;
  }

  function extend(target, source){
    var k;
    for(k in source){
      if(hasOwnProperty.call(source, k)){
        target[k] = source[k];
      }
    }
    return target;
  }

  function fixAttributeName(name){
    return name.substr(5).replace(RE_HYPHEN_NAME, function($0){
      return $0.charAt(0) + ($0.charAt(2).toUpperCase());
    });
  }

  function listen(events, elem, handler, capture, _remove){
    var attach; // the attachment (or detachment) method

    if(!! _remove){
      attach = (elem.removeEventListener || elem.detachEvent);
    } else {
      attach = (elem.addEventListener || elem.attachEvent);
    }

    var count = 0;
    events.replace(/(on)?([a-z]+)/g, function($0, $on, $name){
      attach.call(elem, $name, handler, capture);
      count++;
    });
  }

  function removeListener(events, elem, handler, capture){
    return listen(events, elem, handler, capture, true);
  }


  function mapElements(elem, callback){
    var i, r = [];
    for(i = 0; (!! elem[i]); i++){
      r[i] = callback.call(elem, elem[i], i);
    }
    return r;
  }

  function mapAttributes(elem, callback){
    var attribs = elem.attributes || [];
    var i = attribs.length;
    while(i--){
      callback.call(elem, attribs[i].name, attribs[i].value, i, attribs[i]);
    }
  }


  function collectAttributes(elem){
    var node = elem, data = {};

    function load(name, value){
      if(RE_DATA_PREFIX.test(name)){
        name = fixAttributeName(name);
        if(!hasOwnProperty.call(data, name)){
          data[name] = value;
        }
      }
    }
    while(node){
      mapAttributes(node, load);
      node = node.parentNode;
    }
    return data;
  }


  function debounce(event){
    var cache = (debounce.cache = debounce.cache || {});
    var type = (event.type).replace('focusin', 'focus').replace('focusout', 'blur');
    var lifetime = (type == 'scroll') ? 1000 : 10;
    var now = (new Date()).getTime();
    if(cache[type] > (now - lifetime)) return false;
    else {
      cache[type] = now;
      return true;
    }
  }


  function coreDispatch(event){
    var i = listeners.length;
    var target = event.target || event.sourceElement;
    if(debounce(event)) while(i--){
      if(listeners[i][0].test(event.type)){
        listeners[i][1].call(target, event);
      }
    }
  }

  function select(expr, callback){
    return mapElements(document.querySelectorAll(expr), callback || collectAttributes);
  }

  function intercept(callback){
    if(callback && callback.call) interceptors.push(callback);
  }


  // Add a handler to the queue.
  function attachDelegate(pattern, handler){
    if(!handler && pattern && pattern.call){
      handler = pattern;
      pattern = undefined;
    }
    listeners.push([ pattern || RE_PATTERN_ALL, handler ]);
  }

  exports.gangway = attachDelegate;
  exports.crew = listeners;
  exports.ahoy = listen;
  exports.pillage = collectAttributes;
  exports.hornswaggle = select;
  exports.ascertain = intercept;
  exports.config = config;


  /** @constructor */
  function EventSpanner(context, handler, capture){
    this.context = context;
    this.handler = handler;
    this.capture = capture;
  }

  (function(spanner){

    spanner._assimilate = function(eventArray, doAttach){
      var _push = eventArray.push;
      var _this = this;
      eventArray.push = function(){
        _this.attach.apply(_this, arguments);
        return _push.apply(eventArray, arguments);
      };
      if(doAttach){
        _this.attach.apply(_this, eventArray);
      }
      return eventArray;
    };

    spanner.attach = function(){
      var i = arguments.length;
      while(i--){
        if(loglevel(config.LOGGING.INFO)) console.info('Attaching event listeners', arguments[i], this.context);
        listen(arguments[i], this.context, this.handler, this.capture, false);
      }
    };

    spanner.detach = function(){
      var i = arguments.length;
      while(i--){
        removeListener(arguments[i], this.context, this.handler, this.capture);
      }
    };

  }(EventSpanner.prototype));

  function getGTMDefaultProperties(element){
    return {
      'gtm.elementId': (element && element.id),
      'gtm.elementClasses': (element.className)
    }
  }


  function activatePirateListeners(){
    var spanner;

    // Attach to body events
    spanner = new EventSpanner(document.body, coreDispatch, false);
    spanner._assimilate(config.EVENTS.BODY, true);

    // Attach to window events.
    spanner = new EventSpanner(window, coreDispatch, false);
    spanner._assimilate(config.EVENTS.WINDOW, true);
  }

  function onready(e){
    // Attach core listeners
    if(config.LISTEN_AUTO) activatePirateListeners();
  }

  // Inject a precursor to all calls on this method...
  function insert(context, methodName, handler){
    var orig = context[methodName];
    return (context[methodName] = function(){
        handler.apply(context, arguments);
        return orig.apply(context, arguments);
    });
  }

  // Insert the interceptor delegate.
  // Assuming that this kit will be loaded *by* GTM, GTM's injection on the
  // DataLayer can be intercepted, as it will have already applied. This
  // alleviates timing concerns.
  insert(window[config.DATALAYER_NAME], 'push', function(){
    var i;
    if(loglevel(config.LOGGING.DEBUG)){
      for(i = 0; i < arguments.length; i++)
        console.info('DataLayer::push()', arguments[i]);
    }
    i = interceptors.length;
    while(i--){
      interceptors[i].apply(this, arguments);
    }
  });

  // Insert the data-extension logic for all events including elements.
  interceptors.push(function(){
    var i = arguments.length;
    var data = null, pirate = null, elem = null;
    while(i--){
      if(hasOwnProperty.call(arguments[i], 'gtm.element')){
        elem = arguments[i]['gtm.element'];
        data = collectAttributes(elem);
        pirate = (arguments[i]['pirate'] = arguments[i]['pirate'] || {});
        extend(pirate, data);
        extend(arguments[i], getGTMDefaultProperties(elem))
      }
    }
  });


  function persistDataScope(selector){
    var results = select(selector);
    var i = results.length;
    while(i--){
      window[config.DATALAYER_NAME].push(results[i]);
    }
  }

  exports.moor = persistDataScope;


  listen('load', document, onready);
  listen('DOMContentLoaded', document, onready);
  listen('readystatechange', document, function(){
    if(document.readyState == 'interactive') onready();
  });

  if(document && document.body) onready();

  attachDelegate(null, function(event){
    var elem = this;
    window[config.DATALAYER_NAME].push({
      'event': ('pirate.' + event.type),
      'gtm.element': elem,
      'pirate': {
        'sourceEvent': event
      }
    });
  });


}(window, document, (void 0) ));