/*  A abstraction for unit-testing front-end code in Javascript.
    Extends the standard Console functions (assert, group, etc).
    Supports asyncronous test instrumentation.

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


        // an asynchronous test.
        test.group("an async test", function(done){
            var testcase = this;
            this.assertEqual(1, 1);
            setTimeout(function(){
                testcase.assertNotEqual(2, 1);
                done();
            }, 1000)
        });


    The results of a test group are:
        - A "group" in the console, with aggregate timing reported.
        - A summary of all tests run (total, passed/failed)
        - Errors from each test group listed within the console group.

    The console group is generated when `done` is executed (or returned).

    Because this kit is focused on front-end testing, some utility functions are
    provided that really have no bearing on non-browser Javascript environs
    This implementation also targets ES5 JavaScript, though compatibility is
    not expected for IE versions 8 or older.
*/

(function(test, console){

    var hasattrib = Object.hasOwnProperty;
    var _slice = Array.prototype.slice;

    test.profiling = false;
    test.disabled = false;
    test.timing = true;

    // TODO: make it easy to trigger these types....
    // EvalError, RangeError, ReferenceError, SyntaxError, TypeError, URIError


    function _assert(condition, message){
        if(!condition){
            var err = new Error(message || "(assertion failure)");
            err.name = "AssertionError";
            throw err;
        }
    }

    /** Find the last position of an item in an array.
     * @this {Array}
     * @param {Object?} elem
     * @param {number=} offset
     * @return {number}
     */
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


    /** Attach DOM event handlers.
     * @param {Element|Document|Window} node
     * @param {string} events
     * @param {Function} callback
     * @param {boolean=} capture
     */
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


    /** A test case handler.
     * @constructor
     * @param {string} name
     * @param {Function} callback
     * @param {TestStack?=} parent
     */
    function TestStack(name, callback, parent){
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
            return new cls(name, callback, this);
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

        function fixTestFunctionName(name){
            return name.replace(/[^a-z$0-9]+/ig, '_');
        }

        /** Initiates the test performance;
         * Prepares the test termination method, executes the test group, and
         * handles any direct errors.
         */
        proto.start = function(){
            var testcase = this, $done, result;
            var method;

            try {
                // Perform the function, and pass it a done() method.
                if(testActive()){
                    if(this.timing && test.timing) console.time(this.name);
                    method = this.callback;
                    method.name = method.name || fixTestFunctionName(this.name);
                    result = method.call(this, $done = function(err){
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
                this.error(new Error(err));
            } else if(err) {
                this.error(err);
            }
            return this.done();
        }



        /** Close the test group; this will be executed when the test terminates.
         * This coordinates console group rendering and report summary.
         */
        proto.done = function(){

            // Open the group for logging.
            console.group(this.name);
            if(this.timing && test.timing) console.timeEnd(this.name);


            var current, err, params, stack;
            while(this.queue.length){
                current = this.queue.splice(0, 3);
                err = current[0];
                params = current[1] || null;
                stack = current[2];
                if(params)
                    console.assert.apply(console, [false].concat(params));
                console.error(stack);
            }


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

            console.groupEnd();
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

        var RE_STACK_ENTRY = /^\n(\s+at\s.*)\n*/gm;

        function cleansWhitespace(text){
            return text.replace(/\n+/g, '\n').replace(/^\s+/, '').replace(/\s+$/, '');
        }

        function splitStackStatement(stackStr){
            return stackStr.split('\n').map(cleansWhitespace);
        }

        function shiftStackToOrigin(stackStr){
            var stack = splitStackStatement(stackStr);
            var grouplevel_reached = false;

            // Find the reference to (TestStack.prototype.assert);
            var origin = stack.map(function(line, index){
                if(grouplevel_reached) return -1; // a stop condition.

                // We don't want to search any higher than the global test interface.
                else if(~line.indexOf('test.group')){
                    grouplevel_reached = true;
                    return -1;
                }

                // The main assertion method
                else if(~(line.indexOf('.assert'))) return index;

                // Probably an alias to a wrapper of .assert(), like .assertEqual
                else if(~(line.indexOf('.(anonymous function)'))) return index;

                else return -1; // not a relevant line.
            }).reduce(function(prev, cur){
                return Math.max(prev, cur)
            }, -1);

            // Remove up to that .assert() call (the generic assertion)
            if(origin > 0) stack.splice(1, origin);

            return stack.join('\n   ');
        }

        function isParseableError(error){
            return ((error.name == 'AssertionError') &&
                    (~ error.stack.indexOf('at _assert')));
        }


        proto.error = function(error, params){
            var stack;
            var is_assertion_error;

            if(typeof error == 'string')
                error = (new Error(error));

            if(isParseableError(error))
                stack = shiftStackToOrigin(error.stack);
            else
                stack = error.stack;
            this.queue.push(error, params, stack);
        };

        // Masking the assert() method to enable async evaluation.
        proto.assert = function(){
            var params;
            var condition = arguments[0];
            var message_index = (arguments[arguments.length - 1]) - 1;
            var message = null;

            if (typeof message_index == 'number'){
                params = _slice.call(arguments, 1, (arguments.length -1));
                message = params.map(function(value, index){
                    if(index == message_index) return value;
                    else return JSON.stringify(value);
                }).join(' ');
            } else {
                params = _slice.call(arguments, 1);
            }

            try {
                _assert(condition, message);
            } catch (e) {
                this.error(e, params);
            }

            return condition;
        };

    }(TestStack.prototype, TestStack));

    /** Install an assertion method on the global interface as well as the
     * test case prototype.
     * @param {string} name
     * @param {Function} method
     */
    function assertionMethod(name, method){
        var proto = TestStack.prototype, cls = TestStack;
        method.name = name;
        test[name] = method;
        proto[name] = function(){
            // Registers a wrapper function to collect errors for deferred reporting.
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
        proto[name].name = name;
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
        this.assert(val, a, "was not truthy", 2);
        return val;
    }

    function assertFalsey(a){
        var val = !a;
        this.assert(val, a, "was not falsey", 2);
        return val;
    }

    // assertionMethod('assert', assertTruthy);
    assertionMethod('assertTrue', assertTruthy);
    assertionMethod('assertNot', assertFalsey);
    assertionMethod('assertFalse', assertFalsey);

    assertionMethod("assertEqual", function assertEqual(a, b){
        var val = (a == b);
        this.assert(val, a, "was not equal to: ", b, 2);
        return val;
    });

    assertionMethod("assertNotEqual", function assertNotEqual(a, b){
        var val = (a != b);
        this.assert(val, a, "was equal to: ", b, 2)
        return val;
    });

    assertionMethod("assertIdentical", function assertIdentical(a, b){
        var val = (a === b);
        this.assert(val, a, "was not identical to: ", b, 2)
        return val;
    });

    assertionMethod("assertNotIdentical", function assertNotIdentical(a, b){
        var val = (a !== b);
        this.assert(val, a, "was identical to: ", b, 2)
        return val;
    });

    assertionMethod("assertContains", function assertContains(a, b){
        var exists = _lastIndexOf.call(a, b) > -1;
        this.assert(exists, a, "did not contain: ", b, 2);
        return exists;
    });

    assertionMethod("assertNotContains", function assertNotContains(a, b){
        var absent = _lastIndexOf.call(a, b) == -1;
        this.assert(absent, a, "did contains: ", b, 2);
        return absent;
    });

    assertionMethod("assertIn", function assertIn(a, b){
        var present = (a in b);
        this.assert(present, a, "was not found in", b, 2);
        return present;
    });

    assertionMethod("assertNotIn", function assertNotIn(a, b){
        var absent = ! (a in b);
        this.assert(absent, a, "was not found in", b, 2);
        return absent;
    });

    assertionMethod("assertMatches", function assertMatches(a, b){
        var match = (a && a.test && a.test(b));
        this.assert(a && a.test, "This doesn't look like a regular expression:", a, 1);
        this.assert(match, a, "did not match: ", b, 2);
        return match;
    });

    assertionMethod("assertHasAttribute", function assertHasAttribute(elem, attrib){
        var exists = (elem.hasAttribute(attrib));
        this.assert(exists, "Attribute (" + attrib + ") not found on element", elem, 1);
        return exists;
    });

    assertionMethod("assertHasClass", function assertHasClass(elem, clsname){
        var classes = (elem.classNames || elem.getAttribute('class').split(' '));
        var exists = (~ _lastIndexOf(classes, clsname));
        this.assert(exists, "Class (" + clsname + ") not found on element", elem, 1);
        return exists;
    });

    assertionMethod("assertIsElement", function assertIsElement(elem){
        var match = (elem && elem.nodeType === 1);
        this.assert(match, "Not an element.", elem, 1);
        return match;
    });

    assertionMethod("assertIsFragment", function assertIsFragment(elem){
        var match = (elem && elem.nodeType === 11);
        this.assert(match, "Not a document fragment.", elem, 1);
        return match;
    });

    assertionMethod("assertCallable", function assertCallable(elem){
        var match = (elem && elem.call);
        this.assert(match, "Not a callable (function):", elem, 1);
        return match;
    });

    assertionMethod("assertLikeArray", function assertLikeArray(item){
        var match = isLikeArray(item);
        this.assert(match, "Not like an array.", item, 1);
        return match;
    });

    assertionMethod("assertSequenceEqual", function assertSequenceEqual(a, b){
        var i, pass = true, stat;

        this.assert(hasattrib.call(a, 'length'), "Not a sequence?", a, 1);
        this.assert(hasattrib.call(b, 'length'), "Not a sequence?", b, 1);
        this.assert(pass = (a.length == b.length), "Sequences had different length", a, b, 1);
        i = pass && a.length;
        while(i--){
            this.assert(stat = (a[i] == b[i]), "Sequences differed at index", i, a[i], b[i], 1);
            pass = stat && pass;
        }
        return pass;

    });

    // A light wrapper on console.assert() for context evaluation.
    test.assert = function rootAssertion(){
        var message_index = arguments[arguments.length - 1];
        var args = (_slice.call(arguments, 0, (arguments.length -1)));
        return console.assert.apply(console, args);
    };

    test.group = function(name, callback){
        var stack = new TestStack(name, callback, null);
        stack.start();
    };

    test.skipGroup = function(name, callback){
        (new TestStack(name, callback, null)).skip();
    };

    test.expose = function(id, description, name, value){
        var data = (test.data = test.data || []);
        data[id] = data[id] || {"name": description};
        data[id][name] = value;
    };

    test.status = reportAggregateStatus;
    test.onready = onready;

}(window.test = window.test || {}, window.console));