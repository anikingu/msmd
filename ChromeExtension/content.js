// content.js

/*
TODO LIST
- Allow for starting, pausing, and stopping recording (during creation)
- Enable tab-scoped recording that continues even when navigating to a new page
- Import/Export recordings
- Display list of previous recordings to go back to
- Record more than just clicks (e.g. keystrokes, onblur, etc.)
- Allow custom events to be specified and recorded
- Determine what elements are selected based on type
- Enable logging outside of console
- Remove all external libraries that are downloaded locally (e.g. import jquery from website)

- Allow for recordings to be loaded from browser storage
- If loaded recordings are from the same domain, allow for them to be further edited


*/
var recorder;
window.onload = function () {
    recorder = new Recorder();
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
                case "startRecording":
                    recorder.startRecording();
                    break;
                case "stopRecording":
                    recorder.stopRecording();
                    break;
                default:
                    console.log("Unhandled message " + request.message.toString());
            }
        }
    );
}

var Recorder = (function () {
    let isRecording,
        numWatchedElements,
        currentRecording,
        savedRecordings = {},
        settings = {
            eventInterval: 1000,
            eventTypes: new Set()
        },
        keyboardListener = new KeyboardListener();

    function init() {
        console.log("Recorder created");
        // settings.eventTypes.add("click");
        // settings.eventTypes.add("keypress");
        // settings.eventTypes.add("focus");
        currentRecording = new Recording();
        keyboardListener.setRecording(currentRecording);
        keyboardListener.toggleListener(true);
    };

    function newRecording() {
        // Reset currentRecording
        currentRecording = new Recording();
        console.log("New recording created");
        isRecording = false
    };

    function recordEvent(event) {
        if(event.isTrusted) {
            console.log("Adding event to recording");
            console.log(event);
            getCurrentRecording().addEvent(event);
        }
    }

    function startRecording() {
        // Create a new recording and then setup the event listener
        newRecording();
        function func(node) {
            if(node.childElementCount === 0) {
                settings.eventTypes.forEach(function(eventType) {
                    node.addEventListener(eventType, recordEvent, false)});
                return 1;
            } else {
                let cnt = 0;
                for(let i=0; i<node.childElementCount; i++) {
                    cnt += func(node.children[i]);
                }
                return cnt;
            };
        };
        numWatchedElements = func(document);
        isRecording = true;
    }

    function stopRecording() {
        isRecording = false;
        // Remove listeners
        function func(node) {
            if(node.childElementCount === 0) {
                settings.eventTypes.forEach(function(eventType) {
                    node.removeEventListener(eventType, recordEvent, false);
                })
            } else {
                for(let i=0; i<node.childElementCount; i++) {
                    func(node.children[i]);
                }
            }
        }
        func(document);
        promptSaveRecording();
    }

    function promptSaveRecording() {
        let response = prompt("Enter a name to save the recording. (Press cancel to abort)", currentRecording.meta.name);
        if (response) {
            currentRecording.meta.name = response;
            saveCurrentRecording();
        }
    }

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
                console.log(event);
                event.replay();

                i++;
                if(i >= eventList.length) {
                    clearInterval(tid);
                }
            }, settings.eventInterval, eventList);
    }

    return {
        isRecording: isRecording,
        numWatchedElements: numWatchedElements,
        currentRecording: currentRecording,
        savedRecordings: savedRecordings,
        settings: settings,

        init: init,
        newRecording: newRecording,
        saveCurrentRecording: saveCurrentRecording,
        getCurrentRecording: getCurrentRecording,
        getAllRecordings: getAllRecordings,
        replayCurrentRecording: replayCurrentRecording,
        startRecording: startRecording,
        stopRecording: stopRecording
    };
});

var Recording = (function () {

    console.log("Recording created");
    let eventList = [],
        meta = {
            hash: "Recording_" + Math.random().toString(36).substr(2),
            createdDate: new Date(),
            name: ""
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
        eventList: eventList,

        meta: getMeta(),
        addEvent: addEvent,
        getEventList: getEventList
    };
});

const MsmdAction = (function(replayCallback, argObj) {

    function replay() {
        if(replayCallback) {
            replayCallback(argObj);
        } else {
            console.log("Replay action.")
        }
    }

    return {
        replay: replay
    }
})

let KeyboardListener = (function() {

    let eventTypes = new Set(),
        listenerOn = false,
        recording;
    eventTypes.add("keypress");

    function toggleListener(switchOn) {
        if(switchOn !== listenerOn) {
            toggleListenerHelper(document, switchOn);
            listenerOn = switchOn;
            console.log( listenerOn ?
                "Keyboard Listening Enabled" :
                "Keyboard Listening Disabled");
        }
    }

    function toggleListenerHelper(node, switchOn) {
        if(node.childElementCount === 0) {
            eventTypes.forEach(function(eventType) {
                if(switchOn) {
                    node.addEventListener(eventType, capture, false);
                } else {
                    node.removeEventListener(eventType, capture, false);
                }
            })
        } else {
            for(let i=0; i<node.childElementCount; i++) {
                toggleListenerHelper(node.children[i], switchOn);
            }
        }
    }

    function capture(event) {
        let argObj = {event: event};
            action = new MsmdAction(replay, argObj);
        recording.addEvent(action);
        console.log("Captured keypress");
    }

    function replay(argObj) {
        let event = argObj.event;
        console.log(event);
        console.log(event.target);
    }

    function setRecording(rec) {
        recording = rec;
    }

    return {
        toggleListener: toggleListener,
        setRecording: setRecording
    }
})