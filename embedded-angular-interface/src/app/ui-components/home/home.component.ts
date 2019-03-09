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

  constructor(private comms: UartCommsService) {}

  ngOnInit() {
    //subscribe to the receiver the observable for the comms
    this.comms.messages.subscribe(msg => {
      if (msg.Command === "echo"){  //add the messages to our array of recieved messages
        this.messagesRX.push(msg.Command + ': ' + msg.Data);
      }
      else if (msg.Command === "delete"){ //delete message from memory
        this.messagesRX.splice(Number(msg.Data), 1);
      }			
    });
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

  //Tell server you want to remove this message
  deleteMessage(msgIndex: number){
    this.message.Command = "delete";
    this.message.Data = msgIndex.toString();
    this.comms.messages.next(this.message);
  }

}
