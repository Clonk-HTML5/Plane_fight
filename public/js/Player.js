RemotePlayer = function (index, game, player, startX, startY, angle, bullets, bulletX, bulletY, bulletAngle) {

    var x = startX,
     y = startY,
     xBullet = bulletX,
     yBullet = bulletY;

    this.game = game;
    this.bullets = bullets;
    this.player = player;
    this.alive = true;
    
    this.emitter = this.game.add.emitter(this.game.world.centerX, this.game.world.centerY, 400);

    this.emitter.makeParticles( [ 'smoke' ] );

    this.emitter.gravity = 50;
    this.emitter.setAlpha(1, 0, 1000);
    this.emitter.setScale(0.1, 0, 0.05, 0, 1000);

    this.emitter.start(false, 3000, 5);
    
    //  Our bullet group
    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(500, 'bullet2');
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 1);
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('scale.x', 0.5);
    this.bullets.setAll('scale.y', 0.5);
    
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
    
      this.hud = Phaser.Plugin.HUDManager.create(this.game, this, 'gamehud');
      this.healthHUD = this.hud.addBar(0,-50, this.player.width, 10, this.player.health, 'health', this.player, '#ffbd55', false);
      this.healthHUD.bar.anchor.setTo(0.5, 0.5);
      this.player.addChild(this.healthHUD.bar);
    
};

        /**
     * player collides with enemy
     * @param enemy enemy collides
     * @param player player collides
     */
    shootPlayer = function (plane, bullet) {
        // Removes the star from the screen
        bullet.kill();

        plane.health--;
        if (plane.health < 1) {
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
    this.emitter = null;
    this.hud = null;
    this.score = 0;
    this.scoreHUD = null;
    this.disableControls = false;

};

Player.prototype = {

    /**
     * preload function
     */
    preload: function () {
        this.game.load.image('plane3', 'assets/img/sprites/plane3.png');
//        this.game.load.image('smoke', 'assets/img/sprites/smoke.png');
        this.game.load.image('smoke_puff', 'assets/img/sprites/particles/smoke-puff.png');
        this.game.load.image('smoke', 'assets/img/sprites/particles/pump_smoke_04.png');
        this.game.load.image('bullet', 'assets/img/sprites/bullet.png');
        this.game.load.image('bullet2', 'assets/img/sprites/bullet2.png');
    },

    /**
     * create function
     */
    create: function () {
        
        this.emitter = this.game.add.emitter(this.game.world.centerX, this.game.world.centerY, 400);

        this.emitter.makeParticles( [ 'smoke' ] );

        this.emitter.gravity = 50;
        this.emitter.setAlpha(1, 0, 1000);
        this.emitter.setScale(0.1, 0, 0.05, 0, 1000);

        this.emitter.start(false, 3000, 5);
        
        //  Our bullet group
        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(500, 'bullet2');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 1);
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('scale.x', 0.5);
        this.bullets.setAll('scale.y', 0.5);
        

        this.plane = this.game.add.sprite(400, 400, 'plane3');
        this.plane.health = 5;
        this.plane.angle = 0;
        this.plane.scale.setTo(0.6, 0.6);
//        this.plane.scale.x *= -1;
        this.plane.anchor.setTo(0.5, 0.5);
//        this.plane.scale.setTo(0.23, 0.23);
        this.game.physics.enable(this.plane, Phaser.Physics.ARCADE);
//        this.plane.body.collideWorldBounds = true;
        //	Tell it we don't want physics to manage the rotation
//        this.plane.body.allowRotation = false;
        this.plane.body.gravity.y = 50;
        this.plane.body.velocity.setTo(300, 0)
        this.plane.body.maxVelocity.setTo(300, 300);
//        this.plane.bringToTop();
        
        this.scoreText = this.game.add.text(0, 0, '', { fontSize: '32px', fill: '#000' });
        this.scoreText.fixedToCamera = true;
        this.scoreText.cameraOffset.setTo(16, 16);
    
        var style = { font: '18px Arial', fill: '#ffffff', align: 'center'};
      this.hud = Phaser.Plugin.HUDManager.create(this.game, this, 'gamehud');
      this.scoreHUD = this.hud.addText(10, 10, 'Score: ', style, 'score', this);
      this.scoreText.addChild(this.scoreHUD.text);
        
      this.healthHUD = this.hud.addBar(0,-50, this.plane.width, 10, this.plane.health, 'health', this.plane, '#ffbd55', false);
      this.healthHUD.bar.anchor.setTo(0.5, 0.5);
      this.plane.addChild(this.healthHUD.bar);

        this.game.camera.follow(this.plane);

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.game.input.addPointer();
        
        var element = document.getElementsByTagName('canvas')[0],
            _this = this;
        
        var options = {
          preventDefault: true
        };
        var hammertime = new Hammer(element, options);
        hammertime.on("dragup swipeup", function(ev){ 
            _this.game.physics.arcade.velocityFromAngle(_this.plane.angle, 300, _this.plane.body.velocity);
            _this.plane.body.angularVelocity -= 100;
        });        
        hammertime.on("dragdown swipedown", function(ev){ 
            _this.game.physics.arcade.velocityFromAngle(_this.plane.angle, 300, _this.plane.body.velocity);
            _this.plane.body.angularVelocity += 100;
        });
    },

     /**
     * update function
     */
    update: function () {

        this.game.physics.arcade.overlap(this.bullets, bird.birds, this.bulletHitsBird, null, this);
        this.game.physics.arcade.overlap(this.plane, bird.birds, this.playerHitsBird, null, this);
//        console.log(gameInitializer.enemies)
        if(gameInitializer.enemies.length){
            for(var i = 0; i < gameInitializer.enemies.length; i++){
                this.game.physics.arcade.overlap(gameInitializer.enemies[i].player, this.bullets, this.shootPlayer, null, this);
            }
        }
        this.game.physics.arcade.collide(this.plane, level.platforms, null, null, this);
        
        
//        this.plane.body.velocity.setTo(0, 0);
//        this.plane.body.angularAcceleration = 0;
//        this.plane.body.velocity.x = 0;
//        this.plane.body.velocity.y = 0;
        this.plane.body.angularVelocity = 0;
          /**
         * Cursor functions starts
         */
        if (this.cursors.up.isDown) {
            this.game.physics.arcade.velocityFromAngle(this.plane.angle, 600, this.plane.body.velocity);
        } 
//        else if(this.cursors.down.isDown){
//            this.plane.body.velocity.setTo(0, 0)
//        }
        if (this.cursors.left.isDown) {
//            this.plane.body.rotateLeft(100);
            this.game.physics.arcade.velocityFromAngle(this.plane.angle, 300, this.plane.body.velocity);
            this.plane.body.angularVelocity -= 100;
            this.score++;
        } else if (this.cursors.right.isDown) {
            this.game.physics.arcade.velocityFromAngle(this.plane.angle, 300, this.plane.body.velocity);
            this.plane.body.angularVelocity += 100;
//            this.plane.body.rotateRight(100);
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
        {
//            console.log('space')
            this.fireBullet();
        }
        
        
//        if (this.game.input.mousePointer.isDown || this.game.input.pointer1.isDown) {
//            this.plane.rotation = this.game.physics.arcade.moveToPointer(this.plane, 20, this.game.input.activePointer, 500);
////            this.fireBullet();
//        }
        
        var px = this.plane.body.velocity.x;
        var py = this.plane.body.velocity.y;

        px *= -1;
        py *= -1;

        this.emitter.minParticleSpeed.set(px, py);
        this.emitter.maxParticleSpeed.set(px, py);
        
        this.emitter.emitX = this.plane.x;
        this.emitter.emitY = this.plane.y;
        
        
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
//        console.log(plane, bullet)
        gameInitializer.socket.emit("bullet hit player", {playerId: plane.name});
        plane.health --;
        if(plane.health < 1){
            plane.kill();   
        }
    },
    
    fireBullet: function() {

        if (this.game.time.now > this.bulletTime)
        {
            var bullet = this.bullets.getFirstExists(false);

            if (bullet)
            {
                bullet.reset(this.plane.body.x + this.plane.body.width/2, this.plane.body.y + this.plane.body.height/2);
//                bullet.body.velocity.copyFrom(this.game.physics.arcade.velocityFromAngle(this.plane.angle, 1000))
//                bullet.rotation = this.plane.rotation + this.game.math.degToRad(90);
                bullet.lifespan = 2000;
                 bullet.rotation = this.plane.rotation + this.game.math.degToRad(90);
                this.game.physics.arcade.velocityFromRotation(this.plane.rotation, 1000, bullet.body.velocity);
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
        this.plane.score += 10;
    },

    /**
     * player collides with enemy
     * @param enemy enemy collides
     * @param player player collides
     */
    bulletHitsBird: function (bullet, bird) {
        // Removes the star from the screen
        bird.kill();
        bullet.kill()
    },
    
            /**
     * player collides with enemy
     * @param enemy enemy collides
     * @param player player collides
     */
    playerHitsBird: function (plane, bird) {
        // Removes the star from the screen
        bird.kill();
        gameInitializer.socket.emit("bullet hit player", {playerId: plane.name});
        plane.health -= 1
        if(plane.health < 1){
            plane.kill();   
        }
    },
};