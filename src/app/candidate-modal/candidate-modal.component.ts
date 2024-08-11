import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-candidate-modal',
  templateUrl: './candidate-modal.component.html',
  styleUrls: ['./candidate-modal.component.scss']
})
export class CandidateModalComponent implements OnInit {
  @Input() showModal: boolean = false;
  @Input() selectedNAData: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  closeModal() {
    this.showModal = false;
  }
}
