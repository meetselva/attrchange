/*
An extension for attrchange jQuery plugin
http://meetselva.github.io/attrchange/

About License:
Copyright (C) 2013-2014 Selvakumar Arumugam
You may use attrchange ext plugin under the terms of the MIT Licese.
https://github.com/meetselva/attrchange/blob/master/MIT-License.txt
 */
$.fn.attrchange.extensions = { /*attrchange option/extension*/
	disconnect: function (o) {
		if (typeof o !== 'undefined' && o.isPhysicalDisconnect) {
			return this.each(function() {
				var attrchangeMethod = $(this).data('attrchange-method');
				if (attrchangeMethod == 'propertychange' || attrchangeMethod == 'DOMAttrModified') {
					$(this).off(attrchangeMethod);
				} else if (attrchangeMethod == 'Mutation Observer') {
					$(this).data('attrchange-obs').disconnect();
				} else if (attrchangeMethod == 'polling') {
					clearInterval($(this).data('attrchange-polling-timer'));
				}
			}).removeData('attrchange-method');
		} else { //logical disconnect
			return this.data('attrchange-tdisconnect', 'tdisconnect'); //set a flag that prevents triggering callback onattrchange
		}
	},
	remove: function (o) {
		return  $.fn.attrchange.extensions['disconnect'].call(this, {isPhysicalDisconnect: true});
	},
	getProperties: function (o) {
		var attrchangeMethod = $(this).data('attrchange-method');
		var pollInterval = $(this).data('attrchange-pollInterval');
		return {
			method: attrchangeMethod,
			isPolling: (attrchangeMethod == 'polling'),
			pollingInterval: (typeof pollInterval === 'undefined')?0:parseInt(pollInterval, 10),
			status: (typeof $(this).data('attrchange-tdisconnect') === 'undefined')?((typeof attrchangeMethod === 'undefined')?'removed':'connected'):'disconnected'
		}
	},
	reconnect: function (o) {//reconnect possible only when there is a logical disconnect
		return this.removeData('attrchange-tdisconnect');
	},
	polling: function (o) {
		return this.each(function() {
			var attributes = {};
			for (var attr, i=0, attrs=this.attributes, l=attrs.length; i<l; i++){
				attr = attrs.item(i);
				attributes[attr.nodeName] = attr.nodeValue;
			}
			//this.data('attrchange-polling-attributes', attributes); //save the initial values
			var _this = this;
			$(this).data('attrchange-polling-timer', setInterval(function () {
				var changes = {}, hasChanges = false; // attrName: { oldValue: xxx, newValue: yyy}						
				for (var attr, i=0, attrs=_this.attributes, l=attrs.length; i<l; i++){
					attr = attrs.item(i);							
					if (attributes.hasOwnProperty(attr.nodeName) &&
							attributes[attr.nodeName] != attr.nodeValue) { //check the values
						changes[attr.nodeName] = {oldValue: attributes[attr.nodeName], newValue: attr.nodeValue};
						hasChanges = true;
					} else if (!attributes.hasOwnProperty(attr.nodeName)) { //new attribute
						changes[attr.nodeName] = {oldValue: '', newValue: attr.nodeValue}
						hasChanges = true;
					}
					attributes[attr.nodeName] = attr.nodeValue; //add the attribute to the orig
				}
				if (hasChanges && typeof $(_this).data('attrchange-tdisconnect') === 'undefined') { //disconnected logically
					o.callback.call(_this, changes);
				}
			}, (o.pollInterval)?o.pollInterval: 1000)).data('attrchange-method', 'polling').data('attrchange-pollInterval', o.pollInterval);
		});
	}
}