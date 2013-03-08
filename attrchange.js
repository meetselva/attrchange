/*
A simple jQuery function that can be used to add listeners on attribute change.

Copyright (C) (2011-2012) Selvakumar Arumugam

This program is free software: you  can redistribute it and/or modify it
under the  terms of the GNU  General Public License as  published by the
Free Software Foundation,  either version 3 of the License,  or (at your
option) any later version.

This  program  is distributed  in  the  hope  that  it will  be  useful,
but  WITHOUT  ANY  WARRANTY;  without   even  the  implied  warranty  of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
Public License for more details.

You should have received a copy  of the GNU General Public License along
with this program. If not, see <http://www.gnu.org/licenses/>.
*/
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
   var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

   $.fn.attrchange = function(callback) {	  
		if (MutationObserver) { //Modern Browsers supporting MutationObserver
			/*
			   Mutation Observer is still new and not supported by all browsers. 
			   http://lists.w3.org/Archives/Public/public-webapps/2011JulSep/1622.html
			*/
			var options = {
				subtree: false,
				attributes: true,
				attributeOldValue: true
			};
	
			var observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(e) {
					callback.call(e.target, e, e.attributeName);
				});
			});
	
			return this.each(function() {
				observer.observe(this, options);
			});
		} else if (isDOMAttrModifiedSupported()) { //Opera
			//Good old Mutation Events but the performance is no good
			//http://hacks.mozilla.org/2012/05/dom-mutationobserver-reacting-to-dom-changes-without-killing-browser-performance/
			return this.on('DOMAttrModified', function(e) {
				callback.call(this, e, e.attrName);
			});
		} else if ('onpropertychange' in document.body) { //works only in IE		
			return this.on('propertychange', function(e) {
				callback.call(this, e, window.event.propertyName);
			});
		}

		return this;
    }
})(jQuery);
