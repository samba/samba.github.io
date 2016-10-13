/*  A lightweight abstraction for unit-testing front-end code in Javascript.
    Extends the standard Console functions (assert, group, etc).

    Usage example

        test.group("this is a test", function(done){ // a console group

            test.profile("it might fail", function(){ wraps an aggregate warning
                this.assertContains([ 1, 2, 3 ], 2);
                this.assertNotContains([1, 2, 3], 4);
                this.assertNotEqual(1, 2);
                this.assert(1 == 1);
                this.assertMatches(/test$/, "this is a test");

                this.assert(1 == 2); // FAIL, will cause the group to fail too
            })

            return done
        });


    Because this kit is focused on front-end testing, some utility functions are
    provided that really have no bearing on non-browser Javascript environs.
*/

(function(test, console){

    var hasattrib = Object.hasOwnProperty;

    test.profiling = false;
    test.disabled = false;
    test.timing = true;

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

    // Register the on-ready state handler
    if(document && document.body){
        onready.__ready__();
    } else {
        listen(document, 'load DOMContentLoaded', onready.__ready__);
        listen(window, 'readystatechange', function(){
            if(document.readyState == 'interactive') onready.__ready__();
        });
    }


    function testActive(){
        return (!test.disabled) && (console && console.assert);
    }


    function isLikeArray(item){
        return (!!item) && (item.pop && item.pop.call) && (item.push && item.push.call) && ('length' in item)
    }


    /** @constructor */
    function TestStack(name, parent, callback){
        this.name = name;
        this.parent = parent || this;
        this.root = (this.parent === this);
        this.failed = 0;
        this.passed = 0;
        this.total = 0;
        this.timing = true;
        this.profiling = true;
        this.id = (TestStack.state.counter++);
        this.callback = callback;
        this.queue = [];
    }

    (function(proto, cls){

        var state = (cls.state = cls.state || {total_fail: 0, total_pass: 0, counter: 0});

        proto.makeChild = function(name, callback){
            return new cls(name, this, callback);
        };

        function assessCurrent(stack, success){
            stack.total ++;
            if(success){
                stack.passed ++;
                state.total_pass ++;
            } else {
                stack.failed ++;
                state.total_fail ++;
            }
        }

        cls.assessCurrent = assessCurrent;

        proto.skip = function(){
            console.warn("Skipping tests: %s", this.name);
        };

        proto.start = function(){
            var testcase = this, $done, result;

            // Open the group for logging.
            console.group(this.name);

            if(this.timing && test.timing) console.time(this.name);

            try {
                // Perform the function, and pass it a done() method.
                if(testActive()){
                    result = this.callback.call(this, $done = function(err){
                        if(err) testcase.fail(err);
                        else testcase.done();
                    });
                    if(result === false) this.fail();
                    else if (result === $done) this.done();
                }
            } catch (err) {
                this.fail(err)
            }
        };

        proto.profiler = function(callback){
            var ident = (callback.name || '(anon)') + ' in [' + this.name + ']';
            var profiling = this.profiling && (test.profiling);
            return function(){
                var result = null;
                if(profiling) console.profile(ident);
                try {
                    result = callback.apply(this, arguments);
                } catch (e) {
                    console.error(e, e.stack);
                    result = null;
                } finally {
                    if(profiling) console.profileEnd(ident);
                    return result;
                }
            }
        };

        proto.profile = function(callback){
            return this.profiler(callback).call(this);
        };


        proto.fail = function(err){ // close the group with an error.
            this.total ++;
            this.failed ++;
            state.total_fail ++;
            if(typeof err == 'string'){
                console.error(err);
            } else if(err) {
                console.error(err, err.stack);
            }
            return this.done();
        }

        proto.done = function(){ // close the group
            // TODO: defer construction of the group until everything completes?

            if(this.timing && test.timing) console.timeEnd(this.name);

            if(this.failed){
                console.warn("%s: Failed %d tests of %d (passed %f%)",
                             this.name, this.failed, this.total,
                             Math.round(100 * (this.passed / this.total)))
            } else if (this.passed){
                console.info("%s: Passed %d tests of %d (passed 100%)",
                              this.name, this.passed, this.total)
            } else {
                console.warn("%s: no tests passed?", this.name)
            }

            console.groupEnd(this.name);
        };

        proto.debug = function(o){
            if((o instanceof Node) && console.dirxml){
                console.dirxml(o);
            } else {
                console.dir(o);
            }
        };

        proto.expose = function(name, value){
            test.expose(this.id, this.name, name, value);
        };


    }(TestStack.prototype, TestStack));

    /** Install an assertion method on the global interface as well as the
     * test case prototype.
     * @param {string} name
     * @param {Function} method
     */
    function assertionMethod(name, method){
        var proto = TestStack.prototype, cls = TestStack;
        test[name] = method;
        proto[name] = function(){
            var status = false;
            try {
                status = method.apply(this, arguments);
            } catch (e) {
                console.error(e, e.stack);
                status = false;
            } finally {
                cls.assessCurrent(this, status);
            }
        };
    }



    function reportAggregateStatus(){
        var state = TestStack.state;
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

    function assertTruthy(a){
        var val = !!a;
        console.assert(val, a, "was not truthy");
        return val;
    }

    function assertFalsey(a){
        var val = !a;
        console.assert(val, a, "was not falsey");
        return val;
    }

    assertionMethod('assert', assertTruthy);
    assertionMethod('assertTrue', assertTruthy);
    assertionMethod('assertNot', assertFalsey);
    assertionMethod('assertFalse', assertFalsey);

    assertionMethod("assertEqual", function(a, b){
        var val = (a == b);
        console.assert(val, a, "was not equal to: ", b)
        return val;
    });

    assertionMethod("assertNotEqual", function(a, b){
        var val = (a != b);
        console.assert(val, a, "was equal to: ", b)
        return val;
    });

    assertionMethod("assertIdentical", function(a, b){
        var val = (a === b);
        console.assert(val, a, "was not identical to: ", b)
        return val;
    });

    assertionMethod("assertNotIdentical", function(a, b){
        var val = (a !== b);
        console.assert(val, a, "was identical to: ", b)
        return val;
    });

    assertionMethod("assertContains", function(a, b){
        var exists = _lastIndexOf.call(a, b) > -1;
        console.assert(exists, a, "did not contain: ", b);
        return exists;
    });

    assertionMethod("assertNotContains", function(a, b){
        var absent = _lastIndexOf.call(a, b) == -1;
        console.assert(absent, a, "did contains: ", b);
        return absent;
    });

    assertionMethod("assertIn", function(a, b){
        var present = (a in b);
        console.assert(present, a, "was not found in", b);
        return present;
    });

    assertionMethod("assertNotIn", function(a, b){
        var absent = ! (a in b);
        console.assert(absent, a, "was not found in", b);
        return absent;
    });

    assertionMethod("assertMatches", function(a, b){
        var match = (a && a.test && a.test(b));
        console.assert(a && a.test, "This doesn't look like a regular expression:", a);
        console.assert(match, a, "did not match: ", b);
        return match;
    });

    assertionMethod("assertHasAttribute", function(elem, attrib){
        var exists = (elem.hasAttribute(attrib));
        console.assert(exists, "Attribute", attrib, "not found on element", elem);
        return exists;
    });

    assertionMethod("assertHasClass", function(elem, clsname){
        var classes = elem.classNames;
        var exists = (~ _lastIndexOf(classes, clsname));
        console.assert(exists, "Class", clsname, "not found on element", elem);
        return exists;
    });

    assertionMethod("assertIsElement", function(elem){
        var match = (elem && elem.nodeType === 1);
        console.assert(match, "Not an element.", elem);
        return match;
    });

    assertionMethod("assertIsFragment", function(elem){
        var match = (elem && elem.nodeType === 11);
        console.assert(match, "Not a document fragment.", elem);
        return match;
    });

    assertionMethod("assertCallable", function(elem){
        var match = (elem && elem.call);
        console.assert(match, "Not a callable (function):", elem);
        return match;
    });

    assertionMethod("assertLikeArray", function(item){
        var match = isLikeArray(item);
        console.assert(match, "Not like an array.", item);
        return match;
    });

    assertionMethod("assertSequenceEqual", function(a, b){
        var i, pass = true, stat;

        console.assert(hasattrib.call(a, 'length'), "Not a sequence?", a);
        console.assert(hasattrib.call(b, 'length'), "Not a sequence?", b);
        console.assert(pass = (a.length == b.length), "Sequences had different length", a, b);
        i = pass && a.length;
        while(i--){
            console.assert(stat = (a[i] == b[i]), "Sequences differed at index", i, a[i], b[i]);
            pass = stat && pass;
        }
        return pass;

    });


    test.root = new TestStack("(root)", null);

    test.group = function(name, callback){
        var stack = test.root.makeChild(name, callback);
        stack.start();
    };

    test.skipGroup = function(name, callback){
        test.root.makeChild(name, callback).skip();
    };

    test.expose = function(id, description, name, value){
        var data = (test.data = test.data || []);
        data[id] = data[id] || {"name": description};
        data[id][name] = value;
    };

    test.status = reportAggregateStatus;
    test.onready = onready;

}(window.test = window.test || {}, window.console));