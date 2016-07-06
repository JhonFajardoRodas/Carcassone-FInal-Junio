//rotacion de la ficha
rotate = 1;

//objetos de piezas para guardar
sprites = {
	fondo: {sx: 0, sy: 400, w: 590, h: 300},
	valid: {sx: 0, sy: 705, w: 100, h: 100},
	player1: {sx: 100, sy: 705, w: 100, h: 100},
	player2: {sx: 200, sy: 705, w: 100, h: 100},
	player3: {sx: 300, sy: 705, w: 100, h: 100},
	player4: {sx: 400, sy: 705, w: 100, h: 100},
	0 : { sx: 0, sy: 0, w: 100, h: 100},
	1 : { sx: 100, sy: 0, w: 100, h: 100},
	2 : { sx: 200, sy: 0, w: 100, h: 100},
	3 : { sx: 300, sy: 0, w: 100, h: 100},
	7 : { sx: 400, sy: 0, w: 100, h: 100},
	9 : { sx: 500, sy: 0, w: 100, h: 100},
	11 : { sx: 0, sy: 100, w: 100, h: 100},
	13 : { sx: 100, sy: 100, w: 100, h: 100},
	14 : { sx: 200, sy: 100, w: 100, h: 100},
	15 : { sx: 300, sy: 100, w: 100, h: 100},
	16 : { sx: 400, sy: 100, w: 100, h: 100},
	17 : { sx: 500, sy: 100, w: 100, h: 100},
	18 : { sx: 0, sy: 200, w: 100, h: 100},
	19 : { sx: 100, sy: 200, w: 100, h: 100},
	20 : { sx: 200, sy: 200, w: 100, h: 100},
	21 : { sx: 300, sy: 200, w: 100, h: 100},
	22: { sx: 400, sy: 200, w: 100, h: 100},
	23 : { sx: 500, sy: 200, w: 100, h: 100},
	4 : { sx: 0, sy: 300, w: 100, h: 100},
	12 : { sx: 100, sy: 300, w: 100, h: 100},
	10 : { sx: 200, sy: 300, w: 100, h: 100},
	8 : { sx: 300, sy: 300, w: 100, h: 100},
	5 : { sx: 400, sy: 300, w: 100, h: 100},
	6 : { sx: 500, sy: 300, w: 100, h: 100}
};

//inicializo el juego
startGame = function(numToken,infoRots) {
	//Fondo
	Game.setBoard(0,new Background(0,0,825,375,"fondo"));
	//array de fichas fijadas
	Game.setBoard(1,FixedTokens);
	//Fijo la ficha central(fila 6,columna 6)
	var currentMinCoor = {x: Game.minCoor[0], y: Game.minCoor[1]};
	FixedTokens.setToken(new Token(5*boxSize,2*boxSize,2,"19",[49,49],[currentMinCoor.x,currentMinCoor.y]));
	//Posibles posiciones en el tablero segun la rotacion
	Game.setBoard(2,new PossiblePositions([currentMinCoor.x,currentMinCoor.y],"valid"));//creo objeto rotaciones
	boards[2].addInfo(infoRots);//meto la informacion de logica de las posiciones posibles para la ficha
	//Dummy(3)
	//Game.setBoard(3,new Dummy());
	//Ficha que se mueve(4)
	Game.setBoard(3,new CurrentToken(0,0,numToken));
};

initGame = function(numToken,infoRots){
	Game.initialize("game",sprites,startGame, numToken,infoRots);
}