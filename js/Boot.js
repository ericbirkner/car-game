/* boot.js */
var icon;
var boot = {
    preload : function() {
        console.log("Booting!");
		game.load.image('icon', 'assets/logo8bit.png');
		
		
    },
    
    create : function() {
		icon = game.add.sprite(game.world.centerX, game.world.centerY, 'icon');
		icon.anchor.setTo(0.5, 0.5);
        game.state.start('load');
    }
};