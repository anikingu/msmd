const { app, BrowserView, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { ScriptBuilder } = require('./script-builder');
const { StepType } = require('util/step-type');
const { InteractionAction } = require('../util/step-type');
// require('./security-config');

/* Used for hot reloading app during development*/
try {
    require('electron-reloader')(module);
} catch { }

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

const MainProcess = function () {
    let mainWindow;
    let auxiliaryWindow;
    let builder;

    const init = () => {
        createMainWindow();
    }

    const createMainWindow = () => {
        mainWindow = new BrowserWindow({
            width: 2000,
            height: 825,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true,
                webviewTag: true
            }
        });
        mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
        mainWindow.openDevTools();
    }

    const createBuilder = (url) => {
        builder = ScriptBuilder(url, mainWindow);
        console.log(`New script builder created. StartUrl: ${url}`);
    }

    const destroyBuilder = () => {
        builder = null;
        console.log("Script builder destroyed");
    }

    ipcMain.on('start-recording-message', (event, startUrl) => {
        console.log("Start recording");
        // Create new builder
        createBuilder(startUrl);
        // Turn on event listeners
        ipcMain.on('click-message', (event, eventDto) => {
            console.log('Received message');
            console.log(eventDto);
            builder.addStep(StepType.INTERACTION(eventDto, InteractionAction.CLICK));
        });

        ipcMain.on('input-changed-message', (event, eventDto) => {
            console.log('Input Received');
            console.log(eventDto);
            builder.addStep(StepType.INTERACTION(eventDto, InteractionAction.CHANGE));
        });
        ipcMain.on('directive-message', (event, eventDto) => {
            console.log('Directive Received');
            console.log(eventDto);
            builder.addStep(undefined, StepType.DIRECTIVE(eventDto));
        })
    });

    ipcMain.on('stop-recording-message', (event, eventDto) => {
        // Prompt save
        console.log("Recording stopped");
        // Turn off event listeners
        ipcMain.removeAllListeners('click-message');
        ipcMain.removeAllListeners('input-changed-message');
        ipcMain.removeAllListeners('directive-message');
    });

    ipcMain.on('destroy-script-builder', (event, eventDto) => {
        destroyBuilder();
    });

    ipcMain.on('reset-listener-window', (event, url) => {
        console.log('Received reset-listener-window');
        auxiliaryWindow.destroy();
        createAuxiliaryWindow(url);
    });

    ipcMain.on('create-file', (event, eventDto) => {
        builder.save(eventDto);
    });

    return {
        init: init,
        createMainWindow: createMainWindow,
    }
}();

app.whenReady().then(() => {
    MainProcess.init();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            MainProcess.createMainWindow();
        }
    });
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});


