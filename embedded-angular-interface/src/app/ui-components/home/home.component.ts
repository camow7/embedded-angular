import { Component, OnInit } from '@angular/core';
import {UartCommsService } from '../../services/uart-comms/uart-comms.service'
import { from } from 'rxjs/observable/from';

@Component({
  selector: 'eai-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  messageTX: string = "";
  messagesRX: string[] = [];
  private message = {Command: '',Data: ''}; //Message object we defined for our websocket service

  constructor(private comms: UartCommsService) {
    //subscribe to the receiver the observable for the comms
    comms.messages.subscribe(msg => {
      //add the messages to our array of recieved messages			
      this.messagesRX.push(msg.Command + ': ' + msg.Data);
		});
   }

  ngOnInit() {
  }

  //Send message to websocket with echo command so it comes back to us  
  sendMessage(){
    //Package message object with new data
    this.message.Command = "echo";
    this.message.Data = this.messageTX;
    //Send message object to websocket via observable
    this.comms.messages.next(this.message);
    //Clear message string
		this.messageTX = "";
  }

  deleteMessage(msgIndex: number){
    this.messagesRX.splice(msgIndex, 1);
  }

}
