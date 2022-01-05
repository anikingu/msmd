import * as React from 'react';
import { ipcRenderer } from 'electron';
import './modal.css';

import FinalizeModal from './finalize-modal';
import DirectiveModal from './directive-modal';

function Modal({modalType, hideModal}) {

    let ModalContent = modalType ? ModalTypeResolver[modalType] : null;

    return (
        <div id='modal' className='modal'>
            {ModalContent ? <ModalContent hideModal={hideModal} /> : ""}
        </div>
    )
}

const ModalTypeResolver = {
    "FINALIZE": FinalizeModal,
    "DIRECTIVE": DirectiveModal
};

const ModalType = {
    FINALIZE: "FINALIZE",
    DIRECTIVE: "DIRECTIVE"
}


export {Modal, ModalType};