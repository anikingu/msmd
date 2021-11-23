import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { ipcRenderer } from 'electron';
import './index.css';

import BrowserControls from './components/browser-controls/browser-controls';
import Sidebar from './components/recording-controls/sidebar';
import ListenerWebview from '../webview/listener-webview';
import Modal from './components/modals/modal';

window.onload = () => {
    document.getElementById('download-button').addEventListener('click', () => {
        ipcRenderer.send('create-file')
    });
}

function Console() {
    const urlSpan = React.createRef();
    const startUrl = React.createRef();
    const recordingButton = React.createRef();
    const modal = document.getElementById('modal');

    const [webview, setWebview] = React.useState();

    React.useEffect(() => {
        setTimeout(() => {
            console.log("Genarating webview");
            const webviewProps = {

            };
            setWebview(ListenerWebview());
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
            showModal();
        }
    }

    const showModal = () => {
        modal.style.display = 'block';
    }

    const hideModal = () => {
        modal.style.removeProperty('display');
    }

    return (
        <div id="console">
            <Modal hideModal={hideModal}/>
            <BrowserControls urlSpan={urlSpan} startUrl={startUrl} handleUrlSubmit={handleUrlSubmit} />
            <div id='content'>
                <Sidebar recordingButton={recordingButton} recordingButton={recordingButton} toggleRecording={toggleRecording}/>
                <div id="auxiliary-window" ></div>
            </div>
        </div>
    );
}

ReactDOM.render(
    <React.StrictMode>
        <Console />
    </React.StrictMode>,
    document.getElementById('root')
);