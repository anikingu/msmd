// content.js

chrome.runtime.onMessage.addListener(
    function() {
        // Something
    }
);

window.onload = function() {
    var recorder = new Recorder();
    recorder.init();
}

var Recorder = (function() {
    let isRecording,
    recordingList = [];

    function init() {
        console.log("Recorder created");
        return this;
    };

    return {
        init: init
    };
});

var Recording = (function() {

    let eventList = [];

    function addEvent(event) {
        eventList.push(event);
    };

    function getEventList() {
        return eventList;
    };

    return {
        addEvent: addEvent,
        getEventList: getEventList
    };
});