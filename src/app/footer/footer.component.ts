import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {

  constructor(private router: Router) { }
	checkType: any = 'QUO';
  ngOnInit() {
	  let agency = JSON.parse(localStorage.getItem('logedInUserData'));
	  this.checkType = agency.checkUrlType;
	//console.log(agency);
  }

}
