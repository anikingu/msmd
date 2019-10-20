// content.js

window.onload = function () {
    var recorder = new Recorder();
    recorder.init();
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            // Start by logging message
            console.log(request.message);
            switch (request.message) {
                case "startNewRecording":
                    recorder.newRecording();
                    break;
                case "showCurrentRecording":
                    console.log(recorder.getCurrentRecording().getEventList());
                    break;
                case "showAllRecordings":
                    console.log(recorder.getAllRecordings());
                    break;
                case "replayCurrentRecording":
                    recorder.replayCurrentRecording();
                    break;
                default:
                    console.log("Unhandled message " + request.message.toString());
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
        $("a").on("click", addEvent);
        return this;
    };

    function addEvent(event) {
        getCurrentRecording().addEvent(event);
    }

    function newRecording() {
        // Add a new recording to the recording list. Set this new recording to be the current recording
        currentRecording = new Recording();
        recordingList.push(currentRecording);
        console.log("New recording created");
    };

    function getCurrentRecording() {
        return currentRecording;
    };

    function getAllRecordings() {
        return recordingList;
    };

    function replayCurrentRecording() {
        const eventList = currentRecording.getEventList();
        for(let i=0; i<eventList.length; i++) {
            console.log(eventList[i]);
        }
    }

    return {
        init: init,
        newRecording: newRecording,
        getCurrentRecording: getCurrentRecording,
        getAllRecordings: getAllRecordings,
        replayCurrentRecording: replayCurrentRecording
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
