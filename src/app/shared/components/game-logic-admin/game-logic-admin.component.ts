import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-game-logic-admin',
  template: ''
})
export class GameLogicAdminComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  markFormTouched(group: FormGroup): void {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.controls[key];
      control.markAsTouched();
      control.markAsPristine();
    })
  }

  markFormUntouched(group: FormGroup): void {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.controls[key];
      control.markAsUntouched();
    })
  }

}
