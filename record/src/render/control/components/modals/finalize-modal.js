import * as React from 'react';
import { ipcRenderer } from 'electron';
import './modal.css'

function FinalizeModal({hideModal}) {
    let scriptTitle;
    let scriptDescription;
    let advancedSettingsCaret;
    let advancedSettingsContent;

    React.useEffect(() => {
        scriptTitle = document.getElementById('script-title');
        scriptDescription = document.getElementById('script-description');
        advancedSettingsCaret = document.getElementById('advanced-settings-caret');
        advancedSettingsContent = document.getElementById('advanced-settings-content')
    });

    const [showAdvanced, setShowAdvanced] = React.useState(false);

    const toggleAdvanced = () => {
        console.log('toggled');
        if (!showAdvanced) {
            advancedSettingsCaret.className = 'caret-expanded';
            advancedSettingsContent.className = 'modal-collapsible-expanded';
            setShowAdvanced(true);
        } else {
            advancedSettingsCaret.className = 'caret';
            advancedSettingsContent.className = 'modal-collapsible';
            setShowAdvanced(false);
        }
    }

    const handleDiscard = () => {
        ipcRenderer.send('destroy-script-builder');
        clearFields();
        hideModal();
    }

    const handleSave = () => {
        const scriptDto = {
            title: scriptTitle.value,
            description: scriptDescription.value
        }
        ipcRenderer.send('create-file', scriptDto);
        ipcRenderer.send('destroy-script-builder');
        clearFields();
        hideModal();
    }

    const clearFields = () => {
        scriptTitle.value = '';
        scriptDescription.value = '';
    }

    return (
        <div className='modal-content'>
            <strong className='modal-title'>Recording Complete!</strong>

            <div className='modal-field'>
                <label htmlFor='script-title'>Title</label>
                <input type='text' id='script-title' placeholder='placeholder' />
            </div>

            <div className='modal-field'>
            <label htmlFor='script-description'>Description</label>
            <textarea id='script-description' placeholder='Something interesting about the test'></textarea>
            </div>

            <span onClick={toggleAdvanced}>Advanced <span id='advanced-settings-caret' className='caret' /></span>
            <div id='advanced-settings-content' className='modal-collapsible'>
                Some config here
            </div>

            <div className='modal-buttons'>
                <button type='button' id='discard-button' onClick={handleDiscard}>Discard</button>
                <button type='button' id='save-button' onClick={handleSave}>Save</button>
            </div>
        </div>
    )
}

export default FinalizeModal;