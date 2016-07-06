/////////////////////////////
//    IA PLAYER OBJECT     //
/////////////////////////////

// IA Player inherits from Player class
// IAplayer is an abstract class



IAplayer = function () {
    Player.call(this, 0);

    if (this.constructor === IAplayer) {
        throw new Error("Can't instantiate abstract class");
    }
}

/*
    This function must return:
    {
        coord: [x, y]       where the tile is placed
        dummy : Dummy       the dummy placed, if it, else null.
    }
 */

IAplayer.prototype.playTile = function() {
    throw new Error("Abstract method");
};

// IAplayer class extends Player
IAplayer.prototype = Object.create(IAplayer.prototype);
IAplayer.prototype.constructor = IAplayer;


/////////////////////////////////
//    IA PLAYER FIRST MODE     //
/////////////////////////////////

// Constructor of the first IA Player mode
// Inherits from IAplayer abstract class
FirstMode = function () {
    IAplayer.call(this);
}

// FirstMode class extends IAplayer
FirstMode.prototype = Object.create(IAplayer.prototype);
FirstMode.prototype.constructor = FirstMode;

// Gets possible positions in the board and then it
// just assigns the tile to the first possition it finds
// (If for a given orientation there are no possible positions
// it tries with a new orientation of the tile)
playTile1 = function (game) {
    var cells = game.board.getDummyPositions(game.tiles.currentTile);
    var coor ;
    for ( var i = 0 ; i < cells.length ; i++) {
        if (cells[i].length != 0) {
            coor = cells[i][0].cell ;
            break ;
        }
        game.board.tiles.currentTile.turnTile() ;
    }

    var data = {
        coord : coor,
        dummy : null
    }

    return data ;
}


/////////////////////////////////
//    IA PLAYER SECOND MODE     //
/////////////////////////////////

/*
    If has dummies check the longest available zone and inserts the tile with the dummy.
    If has no dummies , inserts the tile to a zone with one of his dummies.

    Only checks the city and road zones, field zones dont give much points and its
    almost sure you wont recover the dummy placed there.
*/

playTile2 = function (game) {

    var me = game.players.currentPlayer ;
    var move = null ;
    var dummy = me.getNewDummy() ;
    var tile = game.tiles.currentTile ;

    if ( dummy )
        move = playWithDummy(game) ;

    if ( !move )
        move =  playWithoutDummy(game) ;

    if ( !move )
        move = placeAnywhere(game) ;


    tile.orientation = move.rot ;

    if ( move.dummyPos != null ){
        dummy.coord = move.coord ;
        dummy.position = move.dummyPos ;
    }else{
        dummy = null ;
    }

    var tmp = {
        coord : move.coord ,
        dummy : dummy ,
        rot : move.rot
    }

    return tmp ;

}


// Finds a tree where is placed one of my dummies and adds the tile.
var playWithoutDummy = function(game) {
        var zones = zoneTypes(game.tiles.currentTile) ;
        var trees = getMyTrees(game , zones) ;

        if (trees.length == 0)
            return null ;

        var allCoords = game.board.getDummyPositions(game.tiles.currentTile) ;

        while( trees.length > 0 ){
            var tree = trees.splice(0,1)[0] ;
            var treeCoords = tree.getLeftCoords() ;

            for ( var i = 0 ; i < treeCoords.length ; i++ ){
                var coord = Object.keys(treeCoords[i]).map(function (key) {return treeCoords[i][key]});

                var tmpMove = {
                        coord: null ,
                        dummyPos: [false, false, false, false, false, false, false, false, false ] ,
                        rot: null  } ;

                tmpMove.rot = validMove(tmpMove , allCoords) ;
                if ( tmpMove.rot){
                    tmpMove.coord = coord ;
                    return tmpMove ;
                }
            }
        }

        return null ;
}

// Finds the longest available free tree and the places a dummy there.
var playWithDummy = function(game) {

    var zones = zoneTypes(game.tiles.currentTile) ;
    var trees = getFreeTrees(game , zones) ;
    var allCoords = game.board.getDummyPositions(game.tiles.currentTile) ;

    while(trees.length > 0 ){
            var treeIndex = longestTree(trees);
            var tree = trees.splice(treeIndex,1)[0] ;   // Pops from the array treeIndex
            var treeCoords = tree.getLeftCoords() ;     // Coordenadas como objetos.

            for ( var i = 0 ; i < treeCoords.length ; i++){
                    var coord = Object.keys(treeCoords[i]).map(function (key) {return treeCoords[i][key]});

                    var tmpMove = {
                            coord: null ,
                            dummyPos: [false, false, false, false, false, false, false, false, false ],
                            rot: null  } ;


                    tmpMove.coord = coord ;
                    tmpMove.rot = validMove(tmpMove , allCoords) ;
                    if (tmpMove.rot){
                            tmpMove.dummyPos = getDummyPos(coord , tree , null) ;
                            return tmpMove ;
                    }
            }
    }

    for ( var i = 0 ; i < allCoords.length ; i++){
            for ( var j = 0 ; j < allCoords[i].length ; j++) {
                    var move = allCoords[i][j] ;

                    var tmpMove = {
                            coord: null ,
                            dummyPos: [false, false, false, false, false, false, false, false, false ] ,
                            rot: null  } ;


                    tmpMove.coord = [ move.cell.x , move.cell.y ];
                    tmpMove.rot = validMove(tmpMove , allCoords) ;
                    if (tmpMove.rot){
                            var tile = game.tiles.currentTile ;
                            tile.orientation = tmpMove.rot ;
                            tmpMove.dummyPos = getDummyPos(coord , null , tile ) ;

                            if (!tmpMove.dummyPos)
                                continue ;


                            return tmpMove ;
                    }
            }
    }
    return null ;
}

