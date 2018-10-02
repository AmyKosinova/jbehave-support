let nexusAPI = "https://mvnrepository.com/artifact/org.jbehavesupport/jbehave-support-core";
let nexusJbusLocation = "https://mvnrepository.com/artifact/org.jbehavesupport/jbehave-support";

function indexReady() {
    checkNewVersion();
}

function reportReady() {
    $('#expand-all-test-steps').click(function () {
        showHideAllInElement('#test-steps-body');
    });

    $('#expand-all-soap-calls').click(function () {
        showHideAllInElement('#soap-calls-body');
    });

    $('#expand-all-rest-calls').click(function () {
        showHideAllInElement('#rest-calls-body');
    });

    $('#expand-all-shell-logs').click(function () {
        showHideAllInElement('#shell-logs-body');
    });

    /* classes for formatting time in format: 2017-10-13T15:14:30.416+02:00[Europe/Prague] */
    $('.time-string').each(function () {
        $(this).text(getTimeString($(this).text()));
    });

    $('.time-string-millis').each(function () {
        $(this).text(getTimeString($(this).text()));
    });

    /* pretty printing */
    $('.json-message').each(function () {
        $(this).html(jsonPrettyPrint($(this).text()));
    });

    display('story1');
    checkNewVersion();
}

function filter(status) {
    if (status) {
        $('#report-table li:not([class*="header"])').each(function () {
            $(this).toggle($(this).attr('status') == status);
        });
    } else {
        $("#report-table li").show();
    }
}


function checkNewVersion() {
    $.ajax({
        method: "GET",
        url: nexusAPI,
        crossDomain: true,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        success: function (data) {
            let newestVersion = $(data).find("version").text();
            let userVersion = $('#userVersion').attr('version');

            if (newestVersion != userVersion) {
                let currentVersionDiv = $('#currentVersion');
                currentVersionDiv.removeClass('invisible');
                currentVersionDiv.empty();
                currentVersionDiv.append('<a href="' + nexusJbusLocation + '">Newer version available: ' + newestVersion + '</a>');
            }
        }
    });
}

function showHideAllInElement(elementId) {
    if ($(elementId).data("lastState") === null || $(elementId).data("lastState") === 0) {
        $(elementId + ' .collapse').collapse('hide');
        $(elementId).data("lastState", 1);
    }
    else {
        $(elementId + ' .collapse').collapse('show');
        $(elementId).data("lastState", 0);
    }
}

function getTimeStringWithMillis(isoValue) {
    return getMomentString(stringValue, 'YYYY-MM-DD HH:mm:ss.SSS');
}

function getTimeString(stringValue) {
    return getMomentString(stringValue, 'YYYY-MM-DD HH:mm:ss');
}

function getMomentString(stringValue, timeFormat) {
    let isoString = stringValue.substring(0, stringValue.indexOf('['));
    return moment(isoString).format(timeFormat);
}

function jsonPrettyPrint(json) {
    if (json.charAt(0) == '{' || json.charAt(0) == '[') {
        let obj = JSON.parse(json);
        return jsonHighlight(JSON.stringify(obj, null, 4));
    } else {
        return json;
    }
}

function jsonHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'json-number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'json-key';
            } else {
                cls = 'json-string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'json-boolean';
        } else if (/null/.test(match)) {
            cls = 'json-null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function display(storyId) {
    $('div[type="story"]').each(function () {
        $(this).toggle($(this).attr('id') == storyId);
    });
    $('body').attr('data-target', '#' + $('div[id=' + storyId + ']').find('nav').attr('id'));
}
