if (Meteor.isServer) {
  Meteor.methods({
    slack_getOauthToken:function(code){
      var client_id = "2186476730.28826269059"
      var client_secret = "e26f5e2b8c29159407b0ea06334a7312"
      var host =""

      if(process.env.NODE_ENV !="production"){
        host = Meteor.settings.host.dev
      }else{
        host =Meteor.settings.host.prod
      }
      var redirect_uri = host+"/slack_redirect"
      var resultAsync = SlackAPI.oauth.access(client_id, client_secret, code, redirect_uri)
      return resultAsync;
    },
    getRedirectUri:function(){
      var host
      if(process.env.NODE_ENV !="production"){
        host = Meteor.settings.host.dev
      }else{
        host = Meteor.settings.host.prod
      }
      console.log(host);
      return host+"/slack_redirect";
    }
  });
}
