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
(function(a){function b(){var a=document.createElement("p");var b=false;if(a.addEventListener)a.addEventListener("DOMAttrModified",function(){b=true},false);else if(a.attachEvent)a.attachEvent("onDOMAttrModified",function(){b=true});else return false;a.setAttribute("id","target");return b}var c=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;a.fn.attrchange=function(a){if(c){var d={subtree:false,attributes:true};var e=new c(function(b){b.forEach(function(b){a.call(b.target,b.attributeName)})});return this.each(function(){e.observe(this,d)})}else if(b()){return this.on("DOMAttrModified",function(b){a.call(this,b.attrName)})}else if("onpropertychange"in document.body){return this.on("propertychange",function(b){a.call(this,window.event.propertyName)})}}})(jQuery)

$(function() {

    var attrTmpl = '<p title="{attrName}">{attrName}<a href="javascript:void(0)" class="remove float-right" title="remove">remove</a><span class="float-right">&nbsp;|&nbsp;</span><a href="javascript:void(0)" class="modify float-right" title="modify">modify</a></p>';

    var $attributeChanger = $('#attributeChanger');
    var $attrchange = $('div', '.demo-content');

    var $logger = $('#example2 logger'); //,logStyler = 0;

    $attrchange.attrchange(function(attrName) {
        //var rowStyle = (logStyler) ? 'odd' : 'even';
        $logger.prepend('<p>- ' + '<b>attrchange</b>' + ' handler triggered: <b>' + attrName + '</b> changed for ' + $(this).html() + '</p>');
        //logStyler = logStyler ? 0 : 1;
    });

    $attrchange.click(function() {

        var attrList = [];
        for (var i = 0, attrs = this.attributes, l = attrs.length; i < l; i++) {
            attrList.push(attrTmpl.replace(/{attrName}/g, attrs.item(i).nodeName));
        }

        $('.attrList', $attributeChanger).html(attrList.join(''));

        $attributeChanger.data('demo-div-idx', $(this).index());

        var this_pos = $(this).position();
        $('#attributeChanger').css('left', this_pos.left + $(this).outerWidth(true)).show().stop(true, true).animate({
            top: this_pos.top + 5,
            opacity: 0.2
        }, 200, function() {
            $(this).animate({
                opacity: 1
            }, 500);
        });
    });

    $(document).click(function(e) {
        if (!$(e.target).parent().hasClass('demo-content')
            && !$(e.target).closest('#attributeChanger').length
            && !$('#overlay').is(':visible')) {
            $attributeChanger.stop(true, true).animate({
                top: -100,
                opacity: 0
            }, 500);
        }
    });

    var dialogTitleTmpl = '<div class="ui-corner-all roster_dialog_title ui-widget-header ui-corner-all ui-helper-clearfix"><span class="strong float-left">{DIALOG_TITLE}</span><span class="ui-corner-all float-right roster-close">';

    var $attrName = $('.attrName', '#addOrmodifyAttr'),
        $attrValue = $('.attrValue', '#addOrmodifyAttr'),
        $attrAMUpdate = $('.update', '#addOrmodifyAttr');
    
    $attributeChanger.on('click', 'a.remove', function(e) {
        var $p = $(this).closest('p');
        var demoDivIdx = $attributeChanger.data('demo-div-idx');

        $attrchange.eq(demoDivIdx)[0].removeAttribute($p[0].title);
        $p.remove();
    }).on('click', 'a.modify', function(e) {
        var $p = $(this).closest('p');
        var demoDivIdx = $attributeChanger.data('demo-div-idx');

        $attrName.val($p[0].title).addClass('nbnbg');
        $attrValue
            .val($attrchange
            .eq(demoDivIdx)
            .attr($p[0].title));
        
        $('#addOrmodifyAttr, #overlay').show();       
    }).on('click', '.addAttribute', function () {
        $attrName.val('').removeClass('nbnbg');
        $attrValue.val('');
        $('#addOrmodifyAttr, #overlay').show();
    });
    
    $('.close', '#addOrmodifyAttr').click (function () {
       $('#addOrmodifyAttr, #overlay').fadeOut(200);
    });
    
    $('.update', '#addOrmodifyAttr').click (function () {
        var demoDivIdx = $attributeChanger.data('demo-div-idx');
        
        $attrchange
            .eq(demoDivIdx)
            .attr($attrName.val(), $attrValue.val())
            .click(); //update attr value
        
        $('#addOrmodifyAttr, #overlay').fadeOut(200);
    });    

    $('#clearLog').click(function() {
        $logger.find('p').remove();
    });
});