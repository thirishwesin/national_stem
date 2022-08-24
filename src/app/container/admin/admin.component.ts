import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  filter as _filter,
  findIndex as _findIndex,
  remove as _remove,
  assign as _assign,
  forEach as _forEach,
  map as _map,
  isEmpty as _isEmpty
} from "lodash";
import { GameLogicConstant, ModalConstant, Images } from "@nsc/common";
import { timeout, gameLogicList } from "@nsc/default-data"
import { Episode, Round, AppStore } from "@nsc/core";
import { ModalComponent } from "@nsc/shared";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
})
export class AdminComponent implements OnInit {
  Images = Images;
  episodeId: number;
  episode: Episode;
  currentRound: Round;
  appStore = AppStore.Instance;
  gameLogicList: any[] = [];
  gameLogicName: string = "";
  gameLogicConstant = GameLogicConstant;
  timeoutArr = timeout;
  modalConstant = ModalConstant;
  totalQuestion: any;
  beforeBackQuestion: any;

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.episodeId = +params["episodeId"];
      this.episode = this.appStore.getEpisodeById(this.episodeId);
      this.currentRound = this.episode.rounds[0];
      this.gameLogicName = this.currentRound.gameLogicName;
    });
    this.gameLogicList = _filter(gameLogicList, function (gameLogic) {
      return gameLogic.enabled;
    });
    this.appStore.resetRoundsState();
    this.appStore.updateRoundStateByRoundId(this.currentRound.roundId, this.gameLogicName);
  }

  chooseRound(round: Round) {
    const roundIndex = _findIndex(
      this.episode.rounds,
      (_round: Round) => _round.roundId == round.roundId
    );
    this.currentRound = this.episode.rounds[roundIndex];
    this.gameLogicName = this.currentRound.gameLogicName;
  }

  chooseGameLogic(gameLogicName: string) {
    this.gameLogicName = gameLogicName;
    const currentRoundIndex = _findIndex(
      this.episode.rounds,
      (round: Round) => this.currentRound.roundId == round.roundId
    );
    if (currentRoundIndex != -1) {
      this.episode.rounds[currentRoundIndex].gameLogicName = this.gameLogicName;
      console.log("Episode => ", this.episode);
    }
  }

  routeToHome() {
    this.openModal(
      true,
      this.modalConstant.QUESTIONS.GO_BACK,
      this.modalConstant.ACTION.BACK
    );
  }

  openModal(
    isSaveAndBack: boolean = false,
    modalQuestion: string,
    modalAction: string
  ) {
    const modalRef = this.modalService.open(ModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
    });
    _assign(modalRef.componentInstance, {
      isSaveAndBack,
      modalQuestion,
      modalAction,
    });
    modalRef.result.then((reason: string) => {
      switch (reason) {
        case this.modalConstant.ACTION.SAVE_AND_BACK:
          this.episode.rounds = _map(this.episode.rounds, (_round: Round) => {
            _forEach(this.appStore.getRoundsState(), function (_roundState: Round) {
              if (_round.roundId === _roundState.roundId && !_isEmpty(_roundState.gameLogicName)) {
                _round.gameLogicName = _roundState.gameLogicName;
              }
            })
            return _round;
          })
          console.log(this.episodeId, " = ", this.episode)
          this.appStore.updateEpisodeById(this.episodeId, this.episode);
          this.router.navigate(["/home"]);
          break;
        case this.modalConstant.ACTION.BACK:
          this.router.navigate(["/home"]);
          break;
        default:
          break;
      }
    }).catch((res) => { })
  }
}
