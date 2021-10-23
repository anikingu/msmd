import path from "path";
import "./event-register"


const ListenerWindow = (
    preload = "file:///" + path.resolve("./src/renderer/event-register.js"),
    url = "file:///" + path.resolve("./src/renderer/new-window.html"),
    inspect = true,
    parentContainerId = "auxiliary-window"
) => {
    console.log("Generating webview");
    const container = document.getElementById(parentContainerId);
    const webview = document.createElement("webview");
    // webview.setAttribute("partition", "persist:view");
    webview.setAttribute("src", url);
    // webview.disablewebsecurity = true;
    // webview.setAttribute("partition", "persist:webviewsession");
    // creating a preload path for dev and non dev enviroment
    webview.setAttribute("preload", preload);

    //Styling that element
    webview.style.borderStyle = "ridge"
    webview.style.borderWidth = "5px";
    webview.style.width = "100% - 10px";
    webview.style.height = "99%";

    console.log("Attaching webview");
    container.appendChild(webview);
    if (inspect) {
        // connecting element to the doms take time therefore a slight delay
        setTimeout(() => {
            webview.openDevTools();
        }, 10);
    }
    console.log("Webview attached");

    const getUrl = () => webview.getURL();

    const ref = () => document.querySelector(`${parentContainerId.includes('#') ? parentContainerId : '#' + parentContainerId} webview`);

    const navigateToUrl = (url) => webview.loadURL(url);

    const refresh = () => webview.reload();

    const back = () => webview.canGoBack && webview.goBack();

    const stop = () => webview.stop();

    const forward = () => webview.canGoForward() && webview.goForward();

    // Return functions for use
    return {
        getUrl: getUrl,
        navigateToUrl: navigateToUrl,
        refresh: refresh,
        back: back,
        stop: stop,
        forward: forward
    }
}

export default ListenerWindow;