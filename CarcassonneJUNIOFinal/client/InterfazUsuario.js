
if (Meteor.isClient) {
var numTiles = 70;
var gameID;  //Identificador de partida necesaria para la parte lógica del juego
posRot = 0;
tileID = 0;
var rotInfo;
var currentPlayer = 0;
var Players = new Array();

	//Sesiones para botones
	Session.setDefault('showRotateTile', false);
	Session.setDefault('showFollowers', false);
	Session.setDefault('showPickTile', false);
	Session.setDefault('showPlayers', false);

	//Sesiones estado del turno
	Session.setDefault('pickTileOK', false);
	Session.setDefault('fixedToken', false);
	Session.setDefault('playersUpdate', undefined);
	Session.setDefault('counter', 0);
	//Session.setDefault('endOfTurn', false);


	var createPlayers = function(players){
		var auxPlayer = players;
		var iterator;
		for(iterator=0; iterator<=3; iterator++)
		{
			Players[iterator] = new Object();
			Players[iterator] = {name: auxPlayer[iterator].name,
								   id: auxPlayer[iterator].id,
							     score: 0,
							     followers: 7,
							     turn: false};
		};
		Players[0].turn = true;
		currentPlayer = 0;
	}

  var changeTurn = function(){
    currentPlayer +=1;
    if(currentPlayer > 3){
      currentPlayer = 0;
    }
		$("#JugTurno").html("TURNO DEL JUGADOR -> " + Players[currentPlayer].name)
		//console.log("Cambio turno a-> " + currentPlayer + " -> " + Players[currentPlayer].name)
  }

	var updateScores = function(scores){
		var iterator;
		for(iterator=0; iterator<=3; iterator++)
		{
			Players[iterator].score = scores[iterator];
		}
		Session.set('playersUpdate', Players);
	}

	var updateFollowers = function(followers){
		var iterator;
		for(iterator=0; iterator<=3; iterator++)
		{
			Players[iterator].followers = followers[iterator];
		}
		Session.set('playersUpdate', Players);
	}

	Tracker.autorun(function(){
		if(Session.get('counter') == 2){
			//console.log("IU -> 4 TRACKER: Llamada a canvas")
			$("#JugTurno").html("TURNO DEL JUGADOR -> " + Players[currentPlayer].name)
			initGame(tileID, rotInfo);
			Session.set('playersUpdate', Players);
			Session.set('showPlayers', true);
			if(Players[currentPlayer].id == Meteor.userId()){
				//console.log("Es mi turno (Primer turno)")
				Session.set('showRotateTile', true);
			}
			Session.set('counter', 0);
		}
	});

	Tracker.autorun(function(){
		if(GetTileMoves.findOne({move: "Comienza la partida"})){
				//console.log("Tracker COMIENZA LA PARTIDA");
				StartGame(1);
				$('button#StartGame').hide();
				$('button#crearPartida').hide();
				$("#JugTurno").show()
		}
	});

	Tracker.autorun(function(){
		if(PickTileMoves.find().count()){
			//console.log("Tracker HA SACADO FICHA")
			var array = PickTileMoves.find().fetch();
			var tile = array[PickTileMoves.find().count() -1].tileId
			Game.setBoard(3,new CurrentToken(0,0,tile));
		}
	});

	Tracker.autorun(function(){
		if(PushTileMoves.find().count()){

			if(Players[currentPlayer].id != Meteor.userId()){
			//console.log("Tracker FICHA COLOCADA")
				var array = PushTileMoves.find().fetch();
				var x = array[PushTileMoves.find().count() -1].x
				var y = array[PushTileMoves.find().count() -1].y
				var rot = array[PushTileMoves.find().count() -1].posRot
				var tile = array[PushTileMoves.find().count() -1].tileID
				var xy = array[PushTileMoves.find().count() -1].xy
				var currentcoord = array[PushTileMoves.find().count() -1].currentcoord
				//boards.pop()
				boards[1].setToken(new Token(x, y, rot, tile, xy, currentcoord));
			}
		}
	});

	Tracker.autorun(function(){
		if(PushDummyMoves.find().count()){

			if(Players[currentPlayer].id != Meteor.userId()){
				console.log("Tracker DUMMY COLOCADO")
				var array = PushDummyMoves.find().fetch();
				var currentcoord = array[PushDummyMoves.find().count() -1].currentcoord
				var x = array[PushDummyMoves.find().count() -1].x
				var y = array[PushDummyMoves.find().count() -1].y
				var logiccoord = array[PushDummyMoves.find().count() -1].logiccoord
				var posLastTile = array[PushDummyMoves.find().count() -1].posLastTile
				var posDummy = array[PushDummyMoves.find().count() -1].posDummy
				//console.log("NOS LLEGA: " + logiccoord)
				//boards[1].setToken(new Dummy("player1",currentcoord,x,y,boards[1].logiccoord));
				//boards[1].tokens[posLastTile].setDummy(posDummy);
			}
		}
	});

	Tracker.autorun(function(){
		if(PushTileMovesIA.find().count()){

			if(Players[currentPlayer].id != Meteor.userId()){
				//console.log("Tracker FICHA COLOCADA IA")
				var array = PushTileMovesIA.find().fetch();
				var tile = array[PushTileMovesIA.find().count() -1].tileID
				var rotation = array[PushTileMovesIA.find().count() -1].posRot
				var coorX = array[PushTileMovesIA.find().count() -1].x
				var coorY = array[PushTileMovesIA.find().count() -1].y
				var currentMinCoorTurn = {x: Game.minCoor[0], y: Game.minCoor[1]};
				//boards.pop();
				boards[1].setToken(new Token((coorX-currentMinCoorTurn.x)*boxSize, (coorY-currentMinCoorTurn.y)*boxSize,
				    rotation, tile, [coorX,coorY],[currentMinCoorTurn.x,currentMinCoorTurn.y]));
			}
		}
	});

	Tracker.autorun(function(){
		if(EndTurnMoves.find().count()){
			numTiles -= 1;
			changeTurn();
			var array = EndTurnMoves.find().fetch();
			var scores = array[EndTurnMoves.find().count() -1].scores
			var dums = array[EndTurnMoves.find().count() -1].dums
			updateScores(scores);
			updateFollowers(dums);

			if(Players[currentPlayer].id == Meteor.userId()){
				//console.log("Tracker TERMINADO EL TURNO -> Es mi turno")
				StartTurn();
			}else if(Players[currentPlayer].name == "IA"){
				//console.log("Tracker TERMINADO EL TURNO -> Turno de IA")
				StartTurn();
			//}else{
				//console.log("Tracker TERMINADO EL TURNO -> no es mi turno")
			}
		}

	});

	Tracker.autorun(function(){
		if(EndGame.find().count()){
			//console.log("Tracker TERMINADO EL JUEGO")
			var array = EndGame.find().fetch();
			var scores = array[EndGame.find().count() -1].scores
			var dums = array[EndGame.find().count() -1].dums
			updateScores(scores);
			updateFollowers(dums);
			var scoreAux = 0;
			var winner;
			for(i = 0; i < Players.length;i++){
				if (Players[i].score > scoreAux){
					winner = Players[i].name;
				}
			}
			//Session.set('showPlayers', false)
			$("#container").hide()
			$("#JugTurno").html("GANADOR -> " + winner)
		}

	});



	//Funcion a la que llama Plataforma para comenzar una partida
	//Realiza las llamadas a lógica para coger la información de la partida
	StartGame = function(g_id){
		//var jugadorID = Meteor.userId();
    //console.log("IU -> 2 START GAME\n")
		//console.log("IU -> Jugador id: " + jugadorID + "\n")
		gameID = g_id;
		Meteor.call('getCoords',gameID, function(err, tileInfo){
			//console.log("IU->  3 GetCoords METEOR CALL")
			tileID = tileInfo.tileId;
			rotInfo = tileInfo.coords;
			var counter = Session.get('counter');
			counter++;
			Session.set('counter', counter);
		});
		Meteor.call('getNames', gameID, function(err, players){
      //console.log("IU-> 3 GetNames METEOR CALL")
			createPlayers(players);
			var counter = Session.get('counter');
			counter++;
			Session.set('counter', counter);
		});
	}

	var getPosDummy = function(array){
		for(var i=0; i<=8 ;i++){
			if (array[i] = true){
				return i;
			}
		}
	};

	//Nuevo turno
	var StartTurn= function(){

		if(Players[currentPlayer].name == "IA"){
			if(Players[0].id == Meteor.userId()){
				Meteor.call('getIA',gameID, function(err, info){
					var currentMinCoor = {x: Game.minCoor[0], y: Game.minCoor[1]};
					var tileId = info.tileId;//info.tileId
					var logicCoordX = info.Coord[0];
					var logicCoordY = info.Coord[1];
					var rotation = info.tileRot;//info.tileRot
					var arrayDummy = info.dummyPos //SI NO HAY = NULL
					var scoresIA = info.scores.scores;
					var followersIA = info.scores.dums;
					PushTileMovesIA.insert({
						move: "Ha colocado ficha",
						tileID: info.tileId,
						posRot: rotation,
						x: logicCoordX,
						y: logicCoordY
					});

					/*if(arrayDummy !== null){
						var posLastTile = boards[1].num_token()-1;
						boards[1].setToken(new Dummy("player1",[[currentMinCoorIA.x,currentMinCoorIA.y]],boards[1].tokens[posLastTile].dx,boards[1].tokens[posLastTile].dy,boards[1].tokens[posLastTile].logicCoord));
						posLastTile = boards[1].num_token()-1;//posicion ultima ficha fijada (dummy)
						boards[1].tokens[posLastTile].setDummy(getPosDummy(arrayDummy));
					}*/
					if(numTiles == 1){
						EndGame.insert({
							move: "Ha terminado la partida",
							scores: scoresIA,
							dums: followersIA
						});
					}else{
						EndTurnMoves.insert({
							move: "Ha terminado el turno",
							scores: scoresIA,
							dums: followersIA
						});
					}
				});
			}


		}else{
		//	console.log("IU -> START TURN")
			Meteor.call('getCoords',gameID, function(err, tileInfo){
					tileID = tileInfo.tileId;
					rotInfo = tileInfo.coords;
					Session.set('showPickTile', true);
			});
		}
	}

	//Fin de turno
	var EndOfTurn = function(){
		//console.log("Fin de turno del jugador-> " + Players[currentPlayer].name)
		if(Players[currentPlayer].name != "IA"){
			//console.log("IU -> Final de turno")
			var pos = (boards[1].num_token())-1;
			Meteor.call('setTile',
						gameID,
						boards[1].tokens[pos].logicCoord[0],
						boards[1].tokens[pos].logicCoord[1],
						posRot,
						boards[1].tokens[pos].pos,
						function(err, updateInfo){

				if(numTiles == 1){
					EndGame.insert({
						move: "Ha terminado la partida",
						scores: updateInfo.scores.scores,
						dums: updateInfo.scores.dums
					});
				}else{
					EndTurnMoves.insert({
						move: "Ha terminado el turno",
						scores: updateInfo.scores.scores,
						dums: updateInfo.scores.dums
					});
				}

			});
		}

		//Reiniciamos Sesiones
		Session.set('pickTileOK', false);
		Session.set('showFollowers', false);
		Session.set('fixedToken', false);
		posRot = 0;

	}

	$.validator.setDefaults({
	  rules: {
	    username: {required: true},
	    email: {required: true, email: true},
	    password: {required: true, minlength: 6}
	  },
	  messages: {
	      username: {
	          required: "You must enter an username.",
	      },
	      email: {
	          required: "You must enter an email address.",
	          email: "You have entered an invalid email address."
	      },
	      password: {
	        required: "You must enter a password.",
	        minlength: "Your password must be at least {6} characters"
	      }
	  }
	});

	Template.game.helpers({
		/*register: function(){
			if(Session.get('register')){
				return Session.get('regUser');
			}
		},*/
		players: function(){
			if(Session.get('showPlayers')){
				return Session.get('playersUpdate');
			}
		},
		pickTile: function () {
			return Session.get('showPickTile');
		},
		rotateTile: function () {
			return Session.get('showRotateTile');
		},
		existFollowers: function () {
			return Session.get('showFollowers');
		}
	});

	Template.main.events({
    'click #crearPartida': function (){
			console.log("USERID: " + Meteor.userId())
			$("#crearPartida").hide();
			PlayersPlt.insert({
				id:Meteor.userId() ,
				name : Meteor.users.findOne({_id:Meteor.userId()}).username
			});
			$("#StartGame").show();
			$("#registerLink").hide();
    }
	});

	Template.register.onRendered(function(){
  var validator = $('.BotonReg').validate({
    submitHandler: function(){
      var username = $('[name=username]').val();
			//Session.set("regUser", username)
      var email = $('[name=email]').val();
      var password = $('[name=password]').val();
      Accounts.createUser({
          username: username,
          email: email,
          password: password,
        }, function(error){
          if(error){
            if(error.reason == "Username already exists."){
              validator.showErrors({
                  username: "That username already belongs to a registered user."
              });
            }
            if(error.reason == "Email already exists."){
              validator.showErrors({
                  email: "That email already belongs to a registered user."
              });
            }
          }else{
            Router.go("/");
          }
      });

    }

  });
});



	Template.game.events({
		'click button#StartGame': function () {
			var playersAux = PlayersPlt.find().fetch()
			for(i = 0; i < playersAux.length;i++){
				if (playersAux[i].id == Meteor.userId()){
					Meteor.call("startGame", playersAux, 1, function(err){
							if(err){
								console.log("ERROR: " + err);
							}
					});

				}
			}
			GetTileMoves.insert({
				move: "Comienza la partida"
			});
		},

		//DAME FICHA
		'click button#PickTile': function () {
				var currentMinCoor = {x: Game.minCoor[0], y: Game.minCoor[1]};
				Game.setBoard(2,new PossiblePositions([currentMinCoor.x,currentMinCoor.y],"valid"));//creo objeto rotaciones
				boards[2].addInfo(rotInfo);
				PickTileMoves.insert({
					move: "Ha sacado ficha",
					tileId: tileID
				});
				Session.set('showPickTile', false);
				Session.set('showRotateTile', true);
		},

		//ROTAR FICHA
		'click button#RotateTile': function () {
			posRot += 1;
			if(posRot > 3)
			{
				posRot = 0;
			}
		},

		//ROTACION ELEGIDA
		'click button#Ok': function () {
			if (rotInfo[posRot].length > 0){
				Session.set('pickTileOK', true);
				Session.set('showRotateTile', false);
			}else{
				alert("Confirmar una rotacion con posible colocacion");
			}
		},

		//TERMINAR TURNO
		'click button#Terminar': function () {

			EndOfTurn();
			$('button#Terminar').hide();

		},

  });
}
