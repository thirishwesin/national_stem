import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Round } from '@nsc/core';

@Component({
  selector: 'app-main-title',
  templateUrl: './main-title.component.html',
  styleUrls: ['./main-title.component.scss']
})
export class MainTitleComponent implements OnInit {

  @Input("currentRound") currentRound: Round;
  @Input("currentQuestion") currentQuestion: any;

  currentRoundName: string;
  currentGameLogicName: string;

  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    let currentQuestion = changes?.currentQuestion ? changes?.currentQuestion.currentValue : undefined;
    if (currentQuestion) {
      this.fontSize();
    }
  }

  fontSize() {
    let font = this.currentQuestion.ui.font;
    document.documentElement.style.setProperty("--header-font-size", font?.roundName + "px");
  }
}
