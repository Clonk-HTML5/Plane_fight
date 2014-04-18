var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'wormi', { preload: preload, create: create, update: update, render: render});

var player = null;
var bird = null;
var level = null;
var hud = null;
var gameInitializer = null;

function preload()
{
    
	level = new Level(game);
    level.preload();

    player = new Player(game);
    player.preload();
    
    bird = new Bird(game);
    bird.preload();

//    hud = new HUD(game);
}

function create()
{

    level.create();
    player.create();
    bird.create();
//    hud.create();
    
    gameInitializer = new GameInitializer(game);
    gameInitializer.create();
        
}

function update() 
{
    level.update();
    player.update();
    bird.update();
}

function render() {

//    game.debug.spriteInfo(player.plane, 32, 32);
//    game.debug.spriteBounds(player.plane);
//    game.debug.body(player.plane);
//    game.debug.spriteBounds(player.p2SnakeFollower);

}
//
//window.onresize = function(event) {
//    window.resizeGame();
//};
//
//var resizeGame = function () {
// 
//  var height = window.innerHeight;
//  var width = window.innerWidth;
// 
//  game.width = width;
//  game.height = height;
//  game.stage.bounds.width = width;
//  game.stage.bounds.height = height;
// 
//  if (game.renderType === 1) {
//    game.renderer.resize(width, height);
//    Phaser.Canvas.setSmoothingEnabled(game.context, false);
//  }
//}