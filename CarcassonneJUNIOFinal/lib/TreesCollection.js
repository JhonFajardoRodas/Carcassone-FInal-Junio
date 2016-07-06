debug = false;


/////////////////////////////
// TreesCollection OBJECT  //
/////////////////////////////

// TreesCollection constructor
TreesCollection = function(){
    this.trees = {
        fieldTrees: [],
        cityTrees: [],
        roadTrees: [],
        cloisterTrees: []
    };

    // Poinst per tile
    this.points = {
        fieldTile: 1,
        cityTile: 2,
        roadTile: 1,
        cloisterTile: 1
    }
}


// This function inserts the tile in one
// or more than one tree, depending on
// the zones of the tile.
// Also, this function returns null if 
// no tree with dummies on it has completed, 
// and returns the
// players with their additional points if 
// some tree has completed with the following
// coor: {x: 0, y: 4}
// object returned:
// {
//     playersPoints: [[Player1_ID, points],[Player2_ID, points],...],
//     dummies: [dummy1, dummy2,...]
// }
TreesCollection.prototype.insertTile = function(tile, coor, dummy){
    var data = {
        playersPoints: [],
        dummies: []
    };

    if(debug) console.log("insertTile({" + tile.type + ", " + tile.orientation + "}, [" + coor.x  + "," + coor.y + "]" + ")");
    var completedTrees = saveTileInTrees(coor, tile, this, dummy);
    if(checkCompletedTrees(completedTrees)){
        completedTrees = toArrayOfTrees(completedTrees);
        var playersPoints = computePoints(completedTrees);
        var dummies = getDummies(completedTrees);
        if(dummies.length>0){
            data.playersPoints = playersPoints;
            data.dummies = dummies;
            // console.log("Data:");
            // printPlayersPoints(data.playersPoints);
            // printDummies(data.dummies);
            // console.log("****************************");
            return data;
        }else{
            return null;
        }
    }else{
        if(debug) console.log("There is no completed tree");
        return null;
    }
}

// This function must be called at the end of the game
// and returns the final count with the following format:
// object returned:
// {
//     playersPoints: [[Player1_ID, points],[Player2_ID, points],...],
// }
TreesCollection.prototype.getFinalCount = function(){

    var data = {
        playersPoints: []
    }
    var incompTrees = getIncompTrees(this);

    // Insert all incompleted trees in a single array
    var trees = [];
    for(var treesType in incompTrees){
        for(var i=0; i<incompTrees[treesType].length; i++){
            trees.push(incompTrees[treesType][i]);
        }
    }

    // This points came from incompleted
    // cities, roads and cloisters
    var playersPoints = computePoints(trees);

    // Now we have to get the points from cities that touch
    // fields
    var fieldTrees = getFieldTrees(this);

    if(debug){
        for(var i=0; i<fieldTrees.length; i++){
            fieldTrees[i].printTree();
        }
    }

    var compCityTrees = getCompletedCities(this.trees.cityTrees);

    procFinalFieldPoints(playersPoints, fieldTrees, compCityTrees);

    // Update data object
    data.playersPoints = playersPoints;

    return data;
}


// This function adds the points, that
// each player has to increase, derived from
// they farmers (field dummies)
var procFinalFieldPoints = function(playersPoints, fieldTrees, compCityTrees){
    for(var i=0; i<fieldTrees.length; i++){
        var playersIds = getWinners(fieldTrees[i].dummies);
        var numOfCities = getTouchingCities(compCityTrees, fieldTrees[i]);
        var points = numOfCities * 3;
        processFieldPoints(playersPoints, playersIds, points);
    }
}

// This function assign the given points to a playerID and
// if the playerID is not yet in the player Points array
// it creates it and pushes it.
var processFieldPoints = function(playersPoints, playersIds, points){
    for(var i=0; i<playersIds.length; i++){
        var index = playerIdAlreadyIn(playersPoints, playersIds[i]);
        if(index>-1){
            playersPoints[index][1] += points;
        }else{
            playersPoints.push([playersIds[i], points]);
        }
    }
}


