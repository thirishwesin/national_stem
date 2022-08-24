import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { faPlusCircle, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { assign as _assign, cloneDeep as _cloneDeep, isFunction as _isFunction } from 'lodash';
import { Images, ModalConstant, STORE_KEY } from '@nsc/common';
import { rounds } from '@nsc/default-data';
import { AppStore, Episode } from '@nsc/core';
import { ModalComponent } from '@nsc/shared';
import { AppConfig } from 'environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

  appStore = AppStore.Instance;
  appStore$: Subscription;
  unsubscribeOnAnyDataChange: Function;
  isUserView: boolean = true;
  episodes: Episode[] = [];
  faPlusCircle = faPlusCircle;
  faMinusCircle = faMinusCircle;

  Images = Images;
  modalConstant = ModalConstant;

  env = AppConfig;

  constructor(private router: Router, private modalService: NgbModal, private nz: NgZone) { }

  ngOnInit(): void {
    this.episodes = this.appStore.getAllEpisodes();
    this.appStore$ = this.appStore.onAnyDataChange().subscribe(res => {
      this.unsubscribeOnAnyDataChange = res.unsubscribe;
      this.nz.run(() => {
        this.episodes = _cloneDeep(res.newValue[STORE_KEY.EPISODES]);
      })
    })
  }

  clickUserOrAdmin(isUserView: boolean): void {
    this.isUserView = isUserView;
  }

  openModal(modalQuestion: string, modalAction: string, episodeId?: number): void {
    const modalRef = this.modalService.open(ModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true
    });
    _assign(modalRef.componentInstance, { modalQuestion, modalAction, episodeId });
    modalRef.result.then(
      (reason: string) => {
        switch (reason) {
          case this.modalConstant.ACTION.ADD:
            let _episodes: Episode[] = this.appStore.getAllEpisodes();
            const newEpisode = this.appStore.addEpisode({
              episodeId: _episodes.length > 0 ? _episodes[_episodes.length - 1].episodeId + 1 : 1,
              rounds: rounds
            })
            break;
          case this.modalConstant.ACTION.REMOVE:
            this.appStore.deleteEpisode(episodeId);
            this.appStore.modifyEpisodeIds();
            break;
          case this.modalConstant.ACTION.QUIT:
            this.closeApplication();
            break;
        }
      },
    ).catch((res) => { })
  }

  clickEpisode(episodeId: number): void {
    this.router.navigate([this.isUserView ? 'control' : 'admin', episodeId]).then(isRouted => {
      console.log("Is successfully routed => ", isRouted);
    }).catch(error => {
      console.error("Getting error when route to control screen => ", error);
    });
  }

  closeApplication(): void {
    require('@electron/remote').app.exit();
  }

  ngOnDestroy(): void {
    if (_isFunction(this.unsubscribeOnAnyDataChange)) {
      this.unsubscribeOnAnyDataChange();
    }
    this.appStore$.unsubscribe();
  }


  clickTestingComponent(): void {
    this.router.navigateByUrl('/testing');
  }
}