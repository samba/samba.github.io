---
# Jekyll requires this header. Sorry.
permalink: /js/site.js
---


(function(window, document, jQuery, undefined){
	var $ = jQuery;
	var article_selector = 'article.article';
	var tag_selector = 'span.tag';


	function isPrintMode(listener){
		var query = window.matchMedia && window.matchMedia('print');
		var result = query && query.matches;
		if(query && listener){
			listener.call(query, result);
			return query.addListener(listener);
		} else return result;
	}



	var RE_COLORS = /\b((text-)?(darken|lighten)-[0-9]|(gr[ae]y|blue|green|light|dark)(-text)?)\b/g;

	function removeColorClasses(i, elem){
		elem.setAttribute('class', elem.getAttribute('class').replace(RE_COLORS, ''));
	}


	function twitter_sharebuttonstyle(elements){
		return elements.filter('.twitter-share-button').addClass('no-print').css({
			'display': 'inline-block',
			'position': 'relative',
			'top': '0.4em'
		});
	}

	function twitter_widgetstyle(elements){
		return elements.filter('.twitter-timeline')
			.attr('style', '')
			.addClass('flex')
			.addClass('no-print');
		/* return elements.filter('.twitter-timeline').css({
			'width': null,
			'height': '100%',
			'max-height': null
		}); */
	}

	$(document).ready(function(){

		// $('nav a.button-collapse').sideNav();
		//$('nav a.dropdown-button').dropdown({ hover: false });
		// $('header div.masthead').anystretch();

		twitter_widgetstyle($('iframe.twitter-timeline'));


		if(isPrintMode()){
			$(document.body).find('[class]').each(removeColorClasses);
		} else {
			twttr.ready(function(){
				twttr.widgets.load(document.body);

				twttr.events.bind('rendered', function(e){
					// Sanitize twitter button layout.
					setTimeout(function(){
						twitter_sharebuttonstyle(jQuery(e.target));
						twitter_widgetstyle(jQuery(e.target));
					}, 200);
				});
			});


			// the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
			// $('.modal-trigger').leanModal();
		}

	});

	window.twttr = (function(d, s, id) {

	  var js, fjs = d.getElementsByTagName(s)[0],
	    t = window.twttr || {},
	    p=/^http:/.test(d.location)?'http':'https';
	  if (d.getElementById(id)) return;
	  js = d.createElement(s);
	  js.id = id;
	  js.src = p+"://platform.twitter.com/widgets.js";


	  if(!isPrintMode()) fjs.parentNode.insertBefore(js, fjs);

	  t._e = [];
	  t.ready = function(f) {
	    t._e.push(f);
	  };

	  return t;
	}(document, "script", "twitter-wjs"));



	function getArticleTags(article_elem){
		return $(article_elem).find(tag_selector).map(function(index){
			return $(this).text();
		});
	}

	function activateMatchingArticles(tags){
		$(article_selector).each(function(){
			var mytags = getArticleTags(this);
			var i = mytags.length;
			var j;
			var match = false;
			while(i--){
				j = tags.length;
				while(j--){
					match = match || (tags[j] == mytags[i]);
					if(match) break;
				}
				if(match) break;
			}
			if(match) $(this).removeClass('hidden');
		});
	}

	function hideAllArticles(){
		$(article_selector).addClass('hidden');
	}

	function showAllArticles(){
		$(article_selector).removeClass('hidden');
	}

	function titleCase(text){
		var first = text.charAt(0).toUpperCase();
		return first + text.substr(1).replace(/\s([a-z])/g, function($0, l){
			return $0.substr(0, 1) + l.toUpperCase();
		});
	}

	function applyHeader(tag){
		var header = titleCase(tag.split('-').join(' '));
		$('header h3').text(header);
		var title =document.title.split(' - ').slice(1);
		document.title = header + ' - ' + title.join(' - ');
	}


	function applyTagFilter(){
		if(window.location.hash){
			$(document).ready(function(){
				var tag = window.location.hash.substr(1);
				if(!tag || (tag == 'all')){
					showAllArticles();
					applyHeader('Blog')
				} else {
					hideAllArticles();
					activateMatchingArticles(tag.split(','));
					applyHeader(tag);
				}
			});
		}

	}

	function thisIsABlog(){
		applyTagFilter();
		$(window).on('hashchange', applyTagFilter);
	}

	window.thisIsABlog = thisIsABlog;


}(window, document, window.jQuery, (void 0)));
