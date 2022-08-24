import { Injectable } from "@angular/core";
import { AppConfig } from "@nsc/environment";

@Injectable({
    providedIn: 'root'
})
export class ImagesService {
    constructor() { }

    public static getImage(name: string): string {
        const filePath = this.getFilePath();
        const fullPath = `${filePath}/${name}`;
        return `'${fullPath.replace(/\\/g, "/")}'`;
    }

    private static getFilePath(): string {
        return AppConfig.production ?
            `${process.env.PORTABLE_EXECUTABLE_DIR}/data/images` :
            `${process.cwd()}/src/assets/images`;
    }
}
