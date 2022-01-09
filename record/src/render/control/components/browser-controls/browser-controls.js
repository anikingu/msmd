import * as React from 'react';
import { ipcRenderer } from 'electron';
import ArrowLeftIcon from 'assets/arrow-left-solid.svg'
import ArrowRightIcon from 'assets/arrow-right-solid.svg';
import RefreshIcon from 'assets/redo-alt-solid.svg'
import BrowserSettings from 'assets/bars-solid.svg';
import './browser-controls.css';

function BrowserControls({urlSpan, startUrl, handleUrlSubmit}) {

    React.useEffect(() => {
        ipcRenderer.on('update-url', (event, eventDto) => {
            console.log(`Updating url to ${eventDto}`);
            document.getElementById('browser-url').value = eventDto;
        });
    }, []);

    return (
        <div id='browser-controls'>
            <span id='browser-back-button' className='browser-controls-button'><ArrowLeftIcon width='20' height='20'/></span>
            <span id='browser-forward-button' className='browser-controls-button'><ArrowRightIcon width='20' height='20'/></span>
            <span id='browser-refresh-button' className='browser-controls-button'><RefreshIcon width='20' height='20'/></span>
            <span id="url-span" ref={urlSpan} onKeyPress={(event) => {if(event.key ===  "Enter") handleUrlSubmit()}}><input type="url" id="browser-url" ref={startUrl}/></span>
            <span id='browser-settings-button' className='browser-controls-button'><BrowserSettings width='20' height='20'/></span>
        </div>
    )
}

export default BrowserControls;