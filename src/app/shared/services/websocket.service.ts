import { Injectable } from "@angular/core";
import { CompatClient, IFrame, IMessage, Stomp } from '@stomp/stompjs';
import { ExternalDeviceQuestion, WindowScreenStore } from "@nsc/core";
import { EventService } from "./event.service";

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {

    isConnected: boolean;
    stompClient: CompatClient;
    onlineUser: string;
    offlineUser: string;
    activePlayers: Set<string> = new Set<string>();;
    windowScreenStore = WindowScreenStore.Instance;

    constructor(private eventService: EventService) {

    }

    connect(websocketUrl: string): void {
        this.stompClient = Stomp.over(function () {
            return new WebSocket(websocketUrl)
        });

        this.stompClient.onWebSocketClose = (evt) => {
            this.isConnected = false;
        }

        let that = this;

        this.stompClient.connect({ username: 'control-screen' },
            function (frame: IFrame) {
                if (frame.command === 'CONNECTED') {
                    that.stompClient.send("/control-screen/get/online-users");
                    that.isConnected = true;
                }
                that.subscribeExternalDevice()
            }, (error) => {
                console.log("STOMP error ", error);
            }
        );
    }

    disconnect(): void {
        if (this.stompClient != null) {
            this.stompClient.disconnect();
        }
        console.log("Disconnected");
    }

    sendQuestionToExternalDevice(sendTo: string, externalDeviceQuestion: ExternalDeviceQuestion): void {
        let that = this;
        if (this.stompClient) {
            let isConnectedToWebsocket = that.isConnected;


            console.log('externalDevQuestion: ', externalDeviceQuestion)
            console.log(isConnectedToWebsocket ? 'Websocket connection is connected' : 'Websocket connection is disconnected, please connect again.');

            if (isConnectedToWebsocket) {
                switch (sendTo) {
                    case 'specific-player':
                        this.sendToSpecificPlayer(externalDeviceQuestion)
                        break;
                    case 'all-player':
                        this.sendToAllPlayer(externalDeviceQuestion)
                        break;
                    default:
                        break;
                }
            }
        }
    }

    sendToSpecificPlayer(externalDevQuestion: ExternalDeviceQuestion): void {
        let question = JSON.stringify(externalDevQuestion);
        this.stompClient.send("/control-screen/show/question/to/specific-player", {}, question);
    }

    sendToAllPlayer(externalDevQuestion: ExternalDeviceQuestion): void {
        let question = JSON.stringify(externalDevQuestion);
        this.stompClient.send("/control-screen/show/question/to/all-player", {}, question);
    }

    subscribeExternalDevice(): void {
        let that = this;
        this.stompClient.subscribe('/external-device/submit/answer', function (answer: IMessage) {
            let answerObj = JSON.parse(answer.body);
            that.windowScreenStore.getOpenedScreenList().forEach(window => {
                window.webContents.send('submitted-answer', answerObj)
            })
            console.log(answerObj);
        });

        this.stompClient.subscribe('/external-device/get/online-users', function (userInfo: IMessage) {
            let players: string[] = JSON.parse(userInfo.body);
            players.forEach(userName => that.activePlayers.add(userName));
            that.eventService.activePlayerChangeEvent.emit(that.activePlayers);
        });

        this.stompClient.subscribe('/external-device/send/online-user', function (userInfo: IMessage) {
            let username = userInfo.body;
            that.activePlayers.add(username);
            that.eventService.activePlayerChangeEvent.emit(that.activePlayers);
        });
        this.stompClient.subscribe('/external-device/send/offline-user', function (userInfo: IMessage) {
            let username = userInfo.body;
            if (that.activePlayers.has(username)) {
                that.activePlayers.delete(username);
            }
            that.eventService.activePlayerChangeEvent.emit(that.activePlayers);
        });
    }
}
