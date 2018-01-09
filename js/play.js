/* play.js */
var platforms;
var player;
var obstacle, obstacles;
var palo, palos;
var arriba, arribas;
var explosions;
var playersuelo;
var playerObstacle;
var boom;
var text;
var counter = 0;
var dead = false;
var block = 0;
var go;
var velocity = -320;
var sprite_vel = 4;
var road_vel = -500;
var tiempo_obstaculo = 1.8;
var suelo;
var camino;
var salto;
var nubes;
var music;
var backgroundSprite, sunSprite, moonSprite, bgBitMap;
var day = '#b2ddc8';
var night = '#1f263b';
var btn_salto;

var play = {
	create: function () {
		this.setInitialValues();
		console.log("Play!");
		game.stage.backgroundColor = day;


		sunSprite = game.add.sprite(50, 20, 'sun');
		moonSprite = game.add.sprite(650, 30, 'moon');
		moonSprite.visible = false;


		game.physics.startSystem(Phaser.Physics.ARCADE); //Arcade Physics.

		//salto
		game.input.onTap.add(onTap, this);
		btn_salto = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		/* Sprites fondos */

		sky = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'sky');
		sky.autoScroll(-100, 0);
		
		camino = game.add.tileSprite(0, game.world.height - 37, game.world.width, 37, 'camino');
		camino.autoScroll(road_vel, 0);
		
		nubes = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'nubes');
		nubes.autoScroll(-10, 0);
		
		//sonidos
		boom = game.add.audio('boom');
		salto = game.add.audio('jump');
		music = game.add.audio('music');

		//musica de fondo
		music.play();

		/* Platform group */
		platforms = game.add.group();
		platforms.enableBody = true;

		/* Obstacle group */
		obstacles = game.add.group();
		arribas = game.add.group();
		palos = game.add.group();

		explosions = game.add.group();
		explosions.createMultiple(30, 'kaboom');
		explosions.forEach(setupExplosiones, this);

		//obstacles.body.debug = true;

		/* suelo stuff */
		suelo = platforms.create(0, game.world.height - 37, 'suelo');

		suelo.body.immovable = true;


		/* Player stuff */
		player = game.add.sprite(32, 600, 'player');
		//player = game.add.sprite(80, 670, 'player');
		player.scale.setTo(1, 1);

		game.physics.arcade.enable(player);

		player.body.enable = true;
		player.body.gravity.y = 250;
		player.body.collideWorldBounds = true;
		player.animations.add('walk');
		player.animations.play('walk', 50, true);

		/* Score */
		//scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000'});

		//contador
		text = game.add.text(game.world.width - 107, 28, 'Puntos: 0', {
			font: "17px Press Start 2P",
			fill: "#ffffff",
			align: "center"
		});
		text.anchor.setTo(0.5, 0.5);
		text.inputEnabled = true;
		text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 15);
		text.events.onInputDown.add(gofull, this);

		game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);

		//game over
		go = game.add.text(game.world.centerX, game.world.centerY, "Game Over", {
			font: "65px Press Start 2P",
			fill: "#ffffff",
			align: "center"
		});

		// text.tint = 0xff00033;
		go.anchor.set(0.5);
		go.setShadow(5, 5, 'rgba(0,0,0,0.5)', 15);
		go.inputEnabled = true;
		go.events.onInputDown.add(down, this);
		go.visible = false;

		//creo el primer obtaculo
		/*
		setTimeout(function () {
			addObstacle();
		}, 3000);
		*/
		
		this.generarObstaculos = game.time.events.loop(Phaser.Timer.SECOND * this.tiempo, this.generarObstaculos, this);
    	this.generarObstaculos.timer.start();

	},

	update: function () {
		sprite_vel = sprite_vel + 0.01;
		velocity = velocity - 0.1;
		road_vel = road_vel - 0.3;
		//aca hago un delay negativo y acelero la creacion de obstaculos
		this.generarObstaculos.delay -= 0.1;
		/*
		sky.tilePosition.x -= 2;
		camino.tilePosition.x -= road_vel;
		nubes.tilePosition.x -= 1;
		*/
		//colision con los bloques

		game.physics.arcade.collide(player, arribas, collisionPlayer, null, this);
		game.physics.arcade.collide(player, obstacles, collisionPlayer, null, this);
		playersuelo = game.physics.arcade.collide(player, platforms);
		
		//si salto con el boton
		if (btn_salto.isDown) {
			onTap();
		}
		
		camino.autoScroll(road_vel, 0);
		
		console.log('velocidad:'+road_vel);
	},
	generarObstaculos: function() {  
    	//console.log('generating pipes!');
		addObstacle();
	},
	
	setInitialValues: function(){
		this.tiempo=1.8;
	},

	render: function () {
		/*
		 game.debug.text("Time until event: " + game.time.events.duration.toFixed(0), 32, 32);
    	 game.debug.text("Next tick: " + game.time.events.next.toFixed(0), 32, 64);
		*/
		
	}
};

