Meteor.methods({
  updateUserData:function(userObj){
    var newRecord = _.pick(userObj, 'id','name','profile')
    Meteor.users.upsert({
      id: userObj.id
    },{$set: newRecord});
  }
});
