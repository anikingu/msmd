import * as React from 'react';
import { ipcRenderer } from 'electron';
import './modal.css';
import './directive-modal.css';

import VerifyType from './directive-types/verify-type';
import WaitType from './directive-types/wait-type';
import CustomType from './directive-types/custom-type';
import DirectiveOption from './directive-types/directive-option';


function DirectiveModal({hideModal}) {

    const directiveTypes = ["VERIFY", "WAIT", "CUSTOM"];
    const [currentDirectiveType, setCurrentDirectiveType] = React.useState("VERIFY");
    const [currentSubtype, setCurrentSubtype] = React.useState(null);
    const [subtypeDetails, setSubtypeDetails] = React.useState({});
    const [detailsCallback, setDetailsCallback] = React.useState();
    const [createAnother, setCreateAnother] = React.useState(false);

    const subtypeProps = {
        currentSubtype: currentSubtype,
        setCurrentSubtype: setCurrentSubtype,
        setSubtypeDetails: setSubtypeDetails,
        setDetailsCallback: setDetailsCallback
    }
    const DirectiveTypeResolver = {
        "VERIFY": <VerifyType {...subtypeProps} />,
        "WAIT": <WaitType {...subtypeProps} />,
        "CUSTOM": <CustomType {...subtypeProps} />
    }

    const [DirectiveType, setDirectiveType] = React.useState(DirectiveTypeResolver[currentDirectiveType]);

    React.useEffect(() => {
        setDirectiveType(DirectiveTypeResolver[currentDirectiveType]);
    }, [currentDirectiveType, currentSubtype]);

    const handleCancel = () => {
        hideModal();
    }

    const handleCreateDirective = () => {
        const directiveDto = {
            type: currentDirectiveType,
            subtype: currentSubtype,
            detail: subtypeDetails
        }
        console.log("Creating Directive");
        console.log(directiveDto);
        ipcRenderer.send('directive-message', directiveDto);
        detailsCallback.clearFields();
        setSubtypeDetails({});
        if (!createAnother) {
            hideModal();
        }
    }

    return (
        <div className='modal-content'>
            <strong className='modal-title'>Add New Directive</strong>
            <div id='directive-form'>
                <div id='directive-type-section'>
                    {directiveTypes.map((directiveTypeName, i) => (
                        <DirectiveOption
                            key={i}
                            optionName={directiveTypeName}
                            selectedOption={currentDirectiveType}
                            setSelectedOption={setCurrentDirectiveType}
                        />
                    ))}
                </div>
                {DirectiveType ?? ""}
            </div>
            <div className='modal-buttons'>
                <button type='button' id='cancel-button' onClick={handleCancel}>Cancel</button>
                <button type='button' id='create-button' onClick={handleCreateDirective}>Create</button>
                <label htmlFor='create-another-checkbox'>Create Another?</label>
                <input type='checkbox' id='create-another-checkbox' onClick={() => setCreateAnother(!createAnother)} defaultChecked={createAnother}/>
            </div>
        </div>
    )
}

export default DirectiveModal;