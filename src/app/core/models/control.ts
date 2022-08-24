export interface Control {
  currentEpisodeId: number;
  currentRoundId: number;
  currentQuestionId: number;
  currentPlayerId?: string;
  isShowQuestion: boolean;
  isShowAnswer: boolean;
  isChangePlayerBgImage: boolean;
  isShowPlayersPoint: boolean;
  isStartTimer: boolean;
  isResetAudio: boolean;
  timeOut: number;
  isPlayVideo: boolean;
  spinnerWheelNumber: number;
  isShowHint: boolean;
  currentPoint ?: number;
  innerLadderWordId?: number;
  isShowQuestionInTablet?: boolean;
  animationExtraWord?:string;
  playerChoosen?: string;
}

export const initControl: Control = {
  currentEpisodeId: null,
  currentRoundId: null,
  currentQuestionId: null,
  currentPlayerId: '0',
  isShowQuestion: false,
  isShowAnswer: false,
  isChangePlayerBgImage: false,
  isShowPlayersPoint: false,
  isStartTimer: false,
  isResetAudio: false,
  timeOut: 0,
  isPlayVideo: false,
  spinnerWheelNumber: 0,
  isShowHint: false,
  currentPoint: null,
  innerLadderWordId: 1,
  isShowQuestionInTablet: false,
  animationExtraWord:null,
  playerChoosen: ''
}
