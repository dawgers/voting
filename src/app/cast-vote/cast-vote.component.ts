import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Routes, RouterOutlet, RouterModule } from '@angular/router';
import { TopNavComponent } from '../top-nav/top-nav.component';
import { TopNavModule } from '../top-nav/top-nav.module';
import { SidebarModule } from '../sidebar/sidebar.module';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AppService } from '../app.service';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-cast-vote',
  templateUrl: './cast-vote.component.html',
  styleUrls: ['./cast-vote.component.scss']
})
export class CastVoteComponent implements OnInit {

  voteForm: FormGroup;

  constructor(private fb: FormBuilder, private appService: AppService, private spinner: NgxSpinnerService) {

    this.voteForm = this.fb.group({
      cnic: ['', Validators.required],
      na: ['', Validators.required] // NA option
    });
  }

  userData: any;
  ngOnChanges() {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    console.log(this.userData);
  }


  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    console.log(this.userData);
    this.getPartyList();
    this.checkVote();
    this.getPartyListpp();
  }

  onSubmit() {
    if (this.voteForm.valid) {
      console.log(this.voteForm.value);

    }
  }

  
  candidateDataList: any = [];
  selectedcandidate: any = '';
  getPartyList() {
    this.spinner.show();
    this.candidateDataList = [];
    this.appService.getParty(this.userData.na_block).subscribe(res => {
      console.log(res);
      if (res.length > 0) {
        this.candidateDataList = res;
        this.selectedcandidate = res[0]['candidate'];
        this.selectedPoliticalParty = res[0]['political_party'];
      } else {
        swal('Some Error', '', 'error');
      }
      this.spinner.hide();
    })
  }

  candidateDataListpp: any = [];
  selectedcandidatepp: any = '';
  getPartyListpp() {
    this.spinner.show();
    this.candidateDataListpp = [];
    this.appService.getPartypp(this.userData.pp_block).subscribe(res => {
      console.log(res);
      if (res.length > 0) {
        this.candidateDataListpp = res;
        this.selectedcandidatepp = res[0]['candidate'];
        this.selectedPoliticalPartypp = res[0]['political_party'];
      } else {
        swal('Some Error', '', 'error');
      }
      this.spinner.hide();
    })
  }

  isVote: any = false;
  checkVote() {
    this.spinner.show();
    this.isVote = false;
    this.appService.checkVote(this.userData.cnic).subscribe(res => {
      console.log(res);
      if (res.length > 0) {
        this.isVote = true;
      } 
      this.spinner.hide();
    })
  }

  
  saveVoterlist(){

    let payload = {
      name: this.userData.name,
      cnic: this.userData.cnic,
      candidate: this.selectedcandidate,
      political_party: this.selectedPoliticalParty,
      na_block: this.userData.na_block,
      pp_block: this.userData.pp_block,
      pp_candidate: this.selectedcandidatepp,
      political_party_pp: this.selectedPoliticalPartypp
    };

    console.log(payload);

    this.appService.saveVote(payload).subscribe(r => {
      if (r.success) {
        swal('Vote Casted Successfully.', '', 'success');
        this.checkVote();
      } else {
        swal('Registration Failed.', '', 'error');
      }
      this.spinner.hide();
    })
  }

  selectedPoliticalParty: any = '';
  selectCandidateDropdown(val){
    this.selectedcandidate = val;
    let index = this.candidateDataList.findIndex(x => x.candidate ===val);
    this.selectedPoliticalParty = this.candidateDataList[index]['political_party'];
    console.log(this.selectedPoliticalParty)
  }

  selectedPoliticalPartypp: any = '';
  selectCandidateDropdownpp(val){
    this.selectedcandidatepp = val;
    let index = this.candidateDataListpp.findIndex(x => x.candidate ===val);
    this.selectedPoliticalPartypp = this.candidateDataListpp[index]['political_party'];
    console.log(this.selectedPoliticalPartypp)
  }



}