// This function returns the index of the player points
// if the player ID is alerady in playersPoints,
// otherwise returns -1
var playerIdAlreadyIn = function(playersPoints, playerId){
    var playersIds = [];
    for(var i=0; i<playersPoints.length; i++){
        playersIds.push(playersPoints[i][0])
    }

    return playersIds.indexOf(playerId);
}


// This function returns all completed city trees
// contained in the give city trees array
var getCompletedCities = function(cityTrees){
    var compCityTrees = [];
    for(var i=0; i<cityTrees.length; i++){
        if(cityTrees[i].getLeftChildren()==0){
            compCityTrees.push(cityTrees[i]);
        }
    }

    return compCityTrees;
}

// This function returns the num of completed
// cities wich are touching the given field
// tree
var getTouchingCities = function(compCityTrees, fTree){
    var count = 0;
    for(var i=0; i<compCityTrees.length; i++){
        if(areTogether(fTree, compCityTrees[i])){
            count++;
        }
    }

    return count;
}


// This function returns all field trees
// that have at least one dummy on it
// with the following format:
// fieldTrees = [tree1, tree2, ...]
var getFieldTrees = function(coll){
    var fieldTrees = [];
    var collFieldTrees = coll.trees.fieldTrees;
    for(var i=0; i<collFieldTrees.length; i++){
        if(collFieldTrees[i].dummies.length>0){
            fieldTrees.push(collFieldTrees[i]);
        }
    }
    return fieldTrees;
}

// This function return all incompleted trees
// on the board, that have at least a dummy
// on it, with the following format:
// returned object{
//      cityT: [],
//      roadT: [],
//      cloisterT: []    
// }
var getIncompTrees = function(coll){
    var incompTrees = {
        cityT: getIncompCityT(coll),
        roadT: getIncompRoadT(coll),
        cloisterT: getIncompCloistT(coll)
    }

    return incompTrees;
}


var getIncompCityT = function(coll){
    var incompCityT = [];
    var cityTrees = coll.trees.cityTrees;
    for(var i=0; i<cityTrees.length; i++){
        if(cityTrees[i].getLeftChildren()>0 && cityTrees[i].dummies.length>0){
            incompCityT.push(cityTrees[i]);
            // cityTrees[i].printTree();
            // console.log("############################################");
        }
    }

    return incompCityT;
}

var getIncompRoadT = function(coll){
    var incompRoadT = [];
    var roadTrees = coll.trees.roadTrees;
    for(var i=0; i<roadTrees.length; i++){
        if(roadTrees[i].getLeftChildren()>0 && roadTrees[i].dummies.length>0){
            incompRoadT.push(roadTrees[i]);
            // roadTrees[i].printTree();
            // console.log("############################################");
        }
    }

    return incompRoadT;
}

var getIncompCloistT = function(coll){
    var incompCloisT = [];
    var cloisterTrees = coll.trees.cloisterTrees;
    for(var i=0; i<cloisterTrees.length; i++){
        if(cloisterTrees[i].getLeftChildren()>0 && cloisterTrees[i].dummies.length>0){
            incompCloisT.push(cloisterTrees[i]);
            // console.log("############################################");
        }
    }

    return incompCloisT;
}

// This function returns all trees in wich
// a given coordenate exist and is placed.
// coord: {x:1, y:2}
// types: array of types -> format: 'f', 'ci', 'r', 'cl'
TreesCollection.prototype.getTrees = function(types, coor){
    var trees = [];
    //console.log('TYPES: ' + types);
    for(var i in types){
        switch (types[i]) {
            case 'f':
                addFieldTrees(this, trees, coor);
                break;
            case 'ci':
                addCityTrees(this, trees, coor);
                break;
            // default -> 'r'
            default:
                addRoadTrees(this, trees, coor);
                break;
        }
    }

    return trees;
}


// This function returns true if the give coord is already placed
// in, at least, one tree
TreesCollection.prototype._isPlacedInColl = function(coord){
    for(var prop in this.trees){
      for(var i in this.trees[prop]){
        if(this.trees[prop][i].isPlaced(coord))
            return true;
      }
    }
    return false;
}


