/* Boot.js */

var boot = {
    preload : function() {
        console.log("Booting!");
    },
    
    create : function() {
        game.state.start('load');
    }
};