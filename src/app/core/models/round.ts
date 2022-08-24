export interface Round {
    roundId : number;
    gameLogicId : number;
    gameLogicName : string;
    firstTimeout : number;
    secondTimeout?: number;
    firstPoint : number;
    secondPoint?: number;
    questions: any[];
}