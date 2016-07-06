//factor para agrandar el cuadrado
n = 0.75;
//tamaño cuadrado
boxSize = 100*n;
//contiene todos los posibles objetos a dibujar
boards = [];
//array de dummys posibles para la posicion elegida
var arrayDummys;

coordenadas = {};

//funcion para la traduccion de coordenadas que pasa lógica(fila,columna)
  function getPixel(pos){
    var x = (pos[0]-1)*boxSize;//resto 1 porque las coordenadas para los pixeles empiezan en 0
    var y = (pos[1]-1)*boxSize;

    coord = [x,y];

    return coord;
  };

  function getLogicCoord(pos){
    var x = (pos[0]/boxSize)+1;//resto 1 porque las coordenadas para los pixeles empiezan en 0
    var y = (pos[1]/boxSize)+1;

    result = [x,y];

    return result;

  }

//------------------------------------------------
SpriteSheet = new function() {
  this.map = { };

  this.load = function(spriteData,callback) {
    this.map = spriteData;
    this.image = new Image();
    this.image.onload = callback;
    this.image.src = 'sprite.png';
  };
  this.draw = function(ctx,sprite,x,y,w,h,typeObject,rot) {
    var s = this.map[sprite];
    if(typeObject !== "fixedTile" ){

      ctx.drawImage(this.image,s.sx ,s.sy,s.w, s.h,x,y,w,h);
      ctx.save();
    }else{

      ctx.save();
      var rots = { 0: 0, 1: 90, 2:180, 3: 270};
      var dx;
      var dy;

      if(rot == 0){
        dx = x;
        dy = y;
      }else{

        if(rot == 1){
            ctx.translate(x+boxSize,y);
        }else if (rot == 2){
          ctx.translate(x+boxSize,y+boxSize);

        }else{
          ctx.translate(x,y+boxSize);
        }
        var grade = Math.PI*rots[rot]/180;
        ctx.rotate(grade);
        dx = 0;
        dy = 0;
      }

      ctx.drawImage(this.image,s.sx ,s.sy,s.w, s.h,dx,dy,w,h);
      ctx.restore();
    }
  };
};
//----------------------------------------------------------------------------------
Game = new function() {

  this.initialize = function(canvasElementId,sprite_data,callback,argForCallback,argForCallack2) {

    this.canvas = document.getElementById(canvasElementId);
    this.width = this.canvas.width;
    this.height= this.canvas.height;
    this.minCoor = [44,47];//[columna(x del canvas),fila(y del canvas)];
    this.maxCoor = [54,51];

    this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
    if(!this.ctx) { return alert("Please upgrade your browser to play"); }
    this.setupInput();
    this.loop();

    SpriteSheet.load(sprite_data,callback(argForCallback,argForCallack2));
  };

  var KEY_CODES = {13: 'intro',37:'left', 38:'up', 39:'right', 40:'down', 49:'1', 50:'2', 51 :'3', 52 :'4', 53:'5', 54:'6', 55:'7', 56:'8', 57:'9'};
  this.keys = {};

  this.setupInput = function() {
    window.addEventListener('keydown',function(event) {
      //console.log(event.keyCode);
      if(KEY_CODES[event.keyCode]) {
        if(Session.get("fixedToken")){

          if(arrayDummys[KEY_CODES[event.keyCode]-1] === true){ //numero de dummy esta en el array que pasa logica

            var currentMinCoor = {x: Game.minCoor[0], y: Game.minCoor[1]};
            var posLastTile = boards[1].num_token()-1;//posicion ultima ficha fijada (ficha)

            if(boards[1].tokens[posLastTile].typeObject === "fixedTile"){
              var posLastTileAux = posLastTile
              FixedTokens.setToken(new Dummy("player1",[currentMinCoor.x,currentMinCoor.y],boards[1].tokens[posLastTile].dx,boards[1].tokens[posLastTile].dy,boards[1].tokens[posLastTile].logicCoord));
              //console.log("ANTES DE INSERTAR: " + boards[1].tokens[posLastTileAux].logicCoord)

              posLastTile = boards[1].num_token()-1;//posicion ultima ficha fijada (dummy)
              boards[1].tokens[posLastTile].setDummy(KEY_CODES[event.keyCode]-1);
              PushDummyMoves.insert({
                move: "Ha colocado dummy",
                currentcoord: [currentMinCoor.x,currentMinCoor.y],
                x: boards[1].tokens[posLastTileAux].dx,
                y: boards[1].tokens[posLastTileAux].dy,
                logiccoord: boards[1].tokens[posLastTileAux].logicCoord,
                posLastTile: posLastTile,
                posDummy: KEY_CODES[event.keyCode]-1
              });
            }

          }else{
            //console.log("creo mensaje");
            var text = "Posición no válida para el dummy: "+KEY_CODES[event.keyCode]+",probar otra.";
            Game.setBoard(2,new Message(text,70,20,650,50,100,50));
          }

          if(KEY_CODES[event.keyCode] === 'intro' && boards[2].typeObject === 'message'){
            //console.log("quito el mensaje");
            boards.pop();
          }

        }else{
        //mover las coordenadas que dibuja el canvas
          if(KEY_CODES[event.keyCode] === 'left' ){
            if(Game.minCoor[0] > 1){
              --Game.minCoor[0];
              --Game.maxCoor[0];
            }
          }else if(KEY_CODES[event.keyCode] === 'right'){
            if(Game.maxCoor[0] < 100){
              ++Game.minCoor[0];
              ++Game.maxCoor[0];
            }
          }else if(KEY_CODES[event.keyCode] === 'up'){
            if(Game.minCoor[1] > 1){
              --Game.minCoor[1];
              --Game.maxCoor[1];
            }
          }else if(KEY_CODES[event.keyCode] === 'down'){
            if(Game.maxCoor[1] < 100){
              ++Game.minCoor[1];
              ++Game.maxCoor[1];
            }
          }else if(KEY_CODES[event.keyCode] === 'intro' && boards[4]){
            //console.log("quito el mensaje");
            boards.pop();
          }
        }
        //Game.keys[KEY_CODES[event.keyCode]] = true;
        event.preventDefault();
      }
    },false);
  };

  this.loop = function() {
    for(var i=0, len = boards.length;i<len;i++) {
      if(boards[i]) {
          boards[i].draw(Game.ctx);
          /*if (i = 1){
              console.log("PINTO-> " + boards[i].dx + "  " + boards[i].dy)
          }*/

      }

    }
    setTimeout(Game.loop,30);
  };
  //funcion para fijar los distintos objetos (tablero,ficha que muevo,array de fichas colocadas,muñecos)
  this.setBoard = function(num,board) { boards[num] = board; };
};


