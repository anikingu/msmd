import * as React from 'react';
import { ipcRenderer } from 'electron';
import './modal.css';
import './directive-modal.css';

import VerifyType from './directive-types/verify-type';
import WaitType from './directive-types/wait-type';
import CustomType from './directive-types/custom-type';


function DirectiveModal({hideModal}) {

    const [DirectiveType, setDirectiveType] = React.useState(DirectiveTypes.VERIFY);

    const handleCancel = () => {
        hideModal();
    }

    const handleCreateDirective = () => {
        console.log("Creating Directive");
    }

    const handleClickDirectiveType = (directiveType) => {
        setDirectiveType(directiveType);
    }

    const clearFields = () => {
    }

    return (
        <div className='modal-content'>
            <strong className='modal-title'>Add New Directive</strong>
            <div id='directive-form'>
                <div id='directive-type-section'>
                    <ol>
                        <li onClick={() => handleClickDirectiveType(DirectiveTypes.VERIFY)}>VERIFY</li>
                        <li onClick={() => handleClickDirectiveType(DirectiveTypes.WAIT)}>WAIT</li>
                        <li onClick={() => handleClickDirectiveType(DirectiveTypes.CUSTOM)}>CUSTOM</li>
                    </ol>
                </div>
                {DirectiveType ?? ""}
            </div>
            <button type='button' id='cancel-button' onClick={handleCancel}>Cancel</button>
            <button type='button' id='create-button' onClick={handleCreateDirective}>Create</button>
            <label htmlFor='create-another-checkbox'>Create Another?</label><input type='checkbox' id='create-another-checkbox' />
        </div>
    )
}


const DirectiveTypes = {
    VERIFY: <VerifyType />,
    WAIT: <WaitType />,
    CUSTOM: <CustomType />
}

export default DirectiveModal;