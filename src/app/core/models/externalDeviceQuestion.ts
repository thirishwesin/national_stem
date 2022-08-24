export interface ExternalDeviceQuestion {
    question: string
    timeout: number
    playerId: string
    currentQuestionId: number
    gameLogicName: string
    currentEpisodeId: number
    isLock: boolean
    fontSetting: FontSetting
}

export interface FontSetting {
    questionFontSize: number
    answerFontSize?: number
}
