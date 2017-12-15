/* Game.js */

var platforms;
var player;
var obstacle;
var obstacles;
var explosions;
var playerGround;
var playerObstacle;
var boom;
var text;
var counter = 0;
var dead = false;
var block = 0;

var play = {
    create : function() {
        
		game.physics.startSystem(Phaser.Physics.ARCADE); //Arcade Physics.
        game.input.onTap.add(onTap, this);
        
        /* Sprites for backgrounds */
        //sky = game.add.sprite(0, 0, 'sky');
		sky =  game.add.tileSprite(0, -32, game.world.bounds.width, 720, 'sky');
    	boom = game.add.audio('boom');
		
        /* Platform group */
        platforms = game.add.group();
        platforms.enableBody = true;
    
        /* Obstacle group */
        obstacles = game.add.group();
		
		explosions = game.add.group();
		explosions.createMultiple(30, 'kaboom');
		explosions.forEach(setupExplosiones, this);

        //obstacles.body.debug = true;

        /* Ground stuff */
        var ground = platforms.create(0, game.world.height - 32, 'ground');
        ground.scale.setTo(1, 1);
        ground.body.immovable = true;
    
        /* Player stuff */
		player = game.add.sprite(32, 600, 'player');
		//player = game.add.sprite(80, 670, 'player');
        player.scale.setTo(1, 1);
    	
        game.physics.arcade.enable(player);
        
        player.body.enable = true;
        player.body.gravity.y = 250;
        player.body.collideWorldBounds = true;
        
        //player.body.setSize(260, 400, 100, 40); //Correc tsize.
    
        /*
		player.animations.add('death', Phaser.Animation.generateFrameNames('Death (', 1, 30, ")"), 0, false);
        player.animations.add('jump', Phaser.Animation.generateFrameNames('Jump (', 1, 30, ")"), 0, false);
        
        player.animations.add('idle', Phaser.Animation.generateFrameNames('Idle (', 1, 16, ")"), 0, true);
        player.animations.add('run', Phaser.Animation.generateFrameNames('Run (', 1, 20, ")"), 0, true);
        player.animations.add('walk', Phaser.Animation.generateFrameNames('Walk (', 1, 20, ")"), 0, true);
    
        player.animations.play('run', 60); //Play starting off.
    	*/
		
        /* Score */
        //scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000'});
		//contador
		text = game.add.text(game.world.width - 74, 24, 'Counter: 0', { font: "24px Arial", fill: "#ffffff", align: "center" });
    	text.anchor.setTo(0.5, 0.5);
		game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);
		
		
		//creo el primer obtaculo
		setTimeout(function(){ addObstacle(game.world.width, game.world.height - 74); }, 3000);
		
		
    },

    update : function() {
		sky.tilePosition.x -= 3;
		//colision con los bloques
		game.physics.arcade.overlap(player, obstacles, collisionPlayer, null, this);
        playerGround = game.physics.arcade.collide(player, platforms);	
               
    },
	
	render :function(){
		 game.debug.text("Time until event: " + game.time.events.duration.toFixed(0), 32, 32);
    	 game.debug.text("Next tick: " + game.time.events.next.toFixed(0), 32, 64);
	}
};

/**
 * @desc Interact with player.
 */

function collisionPlayer (player, obtacle) {
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

function setupExplosiones (obstacle) {
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
    if (playerGround) {
        //player.animations.play('jump', 29.5);
        player.body.velocity.y -= 200;
		
		if(block>0){
        	addObstacle(game.world.width, game.world.height - 74);
		}
			/*
        player.animations.currentAnim.onComplete.add(function () {
            //player.animations.play('run', 60);
        });
		*/    }
}

/**
 * @desc Add obstacle.
 */
function addObstacle(x, y) {
	var obstacle = game.add.sprite(x, y, 'obstacle', false)
    
    obstacles.add(obstacle);
    game.physics.arcade.enable(obstacle);
    
    obstacle.body.velocity.x = -320;
    
    obstacle.checkWorldBounds = true;
    obstacle.outOfBoundsKill = true;
	block++;
}

function updateCounter() {
	
	if(!dead){
    	counter++;
		text.setText('Counter: ' + counter);
	}	
}
