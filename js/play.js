/* play.js */
var platforms;
var player;
var obstacle, obstacles;
var palo, palos;
var arriba, arribas;
var explosions;
var playersuelo;
var playerObstacle;
var boom;
var text;
var counter = 0;
var dead = false;
var block = 0;
var go;
var START_SPEED = 360; // px/s al inicio
var MAX_SPEED = 720; // px/s tope (tendencia asintotica)
var SPEED_TAU = 60; // seg: a ~60s alcanza ~63% del aumento
var START_GAP = 1.8; // seg entre obstaculos al inicio
var MIN_GAP = 1.2; // seg minimo entre obstaculos
var elapsed = 0;
var velocity = -START_SPEED;
var sprite_vel = 4;
var road_vel = -START_SPEED;
var tiempo_obstaculo = 1.8;
var suelo;
var camino;
var salto;
var nubes;
var music;
var backgroundSprite, sunSprite, moonSprite, bgBitMap;
var day = "#b2ddc8";
var night = "#1f263b";
var btn_salto, btn_up, btn_fire;
var lasers, pew, ammoText, laserBmd, fireBtn;
var muteBtn, iconOn, iconOff;
var musicMuted = false;
var ammo = 3;
var LASER_SPEED = 1400;
var canFire = true;
var ammoPickups, pickupBmd, coinSnd;
var nextPickup = 20; // seg (de juego) en que aparece la primera recarga
var PICKUP_AMMO = 2; // balas por recarga
var MAX_AMMO = 9;
var WHEEL_FPS = 14; // fps de la animacion de ruedas a velocidad inicial
var DAY_HALF_CYCLE = 30; // seg de dia->noche (y de noche->dia)

