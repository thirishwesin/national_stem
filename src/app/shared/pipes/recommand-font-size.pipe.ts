import { Pipe, PipeTransform } from '@angular/core';
import {
  find as _find
} from 'lodash';
import { recommandFontSettingLabels } from '@nsc/default-data';

@Pipe({
  name: 'recommandFontSize'
})
export class RecommandFontSizePipe implements PipeTransform {

  recommandFontSettingLabels = recommandFontSettingLabels;
  defaultLang: string;

  constructor() {
  }
  
  transform(value: string, gameLogicName: string = '', screenName: string = '', label: string = '', wordCount: number = 0): string {
    const recommandFontSettingLabel = _find(this.recommandFontSettingLabels, ["gameLogicName", gameLogicName]);
    if (wordCount < 5) {
      value += ' ' + recommandFontSettingLabel[`${this.defaultLang}`]['wordCount4'][`${screenName}`][`${label}`];
    } else if (wordCount < 9) {
      value += ' ' + recommandFontSettingLabel[`${this.defaultLang}`]['wordCount8'][`${screenName}`][`${label}`];
    } else {
      value += ' ' + recommandFontSettingLabel[`${this.defaultLang}`]['wordCount12'][`${screenName}`][`${label}`];
    }
    console.log("value = ", value)
    return value;
  }

}
