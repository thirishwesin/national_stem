import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from './player.component';
import { SharedModule } from '@nsc/shared';
import { ContainerRoutingModule } from '../container-routing.module';
import { ScrambleWordComponent } from './scramble-word/scramble-word.component';

@NgModule({
  declarations: [PlayerComponent, ScrambleWordComponent],
  imports: [
    CommonModule, SharedModule, ContainerRoutingModule
  ]
})
export class PlayerModule { }
