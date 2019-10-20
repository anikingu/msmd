//popup.js

var Popup = (function () {
    function toggleRecording() {
        chrome.runtime.sendMessage({ "message": "toggleRecording" });
    };

    return {
        toggleRecording: toggleRecording
    };
})();

document.addEventListener('DOMContentLoaded', function() {
    var recordingToggle = document.getElementById("recordingToggle"),
    newRecordingToggle = document.getElementById("newRecordingToggle"),
    showRecordingToggle = document.getElementById("showRecordingToggle"),
    anchorCheckbox = document.getElementById("anchorCheckbox")
    
    recordingToggle.addEventListener("click", function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {"message": "toggleRecording"});
        });
    });

    newRecordingToggle.addEventListener("click", function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {"message": "toggleNewRecording"})
        });
    });

    showRecordingToggle.addEventListener("click", function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {"message": "toggleShowRecording"})
        })
    })

    anchorCheckbox.addEventListener("click", function(target) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {"message": target});
        });
    });
});