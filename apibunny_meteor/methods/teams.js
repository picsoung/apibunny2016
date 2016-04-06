Meteor.methods({
  createTeamFromSlack:function(teamObj){
    var newRecord = _.pick(teamObj, 'team_id','team_name','access_token','bot')
    Teams.upsert({
      team_id: teamObj.team_id
    },{$set: newRecord});
  }
});
