Meteor.methods({
  addMessage:function(messageObj){
    console.log("NEW MESSAGE",messageObj)
    // var newRecord = _.pick(teamObj, 'team_id','team_name','access_token','bot')
    Messages.insert(messageObj);
  },
  sendMessageToSlack:function(channel, text){
    //get team id
    var m = Messages.findOne({channel:channel,from_bot:false});
    var team = Teams.findOne({team_id:m.team});
    console.log(team.bot);
    var options = {
      as_user: true
    }
    var token = team.bot.bot_access_token;

    SlackAPI.chat.postMessage(token, channel, text,options, function(err,res){
      console.log(err,res)
      if(res.ok){
        var msgObject = {
          from:team.bot.bot_user_id,
          to: m.from,
          team: m.team,
          channel: channel,
          time: (Date.now()/1000).toString(),
          text: text
        }
        Meteor.call('addMessage',msgObject);
      }
    })
  }
});
