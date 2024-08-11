import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Observable, Subject } from 'rxjs/Rx';

@Injectable()
export class SocketClientService {

  saveSocketClientInfo: Subject<any>;

  // Our constructor calls our wsService connect method
  constructor(private wsService: WebsocketService) {
    this.saveSocketClientInfo = <Subject<any>>wsService
      .connect()
      .map((response: any): any => {
        return response;
      })
   }

  // Our simplified interface for sending
  // messages back to our socket.io server
  sendMsg(msg) {
	  //console.log.log('01');
    this.saveSocketClientInfo.next(msg);
  }

}