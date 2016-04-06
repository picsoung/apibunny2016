#APIBunny 2016 - BotKit app
![](http://apibunny.com/img/opengraph.png)

This is part of the [APIBunny](http://apibunny.com) 2016 project.

This is the BotKit app, which connects to Slack and interact with Pandorabot API to answer user's input.

It listen to the Meteor app using `DDP` to create new controller when a new team is added.
It also logs all the messages on the Messages collection.

## Configuration
You have to define following env variables
```
DDP_HOST=localhost
DDP_PORT=3000
PANDORABOT_KEY=YOURKEY
```
