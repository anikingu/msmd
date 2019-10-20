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
                case "saveCurrentRecording":
                    recorder.saveCurrentRecording();
                    break;
                case "showCurrentRecording":
                    console.log(recorder.getCurrentRecording());
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
        savedRecordings = {},
        settings = {
            eventInterval: 1000
        };

    function init() {
        console.log("Recorder created");
        currentRecording = new Recording();
        $("a").on("click", addEvent);
    };

    function addEvent(event) {
        if(event.originalEvent.isTrusted) {
            console.log("Adding event to recording")
            console.log(event);
            getCurrentRecording().addEvent(event);
        }
    }

    function newRecording() {
        // Reset currentRecording
        currentRecording = new Recording();
        console.log("New recording created");
    };

    function saveCurrentRecording() {
        savedRecordings[currentRecording.meta.hash] = currentRecording;
    }

    function getCurrentRecording() {
        return currentRecording;
    };

    function getAllRecordings() {
        return savedRecordings;
    };

    function replayCurrentRecording() {
        const eventList = currentRecording.getEventList();
        let event, 
            target,
            i=0,
            tid = setInterval((eventList) => {
                event = eventList[i];
                target = event.target;
                console.log(i)
                console.log(event);
                console.log(target);
                target.dispatchEvent(event.originalEvent);
                i++;
                if(i >= eventList.length) {
                    clearInterval(tid);
                }
            }, settings.eventInterval, eventList);
    }

    return {
        init: init,
        newRecording: newRecording,
        saveCurrentRecording: saveCurrentRecording,
        getCurrentRecording: getCurrentRecording,
        getAllRecordings: getAllRecordings,
        replayCurrentRecording: replayCurrentRecording
    };
});

var Recording = (function () {

    console.log("Recording created");
    let eventList = [],
        meta = {
            hash: "Recording_" + Math.random().toString(36).substr(2),
            createdDate: new Date()
        };

    function getMeta() {
        return meta;
    }

    function addEvent(event) {
        eventList.push(event);
    };

    function getEventList() {
        return eventList;
    };

    return {
        meta: getMeta(),
        addEvent: addEvent,
        getEventList: getEventList
    };
});
