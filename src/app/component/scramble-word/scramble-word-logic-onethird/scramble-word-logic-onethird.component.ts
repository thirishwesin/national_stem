import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { GameLogicConstant } from '@nsc/common';
import { ScrambleWord, Control, AppStore } from '@nsc/core';

@Component({
  selector: 'app-scramble-word-logic-onethird',
  templateUrl: './scramble-word-logic-onethird.component.html',
  styleUrls: ['./scramble-word-logic-onethird.component.scss']
})
export class ScrambleWordLogicOnethirdComponent implements OnInit {

  @Input("currentQuestion") currentQuestion: ScrambleWord;
  @Input("currentControl") currentControl: Control;

  scrambleWord = GameLogicConstant.SCRAMBLE_WORD;

  currentElementPosition: { x: number, y: number };

  appStore = AppStore.Instance;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    let controlChanged = changes['currentControl']?.currentValue;

    if (controlChanged) {
      this.currentControl = controlChanged;
      this.setFontSize();
    }
  }

  ngOnInit(): void {
    this.setFontSize();
  }

  setFontSize(): void {
    let fonts = this.currentQuestion.ui.font;
    document.documentElement.style.setProperty("--scramble-q-block-font-size", fonts.questionOneThird + "px");
    document.documentElement.style.setProperty("--scramble-a-block-font-size", fonts.answerOneThird + "px");
  }

}