window.play = {
  create: function () {
    this.setInitialValues();
    console.log("Play!");
    game.stage.backgroundColor = day;

    sunSprite = game.add.sprite(50, 20, "sun");
    moonSprite = game.add.sprite(650, 30, "moon");
    moonSprite.alpha = 0;

    game.physics.startSystem(Phaser.Physics.ARCADE); //Arcade Physics.

    //salto
    game.input.onTap.add(onTap, this);
    btn_salto = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    btn_up = game.input.keyboard.addKey(Phaser.Keyboard.UP);

    /* Sprites fondos */

    sky = game.add.tileSprite(0, 0, game.world.width, game.world.height, "sky");
    sky.autoScroll(-100, 0);

    camino = game.add.tileSprite(
      0,
      game.world.height - 37,
      game.world.width,
      37,
      "camino",
    );
    camino.autoScroll(road_vel, 0);

    nubes = game.add.tileSprite(
      0,
      0,
      game.world.width,
      game.world.height,
      "nubes",
    );
    nubes.autoScroll(-10, 0);

    btn_fire = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    btn_fire.onDown.add(fireLaser, this);

    // textura del laser generada por codigo
    laserBmd = game.add.bitmapData(40, 6);
    laserBmd.ctx.fillStyle = "#ff2a2a";
    laserBmd.ctx.fillRect(0, 0, 40, 6);
    laserBmd.ctx.fillStyle = "#ffffff";
    laserBmd.ctx.fillRect(0, 2, 40, 2);

    // boton de disparo en pantalla (abajo a la derecha)
    var btnBmd = game.add.bitmapData(100, 100);
    btnBmd.ctx.fillStyle = "rgba(255,42,42,0.75)";
    btnBmd.ctx.beginPath();
    btnBmd.ctx.arc(50, 50, 46, 0, Math.PI * 2);
    btnBmd.ctx.fill();
    btnBmd.ctx.lineWidth = 4;
    btnBmd.ctx.strokeStyle = "#ffffff";
    btnBmd.ctx.stroke();
    fireBtn = game.add.sprite(
      game.world.width - 130,
      game.world.height - 160,
      btnBmd,
    );
    fireBtn.inputEnabled = true;
    fireBtn.events.onInputDown.add(fireLaser, this);
    var fireLabel = game.add.text(50, 50, "FIRE", {
      font: "16px Press Start 2P",
      fill: "#ffffff",
    });
    fireLabel.anchor.setTo(0.5);
    fireBtn.addChild(fireLabel);

    pickupBmd = game.add.bitmapData(44, 44);
    pickupBmd.ctx.fillStyle = "#ffd400";
    pickupBmd.ctx.beginPath();
    pickupBmd.ctx.arc(22, 22, 20, 0, Math.PI * 2);
    pickupBmd.ctx.fill();
    pickupBmd.ctx.lineWidth = 3;
    pickupBmd.ctx.strokeStyle = "#ffffff";
    pickupBmd.ctx.stroke();
    pickupBmd.ctx.fillStyle = "#ff2a2a";
    pickupBmd.ctx.fillRect(8, 19, 28, 6);
    pickupBmd.ctx.fillStyle = "#ffffff";
    pickupBmd.ctx.fillRect(8, 21, 28, 2);

    // boton de mute (arriba al centro)
    iconOn = makeSpeakerIcon(false);
    iconOff = makeSpeakerIcon(true);
    muteBtn = game.add.sprite(
      game.world.centerX - 24,
      12,
      musicMuted ? iconOff : iconOn,
    );
    muteBtn.inputEnabled = true;
    muteBtn.input.useHandCursor = true;
    muteBtn.events.onInputDown.add(function () {
      musicMuted = !musicMuted;
      music.mute = musicMuted;
      muteBtn.loadTexture(musicMuted ? iconOff : iconOn);
    }, this);

    //sonidos
    coinSnd = game.add.audio("coin");
    pew = game.add.audio("pew");
    boom = game.add.audio("boom");
    salto = game.add.audio("jump");
    music = game.add.audio("music");

    //musica de fondo
    music.play("", 0, 1, true);
    music.mute = musicMuted;

    /* Platform group */
    platforms = game.add.group();
    platforms.enableBody = true;

    /* Obstacle group */
    obstacles = game.add.group();
    arribas = game.add.group();
    palos = game.add.group();

    lasers = game.add.group();
    ammoPickups = game.add.group();
    ammo = 3;
    canFire = true;

    explosions = game.add.group();
    explosions.createMultiple(30, "kaboom");
    explosions.forEach(setupExplosiones, this);

    //obstacles.body.debug = true;

    /* suelo stuff */
    suelo = platforms.create(0, game.world.height - 37, "suelo");

    suelo.body.immovable = true;

    /* Player stuff */
    player = game.add.sprite(32, 600, "player");
    //player.flipX = true;
    //player = game.add.sprite(80, 670, 'player');
    player.scale.setTo(1, 1);

    game.physics.arcade.enable(player);

    player.body.enable = true;
    // hitbox mas corta: el sprite queda 10px mas abajo, hundido en el camino
    player.body.setSize(204, 77, 0, 0);
    player.body.gravity.y = 250;
    player.body.collideWorldBounds = true;
    player.animations.add("walk");
    player.animations.play("walk", WHEEL_FPS, true);

    /* Score */
    //scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000'});

    //contador
    text = game.add.text(game.world.width - 107, 28, "Puntos: 0", {
      font: "17px Press Start 2P",
      fill: "#ffffff",
      align: "center",
    });
    text.anchor.setTo(0.5, 0.5);
    text.inputEnabled = true;
    text.setShadow(5, 5, "rgba(0,0,0,0.5)", 15);
    text.events.onInputDown.add(gofull, this);

    ammoText = game.add.text(20, 28, "Balas: " + ammo, {
      font: "17px Press Start 2P",
      fill: "#ffffff",
    });
    ammoText.anchor.setTo(0, 0.5);
    ammoText.setShadow(5, 5, "rgba(0,0,0,0.5)", 15);

    game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);

    //game over
    go = game.add.text(game.world.centerX, game.world.centerY, "Game Over", {
      font: "65px Press Start 2P",
      fill: "#ffffff",
      align: "center",
    });

    // text.tint = 0xff00033;
    go.anchor.set(0.5);
    go.setShadow(5, 5, "rgba(0,0,0,0.5)", 15);
    go.inputEnabled = true;
    go.events.onInputDown.add(down, this);
    go.visible = false;

    //creo el primer obtaculo
    /*
		setTimeout(function () {
			addObstacle();
		}, 3000);
		*/

    this.generarObstaculos = game.time.events.loop(
      Phaser.Timer.SECOND * this.tiempo,
      this.generarObstaculos,
      this,
    );
    this.generarObstaculos.timer.start();
  },

  update: function () {
    // Dificultad basada en tiempo (no en frames) y con curva suave que se
    // estabiliza: la velocidad sube rapido al inicio y tiende a MAX_SPEED.
    if (!dead) {
      elapsed += game.time.physicsElapsed;
      var k = 1 - Math.exp(-elapsed / SPEED_TAU);
      var speed = START_SPEED + (MAX_SPEED - START_SPEED) * k;
      velocity = -speed;
      road_vel = -speed; // el camino va a la misma velocidad que los obstaculos
      sprite_vel = 4 + 4 * k;
      updateDayNight();
      // la animacion de ruedas sigue la velocidad (evita el efecto "hacia atras")
      if (player.animations.currentAnim) {
        player.animations.currentAnim.speed = WHEEL_FPS * (speed / START_SPEED);
      }
      // intervalo entre obstaculos: baja suave hasta un minimo (en ms)
      this.generarObstaculos.delay =
        (START_GAP - (START_GAP - MIN_GAP) * k) * 1000;
    } else {
      velocity = 0;
      road_vel = 0;
    }
    // los obstaculos ya creados siguen la velocidad actual (sin desfase)
    obstacles.forEachAlive(function (o) {
      o.body.velocity.x = velocity;
    });
    arribas.forEachAlive(function (o) {
      o.body.velocity.x = velocity;
    });
    palos.forEachAlive(function (o) {
      o.body.velocity.x = velocity;
    });
    ammoPickups.forEachAlive(function (o) {
      o.body.velocity.x = velocity;
    });
    if (!dead && elapsed >= nextPickup) {
      spawnAmmoPickup();
    }
    game.physics.arcade.overlap(player, ammoPickups, collectAmmo, null, this);
    /*
		sky.tilePosition.x -= 2;
		camino.tilePosition.x -= road_vel;
		nubes.tilePosition.x -= 1;
		*/
    //colision con los bloques

    game.physics.arcade.collide(player, arribas, collisionPlayer, null, this);
    game.physics.arcade.collide(player, obstacles, collisionPlayer, null, this);
    playersuelo = game.physics.arcade.collide(player, platforms);

    game.physics.arcade.overlap(lasers, obstacles, laserHit, null, this);
    game.physics.arcade.overlap(lasers, arribas, laserHit, null, this);

    //si salto con el boton
    if (btn_salto.isDown || btn_up.isDown) {
      onTap();
    }

    if (!dead) {
      camino.autoScroll(road_vel, 0);
    }
  },
  generarObstaculos: function () {
    //console.log('generating pipes!');
    addObstacle();
  },

  setInitialValues: function () {
    this.tiempo = START_GAP;
    elapsed = 0;
    nextPickup = 20;
    velocity = -START_SPEED;
    road_vel = -START_SPEED;
  },

  render: function () {
    /*
		 game.debug.text("Time until event: " + game.time.events.duration.toFixed(0), 32, 32);
    	 game.debug.text("Next tick: " + game.time.events.next.toFixed(0), 32, 64);
		*/
  },
};

