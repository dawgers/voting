import { Component, Input } from '@angular/core';
import { setTheme } from 'ngx-bootstrap';
import { MetaService } from 'ng2-meta';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng6';

  //private apiUrl = 'https://conv.a8zv.net/norm_pix';
  // private apiUrl = 'http://ib.adnxs.com/getuid?http://192.168.9.26:8080/norm_pix?uuid=$UID';
  //  private apiUrl = 'https://ib.adnxs.com/getuid?https://conv.a8zv.net/norm_pix?uuid=$UID';

  constructor(private http: HttpClient, private metaService: MetaService, private route: ActivatedRoute) {
    setTheme('bs4'); // or 'bs4'
    //console.log.log('1234');
    //  var val = this.getUsers();
    this.route.queryParams.subscribe(params => {
      //console.log.log('params are: ' + JSON.stringify(params));
      /*this.serviceOne(params).subscribe(r => {
        //console.log.log(r);
      });*/
    });
    //detectAdBlock();
  }

  detected(isDetected: boolean) {
    console.log('Adblock Detected: ' + isDetected);
    if (isDetected)
      swal('Ads Blocker Detected!!!', 'We have detected that you are using extensions to block ads. We need it to be disabled to operate the site. Please support us by disabling these ads blocker..', 'warning');
  }

  /*serviceOne(parms: any): Observable<any> {
    // console.log('final parms are: ', parms);
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')

    let params = new HttpParams();
    Object.keys(parms).forEach(key => {
      params = params.append(key, parms[key]);
    });

    // console.log(this.apiUrl + params)
    return this.http.get(this.apiUrl, {
      headers: headers,
      params: params
    }).pipe(catchError(this.handleError));
  }*/

  // handleError(error) {
  //   let errorMessage = '';
  //   if (error.error instanceof ErrorEvent) {
  //     // client-side error
  //     errorMessage = `Error: ${error.error.message}`;
  //   } else {
  //     // server-side error
  //     errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  //   }
  //   window.alert(errorMessage);
  //   return throwError(errorMessage);
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
    return throwError(
      'Something bad happened; please try again later.');
  }

  message: boolean;

  loggedOut(b: boolean) {
    this.message = b;

    //console.log.log('Sucribed');
  }

  loggedIn(b: boolean) {
    this.message = b;

    //console.log.log('Sucribed');
  }

}

async function detectAdBlock() {
  let adBlockEnabled = false
  const googleAdUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
  try {
    await fetch(new Request(googleAdUrl)).catch(_ => adBlockEnabled = true)
  } catch (e) {
    adBlockEnabled = true
  } finally {
    console.log(`AdBlock Enabled: ${adBlockEnabled}`)
    if (adBlockEnabled) {
      swal('Adblock Detected!', 'Adblock stops application to work, kindly disable it.', 'warning');
    }
  }
}
