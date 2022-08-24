import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { SharedModule } from '@nsc/shared';
import { ContainerRoutingModule } from '../container-routing.module';
import { ComponentModule } from 'app/component/component.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, SharedModule, ContainerRoutingModule, ComponentModule]
})
export class HomeModule {}
