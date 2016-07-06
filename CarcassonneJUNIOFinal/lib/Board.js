/////////////////////////////
//      CELL OBJECT        //
/////////////////////////////

// cell constructor, the cell is initialized without tile
Cell = function(x, y){
    this.tile = null;
    this.x = x;
    this.y = y;
}

/////////////////////////////
//      BOARD OBJECT       //
/////////////////////////////

HORIZONTAL_MAXSIZE = 100;
VERTICAL_MAXSIZE = 100;

Board = function(){
    this.cells = initializeBoard();
    this.treesCollection = new TreesCollection();
    // Initialize treesCollection
    t = new Tile(19, 2);
    this.treesCollection.insertTile(t, {x:49,y:49}, null);
    // this field is an array of cells
    // in which we may have a posibility
    // to put a tile if it matches
    this.availableCells = getAvailableCells(this);
}

// This function inserts a tile on the
// given coordinates with a given orientation
// coor: [xx,yy] --> e.g [4,52]
// dummy: object or null
Board.prototype.insertTile = function(tile, coor, dummy){
    var data = null;
    this.cells[coor[0]][coor[1]].tile = tile;
    // Update availableCells
    this.availableCells = getAvailableCells(this);

    // Update treesCollection
    data = this.treesCollection.insertTile(tile, {x:coor[0],y:coor[1]}, dummy);

    return data;
}

// this function returns an array
// of arrays of cells in which, the given tile,
// fits, for each rotation
// allMatchingCells: [[matchingCells for Rot0],
//                    [matchingCells for Rot3],
//                    [matchingCells for Rot2],
//                    [matchingCells for Rot3]]
Board.prototype._getAllMatchingCells = function(tile){
    var allMatchingCells = [];
    for(var i=0; i<4; i++){
        var tempTile = new Tile(tile.type, i);
        var matchingCells = this.getMatchingCells(tempTile);
        allMatchingCells.push(matchingCells);
        //console.log("MATCHINGCELLS: " + matchingCells);
    }
    return allMatchingCells;
}

// this function returns an array
// of cells in which, the given tile,
// fits
Board.prototype.getMatchingCells = function(tile){
    var matchingCells = [];
    var that = this;
    this.availableCells.forEach(function(elem, index){
        var coor = [elem.x, elem.y];
        if(itFits(that, tile, coor)){
            if(!isInArray(elem, matchingCells))
                matchingCells.push(elem);
        }
    });
    return matchingCells;
}


Board.prototype.getFinalCount = function(){
    return this.treesCollection.getFinalCount();
}

var isInArray = function(value, array){
  return array.indexOf(value) > -1;
}

var initializeBoard = function(){
    var cells = [];
    for(var i=0;i<HORIZONTAL_MAXSIZE;i++){
        var column = [];
        for(var j=0;j<VERTICAL_MAXSIZE;j++){
            column.push(new Cell(i, j));
        }
        cells.push(column);
        column = [];
    }
    // Insert the initial tile on the board
    var t = new Tile(19, 2);
    cells[49][49].tile = t;
    return cells;
}

// this this function returns an array of cells
// in which we may have a posibility
// to put a tile if it matches
var getAvailableCells = function(board){
    var availableCells = [];
    var haveTile = false;
    var emptyCell = true;
    var cell = null;
    var availableCell = null;
    for(var i=0;i<HORIZONTAL_MAXSIZE;i++){
        for(var j=0;j<VERTICAL_MAXSIZE;j++){
            cell = board.cells[i][j];
            if(checkCell(cell, haveTile, emptyCell)=='previous'){
                availableCells.push(board.cells[i][j-1]);
                haveTile = true;
                emptyCell = false;
            }else if(checkCell(cell, haveTile, emptyCell)=='current'){
                availableCells.push(board.cells[i][j]);
                haveTile = false;
                emptyCell = true;
            }
        }
    }
    for(var j=0;j<VERTICAL_MAXSIZE;j++){
        for(var i=0;i<HORIZONTAL_MAXSIZE;i++){
            cell = board.cells[i][j];
            if(checkCell(cell, haveTile, emptyCell)=='previous'){
                availableCells.push(board.cells[i-1][j]);
                haveTile = true;
                emptyCell = false;
            }else if(checkCell(cell, haveTile, emptyCell)=='current'){
                availableCells.push(board.cells[i][j]);
                haveTile = false;
                emptyCell = true;
            }
        }
    }
    return availableCells;
}

// this function returns the cell if
// we may have a posibility
// to put on it a tile in
// otherwise returns null
var checkCell = function(cell, haveTile, emptyCell){
    if(cell.tile){
        if(emptyCell){
            // insert the previous cell
            return 'previous';
        }
    }else if(!cell.tile){
        if(haveTile){
            // insert the current cell
            return 'current';
        }
    }

    return null;
}

