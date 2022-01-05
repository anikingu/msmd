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
    const [DirectiveType, setDirectiveType] = React.useState(DirectiveTypeResolver[currentDirectiveType]);

    React.useEffect(() => {
        setDirectiveType(DirectiveTypeResolver[currentDirectiveType]);
    }, [currentDirectiveType])

    const handleCancel = () => {
        hideModal();
    }

    const handleCreateDirective = () => {
        console.log("Creating Directive");
    }

    const clearFields = () => {
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
            <button type='button' id='cancel-button' onClick={handleCancel}>Cancel</button>
            <button type='button' id='create-button' onClick={handleCreateDirective}>Create</button>
            <label htmlFor='create-another-checkbox'>Create Another?</label><input type='checkbox' id='create-another-checkbox' />
        </div>
    )
}

const DirectiveTypeResolver = {
    "VERIFY": <VerifyType />,
    "WAIT": <WaitType />,
    "CUSTOM": <CustomType />
}

export default DirectiveModal;