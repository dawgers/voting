import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-results-pp',
  templateUrl: './resultspp.component.html',
  styleUrls: ['./resultspp.component.scss'],
  animations: [
    trigger('toggleAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('0.5s ease', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0)' }),
        animate('0.5s ease', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ]),
    trigger('popupAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'scale(1)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'scale(0.8)', opacity: 0 })),
      ]),
    ]),
  ]
})
export class ResultsComponentpp implements OnInit {

  voteForm: FormGroup;
  voteDataList: any = []; // Replace with your actual data type if known
  filteredVoteDataList: any = [];
  selectedProvince: string = '';
  searchTerm: string = '';
  userData: any;
  isCardView: boolean = true;
  animationState: string = 'card';
  showAnimation: boolean = false;
  showModal: boolean = false;
  isDarkMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private appService: AppService,
    private spinner: NgxSpinnerService,
    private renderer: Renderer2
  ) {
    this.voteForm = this.fb.group({
      cnic: ['', Validators.required],
      na: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.getVoteList();
    this.loadDarkMode();
  }

  onSubmit() {
    if (this.voteForm.valid) {
      console.log(this.voteForm.value);
      this.showVoteAnimation();
    }
  }

  getVoteList() {
    this.spinner.show();
    this.appService.getVotepp().subscribe((res: any[]) => {
      console.log(res);
      if (res.length > 0) {
        // Assuming `getVotepp()` returns an array of vote data
        this.voteDataList = res;
        this.filterResults(); // Apply initial filters
      } else {
        swal('Some Error', '', 'error');
      }
      this.spinner.hide();
    });
  }

  filterResults() {
    let filteredResults = this.voteDataList;

    if (this.selectedProvince) {
      filteredResults = filteredResults.filter(
        (vote) => vote.province === this.selectedProvince
      );
    }

    if (this.searchTerm) {
      const searchTermLower = this.searchTerm.toLowerCase();
      filteredResults = filteredResults.filter((vote) => {
        return (
          vote.candidate.toLowerCase().startsWith(searchTermLower) ||
          vote.party.toLowerCase().startsWith(searchTermLower)
        );
      });
    }

    this.filteredVoteDataList = filteredResults;
  }

  sortResults(sortOption: string) {
    // Implement sorting logic based on sortOption
    // Example logic:
    if (sortOption === 'alphabetically') {
      this.filteredVoteDataList.sort((a, b) =>
        a.candidate.localeCompare(b.candidate)
      );
    } else if (sortOption === 'votes') {
      this.filteredVoteDataList.sort((a, b) => b.vote - a.vote);
    }
  }

  toggleView() {
    this.isCardView = !this.isCardView;
    this.animationState = this.isCardView ? 'card' : 'list';
  }

  showVoteAnimation() {
    this.showAnimation = true;
    setTimeout(() => {
      this.showAnimation = false;
    }, 2000); // Duration of the animation
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-mode');
      localStorage.setItem('darkMode', 'true');
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
      localStorage.setItem('darkMode', 'false');
    }
  }

  loadDarkMode() {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'true') {
      this.isDarkMode = true;
      this.renderer.addClass(document.body, 'dark-mode');
    } else {
      this.isDarkMode = false;
      this.renderer.removeClass(document.body, 'dark-mode');
    }
  }

}
