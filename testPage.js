window.onload = function() {
    console.log("Loaded testPage.js");
    toggleListeners();
}

const listenerTypes = new Set();
    listenerTypes.add("click");
    listenerTypes.add("change");
    // listenerTypes.add("keypress");
    listenerTypes.add("focus");

let listenersActive = false;

const toggleListeners = function() {
    if(listenersActive) {
        toggleHelper(document,false);
        console.log("Listeners deactivated");
    } else {
        toggleHelper(document, true);
        console.log("Listeners Activated");
    }
    listenersActive = !listenersActive;
}

const listen = function(event) {
    console.log("Event triggerred");
    console.log(event.path);
    console.log(event);
}

const toggleHelper = function(node, setOn) {
    if (node.childElementCount === 0) {
        if(setOn) {
            listenerTypes.forEach(function(type) {
                node.addEventListener(type, listen);
            })
        } else {
            listenerTypes.forEach(function(type) {
                node.removeEventListener(type, listen)
            })
        }
        
    } else {
        for(let i=0; i<node.childElementCount; i++) {
            toggleHelper(node.children[i], setOn);
        }
    }
}