// this function returns true if a given tile,
// with the current orientation,
// can fit in a cell on the given board by
// checking the coordinates
// coor: [xx,yy] --> e.g [4,52]
var itFits = function(board, tile, coor){
    var fits = false;
    // this array contains the cells with which
    // we are going to check if the tile fits
    // testableCells = [northCell, eastCell, southCell, westCell]
    var testableCells = getTestableCells(board, coor);
    // console.log("testableCells:");
    // console.log(testableCells);
    // Now we walk the array checking if the tile
    // fits or not
    for (var i = 0; i< testableCells.length; i++){
        // the elem is a cell object
        if(testableCells[i].tile){
            // this array contains the two zones we have to compare
            // zones[0] -> zone of the current tile
            // zone[1] -> zone of the board tile
            var zones = getZones(tile, testableCells[i], i);
            if(zones[0]==zones[1]){
                fits = true;
            }else{
                fits = false;
                return false;
            }
        }
    }
    return fits;
}


// this function returns an array containing
// the cells with which we have to check if
// a tile fits
// testableCells = [northCell, eastCell, southCell, westCell]
var getTestableCells = function(board, coor){
    var testableCells = [];

    var northCell = board.cells[coor[0]][coor[1]-1];
    testableCells.push(northCell);
    var eastCell = board.cells[coor[0]+1][coor[1]];
    testableCells.push(eastCell);
    var southCell = board.cells[coor[0]][coor[1]+1];
    testableCells.push(southCell);
    var westCell = board.cells[coor[0]-1][coor[1]];
    testableCells.push(westCell);

    return testableCells;
}

// this function returns an array containing
// the two zones we have to compare
var getZones = function(tile, elem, index){
    // testableCells = [northCell, eastCell, southCell, westCell]
    // for index=0 -> we have to compare tile.positions.n->elem.tile.positions.s
    // for index=1 -> we have to compare tile.positions.e->elem.tile.positions.w
    // ...
    switch (index) {
      case 0:
        var zone1 = tile.positions.n;
        var zone2 = elem.tile.positions.s;
        break;
      case 1:
        var zone1 = tile.positions.e;
        var zone2 = elem.tile.positions.w;
        break;
      case 2:
        var zone1 = tile.positions.s;
        var zone2 = elem.tile.positions.n;
        break;
      default:
        var zone1 = tile.positions.w;
        var zone2 = elem.tile.positions.e;
        break;
    }
    return [zone1, zone2];
}

/////////////////////////////////////
// DUMMY POSITIONS SET OF FUNCTIONS//
/////////////////////////////////////

var getType = function (zone, tile) {
    switch (zone) {
        case 'n':
            var type = tile.positions.n;
            break;
        case 'wn':
        case 'nw':
            var type = tile.positions.nw;
            break;
        case 'w':
            var type = tile.positions.w;
            break;
        case 'ws':
        case 'sw':
            var type = tile.positions.sw;
            break;
        case 's':
            var type = tile.positions.s;
            break;
        case 'es':
        case 'se':
            var type = tile.positions.se;
            break;
        case 'e':
            var type = tile.positions.e;
            break;
        case 'en':
        case 'ne':
            var type = tile.positions.ne;
            break;
        default:
            throw "Tree type not found";
    }
    return type;
}

//Returns the area in which a given concrete tile zone is included.

var arrayContains = function (array, element) {
   for (var i = 0; i < array.length; i++) {
       if (array[i] == element) return true;
   }
   return false;
}

var convert = function (zone) {
    switch (zone) {
        case 'wn':
        case 'nw':
            return ['nw', 'wn'];
        case 'en':
        case 'ne':
            return ['ne', 'en'];
        case 'es':
        case 'se':
            return ['se','es'];
        case 'ws':
        case 'sw':
            return ['ws', 'sw'];
        default:
            return [zone];
    }
}

//Returns a concrete area between a group of them
//where a given zone is contained.

var getZoneArea = function (areas, zone) {
    for (var type in areas) {
        for (var i = 0; i < areas[type].length; i++) {
            for (var j = 0; j < zone.length; j++) {
                if (arrayContains(areas[type][i], zone[j])) {
                    return areas[type][i];
                }
            }
        }
    }
    return null;
}

//Returns only trees corresponding to neighbor areas

var getNeighborTrees = function (tile, coord, zone, trees) {
    if (tile != null) {
        var areas = getAreasTile(tile.type, tile.orientation);
        var newZone = convert(zone);
        var zoneArea = getZoneArea(areas, newZone);
        return findTreesNeed(coord, zoneArea, trees);
    } else {
        return [[]];
    }
}

//Get trees surrounding the given tile in the given coord.
//Adapted corner zones to the TreeStructure_v2.js format:
//      Example:    nw ==> [nw, wn]
//This adaptation is made to totally comprehend the complete
//puntuation zone for a dummy.

var getAllTrees = function (treesCollection, tile, coord) {
    var trees = [];
    var zones = [['n'], ['nw', 'wn'], ['w'], ['sw', 'ws'], ['s'],
                ['se', 'es'], ['e'], ['ne', 'en']];
    for (var i = 0; i < zones.length; i++) {
        var subzones = zones[i];
        var auxTrees = [];
        for (var j = 0; j < subzones.length; j++) {
            var childData = getCoordAndZoneChild(coord, subzones[j]);
            var childCoord = childData.coord;
            var treeType = getType(subzones[j], tile);
            var allTrees = treesCollection.getTrees([treeType], childCoord);
            var finalTrees = getNeighborTrees(tile, coord, subzones[j], allTrees);
        }
        trees.push({zone: zones[i], trees: finalTrees});
    }
    return trees;
}

