import { GameLogicConstant } from "@nsc/common"

export const defaultFontSetting = {
    SCRAMBLE_WORD: {
        en: {
            main: {
                title: 90,
                question: 90,
                answer: 90
            },
            oneThird: {
                question: 90,
                answer: 90
            },
            player: {
                point: 300,
                question: 90,
                answer: 90
            },
            externalDevice: {
                question: 90,
                answer: 90
            }
        },
        ch: {
            main: {
                title: 90,
                question: 90,
                answer: 90
            },
            oneThird: {
                question: 90,
                answer: 90
            },
            player: {
                point: 300,
                question: 90,
                answer: 90
            },
            externalDevice: {
                question: 90,
                answer: 90
            }
        }
    },
}

export const recommandFontSettingLabels = [
    {
        gameLogicName: GameLogicConstant.SCRAMBLE_WORD,
        en: {
            wordCount4: {
                main: {
                    question: 120,
                    answer: 120
                },
                oneThird: {
                    question: 120,
                    answer: 120
                }
            },
            wordCount8: {
                main: {
                    question: 90,
                    answer: 90
                },
                oneThird: {
                    question: 90,
                    answer: 90
                }
            },
            wordCount12: {
                main: {
                    question: 55,
                    answer: 55
                },
                oneThird: {
                    question: 55,
                    answer: 55
                }
            }
        },
        ch: {
            wordCount4: {
                main: {
                    question: 120,
                    answer: 90
                },
                oneThird: {
                    question: 120,
                    answer: 90
                }
            },
            wordCount8: {
                main: {
                    question: 90,
                    answer: 90
                },
                oneThird: {
                    question: 90,
                    answer: 90
                }
            },
            wordCount12: {
                main: {
                    question: 55,
                    answer: 55
                },
                oneThird: {
                    question: 55,
                    answer: 55
                }
            }
        }
    },
]