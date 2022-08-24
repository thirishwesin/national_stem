import { Component, NgZone, OnInit } from '@angular/core';
import {
  find as _find
} from 'lodash';
import { ipcRenderer as ipc } from 'electron';
import { Control, Episode, Round, AppStore } from '@nsc/core';
import { GameLogicConstant, Images } from '@nsc/common';

@Component({
  selector: 'app-one-third-screen',
  templateUrl: './one-third-screen.component.html',
  styleUrls: ['./one-third-screen.component.scss']
})
export class OneThirdScreenComponent implements OnInit {

  Images = Images;
  timeOut: number;
  isStartTimer: boolean;
  isResetAudio: boolean;
  control: Control;
  currentEpisode: Episode;
  currentRound: Round;
  currentQuestion: any;
  appStore = AppStore.Instance;
  gameLogicConstant = GameLogicConstant;
  isResettingLayoutPosition: boolean = false;

  constructor(readonly nz: NgZone) {
    ipc.on("control", (event, data) => {
      console.log("Incoming broadcast event from control", data);
      this.prepareData(data);
    });
  }

  ngOnInit(): void {
  }

  prepareData(control: Control): void {
    this.nz.run(() => {
      this.control = control
      this.currentEpisode = this.appStore.getEpisodeById(this.control.currentEpisodeId);
      this.currentRound = _find(this.currentEpisode.rounds, ["roundId", this.control.currentRoundId]);
      if (this.currentRound) {
        this.currentQuestion = _find(this.currentRound.questions, ["questionId", this.control.currentQuestionId]);
      }
      this.isStartTimer = this.control.isStartTimer;
      this.isResetAudio = this.control.isResetAudio;
      this.timeOut = this.control.timeOut;

      if (this.control.currentRoundId == 0) {
        this.isResettingLayoutPosition = true;
        setTimeout(() => {
          this.isResettingLayoutPosition = false;
        }, 3000);
      }
    })
  }

}
