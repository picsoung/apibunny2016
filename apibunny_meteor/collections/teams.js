Teams = new Mongo.Collection("teams");

var Schemas = {};

Schemas.Team = new SimpleSchema({
  access_token:{
    type: String
  },
  team_name:{
    type: String
  },
  team_id:{
    type: String
  },
  "bot.bot_user_id":{
    type: String
  },
  "bot.bot_access_token":{
    type:String
  }
})
Teams.attachSchema(Schemas.Team);
