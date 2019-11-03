window.onload = function() {
    let listenerTypes = new Set();
    listenerTypes.add("click");
    listenerTypes.add("change");
    // listenerTypes.add("keyup");
    function func(node) {
        if (node.childElementCount === 0) {
            listenerTypes.forEach(function(type) {
                node.addEventListener(type, function(event) {
                    console.log(type + " event triggerred");
                    console.log(event.path);
                    console.log(event);
                })
            })
        } else {
            for(let i=0; i<node.childElementCount; i++) {
                func(node.children[i]);
            }
        }
    }
    func(document);
    console.log("Loaded testPage.js");
}