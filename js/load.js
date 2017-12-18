/* Load.js */
var load = {
    preload : function() {
        console.log("Loading!");
		
        game.load.image('sky', 'assets/fondo.jpg');
        game.load.image('ground', 'assets/platform.png');
        //game.load.image('obstacle', 'assets/obstacle.png');
		game.load.image('obstacle', 'assets/bloque.png');
		game.load.image('player', 'assets/car.png');
		game.load.spritesheet('kaboom', 'assets/explode.png', 128, 128);
        //game.load.atlas('player', 'assets/sprites/spriteatlas.png', 'assets/sprites/spriteatlas.json'); //Spriteatlas. 
		game.load.audio('boom', 'sound/boom.mp3');
		game.load.audio('jump', 'sound/jump.ogg');
		
		game.load.audio('music', 'sound/8-bit-music-loop.mp3');
		
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    },

    create : function() {
        game.state.start('play');
    }
};