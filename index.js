
var extend = require('extend');
var Slack= require('./src/Slack.js');
var config = require('./config.json');

var exchanges = {
	zaif: 'Zaif',
	coincheck: 'Coincheck',
	bitflyer: 'BitFlyer',
};

for(var key in exchanges) {
	var val = exchanges[key];
	if(!config[key].enabled) continue;
	config[key].slack = extend({}, config.slack, config[key].slack);
	new require('./src/'+val+'Chat.js')(config[key]);
}

setTimeout(function() {
	console.log('I: exiting...');
	process.exit(0);
}, 4*60*60*1000);

setInterval(function(){
  if(config.slack.auto_delete_enabled){
	  console.log('I:deleting msgs...');
    var slack= new Slack(config.slack);
    slack.deleteOldPosts(config.slack);
  }
}, config.slack.LOG_RECORDING_HOURS*60*60*1000);
