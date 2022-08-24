import { AppConfig } from "@nsc/environment";
import { Subject } from "rxjs";

const Store = require('electron-store');

class ElectronStore {
    private static _instance: ElectronStore;
    private subject: Subject<any>;
    private static store: typeof Store;

    private constructor() { };

    public static get Instance(): ElectronStore {
        if (!this._instance) {
            this._instance = new ElectronStore();
            let storePath =  AppConfig.production ? `${process.env.PORTABLE_EXECUTABLE_DIR}` :`${process.cwd()}/release`;;
            ElectronStore.store = new Store({
                watch: true,
                cwd: storePath,
                name: 'national_science_challenge_init_data',
                accessPropertiesByDotNotation: true
            });
            console.log(`Current Store File Path : ${storePath}/national_science_challenge_init_data.json`);
        }
        return this._instance;
    }

    public listenDataChange(): Subject<{ newValue: string, oldValue: string, unsubscribe: Function }> {
        if (!this.subject) {
            this.subject = new Subject();
        }
        const unsubscribe = ElectronStore.store.onDidAnyChange((newValue: any, oldValue: any) => {
            let valueObj = {
                newValue,
                oldValue,
                unsubscribe
            }
            this.subject.next(valueObj);
        })
        return this.subject;
    }

    public set(value: any) {
        ElectronStore.store.set(value);
    }

    public setItemWithKey(key: string, value: any): void {
        ElectronStore.store.set(key, value);
    }

    public get(key: string): any {
        return ElectronStore.store.get(key);
    }

    public getWithDefaultValue(key: string, value: any) {
        return ElectronStore.store.get(key, value)
    }
}

export { ElectronStore }