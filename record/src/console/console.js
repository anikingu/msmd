import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { ipcRenderer } from 'electron';

import ControlPanel from './components/control-panel/control-panel';

window.onload = () => {
    document.getElementById('download-button').addEventListener('click', () => {
        ipcRenderer.send('create-file')
    });
}

function Console() {
    return (
        <ControlPanel />
    );
}

ReactDOM.render(
    <React.StrictMode>
        <Console />
    </React.StrictMode>,
    document.getElementById('root')
);