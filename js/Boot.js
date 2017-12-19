/* Boot.js */
var boot = {
    preload : function() {
        console.log("Booting!");
		logo = game.load.image('logo', 'assets/logo8bit.png');
    },
    
    create : function() {
        game.state.start('load');
    }
};