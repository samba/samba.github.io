---
# This crazy header is processed by Jekyll.
layout: null
test: false
dataLayer:
  name: 'dataLayer'

pirate:
  jargon: "http://pirateglossary.com/types/phrases/page/5/"

reference:
  gtm_events: "https://support.google.com/tagmanager/answer/6106965?hl=en"

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

    FORM_LABELS: true,

    EVENTS: { // Which events to detect at the appropriate scope
      BODY: ['click', 'dblclick', 'tap', 'drag', 'drop', 'scroll',
             'mousedown', 'touchstart'],
      WINDOW: ['focus', 'blur', 'focusin', 'focusout', 'copy', 'cut',
               'paste', 'select', 'popstate', 'hashchange',
               'change', 'input', 'keypress']
    }
  };


  var state  = {
    LISTENING: true,
    RESET_DUE: false,
    IN_FIELD: false,
    events: { muted: {} }
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

  function mapElementsSelector(selector, callback){
    return mapElements(document.querySelectorAll(selector), callback);
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


  function getAttribute(elem, name){
    return (elem && elem.getAttribute(name));
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

  function mute(){
    var i = arguments.length;
    while(i--){
      state.events.muted[arguments[i]] = true;
    }
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


  // Activate keypress and input events on form fields
  attachDelegate(/^(focus(in|out)?|blur)$/, function(event){
    var elem = this;
    state.IN_FIELD = (/^(focus(in)?)$/.test(event.type));

    state.events.muted['keypress'] = !(state.IN_FIELD);
    state.events.muted['input'] = !(state.IN_FIELD);

  });


  // Initialize state:
  mute('keypress', 'input')



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

  function findParent(elem, selectormatch){
    var node = elem;
    while(node = node.parentNode){
      if(node.nodeType === 1){
        if(node.matches(selectormatch)) return node;
      } else break;
    }
    return null;
  }


  function labelFor(fieldelem){
    var label;
    if(fieldelem.id || fieldelem.name){
      label = findParent(fieldelem, 'label');
      label = label || document.querySelector('label[for="' + (fieldelem.id || fieldelem.name) + '"]');
      return label && (label.textContent || label.innerText || label.innerHTML);
    }
    return null;
  }

  /* Retrieve form fields' data; */
  function generateFormData(element, friendly){
    var i = element.length; // enumerate fields within the form.
    var field, name, _values = [], t;
    var data = {};

    function use(name, value){
      if(name in data){
        if(data[name].substr){
          data[name] = [ data[name], value ];
        } else {
          data[name].push(value);
        }
      } else {
        data[name] = value;
      }
    }

    while(i--){

      field = element[i];
      name = getAttribute(field, 'name');
      if(!name) continue;

      switch(field.tagName.toLowerCase()){
        case 'input':
          switch(getAttribute(field, 'type')){
            case 'checkbox':
            case 'radio':
              if(field.checked)
                use(name, friendly ? (labelFor(field) || field.value) : field.value);
              break;
            default:
              use(name, field.value);
              break;
          }
          break;
        case 'select':
          t = field.length;
          while(t--){
            if(field[t].selected)
              use(name, friendly ? field[t].label : field[t].value)
          }
          break;
        case 'textarea':
        default:
          use(name, field.value);
      }

      if(friendly && (name in data) && (data[name].push)){
        data[name] = data[name].join('; ');
      }

    }
    return data;
  }


  function activatePirateListeners(){
    var spanner;

    // Attach to body events
    spanner = new EventSpanner(document.body, coreDispatch, false);
    spanner._assimilate(config.EVENTS.BODY, true);
    state.events.body = spanner;


    // Attach to window events.
    spanner = new EventSpanner(window, coreDispatch, false);
    spanner._assimilate(config.EVENTS.WINDOW, true);
    state.events.window = spanner;
  }




  function onready_listen(e){
    // Attach core listeners
    if(config.LISTEN_AUTO) activatePirateListeners();
  }

  function onready(handler){
    var queue = (onready.queue = onready.queue || []);
    if(handler && handler.call){
      if(document.body){
        handler.call(document);
      } else {
        onready.queue.push(handler);
      }
    } else {
      while(queue.length){
        queue.pop().call(document);
      }
    }
  }

  // Inject a precursor to all calls on this method...
  function insert(context, methodName, handler){
    var orig = context[methodName];
    return (context[methodName] = function(){
        if(state.LISTENING){
          handler.apply(context, arguments);
          // state.RESET_DUE = true;
        }
        return orig.apply(context, arguments);
    });
  }

  function deferClearPirateState(dataLayer){
    setTimeout(function(){
      if(state.RESET_DUE){
        state.LISTENING = false;
        dataLayer.push({ 'pirate': undefined });
        state.LISTENING = true;
        state.RESET_DUE = false;
      }
    }, 10);
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
      deferClearPirateState(this);
    }
  });

  // Insert the data-extension logic for all events including elements.
  interceptors.push(function(){
    var i = arguments.length;
    var data = null, pirate = null, elem = null;
    while(i--){
      if(hasOwnProperty.call(arguments[i], 'gtm.element')){
        state.RESET_DUE = true;
        elem = arguments[i]['gtm.element'];
        data = collectAttributes(elem);
        pirate = (arguments[i]['pirate'] = arguments[i]['pirate'] || {});
        extend(pirate, data);
        if(/^form$/i.test(elem.tagName)){
          extend(pirate, generateFormData(elem, config.FORM_LABELS));
        }
        extend(arguments[i], getGTMDefaultProperties(elem));
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

  exports.swipe = function(formelem, friendly){
    if(formelem.nodeType){
      return generateFormData(formelem, friendly);
    } else {
      return mapElementsSelector(formelem, function(e){ return generateFormData(e, friendly) });
    }
  };

  exports.attach = function(events, selector, callback, capture){
    var elems = document.querySelectorAll(selector);
    var i = elems.length;
    while(i--){
      listen(events, elems[i], callback, capture);
    }
  };

  exports.ondeck = onready;
  exports.moor = persistDataScope;
  exports.mute = mute;

  listen('load', document, onready);
  listen('DOMContentLoaded', document, onready);
  listen('readystatechange', document, function(){
    if(document.readyState == 'interactive') onready();
  });

  if(document && document.body) onready(null);

  attachDelegate(null, function(event){
    var elem = this;
    if (!(state.events.muted[event.type])){
      state.RESET_DUE = true;
      window[config.DATALAYER_NAME].push({
        'event': ('pirate.' + event.type),
        'gtm.element': elem,
        'pirate': {
          'sourceEvent': event
        }
      });
    }

  });


  onready(onready_listen);

}(window, document, (void 0) ));