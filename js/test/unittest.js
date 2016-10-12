/** Unit tests.
 * These are performed in the browser, so ES5 compatibility is expected.
 *
 */


(function(test, pirate){

    if(!test)
        throw new Error("The test kit does not appear to be loaded yet.")

    if(!pirate)
        throw new Error("The pirate kit appears to be absent.")


    test.group('Pirate Interface', function(){

        test.assertCallable(pirate.yellow);
        test.assertCallable(pirate.hornswaggle);

        test.assertCallable(pirate.attach);
        test.assertCallable(pirate.pillage);
        test.assertCallable(pirate.ascertain);
        test.assertCallable(pirate.ondeck);
        test.assertCallable(pirate.moor);
        test.assertCallable(pirate.mute);
        test.assertCallable(pirate.swipe);

        test.assert(pirate.config); // an object

        pirate.yellow();
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
        test.group("Pirate Data", function(){
            var data = pirate.hornswaggle('#three');
            test.assertLikeArray(data);

            // We're interested in the first match only.
            data = (data.length === 1) ? data[0] : data;

            test.assertEqual(data['item'], 'the third one');
            test.assertEqual(data['scope'], 'test-case');

            var items = pirate.hornswaggle('div.test ul li');
            test.assertLikeArray(items);
            test.assertEqual(items.length, 3);

            var data2 = pirate.pillage(pirate.select('#three')[0]);
            test.assertEqual(data['item'], data2['item']);

            pirate.moor('p.description');
            test.assertEqual(getProperty(window.dataLayer, 'someValue'), "This value is awesome.");
        });


        test.group('Pirate Forms', function(){
            var elem = pirate.select('input#testinput');
            var data = pirate.swipe(elem[0].form);

            test.assertEqual(data['testinput'], 'test text');

        });

        function prepareEvent(name){
            var e = document.createEvent('Event');
            e.initEvent(name, true, true);
            return e;
        }

        test.group("Pirate Events", function(){
            var state = { clicked: 0, active: true, touched_datalayer: 0 };

            var elem = pirate.select('#three')[0];
            pirate.attach('click', 'li', function(){ state.clicked ++ });

            // Deactivate these listeners soon.
            setTimeout(function(){ state.active = false }, 100 );

            pirate.ascertain(function(e){ // a DataLayer listener
                if(state.active && (e['event'] == 'pirate.click')){
                    state.touched_datalayer ++;
                    test.assertIn('gtm.element', e);
                    test.assertIsElement(e['gtm.element']);
                    test.assertHasAttribute(e['gtm.element'], 'data-item');
                }
            });

            elem.dispatchEvent(prepareEvent('click'));
            this.assertEqual(state.clicked, 1);
            this.assertEqual(state.touched_datalayer, 1);

            elem.dispatchEvent(prepareEvent('click'));
            this.assertEqual(state.clicked, 2);
            this.assertEqual(state.touched_datalayer, 2);

            pirate.mute('click'); // Mute the event to prevent it from reaching the datalayer.
            elem.dispatchEvent(prepareEvent('click'));
            this.assertEqual(state.clicked, 3); // Confirm it was clicked.
            this.assertEqual(state.touched_datalayer, 2); // But did not reach the datalayer.
        });
    });


}(window.test, window.pirate));