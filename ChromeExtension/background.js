// background.js

// Called when the user clicks on the browser action
chrome.browserAction.onClicked.addListener(
    function(tab) {
        // For now, send a toggle message to content.js
        // toggle message will be used to start and stop/print new recording
        console.log("Sending toggle");
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var activeTab = tabs[0]
            chrome.tabs.sendMessage(activeTab.id, {"message": "toggle"})
        });
    }
);