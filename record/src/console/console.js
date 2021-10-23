import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { ipcRenderer } from 'electron';
import './console.css';

import ControlPanel from './components/control-panel/control-panel';
import ListenerWindow from '../renderer/listener-window';

window.onload = () => {
    document.getElementById('download-button').addEventListener('click', () => {
        ipcRenderer.send('create-file')
    });
}

function Console() {
    const startUrl = React.createRef();
    const [webview, setWebview] = React.useState();

    React.useEffect(() => {
        setTimeout(() => {
            console.log("Genarating webview");
            const webviewProps = {

            };
            setWebview(ListenerWindow());
        }, 1000);
    },[]);

    const handleUrlSubmit = () => {
        const url = startUrl.current;
        console.log(url.value);
        if(url.value && url.checkValidity()) {
            // ipcRenderer.send('reset-listener-window', url.value);
            console.log(webview);
            webview.navigateToUrl(url.value);
        } else {
            console.error(`${url.value} is invalid`);
        }
    }

    return (
        <div id="console">
            <ControlPanel startUrl={startUrl} handleUrlSubmit={handleUrlSubmit} />
            <div id="auxiliary-window" ></div>
        </div>
    );
}

ReactDOM.render(
    <React.StrictMode>
        <Console />
    </React.StrictMode>,
    document.getElementById('root')
);