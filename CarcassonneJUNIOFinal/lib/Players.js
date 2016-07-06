/////////////////////////////
//    PLAYERS OBJECT     //
/////////////////////////////

Max_Players = 4 ;
Max_Dummies = 7 ;

Players = function(ids )  {
	this.players = this.init(ids) ;
	this.n = 0 ;				 // Current player's index in players[]
	this.currentPlayer = this.players[0];    // Current player, changes each turn.
}

Players.prototype.init = function(ids ){

  	var arry = new Array() ;

	for ( var i = 0 ; i < Max_Players ; i++){
	    	if (ids[i]) {
	     		arry.push(new Player(ids[i].id)) ;
	     	}else{
	     		arry.push(new Player(i) ) ;
	     	}
   	}
  	return arry ;
}

Players.prototype.names = function() {

	var arry = new Array() ;
	for ( var i = 0 ; i < Max_Players ; i++ ){
		arry.push( {name: this.players[i].name , id: this.players[i].id} );
	}
	return arry ;
}

Players.prototype.scores = function() {
	var arryS = new Array() ;
	var arryD = new Array() ;
	for ( var i = 0 ; i < Max_Players ; i++ ){
		arryS.push( this.players[i].score ) ;
		arryD.push( this.players[i].remainingDums() ) ;
	}

	var data = {
		scores : [] ,
		dums : []
	}

	data.scores = arryS ;
	data.dums = arryD ;

	return data ;
}

Players.prototype.next = function() {
   	this.n++ ;
   	this.n = this.n % Max_Players ;
   	this.currentPlayer = this.players[this.n] ;
}

Players.prototype.getPlayerById = function(id) {

	if (!this.players.length) {
		throw new Error(" Empty players array") ;
	}

	for (i = 0 ; i < Max_Players ; i++) {
		if (this.players[i].id == id){
			return this.players[i] ;
		}
	}
	return null ;
}


//////////////////////////
//    PLAYER OBJECT     //
//////////////////////////

// The id = 1..Max_Players means IA player.

IAid = function(id){
	if (id > -1 && id < Max_Players) {
		return true ;
	} else {
		return false ;
	}
}


Player = function(id)  {
	this.id = id;

	if ( !IAid(id)){
		this.name = Meteor.users.findOne({_id:id}).username
		//this.name = Meteor.users.findOne({_id:id}).profile.user ;
	//	this.name = "Name" ;
		if (!this.name){			// check if user id is found
			throw new Error("For " + id + " name not found in Meteor.users");
		}
	}else {
		this.name =  "IA" ;
	}
	this.score = 0 ;
	this.dummies = this.initDummies() ;
}

Player.prototype.isIA = function(){
	if (IAid(this.id)){
		return true ;
	}
	return false ;
}

Player.prototype.initDummies = function() {
	var arry = new Array() ;
	for ( var i = 0 ; i < Max_Dummies ; i++) {
		arry.push ( new Dummy(this.id , i) );
	}
	return arry ;
}

Player.prototype.getNewDummy = function () {
	for ( var i = 0 ; i < Max_Dummies ; i++) {
		if ( this.dummies[i].coord == null ){
			return this.dummies[i] ;
		}
	}
	return null ;
}

Player.prototype.remainingDums = function () {
	var n = 0 ;
	for (var i = 0 ; i < Max_Dummies ; i++ ){
		if ( this.dummies[i].coord == null )
			n++ ;
	}
	return n ;
}

Player.prototype.incScoreBy = function (n){
	this.score = this.score + n ;
}
