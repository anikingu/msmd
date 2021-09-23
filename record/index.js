const { app, BrowserView, BrowserWindow, ipcMain } = require('electron');
const { join } = require('path');
const path = require('path');
const fs = require('fs');
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

let script = {
    title: "testScript",
    description: "",
    starting_url: "https://wikipedia.org",
    steps: [],
    uuid: "abc123"
};
const buildStep = (eventDto, action, input) => {
    return {
        type: "INTERACT",
        target: eventDto,
        action: action,
        input: input
    }
};
const addStepToScript = (eventDto, action) => {
    const step = buildStep(eventDto, action, eventDto.value);
    script.steps.push(step);
};
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.on('click-message', (event, eventDto) => {
    console.log('Received message');
    console.log(event);
    console.log(eventDto);
    addStepToScript(eventDto, "click");
});

ipcMain.on('input-changed-message', (event, eventDto) => {
    console.log('Input Received');
    console.log(event);
    console.log(eventDto);
    addStepToScript(eventDto, "change");
});

ipcMain.on('create-file', (event, eventDto) => {
    console.log('Building file');
    const filePath = path.join(__dirname, '../data/testScript.json')
    console.log(filePath);
    fs.writeFile(filePath, JSON.stringify(script), (err) => {
        if (err) throw err;
        console.log(`${filePath} saved successfully!`)
    });
});