var placeAnywhere = function(game){
    var cells = game.board.getDummyPositions(game.tiles.currentTile);
    var r = 0 ;
    var coor ;
    for ( var i = 0 ; i < cells.length ; i++) {
        if (cells[i].length != 0) {
            coor = cells[i][0].cell ;
            r = i ;
            break ;
        }
        game.board.tiles.currentTile.turnTile() ;
    }

    var data = {
        coord : [coor.x, coor.y],
        dummy : null,
        rot : r
    }

    return data ;
}

// return the type of zones in a tile.
var zoneTypes = function(tile) {
    var c = false ;
    var r = false ;
    var f = false ;
    var zones = new Array() ;
    var poss = predefTiles[tile.type].positions ;
    for (var i = 0 ; i < poss.length ; i++){
        switch (predefTiles[tile.type].positions[i]){
            case 'ci':
                if ( c == false ) {
                    c = true ;
                    zones.push(poss[i]) ;
                }
                break ;
            case 'r':
                if ( r == false) {
                    r = true ;
                    zones.push(poss[i]) ;
                }
                break ;
            case 'f' :
                if ( f == false) {
                    f = true ;
                    zones.push(poss[i]) ;
                }
        }
    }
    return zones ;
}

// Returns the index in the array of the longest tree in given array of trees.
var longestTree = function(trees){
    if ( trees.length == 0 ){
        return null ;
    }

    var maxLength = 0 ;
    var tree = 0 ;

    for ( var i = 0 ; i < trees.length ; i++ ) {
        var l = trees[i].getNumOfTiles()
        if ( l > maxLength){
            maxLength = l ;
            tree = i ;
        }
    }
    return tree ;
}

//returns the free trees ( with no dummy) for given zones ( city or road, field
// and cloister are not given )
var getFreeTrees = function (game, zones) {
    var trees = game.board.treesCollection.trees ;
    var outTrees = new Array() ;
    for ( var i = 0 ; i < zone.length ; i ++){
        if ( zones[i] === "r"){
            outTrees = outTrees.concat(trees.roadTrees) ;
            continue ;
        }
        if ( zones[i] === "ci"){
            outTrees = outTrees.concat(trees.cityTrees) ;
            continue ;
        }
    }

    // Removes the trees with dummies
    for ( var i = 0 ; i < outTrees.length ; i++) {
        if (outTrees[i].dummies.length != 0) {
            outTrees.splice(i,1) ;
        }
    }

    return outTrees ;
}

// Returns the trees in wich i have a dummy
var getMyTrees = function(game , zones) {

        var myDummies = game.players.currentPlayer.dummies ;
        var trees = game.board.treesCollection ;
        var myTrees = new Array();

        for (var i = 0 ; i < myDummies.length ; i++){
                var coord = myDummies[i].coord ;

                if(!coord)
                    continue ;

                var allTrees = trees.getTrees(zones , coord) ;
                var tree = treesWithDum( allTrees , myDummies[i] )

                if(!tree)
                    continue ;

                myTrees.push(tree);
        }
        return myTrees ;
}

// Returns the trees wich contains the given dummy
var treesWithDum = function(trees, dum){

         for ( var i = 0 ; i < trees.length ; i++){
                 for ( var j = 0 ; j < trees.dummies.length ; j++ ) {
                        if ( dum == trees.dummies[j]){
                                return trees[i];
                        }
                 }
         }
         return null ;
 }


/*
        check if move is in plausibles, returns the tile's rotation

         move = {
                coord: [x,y]
                dummyPoss = [8 true or false]coord }
        plausibles =
                        [[{coord: Cell1 for Rot0, dummyPos: DummyPos},
                          {coord: Cell2 for Rot0, dummyPos: DummyPos}, ...],
                        [{coord: Cell1 for Rot1, dummyPos: DummyPos},
                          {coord: Cell2 for Rot1, dummyPos: DummyPos}, ...],
                        [{coord: Cell1 for Rot2, dummyPos: DummyPos},
                          {coord: Cell2 for Rot2, dummyPos: DummyPos}, ...],
                        [{coord: Cell1 for Rot3, dummyPos: DummyPos},
                          {coord: Cell2 for Rot3, dummyPos: DummyPos}, ...]]
 */
