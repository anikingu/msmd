import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { ipcRenderer } from 'electron';

window.onload = () => {
    document.getElementById('download-button').addEventListener('click', () => {
        ipcRenderer.send('create-file')
    });
}

function Console() {
    return (
        <div>Hello again world</div>
    );
}

ReactDOM.render(
    <React.StrictMode>
        <Console />
    </React.StrictMode>,
    document.getElementById('root')
);