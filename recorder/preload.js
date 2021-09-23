const { ipcRenderer } = require('electron');
console.log("Running preload")
window.onload = () => {
    document.addEventListener('click', (event) => {
        console.log(event);
        const eventTarget = event.target.innerText;
        const pathArray = event.path;
        const path = pathArray.join('/');
        console.log(eventTarget);
        console.log(pathArray);
        console.log(path);
        console.log("Hi")
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
        }
        ipcRenderer.send('click-message', obj);
    });
    ['input[type="text"]', 'input[type="search"]', "textbox"].forEach((selector) =>  {
        document.querySelectorAll(selector).forEach((input) => {
            input.addEventListener('change', (event) => {
                console.log("Register keydown");
                console.log(event);
                console.log(event.target.value);
                ipcRenderer.send('input-changed-message', event.target.value);
            });
        });
    })
};