import { Injectable, Injector } from '@angular/core';
import { CustomerService } from './customer.service';
import { EventEmitter, Output} from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import {NgxSpinnerService} from 'ngx-spinner';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {
	@Output() messageEvent: EventEmitter<boolean> = new EventEmitter();
  constructor(private spinner: NgxSpinnerService, private router: Router, private customer: CustomerService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //console.log('intercepted request ... ');

    // Clone the request to add the new header.
    const authReq = req.clone({
      //headers: req.headers.set('authorization', 'headerValue')
    });

    //console.log('Sending request with new header now ...');

    //send the newly created request
    return next.handle(authReq).catch((error, caught) => {
		//console.log(error.statusText);
		if(error.statusText  === 'Unknown Error'){
			this.spinner.hide();
			//console.log(error.error);
			swal('Request has timed out', '', 'warning');
			return;
		}
		//console.log('aaaaa');
		//console.log(caught);
		else if (error.url && (error.url.includes("report/billingSumamry/emailPdf") || error.url.includes("report/locationPerformance/emailPdf")  ||error.url.includes("report/lineItemPerformance/emailPdf") || error.url.includes("report/publisherPerformance/emailPdf")) ) {
        error.status == "200";
		//console.log(error);
      } else {
        //console.log('111');
		//console.log(error);
        this.customer.loggedOut();
        this.messageEvent.emit(false);
        this.router.navigateByUrl('/login');
        //return the error to the method that called it
        return Observable.throw(error);
      }
    }) as any;
  }
}