import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'eai-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  messageTX: string = "";
  messagesRX: string[] = [];
  constructor() { }

  ngOnInit() {
  }

  sendMessage(){
    this.messagesRX.push(this.messageTX);
    this.messageTX = "";
  }

  deleteMessage(msgIndex: number){
    this.messagesRX.splice(msgIndex, 1);
  }

}
