import { Component, EventEmitter, OnInit, Output, Renderer2, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppService } from '../app.service';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, AfterViewInit {
  email: any = '';
  password: any = '';
  name: any = '';
  phone: any = '';
  na: any = '';
  pp: any = '';
  routerLink: any = '';
  @Output() messageEvent: EventEmitter<boolean> = new EventEmitter();
  RegisterForm: FormGroup;
  advertisers: any[];

  dropdownTitleIcon: string = '';
  dropdownTitle: string = 'Select an option';
  floatingIcon: string = '';

  constructor(
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private customer: CustomerService,
    private router: Router,
    public snackBar: MatSnackBar,
    private appService: AppService,
    private renderer: Renderer2
  ) {
    this.RegisterForm = this.fb.group({
      userNameFormField: ['', [Validators.required, Validators.required]],
      passwordFormField: ['', [Validators.required]],
      nameFormField: ['', [Validators.required]],
      naFormField: ['', [Validators.required]],
      ppFormField: ['', [Validators.required]],
      phoneFormField: ['', [Validators.required]],
    });

    this.RegisterForm.controls['userNameFormField'].setValue(this.email);
    this.RegisterForm.controls['passwordFormField'].setValue(this.password);
    this.RegisterForm.controls['nameFormField'].setValue(this.name);
    this.RegisterForm.controls['naFormField'].setValue(this.na);
    this.RegisterForm.controls['ppFormField'].setValue(this.pp);
    this.RegisterForm.controls['phoneFormField'].setValue(this.phone);
  }

  ngOnInit() {
    this.getNaList();
    this.getPPList();
  }

  ngAfterViewChecked() {
  }

  loggedOut() {
    this.customer.loggedOut();
    this.messageEvent.emit(false);
  }

  loggedIn() {
    this.messageEvent.emit(true);
  }

  naDataList: any = [];
  selectedNa: any = '';
  getNaList() {
    this.naDataList = [];
    this.appService.getNa().subscribe(res => {
      console.log(res);
      if (res.length > 0) {
        // Assuming 'na' is a numeric field, you can sort it numerically
        this.naDataList = res.sort((a, b) => a.na - b.na);
        this.selectedNa = this.naDataList[0].na;
        this.RegisterForm.controls['naFormField'].setValue(this.selectedNa);
      } else {
        swal('Some Error', '', 'error');
      }
      this.spinner.hide();
    });
  }

  ppDataList: any = [];
  selectedpp: any = '';
  getPPList() {
    this.ppDataList = [];
    this.appService.getpp().subscribe(res => {
      console.log(res);
      if (res.length > 0) {
        // Assuming 'pp' is a numeric field, you can sort it numerically
        this.ppDataList = res.sort((a, b) => a.pp - b.pp);
        this.selectedpp = this.ppDataList[0].pp;
        this.RegisterForm.controls['ppFormField'].setValue(this.selectedpp);
      } else {
        swal('Some Error', '', 'error');
      }
      this.spinner.hide();
    });
  }

  selectNaDropdown(val) {
    this.RegisterForm.controls['naFormField'].setValue(val);
  }

  selectppDropdown(val) {
    this.RegisterForm.controls['ppFormField'].setValue(val);
  }

  submitted: any = false;
  submitRegistration() {
    this.submitted = true;
    if (this.RegisterForm.valid) {
      localStorage.setItem('sortOrder', '');
      localStorage.setItem('PageCount', '');
      this.spinner.show();

      let cnic = this.RegisterForm.controls['userNameFormField'].value;
      let password = this.RegisterForm.controls['passwordFormField'].value;
      let name = this.RegisterForm.controls['nameFormField'].value;
      let naBlock = this.RegisterForm.controls['naFormField'].value;
      let phone = this.RegisterForm.controls['phoneFormField'].value;
      let ppBlock = this.RegisterForm.controls['ppFormField'].value;

      let payload = {
        name: name,
        phone: phone,
        cnic: cnic,
        password: password,
        na_block: naBlock,
        pp_block: ppBlock
      };

      this.appService.saveUsers(payload).subscribe(r => {
        if (r.success) {
          swal('User Saved Successfully.', '', 'success');
          setTimeout(() => {
            this.routerLink = '/login';
            this.router.navigateByUrl(this.routerLink);
          }, 5000);
        } else {
          swal('Registration Failed.', '', 'error');
        }
        this.spinner.hide();
      });
    }
  }

  agencyUserId: any = null;
  checkUser() {
    this.submitted = true;
    if (this.RegisterForm.valid) {
      localStorage.setItem('sortOrder', '');
      localStorage.setItem('PageCount', '');
      this.spinner.show();

      let cnic = this.RegisterForm.controls['userNameFormField'].value;

      this.appService.checkUser(cnic).subscribe(res => {
        console.log(res);
        if (res.length > 0) {
          swal('CNIC already exists.', '', 'error');
        } else {
          this.submitRegistration();
        }
        this.spinner.hide();
      });
    }
  }

  get errorRegisterEmail() {
    return this.RegisterForm.get('userNameFormField');
  }

  get errorRegisterPassword() {
    return this.RegisterForm.get('passwordFormField');
  }

  get errorRegisterName() {
    return this.RegisterForm.get('nameFormField');
  }

  get errorRegisterNa() {
    return this.RegisterForm.get('naFormField');
  }

  get errorRegisterPhone() {
    return this.RegisterForm.get('phoneFormField');
  }

  togglePanel() {
    const overlayCon = document.getElementById('registrationOverlayCon');
    overlayCon.classList.toggle('right-panel-active');

    // Check if the overlay is now on the left panel (login)
    const isLoginPanel = overlayCon.classList.contains('right-panel-active') && overlayCon.querySelector('.roverlay-panel.registration-overlay-left');

    // If it's the login panel, navigate to the login page
    if (isLoginPanel) {
        setTimeout(() => {
            this.router.navigate(['/login']);
        }, 600); // Adjust the timeout according to your animation duration
    }
  }

  // Dropdown functionality
  toggleDropdown() {
    const isOpen = this.dropdownTitleIcon.includes('rotate(180deg)');
    const newRotation = isOpen ? 'rotate(0)' : 'rotate(180deg)';
    const newHeight = isOpen ? '0' : '200px';
    const newOpacity = isOpen ? '0' : '1';

    this.renderer.setStyle(document.documentElement, '--rotate-arrow', newRotation);
    this.renderer.setStyle(document.documentElement, '--dropdown-height', newHeight);
    this.renderer.setStyle(document.documentElement, '--list-opacity', newOpacity);
  }

  onMouseMove(event) {
    // Mouse move effect logic here if needed
  }

  onMouseOver(event) {
    // Hover effect logic here if needed
  }

  onItemClick(event) {
    const selectedItem = event.target.innerText;
    // Handle the selected item logic here, for example, update the dropdown title
    this.dropdownTitle = selectedItem;
    this.toggleDropdown(); // Close the dropdown after selection if needed
  }

  ngAfterViewInit() {
    // Set initial position for the floating icon
    const overlayCon = document.getElementById('registrationOverlayCon');
    const boundingRect = overlayCon.getBoundingClientRect();
    this.renderer.setStyle(document.documentElement, '--floating-icon-left', `${boundingRect.width - 60}px`);
    this.renderer.setStyle(document.documentElement, '--floating-icon-top', `${boundingRect.height - 60}px`);
  }
}
