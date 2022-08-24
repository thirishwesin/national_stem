import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AudioService, Control, Round, WindowScreenStore, AppStore } from '@nsc/core';
import { EventService } from 'app/shared/services/event.service';
import { BrowserWindow } from 'electron';
import {
  find as _find,
  findIndex as _findIndex
} from 'lodash';
@Component({
  selector: 'app-game-logic-control',
  template: ''
})
export class GameLogicControlComponent {

  @Input('currentRound') currentRound: Round;
  @Input("currentControl") currentControl: Control;
  @ViewChild('fontSettingModal') fontSettingModal: ElementRef;

  currentPoint: number;
  wrongAnswerAudio: HTMLAudioElement;
  correctAnswerAudio: HTMLAudioElement;
  audioService: AudioService;
  eventService: EventService;
  windowScreenStore = WindowScreenStore.Instance;
  appStore = AppStore.Instance;

  constructor(audioService: AudioService, eventService: EventService) {
    this.audioService = audioService;
    this.eventService = eventService;
    this.wrongAnswerAudio = this.audioService.getAudio('Wrong_answer.mp3');
    this.correctAnswerAudio = this.audioService.getAudio('Correct_answer.mp3');
  }

  ngOnInit() {
    console.log("game logic control ngOnInit");
    this.resettingTimer(this.currentRound.firstTimeout, this.currentRound.firstPoint);
  }

  startTimer(): void {
    this.currentControl = {
      ...this.currentControl,
      isStartTimer: !this.currentControl.isStartTimer,
      isResetAudio: false
    };
    this.broadcastToAllOpenedScreens(this.currentControl);
  }

  resetTimer(timeOut: number, point: number): void {
    this.resettingTimer(timeOut, point);
    this.eventService.onChangeControl(this.currentControl);
  }

  resettingTimer(timeOut: number, point: number): void {
    this.currentPoint = point;
    this.currentControl = {
      ...this.currentControl,
      timeOut: timeOut,
      isStartTimer: false,
      isResetAudio: true,
      currentPoint: point
    };
    this.broadcastToAllOpenedScreens(this.currentControl);
  }

  correctAnswer(): void {
    this.correctAnswerAudio.play().then(r => { });
    this.currentControl = {
      ...this.currentControl,
      isStartTimer: false,
      isResetAudio: true
    };
    this.broadcastToAllOpenedScreens(this.currentControl);
  }

  showQuestion(): void {
    this.currentControl.isShowQuestion = !this.currentControl.isShowQuestion;
    this.broadcastToAllOpenedScreens(this.currentControl);
  }

  showAnswer(): void {
    this.currentControl.isShowAnswer = !this.currentControl.isShowAnswer;
    this.broadcastToAllOpenedScreens(this.currentControl);
    if (this.currentControl.isShowAnswer) this.correctAnswerAudio.play().then(r => { });
  }

  wrongAnswer(): void {
    this.wrongAnswerAudio.play().then(r => { });
    this.currentControl = {
      ...this.currentControl,
      isStartTimer: false,
      isResetAudio: true
    };
    this.broadcastToAllOpenedScreens(this.currentControl);
  }

  applyFontSetting(currentQuestion: any): void {
    const questionIndex = _findIndex(this.currentRound.questions,
      (_question: any) => _question.questionId == currentQuestion.questionId);
    this.currentRound.questions[questionIndex] = { ...currentQuestion };
    this.appStore.updateRound(this.currentControl.currentEpisodeId, this.currentRound);
    this.broadcastToAllOpenedScreens(this.currentControl);
  }

  broadcastToAllOpenedScreens(control: Control): void {
    this.windowScreenStore.getOpenedScreenList().forEach((openedWindow: BrowserWindow) => {
      openedWindow.webContents.send("control", control);
    });
  }


  boradcastToSpecificScreen(screenTitle: string, control: Control): void {
    this.windowScreenStore.getOpenedScreenList().filter(screen => screen.title.replace(/\s/g, "").toLowerCase() == screenTitle.toLowerCase()).forEach((openedWindow: BrowserWindow) => {
      openedWindow.webContents.send("control", control);
    });;
  }
}
