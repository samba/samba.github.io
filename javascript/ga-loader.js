
// My scriptified version of the old Google Analytics loader.


(function(){

	var p = document.location.protocol,	s = (p == 'https:') ? 'ssl' : 'www', 
		u = [ p, '//', s, '.google-analytics.com/ga.js' ].join(''), LL = 'load',
		d = document, g = 'getElementsByTagName', a = "UA-5708101-6",
		L = [ [ 'addEventListener', 'removeEventListener' ], [ 'attachEvent', 'detacheEvent' ] ],
		f = function(ev){
			try {
				var pageTracker = _gat._getTracker(this.ua);
				pageTracker._trackPageview();
			} catch(e) {}
		};
	s = document.createElement('script'); s.ua = a;
	s.src = u; s.async = true; s.type = 'text/javascript';
	s = ( d[g]('head') || d[g]('body') )[0].appendChild(s);

	

	if (s[L[0][0]]) return s[L[0][0]](LL, f, false);
	if (s[L[1][0]]) return s[L[1][0]]('on' + LL, function(){ f.call(window.event.srcElement, window.event); });
	f.setAttribute('onload', f);

})();
