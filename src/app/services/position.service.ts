import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private stompClient: Client;
  public positionSubject = new BehaviorSubject<any>(null);

  constructor() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8081/ws-livreur'),
      reconnectDelay: 5000,
      debug: (str) => console.log(str)
    });

    this.stompClient.onConnect = () => {
      this.stompClient.subscribe('/topic/positions', (message: IMessage) => {
        const position = JSON.parse(message.body);
        this.positionSubject.next(position);
      });
    };

    this.stompClient.activate();
  }
}
