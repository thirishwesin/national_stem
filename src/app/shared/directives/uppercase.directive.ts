import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[Uppercase]'
})
export class Uppercase {

  constructor(private element: ElementRef, private control: NgControl) { }

  @HostListener('input')
  onInput() {
      let value = this.element.nativeElement.value.toUpperCase();
      this.control.control.setValue(value);
  }
}