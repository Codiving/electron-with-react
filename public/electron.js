const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");

let mainWindow = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 640,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: isDev,
      preload: path.join(__dirname, "preload.js")
    }
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }

  // mainWindow.setResizable(false);
  mainWindow.setResizable(true);
  mainWindow.on("closed", () => (mainWindow = null));
  mainWindow.focus();
};

ipcMain.on("app_version", event => {
  event.reply("app_version", { version: app.getVersion() });
});

ipcMain.on("files", async event => {
  const result = await dialog
    .showOpenDialog(null, {
      filters: [
        {
          name: "Images",
          extensions: ["jpg", "png"]
        }
      ],
      properties: ["openFile", "multiSelections"]
    })
    .then(result => {
      const { canceled, filePaths } = result;

      if (canceled) return [];
      return filePaths;
    })
    .catch(err => {
      console.log(err);
      return [];
    });

  event.reply("files", { files: result });
});

// electron이 초기화 끝났을 때
app.on("ready", () => {
  createWindow();
});

// 모든 window가 종료되었을 때
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// app이 활성화 되었을 때
app.on("activate", () => {
  if (!mainWindow) {
    createWindow();
  }
});
