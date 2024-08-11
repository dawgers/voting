import { AfterViewChecked, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CustomerService } from '../customer.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewChecked {

  email = '';
  password = '';

  routerLink: any = "";


  @Output() messageEvent: EventEmitter<boolean> = new EventEmitter();


  loginForm: FormGroup;
  advertisers: any[];

  constructor(private spinner: NgxSpinnerService, private fb: FormBuilder,
    private customer: CustomerService, private router: Router, public snackBar: MatSnackBar,
    private appService: AppService) {

    this.loginForm = this.fb.group({
      userNameFormField: ['', [Validators.required, Validators.required]],
      passwordFormField: ['', [Validators.required]],
    });

    this.loginForm.controls['userNameFormField'].setValue(this.email);
    this.loginForm.controls['passwordFormField'].setValue(this.password);

  }

  ngOnInit() {}

  ngAfterViewChecked() {}

  loggedOut() {
    this.customer.loggedOut()
    this.messageEvent.emit(false);
  }

  loggedIn() {
    this.messageEvent.emit(true);
  }

  submitted: any = false;
  agencyUserId: any = null;

  tryLogin() {
    this.submitted = true;
    this.agencyUserId = null;
    if (this.loginForm.valid) {
      localStorage.setItem('sortOrder', '');
      localStorage.setItem('PageCount', '');
      this.spinner.show();

      let cnic = this.loginForm.controls['userNameFormField'].value;
      let password = this.loginForm.controls['passwordFormField'].value

      this.appService.getUsers(cnic, password).subscribe(res => {
        console.log(res);
        if (res.length > 0) {
          let response = res[0];
          localStorage.setItem('userData', JSON.stringify(response));

          this.routerLink = '/maps';
          this.router.navigateByUrl(this.routerLink);
        } else {
          swal('Username or Password is incorrect.', '', 'error');
        }
        this.spinner.hide();
      })
    }
  }

  get errorLoginEmail() {
    return this.loginForm.get('userNameFormField');
  }

  get errorLoginPassword() {
    return this.loginForm.get('passwordFormField');
  }

  // Method to toggle between sign-in and sign-up panels
  togglePanel() {
    const container = document.getElementById('container');
    const overlayCon = document.getElementById('overlayCon');

    container.classList.toggle('right-panel-active');
    overlayCon.classList.toggle('right-panel-active');

    // Check if the overlay is now on the right panel (sign up)
    const isSignUpPanel = overlayCon.classList.contains('right-panel-active') && overlayCon.querySelector('.overlay-panel.overlay-right');

    // If it's the sign up panel, navigate to the register page
    if (isSignUpPanel) {
        setTimeout(() => {
            this.router.navigate(['/register']);
        }, 600); // Adjust the timeout according to your animation duration
    }
  }
}
