/*
A simple jQuery function that can be used to add listeners on attribute change.
*/
//Initial version of a cross-browser proof attrchange listener. (How proof is it? yet to be tested :) )
(function($) {
   function isDOMAttrModifiedSupported() {
	var p = document.createElement('p');
	var flag = false;

	if (p.addEventListener) p.addEventListener('DOMAttrModified', function() {
		flag = true
	}, false);
	else if (p.attachEvent) p.attachEvent('onDOMAttrModified', function() {
		flag = true
	});
	else return false;

	p.setAttribute('id', 'target');

	return flag;
   }

   //initialize Mutation Observer
   var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

   $.fn.attrchange = function(callback) {
	/*
	   Mutation Observer is still new and not supported by all browsers. 
	   http://lists.w3.org/Archives/Public/public-webapps/2011JulSep/1622.html
	*/
	if (MutationObserver) {
		var options = {
			subtree: false,
			attributes: true
		};

		var observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(e) {
				callback.call(e.target, e.attributeName);
			});
		});

		return this.each(function() {
			observer.observe(this, options);
		});
	} else if (isDOMAttrModifiedSupported()) {
		//Good old Mutation Events but the performance is mm not so appealing
		//http://hacks.mozilla.org/2012/05/dom-mutationobserver-reacting-to-dom-changes-without-killing-browser-performance/
		return this.on('DOMAttrModified', function(e) {
			callback.call(this, e.attrName);
		});
	} else if ('onpropertychange' in document.body) {
		//works only in IE
		return this.on('propertychange', function(e) {
			callback.call(this, e.propertyName);
		});
	}
   }
})(jQuery);