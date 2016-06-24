var SlackNode = require('slack-node');

var Slack = function(config) {
    this.config = config;
    this.slack = new SlackNode(this.config.SLACK_TOKEN);
    this.slack.setWebhook(config.endpoint);
};

Slack.prototype.send = function (service, user, msg) {
  console.log('[Slack] sending message... [user=' + user + ', msg=' + msg + ']');
  this.slack.webhook({
    channel: this.config.channel,
    username: '[' + service + '] ' + user,
    icon_emoji: 'http://identicon.relucks.org/' + encodeURIComponent(user) + '?size=64',
    text: msg,
  }, function (err, res) {
    if (err) console.log(err);
  });
};

Slack.prototype.deleteOldPosts = function (config) {
  var LOG_RECORDING_HOURS = config.LOG_RECORDING_HOURS;
  var channelId = config.channelId;
  console.log('[Slack] deleting messages before ' + LOG_RECORDING_HOURS + ' hour(s)');

  var messages = [];
  var self = this;
  this.slack.api('channels.history', {
    channel: channelId
  }, function (err, res) {
    if (err) console.log(err);

    messages = res.messages;
    messages.forEach(function (msg) {
      var now = new Date();
      if ((now.getTime() / 1000 - msg.ts) > LOG_RECORDING_HOURS * 60 * 60 ){
        console.log('[Slack] deleting message...[ user =' + msg.username + '][text =' + msg.text + ']');
        self.slack.api('chat.delete', {
          channel: channelId,
          ts: msg.ts
        }, function (err, res) {
          if (err) console.log(err);
        });
      }
    });
  });
};

module.exports = Slack;