///////////////////////////////
//    FOR MANAGING TREES     //
///////////////////////////////
var computePoints = function(trees){
    var playersPoints = [];
    for(var i=0; i<trees.length; i++){
        var points = getPoints(trees[i]);
        if(trees[i].dummies!=undefined && trees[i].dummies.length>0){
            // These are the players that are going
            // to increase their points
            var playersId = getPlayersId(trees[i].dummies);
            addPlayers(playersPoints, playersId);
            addPoints(playersPoints, playersId, points);
        }
    }
    return playersPoints;
}

// For debug issues
var printPlayersPoints = function(playersPoints){
    console.log("playersPoints: ");
    for(var i in playersPoints){
        console.log("\t[playerID: " + playersPoints[i][0] + ", points: " + playersPoints[i][1] + "]");
    }
}


// This function adds points to each playerID
// on a playerPoints array in wich the player
// is already in
var addPoints = function(playersPoints, playersId, points){
    for(var i=0; i<playersId.length; i++){
        for(var j=0; j<playersPoints.length; j++){
            if(playersPoints[j][0]==playersId[i]){
                playersPoints[j][1] += points;
            }
        }
    }
}

// This function add the playersId of the
// players that are not yet in the playersPoints
// array
var addPlayers = function(playersPoints, playersId){
    var playerAlreadyIn = false;
    for(var i in playersId){
        for(var j in playersPoints){
            if(playersPoints[j][0] == playersId[i]){
                playerAlreadyIn = true;
                break;
            }
        }
        if(!playerAlreadyIn){
            playersPoints.push([playersId[i],0]);
        }
    }
}

// This function returns the points
// for each type of tree (zone type)
var getPoints = function(tree){
    var numofTiles = tree.getNumOfTiles();
    var treeType = tree.type;
    var factor = 0;
    var points = 0;
    switch (treeType) {
       case 'r':
            var roadPoints = getPointsTypes().roadTile;
            points += numofTiles*roadPoints;
            break;
        case 'cl':
            var cloisterPoints = getPointsTypes().cloisterTile;
            points += numofTiles*cloisterPoints;
            break;
        // default -> 'ci'
        default:
            if(tree.getLeftChildren()==0){
                var cityPoints = getPointsTypes().cityTile;
                var bannerPoints = getPointsTypes().banner;
            }else{
                var cityPoints = getPointsTypes().incompletedCT;
                var bannerPoints = getPointsTypes().incompletedBanner;
            }
            var numOfBanners = tree.getNumOfBanners();
            points = (numofTiles*cityPoints) + (bannerPoints*numOfBanners);
            break;
    }
    return points;
}


var getPointsTypes = function(){
    var points = {
        cityTile: 2,
        incompletedCT: 1,
        banner: 2,
        incompletedBanner: 1,
        roadTile: 1,
        cloisterTile: 1
    }
    return points;
}

// This function returns an array of playesrID
// that represents all users that have a dummy
// on the given dummies array
var getPlayersId = function(dummies){
    var playersId = [];
    if(dummies.length>1){
        playersId = getWinners(dummies);
    }else if(dummies.length===1){
        playersId.push(dummies[0].playerId);
    }
    return playersId;
}


// This function returns true if on the given
// dummies array there are more than one dummy
// that belongs to more than one player
var moreThanOnePlayer = function(dummies){
    if(dummies.length>0){
        var tmpPlayer = dummies[0].playerId;
    }
    for(var i=0; i<dummies.length; i++){
        if(dummies[i].playerId!==tmpPlayer)
            return true;
        else
            tmpPlayer = dummies[i].playerId;
    }
    return false;
}