//------------------------------------------------------------------------------------------
Background = function (dx,dy,w,h,sprite){
  this.typeObject = "background";
  this.dx = dx;
  this.dy = dy;
  this.w = w;
  this.h = h;
  this.sprite = sprite;

  this.draw = function(ctx){
    SpriteSheet.draw(ctx,this.sprite,this.dx,this.dy,this.w,this.h,this.typeObject);
  }
};

//-----------------------------------------------------------------------------
//objeto ficha function
Token = function (x,y,rotate,sprite,logCoor,mCoord){
  this.typeObject = "fixedTile";
  this.dx = x;
  this.dy = y;
  this.rotate = rotate;
  this.sprite = sprite;
  this.logicCoord = logCoor;
  this.sourceMinCoord = mCoord;

  this.draw = function(ctx){
    if( (this.logicCoord[0] >= Game.minCoor[0] && this.logicCoord[0] <= Game.maxCoor[0]) && (this.logicCoord[1] >= Game.minCoor[1] && this.logicCoord[1] <= Game.maxCoor[1]) ){
      var x = this.sourceMinCoord[0]-Game.minCoor[0];
      var y = this.sourceMinCoord[1]-Game.minCoor[1];
      SpriteSheet.draw(ctx,this.sprite,this.dx+(x*boxSize),this.dy+(y*boxSize),boxSize,boxSize,this.typeObject,this.rotate);
    }
  }
}

