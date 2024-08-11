import { environment } from '../../environments/environment';

export class Constants {
  public static get GET_USERS(): string {
    return environment.apiUrl + 'getUser';
  }
  public static get CHECK_USER(): string {
    return environment.apiUrl + 'checkUser';
  }
  public static get SAVE_USERS(): string {
    return environment.apiUrl + 'saveUser';
  }
  public static get SAVE_VOTE(): string {
    return environment.apiUrl + 'saveVote';
  }
  public static get GET_NA(): string {
    return environment.apiUrl + 'getNaList';
  }
  public static get GET_PP(): string {
    return environment.apiUrl + 'getppList';
  }
  public static get GET_VOTE(): string {
    return environment.apiUrl + 'getVote';
  }
  public static get GET_VOTE_PP(): string {
    return environment.apiUrl + 'getVotepp';
  }
  public static get CHECK_VOTE(): string {
    return environment.apiUrl + 'checkVote';
  }
  public static get GET_PARTY(): string {
    return environment.apiUrl + 'getParty';
  }
  public static get GET_PARTY_PP(): string {
    return environment.apiUrl + 'getPartypp';
  }

  public static get GET_CANDIDATES(): string {
    return environment.apiUrl + 'getCanList';
  }

  public static get GET_PP_CANDIDATE(): string {
    return environment.apiUrl + 'getppcandidate';
  }
}