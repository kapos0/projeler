import { app, shell, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import { deleteNote, getNotes, writeNote } from "@/lib";
import { DeleteNote, GetNotes, WriteNote } from "@/shared/types";

function createWindow(): void {
    const mainWindow = new BrowserWindow({
        width: 900,
        height: 670,
        show: false,
        center: true,
        autoHideMenuBar: true,
        title: "MD Notes",
        webPreferences: {
            preload: join(__dirname, "../preload/index.js"),
            sandbox: true,
            contextIsolation: true,
        },
    });

    mainWindow.on("ready-to-show", () => {
        mainWindow.show();
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: "deny" };
    });

    if (is.dev && process.env["ELECTRON_RENDERER_URL"])
        mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    else mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
}

app.whenReady().then(() => {
    electronApp.setAppUserModelId("com.electron");

    app.on("browser-window-created", (_, window) => {
        optimizer.watchWindowShortcuts(window);
    });

    ipcMain.handle("getNotes", (_, ...args: Parameters<GetNotes>) =>
        getNotes(...args)
    );
    ipcMain.handle("writeNote", (_, ...args: Parameters<WriteNote>) =>
        writeNote(...args)
    );
    ipcMain.handle("deleteNote", (_, ...args: Parameters<DeleteNote>) =>
        deleteNote(...args)
    );

    createWindow();

    app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
