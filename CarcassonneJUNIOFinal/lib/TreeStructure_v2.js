
///////////////////////////
//      TREE OBJECT      //
///////////////////////////


// type: 'r', 'f', 'ci'
// Allow create a tree with a node
// Coord: {x:1, y:2}
// area: ['se','sw']
// tile object
// dummy: Dummy object
// Coord, area, tile and dummy aren't required
Tree = function(type, coord, area, tile, dummy){
    this.dummies = [];
    this.type = type;
    this.firstNode = undefined;
    this.id = getRandomId(type);
    if (type == 'cl' && coord){
        this.firstNode = new Node(coord, null, 'x', [], true, tile);
        this.type = type;
        this._createClTree(coord);
        if (dummy){
            if (dummy.position === 'c')
                this.dummies.push(dummy)
        }
    } else {
        if (coord && area)
            this.placeNode(coord, area, tile, dummy);
    }
}

// coord: {x:1, y:2}
// area: ['se','sw']
// tile object
// dummy: Dummy object
// ---Check first if exists the node in the tree---.
// If exists, call this function to indicate that is placed
// Return 0 is everything was ok
// Return -1 is something was wrong, msg in the console.
Tree.prototype.placeNode = function(coord, area, tile, dummy){
    if (tile === undefined)
        console.warn("Tree " + this.id + ": You aren't placing a tile");
    var childrenElements = getChildrenElements(coord, area);
    if (this.firstNode == undefined){
        this.firstNode = new Node(coord, null, 'x', childrenElements, true, tile);
        if (dummy){
            var coorDummy = {x:dummy.coord[0], y:dummy.coord[1]};
            if (sameCoord(coorDummy, coord) && posInArea2(dummy.position, area))
                this.dummies.push(dummy);
        }
    } else {
        childrenElements = this._getNotPlacedCoords(childrenElements);
        var nodes = this.findNodes(coord, area);
        if (nodes.length > 0){
            nodes.forEach(function(node){
                node.placed = true;
                node.setChildren(childrenElements);
                node.tileType = (tile===undefined) ? -1 : tile.type;
                node.tile = tile;
            });
            if (dummy){
                var coorDummy = {x:dummy.coord[0], y:dummy.coord[1]};
                if (sameCoord(coorDummy, coord) &&  posInArea2(dummy.position, area))
                    this.dummies.push(dummy);
            }
            return 0;
        }else{
            console.warn("There wasn't any node with: <" + coord + "><" + area + ">");
            return -1;
        }
    }
}


// ONLY FOR CLOISTER TREES
// Place a coord in a tree
Tree.prototype.placeClTile = function(coord){
    var found = false;
    var nodes = this.findNodes(coord);
    nodes.forEach(function(node){
        found = true;
        node.placed = true;
        node.tileType = -2;
        node.tile = undefined;
    });
    return found;
}


// Returns true or false if coord is in the tree
// independently it is placed or not
// coord: {x:1, y:2}
// area: ['n', 'se' ...]
Tree.prototype.existsNode = function(coord, area){
    var nodes = this.findNodes(coord, area);
    return nodes.length > 0
}


/*
 *  Returns the coords that the tree already need to be closed
 *  format: [{x:50, y:49},{x:49,y:49},...]
 */
Tree.prototype.getLeftCoords = function(){
    if (this.firstNode){
        var remaining = this.firstNode.remainingCoords();
        return remaining;
    } else {
        return [];
    }
}



// Returns the number of tiles not placed
// 0 -> Tree completed
Tree.prototype.getLeftChildren = function(){
    if (this.firstNode){
        var remaining = this.firstNode.remainingCoords();
        return remaining.length;
    } else {
        return 0;
    }
}


// Returns the number of tiles placed in this tree
Tree.prototype.getNumOfTiles = function(){
    if (this.firstNode){
        var placed = this.firstNode.placedCoords();
        return placed.length;
    } else {
        return 0;
    }
}


