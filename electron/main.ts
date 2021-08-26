import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import * as path from 'path'
import * as url from 'url'
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer'
import { Engine } from 'node-uci'

let mainWindow: Electron.BrowserWindow | null

ipcMain.on('engine-init', (event) => {

  dialog.showOpenDialog({ properties: ['openFile'] }).then(result => {
    console.log(`Engine Initializing: ${result.filePaths[0]}`)
    const e = new Engine(result.filePaths[0])
    e.init().then(eng => {
      console.log(`Engine Initialized, id: ${eng.id.name} author: ${eng.id.author}`)
      console.log(eng.options)
      event.reply('engine-init', eng.id, eng.filePath, eng.options)
    })
  })
  
})

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    minHeight: 700, 
    minWidth: 700, 
    backgroundColor: '#191622',
    webPreferences: {
      nodeIntegration: true
    }
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:4000')
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'renderer/index.html'),
        protocol: 'file:',
        slashes: true
      })
    )
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)
  .whenReady()
  .then(() => {
    if (process.env.NODE_ENV === 'development') {
      installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err))
      installExtension(REDUX_DEVTOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err))
    }
  })
app.allowRendererProcessReuse = true