/**
 * @desc Interact with player.
 */

function collisionPlayer(player, obtacle) {
	//When a bullet hits an alien we kill them both
	obtacle.kill();
	player.kill();
	boom.play();

	var explosion = explosions.getFirstExists(false);
	explosion.reset(player.body.x + 150, player.body.y);
	explosion.play('kaboom', 30, false, true);

	console.log('murio');
	dead = true;
}


function setupExplosiones(obstacle) {
	obstacle.anchor.x = 0.5;
	obstacle.anchor.y = 0.5;
	obstacle.animations.add('kaboom');
}

/**
 * @desc OnTap event.
 * @param {pointer} pointer
 * @param {bool} doubleTap
 */
function onTap(pointer, doubleTap) {
	if (playersuelo) {
		//player.animations.play('jump', 29.5);
		player.body.velocity.y -= 190;
		salto.play();
		if (block > 0) {
			//addObstacle();
		}
	}
}

/**
 * @desc Add obstacle.
 */
function addObstacle() {
	
	var rnd = Math.floor(Math.random() * 5) + 1 
	console.log(rnd);
	if(rnd==3){
		addPoste();
	}else{
		addPiedra();   
	}
	
}


function addPiedra(){
	var obstacle = game.add.sprite(game.world.width, game.world.height - 74, 'obstacle', false)
		obstacles.add(obstacle);
		game.physics.arcade.enable(obstacle);

		obstacle.body.velocity.x = velocity;

		//obstacle.checkWorldBounds = true;
		obstacle.body.collideWorldBounds = false;

		obstacle.body.checkCollision.up = false;
		//obstacle.checkCollision.right = false;
		obstacle.outOfBoundsKill = true;
		
}

function addPoste(){
	var arriba = game.add.sprite(game.world.width, game.world.height - 260, 'arriba', true);
	var palo = game.add.sprite(game.world.width, game.world.height - 235, 'palo', true);
	arribas.add(arriba);
	palos.add(palo);

	game.physics.arcade.enable(arriba,true);
	arriba.body.velocity.x = velocity;
	arriba.body.setSize(118, 75, 50, 30);	
	arriba.body.collideWorldBounds = false;

	game.physics.arcade.enable(palo,true);
	palo.body.velocity.x = velocity;
}

function updateCounter() {

	if (!dead) {
		counter++;
		if (counter > 25) {
			game.stage.backgroundColor = night;
			sunSprite.visible = false;
			moonSprite.visible = true;
		}
		text.setText('Puntos: ' + counter);
	} else {
		go.visible = true;
	}
}

function down(item) {
	//aca se resetea el juego

	item.visible = false;
	counter = 0;
	game.state.restart();
	dead = false;
	sprite_vel = 4;
	velocity = -320;
	road_vel = -250;
	music.pause();
	game.state.start('menu');


}

function borra_obstculo(obs) {
    // kill obstacle after it moves out of bounds
    if (obs.right < game.world.bounds.left) {
      obs.kill();
    }
}


function gofull() {

	game.scale.startFullScreen();

}