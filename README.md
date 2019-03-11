# Embedded Angular
## Overview
This project is a boilerplate for creating devices that have a low-level control requirment with a Angular fronte end. This example utilises a Raspberry Pi zero to serve an Angular Interface through NodeJS. The Node server then talks to an Arduino via Serial and passes the data to and from the front-end using web sockects. The Node server also keeps a History of your messages by saving them to JSON files so each client gets the same relection of the system state.

![System Overview](https://github.com/camow7/embedded-angular/raw/master/documents/diagram/overview.png)

## Key Features
This project set's up a few handy things that form the base for a complete end-to-end system:
- Serving an Angular App with ExpressJS
- Talking to the file system of a Raspberry Pi with Nodes fs module
- Communicating to external device via NPM package serialport
- Allows multiple devices connected simultaneously with real-time updates via websockets
- Set's up primary raspberry pi wifi as an access point with DHCP server
- Bridges primary wifi to secondary wifi (if available) to allow internet access via AP

## Hardware
To fully complete this porject you will need the following hardware:
- [Raspberry Pi Zero W](https://core-electronics.com.au/raspberry-pi-zero-w-wireless.html) or [Raspberry Pi 3](https://core-electronics.com.au/raspberry-pi-3-model-b-plus.html)
- An Arduino (I used an [Arduino Leonardo](https://core-electronics.com.au/arduino-leonardo.html))
- [Edimax WiFi DOngle](https://core-electronics.com.au/edimax-wifi-adapter-ew-7811un.html) (Optional if using Raspberry Pi 3)
- 2 x [Micro USB cables](https://core-electronics.com.au/micro-usb-cable.html)
- [Micro USB Hub](https://core-electronics.com.au/usb-mini-hub-with-power-switch-otg-micro-usb.html) If using the Raspberry Pi Zero
- USB power source or Power Bank

# Getting Started
## Quick Start
The easiest and fastest way to demo this project is to download the applicable Raspberry Pi image, flash you SD and Ardunio switch it all on. You can download the images here:
- [Raspberry Pi Zero W (Coming Soon)](https://www.saphi.com.au)
- [Raspberry Pi 3 (Coming Soon)](https://www.saphi.com.au)

You can find useful instructions on flashing your Raspberry Pi [here](https://www.raspberrypi.org/documentation/installation/installing-images/). 
You will also need to flash your arduino with the `arduino-code/serial-echo.ino`. There's a good tutorial [here](https://www.arduino.cc/en/main/howto) on how to flash an Arduino with code.

Plug your Arduino's USB into the Raspberry Pi's USB port and you're ready to configure your ports. Jump to the config section.
## Setting up Your Pi from Scratch
If you want to setup your Raspberry Pi yourself or are already running a Raspberry Pi image and want to add this project to it then just follow these steps or pick and choose the steps you need.
### Setup your Pi OS
The first step is to setup your Raspberry Pi's SD with an operating system. I used the latest version of Raspbian. I recommend using [this](https://www.raspberrypi.org/documentation/installation/installing-images/) tutorial. If you are using Windows [Etcher](https://www.balena.io/etcher/) is the best tool for flashing the SD card with your downloaded Pi image.

Once your SD is imaged power up your Raspberry Pi and take it through the first time boot setup. Ensure you enable SSH in the raspi-config. I also changed the host name of my pi to `ng-embedded`.
### 
