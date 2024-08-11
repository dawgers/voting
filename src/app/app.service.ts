import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Constants } from './util/constant';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  private createHeaders(): HttpHeaders {
    return new HttpHeaders().set('Content-Type', 'application/json');
  }

  getUsers(cnic: any, password: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(`${Constants.GET_USERS}?cnic=${cnic}&password=${password}`, { headers })
      .pipe(catchError(this.handleError));
  }

  checkVote(cnic: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(`${Constants.CHECK_VOTE}?cnic=${cnic}`, { headers })
      .pipe(catchError(this.handleError));
  }

  checkUser(cnic: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(`${Constants.CHECK_USER}?cnic=${cnic}`, { headers })
      .pipe(catchError(this.handleError));
  }

  getParty(na: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(`${Constants.GET_PARTY}?na=${na}`, { headers })
      .pipe(catchError(this.handleError));
  }

  getPartypp(pp: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(`${Constants.GET_PARTY_PP}?pp=${pp}`, { headers })
      .pipe(catchError(this.handleError));
  }

  getNa(): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(Constants.GET_NA, { headers })
      .pipe(catchError(this.handleError));
  }

  getpp(): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(Constants.GET_PP, { headers })
      .pipe(catchError(this.handleError));
  }

  getVote(): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(Constants.GET_VOTE, { headers })
      .pipe(catchError(this.handleError));
  }

  getVotepp(): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(Constants.GET_VOTE_PP, { headers })
      .pipe(catchError(this.handleError));
  }

  saveUsers(payload: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post(Constants.SAVE_USERS, payload, { headers })
      .pipe(catchError(this.handleError));
  }
  
  saveVote(payload: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post(Constants.SAVE_VOTE, payload, { headers })
      .pipe(catchError(this.handleError));
  }

  // New method to get candidates data
  getCandidates(): Observable<any[]> {
    const headers = this.createHeaders();
    return this.http.get<any[]>(Constants.GET_CANDIDATES, { headers })
      .pipe(catchError(this.handleError));
  }

  getPPCandidates(): Observable<any[]> {
    const headers = this.createHeaders();
    return this.http.get<any[]>(Constants.GET_PP_CANDIDATE, { headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }
}
