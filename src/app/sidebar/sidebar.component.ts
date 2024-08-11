import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

declare var swal: any; // Declare swal as any

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewChecked {

  isLogin = false;
  activeComponentCampaign: any = '';
  activeComponentAudience: any = '';
  activeComponentAnalytics: any = '';
  insertionOrder: any = '';
  lineItme: any = '';
  activeComponentReports: any = '';
  activeComponentAdminReport: any = '';
  activeComponentAgencyAdvertisers: any = '';
  activeComponentAdvertiserProfile: any = '';
  activeComponentAdmin: any = '';
  activeComponentAdminPolygon: any = '';
  activeComponentAdminAgriPolygon: any = '';
  activeComponentAdminGeopathDriveby: any = '';
  activeComponentLibrary: any = '';
  pumpsInOut: any = '';
  userType: any = "";
  isAgency: any = false;
  classApply: any = "1";
  classApplyAudi: any = "1";
  SegmentApply: any = '';
  polygonEdit: any = '0';
  classApplyRep: any = '';
  checkAdmin: any = '';
  manageCreatives: any = '';
  PepsicoCustomers: any = '';
  affinityScan: any = '';
  mainDashboard: any = '';
  poiGroup: any = '';
  manageDeliveryOptions: any = '';
  keplerView: any = '';

  constructor(private router: Router, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    const toggle = document.querySelector(".toggle");
    toggle.addEventListener("click", () => {
      this.toggleSidebar();
    });

    const modeSwitch = document.querySelector(".toggle-switch");
    modeSwitch.addEventListener("click", () => {
      this.toggleDarkMode();
    });
  }

  ngAfterViewChecked() {}

  toggleSidebar() {
    const sidebar = document.querySelector('nav');
    sidebar.classList.toggle("close");
  }

  toggleDarkMode() {
    const body = document.querySelector('body') as HTMLElement; // Use type assertion
    body.classList.toggle("dark");
  
    const modeText = document.querySelector(".mode-text") as HTMLElement; // Use type assertion
    if (body.classList.contains("dark")) {
      modeText.innerText = "Light mode";
    } else {
      modeText.innerText = "Dark mode";
    }
  }
  

  navFunction(url, type) {
    localStorage.setItem('chartSelected', '1');
    // Navigation logic...
  }

  sideBarClickFun(event: any) {
    // Sidebar click logic...
  }

  // Other methods...
}
