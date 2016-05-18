/*  A framework for automating detection of data attributes on event handlers. */
(function(window, document, undefined){

  var config = { DEBUG: true };

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
  window.dataLayer = window.dataLayer || [];

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
    return name.replace(RE_DATA_PREFIX, '').replace(RE_HYPHEN_NAME, function($0){
      return $0.charAt(0) + ($0.charAt(2).toUpperCase());
    });
  }

  function listen(events, elem, handler, capture){
    var attach = (elem.addEventListener || elem.attachEvent);
    var count = 0;
    events.replace(/(on)?([a-z]+)/g, function($0, $on, $name){
      attach.call(elem, $name, handler, capture);
      count++;
    });
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
        data[fixAttributeName(name)] = value;
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


  function onready(e){
    // Attach core listeners
    listen('click dblclick tap drag drop scroll', document.body, coreDispatch);
    listen('focus blur focusin focusout copy cut paste select popstate hashchange', window, coreDispatch);
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
  insert(window.dataLayer, 'push', function(){
    if(config.DEBUG){
      console.info('DataLayer::push()', arguments);
    }
    var i = interceptors.length;
    while(i--){
      interceptors[i].apply(this, arguments);
    }
  });

  // Insert the data-extension logic for all events including elements.
  interceptors.push(function(){
    var i = arguments.length;
    while(i--){
      if(hasOwnProperty.call(arguments[i], 'gtm.element')){
        extend(arguments[i], collectAttributes(arguments[i]['gtm.element']));
      }
    }
  });

  listen('load', document, onready);
  listen('DOMContentLoaded', document, onready);
  listen('readystatechange', document, function(){
    if(document.readyState == 'interactive') onready();
  });

  if(document && document.body) onready();

  attachDelegate(null, function(event){
    var elem = this;
    window.dataLayer.push({
      'event': ('pirate.' + event.type),
      'gtm.element': elem,
      'sourceEvent': event
    });
  });


}(window, document, (void 0) ));