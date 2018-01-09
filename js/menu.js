/* menu.js */

var fondo;
var logo;
var comenzar;
var sky;
var day = '#b2ddc8';

var menu = {
    create : function() {
		
        console.log("Pantalla Menu");
		game.stage.backgroundColor = day;
		
		sky =  game.add.tileSprite(0, 0, game.world.width, game.world.height, 'sky');
		logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
		logo.anchor.setTo(0.5);
		
		//game.state.start('play');
		
		comenzar = game.add.text(game.world.centerX, game.world.height - 100, "Comenzar", { font: "25px Press Start 2P", fill: "#ffffff", align: "center" });
		comenzar.anchor.set(0.5);
		comenzar.inputEnabled = true;
		comenzar.events.onInputDown.add(start, this);		
		
    }
	
};

function start(){
	game.state.start('play');
}