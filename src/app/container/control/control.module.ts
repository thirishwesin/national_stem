import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlComponent } from './control.component';
import { SharedModule } from '@nsc/shared';
import { ComponentModule } from '@nsc/component';
import { ContainerRoutingModule } from '../container-routing.module';

@NgModule({
  declarations: [ControlComponent],
  imports: [
    CommonModule, SharedModule, ContainerRoutingModule,ComponentModule
  ]
})
export class ControlModule { }
