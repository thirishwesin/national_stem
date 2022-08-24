import { BrowserWindow } from "electron";

class WindowScreenStore {
    private openedScreens: BrowserWindow[] = [];
    private static _instance: WindowScreenStore;

    private constructor() { }

    public static get Instance() {
        if (this._instance == null || this._instance == undefined) {
            this._instance = new WindowScreenStore();
        }
        return this._instance;
    }

    addNewScreen(newScreen: BrowserWindow): void {
        this.openedScreens.push(newScreen);
        console.log("open windows", this.openedScreens);
    }

    getOpenedScreenList(): BrowserWindow[] {
        return this.openedScreens;
    }

    removeAllScreen() {
        this.openedScreens.slice(0, this.openedScreens.length);
    }
}

export { WindowScreenStore }
