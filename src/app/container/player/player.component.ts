import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ipcRenderer as ipc } from 'electron';
import { find as _find } from 'lodash';
import { Answer, Control, Episode, Player, Round, ScrambleWordAnswer, WindowScreenStore, AppStore } from '@nsc/core';
import { defaulWrongWordImage, GameLogicConstant, GAME_PLAYERS, Images } from '@nsc/common';
import { scrambleWordAnswer } from 'app/core/models/scramble-word';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  paramObj: any;
  playerId: string;
  player: Player
  point: number;
  isChangePlayerBgImage: boolean;
  Game_Players: Player[] = GAME_PLAYERS;
  gameLogicConstant = GameLogicConstant;
  windowScreenStore = WindowScreenStore.Instance;
  appStore = AppStore.Instance;
  isHidePlayerPoint: boolean = false;
  Images = Images;
  currentControl: Control;
  currentEpisode: Episode;
  currentRound: Round;
  currentQuestion: any;
  answer: Answer;
  sendFromPlayerId: string;
  wrongWordImage: string = defaulWrongWordImage;
  scrambleWord: ScrambleWordAnswer = {
    word1: "",
    word2: "",
    word3: "",
    word4: ""
  }

  constructor(public route: ActivatedRoute, readonly nz: NgZone) {

    ipc.on("control", (event, data) => {
      console.log("Incoming broadcast event from control", data);
      this.prepareData(data);
    });

    ipc.on("submitted-answer", (event, data) => {
      console.log("Incoming broadcast event from tablet", data);
      this.nz.run(() => {
        this.answer = { ...data };
        this.sendFromPlayerId = this.answer.sendFrom.match(/\d/g)[0];
        this.updateSubmittedAnswer();
      })
    })

    ipc.on("playerData", (event, message) => {
      console.log("incoming broadcast event from control", message);
      this.nz.run(() => {
        if (message.player)
          this.reloadPlayer(message.player);
        this.isHidePlayerPoint = message.isHidePlayerPoint;
      });
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.paramObj = { ...params.keys, ...params };
      console.log(this.paramObj);

      this.playerId = this.paramObj.params.playerId;
      this.Game_Players.forEach(player => {
        if (player.id == this.playerId)
          this.player = player;
      })
    });
  }

  prepareData(control: Control): void {
    this.nz.run(() => {
      if (this.currentControl) this.setDefaultData(control);
      this.currentControl = control;
      this.currentEpisode = this.appStore.getEpisodeById(this.currentControl.currentEpisodeId);
      this.currentRound = _find(this.currentEpisode.rounds, ["roundId", this.currentControl.currentRoundId]);
      this.currentQuestion = _find(this.currentRound.questions, ["questionId", this.currentControl.currentQuestionId]);
      this.sendFromPlayerId = control.currentPlayerId;
      this.setFontSize();
    });
  }

  reloadPlayer(player: Player): void {
    if (player.id == this.playerId)
      this.player = player;
  }

  setDefaultData(control: Control): void {
    if (control.currentRoundId != this.currentControl.currentRoundId || (control.currentQuestionId != this.currentControl.currentQuestionId && control.currentPlayerId != this.playerId)) {
      this.scrambleWord = { ...scrambleWordAnswer };
      this.wrongWordImage = defaulWrongWordImage;
    }
  }

  updateSubmittedAnswer(): void {
    if (this.answer) {
      if (this.sendFromPlayerId == this.playerId) {
        this.wrongWordImage = this.answer.answer;
      } else if (this.currentRound.gameLogicName == this.gameLogicConstant.SCRAMBLE_WORD && this.sendFromPlayerId == this.playerId) {
        const { answerIndex, answer } = this.answer;
        if (parseInt(answerIndex) != -1) {
          for (let key in this.scrambleWord) {
            if (!this.scrambleWord[key]) {
              this.scrambleWord[key] = answer;
              break;
            }
          }
        } else {
          for (let i = Object.keys(this.scrambleWord).length; i > 0; i--) {
            if (this.scrambleWord[`word${i}`]) {
              this.scrambleWord[`word${i}`] = "";
              break;
            }
          }
        }
      }
    }
  }


  setFontSize() {
    document.documentElement.style.setProperty("--player-mark-font-size", this.currentQuestion.ui.font.playerPoint + "px");
  }

}
