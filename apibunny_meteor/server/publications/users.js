Meteor.publish("users", function(argument){
  return Meteor.users({});
});
