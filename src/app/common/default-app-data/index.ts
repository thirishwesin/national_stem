import { Round } from "@nsc/core"
import { GameLogicConstant } from "@nsc/common"
import { defaultFontSetting, recommandFontSettingLabels } from "./font-setting-const"

const rounds: Round[] = [
    {
        "roundId": 1,
        "gameLogicId": 0,
        "gameLogicName": "",
        "firstTimeout": 5,
        "secondTimeout": 5,
        "firstPoint": null,
        "secondPoint": null,
        "questions": []
    },
    {
        "roundId": 2,
        "gameLogicId": 0,
        "gameLogicName": "",
        "firstTimeout": 5,
        "secondTimeout": 5,
        "firstPoint": null,
        "secondPoint": null,
        "questions": []
    },
    {
        "roundId": 3,
        "gameLogicId": 0,
        "gameLogicName": "",
        "firstTimeout": 5,
        "secondTimeout": 5,
        "firstPoint": null,
        "secondPoint": null,
        "questions": []
    },
    {
        "roundId": 4,
        "gameLogicId": 0,
        "gameLogicName": "",
        "firstTimeout": 5,
        "secondTimeout": 5,
        "firstPoint": null,
        "secondPoint": null,
        "questions": []
    },
    {
        "roundId": 5,
        "gameLogicId": 0,
        "gameLogicName": "",
        "firstTimeout": 5,
        "secondTimeout": 5,
        "firstPoint": null,
        "secondPoint": null,
        "questions": []
    }
]

const initialData = {
    websocketUrl: "ws://localhost:8081/ws/websocket",
    episodes: [
        {
            episodeId: 1,
            rounds: rounds
        }
    ],
    state: {
        rounds
    }

}

const gameLogicList: any[] = [
    { name: GameLogicConstant.SCRAMBLE_WORD, enabled: true }
]

const timeout: number[] = [5, 10, 15, 30, 60]

export { rounds, initialData, gameLogicList, defaultFontSetting, timeout, recommandFontSettingLabels };