// Merge two trees
// Call this when you're going to place a coord that is in two trees.
// coord is the common point in the two trees
// Return -1 if an error occurred. Error is printed in the terminal
// remoteTree: Tree object for adding to this tree
// coord: {x:1, y:2}
// area: ['n', 'se' ...]
Tree.prototype.mergeWith = function(remoteTree, coord, area){
    var output = remoteTree._setFirstNode(coord, area);
    if (output == -1)
        return -1; 
    var nodes = this.findNodes(coord, area);
    if (nodes.length == 0){
        console.warn("Node<" + node + ">,area<" + area + "> not found in this tree");
        return -1;
    }
    var nodeMerge = nodes[0];
    var childrenFNRemote = remoteTree.firstNode.children;
    childrenFNRemote.forEach(function(nodeChild){
        nodeMerge.children.push(nodeChild);
    });
    var dummiesRemote = remoteTree.dummies;
    thisTree = this;
    dummiesRemote.forEach(function(dummy){
        thisTree.dummies.push(dummy);
    });
}


// Returns the number of banners in a tree (only for cities)
Tree.prototype.getNumOfBanners = function(){
    if (this.firstNode){
        var tilesBanner = this.firstNode.nodesBanners();
        return tilesBanner.length;
    } else {
        return 0;
    }
}


// coord: {x:1, y:2}
// area: ['n', 'se' ...] -----> YOU CAN SKYP THIS ARGUMENT
// Returns if a coord is in the tree and is placed (true or false)
Tree.prototype.isPlaced = function(coord, area){
    var area = area || ['n','s','e','w','nw','sw','wn','ws','ne','se','en','es','x'];
    var output = false;
    if (this.firstNode == undefined){
        output = false;
    } else {
        output = this.firstNode.isPlaced(coord, area);
    }
    return output;
}



// Returns the parent coord of the remaining nodes
// Return array of coords in the format [{x:49, y:49}, ...]
Tree.prototype.getLastPlaced = function(){
    var nodes = this._getRemainingNodes();
    var coords = new Array();
    nodes.forEach(function(node){
        var tmpCoord = node.getParentCoord();
        if (!coordInArray(tmpCoord, coords))
            coords.push(tmpCoord);
    });
    return coords;
}




/***********************
**  USED INTERNALLY   **
***********************/


// coord: {x:1, y:2}
// area: ['n', 'se' ...]
// coord is obligatory. If area is not passed by argument
// it will find only the nodes with that coord
Tree.prototype.findNodes = function(coord, area){
    var area = area || ['n','s','e','w','nw','sw','wn','ws','ne','se','en','es','x'];
    var nodes = [];
    var that = this;
    if (this.firstNode != undefined){
        nodes = that.firstNode.findNodes(coord, area);
    }
    return nodes;
}


// Guiven coords returns wich of that coords arent placed
Tree.prototype._getNotPlacedCoords = function(childrenElements){
    var notPlaced = [];
    var that = this;
    notPlaced = childrenElements.filter(function(element){
        return !that.isPlaced(element.coord)
    });
    return notPlaced;
}



// For debug issues
Tree.prototype.printTree = function(){
    if (this.firstNode){
        var treeType ="";
        switch(this.type){
        case 'ci': treeType = 'city'; break;
        case 'r': treeType = 'road'; break;
        case 'f': treeType = 'field'; break;
        case 'cl': treeType = 'cloister'; break;
        default: treeType = 'Unknow';
        }
        console.log(" ------ " + treeType + " tree ------ ");
        console.log(" ID:" + this.id + 
                    " LEFT:" + this.getLeftChildren() + 
                    ",TOTAL:" + this.getNumOfTiles()  +
                    ",BANNERS:" + this.getNumOfBanners() + 
                    ",DUMMIES:" + this.dummies.length);
        this.firstNode.printTree(1);
    }else{
        console.log("Empty tree");
    }
}


// Set the first node of a tree a determinate coord
// and keep all the nodes
Tree.prototype._setFirstNode = function(coord, area){
    var nodes = this.findNodes(coord, area);
    if (nodes.length == 0){
        console.warn("coord " + coord + " isn't in the tree");
        return -1;
    }
    var firstNode = nodes[0];

    var aux = firstNode;
    var prev = null;
    var parent = null;
    var delIndex = 0;
    while (aux){
        parent = aux.parent;
        aux.parent = prev;
        if (prev){
            delIndex = aux.children.indexOf(prev);
            aux.children.splice(delIndex, 1);
        }
        if (parent)
            aux.children.push(parent);
        prev = aux;
        aux = parent;
    }
    this.firstNode = firstNode;
}


//childrenElements: [{coord: {x:2, y:4}, zone: 'n'}, {...}, ...]
Tree.prototype._createClTree = function(coord){
    childsCl = getChildsCl(coord);
    this.firstNode.setChildren(childsCl);
}


