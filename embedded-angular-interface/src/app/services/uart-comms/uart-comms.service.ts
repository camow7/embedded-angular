import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { WebSocketsService } from '../web-sockets/web-sockets.service';

const SERVER_URL = "ws://localhost:6123";

export interface Message {
	Command: string,
	Data: string
}

@Injectable()
export class UartCommsService {
	public messages: Subject<Message>;

	constructor(wsService: WebSocketsService) {
		this.messages = <Subject<Message>>wsService
			.connect(SERVER_URL)
			.map((response: MessageEvent): Message => {
				let message = JSON.parse(response.data);
				return {
					Command: message.command,
					Data: message.data
				}
			});
	}
}
