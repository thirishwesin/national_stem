import { Injectable } from '@angular/core';
import { AppConfig } from '@nsc/environment';
import { existsSync } from 'fs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  constructor() { }

  getAudio(name: string): HTMLAudioElement {
    const filePath = this.getFilePath();
    const fullPath = `${filePath}/${name}`;

    return existsSync(fullPath) ?
      new Audio(fullPath) :
      new Audio(`${filePath}/ClockTicking.mp3`);
  }

  private getFilePath(): string {
    return AppConfig.production ?
      `${process.env.PORTABLE_EXECUTABLE_DIR}/data/audios` :
      `${process.cwd()}/release/data/audios`;
  }
}