var objectToArray = function (object) {
    var array = [];
    for (var key in object) {
        array.push(object[key]);
    }
    return array;
}

//Get free trees and their corresponding zones.
//Where a free tree is one that doesn't have any
//dummy in it.

var getFreeSubZones = function (trees) {
    for (var j = 0; j < trees.length; j++) {
        if (trees[j].length !== 0) {
            var subtrees = trees[j];
            if (subtrees.dummies.length != 0) {
                return false;
            }
        }
    }
    return true;
}

//Blocks a group of zones that conform a given area

var blockArea = function (zones, zoneTrees, area) {
    for (var j = 0; j < zoneTrees.length; j++) {
        for (var k = 0; k < zoneTrees[j].zone.length; k++) {
            if (arrayContains(area, zoneTrees[j].zone[k])) {
                zones[j] = false;
            }
        }
    }
}

var getFreeZones = function (tile, zoneTrees) {
    var freeZones = objectToArray(tile.dummies);
    var allAreas = getAreasTile(tile.type, tile.orientation);
    for (var i = 0; i < zoneTrees.length; i++) {
        if (freeZones[i]) {
            if (!getFreeSubZones(zoneTrees[i].trees)) {
                var area = getZoneArea(allAreas, zoneTrees[i].zone);
                blockArea(freeZones, zoneTrees, area);
            }
        }
    }
    return freeZones;
}

//For every orientation ('group'), it access
//every possible cell to add the possible dummy locations.
//Format: [[{cell: Cell1 for Rot0, dummyPos: DummyPos},
//          {cell: Cell2 for Rot0, dummyPos: DummyPos}, ...],
//        [{cell: Cell1 for Rot1, dummyPos: DummyPos},
//          {cell: Cell2 for Rot1, dummyPos: DummyPos}, ...],
//        [{cell: Cell1 for Rot2, dummyPos: DummyPos},
//          {cell: Cell2 for Rot2, dummyPos: DummyPos}, ...],
//        [{cell: Cell1 for Rot3, dummyPos: DummyPos},
//          {cell: Cell2 for Rot3, dummyPos: DummyPos}, ...]]
//  Coords will be in format [x, y]
//  DummyPos will be in format [true, true, false, ...]
//  Corresponding to the different dummy possitions.

Board.prototype.getDummyPositions = function (tile) {
    var cells = this._getAllMatchingCells(tile);
    var newArray = [];
    for (var i = 0; i < cells.length; i++) {
        var group = cells[i];
        var newGroup = [];
        var auxTile = new Tile(tile.type, i);
        for (var j = 0; j < group.length; j++) {
            var cell = group[j];
            var coord = {x: cell.x, y: cell.y};
            var zoneTrees = getAllTrees(this.treesCollection, auxTile ,coord);
            var freeZones = getFreeZones(auxTile, zoneTrees);
            newGroup.push({cell: cell, dummyPos: freeZones});
        }
        newArray.push(newGroup);
    }
    return newArray;
}


var main = function(){
    var b = new Board();

    /*var d = new Dummy(1, 1);
    d.place([49,48], 'n');
    var t = new Tile(20, 1);
    b.insertTile(t, [49,48], d);

    var t = new Tile(21, 0);
    var pos = b.getDummyPositions(t);
    console.log(pos[0]);
    console.log(pos[1]);
    console.log(pos[2]);
    console.log(pos[3]);*/
    /*var d = new Dummy(1, 1);
    d.place([49,49], 'n');
    var t = new Tile(13, 2);
    b.insertTile(t, [49,49], d);


    var d = new Dummy(2, 1);
    d.place([49,50], 'w');
    var t = new Tile(14, 0);
    b.insertTile(t, [49,50], d);


    var d = new Dummy(3, 1);
    d.place([49,51], 's');
    var t = new Tile(15, 0);
    b.insertTile(t, [49,51], d);


    var d = new Dummy(2, 2);
    d.place([50,51], 'e');
    var t = new Tile(20, 0);
    b.insertTile(t, [50,51], d);


    var t = new Tile(1, 0);
    b.insertTile(t, [50,50], null);

    var d = new Dummy(3, 2);
    d.place([50,49], 's');
    var t = new Tile(7, 0);
    b.insertTile(t, [50,49], d);


    console.log("*********************************");
    console.log("*********************************");
    console.log("*********************************");
    console.log("*********************************");
    console.log("*********************************");
    console.log("*********************************");
    console.log("*********************************");
    console.log("*********************************");
    console.log("*********************************");


    var data = b.getFinalCount();


    for(var i=0; i<data.playersPoints.length; i++){
        console.log("Player: " + data.playersPoints[i][0] + "\t" + "Points: " + data.playersPoints[i][1]);
    }*/
}



//main();
