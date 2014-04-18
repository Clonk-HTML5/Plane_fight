HUD = function(game) {
	this.game = game;
	this.score = 0;
	this.scoreText = null;
    this.playerHealth = 100;
    this.playerHealthText = null;
};

HUD.prototype = {

	create: function() {
        
		this.scoreText = this.game.add.text(0, 0, 'Score: 0', { fontSize: '32px', fill: '#000' });
        this.scoreText.fixedToCamera = true;
        this.scoreText.cameraOffset.setTo(16, 16);
        
        this.playerHealthText = this.game.add.text(0, 0, 'Health: ' + this.playerHealth, { fontSize: '32px', fill: '#000' });
        this.playerHealthText.fixedToCamera = true;
        this.playerHealthText.cameraOffset.setTo(650, 16);
	},

};