// Get the remaining Nodes in the tree
Tree.prototype._getRemainingNodes = function(){
    if (this.firstNode)
        return this.firstNode.remainingNodes();
    else
        return [];
}


///////////////////////////
//      NODE OBJECT      //
///////////////////////////


// coord: {x:1, y:2}
// childrenElements: [{coord: {x:2, y:4}, zone: 'n'}, {...}, ...]
// parent: Node
// pos: 'n' ... or 'x' when is the first node
// placed: true or false
// tile
Node = function(coord, parent, pos, childrenElements, placed, tile){
    var childrenElements = childrenElements || [];
    this.pos = pos || 'x';
    this.coord = coord;
    this.placed = placed || false;
    this.parent = parent || null;
    this.tileType = (tile===undefined) ? -1 : tile.type;
    this.tile = tile;
    this.children = [];
    this.setChildren(childrenElements);
}


// childrenElements: [{coord: {x:2, y:4}, zone: 'n'}, {...}, ...]
// Assign new children to this Node
Node.prototype.setChildren = function(childrenElements){
    var childrenElements = childrenElements || [];
    var that = this;
    childrenElements.forEach(function(child){
        that.children.push(new Node(child.coord, that, child.zone, [], false));
    });
}


// coord: {x:1, y:2}
// returns: Nodes found
Node.prototype.findNodes = function(coord, area) {
    var nodes = [];
    if (!coord || !area)
        return [];

    if (sameCoord(this.coord, coord) && posInArea(this.pos, area))
        nodes.push(this);

    this.children.forEach(function(child){
        var nodesIn = child.findNodes(coord, area);
        nodesIn.forEach(function(node){
            nodes.push(node);
        });
    });

    return nodes;
}


//Returns the number of all the coordinates not placed
Node.prototype.remainingCoords = function (coordsNotPlaced){
    var coordsNotPlaced = coordsNotPlaced || [];
    if (!this.placed && !coordInArray(this.coord, coordsNotPlaced))
        coordsNotPlaced.push(this.coord)

    this.children.forEach(function(child){
        coordsNotPlaced = child.remainingCoords(coordsNotPlaced);
    });
    return coordsNotPlaced;
}



//Returns the nodes of all the coordinates not placed
Node.prototype.remainingNodes = function (nodesNotPlaced){
    var nodesNotPlaced = nodesNotPlaced || [];
    if (!this.placed)
        nodesNotPlaced.push(this)

    this.children.forEach(function(child){
        nodesNotPlaced = child.remainingNodes(nodesNotPlaced);
    });
    return nodesNotPlaced;
}



// Returns the parent coord
Node.prototype.getParentCoord = function(){
    if (this.parent == null)
        return null;
    else
        return this.parent.coord;
}



//Returns the number of all the children placed and the own node
Node.prototype.placedCoords = function (coordsPlaced){
    var coordsPlaced = coordsPlaced || [];
    if (this.placed && !coordInArray(this.coord, coordsPlaced))
        coordsPlaced.push(this.coord)

    this.children.forEach(function(child){
        coordsPlaced = child.placedCoords(coordsPlaced);
    });
    return coordsPlaced;
}


// Returns if a coord is already placed in the tree
// coord: {x:1, y:2}
// area: ['n', 'se' ...]
Node.prototype.isPlaced = function(coord, area){
    var area = area || ['n','s','e','w','nw','sw','wn','ws','ne','se','en','es','x'];
    var output = false;
    if (!coord)
        return false;
    if (sameCoord(this.coord, coord) && this.placed && posInArea(this.pos, area)){
        output = true;
    }else{
        this.children.forEach(function(child){
            if (child.isPlaced(coord, area))
                output = true;
        });
    }
    return output;
}


// For debug issues
Node.prototype.printTree = function(indent){
    console.log(Array(2 * indent).join(" ") + "- coord(" + 
        this.coord.x + "," + this.coord.y +")zone(" + this.pos + 
        ")Placed(" + this.placed + ")Type(" + this.tileType + ")");
    for (var i=0; i<this.children.length; i++){
        this.children[i].printTree(indent + 1);
    }
}


// return if this node or its children has banner and increase coordsBanner
Node.prototype.nodesBanners = function(coordsBanner){
    var coordsBanner = coordsBanner || [];
    if (hasBanner(this.tileType) && !coordInArray(this.coord, coordsBanner))
        coordsBanner.push(this.coord)

    this.children.forEach(function(child){
        coordsBanner = child.nodesBanners(coordsBanner);
    });
    return coordsBanner;
}


