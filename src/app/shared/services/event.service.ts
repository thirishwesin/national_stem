import { EventEmitter, Injectable } from "@angular/core";
import { Answer, Control, Round } from "@nsc/core";


@Injectable({
    providedIn: 'root'
})
export class EventService {
    questionAddEvent = new EventEmitter<any>();
    questionEditEvent = new EventEmitter<any>();
    questionDeleteEvent = new EventEmitter<{ questionId: number, questionName?: string }>();
    playerSubmitAnswerEvent = new EventEmitter<Answer>();
    showQuestionEvent = new EventEmitter<any>();
    activePlayerChangeEvent = new EventEmitter<Set<string>>();
    controlChangeEvent = new EventEmitter<Control>();

    addQuestion(question: any): void {
        this.questionAddEvent.emit(question);
    }

    editQuestion(question: any): void {
        this.questionEditEvent.emit(question);
    }

    deletionQuestion(questionId: number, questionName?: string): void {
        this.questionDeleteEvent.emit({ questionId, questionName });
    }

    onChangeSubmitAnswer(answer: Answer): void {
        this.playerSubmitAnswerEvent.emit(answer);
    }

    onChangeQuestion(question: any): void {
        this.showQuestionEvent.emit(question);
    }

    onChangeActivePlayer(players: Set<string>): void {
        this.activePlayerChangeEvent.emit(players);
    }

    onChangeControl(control: Control): void {
        this.controlChangeEvent.emit(control);
    }

}
