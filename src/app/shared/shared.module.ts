import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalComponent } from './components/modal/modal.component';
import { NumbersOnly } from './directives/numbers-only.directive';
import { EventService } from './services/event.service';
import { ApngTimerComponent } from './components/apng-timer/apng-timer.component';
import { SimpleTimerComponent } from './components/simple-timer/simple-timer.component';
import { WebSocketService } from './services/websocket.service';
import { GameLogicControlComponent } from './components/game-logic-control/game-logic-control.component';
import { Uppercase } from './directives/uppercase.directive';
import { RecommandFontSizePipe } from './pipes/recommand-font-size.pipe';

@NgModule({
  declarations: [PageNotFoundComponent, ModalComponent, ApngTimerComponent, SimpleTimerComponent, NumbersOnly, GameLogicControlComponent, Uppercase, RecommandFontSizePipe],
  imports: [CommonModule, FormsModule],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    FontAwesomeModule,
    ModalComponent,
    ApngTimerComponent,
    SimpleTimerComponent,
    NumbersOnly, Uppercase, RecommandFontSizePipe
  ],
  providers: [EventService, WebSocketService]
})
export class SharedModule { }