//----------------------------------------------------------------------------
//la ficha que muevo por el tablero para colocarla
CurrentToken = function (x,y,sprite){
  this.typeObject = "movingTile";
  this.dx = x;
  this.dy = y;
  this.sprite = sprite;

  this.draw = function(ctx){
    SpriteSheet.draw(ctx,this.sprite,this.dx,this.dy,boxSize,boxSize,this.typeObject);
  }

  function step(e){
    if(Session.get('pickTileOK') && !Session.get('fixedToken')){
      //console.log(e.clientY);
      //console.log(e.clientX+" "+e.clientY);
      boards[3].dx = e.clientX-((boxSize/2)+8);
      boards[3].dy = e.clientY-((boxSize/2)+241);
    }
  };
  Game.canvas.addEventListener("mousemove", function(e){step(e)});

  //devuelve la posicion donde colocar la ficha para que se ajuste al canvas(para no montar unas fichas sobre otras)
  function calculateCoord(x,y){
      var coords = {};
      //divido la coordenada entre el tamaño de una ficha,cojo la parte entera y la multiplico por el tamaño de la ficha
      coords.x = (Math.floor((x-8)/boxSize))*boxSize;
      coords.y = (Math.floor((y-241)/boxSize))*boxSize;
      coordenadas  = coords;
      return coords;
  };

  function isValid(x,y){
    ok = false;

    //console.log(boards[2].rotations[posRot].pos);
    if(boards[2].rotations){
      numPositions = boards[2].rotations[posRot].length;
      for(var i = 0;i<numPositions;i++){

        logicX = boards[2].rotations[posRot][i].coord[0];
        logicY = boards[2].rotations[posRot][i].coord[1];
        //console.log("x(click): "+x+" ,y(click): "+y+"x(DB): "+logicX+" ,y(DB): "+logicY);
        if(logicX === x && logicY === y){
          ok = true;
        }
      }
    }
    return ok;
  }

  function fix(e){
      var coord = calculateCoord(e.clientX,e.clientY);
      var x = (coord.x/boxSize)+Game.minCoor[0];
      var y = (coord.y/boxSize)+Game.minCoor[1];

      if (boards[3] && isValid(x,y) && !Session.get('showRotateTile')){
        var currentMinCoor = {x: Game.minCoor[0], y: Game.minCoor[1]};

        FixedTokens.setToken(new Token(coord.x,coord.y,posRot,boards[3].sprite,[x,y],[currentMinCoor.x,currentMinCoor.y]));

        PushTileMoves.insert({
          move: "Ha colocado ficha",
          x: coord.x,
          y: coord.y,
          posRot: posRot,
          tileID: boards[3].sprite,
          xy: [x,y],
          currentcoord: [currentMinCoor.x,currentMinCoor.y]
        });

        boards.pop();//Elimino la que se mueve porque ya no tiene que pintarse
        //copio el array de dummys
        arrayDummys = posDummyForRotation();
                  //elimino las posibles posiciones
        boards.pop();

        Session.set('fixedToken',true);
        Session.set('showFollowers',true);

      }else if (boards[3] && boards[3].typeObject === 'movingTile' && Session.get('pickTileOK')){
        var text = "Posición no válida,pinchar en uno de los cuadros azules";
        Game.setBoard(4,new Message(text,70,20,650,50,100,50));

      }
    };
    //capturo evento click, crea un objeto Token con coordenadas x e y ya ajustadas y lo mete en el array de fichas fijas
    Game.canvas.addEventListener("click", function(e){fix(e)});

};

//--------------------------------------------------------------------------------------------------
//objeto que contiene el array donde meter las fichas fijadas
FixedTokens = new function(){
  this.tokens = [];

  this.draw = function(ctx){
    for(var i = 0, len = this.tokens.length;i<len;i++){
      if (this.tokens[i]){
        this.tokens[i].draw(ctx);
      }
    }
  };
  this.num_token = function(){
    return this.tokens.length;
  };
  //meter ficha en la coleccion de fichas fijadas
  this.setToken = function(token) { this.tokens.push(token); };
};
//-------------------------------------------------------------------------------------------------------
PossiblePositions = function(minCoor,sprite){

  this.typeObject = "positions";
  this.sprite = sprite;
  this.rotations = new Array();//donde copio la informacion
  this.minCoord = minCoor;

  //resetea la informacion para el siguiente turno
  this.clearInfo = function(){
    boards[2].rotations.splice(0,4);
  };
  //siguiente informacion en llegar
  this.addInfo = function(rotsInfo){

    //meto la informacion de logica
    for(var i =0; i<=3 ;i++){
      var Coor = new Array();

      if(rotsInfo[i].length > 0){//compruebo si hay posicion para la rotacion
        for(var j=0; j<rotsInfo[i].length ;j++){
          props = new Object();
          props.coord = new Array();
          props.coord[0] = rotsInfo[i][j].cell.x; //COLUMNA
          props.coord[1] = rotsInfo[i][j].cell.y; //FILA
          props.dumPos = rotsInfo[i][j].dummyPos;
          Coor.push(props);
        }
        boards[2].rotations.push(Coor);
      }else{
        boards[2].rotations[i] = new Array();
      }
    }
  };

  this.draw = function(ctx){
      if(boards[2].rotations[posRot].length > 0){//añadido el posRot.length

        for(var i = 0;i<boards[2].rotations[posRot].length;i++){
            pos = boards[2].rotations[posRot][i].coord;
            var dx = (pos[0]-Game.minCoor[0])*boxSize;
            var dy = (pos[1]-Game.minCoor[1])*boxSize;
            //console.log("pos[1]: "+pos[1]+" ,pos[0]: "+pos[0]+" ,x: "+dx+" ,y: "+dy);
            SpriteSheet.draw(ctx,this.sprite,dx,dy,boxSize,boxSize,this.typeObject);
        }
      }
  };
}
//----------------------------------------------------------------------------------------------------

