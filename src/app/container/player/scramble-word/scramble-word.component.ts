import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Images } from '@nsc/common';
import { ScrambleWord, ScrambleWordAnswer } from '@nsc/core';

@Component({
  selector: 'app-scramble-word',
  templateUrl: './scramble-word.component.html',
  styleUrls: ['./scramble-word.component.scss']
})
export class ScrambleWordComponent implements OnInit {

  @Input() scrambleWord: ScrambleWord;
  @Input() scrambleWordAnswer: ScrambleWordAnswer;

  Images = Images;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    let scrambleWordChanged = changes['scrambleWord']?.currentValue;
    if (scrambleWordChanged) {
      this.setFontSize();
    }
  }

  ngOnInit() {
    this.setFontSize();
  }

  setFontSize() {
    let fonts = this.scrambleWord.ui.font;
    document.documentElement.style.setProperty("--scramble-q-block-font-size", fonts.playerQuestion + "px");
    document.documentElement.style.setProperty("--scramble-a-block-font-size", fonts.playerAnswer + "px");
  }
  
}
