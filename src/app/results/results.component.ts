import { Component, OnInit } from '@angular/core'; // Importing necessary modules from Angular
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../app.service'; // Importing custom service
import swal from 'sweetalert2'; // Importing SweetAlert2 library
import { NgxSpinnerService } from 'ngx-spinner'; // Importing ngx-spinner library
import { trigger, transition, style, animate } from '@angular/animations'; // Importing animation related modules from Angular

@Component({
  selector: 'app-results', // Selector for the component
  templateUrl: './results.component.html', // Template file for HTML markup
  styleUrls: ['./results.component.scss'], // Stylesheet file for styling
  animations: [ // Defining animations for the component
    trigger('toggleAnimation', [ // Defining animation trigger called 'toggleAnimation'
      transition(':enter', [ // Transition animation for entering the component
        style({ opacity: 0, transform: 'translateY(-20px)' }), // Initial styles for entering animation
        animate('0.5s ease', style({ opacity: 1, transform: 'translateY(0)' })) // Animation effect for entering
      ]),
      transition(':leave', [ // Transition animation for leaving the component
        style({ opacity: 1, transform: 'translateY(0)' }), // Initial styles for leaving animation
        animate('0.5s ease', style({ opacity: 0, transform: 'translateY(-20px)' })) // Animation effect for leaving
      ])
    ])
  ]
})
export class ResultsComponent implements OnInit { // Class definition for ResultsComponent which implements OnInit interface
  voteForm: FormGroup; // Declaration of FormGroup for handling form data
  voteDataList: any = []; // Declaration of array to store vote data
  filteredVoteDataList: any = []; // Declaration of array to store filtered vote data
  selectedProvince: string = ''; // Variable to store selected province
  selectedNA: string = ''; // Variable to store selected NA (National Assembly)
  filteredNAList: string[] = []; // Array to store filtered NA list
  userData: any; // Variable to store user data
  isCardView: boolean = true; // Flag to determine if card view is active
  animationState: string = 'card'; // State for animation, initially set to 'card'

  constructor(
    private fb: FormBuilder, // Injecting FormBuilder service for form handling
    private appService: AppService, // Injecting custom service AppService
    private spinner: NgxSpinnerService // Injecting ngx-spinner service for displaying spinner
  ) {
    this.voteForm = this.fb.group({ // Initializing form group with form controls
      cnic: ['', Validators.required], // CNIC field with required validator
      na: ['', Validators.required], // NA field with required validator
    });
  }

  ngOnInit(): void { // Lifecycle hook called after the component is initialized
    this.userData = JSON.parse(localStorage.getItem('userData')); // Retrieving user data from local storage
    console.log(this.userData); // Logging user data to console
    this.getVoteList(); // Calling method to fetch vote list
  }

  onSubmit() { // Method called when form is submitted
    if (this.voteForm.valid) { // Checking if form is valid
      console.log(this.voteForm.value); // Logging form values to console
    }
  }

  getVoteList() { // Method to fetch vote list
    this.spinner.show(); // Displaying spinner
    this.appService.getVote().subscribe((res) => { // Calling service method to get vote data
      console.log(res); // Logging response data to console
      if (res.length > 0) { // Checking if response data is not empty
        res.sort((a, b) => // Sorting response data based on vote count
          Number(a.vote) < Number(b.vote)
            ? 1
            : Number(b.vote) < Number(a.vote)
            ? -1
            : 0
        );
        this.voteDataList = res; // Storing fetched vote data
        this.filteredVoteDataList = res; // Initializing filtered vote data with fetched data
        this.updateFilteredNAList(); // Updating filtered NA list
      } else {
        swal('Some Error', '', 'error'); // Displaying error message using SweetAlert2
      }
      this.spinner.hide(); // Hiding spinner after data fetching is complete
    });
  }

  selectProvince(val: string) { // Method to handle selection of province
    this.selectedProvince = val; // Updating selected province
    this.updateFilteredNAList(); // Updating filtered NA list based on selected province
    this.filterResults(); // Applying filters to vote results
  }

  selectNA(val: string) { // Method to handle selection of NA (National Assembly)
    this.selectedNA = val; // Updating selected NA
    this.filterResults(); // Applying filters to vote results
  }

  updateFilteredNAList() { // Method to update filtered NA list based on selected province
    if (this.selectedProvince) { // Checking if province is selected
      this.filteredNAList = this.voteDataList
        .filter((vote) => vote.province === this.selectedProvince) // Filtering NA list based on selected province
        .map((vote) => vote.na_block) // Mapping NA blocks
        .filter((value, index, self) => self.indexOf(value) === index); // Removing duplicates
    } else {
      this.filteredNAList = this.voteDataList
        .map((vote) => vote.na_block) // Mapping NA blocks
        .filter((value, index, self) => self.indexOf(value) === index); // Removing duplicates
    }
  }

  filterResults() { // Method to apply filters to vote results
    if (this.selectedProvince && this.selectedNA) { // Checking if both province and NA are selected
      this.filteredVoteDataList = this.voteDataList.filter( // Filtering vote data based on selected province and NA
        (vote) =>
          vote.province === this.selectedProvince &&
          vote.na_block === this.selectedNA
      );
    } else if (this.selectedProvince) { // Checking if only province is selected
      this.filteredVoteDataList = this.voteDataList.filter( // Filtering vote data based on selected province
        (vote) => vote.province === this.selectedProvince
      );
    } else if (this.selectedNA) { // Checking if only NA is selected
      this.filteredVoteDataList = this.voteDataList.filter( // Filtering vote data based on selected NA
        (vote) => vote.na_block === this.selectedNA
      );
    } else { // If no filters are selected
      this.filteredVoteDataList = this.voteDataList; // Resetting filtered vote data to original vote data
    }
  }

  toggleView() { // Method to toggle between card and list view
    this.isCardView = !this.isCardView; // Toggling flag value
    this.animationState = this.isCardView ? 'card' : 'list'; // Updating animation state based on view type
  }
}