function posDummyForRotation(){ //funcion que devuelve el array de dummies para la posicion seleccionada

  for(var i =0; i<=3 ;i++){
    if(boards[2].rotations[i].length > 0){//compruebo si hay posicion para la rotacion
      for(var j=0; j<boards[2].rotations[i].length ;j++){
        if(boards[2].rotations[i][j].coord[0] === boards[1].tokens[boards[1].tokens.length-1].logicCoord[0] && boards[2].rotations[i][j].coord[1] === boards[1].tokens[boards[1].tokens.length-1].logicCoord[1]){//comparar la posicion elegida(fila columna con todas las que me pasaban,devuelvo la j del segundo array)
          var array = boards[2].rotations[i][j].dumPos;
          //console.log("Rotacion: "+i+" ,j: "+j);
          return array;
        }
      }
    }
  }
};

Dummy = function(sprite,minCoor,x,y,logCoor){
  this.sprite = sprite;
  this.pos = [false,false,false,false,false,false,false,false,false];
  this.dx = x;
  this.dy = y;
  this.minCoord = minCoor;
  this.typeObject = "dummy";
  this.logicCoord = logCoor;

  /*this.addInfo = function(){
    this.pos = posDummyForRotation();
  };*/

  this.setDummy = function(pos){

    for(var i=0;i<=8;i++){
      if(i === pos){
        this.pos[i] = true;
        var positionDummy =  i;
      }else{
         this.pos[i] = false;
      }
    }

    switch(positionDummy){

      case 0:
        this.dx = this.dx+(boxSize/3);
        break;
      case 1:
        this.dx = this.dx;
        break;
      case 2:
        this.dy = this.dy+(boxSize/3);
        break;
      case 3:
        this.dy = this.dy+(boxSize/3*2);
        break;
      case 4:
        this.dx = this.dx+(boxSize/3);
        this.dy = this.dy+(boxSize/3*2);
        break;
      case 5:
        this.dx = this.dx+(boxSize/3*2);
        this.dy = this.dy+(boxSize/3*2);
        break;
      case 6:
        this.dx = this.dx+(boxSize/3*2);
        this.dy = this.dy+(boxSize/3);
        break;
      case 7:
        this.dx = this.dx+(boxSize/3*2);
        break;
      case 8:
        this.dx = this.dx+(boxSize/3*2);
        this.dy = this.dy+(boxSize/3*2);
        break;
    }
  };

  this.draw = function(ctx){
    if( (this.logicCoord[0] >= Game.minCoor[0] && this.logicCoord[0] <= Game.maxCoor[0]) && (this.logicCoord[1] >= Game.minCoor[1] && this.logicCoord[1] <= Game.maxCoor[1]) ){
      var x = this.minCoord[0]-Game.minCoor[0];
      var y = this.minCoord[1]-Game.minCoor[1];
      SpriteSheet.draw(ctx,this.sprite,this.dx+(x*boxSize),this.dy+(y*boxSize),boxSize/3,boxSize/3,this.typeObject);
    }
  };
};

Message = function(text,a,b,c,d,x,y){
  this.textToPrint = text;
  this.typeObject = "message";

  this.draw = function(ctx){
    //console.log(a+" "+" "+b+" "+c+" "+d+" "+x+" "+y);
    ctx.font = "bold 22px sans-serif";
    ctx.fillStyle = '#2E64FE';
    ctx.strokeStyle = '#2E64FE';
    ctx.clearRect(a,b,c,d);
    ctx.strokeRect(a,b,c,d);
    ctx.fillText(this.textToPrint,x,y);
  };
};
