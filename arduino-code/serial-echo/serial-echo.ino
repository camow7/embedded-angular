/*
  Serial Echo

  This is a simpe sketch to read bytes from the serial port and echo them
  back when the carriage return is sent.

  We are running at 1Mbps to test the upper limit of the bandwidth

  created 8 March 2019
  by Cameron Owen
*/

#define MaxBufferSize 512 //define the max message of the buffer
 
char serialBuffer[MaxBufferSize];
char incomingByte;
int bufferIndex = 0;

void setup() {
  Serial.begin(1000000);
}

void loop() {
  while (Serial.available()) {      //While Data on the serial port
    incomingByte = Serial.read();
    //if a carriage return is recieved or the buffer is full, send the message and clear the buffer
    if ( incomingByte == 0x0d || bufferIndex >= (MaxBufferSize-1)){
      serialBuffer[bufferIndex] = 0x0a; //add line feed
      Serial.write(serialBuffer, bufferIndex+1);
      bufferIndex = 0;
    }
    else {
      serialBuffer[bufferIndex] = incomingByte; //store the next byte until CR of fulll buffer
      bufferIndex++;
    }
  }
}
