import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { cloneDeep as _cloneDeep } from 'lodash';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { ScrambleWord, scrambleWord as DEFAULT_SCRAMBLE_WORD } from '@nsc/core';
import { EventService, GameLogicAdminComponent } from '@nsc/shared';
import { Images } from '@nsc/common';
import { defaultFontSetting } from '@nsc/default-data';

@Component({
  selector: 'app-scramble-word-admin',
  templateUrl: './scramble-word-admin.component.html',
  styleUrls: ['./scramble-word-admin.component.scss']
})
export class ScrambleWordAdminComponent extends GameLogicAdminComponent implements OnInit, OnDestroy {

  Images = Images;
  private editEvent$: Subscription;
  scrambleWordForm: FormGroup;
  isAdded: boolean = false;

  scrambleWord: ScrambleWord = _cloneDeep(DEFAULT_SCRAMBLE_WORD);

  defaultFontSettingEN = defaultFontSetting.SCRAMBLE_WORD.en;
  defaultFontSettingCH = defaultFontSetting.SCRAMBLE_WORD.ch;

  constructor(private eventService: EventService, private fb: FormBuilder, private toast: HotToastService) {
    super();
    this.scrambleWordForm = this.fb.group({
      'question': [this.scrambleWord.question, Validators.required],
      'answer': [this.scrambleWord.answer, Validators.required]
    })
  }

  ngOnInit(): void {
    this.editEvent$ = this.eventService.questionEditEvent.subscribe((scrambleWord: ScrambleWord) => {
      this.scrambleWord = scrambleWord;
    })
    console.log(this.scrambleWordForm.controls);
  }

  addOrUpdateQuestion(): void {
    this.markFormTouched(this.scrambleWordForm);
    if (this.scrambleWordForm.valid) {
      this.eventService.addQuestion(this.scrambleWord);
      this.scrambleWord = _cloneDeep(DEFAULT_SCRAMBLE_WORD);
      this.markFormUntouched(this.scrambleWordForm);
    } else {
      this.toast.warning('Please fill the required fields.')
    }
  }

  ngOnDestroy(): void {
    this.editEvent$.unsubscribe();
  }
}
