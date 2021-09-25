const { app, BrowserView, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { ScriptBuilder, StepType } = require('./script-builder');
// require('./security-config');

/* Used for hot reloading app */
try {
    require('electron-reloader')(module);
} catch {}



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
    const view = new BrowserView({
        webPreferences: {
            preload: path.join(__dirname, 'renderer/event-register.js')
        }
    });
    win.setBrowserView(view);
    view.setBounds({x: 100, y: 0, width: 1200, height: 825})
    win.loadFile(path.join(__dirname, 'console/console.html'));
    view.webContents.loadURL('https://www.wikipedia.org');
    view.webContents.openDevTools();
    win.openDevTools();
    
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