// This functino returns an array with the players Ids
// that must increase their points, based on wich player
// has the maximum number of dummies.
var getWinners = function(dummies){
    // format: [n_dummies1, n_dummies2,...]
    var playersDummies = [];
    // format: [playerId1, playerId2,...]
    var playersIds = [];
    for(var i=0; i<dummies.length; i++){
        var playerAlreadyIn = contains.call(playersIds, dummies[i].playerId);
        if(playerAlreadyIn){
            var index = playersIds.indexOf(dummies[i].playerId);
            playersDummies[index]++;
        }else{
            playersIds.push(dummies[i].playerId);
            playersDummies.push(1);
        }
    }
    // Now we get the largest value in playerDummies
    var largest = Math.max.apply(Math, playersDummies);
    var winners = [];
    for(var i=0; i<playersDummies.length; i++){
        if(playersDummies[i]===largest){
            winners.push(playersIds[i]);
        }        
    }
    
    return winners;
}

// This function returns all the dummies
// contained in the completedTrees
var getDummies = function(completedTrees){
    var dummies = [];
    for(var i=0; i<completedTrees.length; i++){
        for(var j=0; j<completedTrees[i].dummies.length; j++){
            if(!dummyAlreadyIn(dummies, completedTrees[i].dummies[j])){
                dummies.push(completedTrees[i].dummies[j]);
            }
        }
    }
    return dummies;
}

// For debug issues
var printDummies = function(dummies){
    console.log("dummies: [");
    for(var i=0; i<dummies.length; i++){
        console.log("\tdummy(playerID: " + dummies[i].playerId + 
                    ", dummyID: " + dummies[i].dummyId + 
                    ", coor: [" + dummies[i].coord + "]" +
                    ", pos: '" + dummies[i].position + "'" +
                    ")");
    }
    console.log("]");
}

var dummyAlreadyIn = function(dummies, dummy){
    for(var i=0; i<dummies.length; i++){
        if(dummy.dummyId===dummies[i].dummyId && dummy.playerId===dummies[i].playerId)
            return true;
    }
    return false;
}

// This function determine whether an array contains a value
var contains = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                var item = this[i];

                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};

var addFieldTrees = function(collection, trees, coor){
    var currentTree = null;
    for (var i=0; i<collection.trees.fieldTrees.length; i++){
        currentTree = collection.trees.fieldTrees[i];
        if(currentTree.isPlaced(coor))
            trees.push(currentTree);
    }
}

var addCityTrees = function(collection, trees, coor){
    var currentTree = null;
    for(var i=0; i<collection.trees.cityTrees.length; i++){
        currentTree = collection.trees.cityTrees[i];
        if(currentTree.isPlaced(coor))
            trees.push(currentTree);
    }
}

var addRoadTrees = function(collection, trees, coor){
    var currentTree = null;
    for(var i=0; i<collection.trees.roadTrees.length; i++){
        currentTree = collection.trees.roadTrees[i];
        if(currentTree.isPlaced(coor))
            trees.push(currentTree);
    }
}

// this function check if there is at least
// a completed Tree in the completedTrees array
var checkCompletedTrees = function(completedTrees){
    for(var i=0; i<completedTrees.length; i++){
        if(completedTrees[i].length>0)
            return true;
    }
    return false;
}

// this function turns an array of arrays of trees
// into an array of trees, and it returns it
var toArrayOfTrees = function(arrayOfArrays){
    var arrayOfTrees = [];
    for(var i=0; i<arrayOfArrays.length; i++){
        if(arrayOfArrays[i].length>0){
            for(var n=0; n<arrayOfArrays[i].length; n++){
                arrayOfTrees.push(arrayOfArrays[i][n]);
            }
        }
    }
    return arrayOfTrees;
}

// this function returns an array of completed Trees by type of zone
// completedTrees = [[completed fTrees],[completed ciTrees],[completed rTrees]];
saveTileInTrees = function(coord, tile, coll, dummy){

    var areasOfAllTypes = getAreasTile(tile.type, tile.orientation); //{f: [['se'],['sw']], r: [['s']], ci: [['n','e','w']] , cl: true/false}
    if(debug) console.log(areasOfAllTypes);
    var completedTrees = [];
    var fTrees = saveTileInTreesOfAType(areasOfAllTypes.f, true, coll.trees.fieldTrees, coord, 'f', tile, dummy);
    var ciTrees = saveTileInTreesOfAType(areasOfAllTypes.ci, true, coll.trees.cityTrees, coord, 'ci', tile, dummy);
    var rTrees = saveTileInTreesOfAType(areasOfAllTypes.r, true, coll.trees.roadTrees, coord, 'r', tile, dummy);
    var clTrees = saveTileInTreesOfAType(null, false, coll.trees.cloisterTrees, coord, 'cl', null, null);
    if(areasOfAllTypes.cl){
        var clTree = saveClTree(coord, dummy, tile, coll);
        // If clTree!=null is beacause a single tile has completed
        // the cloister Tree
        if(clTree)
            clTrees.push(clTree);
    }
    completedTrees.push(fTrees, ciTrees, rTrees, clTrees);
    
    return completedTrees;
}

