/* menu.js */

var fondo;
var logo;
var comenzar;
var sky;
var day = "#b2ddc8";
var tween;
var ani;

window.menu = {
  create: function () {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    console.log("Pantalla Menu");
    game.stage.backgroundColor = day;

    sky = game.add.tileSprite(0, 0, game.world.width, game.world.height, "sky");
    logo = game.add.sprite(game.world.centerX, 100, "logo");
    logo.anchor.setTo(0.5);

    tween = game.add
      .tween(logo)
      .to({ y: game.world.centerY - 50 }, 2000, Phaser.Easing.Bounce.Out, true);

    comenzar = game.add.text(
      game.world.centerX,
      game.world.height - 200,
      "Comenzar",
      { font: "27px Press Start 2P", fill: "#ffffff", align: "center" },
    );
    comenzar.anchor.set(0.5);
    comenzar.inputEnabled = true;
    comenzar.alpha = 0;
    comenzar.setShadow(5, 5, "rgba(0,0,0,0.5)", 15);
    ani = game.add
      .tween(comenzar)
      .to({ alpha: 1 }, 1500, "Linear", true, 0, -1);

    comenzar.events.onInputDown.add(start, this);

    drawControlsHelp();
  },
};

function start() {
  game.state.start("play");
}

/**
 * Panel grafico de controles (arriba a la derecha).
 */
function drawControlsHelp() {
  var w = 250,
    h = 120;
  var x = game.world.width - w - 16,
    y = 16;
  var g = game.add.graphics(x, y);

  // fondo
  g.beginFill(0x000000, 0.4);
  g.drawRoundedRect(0, 0, w, h, 10);
  g.endFill();

  // teclas: [ x, y, ancho, alto ]
  var keys = [
    [14, 14, 36, 36], // flecha arriba
    [58, 14, 80, 36], // space
    [14, 68, 36, 36], // flecha derecha
  ];
  keys.forEach(function (k) {
    g.beginFill(0xffffff, 1);
    g.lineStyle(2, 0x555555, 1);
    g.drawRoundedRect(k[0], k[1], k[2], k[3], 6);
    g.endFill();
  });

  // flechas dibujadas
  g.lineStyle(0);
  g.beginFill(0x1f263b, 1);
  g.drawPolygon([32, 20, 42, 34, 22, 34]); // arriba
  g.drawPolygon([44, 86, 24, 76, 24, 96]); // derecha
  g.endFill();

  var style = { font: "9px Press Start 2P", fill: "#1f263b" };
  var space = game.add.text(x + 98, y + 32, "SPACE", style);
  space.anchor.set(0.5);

  var label = { font: "11px Press Start 2P", fill: "#ffffff" };
  var salto = game.add.text(x + 148, y + 32, "SALTAR", label);
  salto.anchor.set(0, 0.5);
  salto.setShadow(2, 2, "rgba(0,0,0,0.5)", 2);
  var disp = game.add.text(x + 62, y + 86, "DISPARAR", label);
  disp.anchor.set(0, 0.5);
  disp.setShadow(2, 2, "rgba(0,0,0,0.5)", 2);
}
