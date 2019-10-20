// content.js

window.onload = function () {
    var recorder = new Recorder();
    recorder.init();
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            // Start by logging message
            console.log(request.message);
            switch (request.message) {
                case "recordingToggle":
                    break;
                case "toggleNewRecording":
                    recorder.newRecording();
                    break;
                case "toggleShowRecording":
                    console.log(recorder.getCurrentRecording().getEventList());
                    break;
                default:
                    console.log("Unhandled message " + request.message);
            }
        }
    );
}

var Recorder = (function () {
    let isRecording,
        currentRecording,
        recordingList = [];

    function init() {
        console.log("Recorder created");
        return this;
    };

    function newRecording() {
        // Add a new recording to the recording list. Set this new recording to be the current recording
        currentRecording = new Recording();
        recordingList.push(currentRecording);
        console.log("New recording created");
    };

    function getCurrentRecording() {
        return currentRecording;
    }

    return {
        init: init,
        newRecording: newRecording,
        getCurrentRecording: getCurrentRecording
    };
});

var Recording = (function () {

    console.log("Recording created");
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
