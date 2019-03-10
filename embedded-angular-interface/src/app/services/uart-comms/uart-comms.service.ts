import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { WebSocketsService } from '../web-sockets/web-sockets.service';

const SERVER_URL = "ws://192.168.42.1:6123";	//this is the static ip address of the rapsberry pi AP

export interface Message {
	Command: string,
	Data: string
}

@Injectable()
export class UartCommsService {
	public messages: Subject<Message>;
	message: Message;
	constructor(wsService: WebSocketsService) {
		this.messages = <Subject<Message>>wsService
			.connect(SERVER_URL)
			.map((response: MessageEvent): Message => {
				return this.message = JSON.parse(response.data);
			});
	}
}
