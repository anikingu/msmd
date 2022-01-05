import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { ipcRenderer } from 'electron';
import './index.css';

import BrowserControls from './components/browser-controls/browser-controls';
import Sidebar from './components/recording-controls/sidebar';
import ListenerWebview from '../webview/listener-webview';
import { Modal, ModalType } from './components/modals/modal';

window.onload = () => {
    /* Removing this onload function causes the event-register to attach to the main window in addition to the webview
     * We do not want this behavior, so until we can come up with a good way to prevent it, LEAVE THIS BLOCK HERE */
};

function Console() {
    const urlSpan = React.createRef();
    const startUrl = React.createRef();
    const recordingButton = document.getElementById('recording-button');
    const modal = document.getElementById('modal');
    
    const [recording, setRecording] = React.useState(false);
    const [webview, setWebview] = React.useState();
    const [modalType, setModalType] = React.useState();

    // RecordIcon Animations
    const outerCirclePulseX = document.getElementById('record_svg__outer-circle-pulse-x');
    const outerCirclePulseY = document.getElementById('record_svg__outer-circle-pulse-y');
    const outerCirclePulse = document.getElementById('record_svg__outer-circle-pulse');
    const morphToStopShape = document.getElementById('record_svg__morph-to-stop-shape');
    const morphToStopFill = document.getElementById('record_svg__morph-to-stop-fill');
    const morphToStopRotate = document.getElementById('record_svg__morph-to-stop-rotate');
    const morphToRecShape = document.getElementById('record_svg__morph-to-rec-shape');
    const morphToRecFill = document.getElementById('record_svg__morph-to-rec-fill');
    const morphToRecRotate = document.getElementById('record_svg__morph-to-rec-rotate');


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
        console.log("Toggle recording");
        if(!recording) {
            setRecording(true);
            outerCirclePulse.beginElement();
            outerCirclePulseX.beginElement();
            outerCirclePulseY.beginElement();
            morphToStopShape.beginElement();
            morphToStopFill.beginElement();
            morphToStopRotate.beginElement();
            recordingButton.setAttribute("checked", "");
            urlSpan.current.childNodes.forEach((child) => {
                child.setAttribute("disabled", '');
            });
            ipcRenderer.send('start-recording-message', webview.getUrl());
        } else {
            setRecording(false);
            outerCirclePulse.beginElement();
            outerCirclePulseX.beginElement();
            outerCirclePulseY.beginElement();
            morphToRecShape.beginElement();
            morphToRecFill.beginElement();
            morphToRecRotate.beginElement();
            recordingButton.removeAttribute("checked");
            urlSpan.current.childNodes.forEach((child) => {
                child.removeAttribute("disabled");
            })
            ipcRenderer.send('stop-recording-message');
            showModal(ModalType.FINALIZE);
        }
    }

    const toggleAddDirective = () => {
        console.log("Adding directive");
        showModal(ModalType.DIRECTIVE);
    }

    const showModal = (type) => {
        setModalType(type);
        modal.style.display = 'block';
    }

    const hideModal = () => {
        setModalType(null);
        modal.style.removeProperty('display');
    }

    return (
        <div id="console">
            <Modal modalType={modalType} hideModal={hideModal}/>
            <BrowserControls urlSpan={urlSpan} startUrl={startUrl} handleUrlSubmit={handleUrlSubmit} />
            <div id='content'>
                <Sidebar recordingButton={recordingButton} recordingButton={recordingButton} recording={recording} toggleRecording={toggleRecording} toggleAddDirective={toggleAddDirective}/>
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