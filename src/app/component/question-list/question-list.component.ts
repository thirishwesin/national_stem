import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import {
  findIndex as _findIndex,
  remove as _remove,
  assign as _assign,
  find as _find
} from 'lodash';
import { KeyValue } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotToastService } from '@ngneat/hot-toast';
import { Subscription } from 'rxjs';
import { EventService, ModalComponent } from '@nsc/shared';
import { Round, AppStore } from '@nsc/core';
import { GameLogicConstant, ModalConstant, QUESTION_TABLE_COLUMNS } from '@nsc/common';


@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit, OnDestroy {

  @Input('round') currentRound: Round;
  @Input() episodeId: number;
  private questionAddEvent$: Subscription;
  gameLogicConst = GameLogicConstant;
  appStore = AppStore.Instance;
  modalConstant = ModalConstant;
  tableColumns = [];
  questionList = [];
  tableDatas = [];
  gameLogicName: string = '';

  //video word
  videoUrl: string = '';
  isVideoName: boolean = false;

  constructor(private eventService: EventService,
    private modalService: NgbModal,
    private toast: HotToastService) { }

  ngOnInit(): void {
    this.prepareQuestinonTable();
    this.questionAddEvent$ = this.eventService.questionAddEvent.subscribe((question: any) => {
      this.addOrUpdateQuestion(question);
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.gameLogicName = "";
    this.prepareQuestinonTable();
    const currentValue = changes.currentRound.currentValue;
    this.appStore.updateRoundStateByRoundId(currentValue.roundId, currentValue.gameLogicName);
  }

  prepareQuestinonTable(): void {
    this.tableDatas = [];
    this.tableColumns = QUESTION_TABLE_COLUMNS[this.currentRound.gameLogicName] || [];
    this.questionList = this.currentRound.questions;
    this.gameLogicName = this.questionList.length > 0 ? this.currentRound.gameLogicName : this.gameLogicName;
    switch (this.currentRound.gameLogicName) {
      case GameLogicConstant.SCRAMBLE_WORD:
        this.questionList.forEach(_question => {
          const { questionId, question, answer } = _question;
          let data = { questionId, question, answer };
          this.tableDatas.push(data);
        })
        break;
      default:
        break;
    }
  }

  valueAscOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }

  addOrUpdateQuestion(question: any): void {
    if (this.gameLogicName && this.gameLogicName != this.currentRound.gameLogicName) {
      this.openModal(question);
    } else {
      this.addQuestion(question);
      this.prepareQuestinonTable();
    }
  }

  private addQuestion(question: any): void {
    if (question.questionId == 0) {
      this.currentRound.questions.push(
        { ...question, questionId: this.currentRound.questions.length + 1 }
      );
    } else {
      const questionIndex = _findIndex(this.currentRound.questions,
        (_question: any) => _question.questionId == question.questionId);
      this.currentRound.questions[questionIndex] = { ...question };
    }
    this.appStore.updateRoundStateByRoundId(this.currentRound.roundId, this.currentRound.gameLogicName);
  }

  openModal(question: any): void {
    const modalRef = this.modalService.open(ModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true
    })
    _assign(modalRef.componentInstance, {
      modalQuestion: this.modalConstant.QUESTIONS.ADD_QUESTION,
      modalAction: this.modalConstant.ACTION.ADD,
    });
    modalRef.result.then(
      (reason: string) => {
        switch (reason) {
          case this.modalConstant.ACTION.ADD:
            this.currentRound.questions = [];
            this.addQuestion(question);
            this.prepareQuestinonTable();
            break;
          default:
            break;
        }
      },
      (reason: string) => {
        console.log("On Click Cancel", reason);
      }
    ).catch((res) => { })
  }

  onClickEdit(questionId: number): void {
    if (this.gameLogicName && this.gameLogicName != this.currentRound.gameLogicName) {
      this.toast.warning(`Your questions are ${this.gameLogicName.toLowerCase()}'s questions.
      Please change game logic name to ${this.gameLogicName.toLowerCase()} to edit.`)
    } else {
      const questionIndex = _findIndex(this.currentRound.questions,
        (question) => question.questionId == questionId);
      this.eventService.questionEditEvent.emit({ ...this.currentRound.questions[questionIndex] });
    }
  }

  onClickDelete(questionId: number): void {
    const modalRef = this.modalService.open(ModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true
    });
    _assign(modalRef.componentInstance, {
      modalQuestion: this.modalConstant.QUESTIONS.DELETE_QUESTION,
      modalAction: this.modalConstant.ACTION.DELETE,
    });
    modalRef.result.then((reason: string) => {
      switch (reason) {
        case this.modalConstant.ACTION.DELETE:
          this.eventService.questionDeleteEvent.emit({ questionId: questionId });
          _remove(this.currentRound.questions, (question: any) => question.questionId == questionId);
          for (let i = 0; i < this.currentRound.questions.length; i++) {
            this.currentRound.questions[i] = { ...this.currentRound.questions[i], questionId: i + 1 }
          }
          this.prepareQuestinonTable();
          break;
      }
    }).catch((res) => { })
  }

  ngOnDestroy(): void {
    if (this.questionAddEvent$) this.questionAddEvent$.unsubscribe();
  }
}