/**
 * @desc Interact with player.
 */

function collisionPlayer(player, obtacle) {
  //When a bullet hits an alien we kill them both
  obtacle.kill();
  player.kill();
  boom.play();

  var explosion = explosions.getFirstExists(false);
  explosion.reset(player.body.x + 150, player.body.y);
  explosion.play("kaboom", 30, false, true);

  dead = true;
  music.stop();
  sky.stopScroll();
  nubes.stopScroll();
  camino.stopScroll();
}

function makeSpeakerIcon(muted) {
  var b = game.add.bitmapData(48, 48);
  var c = b.ctx;
  c.fillStyle = "rgba(0,0,0,0.35)";
  c.fillRect(0, 0, 48, 48);
  c.fillStyle = "#ffffff";
  c.strokeStyle = "#ffffff";
  c.lineWidth = 3;
  c.lineCap = "round";
  c.beginPath();
  c.moveTo(8, 18);
  c.lineTo(16, 18);
  c.lineTo(26, 9);
  c.lineTo(26, 39);
  c.lineTo(16, 30);
  c.lineTo(8, 30);
  c.closePath();
  c.fill();
  if (muted) {
    c.strokeStyle = "#ff4040";
    c.beginPath();
    c.moveTo(32, 18);
    c.lineTo(44, 30);
    c.moveTo(44, 18);
    c.lineTo(32, 30);
    c.stroke();
  } else {
    c.beginPath();
    c.arc(26, 24, 8, -Math.PI / 3, Math.PI / 3);
    c.stroke();
    c.beginPath();
    c.arc(26, 24, 14, -Math.PI / 3, Math.PI / 3);
    c.stroke();
  }
  return b;
}

// Ciclo dia/noche lineal: dia -> noche -> dia (onda triangular)
function updateDayNight() {
  var phase = (elapsed % (2 * DAY_HALF_CYCLE)) / DAY_HALF_CYCLE; // 0..2
  var t = phase <= 1 ? phase : 2 - phase; // 0 = dia, 1 = noche
  game.stage.backgroundColor = Phaser.Color.interpolateColor(
    0xb2ddc8,
    0x1f263b,
    100,
    Math.round(t * 100),
  );
  sunSprite.alpha = 1 - t;
  moonSprite.alpha = t;
}