/*
 * Return:
 *   true  -> If some of the nodes is near the tree
 *   false -> Otherwise
 */
Node.prototype.someNodeNear = function(tree){
    var together = false;
    var thisNode = this;
    var j = 0;
    if (this.placed){
        var nodes = tree.findNodes(this.coord);
        for (var i in nodes){
            if (nodes[i].placed && sameZoneFieldCity(nodes[i], thisNode)){
                together = true;
                break;
            }
        }
    }
    while (!together && j<this.children.length){
        together = this.children[j].someNodeNear(tree);
        j++;
    }
    return together;
}


////////////////////////////
//     OTHER FUNCTIONS    //
////////////////////////////


// This function returns the coordinates and the zone
// of the children that a parent need to be completed
// input: coord: {x:2, y:2}; area: ['n','e','w']
// output:  [{coord: {x:2, y:4}, zone: 'n'}, ...]
var getChildrenElements = function(coord, area){
    var output = [];
    area.forEach(function(element){
        output.push(getCoordAndZoneChild(coord, element));
    });
    return output;
}


// Compare 2 coords
var sameCoord = function(coord1, coord2){
    return coord1.x == coord2.x && coord1.y == coord2.y;
}


// Returns if the pos guiven is in the area
var posInArea = function(pos, area){
    var is = false;
    var area = area || [];
    area.forEach(function(element){
        if (element == pos)
            is = true;
    });
    return is;
}


// Returns if the pos guiven is in the area
// with a conversion for predefTiles style
var posInArea2 = function(pos, area){
    var is = false;
    var area = area || [];
    area.forEach(function(element){
        if (getOriginalZone(element) == pos)
            is = true;
    });
    return is;
}


// Returns if the coord is in the array
var coordInArray = function(coord, coordsArray){
    var is = false;
    coordsArray.forEach(function(element){
        if (sameCoord(coord, element))
            is = true;
    });
    return is;
}


// Returns if a tile type has banner
var hasBanner = function(tileType){
    var bannerTypes = [2, 4, 6, 8, 10, 12];
    for (var i = 0; i< bannerTypes.length; i++){
        if (tileType == bannerTypes[i])
            return true;
    }
    return false;
}


// Generate an id 
var getRandomId = function(){
    var id = "";
    id += Math.floor(1 + Math.random()*1000).toString();
    var d = new Date();
    id += d.getTime().toString();
    return id;
}


// Converts the zone
// eg. 'en' -> 'ne'
var getOriginalZone = function(zone){
    switch(zone){
    case 'en': 
        return 'ne';
        break;
    case 'es':
        return 'se';
        break;
    case 'wn':
        return 'nw';
        break;
    case 'ws':
        return 'sw';
        break;
    default:
        return zone;
        break;
    }
}


// for a coord guiven for cloister
var getChildsCl = function(coord){
    if (!coord)
        return [];
    arr = new Array();
    arr.push({coord: {x: coord.x, y: coord.y-1}, zone: 'n'});
    arr.push({coord: {x: coord.x, y: coord.y+1}, zone: 's'});
    arr.push({coord: {x: coord.x+1, y: coord.y}, zone: 'e'});
    arr.push({coord: {x: coord.x-1, y: coord.y}, zone: 'w'});
    arr.push({coord: {x: coord.x-1, y: coord.y-1}, zone: 'nw'});
    arr.push({coord: {x: coord.x+1, y: coord.y-1}, zone: 'ne'});
    arr.push({coord: {x: coord.x-1, y: coord.y+1}, zone: 'sw'});
    arr.push({coord: {x: coord.x+1, y: coord.y+1}, zone: 'se'});
    return arr;
}




/*
 * Arguments:
 *   ftree -> Field tree object
 *   ctree -> Country tree object
 * Return:
 *   true  -> If the two trees are together
 *   false -> If aren't together
 */
areTogether = function(ftree, ctree){
    if (!ftree || !ctree)
        return false;
    if (!ftree.firstNode || !ctree.firstNode)
        return false;
    return ftree.firstNode.someNodeNear(ctree);
}


/*
 * Must be the two nodes from the same typetile
 * Arguments:
 *   nodes are Node objects and must be from city or field trees   
 * Return:
 *   true  -> If the field and the city are together
 *   false -> The oposite
 */
