#!/usr/bin/env node

var express		= require('express');
var fs 			= require('fs');
var path 		= require('path');
var ip 			= require('ip');
var jade 		= require('jade');
var bytes 		= require('bytes');

/****************
** INIT EXPRESS.JS
*****************/

var app = express();
var userArgs = process.argv.splice(2);
var PORT = 1448;
var files = new Array();

userArgs.forEach(function (arg) {
	if (fs.existsSync(arg) && fs.lstatSync(arg).isFile()) {

		fileSizeInBytes = fs.statSync(arg)["size"];
		var file = {
			name: path.basename(arg),
			filepath: arg,
			size: bytes(fileSizeInBytes)
		}
		files.push(file);
	}
});

if (files.length == 0) {
	console.log('No files provided.');
	process.exit(0);
}

app.set('port', process.env.PORT||PORT);
app.set('view engine', 'jade');
// Enable css links for jade
app.use(express.static(__dirname));

var localURL = ip.address()+':'+app.get('port');
app.get('/', function (req, res) {
	res.render(__dirname+'/templates/airplop.jade', {
		localURL: localURL,
		files: files
	});
});

app.get('/download/:number', function (req, res) {
	var number = req.params.number;
	if (!isNaN(number) && number <= files.length-1) {
		res.download(files[number].filepath, path.basename(files[number].filepath), function (err) {
			if (err) throw err;
			console.log("Transfer of'"+path.basename(files[number].filepath)+"' complete.");
		});
	}
});

var server = app.listen(PORT, function() {
	console.log('AirPlopping at '+ip.address()+':'+app.get('port'));
});


// Catch errors where the port is already in use 
process.on('uncaughtException', function(err) {
    if(err.errno === 'EADDRINUSE')
         console.log('This port is already in use.');
    else
         console.log(err);
    process.exit(1);
});

