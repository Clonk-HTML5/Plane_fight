RemotePlayer = function (index, game, player, startX, startY, angle, bullets, bulletX, bulletY, bulletAngle) {

    var x = startX,
     y = startY,
     xBullet = bulletX,
     yBullet = bulletY;

    this.game = game;
    this.bullets = bullets;
    this.player = player;
    this.alive = true;
    
    //  Our bullet group
//    this.bullets = this.game.add.group();
//    this.bullets.enableBody = true;
//    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullet = this.game.add.sprite(xBullet, yBullet, 'bullet');
     this.game.physics.enable(this.bullet, Phaser.Physics.ARCADE);
    
//    this.bullets.createMultiple(500, 'bullet');
//    this.bullets.setAll('anchor.x', 0.5);
//    this.bullets.setAll('anchor.y', 1);
//    this.bullets.setAll('checkWorldBounds', true);
//    this.bullets.setAll('outOfBoundsKill', true);
    
    this.player = this.game.add.sprite(x, y, 'plane3');
    this.player.health = player.health;
    this.player.name = index.toString();
    
    this.player.angle = angle;
    this.player.scale.setTo(player.scale.x, player.scale.y);
//        this.plane.scale.x *= -1;
    this.player.anchor.setTo(player.anchor.x, player.anchor.y);
//        this.plane.scale.setTo(0.23, 0.23);
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.body.collideWorldBounds = true;
};

        /**
     * player collides with enemy
     * @param enemy enemy collides
     * @param player player collides
     */
    shootPlayer = function (plane, bullet) {
        // Removes the star from the screen
        bullet.kill();

        hud.playerHealth -= 5;
        if (hud.playerHealth >= 0) {
            hud.playerHealthText.setText('Health: ' + hud.playerHealth);
        } else {
            plane.kill();
        }
    };


/**
 * Player constructor
 * @constructor
 */
Player = function (game) {

    this.game = game;
    this.cursors = null;
    this.plane = null;
    this.bullets = null;
    this.bulletTime = 0;
    this.disableControls = false;

};

