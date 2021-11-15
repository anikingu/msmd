import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { ipcRenderer } from 'electron';
import './console.css';

import ControlPanel from './components/control-panel/control-panel';
import ListenerWindow from '../renderer/listener-window';
import Modal from './components/modal/modal';

window.onload = () => {
    document.getElementById('download-button').addEventListener('click', () => {
        ipcRenderer.send('create-file')
    });
}

function Console() {
    const urlSpan = React.createRef();
    const startUrl = React.createRef();
    const recordingButton = React.createRef();

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
        if(url.value && url.checkValidity()) {
            // ipcRenderer.send('reset-listener-window', url.value);
            console.log(`Navigating to ${url.value}`);
            webview.navigateToUrl(url.value);
        } else {
            console.error(`${url.value} is invalid`);
        }
    }

    const toggleRecording = () => {
        if(recordingButton.current.checked) {
            urlSpan.current.childNodes.forEach((child) => {
                child.setAttribute("disabled", '')
            });
            ipcRenderer.send('start-recording-message', webview.getUrl());
        } else {
            urlSpan.current.childNodes.forEach((child) => {
                child.removeAttribute("disabled");
            })
            ipcRenderer.send('stop-recording-message');
        }
    }

    return (
        <div id="console">
            <Modal />
            <ControlPanel urlSpan={urlSpan} startUrl={startUrl} handleUrlSubmit={handleUrlSubmit} recordingButton={recordingButton} recordingButton={recordingButton} toggleRecording={toggleRecording}/>
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