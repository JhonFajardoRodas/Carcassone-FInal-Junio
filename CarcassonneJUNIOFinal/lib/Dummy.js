//////////////////////
//   Dummy OBJECT   //
//////////////////////

//Attributes:
//playerId - Identifies the player it belongs to
//dummyId - Distinguishes a dummy out of the starting 7 a player has
//coord - Format: [x,y] Identifies the tile coords it's been placed in (default: null)
//position - Exact location (n,w,s,e,...) inside its tile (default: null)

Dummy = function (playerId, dummyId) {
    this.playerId = playerId;
    this.dummyId = dummyId;
    this.coord = null;
    this.position = null;
}

//place method - Assigns a tile and a position inside of it
//  to a dummy (Puts a dummy in the board)
//Coord format: [x, y]
Dummy.prototype.place = function(coord, position) {
    this.coord = coord;
    this.position = position;
};

//return method - Assings null to both a dummy's tile and its
//  position inside of it (Returns a dummy to its player's hand)
Dummy.prototype.return = function() {
    this.coord = null;
    this.position = null;
};
