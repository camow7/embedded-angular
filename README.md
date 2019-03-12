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

Plug your Arduino's USB into the Raspberry Pi's USB port and you're ready to use the app.

**NOTE**: If you want to setup up an existing Pi see the **Setting up your Pi from Scratch** section.
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
We need to congfigure a static IP for the AP so we know what to it. Shut down the wlan0 wifi and open the interfaces file
```
sudo ifdown wlan0
sudo nano /etc/network/interfaces
```
And replace the contents with the following
```
# Include files from /etc/network/interfaces.d:
source-directory /etc/network/interfaces.d
auto lo

iface lo inet loopback
iface eth0 inet dhcp

allow-hotplug wlan0
iface wlan0 inet static
  address 192.168.42.1
  netmask 255.255.255.0

allow-hotplug wlan1
iface wlan1 inet dhcp
    wpa-ssid "YOUR-SSID"
    wpa-psk "YOUR-WIFI-PASSWORD"

up iptables-restore < /etc/iptables.ipv4.nat
```
Press **Control-X** then **Y** then **Enter** to save the edited config file. Then you can bring the wifi back online
```
sudo ifconfig wlan0 192.168.42.1
```
#### Configure AP Details
Open the hostapd conf
```
sudo nano /etc/hostapd/hostapd.conf
```
and put the following lines in the file
```
# This is the name of the WiFi interface we configured above
interface=wlan0
# Use the nl80211 driver for on-board wifi for pi 3 and zero
driver=nl80211
# This is the name of the network
ssid=ngEmbedded
# Use the 2.4GHz band
hw_mode=g
# Use channel 6
channel=6
# Enable 802.11n
#ieee80211n=1
# Enable WMM
wmm_enabled=0
# Enable 40MHz channels with 20ns guard interval
#ht_capab=[HT40][SHORT-GI-20][DSSS_CCK-40]
# Accept all MAC addresses
#macaddr_acl=0
# Use WPA authentication
auth_algs=1
# Require clients to know the network name
#ignore_broadcast_ssid=0
# Use WPA2
wpa=2
# Use a pre-shared key
#wpa_key_mgmt=WPA-PSK
# The network passphrase
wpa_passphrase=raspberry
# Use AES, instead of TKIP
#wpa_pairwise=TKIP
#rsn_pairwise=CCMP
```
Press **Control-X** then **Y** then **Enter** to save the edited config file. Now we must tell hostapd to use our new config. Open the hostapd DAEMON file
```
sudo nano /etc/default/hostapd
```
and modify the DAEMON_CONF line like so
```
DAEMON_CONF="/etc/hostapd/hostapd.conf"
```
Press **Control-X** then **Y** then **Enter** to save the edited config file.
#### Bridge AP to Internet
Now we want to bridge our wlan0 AP to our wlan1 network so we can have internet access while connected to the AP. Open the sysctl.conf
```
sudo nano /etc/sysctl.conf
```
and uncomment the the IPV4 line like so
```
# Uncomment the next line to enable packet forwarding for IPv4
net.ipv4.ip_forward=1
```
Press **Control-X** then **Y** then **Enter** to save the edited config file. Apply the changes immediately by issuing the following commad
```
sudo sh -c "echo 1 > /proc/sys/net/ipv4/ip_forward"
```
Setup up the forward rules by running these 3 commands
```
sudo iptables -t nat -A POSTROUTING -o wlan1 -j MASQUERADE
sudo iptables -A FORWARD -i wlan1 -o wlan0 -m state --state RELATED,ESTABLISHED -j ACCEPT
sudo iptables -A FORWARD -i wlan0 -o wlan1 -j ACCEPT
```
So these changes apply after boot issue
```
sudo sh -c "iptables-save > /etc/iptables.ipv4.nat"
```
#### Running Everything on Boot
Start both service by issuing these commands
```
sudo service hostapd start
sudo service isc-dhcp-server start
```
then add them to your update-rc.d file via
```
sudo update-rc.d hostapd enable
sudo update-rc.d isc-dhcp-server enable
```
I had some trouble getting the the DHCP server to boot. To fix this I removed the dhcpcd5
```
sudo apt-get remove dhcpcd5
```
and added a command to force the DHCP server to run by opening the rc.local
```
sudo nano /etc/rc.local
```
and adding the following line just before the final **exit 0** line
```
sudo service isc-dhcp-server start
```
#### You're done
Now reboot the Rpi and you should see the **ngEmbedded** SSID available for connection
```
sudo reboot
```
### Install NodeJS
Issue these 3 commands to install NodeJS on your Raspberry Pi
```
curl -o node-v8.9.3-linux-armv6l.tar.gz https://nodejs.org/dist/v8.9.3/node-v8.9.3-linux-armv6l.tar.gz
tar -xzf node-v8.9.3-linux-armv6l.tar.gz
sudo cp -r node-v8.9.3-linux-armv6l/* /usr/local/
```
Confirm node and npm are installed
```
node -v
npm -v
```
You can use a different version of node by replacing the version number with your chosen version.
### Setup the code on Your Pi
Put the code onto you Pi by issuing the following command to clone the project to your `/home/pi/` directory
```
git clone https://github.com/camow7/embedded-angular.git
```
Navigate into the project directory
```
cd ./embedded-angular/embedded-angular-interface
```
and instal the npm packages for the project
```
sudo npm install --unsafe-perm
```
This takes quite while to complete (took an hour for me) and throws a few warnings but be patient.
### Configure the project to run on boot by opening the rc.local
```
sudo nano /etc/rc.local
```
and adding the following line just before the final **exit 0** line
```
su pi -c 'node /home/pi/embedded-angular/embedded-angular-interface/server.js < /dev/null &'
```
### Reboot and test
You should now be setup and ready to run the demo



