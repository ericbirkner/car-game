/* load.js */
var text2;
var load = {
    preload : function() {
        console.log("Loading!");

		text2 = game.add.text(game.world.centerX, game.world.centerY, "Cargando...", { font: "25px Press Start 2P", fill: "#ffffff", align: "center" });
		text2.anchor.setTo(0.5, 0.5);

        game.load.image('sky', 'assets/Montana_2.png');
        game.load.image('suelo', 'assets/suelo.png');
		game.load.image('camino', 'assets/camino.png');
		game.load.image('arriba', 'assets/arriba.png');
		game.load.image('palo', 'assets/palo.png');

		game.load.image('obstacle', 'assets/roca.png');

		//game.load.image('player', 'assets/car.png');
		game.load.spritesheet('kaboom', 'assets/explode.png', 128, 128);

		game.load.spritesheet('player', 'assets/car_sprite.png', 204, 87);

		game.load.audio('boom', 'sound/boom.mp3');
		game.load.audio('jump', 'sound/jump.ogg');

		game.load.audio('music', 'sound/8-bit-music-loop.mp3');

		/*
		game.load.image('mountains-back', 'assets/mountains-back.png');
    	game.load.image('mountains-mid1', 'assets/mountains-mid1.png');
    	game.load.image('mountains-mid2', 'assets/mountains-mid2.png');
		*/
		game.load.image('sun', 'assets/sun.png');
        game.load.image('moon', 'assets/moon.png');

		game.load.image('logo', 'assets/logo_final.png');

		game.load.image('nubes', 'assets/nubes.png');

		
    },

    create : function() {
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.state.start('menu');
    }
};
