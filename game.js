/**************************************************
** NODE.JS REQUIREMENTS
**************************************************/
var util = require("util"),					// Utility resources (logging, object inspection, etc)
	io = require("socket.io"),				// Socket.IO
    http = require("http"),
	Player = require("./Player").Player;	// Player class


/**************************************************
** GAME VARIABLES
**************************************************/
var socket,		// Socket controller
    server = http.createServer().listen(process.env.PORT, process.env.IP),
	players;	// Array of connected players


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Create an empty array to store players
	players = [];

	// Set up Socket.IO to listen on port 8000
	socket = io.listen(8120);
//	socket = io.listen(server);

	// Configure Socket.IO
	socket.configure(function() {
		// Only use WebSockets
		socket.set("transports", ["websocket"]);

		// Restrict log output
		socket.set("log level", 2);
	});

	// Start listening for events
	setEventHandlers();
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Socket.IO
	socket.sockets.on("connection", onSocketConnection);
};

// New socket connection
function onSocketConnection(client) {
	util.log("New player has connected: "+client.id);

	// Listen for client disconnected
	client.on("disconnect", onClientDisconnect);

	// Listen for new player message
	client.on("new player", onNewPlayer);

	// Listen for move player message
	client.on("move player", onMovePlayer);	
    
    // Listen for player fires bullet message
	client.on("fire bullet", onFireBullet);
    
    // Listen for move player message
	client.on("bullet hit player", onBulletHitPlayer);
};

// Socket client has disconnected
function onClientDisconnect() {
	util.log("Player has disconnected: "+this.id + " Players " + playerById(this.id));

	var removePlayer = playerById(this.id);

	// Player not found
	if (!removePlayer) {
		util.log("Player not found: "+this.id);
		return;
	};

	// Remove player from players array
	players.splice(players.indexOf(removePlayer), 1);

	// Broadcast removed player to connected socket clients
	this.broadcast.emit("remove player", {id: this.id});
};

// New player has joined
function onNewPlayer(data) {
    
    util.log("Player ID: "+this.id);
    
	// Create a new player
	var newPlayer = new Player(data.x, data.y, data.angle);
	newPlayer.id = this.id;
    
	// Broadcast new player to connected socket clients
	this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY(), angle: newPlayer.angle});

	// Send existing players to the new player
	var i, existingPlayer;
	for (i = 0; i < players.length; i++) {
		existingPlayer = players[i];
		this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY(), angle: existingPlayer.angle});
	};
		
	// Add new player to the players array
	players.push(newPlayer);
};

// Player has moved
function onMovePlayer(data) {
	// Find player in array
	var movePlayer = playerById(this.id);

	// Player not found
	if (!movePlayer) {
		util.log("Player not found: "+this.id);
		return;
	};

	// Update player position
	movePlayer.setX(data.x);
	movePlayer.setY(data.y);
    movePlayer.angle = data.angle;
    
	// Broadcast updated position to connected socket clients
	this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY(), angle: movePlayer.angle});
};

// Player hasfired a Bullet
function onFireBullet(data) {
	// Find player in array
	var playerHowFired = playerById(this.id);

	// Player not found
	if (!playerHowFired) {
		util.log("Player not found: "+this.id);
		return;
	};

	// Update player position
	playerHowFired.bulletX = data.bulletX;
	playerHowFired.bulletY = data.bulletY;
    playerHowFired.bulletAngle = data.bulletAngle;
    playerHowFired.angle = data.angle;
    
	// Broadcast updated position to connected socket clients
	this.broadcast.emit("fire bullet", {id: playerHowFired.id, bulletX: playerHowFired.bulletX, bulletY: playerHowFired.bulletY, bulletAngle: playerHowFired.bulletAngle, angle: playerHowFired.angle});
};

// Player hasfired a Bullet
function onBulletHitPlayer(data) {
	// Find player in array
	var playerHowFired = playerById(this.id);

	// Player not found
	if (!playerHowFired) {
		util.log("Player not found: "+this.id);
		return;
	};

	// Update player position
//	playerHowFired.bullets = data.bullet
//    playerHowFired.player = data.player;
    
	// Broadcast updated position to connected socket clients
	this.broadcast.emit("bullet hit player", {id: playerHowFired.id, playerId: data.playerId});
};


/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/
// Find player by ID
function playerById(id) {
	var i;
	for (i = 0; i < players.length; i++) {
		if (players[i].id == id)
			return players[i];
	};
	
	return false;
};


/**************************************************
** RUN THE GAME
**************************************************/
init();