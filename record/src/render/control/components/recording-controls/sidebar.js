import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { ipcRenderer } from 'electron';
import mouseIcon from 'assets/mouse-solid.svg';
import sidebarToggle from 'assets/angle-double-right-solid.svg';
import './sidebar.css';

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

function Sidebar({recordingButton, toggleRecording}) {
    const [steps, setSteps] = React.useState([]);
    const [expanded, setExpanded] = React.useState(false);

    React.useEffect(() => {
        ipcRenderer.on("steps-updated", (event, args) => {
            const steps = args;
            console.log("Received steps: " + steps.length)
            // console.log(steps);
            setSteps(steps);
        }); 
    }, []);

    const handleRetract = () => {
        setExpanded(!expanded);
    }

    return (
        <div id="sidebar" className={expanded ? "sidebar-expanded" : "sidebar-retracted"}>
            <div className="sidebar-controls">
                <div className={expanded ? "sidebar-controls-expanded" : "sidebar-controls-retracted"}>
                    <label htmlFor="checkbox">Record</label>
                    <input type="checkbox" id="recording-button" ref={recordingButton} onClick={toggleRecording}/>
                    <button id="download-button">Download</button>
                </div>
                <h2 id="sidebar-steps-label" className={expanded ? "sidebar-steps-label-visible" : "sidebar-steps-label-hidden"}>Recording Steps</h2>
            </div>
            <hr/>
            <div className="sidebar-steps">
                <div>
                    {steps.map((step, i) => (
                        <Step step={step} index={i} key={i} />
                    ))}
                </div>
            </div>
            <hr/>
            <span id="sidebar-toggle" className={expanded ? "sidebar-toggle-expanded" : "sidebar-toggle-retracted"} onClick={handleRetract}><img src={sidebarToggle} width="30" height="30" /></span>
        </div>
    );
}

export default Sidebar;