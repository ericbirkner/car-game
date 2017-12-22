testExp = new RegExp('Android|webOS|iPhone|iPad|' +
    		       'BlackBerry|Windows Phone|'  +
    		       'Opera Mini|IEMobile|Mobile' , 
    		      'i');

var config = {
    width: 1080,
    height: 720,
    renderer: Phaser.AUTO
};


if (testExp.test(navigator.userAgent)){
     var game = new Phaser.Game(window.screen.availWidth * window.devicePixelRatio, window.screen.availHeight * window.devicePixelRatio, Phaser.CANVAS, 'game');
	 //alert('mobile');
}else{
      var game = new Phaser.Game(config);
}

 



game.state.add('boot', boot);
game.state.add('load', load);
game.state.add('menu', menu);
game.state.add('play', play);

game.state.start('boot');