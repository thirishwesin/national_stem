import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConstant } from '@nsc/common';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  modalQuestion: string;
  modalAction: string;
  isSaveAndBack: boolean = false;
  episodeId: number;
  modalConstant = ModalConstant;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
