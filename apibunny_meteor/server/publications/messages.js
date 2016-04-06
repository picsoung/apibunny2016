if (Meteor.isServer) {
  Meteor.publish("messages", function(){
    return Messages.find({});
  });

  Meteor.publish("messagesByConvo", function(convoId){
    return Messages.find({channel:convoId},{sort:{time:1}});
  });

  Meteor.publish("messagesByTeam", function(team_id){
    return Messages.find({team_id:team_id});
  });

  Meteor.publish("messagesByUser", function(user_id){
    return Messages.find({user_id:user_id});
  });
}