Player.prototype = {

    /**
     * preload function
     */
    preload: function () {
        this.game.load.image('plane3', 'assets/img/plane3.png');
        this.game.load.image('bullet', 'assets/img/bullet.png');
    },

    /**
     * create function
     */
    create: function () {
        
        //  Our bullet group
        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(500, 'bullet');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 1);
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.setAll('outOfBoundsKill', true);
        

        this.plane = this.game.add.sprite(400, 400, 'plane3');
        this.plane.health = 5;
        this.plane.angle = 0;
        this.plane.scale.setTo(0.6, 0.6);
//        this.plane.scale.x *= -1;
        this.plane.anchor.setTo(0.5, 0.5);
//        this.plane.scale.setTo(0.23, 0.23);
        this.game.physics.enable(this.plane, Phaser.Physics.ARCADE);
        this.plane.body.collideWorldBounds = true;
        //	Tell it we don't want physics to manage the rotation
//        this.plane.body.allowRotation = false;
//        this.plane.body.gravity.y = 50;
        this.plane.body.maxVelocity.setTo(300, 300);
//        this.plane.bringToTop();
        
        
//      this.score = 0;
//        var style = { font: '18px Arial', fill: '#ffffff', align: 'center'};
//      this.hud = Phaser.Plugins.HUDManager.createHud(this.game, this, 'gamehud');
//      this.scoreHUD = this.hud.addText(10, 10, 'Score: ', style, 'score', this);
//      this.game.add.existing(this.scoreHUD.text);
        
        
        this.game.camera.follow(this.plane);

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.game.input.addPointer();
        
        
        
        // Init game controller with left thumb stick
        GameController.init({
            left: {
                type: 'joystick',
                joystick: {
                    touchStart: function() {
                        // Don't need this, but the event is here if you want it.
                    },
                    touchMove: function(joystick_details) {
                        this.game.input.joystickLeft = joystick_details;
                    },
                    touchEnd: function() {
                        this.game.input.joystickLeft = null;
                    }
                }
            },
            right: {
                // We're not using anything on the right for this demo, but you can add buttons, etc.
                // See https://github.com/austinhallock/html5-virtual-game-controller/ for examples.
                type: 'none'
            }
        });
        
        // This is an ugly hack to get this to show up over the Phaser Canvas
        // (which has a manually set z-index in the example code) and position it in the right place,
        // because it's positioned relatively...
        // You probably don't need to do this in your game unless your game's canvas is positioned in a manner
        // similar to this example page, where the canvas isn't the whole screen.
    $('canvas').last().css('z-index', 20);
    $('canvas').last().offset( $('canvas').first().offset() );
        
    },

     /**
     * update function
     */
    update: function () {

//        this.game.physics.arcade.overlap(this.plane, bird.birds, this.collideEnemy, null, this);
//        this.game.physics.arcade.overlap(this.plane, level.stars, this.collectStar, null, this);
//        console.log(gameInitializer.enemies)
        for(var i = 0; i < gameInitializer.enemies.length; i++){
            this.game.physics.arcade.overlap(gameInitializer.enemies[i].player, this.bullets, this.shootPlayer, null, this);
        }
        this.game.physics.arcade.collide(this.plane, level.platforms, null, null, this);
        
        
//        this.plane.body.velocity.setTo(0, 0);
//        this.plane.body.angularAcceleration = 0;
        this.plane.body.velocity.x = 0;
        this.plane.body.velocity.y = 0;
        this.plane.body.angularVelocity = 0;
          /**
         * Cursor functions starts
         */
        if (this.cursors.up.isDown) {
            this.game.physics.arcade.velocityFromAngle(this.plane.angle, 300, this.plane.body.velocity);
        } else if(this.cursors.down.isDown){
            this.plane.body.velocity.setTo(0, 0)
        }
        if (this.cursors.left.isDown) {
//            this.plane.body.rotateLeft(100);
            this.plane.body.angularVelocity -= 100;
        } else if (this.cursors.right.isDown) {
            this.plane.body.angularVelocity += 100;
//            this.plane.body.rotateRight(100);
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
        {
//            console.log('space')
            this.fireBullet();
        }
        
        
        // Check key states every frame.
        if (game.input.joystickLeft) {
            // Move the ufo using the joystick's normalizedX and Y values,
            // which range from -1 to 1.
            this.plane.body.velocity.setTo(this.game.input.joystickLeft.normalizedX * 200, this.game.input.joystickLeft.normalizedY  * 200 * -1);
        }
        else {
            this.plane.body.velocity.setTo(0, 0);
        }
        if (this.game.input.mousePointer.isDown || this.game.input.pointer1.isDown) {
//            this.plane.rotation = this.game.physics.arcade.moveToPointer(this.plane, 20, this.game.input.activePointer, 500);
            this.fireBullet();
        }
        
        gameInitializer.socket.emit("move player", {x: this.plane.x, y:this.plane.y, angle: this.plane.angle});
        
    },
    
        /**
     * player collides with enemy
     * @param enemy enemy collides
     * @param player player collides
     */
    shootPlayer: function (plane, bullet) {
        // Removes the star from the screen
        bullet.kill();
        console.log(plane, bullet)
        gameInitializer.socket.emit("bullet hit player", {playerId: plane.name});
        plane.health -= 1
        if(plane.health < 1){
            plane.kill();   
        }
//        hud.playerHealth -= 5;
//        if (hud.playerHealth >= 0) {
//            hud.playerHealthText.setText('Health: ' + hud.playerHealth);
//        } else {
//            plane.kill();
//        }
    },
    
    fireBullet: function() {

        if (this.game.time.now > this.bulletTime)
        {
            var bullet = this.bullets.getFirstExists(false);

            if (bullet)
            {
                bullet.reset(this.plane.body.x + this.plane.body.width/2, this.plane.body.y + this.plane.body.height/2);
                bullet.body.velocity.copyFrom(this.game.physics.arcade.velocityFromAngle(this.plane.angle, 1000))
                bullet.rotation = this.plane.rotation + this.game.math.degToRad(90);
                this.bulletTime = this.game.time.now + 250;
                gameInitializer.socket.emit("fire bullet", {bulletX: bullet.x,bulletY: bullet.y, bulletAngle: bullet.rotation, angle: this.plane.angle});
            }
        }

    },

    /**
     * player collides with star
     * @param player player collides
     * @param star star collides
     */
    collectStar: function (player, star) {
        // Removes the star from the screen
        star.kill();

        //  Add and update the score
        hud.score += 10;
        hud.scoreText.setText('Score: ' + hud.score);
    },

    /**
     * player collides with enemy
     * @param enemy enemy collides
     * @param player player collides
     */
    collideEnemy: function (worm, bird) {
        // Removes the star from the screen
        bird.kill();

        hud.playerHealth -= 5;
        if (hud.playerHealth >= 0) {
            hud.playerHealthText.setText('Health: ' + hud.playerHealth);
        } else {
            worm.kill();
        }
    },
};