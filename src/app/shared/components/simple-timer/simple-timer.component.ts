import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { readFileSync } from 'fs';
import {
  find as _find
} from 'lodash';
import { AudioService } from '@nsc/core';
import { Images } from '@nsc/common';
import { AppConfig } from 'environments/environment';


@Component({
  selector: 'app-simple-timer',
  templateUrl: './simple-timer.component.html',
  styleUrls: ['./simple-timer.component.scss']
})
export class SimpleTimerComponent implements OnInit, OnDestroy, OnChanges {

  @Input('timeOut') timeOut: number;
  @Input('startTimer') startTimer: boolean;
  @Input('isResetAudio') isResetAudio: boolean;

  interval: NodeJS.Timeout;
  Images = Images;
  count: number;
  currentTimer: number;
  previousTimer: number;
  timerInfoArr: Array<{ fileName: string, value: number, audio: string }> = [];
  audio: HTMLAudioElement;

  constructor(private audioService: AudioService) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    let changedTimeOut = changes['timeOut']?.currentValue;
    this.startTimer = changes['startTimer']?.currentValue;
    this.isResetAudio = changes['isResetAudio']?.currentValue;

    this.timerInfoArr = this.getTimerInfoJson();

    if ((changedTimeOut == undefined && this.timeOut == 0)) changedTimeOut = this.previousTimer;

    if (changedTimeOut) {
      this.currentTimer = changedTimeOut;
      this.previousTimer = changedTimeOut;

      // convert to millisecond and added 99 coz time out(10s) change to 9s immediately.
      this.timeOut = (changedTimeOut * 100) + 99;
      this.count = changedTimeOut;

      let audioName = _find(this.timerInfoArr, ["value", changedTimeOut]).audio;
      this.audio = this.audioService.getAudio(audioName);
    }
    this.runTimer(this.startTimer);
  }

  runTimer(startTimer: boolean): void {
    if (startTimer) {
      this.interval = setInterval(() => {
        if (this.timeOut <= 0) {
          clearInterval(this.interval);
          this.resetAudio();
        } else {
          this.timeOut = this.timeOut - 1;
          this.count = Math.floor(this.timeOut / 100);
          if (this.audio) this.audio.play();
        }
      }, 10);
    } else {
      clearInterval(this.interval);
      if (this.audio) this.audio.pause();
      if (this.isResetAudio == true) {
        this.count = this.previousTimer;
        this.timeOut = 0;
        this.resetAudio();
      }
    }
  }

  resetAudio(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  getTimerInfoJson(): any {
    const filePath = AppConfig.production ?
      `${process.env.PORTABLE_EXECUTABLE_DIR}/data/images/timer/timerInfo.json` :
      `${process.cwd()}/release/data/images/timer/timerInfo.json`;
    return JSON.parse(readFileSync(filePath, "utf8"));
  }

  ngOnDestroy(): void {
    this.resetAudio();
    this.audio = undefined;
  }

}
