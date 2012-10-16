$(function() {

    var attrTmpl = '<p title="{attrName}">{attrName}<a href="javascript:void(0)" class="remove float-right" title="remove">remove</a><span class="float-right">&nbsp;|&nbsp;</span><a href="javascript:void(0)" class="modify float-right" title="modify">modify</a></p>';

    var $attributeChanger = $('#attributeChanger');
    var $attrchange = $('div', '.demo-content');

    var $logger = $('#logger'); //,logStyler = 0;

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