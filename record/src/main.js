const { app, BrowserView, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { ScriptBuilder, StepType } = require('./script-builder');
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
        createAuxiliaryWindow('https://wikipedia.org');
        createBuilder('https://wikipedia.org');
    }

    const createMainWindow = () => {
        mainWindow = new BrowserWindow({
            width: 2000,
            height: 825,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true
            }
        });
        mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
        mainWindow.openDevTools();

        mainWindow.on('move', (event) => {
            const mwBounds = mainWindow.getBounds();
            auxiliaryWindow.setBounds({
                ...getAuxiliaryWindowBounds(mwBounds)
            });
        });    
    }
    const createAuxiliaryWindow = (url) => {
        const mwBounds = mainWindow.getBounds();
        auxiliaryWindow = new BrowserWindow({
            ...getAuxiliaryWindowBounds(mwBounds),
            parent: mainWindow,
            kiosk: true,
            fullscreen: false,
            fullscreenable: false,
            // frame: false,
            autoHideMenuBar: true,
            hasShadow: false,
            webPreferences: {
                preload: path.join(__dirname, 'renderer/event-register.js'),
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false,
                sandbox: true
            }
        });
        auxiliaryWindow.webContents.loadURL(url);
        auxiliaryWindow.webContents.openDevTools();
    };

    const getAuxiliaryWindowBounds = ({x, y, width, height}) => {
        const mwPercentWidth = 0.8;
        const mwPercentHeight = 0.65;
        const mwWidthOffset = 0;
        const mwHeightOffset = 30;
        return {
            x: x + Math.floor((1-mwPercentWidth) * width),
            y: y + mwHeightOffset,
            width: Math.floor(mwPercentWidth * width),
            height: Math.floor(mwPercentHeight * height)
        }
    }

    const createBuilder = (url) => {
        builder = ScriptBuilder(url, mainWindow);
    }

    ipcMain.on('click-message', (event, eventDto) => {
        console.log('Received message');
        console.log(eventDto);
        builder.addStep(StepType.INTERACT, eventDto, 'click');
    });

    ipcMain.on('input-changed-message', (event, eventDto) => {
        console.log('Input Received');
        console.log(eventDto);
        builder.addStep(StepType.INTERACT, eventDto, "change");
    });

    ipcMain.on('reset-listener-window', (event, url) => {
        console.log('Received reset-listener-window');
        auxiliaryWindow.destroy();
        createAuxiliaryWindow(url);
    });

    ipcMain.on('create-file', (event, eventDto) => {
        builder.save();
    });

    return {
        init: init,
        createMainWindow: createMainWindow,
        createAuxiliaryWindow: createAuxiliaryWindow
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


