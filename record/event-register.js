const { ipcRenderer } = require('electron');
console.log("Running preload")
window.onload = () => {
    document.addEventListener('click', (event) => {
        console.log("Register click");
        console.log(event);
        let attrMap = {};
        Object.values(event.target.attributes).map((value) => {
            attrMap[value.name] = value.nodeValue;
        });
        console.log(attrMap);
        const obj = {
            "outerHTML": event.target.outerHTML,
            "className": event.target.className,
            "three": 3,
            "attributes": {...attrMap}
        };
        ipcRenderer.send('click-message', obj);
    });
    ['input[type="text"]', 'input[type="search"]', "textbox"].forEach((selector) =>  {
        document.querySelectorAll(selector).forEach((input) => {
            input.addEventListener('change', (event) => {
                console.log("Register keydown");
                console.log(event);
                ipcRenderer.send('input-changed-message', event.target.value);
            });
        });
    });
};