import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { GameLogicConstant } from '@nsc/common';
import { Control, Round, ScrambleWord, AppStore } from '@nsc/core';
import { find as _find } from 'lodash';

@Component({
  selector: 'app-scramble-word-logic',
  templateUrl: './scramble-word-logic.component.html',
  styleUrls: ['./scramble-word-logic.component.scss']
})
export class ScrambleWordLogicComponent implements OnInit {

  @Input("currentQuestion") currentQuestion: ScrambleWord;
  @Input("currentControl") currentControl: Control;
  @Input("currentRound") currentRound: Round;

  appStore = AppStore.Instance;

  scrambleWord = GameLogicConstant.SCRAMBLE_WORD;

  currentElementPosition: { x: number, y: number };

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
    document.documentElement.style.setProperty("--scramble-q-block-font-size", fonts.questionMain + "px");
    document.documentElement.style.setProperty("--scramble-a-block-font-size", fonts.answerMain + "px");
  }

}
