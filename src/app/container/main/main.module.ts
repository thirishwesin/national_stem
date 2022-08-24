import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { SharedModule } from '@nsc/shared';
import { ComponentModule } from '@nsc/component';
import { ContainerRoutingModule } from '../container-routing.module';



@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule, SharedModule, ContainerRoutingModule,ComponentModule
  ]
})
export class MainModule { }
