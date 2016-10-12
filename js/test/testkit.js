/*  A lightweight abstraction for unit-testing front-end code in Javascript.
    Extends the standard Console functions (assert, group, etc).

    Usage example

        test.group("this is a test", function(){ // a console group

            test.profile("it might fail", function(){ wraps an aggregate warning
                test.assertContains([ 1, 2, 3 ], 2);
                test.assertNotContains([1, 2, 3], 4);
                test.assertNotEqual(1, 2);
                test.assert(1 == 1);
                test.assertMatches(/test$/, "this is a test");

                test.assert(1 == 2); // FAIL, will cause the group to fail too
            })

        });


    Because this kit is focused on front-end testing, some utility functions are
    provided that really have no bearing on non-browser Javascript environs.
*/

(function(test, console){

    var hasattrib = Object.hasOwnProperty;

    test.profiling = false;
    test.disabled = false;

    function _lastIndexOf(elem, offset){
        var i = (offset === undefined) ? (this.length) : (offset >>> 0);
        while(i--){
            if(this[i] === elem) break;
        }
        return i;
    }

    function onready(callback){
        var queue = (onready.queue = onready.queue || []);
        if(callback === onready){
            while(callback = queue.pop())
                callback.call(document);
        } else if(callback && callback.call){
            if(document.body)
                callback.call(document);
            else
                queue.push(callback);
        }
    }

    onready.__ready__ = function(){ onready.call(onready, onready) };

    function listen(node, events, callback, capture){
        events.replace(/(?:on)?([a-z]+)/ig, function($0, name){
            var fn = (node.addEventListener || node.attachEvent);
            fn.call(node, name, callback, capture);
        });
    }

    if(document && document.body){
        onready.__ready__();
    } else {
        listen(document, 'load DOMContentLoaded', onready.__ready__);
        listen(window, 'readystatechange', function(){
            if(document.readyState == 'interactive') onready.__ready__();
        });
    }


    var counter = 0;
    var stack = [{fail: 0, total: 0, name: "(root)", timer_active: false, id: (counter++)}];
    var state = {total_fail: 0, total_pass: 0};

    function nextStack(name){
        var item = {fail: 0, total: 0, name: name, timer_active: false, id: (counter++)};
        stack.push(item);
        return item;
    }

    function popStack(failed_other){
        var item = stack.pop();
        if(item.timer_active)
            test.timeEnd();
        if(failed_other || item.fail){
            console.warn("%s: Failed %d tests of %d (passed %f%)",
                         item.name, (item.fail), item.total,
                         Math.round(100 * (item.total - item.fail) / item.total))
        } else if (item.total) {
            console.info("%s: Passed %d tests of %d (passed 100%)",
                         item.name, (item.total - item.fail), item.total)
        }
    }

    function reportAggregateStatus(){
        var ratio = (state.total_pass / (state.total_pass + state.total_fail));

        ratio = isNaN(ratio) ? 1 : ratio;

        if(ratio == 1){
            console.info("Passed 100% of %d tests", state.total_pass);
        } else {
            console.warn("Passed %f% of %d tests (failed %d)",
                         Math.round(100 * ratio),
                         (state.total_pass + state.total_fail),
                         state.total_fail);
        }
        return (ratio == 1)
    }


    function currentStack(){
        return stack[stack.length - 1]
    }

    function testActive(){
        return (console && console.assert);
    }

    test.time = function(name){
        var current = currentStack();
        console.time(name || current.name);
        current.timer_active = true;
    };

    test.timeEnd = function(name){
        console.timeEnd(name || currentStack().name);
    };

    test.clear = function(){
        while(stack.length) popStack();
    };

    test.skip = function(){
        // no-op
    };

    test.group = function(name, callback){
        var result = null, failed = false;
        if(test.disabled) return;
        console.group(name);
        nextStack(name);
        try {
            result = callback.call(test);
        } catch (err) {
            console.error(err, err.stack);
            failed = true;
        } finally {
            popStack(failed);
        }
        console.groupEnd(name);
    };

    test.profile = function(message, callback){
        var result, failed = false;
        if(test.disabled) return;
        nextStack(message);
        try {
            if(test.profiling) console.profile(message);
            result = callback.call(test);
        } catch (err) {
            console.error(err, err.stack);
            failed = true;
        } finally {
            if(test.profiling) console.profileEnd(message);
            popStack(failed);
        }
        return result;
    };

    function assessCurrent(test_state){
        currentStack().total++;
        if(!test_state){
            currentStack().fail++;
            state.total_fail++;
        } else {
            state.total_pass++;
        }
        return test_state;
    }

    function isLikeArray(item){
        return (!!item) && (item.pop && item.pop.call) && (item.push && item.push.call) && ('length' in item)
    }

    test.assert = test.assertTrue = function(a, message){
        testActive() && console.assert(assessCurrent(!!a), a, message || "was not true-ish");
    };

    test.debug = function(o){
        if((o instanceof Node) && console.dirxml){
            console.dirxml(o);
        } else {
            console.dir(o);
        }
    };

    test.expose = function(name, value){
        var data = (test.data = test.data || []);
        var cur = currentStack();
        data[cur.id] = data[cur.id] || {name: cur.name};
        data[cur.id][name] = value;
    };

    test.assertFalse = function(a, message){
        testActive() && console.assert(assessCurrent(!a), a, messsage || "was not falsey");
        return true;
    };

    test.assertEqual = function(a, b, message){
        testActive() && console.assert(assessCurrent(a == b), a, message || "was not equal to: ", b);
        return true;
    };

    test.assertNotEqual = function(a, b, message){
        testActive() && console.assert(assessCurrent(a != b), a, message || "was equal to: ", b);
        return true;
    };

    test.assertIdentical = function(a, b, message){
        testActive() && console.assert(assessCurrent(a === b), a, message || "was not identical to: ", b);
        return true;
    };

    test.assertNotIdentical = function(a, b, message){
        testActive() && console.assert(assessCurrent(a !== b), a, message || "was identical to: ", b);
        return true;
    };

    test.assertContains = function(a, b, message){
        var i = _lastIndexOf.call(a, b);
        testActive() && console.assert(assessCurrent(-1 != i), a, message || "did not contain: ", b);
        return true;
    };

    test.assertIn = function(a, b, message) {
        var present = (a in b);
        testActive() && console.assert(assessCurrent(present), a, message || "was not found in", b);
        return true;
    };

    test.assertNotContains = function(a, b, message){
        var i = _lastIndexOf.call(a, b);
        testActive() && console.assert(assessCurrent(-1 == i), a, message || "contained: ", b);
        return true;
    };

    test.assertSequenceEqual = function(a, b, message){
        var i, pass = true, stat;
        if(testActive()){
            console.assert(hasattrib.call(a, 'length'), "Not a sequence?", a);
            console.assert(hasattrib.call(b, 'length'), "Not a sequence?", b);
            console.assert(pass = (a.length == b.length), message || "Sequences had different length", a, b);
            i = pass && a.length;
            while(i--){
                console.assert(stat = (a[i] == b[i]), message || "Sequences differed at index", i, a[i], b[i]);
                pass = stat && pass;
            }
            assessCurrent(pass);
        }
    };

    test.assertMatches = function(a, b, message){
        console.assert(a && a.test, "This doesn't look like a regular expression:", a);
        testActive() && console.assert(assessCurrent(a.test(b)), a, message || "did not match: ", b);
        return true;
    };

    test.assertHasClass = function(elem, cls, message){
        var classes = elem.classNames;
        var index = _lastIndexOf(classes, cls);
        testActive() && console.assert(assessCurrent(-1 != i), elem, message || "did not have class", cls);
        return true;
    };

    test.assertHasAttribute = function(elem, attrib, message){
        var exists = (elem.hasAttribute(attrib));
        testActive() && console.assert(assessCurrent(exists), elem, message || "did not have the attribute", attrib);
        return true;
    };

    test.assertIsElement = function(elem, message){
        testActive() && console.assert(assessCurrent(elem.nodeType === 1), message || "Not an element", elem);
        return true;
    };

    test.assertIsFragment = function(elem, message){
        testActive() && console.assert(assessCurrent(elem.nodeType === 11), message || "Not a fragment", elem);
        return true;
    };

    test.assertCallable = function(item, message){
        testActive() && console.assert(assessCurrent(item && item.call), message || "Not a callable (function)", item);
        return true;
    };

    test.assertLikeArray = function(item, message){
        var is_array = isLikeArray(item);
        testActive() && console.assert(assessCurrent(is_array), message || "Not like an array", item);
        return true;
    }

    test.status = reportAggregateStatus;
    test.onready = onready;

}(window.test = window.test || {}, window.console));