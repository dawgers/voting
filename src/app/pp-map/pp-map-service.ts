import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Constants } from '../util/constant';
import { catchError } from 'rxjs/operators';
// import {CompanyModel} from '../model/CompanyModel';
import { CustomerService } from '../customer.service';
// import {CompanyResultModel} from '../model/CompanyResultModel';
// import {CampaignBasicModel} from '../model/CampaignBasicModel';
// import {CampaignModel} from '../model/CampaignModel';
// import {CampaignTargetModel} from '../model/CampaignTargetModel';
// import {AmazonModel} from '../model/AmazonModel';
// import {ImageModel} from '../model/ImageModel';
// import {CampaignGroupModel} from '../model/CampaignGroupModel';
// import {SearchModel} from '../model/SearchModel';
// import {CreativeImageValidationModel} from '../model/CreativeImageValidationModel';
import { constants } from 'os';



@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  constructor(private http: HttpClient, private customerService: CustomerService) {

  }


  // SR POI Devices Data Service
  // oohPerformanceByZipService(id: number, agencyId: any, startDate: any, endDate: any, segmentId, region: any, segmentType: any): Observable<any> {
  //   const headers = new HttpHeaders()
  //     .set('Content-Type', 'application/json')
  //     .set('Authorization', 'Bearer ' + this.customerService.getToken());
  //   return this.http.get(Constants.GET_ADDRESSES, { headers: headers }).pipe(catchError(this.handleError));
  // }

    //Schedular Request
    // postSchduler(object: any): Observable<any> {
    //   const headers = new HttpHeaders()
    //     .set('Content-Type', 'application/json')
    //     .set('Authorization', 'Bearer ' + this.customerService.getToken());
    //   console.log(JSON.stringify(object));
    //   return this.http.post(Constants.GET_ADDRESSES, JSON.stringify(object), { headers: headers }).pipe(catchError(this.handleError));
    // }

  
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      //console.log.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
    //return ('Error');
  }
}
