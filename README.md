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

Once your SD is imaged power up your Raspberry Pi and take it through the first time boot setup. The easiest way to do this is plug your Pi into a tv, connect the USB hub with a mouse, keyboard and wifi dongle. Ensure you enable SSH in the raspi-config. I also changed the host name of my pi to `ng-embedded`. Connect the WiFi dongle (will appear as wlan1) to your home wifi network. 

Once your Raspberry Pi is connected to your network you can SSH into it from your computer. It's easier to continue the rest of the setup from this point forward on your computer. You can see how to connect to your Pi via SSH here: [Connect to Raspberry Pi vis SSH](https://www.raspberrypi.org/documentation/remote-access/ssh/)
### Configure Pi as Wireless AP
Now we have our Pi up and running we want to enable the ability to connect to it directly from our computer or smart phone without an external network. The following instructions are modified from the [Ardupilot Docs on Mavlink WiFi Bridge] (http://ardupilot.org/dev/docs/making-a-mavlink-wifi-bridge-using-the-raspberry-pi.html). To setup up the Pi as an AP follow these steps:
#### Make sure your Pi is up to date then install **hostapd** and **isc-dhcp-server**
```
sudo apt-get update
sudo apt-get install hostapd isc-dhcp-server
```
**NOTE**: You may seem some errors after install but ignore them for now

#### Configure the DHCP sever 
Open the config file
```
sudo nano /etc/dhcp/dhcpd.conf
```
and comment out the option domain name lines as follows
```
#option domain-name "example.org";
#option domain-name-servers ns1.example.org, ns2.example.org;
```
Also enable the authoritive setting
```
# If this DHCP server is the official DHCP server for the local
# network, the authoritative directive should be uncommented.
authoritative;
```
At the end of this file add the following lines:
```
subnet 192.168.42.0 netmask 255.255.255.0 {
    range 192.168.42.10 192.168.42.50;
    option broadcast-address 192.168.42.255;
    option routers 192.168.42.1;
    default-lease-time 600;
    max-lease-time 7200;
    option domain-name "local";
    option domain-name-servers 8.8.8.8, 8.8.4.4;
}
```
Press **Control-X** then **Y** then **Enter** to save the edited config file.
#### Configure ISC network interfaces
Open the DHCP server file
```
sudo nano /etc/default/isc-dhcp-server
```
and change the INTERFACESv4 line like so:
```
INTERFACESv4="wlan0"
```
#### Setup wlan0 as Static
We need to congfigure a static IP for the AP so we know what to it.
