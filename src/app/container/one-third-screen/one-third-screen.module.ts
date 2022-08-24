import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OneThirdScreenComponent } from './one-third-screen.component';
import { SharedModule } from '@nsc/shared';
import { ComponentModule } from '@nsc/component';
import { ContainerRoutingModule } from '../container-routing.module';



@NgModule({
  declarations: [OneThirdScreenComponent],
  imports: [
    CommonModule, SharedModule, ContainerRoutingModule, ComponentModule
  ]
})
export class OneThirdScreenModule { }
