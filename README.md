# AirPlop

A play off of Apple's AirDrop, AirPlop is a Node.js command line tool to transfer files from a computer running node.js to any device with a browser on your local network.
Great for getting files from a computer to a tablet or phone without the need to put it in the cloud first.

## Installation

	$ npm install airplop -g

Needs to be globally installed as it is an executable script.

## Usage

	$ airplop /path/to/file.js /another/path/to/file.txt

Then share your ip address and port for clients to download the files.
Ex. go to 192.168.1.120:1448 on the recieving devices browser.

## Notes

Node.js must be able to recieve communications through your firewall.
Transfering folders isn't supported yet.