// areas: eg. areasOfAllTypes.f
// treesOfType: eg. the array of field Trees
// coord: {x: 0, y: 4}
// type: 'r', 'f' or 'r'
// normalType: true/false ---> fieldTree, cityTree, roadTrees
// this function returns an array of completed Trees
saveTileInTreesOfAType = function(areas, normalType, treesOfType, coord, type, tile, dummy){
    var completedTrees = null;
    if(normalType){
        completedTrees = saveTileOfNormalType(areas, treesOfType, coord, type, tile, dummy);
    }else{
        //specialType
        completedTrees = saveTileOfSpecialType(treesOfType, coord, type);
    }

    return completedTrees;
}

// This function checks if a tree of a special type
// (e.g. "cloisterTree") needs the given coord and, 
// in that case, inserts the given coord.
// coord: {x: 0, y: 4}
// type: 'cl'
// this function returns an array of completed Trees
saveTileOfSpecialType = function(treesOfType, coord, type){
    // For now we just have one specialType -> cloisterTree
    var completedTrees = [];
    // In this case, we dont wark with treesNeed
    // because the function placeClTile() handle
    // the exception when a tree does not need the
    // coord
    for(var i=0; i<treesOfType.length; i++){
        treesOfType[i].placeClTile(coord);
        if(treesOfType[i].getLeftChildren()==0){
            // treesOfType[i].printTree();
            completedTrees.push(treesOfType[i]);
        }
    }
    return completedTrees;
}


// This function save a new cloister Tree on cloisterTrees
saveClTree = function(coord, dummy, tile, coll){
    var tree = new Tree('cl', coord, 'c', tile, dummy);
    // Now we have to place each coord, that has a tile
    // in it, around the cloister tile
    var borderingCoords = getBorderingCoords(coord);
    for(var i=0; i<borderingCoords.length; i++){
        if(coll._isPlacedInColl(borderingCoords[i])){
            tree.placeClTile(borderingCoords[i]);
        }
    }
    coll.trees.cloisterTrees.push(tree);
    // If the cloister tree is completed we have to notify it
    // by returning the current completed tree
    if(tree.getLeftChildren()==0)
        return tree;

    return null;
}

// This function, for a given coord, returns all coords
// (8 coords) arraound it
getBorderingCoords = function(coord){
    var borderingCoords = [];
    for(var x=(coord.x-1); x<(coord.x+2); x++){
        for(var y=(coord.y-1); y<(coord.y+2); y++){
            if(coord.x!=x || coord.y!=y){
                borderingCoords.push({x: x, y: y});
            }
        }
    }
    return borderingCoords;
}


