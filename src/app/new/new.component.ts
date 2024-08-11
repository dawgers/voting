import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { trigger, transition, style, animate } from '@angular/animations';
import { ChartType, ChartOptions } from 'chart.js';
import { Color } from 'ng2-charts';

@Component({
  selector: 'app-results',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
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
export class NewComponent implements OnInit {
  voteForm: FormGroup;
  voteDataList: any = [];
  filteredVoteDataList: any = [];
  selectedProvince: string = '';
  selectedNA: string = '';
  filteredNAList: string[] = [];
  searchTerm: string = '';
  userData: any;
  isCardView: boolean = true;
  animationState: string = 'card';
  page: number = 1; // Initial page number
  itemsPerPage: number = 10; // Number of items per page
  showAnimation: boolean = false; // Flag for animation
  selectedNAData: any[] = []; // Holds selected NA data for popup
  showModal: boolean = false; // Flag to show/hide modal
  sortOption: string = 'na'; // Default sort option
  isDarkMode: boolean = false; // Flag for dark mode

  // Graph data for modal popup
  public modalBarChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{ ticks: { beginAtZero: true } }] },
  };
  public modalBarChartLabels: string[] = [];
  public modalBarChartType: ChartType = 'bar';
  public modalBarChartLegend = true;
  public modalBarChartData: any[] = [
    { data: [], label: 'Votes' }
  ];
  public modalBarChartColors: Color[] = [
    { backgroundColor: 'rgba(63,81,181,0.3)' },
  ];

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
    console.log(this.userData);
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
    this.appService.getCandidates().subscribe((res) => {
      console.log(res);
      if (res.length > 0) {
        // Generate random votes for each candidate
        res.forEach(candidate => {
          candidate.vote = this.generateRandomVotes();
        });

        res.sort((a, b) =>
          Number(a.vote) < Number(b.vote)
            ? 1
            : Number(b.vote) < Number(a.vote)
            ? -1
            : 0
        );

        this.voteDataList = res;
        this.updateFilteredNAList();
        this.filterResults(); // Apply initial filters and pagination
      } else {
        swal('Some Error', '', 'error');
      }
      this.spinner.hide();
    });
  }

  generateRandomVotes() {
    return Math.floor(Math.random() * 100000) + 1; // Generates random votes between 1 and 100000
  }

  selectProvince(val: string) {
    this.selectedProvince = val;
    this.updateFilteredNAList();
    this.filterResults();
  }

  selectNA(val: string) {
    this.selectedNA = val;
    this.filterResults();
  }

  updateFilteredNAList() {
    if (this.selectedProvince) {
      this.filteredNAList = this.voteDataList
        .filter((vote) => vote.province === this.selectedProvince)
        .map((vote) => vote.na)
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort((a, b) => Number(a.replace('NA-', '')) - Number(b.replace('NA-', '')));
    } else {
      this.filteredNAList = this.voteDataList
        .map((vote) => vote.na)
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort((a, b) => Number(a.replace('NA-', '')) - Number(b.replace('NA-', '')));
    }
  }

  filterResults() {
    let filteredResults = this.voteDataList;

    if (this.selectedProvince) {
      filteredResults = filteredResults.filter(
        (vote) => vote.province === this.selectedProvince
      );
    }

    if (this.selectedNA) {
      filteredResults = filteredResults.filter(
        (vote) => vote.na === this.selectedNA
      );
    }

    if (this.searchTerm) {
      const searchTermLower = this.searchTerm.toLowerCase();
      filteredResults = filteredResults.filter((vote) => {
        return (
          vote.candidate.toLowerCase().startsWith(searchTermLower) ||
          vote.political_party.toLowerCase().startsWith(searchTermLower) ||
          vote.na.toLowerCase().startsWith(searchTermLower)
        );
      });
    }

    this.sortFilteredResults(filteredResults);
    this.filteredVoteDataList = filteredResults;
  }

  sortResults(sortOption: string) {
    this.sortOption = sortOption;
    this.filterResults();
  }

  sortFilteredResults(results: any[]) {
    if (this.sortOption === 'alphabetically') {
      results.sort((a, b) => a.candidate.localeCompare(b.candidate));
    } else {
      results.sort((a, b) => Number(a.na.replace('NA-', '')) - Number(b.na.replace('NA-', '')));
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

  openCandidateDetails(candidate: any) {
    // Filter candidates by selected NA
    this.selectedNAData = this.voteDataList.filter(data => data.na === candidate.na);
    this.updateModalGraphData();
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedNAData = [];
  }

  updateModalGraphData() {
    this.modalBarChartLabels = this.selectedNAData.map(data => data.candidate);
    this.modalBarChartData[0].data = this.selectedNAData.map(data => data.vote);
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
