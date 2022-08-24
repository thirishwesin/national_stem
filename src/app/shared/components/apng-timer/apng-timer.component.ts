import { Component, Input, NgZone, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { readFile, readFileSync } from 'fs';
import parseAPNG from "apng-js";
import {
  find as _find
} from 'lodash';
import { Images } from '@nsc/common';
import { AudioService } from '@nsc/core';
import { AppConfig } from 'environments/environment';

@Component({
  selector: 'app-apng-timer',
  templateUrl: './apng-timer.component.html',
  styleUrls: ['./apng-timer.component.scss']
})
export class ApngTimerComponent implements OnInit, OnChanges {

  @Input('timeOut') timeOut: number;
  @Input('startTimer') startTimer: boolean;
  @Input('isResetAudio') isResetAudio: boolean;
  @Input('classNames') classNames: { wrapper: string[], apng: string[], timerWrapper?: string[], timerLoading?: string [] };

  Images = Images;
  timerInfoArr: Array<{ fileName: string, value: number, apngData: any, audio: string }> = [];
  apngPlayer: any;
  apngLog: Array<any> = [];
  previousTimeOut: number;
  isFinishReadingApngData: boolean;
  audio: HTMLAudioElement;

  constructor(readonly nz: NgZone, private audioService: AudioService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.timeOut = changes['timeOut']?.currentValue;
    this.startTimer = changes['startTimer']?.currentValue;
    this.isResetAudio = changes['isResetAudio']?.currentValue;

    if (this.timeOut) {
      this.previousTimeOut = this.timeOut;
    }

    if (this.timeOut == undefined && this.startTimer == undefined) this.timeOut = this.previousTimeOut;

    if (this.isFinishReadingApngData && this.timeOut) {
      // pause apng and audio, before render selected timer apng image
      if (this.apngPlayer && this.startTimer == undefined) {
        this.apngPlayer.pause();
        this.audio.pause();
      }

      this.renderSpecificTimerAPNGImage(this.timeOut);
      let audioName = _find(this.timerInfoArr, ["value", this.timeOut]).audio;
      this.audio = this.audioService.getAudio(audioName);
    }

    // do play and pause base on changes value
    if (this.apngPlayer && this.startTimer == true) {
      this.apngPlayer.play();
      this.audio.play();
    } else if (this.apngPlayer && this.startTimer == false) {
      this.apngPlayer.pause();
      this.audio.pause();
    }


    if (this.isResetAudio == true && this.isFinishReadingApngData) {
      this.resetAudio();
    }
  }

  ngOnInit(): void {
    this.timerInfoArr = this.getTimerInfoJson();
    let loadingWrapperElement = document.getElementById('loadingWrapper') as HTMLDivElement;

    loadingWrapperElement.classList.add(... this.classNames.wrapper);

    if (this.classNames.timerWrapper) {
      let timerWrapperElement = document.getElementById('timerWrapper') as HTMLDivElement;
      timerWrapperElement.classList.add(... this.classNames.timerWrapper);
    }
    this.readTimerAPNGImages();
  }

  // render timer APNG data in UI
  renderSpecificTimerAPNGImage(timeOut: number): void {
    // find current timer info and apngData
    const currentTimerInfo = this.timerInfoArr.find(timerInfo => timerInfo.value === timeOut);
    const apngData = currentTimerInfo.apngData;

    // created images by apng data
    if (apngData instanceof Error) return;
    apngData.createImages().then(() => {
      // create cancas element and append this to timerApng div element
      const timerAPNGEle = document.getElementById('timerAPNG') as HTMLDivElement;
      const hasCreatedCanvas = !!timerAPNGEle.firstChild;
      const canvasEle = this.createCanvasEle(hasCreatedCanvas, apngData);
      timerAPNGEle.classList.add(...this.classNames.apng);
      timerAPNGEle.appendChild(canvasEle);
      // render APNG frames on given rendering context and plays APNG animation
      apngData.getPlayer(canvasEle.getContext("2d")).then(p => {
        this.apngPlayer = p;
        this.nz.run(() => { }); // render again updated data in timer component html.
        this.apngPlayer.playbackRate = this.previousTimeOut <= 15 ? 2.42 : 2.5;
        const em = this.apngPlayer.emit;
        this.apngPlayer.emit = (event, ...args) => {
          // reset apng image
          if (args.length > 0 && args[0] == 0) {
            this.apngLog.unshift({ event, args });
            this.apngPlayer.pause();
          }
          // reset audio
          if (this.audio && this.audio.ended) this.audio.currentTime = 0;
          if (this.apngLog.length > 10) {
            this.apngLog.splice(10, this.apngLog.length - 10);
          }
          em.call(this.apngPlayer, event, ...args);
        };
      });
    });
  }

  // create Canvas Element
  createCanvasEle(hasCreatedCanvas: boolean, apngData: any): HTMLCanvasElement {
    const canvasEle: HTMLCanvasElement = hasCreatedCanvas ? document.querySelector("canvas")
      : document.createElement("canvas");
    canvasEle.width = apngData.width;
    canvasEle.height = apngData.height;
    canvasEle.style.width = "100%";
    canvasEle.style.maxWidth = "105% !important";
    canvasEle.style.height = "auto";
    return canvasEle;
  }

  resetAudio(): void {
    if (this.apngPlayer) this.apngPlayer.pause();
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.renderSpecificTimerAPNGImage(this.previousTimeOut);
  }

  // read timer APNG data and add this data to timer info array with specific fileName
  readTimerAPNGImages(): void {
    let count = 0;
    this.timerInfoArr.map((timerInfo) => {
      const filePath = AppConfig.production ?
        `${process.env.PORTABLE_EXECUTABLE_DIR}/data/images/timer/${timerInfo.fileName}.png` :
        `${process.cwd()}/release/data/images/timer/${timerInfo.fileName}.png`;
      readFile(filePath, (err, apngData) => {
        if (err) throw err;
        const parsedAPNGData = parseAPNG(apngData);
        timerInfo['apngData'] = parsedAPNGData;
        console.log("count: ", count, ", lenght: ", this.timerInfoArr.length - 1);
        // check reading finish or not, coz to render specific timer apng image and hide loading
        if (count == this.timerInfoArr.length - 1) {
          this.isFinishReadingApngData = true;
          this.nz.run(() => { }); // render again updated data in timer component html.
        } else count++;
      });
    });
  }

  // retrieve timer info from timerInfo.json
  getTimerInfoJson(): any {
    const filePath = AppConfig.production ?
      `${process.env.PORTABLE_EXECUTABLE_DIR}/data/images/timer/timerInfo.json` :
      `${process.cwd()}/release/data/images/timer/timerInfo.json`;
    return JSON.parse(readFileSync(filePath, "utf8"));
  }

}
