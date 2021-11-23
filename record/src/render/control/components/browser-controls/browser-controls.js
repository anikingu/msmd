import * as React from 'react';
import arrowLeftIcon from 'assets/arrow-left-solid.svg'
import arrowRightIcon from 'assets/arrow-right-solid.svg';
import refreshIcon from 'assets/redo-alt-solid.svg'
import browserSettings from 'assets/bars-solid.svg';
import './browser-controls.css';

function BrowserControls({urlSpan, startUrl, handleUrlSubmit}) {
    return (
        <div id='browser-controls'>
            <span id='browser-back-button' className='browser-controls-button'><img src={arrowLeftIcon} width='20' height='20'/></span>
            <span id='browser-forward-button' className='browser-controls-button'><img src={arrowRightIcon} width='20' height='20'/></span>
            <span id='browser-refresh-button' className='browser-controls-button'><img src={refreshIcon} width='20' height='20'/></span>
            <span id="url-span" ref={urlSpan} onKeyPress={(event) => {if(event.key ===  "Enter") handleUrlSubmit()}}><input type="url" id="browser-url" ref={startUrl}/></span>
            <span id='browser-settings-button' className='browser-controls-button'><img src={browserSettings} width='20' height='20'/></span>
        </div>
    )
}

export default BrowserControls;