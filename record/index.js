const { app, BrowserView, BrowserWindow, ipcMain } = require('electron');
const { join } = require('path');
const path = require('path');
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
            preload: path.join(__dirname, 'event-register.js')
        }
    });
    win.setBrowserView(view);
    view.setBounds({x: 100, y: 0, width: 1200, height: 825})
    win.loadFile('index.html');
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

ipcMain.on('click-message', (event, arg) => {
    console.log('Received message');
    console.log(arg);
});

ipcMain.on('input-changed-message', (event, arg) => {
    console.log('Input Received');
    console.log(arg);
})