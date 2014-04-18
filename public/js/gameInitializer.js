
GameInitializer = function(game) {

	this.game = game;
    this.socket;
    //  Create some baddies to waste :)
    this.enemies = [];
};

GameInitializer.prototype = {

	preload: function() {

	},

	create: function() {
        
//        this.socket = io.connect("http://localhost", {port: 8120, transports: ["websocket"]});
//        this.socket = io.connect("http://localhost:8120");
//        this.socket = io.connect("http://192.168.1.5:8120");
//        this.socket = io.connect("http://neumic-asnort.codio.io:8120");
        this.socket = io.connect("http://christian-dev.no-ip.biz:8120");

        // Start listening for events
        this.setEventHandlers();
	},

	update: function() {

	},
    
    setEventHandlers: function() {
        // Socket connection successful
        this.socket.on("connect", this.onSocketConnected);

        // Socket disconnection
        this.socket.on("disconnect", this.onSocketDisconnect);

        // New player message received
        this.socket.on("new player", this.onNewPlayer);

        // Player move message received
        this.socket.on("move player", this.onMovePlayer);
        
        // Player fires bullet message received
        this.socket.on("fire bullet", this.onFireBullet);
        
        // Bullet hits Player message received
        this.socket.on("bullet hit player", this.onBulletHitPlayer);

        // Player removed message received
        this.socket.on("remove player", this.onRemovePlayer);
    },
    
    // Socket connected
    onSocketConnected: function(socket) {
        console.log("Connected to socket server " + socket );

        var bullet = player.bullets.getFirstExists(false)
        // Send local player data to the game server
        gameInitializer.socket.emit("new player", {x: player.plane.x, y:player.plane.y, angle: player.plane.angle, bulletX: bullet.x, bulletY: bullet.y,bulletAngle: bullet.rotation});
//        gameInitializer.socket.emit("new player");
    },

    // Socket disconnected
    onSocketDisconnect: function() {
        console.log("Disconnected from socket server");
    },

    
    // New player
    onNewPlayer: function(data) {
        console.log("New player connected: "+data.id + " players " + gameInitializer.enemies.length);

         var bullet = player.bullets.getFirstExists(false);
        // Add new player to the remote players array data.x, data.y
        gameInitializer.enemies.push(new RemotePlayer(data.id, gameInitializer.game, player.plane, data.x, data.y, player.plane.angle, player.bullets, bullet.x, bullet.y, bullet.rotation));
//        gameInitializer.enemies.push(new Player(gameInitializer.game, data.id));
    },

    // Move player
    onMovePlayer: function(data) {

        var movePlayer = gameInitializer.playerById(data.id);

        // Player not found
        if (!movePlayer) {
            console.log("Player not found: "+data.id);
            return;
        };
        // Update player position
        movePlayer.player.x = data.x;
        movePlayer.player.y = data.y;
        movePlayer.player.angle = data.angle;

    },
    // Player fires Bullet
    onFireBullet: function(data) {

        var playerHowFired = gameInitializer.playerById(data.id);

        // Player not found
        if (!playerHowFired) {
            console.log("Player not found: "+data.id);
            return;
        };
//        console.log(data)
//        console.log(bullet.x, data.bulletX, bullet.rotation, data.bulletAngle)
        // Update player position
        playerHowFired.bullet.x = data.bulletX;
        playerHowFired.bullet.y = data.bulletY;
        playerHowFired.bullet.rotation = data.bulletAngle;
        playerHowFired.bullet.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(data.angle, 1000))

    },
    // Player fires Bullet
    onBulletHitPlayer: function(data) {

        var playerGetsHit = gameInitializer.playerById(data.playerId);
        
        if(playerGetsHit){
            // an other player was shooted
            playerGetsHit.player.health -= 1;
            if(playerGetsHit.player.health < 1){
                playerGetsHit.player.kill();
            }
        }else{
            // i think me was shooted
            player.plane.health -= 1;
            if(player.plane.health < 1){
               player.plane.kill();
            }
        }
        
//        console.log(data)
//        console.log(bullet.x, data.bulletX, bullet.rotation, data.bulletAngle)
        // Update player position
//        playerHowFired.bullet.x = data.bulletX;
//        playerHowFired.bullet.y = data.bulletY;
//        playerHowFired.bullet.rotation = data.bulletAngle;
//        playerHowFired.bullet.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(data.angle, 1000))

    },

    // Remove player
    onRemovePlayer: function(data) {

        var removePlayer = gameInitializer.playerById(data.id);

        // Player not found
        if (!removePlayer) {
            console.log("Player not found: "+data.id);
            return;
        };

        removePlayer.player.kill();

        // Remove player from array
        gameInitializer.enemies.splice(gameInitializer.enemies.indexOf(removePlayer), 1);

    },
        // Find player by ID
        playerById: function(id) {
            var i;
            for (i = 0; i < gameInitializer.enemies.length; i++) {
                if (gameInitializer.enemies[i].player.name == id)
                    return gameInitializer.enemies[i];
            };

            return false;
        }
};