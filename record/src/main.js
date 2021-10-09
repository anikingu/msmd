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
    let monitoredWindow;
    let builder;

    const init = () => {
        createMainWindow();
        createMonitoredWindow('https://wikipedia.org');
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
        // win.loadFile('./console/console.html')
        mainWindow.openDevTools();
    }
    const createMonitoredWindow = (url) => {
        monitoredWindow = new BrowserWindow({
            x: 450,
            y: 90,
            width: 1500,
            height: 700,
            parent: mainWindow,
            kiosk: true,
            fullscreen: false,
            fullscreenable: false,
            // frame: false,
            autoHideMenuBar: true,
            hasShadow: false,
            webPreferences: {
                preload: path.join(__dirname, 'renderer/event-register.js')
            }
        });
        monitoredWindow.webContents.loadURL(url);
        // view.webContents.openDevTools();

    };

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
        monitoredWindow.destroy();
        createMonitoredWindow(url);
    });

    ipcMain.on('create-file', (event, eventDto) => {
        builder.save();
    });

    return {
        init: init,
        createMainWindow: createMainWindow,
        createMonitoredWindow: createMonitoredWindow
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


