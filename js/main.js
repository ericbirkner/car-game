testExp = new RegExp('Android|webOS|iPhone|iPad|' +
    		       'BlackBerry|Windows Phone|'  +
    		       'Opera Mini|IEMobile|Mobile' ,
    		      'i');

window.scrollTo(0, 1);

window.boot = {
    preload: function () {
        game.load.image('icon', 'assets/logo8bit.png');
    },
    create: function () {
        var icon = game.add.sprite(game.world.centerX, game.world.centerY, 'icon');
        icon.anchor.setTo(0.5, 0.5);
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.state.start('load');
    }
};

var config = {
    width: 1080,
    height: 720,
    renderer: Phaser.AUTO
};


if (testExp.test(navigator.userAgent)){
  var config = {
      width: 1080,
      height: 720,
      renderer: Phaser.CANVAS
  };
}


var game = new Phaser.Game(config);


game.state.add('boot', window.boot);
game.state.add('load', window.load);
game.state.add('menu', window.menu);
game.state.add('play', window.play);

game.state.start('boot');
