var http = require('http');
var RtmClient = require('@slack/client').RtmClient;
var sys = require('sys')
var exec = require('child_process').exec;

var token = process.env.SLACK_API_TOKEN || '';

var rtm = new RtmClient(token, {logLevel: 'debug'});
rtm.start();

var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM;

var putsCurried = function(channel) {
	return function(error, stdout, stderr) {
		sys.print('stdout: ' + stdout);
	  sys.print('stderr: ' + stderr);
	  if (error !== null) {
	    console.log('exec error: ' + error);
	  }
		rtm.sendMessage(stdout, channel, function messageSent() {
	    
		});
	}
}

rtm.on(RTM_CLIENT_EVENTS.RTM_CONNECTION_OPENED, function () {
	rtm.on(RTM_EVENTS.MESSAGE, function (message) {
		if (message.text.toLowerCase().startsWith("how do i")) {
			exec("howdoi" + message.text.toLowerCase().replace("how do i", ""), putsCurried(message.channel));
		} else {
			rtm.sendMessage("Sorry! I'm not that smart yet. Please ask your questions in the format 'How do I ___ ?'", message.channel, null)
		}
	});
});
