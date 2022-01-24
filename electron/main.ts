// ********************************************************** //
// Includes
// ********************************************************** //
import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import * as path from 'path'
import * as url from 'url'
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer'
import { Engine } from 'node-uci'

let mainWindow: Electron.BrowserWindow | null

let engines: Engine[] = []

// ********************************************************** //
// IPC
// ********************************************************** //
ipcMain.on('engine-init', async (event, index) => {
  const result = await dialog.showOpenDialog({ properties: ['openFile'] })
  console.log(`Engine Initializing: ${result.filePaths[0]}`)
  engines[index] = new Engine(result.filePaths[0])
  const eng = await engines[index].init()
  await engines[index].isready()
  console.log(`Engine Initialized, id: ${eng.id.name} author: ${eng.id.author}`)
  event.reply('engine-init', index, eng.id, eng.filePath, eng.options)
  
})

ipcMain.on('engine-new-pos', async (event, index, fen) => {
  console.log('position updated')
  if (engines.length <= index)
    return
  try{
    await engines[index].position(fen)
    await engines[index].isready()
    const result = await engines[index].go({depth: 4})
    console.log('result', result)
  } catch {
    console.log('Error updating position')
  }
})

// ********************************************************** //
// Initialization
// ********************************************************** //
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    minHeight: 700, 
    minWidth: 700, 
    backgroundColor: '#191622',
    webPreferences: {
      nodeIntegration: true, 
      contextIsolation: false,
      enableBlinkFeatures: "CSSColorSchemeUARendering",
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

  // mainWindow.on('show', () => {
  //   engines.forEach(eng => {
  //     eng.quit()
  //   })
  //   engines = []
  // })

  mainWindow.on('close', () => {
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

