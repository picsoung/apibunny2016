Router.map(function () {
  this.route('home', {
    path: '/',
    template: 'home'
  });

  this.route('home_', {
    path: '/2016',
    template: 'home',
    onBeforeAction:function(){
      this.redirect('/')
    }
  });

  this.route('slack_redirect', {
    path: '/slack_redirect',
    where: 'server',
    onBeforeAction: function(req, res){
      var token = Meteor.call('slack_getOauthToken',this.params.query.code);
      if(token.ok == true){
        Meteor.call('createTeamFromSlack',token);
        redirectURL = '/bot/install/success'
      }else{
        redirectURL = '/bot/install/failed'
      }
      this.response.writeHead(301, {'Location': redirectURL});
      this.response.end();
    }
  });

  this.route('bot.install.success', {
    path: '/bot/install/success',
    action:function(param){
      this.render('botInstallSuccess');
      this.next();
    }
  });
  this.route('bot.install.failed', {
    path: '/bot/install/failed',
    action:function(param){
      this.render('botInstallFailed');
      this.next();
    }
  });
})
