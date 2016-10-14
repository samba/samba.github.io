/** Unit tests.
 * These are performed in the browser, so ES5 compatibility is expected.
 *
 */


(function(test, pirate){

    if(!test)
        throw new Error("The test kit does not appear to be loaded yet.")

    if(!pirate)
        throw new Error("The pirate kit appears to be absent.")


    var exercise_testkit_scenarios = false;

    test.group('Pirate Interface', function(done){

        this.assertCallable(pirate.yellow);
        this.assertCallable(pirate.hornswaggle);

        this.assertCallable(pirate.attach);
        this.assertCallable(pirate.pillage);
        this.assertCallable(pirate.ascertain);
        this.assertCallable(pirate.ondeck);
        this.assertCallable(pirate.moor);
        this.assertCallable(pirate.mute);
        this.assertCallable(pirate.swipe);

        this.assert(pirate.config); // an object

        pirate.yellow();
        done();
    });

    function getProperty(dataLayer, name){
        var i = dataLayer.length;
        while(i--){
            if(name in dataLayer[i]){
                return dataLayer[i][name];
            }
        }
        return null;
    }

    test.onready(function(){
        // DOM inspection requires ready-state.
        test.group("Pirate Data", function pirateDataTest(done){
            var data = pirate.hornswaggle('#three');
            this.assertLikeArray(data);

            // We're interested in the first match only.
            data = (data.length === 1) ? data[0] : data;

            this.assertEqual(data['item'], 'the third one');
            this.assertEqual(data['scope'], 'test-case');

            var items = pirate.hornswaggle('div.test ul li');
            this.assertLikeArray(items);
            test.assertEqual(items.length, 3);

            var data2 = pirate.pillage(pirate.select('#three')[0]);
            this.assertEqual(data['item'], data2['item']);

            pirate.moor('p.description');
            this.assertEqual(getProperty(window.dataLayer, 'someValue'), "This value is awesome.");
            done();
        });


        test.group('Pirate Forms', function (done){
            var elem = pirate.select('input#testinput');
            var data = pirate.swipe(elem[0].form);

            this.assertEqual(data['testinput'], 'test text');
            done();
        });

        if(exercise_testkit_scenarios){
            // Just demonstratinging the test kit...
            test.skipGroup("(example skipped group)", function(){ return null });
            test.group("(a known error)", function(){ throw new SyntaxError("an error") });

            test.group("(another known error)", function(){
                this.assertEqual(2, 1);
                return done;
            });

            // Exploring asynchronous tests.
            test.group('(an async test case)', function testAsync(done){
                var state = { counter: 0, limit: 10 };
                var testcase = this;
                var int = setInterval(function(){

                    state.counter ++;
                    if(state.counter == state.limit){
                        done();
                        clearInterval(int);
                    }

                    // raises exceptions.
                    testcase.assert((state.counter % 2) == 0, state.counter, "was not a multiple of", 2, 2);
                }, 13);
            });
        }

        function prepareEvent(name){
            var e = document.createEvent('Event');
            e.initEvent(name, true, true);
            return e;
        }

        test.group("Pirate Events", function pirateEventsTest(done){
            var $test = this;
            var state = { clicked: 0, active: true, touched_datalayer: 0 };

            var elem = pirate.select('#three')[0];
            pirate.attach('click', 'li', function(){ state.clicked ++ });

            // Deactivate these listeners soon.
            setTimeout(function(){ state.active = false }, 100 );

            pirate.ascertain(this.profiler(function inspect(e){ // a DataLayer listener
                if(state.active && (e['event'] == 'pirate.click')){
                    state.touched_datalayer ++;
                    $test.assertIn('gtm.element', e);
                    $test.assertIsElement(e['gtm.element']);
                    $test.assertHasAttribute(e['gtm.element'], 'data-item');
                }
            }));

            elem.dispatchEvent(prepareEvent('click'));
            this.assertEqual(state.clicked, 1);
            this.assertEqual(state.touched_datalayer, 1);

            elem.dispatchEvent(prepareEvent('click'));
            this.assertEqual(state.clicked, 2);
            this.assertEqual(state.touched_datalayer, 2);

            // Mute the event to prevent it from reaching the datalayer.
            // pirate.mute('click');
            window.dataLayer.push({
                'pirate.eventsMute': 'click'
            });

            elem.dispatchEvent(prepareEvent('click'));
            this.assertEqual(state.clicked, 3); // Confirm it was clicked.
            this.assertEqual(state.touched_datalayer, 2); // But did not reach the datalayer.



            done();
        });
    });


}(window.test, window.pirate));