/* boot.js */

var boot = {
    preload : function() {
        console.log("Booting!");
		game.load.image('logo', 'assets/logo8bit.png');
    },
    
    create : function() {
        game.state.start('load');
    }
};