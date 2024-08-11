import { Component, EventEmitter, OnInit, Output, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomerService } from '../customer.service';
import { Subject } from 'rxjs';
import swal from 'sweetalert2';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css'],
})
export class TopNavComponent implements OnInit {
  @Output() messageEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() advertiserSelection: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectedAdv: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  parentSubjectAddOrDeleteOrEdit: Subject<any>;
  @Input()
  parentSubjectRemoveRow: Subject<any>;
  @Input()
  parentCompName: Subject<any>;

  profileImage: string;
  isSettingSelected: boolean = false;
  isNotificationSelected: boolean = false;
  isAgency: any = false;
  userType: any = "";
  advertisers: any[];
  advertisers2: any[];
  listingComponent: any = false;
  comapnyName: any = '';
  company: any;
  selectedAdvertiser: any;
  advertiserName: any;
  advertiserToggle: any;
  checkAgeAdv: any = '';
  id: any;
  row: any;
  advertiserComboClass: any = "compListWrap";
  isAdvertiserNotExists: any;
  isAdmin: any = 'false';
  checkUserType: any = '';
  checkUserName: any = '';
  checkUserId: any = '';
  logedInUserData: any = '';
  logedInToken: any = '';
  comapnyId: any = '';
  advertiserId: any =  '';
  logoImage: any = 'tool-logo-new-white';
  checkUrlType: any = 'Quo';
  logoImageDB: any = '';

  constructor(
    private spinner: NgxSpinnerService, 
    private router: Router,
    public modalService: NgbModal,
    private customer: CustomerService,
  ) {}

  userData: any;

  ngOnChanges() {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    console.log(this.userData);
  }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    console.log(this.userData);

    if(!this.userData) {
      this.userData = { name: '' };
    }
    this.checkUserType = '';

    const companyName: any = localStorage.getItem('companyName');
    this.comapnyName = companyName;

    this.isAdmin = this.customer.getUserRole();
    const agency: any = JSON.parse(localStorage.getItem('Alladvertiser'));

    const url: string = window.location.pathname;
    if (url === '/profile-settings') {
      this.isSettingSelected = true;
    } else if (url === '/notification') {
      this.isNotificationSelected = true;
    } else {
      this.isSettingSelected = false;
      this.isNotificationSelected = false;
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const nav = document.querySelector('nav');
    if (document.documentElement.scrollTop > 20) {
      if (nav) {
        nav.classList.add('sticky');
      }
    } else {
      if (nav) {
        nav.classList.remove('sticky');
      }
    }
  }

  handleAsideClick(event: Event) {
    event.stopPropagation(); // Stop the propagation to prevent reaching document
  }

  @HostListener('document:click', ['$event']) clickout(event) {
    // Click outside of the menu was detected
    if (this.advertiserToggle === true) {
      this.advertiserToggle = false;
      this.advertisers2 = this.advertisers;
    }
  }

  getProfileImage() {
    this.profileImage = this.customer.getProfileImage();
    if (this.profileImage === 'null') {
      this.profileImage = 'assets/img/dp.jpg';
    }
    return this.profileImage;
  }

  toggleVisibility() {
    const slidenav = <HTMLInputElement>document.getElementById('slidenav');

    if (slidenav.style.width === '256px' || slidenav.offsetWidth === 256) {
      if (window.innerWidth <= 1024) {
        slidenav.style.width = '0px';
      } else {
        slidenav.style.width = '45px';
      }
    } else {
      slidenav.style.width = '256px';
    }
  }

  loggedOut() {
    this.customer.loggedOut();
    this.messageEvent.emit(false);
    this.router.navigateByUrl('/login');
  }
}
