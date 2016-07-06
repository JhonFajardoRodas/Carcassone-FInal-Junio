//////////////////////
//   GAMES OBJECT   //
//////////////////////

//Structure of game objects to store every game
//and differentiate the games.

gameList = [];

storeGame = function (game) {
    gameList.push(game);
};

removeGame = function (id) {
    for (var i = 0; i < gameList.length; i++) {
        if (gameList[i].id === id) {
            return gameList.splice(i,1)[0];
        }
    }
    return null;
}

findGameByID = function (id) {
    for (var i = 0; i < gameList.length; i++) {
        if (gameList[i].id === id) {
            return gameList[i];
        }
    }
    return null;
};
