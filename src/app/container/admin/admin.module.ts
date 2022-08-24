import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { SharedModule } from '@nsc/shared';
import { ComponentModule } from '@nsc/component';
import { ContainerRoutingModule } from '../container-routing.module';



@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule, SharedModule, ContainerRoutingModule,ComponentModule
  ]
})
export class AdminModule { }
