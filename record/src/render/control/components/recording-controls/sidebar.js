import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { ipcRenderer } from 'electron';
import MouseIcon from 'assets/mouse-solid.svg';
import KeyboardIcon from 'assets/keyboard-solid.svg';
import VerifyApiIcon from 'assets/server-solid.svg';
import VerifyNavigateIcon from 'assets/sitemap-solid.svg';
import VerifyGeneralIcon from 'assets/user-check-solid.svg';
import SidebarToggle from 'assets/angle-double-right-solid.svg';
import RecordIcon from 'assets/record.svg';
import './sidebar.css';
const { StepType, StepAction } = require('util/step-type');

function Step({step, index, expanded}) {

    const resolveIcon = (step) => {
        const stepTypeAction = `${step.type}-${step.action}`;
        switch(stepTypeAction) {
            case `${StepType.INTERACT}-${StepAction.CLICK}`:
                return MouseIcon;
            case `${StepType.INTERACT}-${StepAction.CHANGE}`:
                return KeyboardIcon;                
        }
        switch(step.type) {
            case StepType.VERIFY:
                return VerifyGeneralIcon;
        }
        return MouseIcon;
    }

    const Icon = resolveIcon(step)
    return (
        <div className="step">
            <div className="step-number">{index+1}</div>
            <Icon className="step-icon" width="30" height="30"/>
            <div className={`step-description ${expanded ? "step-description-visible" : "step-description-hidden"}`}>{step.description}</div>
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
            const scrollbarSteps = document.getElementById('sidebar-steps');
            scrollbarSteps.scrollTo(0, scrollbarSteps.scrollHeight);
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
            <div id="sidebar-steps">
                <div>
                    {/* <Step step={{description: "Test description for the thing"}} index={0} expanded={expanded} /> */}
                    {steps.map((step, i) => (
                        <Step step={step} index={i} expanded={expanded} key={i} />
                    ))}
                </div>
            </div>
            <hr/>
            <span id="sidebar-toggle" className={expanded ? "sidebar-toggle-expanded" : "sidebar-toggle-retracted"} onClick={handleRetract}><SidebarToggle width="30" height="30" /></span>
        </div>
    );
}

export default Sidebar;