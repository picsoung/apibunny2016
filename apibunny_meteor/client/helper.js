if(Meteor.isClient){
  Meteor.call('getRedirectUri', "foo", function(error, result){
    Session.set('redirect_uri', result);
  });
  Template.callout.helpers({
    redirect_uri: function(){
      return Session.get('redirect_uri');
    }
  });
}