var validMove = function(move, plausibles) {
        for (var i = 0 ; i < plausibles.length; i++){
                for(var j = 0 ; j < plausibles[i].length ; j++){
                        var auxCoor = { coord: [plausibles[i][j].cell.x, plausibles[i][j].cell.y] ,
                                        dummyPos : plausibles[i][j].dummyPos
                                    }
                        if( equalsMoves(move , auxCoor) ){
                                return i ;
                        }

                }
        }
        return null ;
}

/*
Move1 must be compatible with Move2.
       move = {
               coord: [x,y]
               dummyPoss = [8 true or false]coord
       } */
var equalsMoves = function ( move1, move2){
        var coord1 ;
        var coord2 ;
        var dum1 ;
        var dum2 ;
        var k = 0 ;
        for ( var i in move1){
                if ( k == 0){
                        coord1 = move1[i];
                        k++ ;
                        continue ;
                }
                if ( k == 1){
                        dum1 = move1[i];
                        k++ ;
                }
        }

        k = 0 ;
        for ( var i in move2){
                if ( k == 0){
                        coord2 = move2[i];
                        k++ ;
                        continue ;
                }
                if ( k == 1){
                        dum2 = move2[i];
                        k++ ;
                }
        }

        if ( (coord1[0] != coord2[0]) || (coord1[1] != coord2[1]) ){
                return false ;
        }

        if (dum1.length != dum2.length)
                return false ;


        for (var i = 0 ; i < dum1.length ; i++){
                if ( dum1[i] == true && dum2[i] == false){
                        return false ;
                }
        }
        return true ;
}


// Finds the dummy pos in a tile, given tree and the coord in which i want to place the tile.
// If tree is not given, looks for a zone of road or city.
// Return the array of dummy pos [ false, false ....] with true in the dummy poss.
var getDummyPos = function(coord , tree , tile){
    var zones = [ "n",    "nw",   "w",   "sw",   "s",  "se",   "e",   "ne",   "c"  ]

    if (!tree){
        var tileZones = predefTiles[tile.type].positions ;

        for ( var i = 0 ; i < tileZones.length - 1 ; i++ ){

            if (tileZones[i] == "ci"){
                return zones[(8+i-tile.orientation*2) % 8]  ;
            }

            if (tileZones[i] == "r"){
                return zones[(8+i-tile.orientation*2) % 8]
            }

        }

        return null ;
    }

    var lastPlaced = tree.getLastPlaced() ;     // Coords as objects, not arrays

    for( var i = 0 ; i < lastPlaced.length ; i++) {
        var auxCoord = [lastPlaced[i].x , lastPlaced[i].y ] ;
        var pos = relativePos(coord , auxCoord) ;

        if (!pos)
            continue ;

        switch(pos){
            case "above":
                return "s" ;
            case "under":
                return "n"
            case "left":
                return "w"
            case "right":
                return "e"
            default:
                ;
        }

    }

    return null ;
}

// Gives the coord1 position in realtion to coord2.
// coord [x , y]  ( arrays, not objects).
// If its not next to, returns null.
var relativePos = function (coord1 , coord2 ) {

    if( coord1[0] == coord2[0] ){
        if ( coord1[1] == coord2[1] - 1 ) {
            return "above"
        }
        if ( coord1[1] == coord2[1] + 1 ) {
            return "under"
        }
    }

    if ( coord1[1] == coord2[1] ){
        if ( coord1[0] == coord2[0] + 1 ) {
            return "right"
        }
        if ( coord1[0] == coord2[0] - 1 ) {
            return "left"
        }
    }
    return null ;
}


/////////////////////////////////////
//    Tests for local functions    //
/////////////////////////////////////

/*
var move11 = { coord: [1,1] , dum : [ true, false, false, false, true, true, false, false, false, true]}
var move22 = { coord: [1,1] , dum : [ true, false, false, false, true, true, false, false, false, true]}
var move33 = { coord: [1,1] , dum : [ true, false, true, false, true, true, false, false, false, true]}
var move44 = { coord: [2,1] , dum : [ true, false, false, false, true, true, false, false, false, true]}
var move55 = { coord: [2,8] , dum : [ true, false, false, false, true, true, false, false, false, true]}
var move66 = { coord: [2,2] , dum : [ true, false, false, false, true, true, false, false, false, true]}

if (equalsMoves(move11 , move22)){
        console.log("11 fits in 22 ") ;
}

if (!equalsMoves(move33 , move22)){
        console.log("33 doesnt fit in 22") ;
}

console.log(relativePos(move33.coord , move44.coord)) ;         // left
console.log(relativePos(move44.coord , move33.coord)) ;         // right
console.log(relativePos(move44.coord , move66.coord)) ;         // above
*/
