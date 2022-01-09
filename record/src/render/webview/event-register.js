const path  = require("path");
const { ipcRenderer } = require('electron');

console.log("Running preload")
window.onload = () => {

    const NewTabPath = "file://" + path.resolve("./src/render/webview/new-tab.html");
    if(document.location.href != NewTabPath) {
        ipcRenderer.send('update-url', document.location.href);
    }

    const deriveXpath = (path) => {
        let fullXpathArray = [];
        let xpathArray = [];
        for (let i = 0, htmlFound = idFound = false; i < path.length && !htmlFound; i++) {
            const node = path[i];
            fullXpathArray.push(node.localName);
            if(!idFound) {
                if(node.id) {
                    xpathArray.push(`/*[@id="${node.id}"]`);
                    idFound = true;
                } else {
                    xpathArray.push(node.localName);
                }    
            }
            htmlFound = node.localName === 'html';
        }
        return {
            full_xpath: '/' + fullXpathArray.reverse().join('/'),
            relative_xpath: '/' + xpathArray.reverse().join('/')
        };
    }

    const eventToDto = (event) => {
        let attrMap = {};
        Object.values(event.target.attributes).map((value) => {
            attrMap[value.name] = value.nodeValue;
        });
        event.target.innerText && (attrMap['innerText'] = event.target.innerText);
        const eventDto = {
            ...deriveXpath(event.path),
            attributes: attrMap,
            value: event.target.value
        };
        console.log(eventDto);
        return eventDto;
    }

    document.addEventListener('click', (event) => {
        console.log("Register click");
        console.log(event);
        ipcRenderer.send('click-message', eventToDto(event));
    }, true);
    ['input[type="text"]', 'input[type="search"]', "textbox"].forEach((selector) =>  {
        document.querySelectorAll(selector).forEach((input) => {
            input.addEventListener('change', (event) => {
                console.log("Register input change");
                console.log(event);
                ipcRenderer.send('input-changed-message', eventToDto(event));
            });
        });
    });
};