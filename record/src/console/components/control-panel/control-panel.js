import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { ipcRenderer } from 'electron';

function Step({step, index}) {
    return (
        <div className="step">
            Some Step {index}: {step.action}
        </div>
    );
}

function ControlPanel({handleUrlSubmit, startUrl}) {
    const [steps, setSteps] = React.useState([]);
    const recordingButton = React.createRef();
    const urlSpan = React.createRef();

    React.useEffect(() => {
        ipcRenderer.on("steps-updated", (event, args) => {
            const steps = args;
            console.log("Received steps: " + steps.length)
            // console.log(steps);
            setSteps(steps);
        }); 
    }, [])

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
                    <span id="url-span" ref={urlSpan} onKeyPress={(event) => {if(event.key ===  "Enter") handleUrlSubmit()}}><input type="url" id="startUrl" ref={startUrl}/><button id="url-go" onClick={handleUrlSubmit}>Go</button></span>
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