var sameZoneFieldCity = function(node1, node2){
    var pos1 = getPosFromTree(node1);
    var pos2 = getPosFromTree(node2);
    switch(node1.tileType){
    case 9:
        var area = getrotPos(['n', 'w', 'sw','en'], node1.tile.orientation);
        return (posInArea(pos1, area) && posInArea(pos2, area));
    case 10:
        var area = getrotPos(['n', 'w', 'sw','en'], node1.tile.orientation);
        return (posInArea(pos1, area) && posInArea(pos2, area));
    case 16:
        var area = getrotPos(['n', 'wn', 'e', 'se'], node1.tile.orientation);
        return (posInArea(pos1, area) && posInArea(pos2, area));
    case 17:
        var area = getrotPos(['n', 'en', 'w', 'sw'], node1.tile.orientation);
        return (posInArea(pos1, area) && posInArea(pos2, area));
    case 18:
        var area = getrotPos(['n', 'en', 'wn'], node1.tile.orientation);
        return (posInArea(pos1, area) && posInArea(pos2, area));
    case 19:
        var area = getrotPos(['n', 'en', 'wn'], node1.tile.orientation);
        return (posInArea(pos1, area) && posInArea(pos2, area));
    default:
        return true;
    }
}


// Rotate an array of positions
var getrotPos = function(posArr, rot){
    var staticPos = ['n','ne','en','e','es','se','s','sw','ws','w','wn','nw'];
    var output = new Array();
    posArr.forEach(function(pos){
        var newPos = (staticPos.indexOf(pos) + 3*rot)%12;
        output.push(staticPos[newPos]);
    });
    return output;
}


/*
 * Is useful if the node.pos is 'x', what means 
 * that is the first node placed in the tree
 */
var getPosFromTree = function(node){
    if (node.pos !== 'x'){
        return node.pos;
    }else if (node.children.length > 0){
        var tmpCoordZone = getCoordAndZoneChild(node.children[0].coord, node.children[0].pos)
        return tmpCoordZone.zone;
    }else if (node.parent){
        var tmpCoordZone = getCoordAndZoneChild(node.parent.coord, node.parent.pos)
        return tmpCoordZone.zone;
    }else{
        console.log("Error getting zone");
        return 'ERRORZONE';
    }
}



//////////////////////////
//    GET COORD CHILD   //
//////////////////////////
// From parentCoord  ({x:2, y:3}) and parentZone('s') returns
// the tuple coord and zone of the child next to the parent
// output: {coord: {x:2, y:4}, zone: 'n'}
getCoordAndZoneChild = function(parentCoord, parentZone){
    var coordc;
    var zonec;
    switch(parentZone){
    case 'n':
        coordc = {x: parentCoord.x, y: parentCoord.y - 1};
        zonec = 's';
        break;
    case 'ne':
        coordc = {x: parentCoord.x, y: parentCoord.y - 1};
        zonec = 'se';
        break;
    case 'nw':
        coordc = {x: parentCoord.x, y: parentCoord.y - 1};
        zonec = 'sw';
        break;
    case 's':
        coordc = {x: parentCoord.x, y: parentCoord.y + 1};
        zonec = 'n';
        break;
    case 'se':
        coordc = {x: parentCoord.x, y: parentCoord.y + 1};
        zonec = 'ne';
        break;
    case 'sw':
        coordc = {x: parentCoord.x, y: parentCoord.y + 1};
        zonec = 'nw';
        break;
    case 'e':
        coordc = {x: parentCoord.x + 1, y: parentCoord.y};
        zonec = 'w';
        break;
    case 'es':
        coordc = {x: parentCoord.x + 1, y: parentCoord.y};
        zonec = 'ws';
        break;
    case 'en':
        coordc = {x: parentCoord.x + 1, y: parentCoord.y};
        zonec = 'wn';
        break;
    case 'w':
        coordc = {x: parentCoord.x - 1, y: parentCoord.y};
        zonec = 'e';
        break;
    case 'wn':
        coordc = {x: parentCoord.x - 1, y: parentCoord.y};
        zonec = 'en';
        break;
    case 'ws':
        coordc = {x: parentCoord.x - 1, y: parentCoord.y};
        zonec = 'es';
        break;
    default:
        console.warn('In treeStructure getCoordChild: Not a valid zone: <' + parentZone + '>');
        coordc = {};
        zonec = '';
    }
    return {coord: coordc, zone: zonec}
}


