import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  find as _find,
  findIndex as _findIndex
} from 'lodash';

import { ScrambleWord, AudioService, ExternalDeviceQuestion, AppStore, scrambleWord } from '@nsc/core';
import { GameLogicConstant, GAME_PLAYERS, Images } from '@nsc/common';
import { EventService, GameLogicControlComponent, WebSocketService } from '@nsc/shared';
import { defaultFontSetting } from '@nsc/default-data';


@Component({
  selector: 'app-scramble-word-control',
  templateUrl: './scramble-word-control.component.html',
  styleUrls: ['./scramble-word-control.component.scss'],
})
export class ScrambleWordControlComponent extends GameLogicControlComponent implements OnInit, OnDestroy {

  Images = Images;
  Game_Players = GAME_PLAYERS;
  playerId: string;
  gameLogicConstant = GameLogicConstant;
  appStore = AppStore.Instance;
  currentQuestion: ScrambleWord;
  questions: ScrambleWord[];
  isShowQuestionInTablet: boolean = false;
  externalDeviceQuestion: ExternalDeviceQuestion;

  defaultFontSettingEN = defaultFontSetting.SCRAMBLE_WORD.en;
  defaultFontSettingCH = defaultFontSetting.SCRAMBLE_WORD.ch;

  constructor(public eventService: EventService, public audioService: AudioService, public webSocketService: WebSocketService) {
    super(audioService, eventService);
  }


  ngOnInit(): void {
    this.prepareData();
    this.webSocketService.sendQuestionToExternalDevice('all-player', this.externalDeviceQuestion);
    super.ngOnInit();
  }

  prepareData(): void {
    this.questions = [...this.currentRound.questions];
    this.currentQuestion = this.questions[0] ? this.questions[0] : scrambleWord;
    this.currentPoint = this.currentRound.firstPoint;
    this.currentControl = {
      ...this.currentControl,
      currentEpisodeId: this.currentControl.currentEpisodeId,
      currentRoundId: this.currentRound.roundId,
      currentQuestionId: this.currentQuestion?.questionId,
      timeOut: this.currentRound.firstTimeout,
    };
    this.externalDeviceQuestion = this.prepareExternalDeviceQuestion(this.gameLogicConstant.DEFAULT);
  }

  prepareExternalDeviceQuestion(gameLogicName: string): ExternalDeviceQuestion {
    let externalDeviceQuestion: ExternalDeviceQuestion = {
      question: this.currentQuestion.question,
      timeout: this.currentRound.firstTimeout,
      playerId: `player${this.playerId}`,
      currentQuestionId: this.currentQuestion.questionId,
      gameLogicName: gameLogicName,
      currentEpisodeId: this.currentControl.currentEpisodeId,
      isLock: false,
      fontSetting: {
        questionFontSize: this.currentQuestion.ui.font.tabletQuestion,
        answerFontSize: this.currentQuestion.ui.font.tabletAnswer
      }
    }
    return externalDeviceQuestion;
  }

  chooseQuestion(question: ScrambleWord): void {
    this.currentQuestion = question;
    this.currentControl.isShowQuestion = false;
    this.currentControl.isShowAnswer = false;
    this.currentControl.isStartTimer = false;
    this.currentControl.currentQuestionId = this.currentQuestion.questionId;
    this.currentControl.isShowQuestionInTablet = false;
    this.isShowQuestionInTablet = false;
    this.currentControl.isStartTimer = false;
    this.externalDeviceQuestion.currentQuestionId = this.currentQuestion.questionId;
    this.externalDeviceQuestion.question = this.currentQuestion.question;
    this.externalDeviceQuestion.gameLogicName = this.gameLogicConstant.DEFAULT;
    this.externalDeviceQuestion.fontSetting.questionFontSize =  this.currentQuestion.ui.font.tabletQuestion;
    this.externalDeviceQuestion.fontSetting.answerFontSize =  this.currentQuestion.ui.font.tabletAnswer;
    this.webSocketService.sendQuestionToExternalDevice('all-player', this.externalDeviceQuestion);
    this.resetTimer(this.currentRound.firstTimeout, this.currentRound.firstPoint);
  }

  nextQuestion(): void {
    let nextQuestion = this.currentQuestion;

    if (this.currentQuestion.questionId != this.currentRound.questions.length) {
      nextQuestion = _find(this.currentRound.questions, ["questionId", this.currentQuestion.questionId + 1]);

      if (nextQuestion) this.chooseQuestion(nextQuestion);
    }
  }

  previousQuestion(): void {
    let previousQuestion = this.currentQuestion;

    if (this.currentQuestion.questionId != 1) {
      previousQuestion = _find(this.currentRound.questions, ["questionId", this.currentQuestion.questionId - 1]);
      if (previousQuestion) this.chooseQuestion(previousQuestion);
    }
  }

  applyFontSetting(): void {
    const questionIndex = _findIndex(this.currentRound.questions,
      (_question: any) => _question.questionId == this.currentQuestion.questionId);
    this.currentRound.questions[questionIndex] = { ...this.currentQuestion };
    this.appStore.updateRound(this.currentControl.currentEpisodeId, this.currentRound);
    this.externalDeviceQuestion.fontSetting.questionFontSize = this.currentQuestion.ui.font.tabletQuestion;
    this.externalDeviceQuestion.fontSetting.answerFontSize = this.currentQuestion.ui.font.tabletAnswer;
    this.webSocketService.sendQuestionToExternalDevice('specific-player', this.externalDeviceQuestion);
    this.broadcastToAllOpenedScreens(this.currentControl);
  }

  showQuestionInTablet(): void {
    this.isShowQuestionInTablet = !this.isShowQuestionInTablet;
    this.externalDeviceQuestion.gameLogicName = this.isShowQuestionInTablet ? this.currentRound.gameLogicName : this.gameLogicConstant.DEFAULT;
    this.webSocketService.sendQuestionToExternalDevice('specific-player', this.externalDeviceQuestion);
    this.currentControl.isShowQuestionInTablet = !this.currentControl.isShowQuestionInTablet;
    this.broadcastToAllOpenedScreens(this.currentControl);
  }

  selectPlayer(playerId: string): void {
    this.playerId = playerId
    this.isShowQuestionInTablet = false;
    this.currentControl.isStartTimer = false;
    this.currentControl.isStartTimer = false;
    this.externalDeviceQuestion.isLock = false;
    this.externalDeviceQuestion.playerId = `player${this.playerId}`;
    this.externalDeviceQuestion.gameLogicName = this.gameLogicConstant.DEFAULT;
    this.webSocketService.sendQuestionToExternalDevice('all-player', this.externalDeviceQuestion);
    this.currentControl.currentPlayerId = playerId;
    this.currentControl.isShowQuestionInTablet = false;
    this.broadcastToAllOpenedScreens(this.currentControl);
  }

  toggleLockTablet(): void {
    this.externalDeviceQuestion.isLock = !this.externalDeviceQuestion.isLock;
    this.webSocketService.sendQuestionToExternalDevice('specific-player', this.externalDeviceQuestion)
  }

  ngOnDestroy(): void {
  }
}
