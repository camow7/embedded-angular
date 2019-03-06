import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { NavbarComponent } from './ui-components/navbar/navbar.component';
import { HomeComponent } from './ui-components/home/home.component';

//Import relevant services
import { WebSocketsService } from "./services/web-sockets/web-sockets.service"
import {UartCommsService} from "./services/uart-comms/uart-comms.service"


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [WebSocketsService, UartCommsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
