/////////////////////
//   GAME OBJECT   //
////////////////////
var turns = 72;
// args:
// players: array of all the players names
// id: ID of the current game
Game = function(playerIds, id){
    this.id = id;
    this.turns = turns - 1;
    this.suspended = false;
    this.players = new Players (playerIds);
    this.tiles = new Tiles();
    this.board = new Board();
}

Game.prototype.suspend = function () {
    this.suspended = true;
    removeGame(this.id);
}

Game.prototype.getStatus = function () {
    return {
        player: this.players.currentPlayer,
        tile: this.tiles.currentTile
    };
};

Game.prototype.nextTurn = function() {
    if (!this.suspended) {
        if (this.turns > 0) {
            try {
                this.tiles.popTile();
                while (!canBePlaced(this.tiles.currentTile, this.board)){
                    console.warn ("Replacing the next tile (Couldn't be placed)");
                    this.tiles.stack.unshift(this.tiles.currentTile);
                    this.tiles.popTile();
                }
                this.players.next();
                --this.turns;
            }catch (err) {
                return "Abort: " + err;
            }
            return "";
        } else {
            return "Game finished";
        }
    }
};

/*
 * Check if a tile can be placed in a board
 */
var canBePlaced = function(tile, board){
    var can = false;
    var matchingCells = board._getAllMatchingCells(tile);
    matchingCells.forEach(function(rotx){
        if (rotx.length > 0)
            can = true;
    });
    return can;
}
