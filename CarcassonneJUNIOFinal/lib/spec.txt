Game:
 - var players
 - var tiles
 - var board
 - initGame(players[]){
 	players = Players.initPlayers()
	tiles = Tiles.initTiles() -> return Queue[Tile]
	board = Board.initBoard()
   }
 - startGame(){ //jugar
   	while(tiles.length > 0){
		Players.nextPlayer()
		Tiles.nextTile()
		
	}
   }

Players
 - var array[Player]
 - var currentPlayer
 - nextPlayer()
 - initPlayers()

Player
 - name (string)
 - score (int)
 - dummies (int)

Tiles:
 - var queue[Tile]
 - var currentTile
 - popTile()
 - initTile()

Tile:
 - turnTile()
 - var angle
 - var north
 - var west
 - var south
 - var east

Board:
 - var Cell[MAXCELLSZ][MAXCELLSZ]
 - getAvailableCell() -> Return array cordenadas
 - evaluateScore(Players)

Cell:
 - var tile //if null there is no tile



