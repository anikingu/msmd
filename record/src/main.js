const { app, BrowserView, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { ScriptBuilder, StepType } = require('./script-builder');
// require('./security-config');

/* Used for hot reloading app during development*/
try {
    require('electron-reloader')(module);
} catch {}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 2000, 
        height: 825,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });
    win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    // win.loadFile('./console/console.html')
    win.openDevTools();
    const view = new BrowserWindow({
        x: 450,
        y: 90,
        width: 1500,
        height: 700,
        parent: win,
        kiosk: true,
        fullscreen: false,
        fullscreenable: false,
        autoHideMenuBar: true,
        hasShadow: false,
        webPreferences: {
            preload: path.join(__dirname, 'renderer/event-register.js')
        }
    });
    win.setBrowserView(view);
    view.webContents.loadURL('https://www.wikipedia.org');
    // view.webContents.openDevTools();
    
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});


let builder = ScriptBuilder('https://wikipedia.org');

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

ipcMain.on('create-file', (event, eventDto) => {
    builder.save();
});