// This function save a tile of a normal type: fieldTree, cityTree, roadTrees
// areas: eg. areasOfAllTypes.f
// treesOfType: eg. the array of field Trees
// coord: {x: 0, y: 4}
// type: 'r', 'f' or 'r'
// this function returns an array of completed Trees
saveTileOfNormalType = function(areas, treesOfType, coord, type, tile, dummy){
    var completedTrees = [];
    areas.forEach(function(area){
        var trees = findTreesNeed(coord, area, treesOfType);
        if (trees.length == 0){
            if(debug) console.log("NEW TREE: (" + type + ", [" + coord.x  + "," + coord.y + "],  " + area + ")");
            var newTree = new Tree(type, coord, area, tile, dummy);
            treesOfType.push(newTree);
            if(debug){
                console.log("****************************************************");
                newTree.printTree();
                console.log("****************************************************\n");
            }
        } else if (trees.length == 1){
            if(debug) console.log("ONE TREE -> tileType: " + tile.type);
            if(debug) console.log("trees[0].placeNode({" + coord.x + "," + coord.y + "}, [" + area + "], " + tile.type + ", " + dummy + ")")
            trees[0].placeNode(coord, area, tile, dummy);
            if(debug){
                console.log("****************************************************");
                trees[0].printTree();
                console.log("****************************************************\n");
            }
        } else {
            if(debug) console.log("MULTIPLE TREES");
            if(debug) console.log("trees[0].id: " + trees[0].id);
            for (var i = 1; i< (trees.length); i++){
                if(debug) console.log("trees[" + i + "].id: " + trees[i].id);
                trees[0].mergeWith(trees[i], coord, area);
                var delTree = treesOfType.indexOf(trees[i]);
                treesOfType.splice(delTree, 1);
            }
            trees[0].placeNode(coord, area, tile, dummy);
            if(debug){
                console.log("****************************************************");
                trees[0].printTree();
                console.log("****************************************************\n");
            }
        }
        // If the tree is completed, add it to completedTrees
        if(trees[0]!=undefined && trees[0].getLeftChildren()==0){
            if(type!=='f'){
                completedTrees.push(trees[0]);
                if(debug) trees[0].printTree();
            }
        }
    });
    return completedTrees;
}

// coord: {x: 0, y: 4}
// area: a part of areasOfAllTypes.f, eg. ['se'] or ['n','e','w']
// treesArray: eg. the array of field Trees
findTreesNeed = function(coord, area, treesArray){
    var trees = [];
    treesArray.forEach(function(tree){
        if (tree.existsNode(coord, area))
            trees.push(tree);
    });
    return trees;
}


//////////////////////////
//    GET AREAS TILE    //
//////////////////////////

