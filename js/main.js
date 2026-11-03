testExp = new RegExp('Android|webOS|iPhone|iPad|' +
    		       'BlackBerry|Windows Phone|'  +
    		       'Opera Mini|IEMobile|Mobile' ,
    		      'i');

window.scrollTo(0, 1);

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
