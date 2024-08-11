import {Injectable} from '@angular/core';

const TOKEN = 'TOKEN';
const PROFILE_IMG_URL = 'PROFILE_IMG_URL';
const PROFILE_TYPE = 'PROFILE_TYPE';
const RTOKEN = 'RTOKEN';
const USER_ROLE = 'USER_ROLE';
const USER_OBJECt = 'USER_OBJECt';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  setUserObject(user: any): void {
    localStorage.setItem(USER_OBJECt, user);	
  }

  getUserObject(): any {
    return localStorage.getItem(USER_OBJECt);
  }
  
  setRefreshToken(token: string): void {
    localStorage.setItem(RTOKEN, token);
  }

  getRefresToken(): string {
    return localStorage.getItem(RTOKEN);
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN, token);
  }

  getToken(): string {
    return localStorage.getItem(TOKEN);
  }

  loggedOut() {
    localStorage.setItem(TOKEN, null);
    localStorage.setItem(PROFILE_IMG_URL, null);
    this.setUserObject(null);
	setTimeout(() => {
                localStorage.clear();
	}, 1000);
  }


  setProfileImage(imageUrl: string): void {
    localStorage.setItem(PROFILE_IMG_URL, imageUrl);
  }
  getProfileImage(): string {
    return localStorage.getItem(PROFILE_IMG_URL);
  }
  setUserRole(userRole: string): void {
    localStorage.setItem(USER_ROLE, userRole);
  }
  getUserRole(): string {
    return localStorage.getItem(USER_ROLE);
  }

  setProfileType(type: string): void {
    localStorage.setItem(PROFILE_TYPE, type);
  }

  getProfileType(): string {
    return localStorage.getItem(PROFILE_TYPE);
  }

  isLogged() {
    return localStorage.getItem(TOKEN) != 'null';
  }
}