function fireLaser() {
  if (dead || !canFire || ammo <= 0 || !player.alive) return;
  ammo--;
  ammoText.setText("Balas: " + ammo);
  pew.play();
  var l = lasers.create(
    player.x + player.width,
    player.y + player.height * 0.78,
    laserBmd,
  );
  game.physics.arcade.enable(l);
  l.body.allowGravity = false;
  l.body.velocity.x = LASER_SPEED;
  l.outOfBoundsKill = true;
  l.checkWorldBounds = true;
}

function spawnAmmoPickup() {
  // no aparece si hay un obstaculo recien creado cerca del borde derecho
  var busy = false;
  [obstacles, arribas].forEach(function (g) {
    g.forEachAlive(function (o) {
      if (o.x > game.world.width - 400) busy = true;
    });
  });
  if (busy) return; // reintenta el siguiente frame
  // a la altura de los "arribas": hay que saltar para tomarla
  var pk = ammoPickups.create(
    game.world.width,
    game.world.height - 215,
    pickupBmd,
  );
  game.physics.arcade.enable(pk);
  pk.body.allowGravity = false;
  pk.body.velocity.x = velocity;
  pk.outOfBoundsKill = true;
  pk.checkWorldBounds = true;
  nextPickup = elapsed + 12 + Math.random() * 6;
}

function collectAmmo(pl, pk) {
  pk.kill();
  ammo = Math.min(MAX_AMMO, ammo + PICKUP_AMMO);
  ammoText.setText("Balas: " + ammo);
  coinSnd.play();
}

function laserHit(laser, target) {
  laser.kill();
  if (target.palo) target.palo.kill();
  var ex = explosions.getFirstExists(false);
  if (ex) {
    ex.reset(target.x + target.width / 2, target.y + target.height / 2);
    ex.play("kaboom", 30, false, true);
  }
  target.kill();
  boom.play();
}

function setupExplosiones(obstacle) {
  obstacle.anchor.x = 0.5;
  obstacle.anchor.y = 0.5;
  obstacle.animations.add("kaboom");
}

/**
 * @desc OnTap event.
 * @param {pointer} pointer
 * @param {bool} doubleTap
 */
function onTap(pointer, doubleTap) {
  // un toque sobre el boton de disparo no debe hacer saltar
  if (
    pointer &&
    fireBtn &&
    fireBtn.getBounds().contains(pointer.x, pointer.y)
  ) {
    return;
  }
  if (
    pointer &&
    muteBtn &&
    muteBtn.getBounds().contains(pointer.x, pointer.y)
  ) {
    return;
  }
  if (playersuelo) {
    //player.animations.play('jump', 29.5);
    player.body.velocity.y -= 190;
    salto.play();
    if (block > 0) {
      //addObstacle();
    }
  }
}

/**
 * @desc Add obstacle.
 */
function addObstacle() {
  var rnd = Math.floor(Math.random() * 5) + 1;
  if (rnd == 3) {
    addPoste();
  } else {
    addPiedra();
  }
}

function addPiedra() {
  var obstacle = game.add.sprite(
    game.world.width,
    game.world.height - 74,
    "obstacle",
    false,
  );
  obstacles.add(obstacle);
  game.physics.arcade.enable(obstacle);

  obstacle.body.velocity.x = velocity;

  //obstacle.checkWorldBounds = true;
  obstacle.body.collideWorldBounds = false;

  obstacle.body.checkCollision.up = false;
  //obstacle.checkCollision.right = false;
  obstacle.outOfBoundsKill = true;
}

function addPoste() {
  var arriba = game.add.sprite(
    game.world.width,
    game.world.height - 260,
    "arriba",
    true,
  );
  var palo = game.add.sprite(
    game.world.width,
    game.world.height - 235,
    "palo",
    true,
  );
  arriba.palo = palo;
  arribas.add(arriba);
  palos.add(palo);

  game.physics.arcade.enable(arriba, true);
  arriba.body.velocity.x = velocity;
  arriba.body.setSize(118, 75, 50, 30);
  arriba.body.collideWorldBounds = false;

  game.physics.arcade.enable(palo, true);
  palo.body.velocity.x = velocity;
}

function updateCounter() {
  if (!dead) {
    counter++;
    text.setText("Puntos: " + counter);
  } else {
    go.visible = true;
  }
}

function down(item) {
  //aca se resetea el juego

  item.visible = false;
  counter = 0;
  game.state.restart();
  dead = false;
  sprite_vel = 4;
  elapsed = 0;
  velocity = -START_SPEED;
  road_vel = -START_SPEED;
  music.pause();
  game.state.start("menu");
}

function borra_obstculo(obs) {
  // kill obstacle after it moves out of bounds
  if (obs.right < game.world.bounds.left) {
    obs.kill();
  }
}

function gofull() {
  game.scale.startFullScreen();
}
