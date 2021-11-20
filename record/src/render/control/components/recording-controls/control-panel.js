import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { ipcRenderer } from 'electron';
import mouseIcon from 'assets/mouse-solid.svg';

function Step({step, index}) {

    const resolveIcon = (step) => {
        return mouseIcon;
    }

    return (
        <div className="step">
            <span className="step-number">{index+1}</span>
            <img src={resolveIcon(step)} width={20} height={20}/>
            <span>{step.description}</span>
        </div>
    );
}

function ControlPanel({urlSpan, startUrl, handleUrlSubmit, recordingButton, toggleRecording}) {
    const [steps, setSteps] = React.useState([]);

    React.useEffect(() => {
        ipcRenderer.on("steps-updated", (event, args) => {
            const steps = args;
            console.log("Received steps: " + steps.length)
            // console.log(steps);
            setSteps(steps);
        }); 
    }, []);

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