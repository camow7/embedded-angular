# Embedded Angular
## Overview
This project is a boilerplate for creating devices that have a low-level control requirment with a Angular fronte end. This example utilises a Raspberry Pi zero to serve an Angular Interface through NodeJS. The Node server then talks to an Arduino via Serial and passes the data to and from the front-end using web sockects. The Node server also keeps a History of your messages by saving them to JSON files so each client getthe same relection of the system state.

## Key Features
This project set's up a few handy things that form the base for a complete end-to-end system:
- Serving an Angular App with ExpressJS
- Talking to the file system of a Raspberry Pi with Nodes fs module
- Communicating to multiple front-end clients using a websocket server
- 
