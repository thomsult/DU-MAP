const electron = require('electron')
const isDev = require('electron-is').dev();
// server = require("./localhost")
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

const Menu = electron.Menu
const template = [
  {
     label: 'Edit',
     submenu: [
        {
           role: 'undo'
        },
        {
           role: 'redo'
        },
        {
           type: 'separator'
        },
        {
           role: 'cut'
        },
        {
           role: 'copy'
        },
        {
           role: 'paste'
        }
     ]
  },
  
  {
     label: 'View',
     submenu: [
        {
           role: 'reload'
        },
        {
           role: 'toggledevtools'
        },
        {
           type: 'separator'
        },
        {
           role: 'resetzoom'
        },
        {
           role: 'zoomin'
        },
        {
           role: 'zoomout'
        },
        {
           type: 'separator'
        },
        {
           role: 'togglefullscreen'
        }
     ]
  },
  
  {
     role: 'window',
     submenu: [
        {
           role: 'minimize'
        },
        {
           role: 'close'
        }
     ]
  },
  
  {
     role: 'help',
     submenu: [
        {
           label: 'Learn More',
           click : async () => {

            console.log('clear')
           }
        }
     ]
  }
]

let mainWindow

function createWindow () {
  // Create the browser window.
  let {width, height} = require('electron').screen.getPrimaryDisplay().size;
  mainWindow = new BrowserWindow({
  defaultWidth: width,
  defaultHeight: height,
  maximize: false,
  //autoHideMenuBar: true
  });


  mainWindow.maximize()
  // and load the index.html of the app.
  if (isDev) {
    
    mainWindow.loadURL(`http://localhost:3000/index.html`)
    
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadURL(`file://${__dirname}/index.html`)
  }
  mainWindow.on('close', function (event) {
    
    event.preventDefault();
    mainWindow.webContents.send('closing');
    mainWindow.destroy()
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    
    mainWindow = null
  });
  
  mainWindow.webContents.on('dom-ready', () => {
    if (mainWindow.isMaximized) {
      console.log("electronOnDev,isMaximized")

    }
    mainWindow.webContents.send('loaded');
  });
}

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
