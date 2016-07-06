predefTiles = [
    {
        type: 0,
        //         [ n,  nw,   w,  sw,   s,  se,   e,  ne,   c  ]
        positions: ['f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'cl'],
        dummies: [true, false, true, false, true, false, true, false, true],
        banner: false,
        total: 4
    },
    {
        type: 1,
        //         [ n,  nw,   w,  sw,   s,  se,   e,  ne,   c  ]
        positions: ['f', 'f', 'f', 'f', 'r', 'f', 'f', 'f', 'cl'],
        dummies: [true, false, true, false, true, false, true, false, true],
        banner: false,
        total: 2
    },
    {
        type: 2,
        //         [ n,    nw,   w,    sw,   s,    se,   e,    ne,   c  ]
        positions: ['ci', 'ci', 'ci', 'ci', 'ci', 'ci', 'ci', 'ci', 'ci'],
        dummies: [true, false, true, false, true, false, true, false, false],
        banner: true,
        total: 1
    },
    {
        type: 3,
        //         [ n,    nw,   w,   sw,  s,   se,   e,   ne,   c  ]
        positions: ['ci', 'ci', 'ci', 'f', 'f', 'f', 'ci', 'ci', 'ci'],
        dummies: [true, false, true, false, true, false, true, false, false],
        banner: false,
        total: 3
    },
    {
        type: 4,
        //         [ n,   nw,   w,   sw,   s,  se,   e,   ne,   c  ]
        positions: ['ci', 'ci', 'ci', 'f', 'f', 'f', 'ci', 'ci', 'ci'],
        dummies: [true, false, true, false, true, false, true, false, false],
        banner: true,
        total: 1
    },
    {
        type: 5,
        //         [ n,    nw,   w,   sw,   s,  se,   e,   ne,   c  ]
        positions: ['ci', 'ci', 'ci', 'f', 'r', 'f', 'ci', 'ci', 'ci'],
        dummies: [true, false, true, true, true, true, true, false, false],
        banner: false,
        total: 1
    },
    {
        type: 6,
        //         [ n,    nw,   w,   sw,   s,  se,   e,   ne,   c  ]
        positions: ['ci', 'ci', 'ci', 'f', 'r', 'f', 'ci', 'ci', 'ci'],
        dummies: [true, false, true, true, true, true, true, false, false],
        banner: true,
        total: 2
    },
    {
        type: 7,
        //         [ n,    nw,   w,   sw,   s,  se,   e,   ne,   c  ]
        positions: ['ci', 'ci', 'ci', 'f', 'f', 'f', 'f', 'f', 'f'],
        dummies: [true, false, true, false, true, false, true, false, false],
        banner: false,
        total: 3
    },
    {
        type: 8,
        //         [ n,    nw,   w,   sw,   s,  se,   e,   ne,   c  ]
        positions: ['ci', 'ci', 'ci', 'f', 'f', 'f', 'f', 'f', 'f'],
        dummies: [true, false, true, false, true, false, true, false, false],
        banner: true,
        total: 2
    },
    {
        type: 9,
        //         [ n,    nw,   w,   sw,   s,  se,   e,   ne,   c  ]
        positions: ['ci', 'ci', 'ci', 'f', 'r', 'f', 'r', 'f', 'f'],
        dummies: [true, false, true, true, true, true, true, true, false],
        banner: false,
        total: 3
    },
    {
        type: 10,
        //         [ n,    nw,   w,   sw,   s,  se,   e,   ne,   c  ]
        positions: ['ci', 'ci', 'ci', 'f', 'r', 'f', 'r', 'f', 'f'],
        dummies: [true, false, true, true, true, true, true, true, false],
        banner: true,
        total: 2
    },
    {
        type: 11,
        //         [ n,    nw,   w,   sw,   s,  se,   e,   ne,   c  ]
        positions: ['f',  'f',  'ci', 'f', 'f', 'f', 'ci', 'f', 'ci'],
        dummies: [true, false, true, false, true, false, true, false, false],
        banner: false,
        total: 1
    },
    {
        type: 12,
        //         [ n,    nw,   w,   sw,   s,  se,   e,   ne,   c  ]
        positions: ['f',  'f',  'ci', 'f', 'f', 'f', 'ci', 'f', 'ci'],
        dummies: [true, false, true, false, true, false, true, false, false],
        banner: true,
        total: 2
    },
    {
        type: 13,
        //         [ n,    nw,   w,   sw,   s,  se,   e,   ne,   c  ]
        positions: ['ci',  'f',  'ci', 'f', 'f', 'f', 'f', 'f', 'f'],
        dummies: [true, false, true, false, true, false, true, false, false],
        banner: false,
        total: 2
    },
    {
        type: 14,
        //         [ n,    nw,   w,   sw,   s,  se,   e,   ne,   c  ]
        positions: ['ci',  'f',  'f', 'f', 'ci', 'f', 'f', 'f', 'f'],
        dummies: [true, false, true, false, true, false, true, false, false],
        banner: false,
        total: 3
    },
    {
        type: 15,
        //         [ n,    nw,   w,   sw,   s,  se,   e,   ne,   c  ]
        positions: ['ci',  'f',  'f', 'f', 'f', 'f', 'f', 'f', 'f'],
        dummies: [true, false, true, false, true, false, true, false, false],
        banner: false,
        total: 5
    },
    {
        type: 16,
        //         [ n,    nw,   w,   sw,   s,  se,   e,   ne,   c  ]
        positions: ['ci',  'f',  'r', 'f', 'r', 'f', 'f', 'f', 'f'],
        dummies: [true, true, true, true, true, true, true, false, false],
        banner: false,
        total: 3
    },
    {
        type: 17,
        //         [ n,    nw,   w,   sw,   s,  se,   e,   ne,   c  ]
        positions: ['ci',  'f',  'f', 'f', 'r', 'f', 'r', 'f', 'f'],
        dummies: [true, false, true, true, true, true, true, true, false],
        banner: false,
        total: 3
    },
    {
        type: 18,
        //         [ n,    nw,   w,   sw,   s,  se,   e,   ne,   c  ]
        positions: ['ci',  'f',  'r', 'f', 'r', 'f', 'r', 'f', 'x'],
        dummies: [true, true, true, true, true, true, true, true, false],
        banner: false,
        total: 3
    },
    {
        type: 19,
        //         [ n,    nw,   w,   sw,   s,  se,   e,   ne,   c  ]
        positions: ['ci',  'f',  'r', 'f', 'f', 'f', 'r', 'f', 'r'],
        dummies: [true, true, true, true, true, true, true, true, false],
        banner: false,
        total: 4
    },
    {
        type: 20,
        //         [ n,    nw,   w,   sw,   s,  se,   e,   ne,   c  ]
        positions: ['r',  'f',   'f', 'f', 'r', 'f', 'f', 'f',  'r'],
        dummies: [true, true, true, true, true, true, true, true, false],
        banner: false,
        total: 8
    },
    {
        type: 21,
        //         [ n,    nw,   w,   sw,   s,  se,   e,   ne,   c  ]
        positions: ['f',  'f',  'r', 'f', 'r', 'f', 'f', 'f',  'f'],
        dummies: [true, true, true, true, true, true, true, false, false],
        banner: false,
        total: 9
    },
    {
        type: 22,
        //         [ n,    nw,   w,   sw,   s,  se,   e,   ne,   c  ]
        positions: ['f',  'f',   'r', 'f', 'r', 'f', 'r', 'f',  'x'],
        dummies: [true, true, true, true, true, true, true, true, false],
        banner: false,
        total: 4
    },
    {
        type: 23,
        //         [ n,    nw,   w,   sw,   s,  se,   e,   ne,   c  ]
        positions: ['r',  'f',   'r', 'f', 'r', 'f', 'r', 'f',  'x'],
        dummies: [true, true, true, true, true, true, true, true, false],
        banner: false,
        total: 1
    },

];

////////////////////////
//    TILE OBJECT     //
////////////////////////

// args:
// orientation: 0, 1, 2, 3 (clockwise)
Tile = function (type, orientation){
    this.type = type;
    var tmpTile = predefTiles[type].positions;
    this.orientation = orientation || 0;
    var that = this;
    this.positions = {
        get n  () { return predefTiles[type].positions[(0+that.orientation*2)%8]; },
        get nw () { return predefTiles[type].positions[(1+that.orientation*2)%8]; },
        get w  () { return predefTiles[type].positions[(2+that.orientation*2)%8]; },
        get sw () { return predefTiles[type].positions[(3+that.orientation*2)%8]; },
        get s  () { return predefTiles[type].positions[(4+that.orientation*2)%8]; },
        get se () { return predefTiles[type].positions[(5+that.orientation*2)%8]; },
        get e  () { return predefTiles[type].positions[(6+that.orientation*2)%8]; },
        get ne () { return predefTiles[type].positions[(7+that.orientation*2)%8]; },
        get c  () { return predefTiles[type].positions[8]; }
    };
    this.dummies = {
        get n  () { return predefTiles[type].dummies[(0+that.orientation*2)%8]; },
        get nw () { return predefTiles[type].dummies[(1+that.orientation*2)%8]; },
        get w  () { return predefTiles[type].dummies[(2+that.orientation*2)%8]; },
        get sw () { return predefTiles[type].dummies[(3+that.orientation*2)%8]; },
        get s  () { return predefTiles[type].dummies[(4+that.orientation*2)%8]; },
        get se () { return predefTiles[type].dummies[(5+that.orientation*2)%8]; },
        get e  () { return predefTiles[type].dummies[(6+that.orientation*2)%8]; },
        get ne () { return predefTiles[type].dummies[(7+that.orientation*2)%8]; },
        get c  () { return predefTiles[type].dummies[8]; }
    }
}

// Turns 90 degrees clockwise
Tile.prototype.turnTile = function(){
    this.orientation = (this.orientation + 1) % 4;
}

/////////////////////////
//    TILES OBJECT     //
/////////////////////////

var initTiles = function (stack) {
    var turns = 72;
    var initialTileType = 19;
    var startingTiles = JSON.parse(JSON.stringify(predefTiles));
    --startingTiles[initialTileType].total;
    while(stack.length < turns-1){
        var remainingTiles = startingTiles.filter(filterByTotal);
        var Type = getRandomArbitrary(remainingTiles.length,0);
        if(remainingTiles[Type].total !== 0){
            --remainingTiles[Type].total;
            var tile = new Tile(remainingTiles[Type].type, 0);
            stack.push(tile);
        }else {
            throw "No more units of the picked tile"
        }
    }
}

Tiles = function() {
    this.stack = [];
    initTiles(this.stack);
    this.currentTile = this.popTile();
}

//Returns random int between maximum(excluded)
//and minimum(included)
var getRandomArbitrary = function (max, min) {
    return Math.floor(Math.random() * (max - min) + min);
}

//Returns true if there are tiles left from
//each type, false if the contrary
var filterByTotal = function (obj) {
    if(obj.total > 0){
        return true;
    }else{
        return false;
    }
}

Tiles.prototype.popTile = function() {
    if(this.stack.length > 0){
        this.currentTile = this.stack.pop();
        if(this.currentTile == null){
            throw "Popped null tile"
        }
        return this.currentTile;
    }
}
