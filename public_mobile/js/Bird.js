

Bird = function(game) {

	this.game = game;
	this.birds = null;
	this.cursors = null;
	
};

Bird.prototype = {

	preload: function () {
        this.game.load.spritesheet('birdie', 'assets/img/bird.png', 189, 169, 3);
	},

	create: function () {
        // create a group for stars
        this.birds = game.add.group();

        //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < 12; i++){        
            var bird = this.birds.create(Math.random() * game.world.width, Math.random() * (game.world.height - 250), 'birdie');
            this.game.physics.enable(bird, Phaser.Physics.ARCADE);
            bird.scale.setTo(0.15, 0.15);
            //  Bird physics properties.
            bird.body.bounce.y = 0.2;
//            bird.body.collideWorldBounds = true;
            bird.angle = 0
            bird.anchor.setTo(0.5,0.5);
            bird.scale.x *= -1;
            bird.animations.add('fly');
       }
	},

	update: function() {

		//  Collide the Bird and the stars with the platforms
    	this.game.physics.arcade.collide(this.birds, level.platforms);
        
            this.birds.forEach( function(bird) {
                //right
                bird.body.velocity.x = Math.random() * 100;
                bird.animations.play('fly', 8, true);
    	   }, this);
	}

};