import 'phaser';

var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    pixelArt: true,
    backgroundColor: '#000000',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var light;
var offsets = [];
var player;
var layer;
var cursors;

var game = new Phaser.Game(config);

function preload() {
    this.load.image('tiles', ['assets/tilemaps/tiles/drawtiles1.png', 'assets/tilemaps/tiles/drawtiles1_n.png']);
    this.load.image('car', 'assets/sprites/car90.png');
    this.load.tilemapCSV('map', 'assets/tilemaps/csv/grid.csv');
    this.load.audio('boden', 'assets/audio/atmosfera.mp3');    
    // this.load.image('enemy', "assets/sprites/enemy.png");
}

function create() {
    let audio = this.sound.add('boden', { loop: true });
    var map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });

    var tileset = map.addTilesetImage('tiles', null, 32, 32, 1, 2);

    layer = map.createLayer(0, tileset, 0, 0).setPipeline('Light2D');

    player = this.add.image(32 + 16, 32 + 16, 'car');
   
    this.anims.create({
        key: 'turn',
        frames: [{ key: 'enemy', frame: 2 }],
        frameRate: 20
    });
    // player.setScale(0.1);

    cursors = this.input.keyboard.createCursorKeys();

    light = this.lights.addLight(0, 0, 200).setScrollFactor(0.0);

    this.lights.enable().setAmbientColor(0x555555);

    this.input.on('pointermove', function (pointer) {

        light.x = pointer.x;
        light.y = pointer.y;

    });

    this.lights.addLight(0, 100, 100).setColor(0xff0000).setIntensity(3.0);
    this.lights.addLight(0, 200, 100).setColor(0x00ff00).setIntensity(3.0);
    this.lights.addLight(0, 300, 100).setColor(0x0000ff).setIntensity(3.0);
    this.lights.addLight(0, 400, 100).setColor(0xffff00).setIntensity(3.0);

    offsets = [0.1, 0.3, 0.5, 0.7];
    audio.play();
}

function update() {
    if (this.input.keyboard.checkDown(cursors.left, 100)) {
        var tile = layer.getTileAtWorldXY(player.x - 32, player.y, true);

        if (tile.index === 2) {
            //  Blocked, we can't move
        } else {
            player.x -= 32;
            player.angle = 180;
        }
    } else if (this.input.keyboard.checkDown(cursors.right, 100)) {
        var tile = layer.getTileAtWorldXY(player.x + 32, player.y, true);

        if (tile.index === 2) {
            //  Blocked, we can't move
        } else {
            player.x += 32;
            player.angle = 0;
        }
    } else if (this.input.keyboard.checkDown(cursors.up, 100)) {
        var tile = layer.getTileAtWorldXY(player.x, player.y - 32, true);

        if (tile.index === 2) {
            //  Blocked, we can't move
        } else {
            player.y -= 32;
            player.angle = -90;
        }
    } else if (this.input.keyboard.checkDown(cursors.down, 100)) {
        var tile = layer.getTileAtWorldXY(player.x, player.y + 32, true);

        if (tile.index === 2) {
            //  Blocked, we can't move
        } else {
            player.y += 32;
            player.angle = 90;
        }
    }

    light.x = player.x;
    light.y = player.y;

    var index = 0;

    this.lights.lights.forEach(function(currLight) {
        if (light !== currLight) {
            currLight.x = 400 + Math.sin(offsets[index]) * 1000;
            offsets[index] += 0.02;
            index += 1;
        }
    });
}