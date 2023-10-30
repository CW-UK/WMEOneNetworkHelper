// ==UserScript==
// @name           WME one.network helper
// @description    Retains just the reference when pasting the share URL
// @namespace      https://github.com/CW-UK/WMEOneNetworkHelper
// @version        0.5
// @match           *://*.waze.com/*editor*
// @exclude         *://*.waze.com/user/editor*
// @author         Craig24x7, JamesKingdom
// @license        MIT
// ==/UserScript==

/* global $ */
(function() {

    'use strict';
    var closureDesc;

    document.addEventListener("wme-ready", initOneNetHelper, {
        once: true
    });

    function initOneNetHelper() {
        console.log('WME one.network helper: Loaded');
    }

    function stripOneNetworkStuff(input, space) {
        var refStr = space ? ' #' : '#';
        var input1 = input.replace('https://one.network/?GBTMI', refStr);
        var input2 = input1.replace('https://one.network/?GB', refStr);
        return input2;
    }

    function changeTimeField($element, newtime) {
        $element.trigger({
            type: "changeTime.timepicker",
            time: {
                value: newtime,
                hours: newtime.substring(0, 2),
                minutes: newtime.substring(3, 5),
                seconds: 0,
                meridian: 0
            }
        });
    }

    $(document).on('blur', '#closure_reason', function() {
        var newReference = this.value;
        newReference = newReference.replace('https://one.network/?GBTMI', '#');
        this.value = newReference.replace('https://one.network/?GB', '#');
    });

    $(document).on('focus', '#closure_reason', function() {
        var elem = $('#panel-container > div > div > div.top-section > div > div > div > div.collapsible.content > p.extraInfo');
        if (elem.length > 0) {
            if ($(this).val().length > 0) {
                return;
            }
            $(this).val(stripOneNetworkStuff(elem.text(), true));
            changeTimeField($("#edit-panel div.closures div.form-group.start-date-form-group > div.date-time-picker > div > input"), '08:00');
            changeTimeField($("#edit-panel div.closures div.form-group.end-date-form-group > div.date-time-picker > div > input"), '18:00');
        }
    });

})();
