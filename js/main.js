var config = {
    width: 1080,
    height: 720,
    renderer: Phaser.AUTO
};

var game = new Phaser.Game(config);

game.state.add('boot', boot);
game.state.add('load', load);
game.state.add('play', play);

game.state.start('boot');