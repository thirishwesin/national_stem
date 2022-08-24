import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { ScrambleWordLogicComponent } from "./scramble-word/scramble-word-logic/scramble-word-logic.component";
import { ScrambleWordControlComponent } from "./scramble-word/scramble-word-control/scramble-word-control.component";
import { ScrambleWordAdminComponent } from "./scramble-word/scramble-word-admin/scramble-word-admin.component";
import { ScrambleWordLogicOnethirdComponent } from './scramble-word/scramble-word-logic-onethird/scramble-word-logic-onethird.component';
import { QuestionListComponent } from "./question-list/question-list.component";
import { MainTitleComponent } from "./main-title/main-title.component";

@NgModule({
  declarations: [
    ScrambleWordLogicComponent,
    ScrambleWordControlComponent,
    ScrambleWordAdminComponent,
    ScrambleWordLogicOnethirdComponent,
    QuestionListComponent,
    MainTitleComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    ScrambleWordLogicComponent,
    ScrambleWordControlComponent,
    ScrambleWordAdminComponent,
    ScrambleWordLogicOnethirdComponent,
    QuestionListComponent,
    MainTitleComponent
  ]
})
export class ComponentModule { }
