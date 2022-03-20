const { app, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");

let mainWindow = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 640,
    webPreferences: {
      nodeIntegration: true,
      devTools: isDev
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
