import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { ipcRenderer } from 'electron';

function Step({step, index}) {
    return (
        <div className="step">
            Some Step {index}: {step}
        </div>
    );
}

function ControlPanel() {
    const [steps, setSteps] = React.useState(["one","two","three"]);
    const recordingButton = React.createRef();
    const urlSpan = React.createRef();

    const toggleRecording = () => {
        if(recordingButton.current.checked) {
            urlSpan.current.childNodes.forEach((child) => {
                child.setAttribute("disabled", '')
            });
        } else {
            urlSpan.current.childNodes.forEach((child) => {
                child.removeAttribute("disabled");
            })
        }
    }

    return (
        <div id="control-panel">
            <div>
                <h2>Recording Controls</h2>
                <div>
                    <span id="url-span" ref={urlSpan}><input type="url" id="url"/><button id="url-go">Go</button></span>
                    <br/>
                    <label htmlFor="checkbox">Record</label>
                    <input type="checkbox" id="recording-button" ref={recordingButton} onClick={toggleRecording}/>
                    <button id="download-button">Download</button>
                </div>
            </div>
            <div>
                <h2>Recording Steps</h2>
                <div>
                    {steps.map((step, i) => (
                        <Step step={step} index={i} key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ControlPanel;