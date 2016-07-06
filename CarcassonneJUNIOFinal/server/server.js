Meteor.methods({
    'startGame': function(players, gameId){
      console.log("game has been started llamamos a LOGICA");
      console.log("server players " + players)
      game = new Game(players, gameId);
      storeGame(game);
      return true
    },
});
