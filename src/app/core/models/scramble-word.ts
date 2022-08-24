import { Question } from "./question";
export interface ScrambleWord extends Question {
    question: string;
    answer: string;
    ui: {
        font: {
            questionMain: number;
            answerMain: number;
            questionOneThird: number;
            answerOneThird: number;
            clueLabel: number;
            playerPoint: number;
            roundName: number;
            playerQuestion: number;
            playerAnswer: number;
            tabletQuestion: number;
            tabletAnswer: number;
        }
    }
}

export interface ScrambleWordAnswer {
    word1: "",
    word2: "",
    word3: "",
    word4: ""
}

export const scrambleWord: ScrambleWord = {
    question: "",
    answer: "",
    questionId: 0,
    ui: {
        font: {
            questionMain:  null,
            answerMain: null,
            questionOneThird: null,
            answerOneThird: null,
            clueLabel: null,
            playerPoint: null,
            roundName: null,
            playerQuestion: null,
            playerAnswer: null,
            tabletQuestion: null,
            tabletAnswer: null
        }
    }
}



export const scrambleWordAnswer: ScrambleWordAnswer = {
    word1: "",
    word2: "",
    word3: "",
    word4: ""
}
