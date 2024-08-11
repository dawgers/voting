import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';
import {Constants} from './util/constant';
//import { environment } from '../environments/environment';

@Injectable()
export class WebsocketService {
  //logedInUserData: any = 0;
  // Our socket connection
  private socket;

  constructor() { }

  connect(): Rx.Subject<MessageEvent> {
	  //this.logedInUserData = JSON.parse(localStorage.getItem('logedInUserData'));
	////console.log.log(this.logedInUserData.id);
    // If you aren't familiar with environment variables then
    // you can hard code `environment.ws_url` as `http://localhost:5000`
	//this.socket.emit('saveSocketClientInfo', this.logedInUserData.id);
    // We define our observable which will observe any incoming messages
    // from our socket.io server.
    let observable = new Observable(observer => {
        this.socket.on('uploadFileMessage', (data) => {
			//console.log.log(data);
          //console.log.log("Received message from Websocket Server")
          observer.next(data);
        })
        /*return () => {
          this.socket.disconnect();
        }*/
    });

    // We define our Observer which will listen to messages
    // from our other components and send messages back to our
    // socket server whenever the `next()` method is called.
    let observer = {
        next: (data: Object) => {
            this.socket.emit('saveSocketClientInfo',data);
        },
    };

    // we return our Rx.Subject which is a combination
    // of both an observer and observable.
    return Rx.Subject.create(observer, observable);
  }

}