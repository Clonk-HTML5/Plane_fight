
Level = function(game) {

	this.game = game;

	this.platforms = null;
	this.stars = null;
    this.rockEmitter = null;
};

Level.prototype = {

	preload: function() {
        this.game.load.image('sky', 'assets/img/level/sky.png');
        this.game.load.image('sky_new', 'assets/img/level/sky_new.png');
        this.game.load.image('clouds', 'assets/img/level/whiteclouds.png');
        this.game.load.image('clouds1', 'assets/img/level/cloud_fluffy_1.png');
        this.game.load.image('clouds2', 'assets/img/level/cloud_fluffy_2.png');
        this.game.load.image('ground', 'assets/img/level/crosssection_long_new.png');
//        this.game.load.image('tree0', 'assets/img/level/tree_canopy_single_1.png');
//        this.game.load.image('tree0', 'assets/img/level/trees/obj_trees1_001.png');
//        this.game.load.image('tree1', 'assets/img/level/trees/obj_trees1_002.png');
//        this.game.load.image('tree2', 'assets/img/level/trees/obj_trees1_003.png');
//        this.game.load.image('tree3', 'assets/img/level/trees/obj_trees1_004.png');
//        this.game.load.image('tree4', 'assets/img/level/trees/obj_trees1_005.png');
        this.game.load.image('tree0', 'assets/img/level/trees/tree_coniferous_1.png');
        this.game.load.image('tree1', 'assets/img/level/trees/tree_coniferous_3.png');
        this.game.load.image('tree2', 'assets/img/level/trees/tree_coniferous_4.png');
        this.game.load.image('tree3', 'assets/img/level/trees/tree_coniferous_4.png');
        this.game.load.image('tree4', 'assets/img/level/trees/tree_deciduous3.png');
        
        
        this.game.load.image('mountains', 'assets/img/level/mountains.png');
        
        //	Load our physcs data exported from PhysicsEditor
        // 	this.game.load.physics('terrainPD', 'assets/physics/terrain.json');
//        this.game.load.physics('bigTerrain', 'assets/physics/bigTerrain.json');
//        this.game.load.physics('bigTerrainSmaller', 'assets/physics/bigTerrainSmaller.json');
	},

	create: function() {

            //  A simple background for our game
//            var background = this.game.add.sprite(0, 0, 'sky');
            var background = this.game.add.sprite(0, 0, 'sky_new');
            background.fixedToCamera = true;
            background.cameraOffset.x = 0;
            background.cameraOffset.y = 0; 
        
            var mountains = this.game.add.sprite(0, 482, 'mountains');
            var mountains2 = this.game.add.sprite(2560, 482, 'mountains');
        

//            clouds.fixedToCamera = true;
//            clouds.cameraOffset.x = 200;
//            clouds.cameraOffset.y = 200;

        //    var parralax = this.game.add.sprite(0, 0, 'parralax');
        //    parralax.fixedToCamera = true;
        //    parralax.cameraOffset.x = 200;
        //    parralax.cameraOffset.y = 0;
        
            this.game.world.setBounds(0, 0, 4000, 1000);
        
            //  The platforms group contains the ground and the 2 ledges we can jump on
        this.platforms = this.game.add.group();
        
        var lastGroundYPos = 0;
        
        for(i = 0; i < 25; i++){
            
            treeName = 'tree'+Math.round(Math.random() * 4);
            
            var tree = this.game.add.sprite(Math.random() * this.game.world.width, 716, treeName);
            tree.scale.setTo(0.25, 0.25);
            
            var clouds = this.game.add.sprite(Math.random() * this.game.world.width, Math.random() * this.game.world.height - 400, 'clouds1');
            var clouds2 = this.game.add.sprite(Math.random() * this.game.world.width, Math.random() * this.game.world.height - 400, 'clouds2');
        }
        
	    while (lastGroundYPos < this.game.world.width){
            // Here we create the ground.
            var ground = this.platforms.create(lastGroundYPos, this.game.world.height - 132, 'ground');
            ground.scale.setTo(1, 1);
            ground.name = 'ground';
            this.game.physics.enable(ground, Phaser.Physics.ARCADE);
            //  This stops it from falling away when you jump on it
            ground.body.immovable = true; 
            
            lastGroundYPos += ground.width;
        }

//            var grasGround = this.game.add.sprite(0, 550, 'MiddleGround');
//            grasGround.scale.setTo(1, 0.6);
        
//        var roundHut = this.game.add.sprite(650, 790, 'rountHut');
//            roundHut.scale.setTo(1.25, 1.25);
        
//        var grasGround = this.game.add.sprite(0, 850, 'gras');
//        grasGround.scale.setTo(1, 0.5);
	},

	update: function() {
	},

};