// This is a preset method than guiven a typeTile returns all the posibles
// areas in the tile of city, road and field.
getAreasTile = function(typeTile, orientation){
    //       0    1     2     3    4     5     6     7    8     9    10    11
    zone = ['n', 'ne', 'en', 'e', 'es', 'se', 's', 'sw', 'ws', 'w', 'wn', 'nw'];
    turn = (orientation*3);
    switch(typeTile){
    case 0:
        //              n             s             e             w
        return {f:  [ [ zone[(0+turn)%12], zone[(6+turn)%12], zone[(3+turn)%12], zone[(9+turn)%12] ] ],
                // no roads, no cities:
                r:  [],
                ci: [],
                cl: true
                }
        break;
    case 1:
        return {f:  [ [ zone[(0+turn)%12], zone[(3+turn)%12], zone[(9+turn)%12], zone[(7+turn)%12], zone[(5+turn)%12] ] ],
                r:  [ [ zone[(6+turn)%12] ] ],
                ci: [],
                cl: true
                }
        break;
    case 2:
        return {f:  [],
                r:  [],
                ci: [ [ zone[(0+turn)%12], zone[(3+turn)%12], zone[(6+turn)%12], zone[(9+turn)%12] ] ],
                cl: false
                }
        break;
    case 3:
        return {f:  [ [ zone[(6+turn)%12] ] ],
                r:  [],
                ci: [ [ zone[(0+turn)%12], zone[(3+turn)%12], zone[(9+turn)%12] ] ],
                cl: false
                }
        break;
    case 4://banner
        return {f:  [ [ zone[(6+turn)%12] ] ],
                r:  [],
                ci: [ [ zone[(0+turn)%12], zone[(3+turn)%12], zone[(9+turn)%12] ] ],
                cl: false 
                }
        break;
    case 5:
        return {f:  [ [ zone[(5+turn)%12] ], [ zone[(7+turn)%12] ] ],
                r:  [ [ zone[(6+turn)%12] ] ],
                ci: [ [ zone[(0+turn)%12], zone[(3+turn)%12], zone[(9+turn)%12] ] ],
                cl: false 
                }
        break;
    case 6://banner
        return {f:  [ [ zone[(5+turn)%12] ], [ zone[(7+turn)%12] ] ],
                r:  [ [ zone[(6+turn)%12] ] ],
                ci: [ [ zone[(0+turn)%12], zone[(3+turn)%12], zone[(9+turn)%12] ] ],
                cl: false 
                }
        break;
    case 7:
        return {f:  [ [ zone[(3+turn)%12], zone[(6+turn)%12] ] ],
                r:  [],
                ci: [ [ zone[(0+turn)%12], zone[(9+turn)%12] ] ],
                cl: false 
                }
        break;
    case 8: //banner
        return {f:  [ [ zone[(3+turn)%12], zone[(6+turn)%12] ] ],
                r:  [],
                ci: [ [ zone[(0+turn)%12], zone[(9+turn)%12] ] ],
                cl: false 
                }
        break;
    case 9:
        return {f:  [ [ zone[(2+turn)%12], zone[(7+turn)%12] ], [ zone[(4+turn)%12], zone[(5+turn)%12] ] ],
                r:  [ [ zone[(3+turn)%12], zone[(6+turn)%12] ] ],
                ci: [ [ zone[(0+turn)%12], zone[(9+turn)%12] ] ],
                cl: false 
                }
        break;
    case 10: //banner
        return {f:  [ [ zone[(2+turn)%12], zone[(7+turn)%12] ], [ zone[(4+turn)%12], zone[(5+turn)%12] ] ],
                r:  [ [ zone[(3+turn)%12], zone[(6+turn)%12] ] ],
                ci: [ [ zone[(0+turn)%12], zone[(9+turn)%12] ] ],
                cl: false 
                }
        break;
    case 11:
        return {f:  [ [ zone[(0+turn)%12] ], [ zone[(6+turn)%12] ] ],
                r:  [],
                ci: [ [ zone[(3+turn)%12], zone[(9+turn)%12] ] ],
                cl: false 
                }
        break;
    case 12: //banner
        return {f:  [ [ zone[(0+turn)%12] ], [ zone[(6+turn)%12] ] ],
                r:  [],
                ci: [ [ zone[(3+turn)%12], zone[(9+turn)%12] ] ],
                cl: false 
                }
        break;
    case 13:
        return {f:  [ [ zone[(3+turn)%12], zone[(6+turn)%12] ] ],
                r:  [],
                ci: [ [ zone[(0+turn)%12] ], [ zone[(9+turn)%12] ] ],
                cl: false 
                }
        break;
    case 14:
        return {f:  [ [ zone[(3+turn)%12], zone[(9+turn)%12] ] ],
                r:  [],
                ci: [ [ zone[(0+turn)%12] ], [ zone[(6+turn)%12] ] ],
                cl: false 
                }
        break;
    case 15:
        return {f:  [ [ zone[(3+turn)%12], zone[(6+turn)%12], zone[(9+turn)%12] ] ],
                r:  [],
                ci: [ [ zone[(0+turn)%12] ] ],
                cl: false 
                }
        break;
    case 16:
        return {f:  [ [ zone[(3+turn)%12], zone[(5+turn)%12], zone[(10+turn)%12] ], [ zone[(7+turn)%12], zone[(8+turn)%12] ] ],
                r:  [ [ zone[(6+turn)%12], zone[(9+turn)%12] ] ],
                ci: [ [ zone[(0+turn)%12] ] ],
                cl: false 
                }
        break;
    case 17:
        return {f:  [ [ zone[(2+turn)%12], zone[(7+turn)%12], zone[(9+turn)%12] ], [ zone[(4+turn)%12], zone[(5+turn)%12] ] ],
                r:  [ [ zone[(3+turn)%12], zone[(6+turn)%12] ] ],
                ci: [ [ zone[(0+turn)%12] ] ],
                cl: false 
                }
        break;
    case 18:
        return {f:  [ [ zone[(2+turn)%12], zone[(10+turn)%12] ], [ zone[(4+turn)%12], zone[(5+turn)%12] ], [ zone[(7+turn)%12], zone[(8+turn)%12] ] ],
                r:  [ [ zone[(3+turn)%12] ], [ zone[(6+turn)%12] ], [ zone[(9+turn)%12] ] ],
                ci: [ [ zone[(0+turn)%12] ] ],
                cl: false 
                }
        break;
    case 19:
        return {f:  [ [ zone[(4+turn)%12], zone[(6+turn)%12], zone[(8+turn)%12] ], [ zone[(2+turn)%12], zone[(10+turn)%12] ] ],
                r:  [ [ zone[(3+turn)%12], zone[(9+turn)%12] ] ],
                ci: [ [ zone[(0+turn)%12] ] ],
                cl: false 
                }
        break;
    case 20:
        return {f:  [ [ zone[(1+turn)%12], zone[(3+turn)%12], zone[(5+turn)%12] ], [ zone[(7+turn)%12], zone[(9+turn)%12], zone[(11+turn)%12] ] ],
                r:  [ [ zone[(0+turn)%12], zone[(6+turn)%12] ] ],
                ci: [],
                cl: false 
                }
        break;
    case 21:
        return {f:  [ [ zone[(0+turn)%12], zone[(3+turn)%12], zone[(5+turn)%12], zone[(10+turn)%12] ], [ zone[(7+turn)%12], zone[(8+turn)%12] ] ],
                r:  [ [ zone[(6+turn)%12], zone[(9+turn)%12] ] ],
                ci: [],
                cl: false 
                }
        break;
    case 22:
        return {f:  [ [ zone[(0+turn)%12], zone[(2+turn)%12], zone[(10+turn)%12] ], [ zone[(4+turn)%12], zone[(5+turn)%12] ], [ zone[(7+turn)%12], zone[(8+turn)%12] ] ],
                r:  [ [ zone[(3+turn)%12] ], [ zone[(6+turn)%12] ], [ zone[(9+turn)%12] ] ],
                ci: [],
                cl: false 
                }
        break;
    case 23:
        return {f:  [ [ zone[(1+turn)%12], zone[(2+turn)%12] ], [ zone[(4+turn)%12], zone[(5+turn)%12] ], [ zone[(7+turn)%12], zone[(8+turn)%12] ], [ zone[(10+turn)%12], zone[(11+turn)%12] ] ],
                r:  [ [ zone[(0+turn)%12] ], [ zone[(3+turn)%12] ], [ zone[(6+turn)%12] ], [ zone[(9+turn)%12] ] ],
                ci: [],
                cl: false 
                }
        break;
    default:
        console.error ("In TreeStructure getAreasTile: It's not a valid type: <" + typeTile + ">");
        return {f: [], r: [], ci: [], cl: false}
    }
}


