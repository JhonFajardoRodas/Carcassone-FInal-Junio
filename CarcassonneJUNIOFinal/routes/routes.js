/*Router.route('/register' , function() {
	this.render('register' , {to: "container"});
});

Router.route('/login' , function() {
	this.render('login', {to: "container"});
});
*/
Router.route('/register' , function() {
	this.render('register' , {to: "container"});
});

/*Router.route('/game' , function() {
	this.render('game', {to: "container"})
},{
	name: 'game',
});*/

Router.configure({
	layoutTemplate: 'main',
});
