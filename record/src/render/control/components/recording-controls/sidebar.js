import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { ipcRenderer } from 'electron';
import AddDirectiveIcon from 'assets/plus-circle-solid.svg';
import CustomDirectiveIcon from 'assets/laptop-code-solid.svg';
import DefaultStepIcon from 'assets/user-check-solid.svg';
import KeyboardIcon from 'assets/keyboard-solid.svg';
import MouseIcon from 'assets/mouse-solid.svg';
import RecordIcon from 'assets/record.svg';
import SidebarToggle from 'assets/angle-double-right-solid.svg';
import VerifyApiIcon from 'assets/server-solid.svg';
import VerifyDatabaseIcon from 'assets/database-solid.svg';
import VerifyDomIcon from 'assets/file-code-regular.svg';
import VerifyDownloadIcon from 'assets/file-download-solid.svg';
import VerifyNavigateIcon from 'assets/sitemap-solid.svg';
import VerifyNetworkIcon from 'assets/network-wired-solid.svg';
import WaitIcon from 'assets/stopwatch-solid.svg';
import './sidebar.css';
const { InteractionAction } = require('util/step-type');

function Step({step, index, expanded}) {

    const resolveIcon = (step) => {
        let interactionIcon
        if(step.interaction) {
            switch(step.interaction.action) {
                case InteractionAction.CLICK:
                    interactionIcon = MouseIcon;
                    break;
                case InteractionAction.CHANGE:
                    interactionIcon = KeyboardIcon;
            }
        }
        let directiveIcon;
        if(step.directive) {
            const compoundType = `${step.directive.type}${step.directive.subtype ? '-'+step.directive.subtype : ''}`;
            console.log(compoundType);
            switch (compoundType) {
                case "VERIFY-NAVIGATION":
                    directiveIcon = VerifyNavigateIcon;
                    break;
                case "VERIFY-REQUEST":
                case "VERIFY-RESPONSE":
                    directiveIcon = VerifyNetworkIcon;
                    break;
                case "VERIFY-API":
                    directiveIcon = VerifyApiIcon;
                    break;
                case "VERIFY-DATABASE":
                    directiveIcon = VerifyDatabaseIcon;
                    break;
                case "VERIFY-DOM":
                    directiveIcon = VerifyDomIcon;
                    break;
                case "VERIFY-DOWNLOAD":
                    directiveIcon = VerifyDownloadIcon;
                    break;
                case "WAIT-WAIT UNTIL":
                case "WAIT-WAIT INTERVAL":
                    directiveIcon = WaitIcon;
                    break;
                case "CUSTOM":
                    directiveIcon = CustomDirectiveIcon;
                    break;
            }
        }
        return interactionIcon ?? directiveIcon ?? DefaultStepIcon;
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

function Sidebar({recordingButton, toggleRecording, toggleAddDirective}) {
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
                    <div id="recording-button-wrapper" className={expanded ? "recording-button-expanded" : "recording-button-retracted"}>
                        <RecordIcon id="recording-button" ref={recordingButton} onClick={toggleRecording}/>
                    </div>
                    <div id="directive-button-wrapper" className={expanded ? "directive-button-expanded" : "directive-button-retracted"}>
                        <div>
                            <AddDirectiveIcon id="directive-buttton" onClick={toggleAddDirective} />
                        </div>
                    </div>
                </div>
                <h2 id="sidebar-steps-label" className={expanded ? "sidebar-steps-label-visible" : "sidebar-steps-label-hidden"}>Recording Steps</h2>
            </div>
            <hr/>
            <div id="sidebar-steps">
                <div>
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