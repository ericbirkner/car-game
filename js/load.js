/* load.js */
var logo;
var load = {
    preload : function() {
        console.log("Loading!");
		
		//text2 = game.add.text(32, 32, 'Loading...', { fill: '#ffffff' }); 
		logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
		logo.anchor.setTo(0.5);
		
        game.load.image('sky', 'assets/fondo.jpg');
        game.load.image('ground', 'assets/platform.png');
        //game.load.image('obstacle', 'assets/obstacle.png');
		game.load.image('obstacle', 'assets/roca.png');
		game.load.image('player', 'assets/car.png');
		game.load.spritesheet('kaboom', 'assets/explode.png', 128, 128);
        
		game.load.audio('boom', 'sound/boom.mp3');
		game.load.audio('jump', 'sound/jump.ogg');
		
		game.load.audio('music', 'sound/8-bit-music-loop.mp3');
		
		game.load.image('mountains-back', 'assets/mountains-back.png');
    	game.load.image('mountains-mid1', 'assets/mountains-mid1.png');
    	game.load.image('mountains-mid2', 'assets/mountains-mid2.png');
		
		game.load.image('sun', 'assets/sun.png');
        game.load.image('moon', 'assets/moon.png');
		
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    },

    create : function() {
		
        game.state.start('menu');
    }
};