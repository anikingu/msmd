import * as React from 'react';
import './modal.css'

function Modal({script}) {
    const advancedSettingsCaret = document.getElementById('advanced-settings-caret');
    const advancedSettingsContent = document.getElementById('advanced-settings-content')

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

    return (
        <div id='modal' className='modal'>
            <div className='modal-content'>
                <strong className='modal-title'>Recording Complete!</strong>

                <div className='modal-field'>
                    <label htmlFor='script-title'>Title</label>
                    <input type='text' id='script-title' placeholder='placeholder' />
                </div>

                <div className='modal-field'>
                <label htmlFor='script-description'>Description</label>
                <textarea placeholder='Something interesting about the test'></textarea>
                </div>

                <span onClick={toggleAdvanced}>Advanced <span id='advanced-settings-caret' className='caret' /></span>
                <div id='advanced-settings-content' className='modal-collapsible'>
                    Some config here
                </div>

                <div className='modal-buttons'>
                    <button type='button' id='discard-button'>Discard</button>
                    <button type='button' id='save-button'>Save</button>
                </div>
            </div>
        </div>
    )
}

export default Modal;