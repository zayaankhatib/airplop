#!/usr/bin/env node

var express		= require('express');
var fs 			= require('fs');
var path 		= require('path');
var ip 			= require('ip');
var jade 		= require('jade');
var defaults 	= require('defaults');

console.log(defaults);
/****************
** INIT EXPRESS.JS
*****************/

var app = express();
var userArgs = process.argv.splice(2);
var PORT = 1448;
var files = new Array();
var fileNames = new Array();

userArgs.forEach(function (arg) {
	if (fs.existsSync(arg) && fs.lstatSync(arg).isFile()) {
		files.push(arg);
		fileNames.push(path.basename(arg));
	}
});

if (files.length == 0) {
	console.log('No files provided.');
	//example run
	process.exit(0);
}

app.set('port', process.env.PORT||PORT);
app.set('view engine', 'jade');
// Enable css 
app.use(express.static(__dirname));

var localURL = ip.address()+':'+app.get('port');
app.get('/', function (req, res) {
	res.render(__dirname+'/templates/airplop.jade', {
		localURL: localURL,
		files: fileNames
	});
});

app.get('/download/:number', function (req, res) {
	var number = req.params.number;
	if (!isNaN(number) && number <= files.length-1) {
		res.download(files[number], path.basename(files[number]), function (err) {
			if (err) throw err;
			console.log("Transfer of'"+path.basename(files[number])+"'' complete.");
		});
	}
});

var server = app.listen(PORT, function() {
	console.log('AirPlopping at '+ip.address()+':'+app.get('port'));
});

process.on('uncaughtException', function(err) {
    if(err.errno === 'EADDRINUSE')
         console.log('This port is already in use.');
    else
         console.log(err);
    process.exit(1);
});

