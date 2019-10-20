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
    $("input").on("click", function(event) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {"message": event.target.id})
        })
    });
});