var main = function(){
    var c = new TreesCollection();


    var d = new Dummy(1, 1);
    d.place([49,49], 'n');
    var t = new Tile(13, 2);
    c.insertTile(t, {x:49, y:49}, d);

    
    var d = new Dummy(2, 1);
    d.place([49,50], 'w');
    var t = new Tile(14, 0);
    c.insertTile(t, {x:49, y:50}, d);


    var d = new Dummy(3, 1);
    d.place([49,51], 's');
    var t = new Tile(15, 0);
    c.insertTile(t, {x:49, y:51}, d);


    var d = new Dummy(2, 2);
    d.place([50,51], 'e');
    var t = new Tile(20, 0);
    c.insertTile(t, {x:50, y:51}, d);


    var t = new Tile(1, 0);
    c.insertTile(t, {x:50, y:50}, null);

    var d = new Dummy(3, 2);
    d.place([50,49], 's');
    var t = new Tile(7, 0);
    c.insertTile(t, {x:50, y:49}, d);
    

    console.log("*********************************");
    console.log("*********************************");
    console.log("*********************************");
    console.log("*********************************");
    console.log("*********************************");
    console.log("*********************************");
    console.log("*********************************");
    console.log("*********************************");
    console.log("*********************************");


    var data = c.getFinalCount();


    for(var i=0; i<data.playersPoints.length; i++){
        console.log("Player: " + data.playersPoints[i][0] + "\t" + "Points: " + data.playersPoints[i][1]);
    }
}

// main();







