import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BrowserWindow } from 'electron';
import { BrowserWindow as _BrowserWindow } from '@electron/remote';
import {
  find as _find,
  findIndex as _findIndex,
  assign as _assign,
} from 'lodash';
import * as path from 'path';
import * as url from 'url';
import { GameLogicConstant, GAME_PLAYERS, Images, ModalConstant, ScreenConstant } from '@nsc/common';
import { Control, Episode, initControl, Player, Round, WindowScreenStore, AppStore } from '@nsc/core';
import { EventService, ModalComponent, WebSocketService } from '@nsc/shared';
import { AppConfig } from '@nsc/environment';
import { ScrambleWordControlComponent } from '@nsc/component';


@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit, OnDestroy {

  @ViewChild(ScrambleWordControlComponent) scrambleWordControl: ScrambleWordControlComponent;

  private activePlayersChangeEvent$: Subscription;
  private controlChangeEvent$: Subscription;

  currentControlComponent: any;

  Images = Images;
  Game_Players: Player[] = GAME_PLAYERS;
  screenConstant = ScreenConstant;
  modalConstant = ModalConstant;
  gameLogicConstant = GameLogicConstant;

  currentEpisode: Episode;
  currentEpisodeId: number;
  currentRound: Round;
  gameLogicName: string = "";

  appStore = AppStore.Instance;
  windowScreenStore = WindowScreenStore.Instance;

  currentControl: Control = initControl;
  isFullScreen: boolean;
  isHidePlayerPoint: boolean = false;

  websocketURL: string = '';

  currentWindow: any;

  constructor(private route: ActivatedRoute, private router: Router,
    public eventService: EventService, public webSocketService: WebSocketService, public modalService: NgbModal) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.currentEpisodeId = parseInt(params['episodeId']);
      this.currentEpisode = this.appStore.getEpisodeById(this.currentEpisodeId);
      this.currentRound = this.currentEpisode.rounds[0];
      this.gameLogicName = this.currentRound.gameLogicName;
    });

    console.log("Current Episode => ", this.currentEpisode);

    this.currentWindow = require('@electron/remote').getCurrentWindow();

    this.initializeControl();

    // translating game logic name
    this.websocketURL = this.appStore.getWebSocketURL();

    this.activePlayersChangeEvent$ = this.eventService.activePlayerChangeEvent.subscribe((activePlayers: Set<string>) => this.updateActivePlayerStatus(activePlayers));

    this.controlChangeEvent$ = this.eventService.controlChangeEvent.subscribe((control: Control) => this.currentControl = control);

  }

  initializeControl(): void {
    this.currentControl = {
      ...initControl,
      currentEpisodeId: this.currentEpisodeId,
      currentRoundId: this.currentRound.roundId,
      currentQuestionId: this.currentRound?.questions[0]?.questionId,
      currentPoint: this.currentRound.firstPoint
    }
  }

  openFontSettingModal(): void {
    this.prepareCurrentControlComponent();
    this.modalService
      .open(this.currentControlComponent.fontSettingModal, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        size: "xl",
        backdrop: "static",
        keyboard: false
      })
  }

  //for font setting modal
  prepareCurrentControlComponent(): void {
    switch (this.gameLogicName) {
      case this.gameLogicConstant.SCRAMBLE_WORD:
        this.currentControlComponent = this.scrambleWordControl;
        break;
    }
  }

  toggleConnectingWebScoket(): void {
    this.webSocketService.isConnected ? this.webSocketService.disconnect() : this.webSocketService.connect(this.appStore.getWebSocketURL())
  }

  chooseRound(round: Round): void {
    const roundIndex = _findIndex(this.currentEpisode.rounds, (_round: Round) => _round.roundId == round.roundId);
    this.currentRound = this.currentEpisode.rounds[roundIndex];
    this.gameLogicName = this.currentRound.gameLogicName;
    this.initializeControl();
  }

  nextRound(): void {
    let nextRound = this.currentRound;

    if (this.currentRound.roundId != this.currentEpisode.rounds.length) {
      nextRound = _find(this.currentEpisode.rounds, ["roundId", this.currentRound.roundId + 1]);
      if (nextRound) this.chooseRound(nextRound);
    }
  }

  previousRound(): void {
    let previousRound = this.currentRound;
    if (this.currentRound.roundId != 1) {
      previousRound = _find(this.currentEpisode.rounds, ["roundId", this.currentRound.roundId - 1]);
      if (previousRound) this.chooseRound(previousRound);
    }
  }

  toggleFullScreen(): void {
    if (this.currentWindow.isFullScreen()) {
      this.currentWindow.setFullScreen(false);
      this.isFullScreen = this.currentWindow.isFullScreen();
    } else {
      this.currentWindow.setFullScreen(true);
      this.isFullScreen = this.currentWindow.isFullScreen();
    }
  }

  openNewScreen(screen: any, params: string = ''): BrowserWindow {
    const BrowserWindow = _BrowserWindow;
    let windowData;
    switch (screen.title) {
      default:
        windowData = {
          width: 1200,
          height: 600
        };
        break;
    }


    var newWindow = new BrowserWindow({
      ...windowData,
      fullscreen: false,
      title: screen.title == this.screenConstant.PLAYER.title ? screen.title + params : screen.title,
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
        webSecurity: AppConfig.production
      }
    });

    newWindow.on("close", e => {
      let index = this.windowScreenStore.getOpenedScreenList().indexOf(newWindow);
      if (index != -1) {
        this.windowScreenStore.getOpenedScreenList().splice(index, 1)
      }
    });

    this.windowScreenStore.addNewScreen(newWindow);

    let route = `${screen.route == this.screenConstant.PLAYER.route ? screen.route + '?playerId=' : screen.route}${params}`
    console.log("route ",route)
    if (AppConfig.production) {
      // production build
      newWindow.loadURL(
        url.format({
          pathname: path.join(__dirname, "./index.html"),
          protocol: "file:",
          slashes: true,
          hash: `/${route}`
        })
      );
    } else {
      // for development
      newWindow.loadURL(`http://localhost:4200/#/${route}`);
    }

    newWindow.webContents.on("dom-ready", () => {
      newWindow.webContents.send("control", this.currentControl);
    });
    return newWindow;
  }

  openAll(): void {
    this.openNewScreen(this.screenConstant.MAIN);
    this.openNewScreen(this.screenConstant.ONE_THIRD);
    this.Game_Players.forEach(player => {
      this.openNewScreen(this.screenConstant.PLAYER, player.id);
    })
  }

  decreasePoint(playerId: string): void {
    this.Game_Players.map(player => {
      if (player.id == playerId) {
        player.point -= this.currentControl.currentPoint;
        if (player.point < 0) player.point = 0;
        this.broadcastPlayerToAllOpenedScreens(player);
      }
    });
  }

  increasePoint(playerId: string): void {
    this.Game_Players.map(player => {
      if (player.id == playerId) {
        player.point = player.point + Number(this.currentControl.currentPoint);
        this.broadcastPlayerToAllOpenedScreens(player);
      }
    });
  }

  broadcastPlayerToAllOpenedScreens(currentPlayer?: Player): void {
    let broadCastData = {
      player: currentPlayer,
      isHidePlayerPoint: this.isHidePlayerPoint,
    };

    this.windowScreenStore.getOpenedScreenList().forEach((openedWindow: BrowserWindow) => {
      openedWindow.webContents.send("playerData", broadCastData)
    })
  }

  changePlayerBgImage(currentPlayer: Player): void {
    currentPlayer.isChangePlayerBgImage = !currentPlayer.isChangePlayerBgImage;
    this.broadcastPlayerToAllOpenedScreens(currentPlayer)
  }

  togglePlayerPoint() {
    this.isHidePlayerPoint = !this.isHidePlayerPoint;
    this.broadcastPlayerToAllOpenedScreens();
  }

  updateActivePlayerStatus(activePlayers: Set<String>): void {
    this.Game_Players.forEach((player: any) => {
      let name = `player${player.id}`;
      let doc = document.getElementById(name)
      if (doc) {
        if (activePlayers.has(name)) {
          document.getElementById(name).className = 'active-player';
        } else {
          document.getElementById(name).classList.remove('active-player')
        }
      }
    })
  }

  goBackHome(modalQuestion: string, modalAction: string): void {
    const modalRef = this.modalService.open(ModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true
    });
    _assign(modalRef.componentInstance, { modalQuestion, modalAction });
    modalRef.result.then(
      (reason: string) => {
        switch (reason) {
          case this.modalConstant.ACTION.QUIT:
            this.windowScreenStore.getOpenedScreenList().map(windowScreen => {
              try {
                windowScreen.close();
              } catch (error) { }
            });
            //reset player points and show background image set false when exit from current episode
            this.Game_Players.map(player => {
              player.point = 0;
              player.isChangePlayerBgImage = false;
            })
            this.router.navigate(["/home"]);
            this.webSocketService.disconnect();
            this.windowScreenStore.removeAllScreen();
            break;
        }
      },
    ).catch((error) => { })
  }

  openEditWebSocketLink(editURLModal): void {
    this.modalService.open(editURLModal, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      size: "lg",
      backdrop: "static",
      keyboard: false,
    })
  }

  editWebsocketURL(): void {
    this.appStore.updateWebSocketURL(this.websocketURL);
    this.modalService.dismissAll();
  }

  ngOnDestroy(): void {
    this.activePlayersChangeEvent$.unsubscribe();
    this.controlChangeEvent$.unsubscribe();
  }
}


