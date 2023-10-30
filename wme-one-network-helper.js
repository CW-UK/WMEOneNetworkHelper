// ==UserScript==
// @name           WME one.network helper
// @description    Retains just the reference when pasting the share URL
// @namespace      https://github.com/CW-UK/WMEOneNetworkHelper
// @version        0.6
// @match           *://*.waze.com/*editor*
// @exclude         *://*.waze.com/user/editor*
// @author         Craig24x7, JamesKingdom
// @license        MIT
// @grant          GM_setValue
// @grant          GM_getValue
// ==/UserScript==

/* global $ */
/* global W */

(function() {

    'use strict';
    var closureDesc;

    document.addEventListener("wme-ready", initOneNetHelper, {
        once: true
    });

    function initOneNetHelper() {
        createOneNetHelperTab();
        console.log('WME one.network helper: Loaded');
    }

    function createOneNetHelperTab() {
        const { tabLabel, tabPane } = W.userscripts.registerSidebarTab("wme-onenethelper");
        if (!GM_getValue("startTime")) { GM_setValue("startTime", "08:00"); }
        if (!GM_getValue("endTime")) { GM_setValue("endTime", "18:00"); }
        if (GM_getValue("onhEnabled").length < 1) { GM_setValue("onhEnabled", true); }
        var onhEnabledCheckbox = GM_getValue("onhEnabled") ? " checked" : "";
        tabLabel.innerText = '🚧';
        tabLabel.title = 'WME one.network Helper';
        tabPane.id = 'sidepanel-wme-onenethelper';
        tabPane.innerHTML = "<h3>one.network Helper</h3>";
        tabPane.innerHTML += '<hr style="border-top: 3px solid #bbb;" />';
        tabPane.innerHTML += '<input type="checkbox" id="wme-onenethelper-enabled"'+onhEnabledCheckbox+'> <label for="onhenabled">Enable script?</label>';
        tabPane.innerHTML += '<hr style="border-top: 3px solid #bbb;" />';
        tabPane.innerHTML += '<h6>Default Start/End Times</h6>';
        tabPane.innerHTML += 'Start at <input type="text" id="wme-onenethelperStartTime" value="' + GM_getValue("startTime") + '" style="width: 60px; text-align: center;"> ';
        tabPane.innerHTML += 'End at <input type="text" id="wme-onenethelperEndTime" value="' + GM_getValue("endTime") + '" style="width: 60px; text-align: center;"><br />';
        tabPane.innerHTML += '<hr style="border-top: 3px solid #bbb;" />';
        tabPane.innerHTML += '<h6>Settings</h6>';
        tabPane.innerHTML += 'auto-fill reference<br />';
        tabPane.innerHTML += 'auto-replace ref from pasted URL<br />';
        tabPane.innerHTML += 'only replace 00:00-23:59 times';
    }

    // Remove one.network URL from references, optionally include a space before.
    function stripOneNetworkStuff(input, space) {
        var refStr = space ? ' #' : '#';
        var input1 = input.replace('https://one.network/?GBTMI', refStr);
        var input2 = input1.replace('https://one.network/?GB', refStr);
        return input2;
    }

    // Update the time in a way that WME accepts
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

    // Trigger when user moves away from description and convert URLs to references
    $(document).on('blur', '#closure_reason', function() {
        $(this).val(stripOneNetworkStuff(this.value, false));
    });

    // Fill reference from MP when focus is given (by default in WME when opening the closure panel)
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

    // Update settings from script tab
    $(document).on('change', '#wme-onenethelper-enabled', function() {
        if (this.checked) { GM_setValue("onhEnabled", true); console.log("enabled"); }
        else { GM_setValue("onhEnabled", false); console.log("disabled"); }
    });

})();
