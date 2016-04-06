var Botkit = require('botkit');
var Q = require('q');
var request = Q.denodeify(require("request"));
require('dotenv').config();
var express = require('express');

var app = express()

var DDPClient = require("ddp");

var DDPlogic = function(){
  var ddpclient = new DDPClient({
    host : process.env.DDP_HOST,
    port : process.env.DDP_PORT,
    autoReconnect : true,
    ddpVersion : '1'
  });

  var controller = Botkit.slackbot({
    debug: false
  });

  ddpclient.connect(function(error, wasReconnect) {
    if (error) {
      console.log('DDP connection error!');
      return;
    }
    if (wasReconnect) {
      console.log('Reestablishment of a connection.');
    }
    console.log('connected!');

    ddpclient.subscribe(
      'teams',                  // name of Meteor Publish function to subscribe to
      [],                       // any parameters used by the Publish function
      function () {             // callback when the subscription is complete
        console.log('teams complete:');
        console.log(ddpclient.collections.teams);
      });

    var observer = ddpclient.observe("teams");
    observer.added = function(id) {
      console.log("[ADDED] to " + observer.name + ":  " + id);
      var oldValue = ddpclient.collections.teams[id]
      newController(oldValue.bot.bot_access_token)
    };

    observer.changed = function(id, oldFields, clearedFields, newFields) {
      console.log("[CHANGED] in " + observer.name + ":  " + id);
      console.log("[CHANGED] old field values: ", oldFields);
      console.log("[CHANGED] cleared fields: ", clearedFields);
      console.log("[CHANGED] new fields: ", newFields);
      // if(typeof newFields.bot != "undefined"){
      //   var oldValue = ddpclient.collections.teams[id]
      //   newController(oldValue.bot.bot_access_token)
      // }
    };
    observer.removed = function(id, oldValue) {
      console.log("[REMOVED] in " + observer.name + ":  " + id);
      console.log("[REMOVED] previous value: ", oldValue);
    };

    var newController = function(token,team_id){
      controller.spawn({
        token: token,
      }).startRTM()
    }
  });

  controller.hears('(.*)',['direct_mention','mention'],function(bot,message){
    var content="Hi <@"+message.user+">, \n I am a bit shy, come talk to me in *private* :wink: \n Click here <@"+bot.identity.name+">."

    var reply_with_attachments = {
      'username':"APIbunny",
      'text': content,
      'icon_emoji': ":rabbit:"
    }
    bot.reply(message,reply_with_attachments);
  })

  // give the bot something to listen for.
  controller.hears('(.*)',['direct_message'],function(bot,message) {
    getUsername(bot,this.config.token,message.user).then(function(username){
      message.username = username
    }).then(function(){
      console.log(message);
      var text = message.text;
      var URL = "https://aiaas.pandorabots.com/talk/1409612500244/apibunny?"
      URL += "input="+text.replace("?","")
      URL += "&user_key="+process.env.PANDORABOT_KEY
      URL += "&client_name="+message.user.toLowerCase()

      var msgObject = {
        from: message.user,
        from_username: message.username,
        from_bot: false,
        to: bot.identity.id,
        to_username: bot.identity.name,
        team: message.team,
        channel: message.channel,
        time: message.ts,
        text: message.text
      }
      // Log message on Meteor app
      addMessage(msgObject)

      var options = {
        method: "POST",
        json: true,
        url:URL,
        headers:{
          "Content-Type":"application/json",
          "Accept":"application/json"
        }
      }
      var response = request(options)

      return response.then(function(res,err){
        if(res[0].statusCode == 200){
          var data = res[0].body
          //Replace extra break lines added by pandorabots
          var content = data.responses[0].replace(/\n\s*\n/g, '\n').replace(/  +/g," ");

          msgObject = {
            from: bot.identity.id,
            from_username: bot.identity.name,
            from_bot: true,
            to: message.user ,
            to_username: message.username,
            team: message.team,
            channel: message.channel,
            time: (Date.now()/1000).toString(),
            text: content
          }
          addMessage(msgObject)

          var attachment=""
          if(content.indexOf('is safe')!=-1){ //special message when win
            attachment = {
                "fallback": "Happy Easter",
                "color": "#36a64f",
                "text":"",
                "title": "Congrats! Tweet about it",
                "title_link": "https://twitter.com/intent/tweet?text=I%20mastered%20%23APIbunny%202016%2C%20try%20it%20too%20http%3A%2F%2Fapibunny.com%20%403scale",
                "image_url": "http://apibunny.com/img/opengraph.png",
                "thumb_url": "http://apibunny.com/img/opengraph.png"
            }
          }
          var reply_with_attachments = {
            'username':"APIbunny",
            'text': content,
            'icon_emoji': ":rabbit:",
            'attachments':[attachment]
          }
          bot.reply(message,reply_with_attachments);
        }
      })
    })
  });

  var addMessage = function(msg){
      ddpclient.call(
        'addMessage',             // name of Meteor Method being called
        [msg],            // parameters to send to Meteor Method
        function (err, result) {   // callback which returns the method call results
          // console.log('called function, result: ' + result);
        },
        function () {              // callback which fires when server has finished
          console.log('addmessage updated');  // sending any updated documents as a result of
        }
      );
  }

  var updateUserData = function(userdata){
    ddpclient.call(
      'updateUserData',             // name of Meteor Method being called
      [userdata],            // parameters to send to Meteor Method
      function (err, result) {   // callback which returns the method call results
        // console.log('called function, result: ' + result);
      },
      function () {              // callback which fires when server has finished
        console.log('updateUserData updated');  // sending any updated documents as a result of
      }
    );
  }

  var getUsername = function(bot,token,user_id){
    var getUserInfo = Q.denodeify(bot.api.users.info)
    var pr = getUserInfo({token:token,user:user_id})

    return pr.then(function(infos){
        updateUserData(infos.user)
        return infos.user.name
    })
  }
}


var port = process.env.PORT || 3000;
app.listen(port, function(req,res) {
  console.log("Launched on "+port)
  DDPlogic()
})
